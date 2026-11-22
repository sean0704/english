// 段考特訓：畫面層。由 script.js 的 startGame 呼叫 TrainerMode.start(bridge, listInfo)。
(function () {
    const C = window.TrainerCore;
    const G = window.TrainerGrading;
    const LETTERS = 'ABCD';

    let bridge = null;
    let core = null;
    let root = null;
    let unitKey = '';
    let view = '';          // hub / concept / session / exam / examReport / report
    let session = null;
    let examTimer = null;
    let examSaveTimer = null;
    let startToken = 0;
    let nextReadyAt = 0;
    let keyHandler = null;

    // ---------- 小工具 ----------
    function h(tag, cls, text, attrs) {
        const node = document.createElement(tag);
        if (cls) node.className = cls;
        if (text !== undefined && text !== null) node.textContent = text;
        if (attrs) for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
        return node;
    }
    function button(text, cls, onClick) {
        const b = h('button', `dialog-button ${cls || ''}`.trim(), text, { type: 'button' });
        b.addEventListener('click', onClick);
        return b;
    }
    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
        return arr;
    }
    function seededShuffle(arr, seedText) {
        let seed = 2166136261;
        for (let i = 0; i < seedText.length; i++) { seed ^= seedText.charCodeAt(i); seed = Math.imul(seed, 16777619) >>> 0; }
        const rand = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
        for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
        return arr;
    }
    function percent(rate) { return `${Math.round(rate * 100)}%`; }
    function clearRoot() { stopReading(); root.innerHTML = ''; window.scrollTo(0, 0); }
    function setView(name) { view = name; root.dataset.view = name; }
    function textInput(extraClass) {
        const input = h('input', `trainer-input ${extraClass || ''}`.trim(), null, { type: 'text', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', lang: 'en' });
        // 輸入法選字中的 Enter 不送出
        input.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.isComposing || e.keyCode === 229)) e.preventDefault(); });
        return input;
    }
    // 只允許 <u> 標記，其餘一律當純文字
    function appendMarked(parent, text) {
        String(text).split(/(<u>.*?<\/u>)/g).forEach(part => {
            const m = part.match(/^<u>(.*)<\/u>$/);
            if (m) parent.appendChild(h('u', 'trainer-underline', m[1]));
            else if (part) parent.appendChild(document.createTextNode(part));
        });
    }
    function copyText(text) {
        const fallback = () => {
            const ta = h('textarea', 'trainer-copy-buffer');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            let ok = false;
            try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
            ta.remove();
            return ok;
        };
        if (!(navigator.clipboard && window.isSecureContext)) return Promise.resolve(fallback());
        // 瀏覽器若遲遲不回應（例如跳出權限詢問），1.5 秒後改用備用方式
        const timeout = new Promise(resolve => setTimeout(() => resolve('timeout'), 1500));
        return Promise.race([navigator.clipboard.writeText(text).then(() => true, () => false), timeout]).then(result => (result === true ? true : fallback()));
    }

    // ---------- 題目元件 ----------
    // 回傳 { el, item, getAnswer, setAnswer, focus, lock, onChange, showResult, needsCorrection, checkCorrection }
    function buildWidget(item, opts) {
        const format = C.FORMAT_BY_ID[item.format];
        const wrap = h('div', `trainer-item kind-${format.kind} format-${item.format}`);
        wrap.dataset.id = item.id;
        const listeners = [];
        const changed = () => listeners.forEach(fn => fn());
        const head = h('div', 'trainer-item-head');
        if (opts.number) head.appendChild(h('span', 'trainer-item-number', `${opts.number}.`));
        if (opts.showFormat) head.appendChild(h('span', 'trainer-tag', format.label));
        if (head.childNodes.length) wrap.appendChild(head);
        const body = h('div', 'trainer-item-body');
        wrap.appendChild(body);
        const feedback = h('div', 'trainer-feedback', null, { role: 'status', 'aria-live': 'polite' });
        feedback.hidden = true;

        const api = { el: wrap, item, onChange: fn => listeners.push(fn), needsCorrection: false };

        if (format.kind === 'choice') {
            let selected = '';
            if (item.format === 'cloze') body.appendChild(h('p', 'trainer-prompt', `第 ${item.slot} 格`));
            else if (item.format === 'dialogue') {
                const box = h('div', 'trainer-dialogue');
                item.prompt.split('\n').forEach(line => {
                    const m = line.match(/^([A-Za-z.' ]{1,12}):\s*(.*)$/);
                    const row = h('p', 'trainer-dialogue-line');
                    if (m) { row.appendChild(h('span', 'trainer-speaker', m[1] + ':')); row.appendChild(document.createTextNode(' ' + m[2])); }
                    else row.textContent = line;
                    box.appendChild(row);
                });
                body.appendChild(box);
            } else body.appendChild(h('p', 'trainer-prompt', item.prompt));

            // 練習時每次打亂；考試時用固定種子打亂（重新整理續考時順序不變）
            const order = opts.mock ? seededShuffle(item.options.slice(), `${item.id}:${opts.seed || 0}`) : shuffle(item.options.slice());
            const list = h('div', 'trainer-options', null, { role: 'group' });
            const buttons = order.map((option, i) => {
                const b = h('button', 'trainer-option', null, { type: 'button', 'aria-pressed': 'false' });
                b.appendChild(h('span', 'trainer-option-letter', `(${LETTERS[i]})`));
                b.appendChild(h('span', 'trainer-option-text', option));
                b.addEventListener('click', () => api.pick(option));
                list.appendChild(b);
                return { option, b };
            });
            body.appendChild(list);
            // 克漏字改在文章的空格上作答：作答時先藏起這一題，檢查答案後才顯示對錯與詳解。
            // slotHooks 由 renderPassage 接上，讓空格跟著答案、鎖定與批改結果更新。
            if (opts.inline) wrap.hidden = true;
            api.options = order;
            api.number = opts.mock ? opts.number : 0;
            api.slotHooks = null;
            api.pick = option => { api.setAnswer(option); changed(); if (opts.onPick) opts.onPick(); };
            api.getAnswer = () => selected;
            api.setAnswer = value => {
                selected = value || '';
                buttons.forEach(({ option, b }) => { const on = option === selected; b.classList.toggle('selected', on); b.setAttribute('aria-pressed', String(on)); });
                if (api.slotHooks) api.slotHooks.sync();
            };
            api.pickIndex = i => { if (buttons[i] && !buttons[i].b.disabled) buttons[i].b.click(); };
            api.focus = () => { if (api.slotHooks) api.slotHooks.focus(); else buttons[0].b.focus({ preventScroll: true }); };
            api.lock = () => {
                buttons.forEach(({ b }) => { b.disabled = true; });
                if (api.slotHooks) { wrap.hidden = false; api.slotHooks.lock(); }
            };
            api.mark = () => {
                buttons.forEach(({ option, b }) => {
                    if (option === item.answer) b.classList.add('is-correct');
                    else if (option === selected) b.classList.add('is-wrong');
                });
                if (api.slotHooks) api.slotHooks.mark(selected === item.answer);
            };
        } else if (format.kind === 'blanks') {
            if (item.zh) body.appendChild(h('p', 'trainer-zh', item.zh));
            if (item.cue) body.appendChild(h('p', 'trainer-cue', item.cue));
            const line = h('p', 'trainer-prompt trainer-blank-line');
            const inputs = [];
            item.prompt.split(/(\{\{\d+\}\})/g).forEach(part => {
                const m = part.match(/^\{\{(\d+)\}\}$/);
                if (!m) { if (part) line.appendChild(document.createTextNode(part)); return; }
                const blank = item.blanks[Number(m[1]) - 1];
                const input = textInput('trainer-blank');
                const sample = G.expandTemplate(blank.answer)[0];
                input.style.width = `${Math.max(5, Math.min(18, sample.length + 4))}ch`;
                if (item.format === 'vocab') input.placeholder = `${blank.lead}${'_'.repeat(Math.max(2, sample.length - blank.lead.length - blank.tail.length))}${blank.tail}`;
                input.setAttribute('aria-label', `第 ${m[1]} 個空格`);
                input.addEventListener('input', changed);
                inputs.push(input);
                line.appendChild(input);
            });
            body.appendChild(line);
            if (item.format === 'vocab') body.appendChild(h('p', 'trainer-note', '依句意寫出完整的單字（首尾字母已提示，注意字形變化）。'));
            api.getAnswer = () => inputs.map(i => i.value);
            api.setAnswer = value => { (Array.isArray(value) ? value : []).forEach((v, i) => { if (inputs[i]) inputs[i].value = v || ''; }); };
            api.focus = () => { const target = inputs.find(i => !i.disabled && !i.value) || inputs.find(i => !i.disabled); if (target) target.focus({ preventScroll: true }); };
            api.lock = () => inputs.forEach(i => { i.disabled = true; });
            api.inputs = inputs;
            api.mark = result => inputs.forEach((input, i) => input.classList.add(result.parts[i].ok ? 'is-correct' : 'is-wrong'));
            // 訂正：把錯的空格清空，重填到對為止
            api.startCorrection = result => {
                api.needsCorrection = true;
                inputs.forEach((input, i) => {
                    if (result.parts[i].ok) return;
                    input.disabled = false; input.value = ''; input.classList.remove('is-wrong'); input.classList.add('is-retry');
                    input.addEventListener('paste', e => e.preventDefault());
                    input.addEventListener('drop', e => e.preventDefault());
                });
            };
            api.checkCorrection = () => {
                let allOk = true;
                inputs.forEach((input, i) => {
                    if (!input.classList.contains('is-retry')) return;
                    if (G.gradeBlank(input.value, item.blanks[i].answer).ok) { input.classList.remove('is-retry'); input.classList.add('is-correct'); input.disabled = true; }
                    else { allOk = false; input.classList.add('shake'); setTimeout(() => input.classList.remove('shake'), 400); }
                });
                if (allOk) api.needsCorrection = false;
                return allOk;
            };
        } else {
            if (item.format === 'rewrite') {
                const p = h('p', 'trainer-prompt');
                appendMarked(p, item.prompt);
                body.appendChild(p);
                body.appendChild(h('p', 'trainer-cue', item.cue));
            } else if (item.format === 'order') {
                if (item.zh) body.appendChild(h('p', 'trainer-zh', item.zh));
                const tiles = h('p', 'trainer-tiles');
                item.tiles.forEach((tile, i) => {
                    if (i) tiles.appendChild(h('span', 'trainer-tile-sep', '/'));
                    tiles.appendChild(h('span', 'trainer-tile', tile));
                });
                body.appendChild(tiles);
                body.appendChild(h('p', 'trainer-cue', '把上面的字塊排成正確的句子，打出完整句子（含大小寫與標點）。'));
            } else {
                body.appendChild(h('p', 'trainer-zh', item.zh));
                if (item.cue) body.appendChild(h('p', 'trainer-cue', item.cue));
            }
            const input = textInput('trainer-sentence');
            input.placeholder = '請輸入完整的英文句子';
            input.setAttribute('aria-label', '作答');
            input.addEventListener('input', changed);
            body.appendChild(input);
            api.getAnswer = () => input.value;
            api.setAnswer = value => { input.value = typeof value === 'string' ? value : ''; };
            api.focus = () => input.focus({ preventScroll: true });
            api.lock = () => { input.disabled = true; };
            api.inputs = [input];
            api.mark = result => input.classList.add(result.verdict === 'wrong' || result.verdict === 'blank' ? 'is-wrong' : 'is-correct');
            api.startCorrection = result => {
                api.needsCorrection = true;
                const target = result.sentence ? result.sentence.best : core.correctText(item);
                const retry = textInput('trainer-sentence is-retry');
                retry.placeholder = '照上面的正確句子重打一次';
                retry.setAttribute('aria-label', '重打正確句子');
                retry.addEventListener('paste', e => e.preventDefault());
                retry.addEventListener('drop', e => e.preventDefault());
                const box = h('div', 'trainer-retry');
                box.appendChild(h('p', 'trainer-retry-label', '✍️ 照正確句子重打一次，才能到下一題：'));
                box.appendChild(retry);
                feedback.appendChild(box);
                api.retryInput = retry;
                api.retryTarget = target;
            };
            // 孩子申訴後改判為答對：不用重打訂正，輸入框改成答對的樣子
            api.acceptAsCorrect = () => {
                api.needsCorrection = false;
                if (api.retryInput) { api.retryInput.closest('.trainer-retry').remove(); api.retryInput = null; }
                input.classList.remove('is-wrong');
                input.classList.add('is-correct');
            };
            api.checkCorrection = () => {
                const ok = G.gradeSentence(api.retryInput.value, item.answers).verdict !== 'wrong';
                if (ok) { api.retryInput.disabled = true; api.retryInput.classList.remove('is-retry'); api.retryInput.classList.add('is-correct'); api.needsCorrection = false; }
                else { api.retryInput.classList.add('shake'); setTimeout(() => api.retryInput.classList.remove('shake'), 400); }
                return ok;
            };
        }

        wrap.appendChild(feedback);
        api.feedbackEl = feedback;
        return api;
    }

    function renderDiff(result) {
        const box = h('div', 'trainer-diff');
        const s = result.sentence;
        if (s.orderOnly) box.appendChild(h('p', 'trainer-diff-note', '用的字都對，但順序錯了。'));
        const line = h('p', 'trainer-diff-line');
        line.appendChild(h('span', 'trainer-diff-label', '你的句子：'));
        s.diff.forEach(op => {
            if (op.type === 'same') line.appendChild(h('span', 'diff-same', op.given));
            else if (op.type === 'replace') {
                line.appendChild(h('span', 'diff-del', op.given));
                line.appendChild(h('span', 'diff-ins', op.expected));
                line.appendChild(h('span', 'diff-tag', op.spelling ? '拼錯' : '用錯字'));
            } else if (op.type === 'missing') { line.appendChild(h('span', 'diff-ins', op.expected)); line.appendChild(h('span', 'diff-tag', '漏了')); }
            else { line.appendChild(h('span', 'diff-del', op.given)); line.appendChild(h('span', 'diff-tag', '多了')); }
            line.appendChild(document.createTextNode(' '));
        });
        box.appendChild(line);
        return box;
    }

    // 作答後的回饋：對錯、正解、差異、詳解
    function fillFeedback(widget, result, opts = {}) {
        const item = widget.item;
        const fb = widget.feedbackEl;
        fb.innerHTML = '';
        fb.hidden = false;
        const kind = C.FORMAT_BY_ID[item.format].kind;
        const right = result.verdict === 'ok' || result.verdict === 'careless';
        fb.className = `trainer-feedback verdict-${result.verdict}`;
        const title = { ok: '✅ 答對了！', careless: '⚠️ 文法對了，但有粗心錯誤（考試會被扣分）', wrong: '❌ 答錯了', blank: '❌ 沒有作答' }[result.verdict];
        fb.appendChild(h('p', 'trainer-verdict', title));
        if (result.verdict === 'careless') {
            const ul = h('ul', 'trainer-careless');
            result.notes.forEach(n => ul.appendChild(h('li', '', n)));
            fb.appendChild(ul);
        }
        if (!right && kind === 'sentence' && result.sentence && result.sentence.diff && result.verdict !== 'blank') fb.appendChild(renderDiff(result));
        if (!right && kind === 'blanks' && result.parts) {
            result.parts.forEach((p, i) => {
                if (p.ok) return;
                const extra = p.frameMismatch ? '（和提示的首尾字母不符）' : p.near ? '（很接近了，注意拼字）' : '';
                fb.appendChild(h('p', 'trainer-part', `第 ${i + 1} 格：你寫「${p.given || '（空）'}」${extra}`));
            });
        }
        if (!right || result.verdict === 'careless' || opts.alwaysAnswer) {
            const ans = h('p', 'trainer-answer');
            ans.appendChild(h('span', 'trainer-answer-label', '正確答案：'));
            ans.appendChild(h('strong', '', kind === 'sentence' && result.sentence && result.sentence.best ? result.sentence.best : core.correctText(item)));
            fb.appendChild(ans);
            const alts = core.altAnswers(item, 3).filter(a => !result.sentence || a !== result.sentence.best);
            if (alts.length) fb.appendChild(h('p', 'trainer-alt', '也可以寫：' + alts.join('　／　')));
        }
        const explain = h('div', 'trainer-explain');
        explain.appendChild(h('span', 'trainer-explain-label', '詳解'));
        explain.appendChild(h('p', '', item.explain));
        fb.appendChild(explain);
    }

    // ---------- 提示（文法點第 2、3 階） ----------
    // 回傳這一題可以給的提示，最多兩段：先給文法規則讓孩子自己想，再給答案的開頭
    function hintStepsFor(item) {
        const steps = [];
        const unit = core.data.units[unitKey];
        const concept = unit && unit.concepts.find(c => c.point === item.point);
        const rules = concept ? concept.blocks.filter(b => b.type === 'rule').map(b => b.text) : [];
        if (rules.length) steps.push({ title: `💡 文法提醒｜${core.pointLabel(item.point)}`, lines: rules });

        const mask = word => word[0] + '_'.repeat(Math.max(0, word.length - 1));
        if (Array.isArray(item.blanks)) {
            // 填空題：每一格給第一個字母，底線數代表還有幾個字母
            const lines = item.blanks.map((blank, i) => {
                const sample = G.expandTemplate(blank.answer)[0];
                return `${item.blanks.length > 1 ? `第 ${i + 1} 格：` : ''}${sample.split(/\s+/).map(mask).join('　')}`;
            });
            steps.push({ title: '✏️ 每一格的開頭（一個底線是一個字母）', lines, mono: true });
        } else if (Array.isArray(item.answers)) {
            // 整句題：給開頭的字與總字數
            const words = G.expandTemplate(item.answers[0])[0].split(/\s+/);
            const lead = words.slice(0, words.length > 3 ? 2 : 1).join(' ');
            steps.push({ title: '✏️ 句子的開頭', lines: [`${lead} …（整句共 ${words.length} 個字）`], mono: true });
        }
        return steps;
    }

    // 提示按鈕與提示框。回傳 { button, box, used(), lock() }
    function buildHint(item) {
        const steps = hintStepsFor(item);
        let shown = 0;
        const box = h('div', 'trainer-hint', null, { role: 'status', 'aria-live': 'polite' });
        box.hidden = true;
        const btn = h('button', 'dialog-button secondary trainer-hint-btn', '', { type: 'button' });
        const render = () => {
            btn.textContent = shown === 0 ? '💡 提示' : shown < steps.length ? '💡 再給我一點提示' : '💡 提示都給你了';
            btn.disabled = shown >= steps.length;
        };
        btn.addEventListener('click', () => {
            if (shown >= steps.length) return;
            const step = steps[shown++];
            const part = h('div', 'trainer-hint-step');
            part.appendChild(h('p', 'trainer-hint-title', step.title));
            step.lines.forEach(line => part.appendChild(h('p', `trainer-hint-line${step.mono ? ' mono' : ''}`, line)));
            box.appendChild(part);
            box.hidden = false;
            render();
            // 看完提示回到作答的地方
            const w = session && session.current && session.current.single;
            if (w) w.focus();
        });
        render();
        return { button: btn, box, used: () => shown, lock: () => { btn.hidden = true; }, available: steps.length > 0 };
    }

    // ---------- 朗讀文章（閱讀測驗練聽力） ----------
    const synth = window.speechSynthesis || null;
    const READ_RATE_KEY = 'englishTrainer_readRate';
    const READ_RATES = [{ id: 'normal', label: '正常', rate: 0.9 }, { id: 'slow', label: '慢速', rate: 0.7 }];
    let activeReader = null; // 同一時間只唸一篇

    function stopReading() { if (activeReader) activeReader.stop(); }
    // 重新整理或關閉頁面時，瀏覽器可能把還沒唸完的句子繼續唸下去
    if (synth) window.addEventListener('pagehide', () => { if (activeReader) synth.cancel(); });

    // 把一行文字切成句子（保留原本的空白，接回去和原文一樣）
    function splitSentences(text) {
        const parts = text.match(/[^.!?]+(?:[.!?]+["'”’)）]*|$)\s*/g) || [text];
        const out = [];
        parts.forEach(part => {
            const prev = out[out.length - 1];
            // Mr. / Mrs. 這類縮寫、小數點、句點後接小寫，都不是句子結尾
            const glue = prev !== undefined && (/\b(Mr|Mrs|Ms|Dr|St|Jr)\.\s*$/.test(prev) || /^[a-z]/.test(part) || (/\d\.$/.test(prev) && /^\d/.test(part)));
            if (glue) out[out.length - 1] = prev + part;
            else out.push(part);
        });
        return out.filter(s => s.trim());
    }

    // 要唸出來的文字：拿掉中文註解（例如「earthquake（地震）」）與括號
    function speechText(sentence) {
        return sentence.replace(/（[^）]*）/g, ' ').replace(/[()]/g, ' ').replace(/[　-鿿＀-￯]+/g, ' ').replace(/\s+/g, ' ').trim();
    }

    // sentences：[{ span, text }]。逐句唸，才能標示正在唸的句子，暫停後也能從同一句接著唸。
    function buildReader(sentences) {
        let index = 0;
        let state = 'idle'; // idle → playing ⇄ paused
        let token = 0;      // 每次重新開始或中斷就加一，讓舊的語音回呼失效
        let watchdog = null;
        let utterance = null; // 留著參照，避免 Chrome 在唸完前把它回收
        let rateId = bridge.readStorage(READ_RATE_KEY) === 'slow' ? 'slow' : 'normal';

        const bar = h('div', 'trainer-reader', null, { role: 'group', 'aria-label': '朗讀文章' });
        const playBtn = h('button', 'dialog-button secondary trainer-reader-btn', '', { type: 'button' });
        const stopBtn = h('button', 'dialog-button secondary trainer-reader-btn', '⏹ 停止', { type: 'button' });
        const speed = h('div', 'trainer-reader-speed', null, { role: 'group', 'aria-label': '語速' });
        speed.appendChild(h('span', 'trainer-reader-label', '語速'));
        const rateBtns = READ_RATES.map(r => {
            const b = h('button', 'trainer-reader-rate', r.label, { type: 'button' });
            b.addEventListener('click', () => setRate(r.id));
            speed.appendChild(b);
            return { id: r.id, b };
        });
        bar.appendChild(playBtn);
        bar.appendChild(stopBtn);
        bar.appendChild(speed);

        function render() {
            playBtn.textContent = state === 'playing' ? '⏸ 暫停' : state === 'paused' ? '▶ 繼續' : '🔊 唸出文章';
            stopBtn.hidden = state === 'idle';
            rateBtns.forEach(({ id, b }) => b.setAttribute('aria-pressed', String(id === rateId)));
        }
        function mark(at) { sentences.forEach((s, i) => s.span.classList.toggle('is-speaking', i === at)); }
        function halt() { token++; clearTimeout(watchdog); synth.cancel(); }

        function speak() {
            if (!bar.isConnected || index >= sentences.length) { reader.stop(); return; }
            const mine = ++token;
            const sentence = sentences[index];
            if (!sentence.text) { index++; speak(); return; }
            utterance = new SpeechSynthesisUtterance(sentence.text);
            const voice = bridge.getPreferredVoice();
            if (voice) utterance.voice = voice;
            utterance.lang = 'en-US';
            utterance.rate = READ_RATES.find(r => r.id === rateId).rate;
            const next = () => { if (mine !== token) return; clearTimeout(watchdog); index++; speak(); };
            utterance.onend = next;
            utterance.onerror = next;
            // 部分瀏覽器偶爾不會觸發 onend，設保險計時避免卡在「播放中」
            clearTimeout(watchdog);
            watchdog = setTimeout(() => { if (mine === token) reader.stop(); }, 8000 + sentence.text.length * 250);
            mark(index);
            synth.speak(utterance);
        }
        // cancel() 之後立刻 speak() 有時會被瀏覽器吃掉，稍等一下再開始
        function speakSoon() {
            halt();
            const mine = token;
            setTimeout(() => { if (mine === token && state === 'playing') speak(); }, 80);
        }
        function setRate(id) {
            rateId = id;
            bridge.writeStorage(READ_RATE_KEY, id);
            render();
            if (state === 'playing') speakSoon(); // 用新語速重唸目前這一句
        }

        const reader = {
            el: bar,
            stop() {
                halt();
                state = 'idle';
                index = 0;
                mark(-1);
                if (activeReader === reader) activeReader = null;
                render();
            },
        };
        playBtn.addEventListener('click', () => {
            if (state === 'playing') { halt(); state = 'paused'; render(); return; }
            if (activeReader && activeReader !== reader) activeReader.stop();
            activeReader = reader;
            state = 'playing';
            render();
            speakSoon();
        });
        stopBtn.addEventListener('click', () => { reader.stop(); playBtn.focus({ preventScroll: true }); });
        render();
        return reader;
    }

    // slotWidgets：Map(格號 → 選擇題元件)。有對應元件的空格會變成按鈕，點了在空格下方跳出選項。
    function renderPassage(passage, askedSlots, slotWidgets) {
        const box = h('div', `trainer-passage kind-${passage.kind}`);
        box.appendChild(h('h3', 'trainer-passage-title', passage.title));
        const slots = [];   // 文章裡可作答的空格，依出現順序
        const hint = h('p', 'trainer-passage-hint', '👆 點文章裡的空格選答案');
        let pop = null;     // 目前開著的選項視窗（一次只開一個）
        let popBtn = null;

        function closePop() {
            if (!pop) return;
            pop.remove();
            popBtn.setAttribute('aria-expanded', 'false');
            pop = null;
            popBtn = null;
            document.removeEventListener('mousedown', onOutsideDown, true);
        }
        function onOutsideDown(event) {
            if (!pop || !pop.isConnected) { closePop(); return; }
            if (!pop.contains(event.target) && !popBtn.contains(event.target)) closePop();
        }
        function openPop(entry) {
            const { btn, slot, widget } = entry;
            closePop();
            pop = h('div', 'trainer-slot-pop', null, { role: 'group', 'aria-label': `第 ${slot} 格的選項` });
            popBtn = btn;
            pop.appendChild(h('p', 'trainer-slot-pop-title', `${widget.number ? `第 ${widget.number} 題・` : ''}第 ${slot} 格`));
            const optionBtns = widget.options.map((option, i) => {
                const b = h('button', `trainer-option${option === widget.getAnswer() ? ' selected' : ''}`, null, { type: 'button' });
                b.appendChild(h('span', 'trainer-option-letter', `(${LETTERS[i]})`));
                b.appendChild(h('span', 'trainer-option-text', option));
                b.addEventListener('click', () => {
                    widget.pick(option);
                    closePop();
                    // 選完把焦點移到下一個還沒作答的空格，沒有的話留在原地
                    const rest = slots.slice(slots.indexOf(entry) + 1).concat(slots.slice(0, slots.indexOf(entry)));
                    (rest.find(s => !s.widget.getAnswer()) || entry).btn.focus({ preventScroll: true });
                });
                pop.appendChild(b);
                return b;
            });
            pop.addEventListener('keydown', event => {
                if (event.ctrlKey || event.metaKey || event.altKey) return;
                const key = event.key.toLowerCase();
                const index = key.length === 1 ? ('1234'.includes(key) ? Number(key) - 1 : 'abcd'.indexOf(key)) : -1;
                const at = optionBtns.indexOf(document.activeElement);
                if (event.key === 'Escape') { closePop(); btn.focus({ preventScroll: true }); }
                else if (index >= 0 && optionBtns[index]) optionBtns[index].click();
                else if (event.key === 'ArrowDown') optionBtns[(at + 1) % optionBtns.length].focus();
                else if (event.key === 'ArrowUp') optionBtns[(at - 1 + optionBtns.length) % optionBtns.length].focus();
                else return;
                event.preventDefault();
                event.stopPropagation(); // 不讓 Esc、數字鍵再觸發外層的快速鍵
            });
            box.appendChild(pop);
            btn.setAttribute('aria-expanded', 'true');
            // 放在空格正下方，左右不超出文章框
            const boxRect = box.getBoundingClientRect();
            const btnRect = btn.getBoundingClientRect();
            pop.style.top = `${btnRect.bottom - boxRect.top + 6}px`;
            pop.style.left = `${Math.max(8, Math.min(btnRect.left - boxRect.left, box.clientWidth - pop.offsetWidth - 8))}px`;
            (optionBtns.find(b => b.classList.contains('selected')) || optionBtns[0]).focus({ preventScroll: true });
            pop.scrollIntoView({ block: 'nearest' });
            document.addEventListener('mousedown', onOutsideDown, true);
        }
        function slotButton(slot, widget) {
            const btn = h('button', 'trainer-slot trainer-slot-btn', null, { type: 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false' });
            btn.appendChild(h('span', 'trainer-slot-num', `( ${slot} )`));
            const value = h('span', 'trainer-slot-value');
            btn.appendChild(value);
            const entry = { btn, slot, widget };
            slots.push(entry);
            const sync = () => {
                const answer = widget.getAnswer();
                value.textContent = answer;
                btn.classList.toggle('filled', Boolean(answer));
                btn.setAttribute('aria-label', answer ? `第 ${slot} 格，已選 ${answer}，點一下可以改` : `第 ${slot} 格，還沒作答，點一下選答案`);
            };
            btn.addEventListener('click', () => { if (popBtn === btn) closePop(); else openPop(entry); });
            widget.slotHooks = {
                sync,
                focus: () => btn.focus(),
                lock: () => { if (popBtn === btn) closePop(); btn.disabled = true; hint.hidden = true; },
                mark: right => {
                    btn.classList.add(right ? 'is-correct' : 'is-wrong');
                    if (!widget.getAnswer()) value.textContent = '未作答';
                },
            };
            sync();
            return btn;
        }

        const paragraphs = [];
        const readable = passage.kind === 'reading' && Boolean(synth);
        const sentences = []; // 閱讀文章逐句包起來，朗讀時用來標示
        passage.text.split(/\n{2,}/).forEach(par => {
            const p = h('p', 'trainer-passage-text');
            par.split(/(\{\{\d+\}\})/g).forEach(part => {
                const m = part.match(/^\{\{(\d+)\}\}$/);
                const widget = m && slotWidgets && slotWidgets.get(Number(m[1]));
                if (widget) p.appendChild(slotButton(Number(m[1]), widget));
                else if (m) p.appendChild(h('span', `trainer-slot${askedSlots && !askedSlots.has(Number(m[1])) ? ' dim' : ''}`, `( ${m[1]} )`));
                else part.split('\n').forEach((seg, i) => {
                    if (i) p.appendChild(h('br'));
                    if (!readable) { p.appendChild(document.createTextNode(seg)); return; }
                    splitSentences(seg).forEach(sentence => {
                        const span = h('span', 'trainer-sen', sentence);
                        p.appendChild(span);
                        sentences.push({ span, text: speechText(sentence) });
                    });
                });
            });
            paragraphs.push(p);
        });
        // 題庫裡若有對不到文章空格的題目，照舊顯示下方的選項，不能讓它變成無法作答
        if (slotWidgets) slotWidgets.forEach(widget => { if (!widget.slotHooks) widget.el.hidden = false; });
        if (sentences.length) box.appendChild(buildReader(sentences).el);
        if (slots.length) box.appendChild(hint);
        paragraphs.forEach(p => box.appendChild(p));
        return box;
    }

    // 克漏字的題目元件依格號對應到文章空格
    function clozeSlotMap(passage, widgets) {
        if (!passage || passage.kind !== 'cloze') return null;
        return new Map(widgets.filter(w => w.item.format === 'cloze').map(w => [w.item.slot, w]));
    }

    // ---------- 大廳 ----------
    function sectionBlock(title, desc) {
        const sec = h('section', 'trainer-section');
        sec.appendChild(h('h2', 'trainer-section-title', title));
        if (desc) sec.appendChild(h('p', 'trainer-section-desc', desc));
        return sec;
    }
    function rateBadge(state, statEntry) {
        if (state && state.plays) return h('span', `trainer-rate ${state.best >= C.PASS_RATE ? 'good' : 'low'}`, `最佳 ${percent(state.best)}`);
        if (statEntry && statEntry.n) return h('span', 'trainer-rate', `答對率 ${C.pct(statEntry.ok, statEntry.n)}%`);
        return h('span', 'trainer-rate none', '還沒練');
    }

    // 文法點表格的表頭小字：每一階在練什麼，只說明一次
    const STAGE_HINTS = { 1: '選擇題', 2: '填空、重組', 3: '自己寫整句' };

    function renderHub(notice) {
        stopTimers();
        session = null;
        setView('hub');
        clearRoot();
        const info = core.hubInfo(unitKey);
        const unit = info.unit;

        const startLadder = (p, s) => startSession({ kind: 'ladder', unit: unitKey, point: p.id, stage: s.stage, title: `${p.label}｜${s.label}`, units: core.pickLadder(unitKey, p.id, s.stage) });
        const startFormat = f => startSession({ kind: 'format', unit: unitKey, format: f.id, title: `題型專練｜${f.label}`, units: core.pickFormat(unitKey, f.id) });
        const startReview = () => startSession({ kind: 'review', unit: unitKey, title: '錯題訂正', units: core.pickReview(unitKey, true) });
        const startDiag = () => startExam(unitKey, 'half', true);

        // 標題列
        const header = h('div', 'trainer-header');
        const titles = h('div', 'trainer-titles');
        titles.appendChild(h('h1', 'trainer-title', `${unit.title} 段考特訓`));
        titles.appendChild(h('p', 'trainer-subtitle', unit.subtitle));
        header.appendChild(titles);
        const headBtns = h('div', 'trainer-header-actions');
        headBtns.appendChild(button('家長報告', 'secondary', () => renderReport()));
        headBtns.appendChild(button('返回主選單', 'secondary', () => bridge.exit()));
        header.appendChild(headBtns);
        root.appendChild(header);

        if (notice) root.appendChild(notice);

        // 進行中的考卷
        if (info.exam) {
            const left = Math.max(0, Math.round((info.exam.deadline - Date.now()) / 60000));
            const banner = h('div', 'trainer-banner');
            banner.appendChild(h('p', '', `你有一份還沒交的${info.exam.diag ? '診斷卷' : '模擬段考'}（${C.SCOPE_LABELS[info.exam.scope]} ${C.MOCK[info.exam.kind].label}），剩 ${left} 分鐘。`));
            banner.appendChild(button('繼續作答', '', () => renderExam()));
            root.appendChild(banner);
        }

        // 兩欄：左邊固定顯示今天要做的事、點數、錯題本；右邊是所有練習
        const cols = h('div', 'trainer-cols');
        const side = h('aside', 'trainer-side');
        const main = h('div', 'trainer-main');
        cols.appendChild(side);
        cols.appendChild(main);
        root.appendChild(cols);

        const mock = sectionBlock('模擬段考', '比照學校考卷：計時、沒有提示、交卷後才看答案。大小寫和標點寫錯會扣一半分數。');

        // ---------- 左欄：今天這樣練（符合狀況的才列出來，只有第一項是主要按鈕） ----------
        const tasks = [];
        if (!info.diagnosed) tasks.push({ title: '先做「診斷」', sub: '20 分鐘小考卷，找出最弱的地方・第一次完成 +10', action: '開始診斷', run: startDiag });
        if (info.wrongDue) tasks.push({ title: `訂正 ${info.wrongDue} 題到期的錯題`, sub: info.daily.flags.clear ? '今天的 +5 已經拿到了' : info.daily.flags.reviewMiss ? '今天已經有答錯的題目，這次沒有點數' : '全部答對 +5', action: '開始訂正', run: startReview });
        const focusPoint = info.points.find(p => p.weak) || info.points.find(p => !p.stages.every(s => s.state && s.state.passed));
        if (focusPoint) {
            const needCard = focusPoint.concept && !focusPoint.conceptState.passedAt;
            const stage = focusPoint.stages.find(s => s.pool && !(s.state && s.state.passed)) || focusPoint.stages.filter(s => s.pool).pop();
            if (needCard) tasks.push({ title: `文法點「${focusPoint.label}」`, sub: '先讀觀念卡・通過小檢核 +3', action: '讀觀念卡', run: () => renderConcept(focusPoint.concept) });
            else if (stage) tasks.push({ title: `文法點「${focusPoint.label}」`, sub: `練${stage.label}・答對 8 成過關${stage.state && stage.state.passed ? '' : ` +${stage.once}`}`, action: '開始練習', run: () => startLadder(focusPoint, stage) });
        }
        const focusFormat = info.formats.find(f => f.weak) || info.formats.find(f => !f.state);
        if (focusFormat) tasks.push({ title: `題型專練「${focusFormat.label}」`, sub: `一關 8 題，答對 8 成過關${focusFormat.rewarded ? '' : ` +${C.FORMAT_ONCE}`}`, action: '開始練習', run: () => startFormat(focusFormat) });
        // 只列今天還拿得到的及格點數
        const passLeft = [['mockpass:full', '完整卷及格 +20'], ['mockpass:half', '半卷及格 +10']].filter(([flag]) => !info.daily.flags[flag]).map(([, text]) => text);
        tasks.push({ title: '週末寫一份完整的模擬段考', sub: passLeft.length ? passLeft.join('、') : '今天的及格點數都拿到了', action: '去選考卷', run: () => mock.scrollIntoView({ behavior: 'smooth', block: 'start' }) });

        const today = h('section', 'trainer-today');
        const todayTitle = h('h2', 'trainer-today-title', '今天這樣練');
        todayTitle.appendChild(h('small', '', '照順序做，約 15–20 分鐘'));
        today.appendChild(todayTitle);
        const taskList = h('ol', 'trainer-tasks');
        tasks.forEach((task, i) => {
            const li = h('li', `trainer-task${i === 0 ? ' is-next' : ''}`);
            li.appendChild(h('span', 'trainer-task-num', String(i + 1)));
            const body = h('div', 'trainer-task-body');
            body.appendChild(h('p', 'trainer-task-title', task.title));
            body.appendChild(h('p', 'trainer-task-sub', task.sub));
            body.appendChild(button(task.action, i === 0 ? '' : 'secondary', task.run));
            li.appendChild(body);
            taskList.appendChild(li);
        });
        today.appendChild(taskList);
        side.appendChild(today);

        // ---------- 左欄：每日點數（和首頁同一組金幣；不含只給一次的獎勵） ----------
        const daily = sectionBlock('每日點數');
        const coins = h('div', 'trainer-coins');
        [[20, '完整卷及格', 'mockpass:full'], [10, '半卷及格', 'mockpass:half'], [5, '錯題全對', 'clear']].forEach(([points, label, flag]) => {
            const got = Boolean(info.daily.flags[flag]);
            const coin = h('div', `trainer-coin${got ? ' on' : ''}`, null, { title: `${label} +${points}${got ? '（今天已拿到）' : ''}` });
            coin.appendChild(h('span', 'trainer-coin-face', `+${points}`));
            coin.appendChild(h('span', 'trainer-coin-label', label));
            coins.appendChild(coin);
        });
        daily.appendChild(coins);
        daily.appendChild(h('p', 'trainer-daily-text', `今天已拿 ${info.daily.points} / ${info.daily.cap} 點`));
        side.appendChild(daily);

        // ---------- 左欄：錯題本 ----------
        const wrong = sectionBlock('錯題本');
        wrong.title = '答錯的題目會留在這裡，隔 1 天、3 天、7 天各再考一次，連續答對才會畢業。';
        const stats = h('div', 'trainer-stats');
        [[info.wrongDue, '今天到期', info.wrongDue ? 'due' : ''], [info.wrongTotal, '錯題', ''], [info.mastered, '已畢業', 'good']].forEach(([value, label, tone]) => {
            const tile = h('div', `trainer-stat${tone ? ` ${tone}` : ''}`);
            tile.appendChild(h('span', 'trainer-stat-value', String(value)));
            tile.appendChild(h('span', 'trainer-stat-label', label));
            stats.appendChild(tile);
        });
        wrong.appendChild(stats);
        const dueBtn = button(info.wrongDue ? `訂正到期錯題（${info.wrongDue}）` : '今天沒有到期的錯題', 'secondary', startReview);
        dueBtn.disabled = !info.wrongDue;
        const allBtn = button('全部錯題再練一次', 'secondary', () => startSession({ kind: 'cram', unit: unitKey, title: '錯題總複習', units: core.pickReview(unitKey, false) }));
        allBtn.title = '考前用，不計點';
        allBtn.disabled = !info.wrongTotal;
        wrong.appendChild(dueBtn);
        wrong.appendChild(allBtn);
        wrong.appendChild(h('p', 'trainer-side-note', '隔 1、3、7 天各再考一次，連續答對才畢業。'));
        side.appendChild(wrong);

        // ---------- 右欄：文法點表格（綠＝過關、黃＝下一步、灰＝還沒輪到） ----------
        const ladder = sectionBlock('文法點', '由左到右一格一格練，每一階答對 8 成就過關。');
        const hasConcept = info.points.some(p => p.concept);
        const table = h('table', 'trainer-ptable');
        const headRow = h('tr', '');
        headRow.appendChild(h('th', '', '', { scope: 'col' }));
        const headCell = (name, hint) => { const th = h('th', '', name, { scope: 'col' }); th.appendChild(h('small', '', hint)); return th; };
        if (hasConcept) headRow.appendChild(headCell('📖 觀念卡', '讀規則和例句'));
        C.STAGES.forEach(s => headRow.appendChild(headCell(`第 ${s.stage} 階`, STAGE_HINTS[s.stage] || s.desc)));
        const thead = h('thead', '');
        thead.appendChild(headRow);
        table.appendChild(thead);
        const tbody = h('tbody', '');
        info.points.forEach(p => {
            const row = h('tr', p.weak ? 'weak' : '');
            const nameCell = h('th', 'trainer-ptable-name', p.label, { scope: 'row' });
            if (p.weak) nameCell.appendChild(h('span', 'trainer-tag warn', '優先'));
            if (p.stat && p.stat.n) nameCell.appendChild(h('small', '', `答對率 ${C.pct(p.stat.ok, p.stat.n)}%（${p.stat.n} 題）`));
            row.appendChild(nameCell);

            const cells = [];
            if (hasConcept) cells.push(p.concept ? { what: '觀念卡', done: Boolean(p.conceptState.passedAt), text: '開始', hint: '讀規則和例句，再做小檢核', run: () => renderConcept(p.concept) } : null);
            p.stages.forEach(s => {
                const passed = Boolean(s.state && s.state.passed);
                cells.push({ what: s.label, done: passed, text: s.state && !passed ? `${percent(s.state.best)}　再練` : '開始', hint: s.desc, disabled: !s.pool, run: () => startLadder(p, s) });
            });
            const nextCell = cells.find(c => c && !c.done && !c.disabled);
            cells.forEach(c => {
                const td = h('td', '');
                if (c) {
                    const b = button(c.done ? '✓ 過關' : c.text, c.done ? 'is-done' : c === nextCell ? '' : 'secondary', c.run);
                    b.title = c.hint;
                    b.setAttribute('aria-label', `${p.label}｜${c.what}｜${c.done ? '已過關' : c.text}`);
                    b.disabled = Boolean(c.disabled);
                    td.appendChild(b);
                }
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        ladder.appendChild(table);
        main.appendChild(ladder);

        // ---------- 右欄：題型專練 ----------
        const formats = sectionBlock('考卷題型專練', '照考卷的大題練，一關 8 題。各文法點混在一起出，要自己判斷考哪個文法。');
        const fgrid = h('div', 'trainer-format-grid');
        info.formats.forEach(f => {
            const card = h('button', `trainer-format${f.weak ? ' weak' : ''}`, null, { type: 'button' });
            card.appendChild(h('span', 'trainer-format-name', f.label));
            card.appendChild(h('span', 'trainer-format-desc', f.desc));
            const meta = h('span', 'trainer-format-meta');
            if (f.weak) meta.appendChild(h('span', 'trainer-tag warn', '優先'));
            meta.appendChild(rateBadge(f.state, f.stat));
            // 首次過關獎勵：還沒領顯示可以拿幾點，領過顯示已領
            meta.appendChild(f.rewarded
                ? h('span', 'trainer-tag done', '✓ 已領', { title: `第一次過關的 +${C.FORMAT_ONCE} 已經領過` })
                : h('span', 'trainer-tag coin', `🪙 +${C.FORMAT_ONCE}`, { title: `第一次答對 8 成過關 +${C.FORMAT_ONCE}` }));
            card.appendChild(meta);
            card.addEventListener('click', () => startFormat(f));
            fgrid.appendChild(card);
        });
        formats.appendChild(fgrid);
        main.appendChild(formats);

        // ---------- 右欄：模擬段考（診斷卷放在最下面） ----------
        // 合卷只放在 Unit 4：兩個單元都學過才適合考，也避免同一張合卷在兩個單元各領一次及格點數
        const scopes = [unitKey].concat(unitKey === 'u4' && core.hasUnit('u3') ? ['u34'] : []);
        const mockGrid = h('div', 'trainer-mock-grid');
        scopes.forEach(scope => {
            ['half', 'full'].forEach(kind => {
                const spec = C.MOCK[kind];
                const best = core.bestExam(scope, kind);
                const card = h('div', 'trainer-mock-card');
                card.appendChild(h('h3', 'trainer-mock-title', `${C.SCOPE_LABELS[scope]}｜${spec.label}`));
                if (scope === 'u34' && kind === 'full') card.appendChild(h('span', 'trainer-tag', '最接近段考'));
                card.appendChild(h('p', 'trainer-mock-meta', `${spec.minutes} 分鐘・${kind === 'full' ? '100 分' : '約 50 分，換算成百分'}`));
                card.appendChild(h('span', `trainer-rate ${best === null ? 'none' : best >= 80 ? 'good' : best >= 60 ? '' : 'low'}`, best === null ? '還沒考過' : `最高 ${best} 分`));
                card.appendChild(button('開始考試', 'secondary', () => startExam(scope, kind, false)));
                mockGrid.appendChild(card);
            });
        });
        mock.appendChild(mockGrid);
        const diagRow = h('div', 'trainer-row trainer-diag-row');
        diagRow.appendChild(h('span', `trainer-rate ${info.diagnosed ? 'good' : 'none'}`, `診斷卷：${info.diagnosed ? '已完成' : '還沒做'}`));
        diagRow.appendChild(button(info.diagnosed ? '再診斷一次' : '開始診斷', 'secondary', startDiag));
        mock.appendChild(diagRow);
        main.appendChild(mock);

        // 左欄比視窗高時，讓它先跟著頁面捲到底再固定，才不會有看不到的部分
        const placeSide = () => {
            if (!side.isConnected) { window.removeEventListener('resize', placeSide); return; }
            side.style.top = `${Math.min(16, window.innerHeight - side.offsetHeight - 16)}px`;
        };
        placeSide();
        window.addEventListener('resize', placeSide);
    }

    // ---------- 觀念卡 ----------
    function renderConcept(concept) {
        setView('concept');
        clearRoot();
        const head = h('div', 'trainer-header');
        head.appendChild(h('h1', 'trainer-title', `📖 ${concept.title}`));
        head.appendChild(button('回大廳', 'secondary', () => renderHub()));
        root.appendChild(head);
        const card = h('div', 'trainer-concept');
        concept.blocks.forEach(block => {
            if (block.type === 'rule') card.appendChild(h('p', 'concept-rule', block.text));
            else if (block.type === 'tip') card.appendChild(h('p', 'concept-tip', `💡 ${block.text}`));
            else if (block.type === 'table') {
                const wrap = h('div', 'concept-table-wrap');
                const table = h('table', 'concept-table');
                if (block.head) { const tr = h('tr'); block.head.forEach(c => tr.appendChild(h('th', '', c))); table.appendChild(tr); }
                (block.rows || []).forEach(row => { const tr = h('tr'); row.forEach(c => tr.appendChild(h('td', '', c))); table.appendChild(tr); });
                wrap.appendChild(table);
                card.appendChild(wrap);
            } else if (block.type === 'examples') {
                const box = h('div', 'concept-examples');
                box.appendChild(h('h3', 'concept-heading', '例句'));
                (block.items || []).forEach(ex => { const p = h('p', 'concept-example'); p.appendChild(h('span', 'concept-en', ex.en)); if (ex.zh) p.appendChild(h('span', 'concept-zh', ex.zh)); box.appendChild(p); });
                card.appendChild(box);
            } else if (block.type === 'traps') {
                const box = h('div', 'concept-traps');
                box.appendChild(h('h3', 'concept-heading', '⚠️ 最常錯在這裡'));
                (block.items || []).forEach(t => {
                    const row = h('div', 'concept-trap');
                    row.appendChild(h('p', 'concept-wrong', `✗ ${t.wrong}`));
                    row.appendChild(h('p', 'concept-right', `✓ ${t.right}`));
                    row.appendChild(h('p', 'concept-why', t.why));
                    box.appendChild(row);
                });
                card.appendChild(box);
            }
        });
        root.appendChild(card);
        const actions = h('div', 'trainer-actions');
        actions.appendChild(button('我讀完了，做 4 題檢核', '', () => {
            const us = core.unitState(unitKey);
            us.concepts[concept.id] = Object.assign({}, us.concepts[concept.id], { readAt: (us.concepts[concept.id] || {}).readAt || bridge.getLocalDateString() });
            core.save();
            startSession({ kind: 'concept', unit: unitKey, conceptId: concept.id, title: `觀念卡檢核｜${concept.title}`, units: core.pickConceptCheck(unitKey, concept) });
        }));
        root.appendChild(actions);
    }

    // ---------- 一般練習 ----------
    function startSession(config) {
        if (!config.units.length) { bridge.showDialog({ title: '沒有題目', message: '這一關目前沒有可以練的題目。' }); return; }
        session = Object.assign({ index: 0, results: [] }, config);
        setView('session');
        renderWorkUnit();
    }

    function renderWorkUnit() {
        clearRoot();
        const work = session.units[session.index];
        const head = h('div', 'trainer-header compact');
        head.appendChild(h('h1', 'trainer-title small', session.title));
        const right = h('div', 'trainer-header-actions');
        right.appendChild(h('span', 'trainer-progress-text', `${session.index + 1} / ${session.units.length}`));
        right.appendChild(button('離開', 'secondary', quitSession));
        head.appendChild(right);
        root.appendChild(head);
        const bar = h('div', 'trainer-progress');
        const fill = h('div', 'trainer-progress-fill');
        fill.style.width = `${(session.index / session.units.length) * 100}%`;
        bar.appendChild(fill);
        root.appendChild(bar);

        const form = h('form', 'trainer-work', null, { novalidate: '' });
        const showFormat = session.kind !== 'format';
        const submit = h('button', 'dialog-button trainer-submit', '檢查答案', { type: 'submit' });
        const widgets = work.items.map((item, i) => buildWidget(item, {
            number: work.items.length > 1 ? i + 1 : 0,
            showFormat: showFormat && !work.passage,
            inline: item.format === 'cloze' && Boolean(work.passage),
            onPick: work.items.length === 1 ? () => submit.focus({ preventScroll: true }) : null,
        }));
        if (work.passage) form.appendChild(renderPassage(work.passage, work.passage.kind === 'cloze' ? new Set(work.items.map(it => it.slot)) : null, clozeSlotMap(work.passage, widgets)));
        widgets.forEach(w => form.appendChild(w.el));
        const actions = h('div', 'trainer-actions');
        // 文法點第 2、3 階要自己寫出答案，難度較高，提供提示（用了照常算答對，只是會記下來）
        let hint = null;
        if (session.kind === 'ladder' && session.stage >= 2 && widgets.length === 1) {
            hint = buildHint(widgets[0].item);
            if (hint.available) { form.appendChild(hint.box); actions.appendChild(hint.button); }
            else hint = null;
        }
        actions.appendChild(submit);
        form.appendChild(actions);
        root.appendChild(form);

        const startedAt = Date.now();
        let phase = 'answer'; // answer → correct（重打訂正）→ next
        session.current = { widgets, single: widgets.length === 1 ? widgets[0] : null, phase: () => phase };

        form.addEventListener('submit', event => {
            event.preventDefault();
            if (Date.now() < nextReadyAt) return;
            if (phase === 'answer') {
                const empty = widgets.filter(w => core.isBlankAnswer(w.item, w.getAnswer()));
                if (empty.length === widgets.length) { empty[0].focus(); return; }
                const ms = (Date.now() - startedAt) / widgets.length;
                widgets.forEach(w => {
                    const answer = w.getAnswer();
                    const result = core.gradeItem(w.item, answer);
                    const hints = hint ? hint.used() : 0;
                    const rec = core.recordAttempt({ item: w.item, ctx: session.kind, answer, result, ms, due: session.kind === 'review', hints });
                    const entry = { item: w.item, answer, result, right: rec.right, promoted: rec.promoted, hints };
                    session.results.push(entry);
                    w.lock();
                    w.mark(result);
                    fillFeedback(w, result);
                    const kind = C.FORMAT_BY_ID[w.item.format].kind;
                    if (!rec.right && kind !== 'choice') {
                        w.startCorrection(result);
                        if (kind === 'sentence' && result.verdict === 'wrong') {
                            const dispute = h('button', 'trainer-link', '我覺得我是對的（算我答對，並記下來給爸媽看）', { type: 'button' });
                            dispute.addEventListener('click', () => {
                                // 這一題直接改判為答對：這一關的成績、統計、錯題本都跟著改，也不用重打訂正
                                const outcome = core.acceptDispute(w.item, answer, rec);
                                entry.right = true;
                                entry.promoted = outcome.promoted;
                                entry.result = { ...result, verdict: 'ok', score: 1, notes: [] };
                                w.acceptAsCorrect();
                                const fb = w.feedbackEl;
                                fb.className = 'trainer-feedback verdict-ok';
                                fb.querySelector('.trainer-verdict').textContent = '✅ 好，這一題算你答對！';
                                fb.querySelectorAll('.trainer-diff').forEach(el => el.remove());
                                const label = fb.querySelector('.trainer-answer-label');
                                if (label) label.textContent = '系統的參考答案：';
                                dispute.replaceWith(h('p', 'trainer-dispute-note', '📝 已記下你的寫法，爸媽會在報告裡看到。'));
                                advancePhase();
                            });
                            w.feedbackEl.appendChild(dispute);
                        }
                    }
                });
                if (hint) hint.lock();
                core.save();
                nextReadyAt = Date.now() + 400;
                advancePhase();
            } else if (phase === 'correct') {
                const pending = widgets.filter(w => w.needsCorrection);
                pending.forEach(w => w.checkCorrection());
                advancePhase();
            } else {
                nextWorkUnit();
            }
        });

        function advancePhase() {
            const pending = widgets.filter(w => w.needsCorrection);
            if (pending.length) {
                phase = 'correct';
                submit.textContent = '確認訂正';
                const target = pending[0];
                if (target.retryInput) target.retryInput.focus({ preventScroll: false });
                else target.focus();
            } else {
                phase = 'next';
                submit.textContent = session.index + 1 < session.units.length ? '下一題' : '看結果';
                submit.focus({ preventScroll: true });
                submit.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }

        // 把焦點放進第一個可作答的地方
        const first = widgets[0];
        if (C.FORMAT_BY_ID[first.item.format].kind !== 'choice') first.focus();
    }

    function nextWorkUnit() {
        if (Date.now() < nextReadyAt) return;
        nextReadyAt = Date.now() + 250;
        session.index++;
        if (session.index < session.units.length) renderWorkUnit();
        else finishSession();
    }

    async function quitSession() {
        const confirmed = await bridge.showDialog({ title: '要離開這一關嗎？', message: '已經作答的題目都有記錄，但這一關不會算過關。', confirmText: '離開', cancelText: '繼續練習', focusCancel: true });
        if (confirmed) { core.save(); renderHub(); }
    }

    function finishSession() {
        const done = session;
        const summary = core.finishSession(done);
        setView('summary');
        clearRoot();
        const box = h('div', 'trainer-summary');
        const good = summary.rate >= C.PASS_RATE;
        box.appendChild(h('div', 'trainer-summary-icon', good ? '🎉' : '💪'));
        box.appendChild(h('h1', 'trainer-title', done.title));
        box.appendChild(h('p', 'trainer-summary-score', `答對 ${summary.right} / ${summary.total}（${percent(summary.rate)}）`));
        const msg = done.kind === 'ladder' ? (good ? '這一階過關了！可以往下一階。' : '還沒到 80%，看完下面的詳解再練一次。')
            : done.kind === 'concept' ? (summary.rate >= 0.75 ? '觀念卡檢核通過！接著練第 1 階。' : '再讀一次觀念卡的「最常錯在這裡」，然後重做檢核。')
            : done.kind === 'review' ? '訂正完成。答對的題目會隔幾天再出現一次，確認真的記住了。'
            : done.kind === 'cram' ? '總複習完成。' : (good ? '做得很好！' : '看完下面的詳解，明天再練一關。');
        box.appendChild(h('p', 'trainer-summary-msg', msg));
        if (summary.rewards.length) box.appendChild(h('p', 'trainer-summary-points', '🪙 ' + summary.rewards.map(r => `${r.label} +${r.points}`).join('、')));
        // 訂正錯題沒拿到「全部答對」的點數時，說明原因
        if (done.kind === 'review' && !summary.rewards.length) {
            const after = core.hubInfo(done.unit);
            if (after.daily.flags.reviewMiss && !after.daily.flags.clear) box.appendChild(h('p', 'trainer-summary-msg', '這次有題目第一次答錯，所以今天沒有「全部答對」的 +5。下次有錯題到期時再挑戰！'));
            else if (!after.daily.flags.clear && after.wrongDue) box.appendChild(h('p', 'trainer-summary-msg', `還有 ${after.wrongDue} 題到期的錯題，全部答對就有 +5。`));
        }
        const hinted = done.results.filter(r => r.hints > 0).length;
        if (hinted) box.appendChild(h('p', 'trainer-summary-msg', `💡 這一關有 ${hinted} 題用了提示。下次試試看不看提示！`));
        const careless = done.results.filter(r => r.result.verdict === 'careless').length;
        if (careless) box.appendChild(h('p', 'trainer-summary-warn', `⚠️ 有 ${careless} 題文法對但大小寫或標點寫錯，考試會被扣分。`));
        root.appendChild(box);

        const wrong = done.results.filter(r => !r.right);
        if (wrong.length) root.appendChild(buildReviewList('這次答錯的題目（已放進錯題本，明天會再考）', wrong));

        const actions = h('div', 'trainer-actions');
        const again = { ladder: () => core.pickLadder(done.unit, done.point, done.stage), format: () => core.pickFormat(done.unit, done.format) }[done.kind];
        if (again) actions.appendChild(button('再練一關', good ? 'secondary' : '', () => startSession(Object.assign({}, done, { index: 0, results: [], units: again() }))));
        if (done.kind === 'concept' && summary.rate < 0.75) {
            const concept = core.data.units[done.unit].concepts.find(c => c.id === done.conceptId);
            actions.appendChild(button('重讀觀念卡', '', () => renderConcept(concept)));
        }
        actions.appendChild(button('回大廳', good || !again ? '' : 'secondary', () => renderHub()));
        root.appendChild(actions);
        const primary = actions.querySelector('.dialog-button:not(.secondary)') || actions.querySelector('.dialog-button');
        if (primary) primary.focus({ preventScroll: true });
    }

    // 逐題檢討清單（結果頁與考卷成績單共用）
    function buildReviewList(title, rows, openAll) {
        const sec = h('section', 'trainer-section');
        sec.appendChild(h('h2', 'trainer-section-title', title));
        rows.forEach(row => {
            const item = row.item;
            const right = row.result.verdict === 'ok' || row.result.verdict === 'careless';
            const det = h('details', `trainer-review verdict-${row.result.verdict}`);
            det.open = openAll !== undefined ? openAll : !right || row.result.verdict === 'careless';
            const sum = h('summary', 'trainer-review-summary');
            sum.appendChild(h('span', 'trainer-review-mark', { ok: '✅', careless: '⚠️', wrong: '❌', blank: '⬜' }[row.result.verdict]));
            sum.appendChild(h('span', 'trainer-tag', C.FORMAT_BY_ID[item.format].label));
            sum.appendChild(h('span', 'trainer-review-q', core.itemPlain(item)));
            if (row.each) sum.appendChild(h('span', 'trainer-review-points', `${row.points} / ${row.each} 分`));
            det.appendChild(sum);
            const body = h('div', 'trainer-review-body');
            body.appendChild(h('p', 'trainer-part', `你的答案：${core.answerText(row.answer) || '（沒有作答）'}`));
            const ans = h('p', 'trainer-answer');
            ans.appendChild(h('span', 'trainer-answer-label', '正確答案：'));
            ans.appendChild(h('strong', '', row.result.sentence && row.result.sentence.best ? row.result.sentence.best : core.correctText(item)));
            body.appendChild(ans);
            if (row.result.verdict === 'careless') body.appendChild(h('p', 'trainer-summary-warn', '粗心：' + row.result.notes.join('、')));
            if (row.result.verdict === 'wrong' && row.result.sentence && row.result.sentence.diff) body.appendChild(renderDiff(row.result));
            const explain = h('div', 'trainer-explain');
            explain.appendChild(h('span', 'trainer-explain-label', '詳解'));
            explain.appendChild(h('p', '', item.explain));
            body.appendChild(explain);
            det.appendChild(body);
            sec.appendChild(det);
        });
        return sec;
    }

    // ---------- 模擬段考 ----------
    async function startExam(scope, kind, isDiag) {
        const existing = core.getState().examInProgress;
        if (existing) {
            const ok = await bridge.showDialog({ title: '還有一份沒交的考卷', message: '開始新的考試會放棄上一份（不會記分）。要放棄並開始新的嗎？', confirmText: '放棄並開始新的', cancelText: '取消', focusCancel: true });
            if (!ok) return;
            core.abandonExam();
        }
        const spec = C.MOCK[kind];
        const ok = await bridge.showDialog({
            title: isDiag ? '開始診斷' : `開始模擬段考（${C.SCOPE_LABELS[scope]} ${spec.label}）`,
            message: `限時 ${spec.minutes} 分鐘，作答中沒有提示，也不會顯示對錯，交卷後才看成績與詳解。準備好紙筆以外的東西都收起來，像真的考試一樣寫。`,
            confirmText: '開始', cancelText: '取消',
        });
        if (!ok) return;
        core.buildExam(scope, kind, isDiag, unitKey);
        renderExam();
    }

    function renderExam() {
        const exam = core.getState().examInProgress;
        if (!exam) { renderHub(); return; }
        stopTimers();
        setView('exam');
        clearRoot();
        const spec = C.MOCK[exam.kind];

        const bar = h('div', 'trainer-exam-bar');
        bar.appendChild(h('span', 'trainer-exam-name', `${exam.diag ? '診斷' : '模擬段考'}｜${C.SCOPE_LABELS[exam.scope]} ${spec.label}`));
        const timerEl = h('span', 'trainer-exam-timer', '');
        const countEl = h('span', 'trainer-exam-count', '');
        bar.appendChild(countEl);
        bar.appendChild(timerEl);
        const leaveBtn = button('暫離', 'secondary', async () => {
            const ok = await bridge.showDialog({ title: '要暫時離開嗎？', message: '答案會保留，可以回來繼續寫，但時間會繼續倒數。', confirmText: '離開', cancelText: '繼續作答', focusCancel: true });
            if (ok) { persist(); renderHub(); }
        });
        const submitBtn = button('交卷', '', () => confirmSubmit());
        bar.appendChild(leaveBtn);
        bar.appendChild(submitBtn);
        root.appendChild(bar);

        const paper = h('form', 'trainer-paper', null, { novalidate: '' });
        paper.addEventListener('submit', e => e.preventDefault());
        const widgets = [];
        let number = 0;
        exam.sections.forEach(section => {
            const sec = h('section', 'trainer-paper-section');
            const count = section.units.reduce((n, u) => n + u.ids.length, 0);
            sec.appendChild(h('h2', 'trainer-paper-title', `${section.title}（每題 ${section.each} 分，共 ${count * section.each} 分）`));
            sec.appendChild(h('p', 'trainer-section-desc', C.FORMAT_BY_ID[section.format].desc));
            section.units.forEach(u => {
                const items = u.ids.map(id => core.data.items.get(id)).filter(Boolean);
                const passage = u.passage ? core.data.passages.get(u.passage) : null;
                const unitWidgets = items.map(item => {
                    number++;
                    const w = buildWidget(item, { number, mock: true, seed: exam.startedAt, inline: item.format === 'cloze' && Boolean(passage) });
                    w.onChange(() => { exam.answers[item.id] = w.getAnswer(); updateCount(); schedulePersist(); });
                    widgets.push(w);
                    return w;
                });
                if (passage) sec.appendChild(renderPassage(passage, null, clozeSlotMap(passage, unitWidgets)));
                unitWidgets.forEach(w => {
                    if (exam.answers[w.item.id] !== undefined) w.setAnswer(exam.answers[w.item.id]);
                    sec.appendChild(w.el);
                });
            });
            paper.appendChild(sec);
        });
        const foot = h('div', 'trainer-actions');
        foot.appendChild(button('交卷', '', () => confirmSubmit()));
        paper.appendChild(foot);
        root.appendChild(paper);

        function persist() { widgets.forEach(w => { exam.answers[w.item.id] = w.getAnswer(); }); core.save(); }
        function schedulePersist() { clearTimeout(examSaveTimer); examSaveTimer = setTimeout(() => core.save(), 600); }
        function unanswered() { return widgets.filter(w => core.isBlankAnswer(w.item, w.getAnswer())).length; }
        function updateCount() { countEl.textContent = `已作答 ${widgets.length - unanswered()} / ${widgets.length}`; }
        function tick() {
            const left = Math.max(0, exam.deadline - Date.now());
            const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
            timerEl.textContent = `⏱ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            timerEl.classList.toggle('urgent', left < 5 * 60000);
            if (left <= 0) { stopTimers(); persist(); finishExam(true); }
        }
        async function confirmSubmit() {
            const n = unanswered();
            const ok = await bridge.showDialog({ title: '確定要交卷嗎？', message: n ? `還有 ${n} 題沒有作答。交卷後就不能再改了。` : '交卷後就不能再改了。', confirmText: '交卷', cancelText: '再檢查一下', focusCancel: n > 0 });
            if (!ok) return;
            persist();
            finishExam(false);
        }
        updateCount();
        tick();
        examTimer = setInterval(tick, 1000);
        session = { kind: 'exam', persist };
    }

    function finishExam(timeUp) {
        stopTimers();
        const report = core.submitExam();
        session = null;
        if (!report) { renderHub(); return; }
        setView('examReport');
        clearRoot();

        const head = h('div', 'trainer-header');
        head.appendChild(h('h1', 'trainer-title', `${report.diag ? '診斷結果' : '模擬段考成績單'}｜${C.SCOPE_LABELS[report.scope]} ${C.MOCK[report.kind].label}`));
        head.appendChild(button('回大廳', 'secondary', () => renderHub()));
        root.appendChild(head);

        const score = h('div', `trainer-score ${report.score >= 80 ? 'good' : report.score >= 60 ? 'pass' : 'fail'}`);
        score.appendChild(h('div', 'trainer-score-number', String(report.score)));
        const side = h('div', 'trainer-score-side');
        side.appendChild(h('p', '', `得分 ${report.got} / ${report.max}，換算 ${report.score} 分`));
        side.appendChild(h('p', '', `用時 ${Math.floor(report.usedSec / 60)} 分 ${report.usedSec % 60} 秒${timeUp ? '（時間到自動交卷）' : ''}`));
        if (report.bestBefore !== null && !report.diag) side.appendChild(h('p', '', `之前最高 ${report.bestBefore} 分`));
        if (!report.serious) side.appendChild(h('p', 'trainer-summary-warn', '作答時間太短或空白太多，這次不計點數。'));
        if (report.rewards.length) side.appendChild(h('p', 'trainer-summary-points', '🪙 ' + report.rewards.map(r => `${r.label} +${r.points}`).join('、')));
        score.appendChild(side);
        root.appendChild(score);

        const tables = h('div', 'trainer-report-grid');
        const secTable = h('section', 'trainer-section');
        secTable.appendChild(h('h2', 'trainer-section-title', '各大題得分'));
        report.bySection.forEach(s => secTable.appendChild(barRow(s.title, s.got, s.max, `${Math.round(s.got * 10) / 10} / ${s.max}`)));
        tables.appendChild(secTable);
        const ptTable = h('section', 'trainer-section');
        ptTable.appendChild(h('h2', 'trainer-section-title', '各文法點答對題數'));
        Object.entries(report.byPoint).sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n).forEach(([pid, r]) => ptTable.appendChild(barRow(core.pointLabel(pid), r.ok, r.n, `${r.ok} / ${r.n}`)));
        tables.appendChild(ptTable);
        root.appendChild(tables);

        const weakest = report.bySection.filter(s => s.max).sort((a, b) => a.got / a.max - b.got / b.max).slice(0, 2).filter(s => s.got / s.max < 0.8);
        if (weakest.length) {
            const advice = h('div', 'trainer-todo');
            advice.appendChild(h('h2', 'trainer-todo-title', '接下來先練這些'));
            const ol = h('ol', 'trainer-todo-list');
            ol.appendChild(h('li', '', '先把下面答錯的題目逐題看完詳解，按「立刻訂正這張考卷的錯題」。'));
            weakest.forEach(s => ol.appendChild(h('li', '', `大題「${s.title.replace(/^.、/, '')}」只拿到 ${Math.round((s.got / s.max) * 100)}%：到大廳的「考卷題型專練」多練這個題型。`)));
            const weakPts = Object.entries(report.byPoint).filter(([pid, r]) => !['vocab', 'reading', 'mixed'].includes(pid) && r.n >= 2 && r.ok / r.n < 0.6);
            weakPts.forEach(([pid]) => ol.appendChild(h('li', '', `文法點「${core.pointLabel(pid)}」：到大廳的「文法點」重讀觀念卡，從第 1 階練起。`)));
            advice.appendChild(ol);
            root.appendChild(advice);
        }

        const wrongRows = report.rows.filter(r => r.result.verdict !== 'ok');
        const rightRows = report.rows.filter(r => r.result.verdict === 'ok');
        const actions = h('div', 'trainer-actions');
        const wrongOnly = report.rows.filter(r => r.result.verdict === 'wrong' || r.result.verdict === 'blank');
        if (wrongOnly.length) {
            actions.appendChild(button(`立刻訂正這張考卷的錯題（${wrongOnly.length}）`, '', () => {
                const units = [];
                const groups = new Map();
                wrongOnly.forEach(r => {
                    if (r.item.passage) {
                        if (!groups.has(r.item.passage)) { const g = { passage: core.data.passages.get(r.item.passage), items: [] }; groups.set(r.item.passage, g); units.push(g); }
                        groups.get(r.item.passage).items.push(r.item);
                    } else units.push({ passage: null, items: [r.item] });
                });
                startSession({ kind: 'cram', unit: unitKey, title: '考卷錯題訂正', units });
            }));
        }
        actions.appendChild(button('回大廳', wrongOnly.length ? 'secondary' : '', () => renderHub()));
        root.appendChild(actions);
        if (wrongRows.length) root.appendChild(buildReviewList(`需要檢討的題目（${wrongRows.length}）`, wrongRows, true));
        if (rightRows.length) root.appendChild(buildReviewList(`答對的題目（${rightRows.length}）`, rightRows, false));
    }

    function barRow(label, got, max, text) {
        const row = h('div', 'trainer-bar-row');
        row.appendChild(h('span', 'trainer-bar-label', label));
        const track = h('div', 'trainer-bar-track');
        const rate = max ? got / max : 0;
        const fill = h('div', `trainer-bar-fill ${rate >= 0.8 ? 'good' : rate >= 0.6 ? 'pass' : 'fail'}`);
        fill.style.width = `${Math.round(rate * 100)}%`;
        track.appendChild(fill);
        row.appendChild(track);
        row.appendChild(h('span', 'trainer-bar-value', text));
        return row;
    }

    // ---------- 家長報告與匯出 ----------
    function renderReport() {
        setView('report');
        clearRoot();
        const state = core.getState();
        const head = h('div', 'trainer-header');
        head.appendChild(h('h1', 'trainer-title', '家長報告與做題歷程'));
        head.appendChild(button('回大廳', 'secondary', () => renderHub()));
        root.appendChild(head);

        // 匯出給 AI
        const exp = sectionBlock('📋 複製做題歷程（貼給 AI 分析）', '按下去就會把孩子的每一筆作答（題目、正解、他寫的答案、對錯、用時）連同分析指示一起複製到剪貼簿，直接貼到 Claude、ChatGPT、Gemini 等 AI 的對話框即可。');
        const erow = h('div', 'trainer-row');
        const preview = h('textarea', 'trainer-export', null, { readonly: '', rows: '8', 'aria-label': '做題歷程預覽' });
        const status = h('p', 'trainer-note', `目前共有 ${state.log.length} 筆作答紀錄。`);
        const doCopy = days => async () => {
            const text = core.exportLogText(days);
            preview.value = text;
            preview.hidden = false;
            const ok = await copyText(text);
            status.textContent = ok ? `✅ 已複製（${text.length} 字）。到 AI 的對話框按 Ctrl+V／⌘V 貼上。` : '⚠️ 瀏覽器不允許自動複製，請在下面的框內全選後手動複製。';
            if (!ok) { preview.focus(); preview.select(); }
        };
        erow.appendChild(button('一鍵複製：全部紀錄', '', doCopy(0)));
        erow.appendChild(button('一鍵複製：最近 7 天', 'secondary', doCopy(7)));
        erow.appendChild(button('一鍵複製：最近 1 天', 'secondary', doCopy(1)));
        exp.appendChild(erow);
        exp.appendChild(status);
        preview.hidden = true;
        exp.appendChild(preview);
        root.appendChild(exp);

        // 模擬考紀錄
        const exams = sectionBlock('模擬段考與診斷紀錄');
        if (!state.exams.length) exams.appendChild(h('p', 'trainer-note', '還沒有紀錄。'));
        state.exams.slice().reverse().forEach(e => {
            const d = new Date(e.t);
            const label = `${d.getMonth() + 1}/${d.getDate()} ${e.diag ? '診斷' : '模擬'}｜${C.SCOPE_LABELS[e.scope]} ${C.MOCK[e.kind].label}`;
            exams.appendChild(barRow(label, e.score, 100, `${e.score} 分・${Math.round(e.usedSec / 60)} 分鐘`));
        });
        root.appendChild(exams);

        // 各單元統計
        C.UNITS.filter(u => core.hasUnit(u.key)).forEach(u => {
            const us = core.unitState(u.key);
            const unit = core.data.units[u.key];
            const sec = sectionBlock(`${unit.title}：各文法點與各題型正確率`, '只計每一題第一次作答。「粗心」是文法對但大小寫或標點錯。');
            const grid = h('div', 'trainer-report-grid');
            const a = h('div', '');
            a.appendChild(h('h3', 'concept-heading', '文法點'));
            unit.points.forEach(p => { const s = us.stat.point[p.id]; if (s && s.n) a.appendChild(barRow(p.label, s.ok, s.n, `${C.pct(s.ok, s.n)}%（${s.ok}/${s.n}）${s.careless ? `・粗心 ${s.careless}` : ''}`)); });
            if (a.childNodes.length === 1) a.appendChild(h('p', 'trainer-note', '還沒有紀錄。'));
            const b = h('div', '');
            b.appendChild(h('h3', 'concept-heading', '題型'));
            C.FORMATS.forEach(f => { const s = us.stat.format[f.id]; if (s && s.n) b.appendChild(barRow(f.label, s.ok, s.n, `${C.pct(s.ok, s.n)}%（${s.ok}/${s.n}）${s.careless ? `・粗心 ${s.careless}` : ''}`)); });
            if (b.childNodes.length === 1) b.appendChild(h('p', 'trainer-note', '還沒有紀錄。'));
            grid.appendChild(a); grid.appendChild(b);
            sec.appendChild(grid);
            sec.appendChild(h('p', 'trainer-note', `錯題本 ${core.wrongIds(u.key, false).length} 題（今天到期 ${core.wrongIds(u.key, true).length} 題），已畢業 ${us.mastered} 題。`));
            root.appendChild(sec);
        });

        // 申訴
        const disp = sectionBlock('孩子認為自己答對的題目', '打字題的正確寫法很多，系統可能漏列。孩子按下「我覺得我是對的」之後，那一題當下就先算答對（避免挫折），並記在這裡。請看看孩子的寫法是否其實正確（也可以把上面的做題歷程貼給 AI 幫忙判斷）。');
        if (!state.disputes.length) disp.appendChild(h('p', 'trainer-note', '目前沒有。'));
        state.disputes.slice().reverse().slice(0, 30).forEach(d => {
            const item = core.data.items.get(d.id);
            if (!item) return;
            const row = h('div', 'trainer-dispute');
            row.appendChild(h('p', 'trainer-review-q', core.itemPlain(item)));
            row.appendChild(h('p', 'trainer-part', `孩子寫：${d.a}${d.ok ? '　（已先算答對）' : ''}`));
            row.appendChild(h('p', 'trainer-answer', `系統正解：${core.correctText(item)}`));
            disp.appendChild(row);
        });
        root.appendChild(disp);

        // 進度備份
        const backup = sectionBlock('進度備份', '練習進度只存在這台電腦的這個瀏覽器。換電腦或清除瀏覽資料前，先匯出備份。');
        const brow = h('div', 'trainer-row');
        const area = h('textarea', 'trainer-export', null, { rows: '4', placeholder: '匯入時，把之前匯出的備份內容貼在這裡', 'aria-label': '進度備份內容' });
        const bstatus = h('p', 'trainer-note', '');
        brow.appendChild(button('匯出進度（複製並下載）', 'secondary', async () => {
            const text = core.exportProgress();
            area.value = text;
            const ok = await copyText(text);
            try {
                const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
                const a = h('a', '', null, { href: url, download: `段考特訓進度_${bridge.getLocalDateString()}.json` });
                document.body.appendChild(a); a.click(); a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 2000);
            } catch (e) { /* 下載失敗時仍可從文字框複製 */ }
            bstatus.textContent = ok ? '✅ 已複製到剪貼簿，並下載成檔案。' : '已顯示在下面的框內，請手動複製保存。';
        }));
        brow.appendChild(button('匯入進度', 'secondary', async () => {
            if (!area.value.trim()) { bstatus.textContent = '請先把備份內容貼到下面的框內。'; area.focus(); return; }
            const ok = await bridge.showDialog({ title: '要匯入進度嗎？', message: '目前這個瀏覽器裡的段考特訓進度會被備份內容取代（點數不受影響）。', confirmText: '匯入', cancelText: '取消', focusCancel: true });
            if (!ok) return;
            try { core.importProgress(area.value); bstatus.textContent = '✅ 匯入完成。'; renderReport(); }
            catch (e) { bstatus.textContent = `⚠️ 匯入失敗：${e.message || '內容格式不正確'}`; }
        }));
        backup.appendChild(brow);
        backup.appendChild(bstatus);
        backup.appendChild(area);
        root.appendChild(backup);
    }

    // ---------- 進入與離開 ----------
    function stopTimers() {
        if (examTimer) { clearInterval(examTimer); examTimer = null; }
        if (examSaveTimer) { clearTimeout(examSaveTimer); examSaveTimer = null; }
    }

    function onKeyDown(event) {
        if (view !== 'session' || !session || !session.current || bridge.isAnyModalOpen()) return;
        if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
        const target = event.target;
        if (target instanceof HTMLElement && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
        const single = session.current.single;
        if (!single || !single.pickIndex || session.current.phase() !== 'answer') return;
        const key = event.key.toLowerCase();
        const index = '1234'.includes(key) && key.length === 1 ? Number(key) - 1 : 'abcd'.indexOf(key);
        if (key.length === 1 && index >= 0) { event.preventDefault(); single.pickIndex(index); }
    }

    async function start(bridgeApi, listInfo) {
        bridge = bridgeApi;
        root = document.getElementById('trainer-container');
        const token = ++startToken;
        const unitDef = C.UNITS.find(u => u.path === listInfo.path) || C.UNITS[0];
        unitKey = unitDef.key;
        setView('loading');
        clearRoot();
        root.appendChild(h('p', 'trainer-loading', '題庫載入中…'));

        core = C.createCore({
            read: bridge.readStorage, write: bridge.writeStorage,
            today: () => bridge.getLocalDateString(), now: () => Date.now(), shuffle, bridge,
        });
        core.load();
        try {
            const results = await Promise.allSettled(C.UNITS.map(u => bridge.fetchJson(u.path)));
            if (token !== startToken) return;
            results.forEach((r, i) => { if (r.status === 'fulfilled' && r.value && Array.isArray(r.value.items)) core.addUnit(C.UNITS[i].key, r.value); });
            if (!core.hasUnit(unitKey)) throw new Error('missing');
        } catch (e) {
            if (token !== startToken) return;
            await bridge.showDialog({ title: '載入失敗', message: `無法載入「${listInfo.name}」的題庫，請檢查網路後再試一次。` });
            bridge.exit();
            return;
        }
        if (!keyHandler) { keyHandler = onKeyDown; document.addEventListener('keydown', keyHandler); }
        renderHub();
    }

    function stop() {
        startToken++;
        stopTimers();
        if (session && session.persist) session.persist();
        else if (core && core.getState()) core.save();
        if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }
        stopReading();
        session = null;
        view = '';
        if (root) root.innerHTML = '';
    }

    // 作答途中（一般練習或考試）離站要先確認
    function isBusy() { return view === 'session' || view === 'exam'; }

    window.TrainerMode = { start, stop, isBusy };
})();
