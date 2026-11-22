// 英打練習：打字打怪闖關。畫面與規則都在這個檔案，透過 script.js 傳進來的 bridge 使用共用工具與點數。
// 對外：window.TypingMode = { start, stop, isBusy, REWARDS }
(function () {
    'use strict';

    // ---------- 規則 ----------
    const REWARDS = { FIRST_CLEAR: 10, DAILY_CLEAR: 3, DAILY_ACCURACY: 2, ACCURACY_TARGET: 0.95, DAILY_CAP: 15 };
    const BEST_KEY = 'englishTyping_best_v1';
    const SOUND_KEY = 'englishTyping_sound';
    const MAX_HEARTS = 3;
    // 連擊越高，每一下打得越痛
    const COMBO_TIERS = [{ at: 50, mult: 4 }, { at: 25, mult: 3 }, { at: 10, mult: 2 }, { at: 0, mult: 1 }];

    // 每一關打三隻：兩隻小怪加一隻魔王。fill 是「攻擊倒數」從空到滿的秒數，越小越緊張
    const WAVES = [{ hp: 60, fill: 16 }, { hp: 100, fill: 14 }, { hp: 150, fill: 12, boss: true }];
    // 小怪每一場隨機抽兩隻，每次玩都不太一樣
    const MINIONS = [
        { emoji: '👾', name: '鍵盤小怪' }, { emoji: '🦖', name: '亂碼暴龍' }, { emoji: '👻', name: '漏字幽靈' },
        { emoji: '🦇', name: '錯鍵蝙蝠' }, { emoji: '🕷️', name: '亂敲蜘蛛' }, { emoji: '🦂', name: '標點毒蠍' },
        { emoji: '🐙', name: '八爪亂打怪' }, { emoji: '🧟', name: '拼錯殭屍' }, { emoji: '🦀', name: '橫行螃蟹' },
        { emoji: '🐍', name: '繞路大蛇' }, { emoji: '🤖', name: '當機機器人' }, { emoji: '🦑', name: '墨水烏賊' },
        { emoji: '🐊', name: '咬字鱷魚' }, { emoji: '🦍', name: '重拳猩猩' }, { emoji: '🐺', name: '搶拍野狼' },
        { emoji: '🦏', name: '橫衝犀牛' },
    ];
    // 每一關有自己的魔王
    const BOSSES = {
        home: { emoji: '👹', name: '鍵位大王' },
        top: { emoji: '🦅', name: '高空魔鷹' },
        bottom: { emoji: '🦈', name: '深海巨鯊' },
        words: { emoji: '🧙', name: '咒語巫師' },
        vocab: { emoji: '🐲', name: '錯字魔龍' },
    };
    let lastMinions = []; // 上一場出過的小怪，下一場盡量不重複

    function pickMonsters(levelId) {
        const fresh = shuffle(MINIONS.filter(m => !lastMinions.includes(m.name)));
        const minions = fresh.slice(0, WAVES.length - 1);
        lastMinions = minions.map(m => m.name);
        return WAVES.map((wave, i) => ({ ...wave, ...(wave.boss ? BOSSES[levelId] || BOSSES.vocab : minions[i]) }));
    }

    const LEVELS = {
        home: {
            name: '基本鍵位',
            intro: '手指放在 A S D F 和 J K L ; 上，這一排是每根手指的「家」。',
            words: ['asdf', 'jkl;', 'fjfj', 'dkdk', 'slsl', 'a;a;', 'dad', 'sad', 'lad', 'all', 'ask', 'add', 'fall', 'lass', 'had', 'has', 'glad', 'half', 'hall', 'dash', 'flash', 'shall', 'glass', 'salad', 'flask', 'a lad', 'a salad', 'ask dad', 'all fall', 'dad has a flag'],
        },
        top: {
            name: '上排鍵',
            intro: '打上排時手指往上伸，打完要回到 A S D F 和 J K L ; 。',
            words: ['the', 'you', 'your', 'type', 'quiet', 'water', 'today', 'study', 'write', 'party', 'hurry', 'after', 'their', 'sister', 'father', 'eight', 'house', 'light', 'right', 'read', 'words', 'weather', 'story', 'order', 'future', 'yellow', 'should', 'teeth', 'great', 'these', 'those', 'little', 'people', 'quite', 'tired', 'together'],
        },
        bottom: {
            name: '下排鍵',
            intro: '打下排時手指往下彎，手腕不要跟著移動。',
            words: ['zoo', 'box', 'very', 'move', 'name', 'back', 'come', 'next', 'exam', 'buzz', 'mix', 'cabin', 'music', 'number', 'monkey', 'banana', 'camera', 'visit', 'brave', 'cover', 'voice', 'between', 'change', 'example', 'machine', 'vacation', 'excited', 'amazing', 'lazy', 'zebra', 'knock', 'black', 'climb', 'movie', 'because'],
        },
        words: {
            name: '常用單字',
            intro: '眼睛看畫面、不要看鍵盤，照著指法圖慢慢打，準確比快重要。',
            words: ['about', 'again', 'always', 'animal', 'answer', 'before', 'better', 'breakfast', 'brother', 'children', 'different', 'dinner', 'early', 'every', 'family', 'favorite', 'friend', 'garden', 'happy', 'homework', 'important', 'kitchen', 'library', 'morning', 'mother', 'never', 'often', 'picture', 'question', 'school', 'something', 'teacher', 'thank you', 'tomorrow', 'usually', 'weekend', 'window', 'yesterday', 'good morning', 'see you later'],
        },
        vocab: {
            name: '課本單字',
            intro: '這一關的字都是課本單元的單字，順便複習拼法。',
            words: [], // 開始時從開放中的單字拼寫單元載入
        },
    };

    // ---------- 指法 ----------
    const FINGERS = {
        lp: { hand: '左手', name: '小指' }, lr: { hand: '左手', name: '無名指' }, lm: { hand: '左手', name: '中指' }, li: { hand: '左手', name: '食指' },
        ri: { hand: '右手', name: '食指' }, rm: { hand: '右手', name: '中指' }, rr: { hand: '右手', name: '無名指' }, rp: { hand: '右手', name: '小指' },
        th: { hand: '左右手', name: '大拇指' },
    };
    const KEY_ROWS = [
        [['q', 'lp'], ['w', 'lr'], ['e', 'lm'], ['r', 'li'], ['t', 'li'], ['y', 'ri'], ['u', 'ri'], ['i', 'rm'], ['o', 'rr'], ['p', 'rp']],
        [['a', 'lp'], ['s', 'lr'], ['d', 'lm'], ['f', 'li'], ['g', 'li'], ['h', 'ri'], ['j', 'ri'], ['k', 'rm'], ['l', 'rr'], [';', 'rp'], ["'", 'rp']],
        [['z', 'lp'], ['x', 'lr'], ['c', 'lm'], ['v', 'li'], ['b', 'li'], ['n', 'ri'], ['m', 'ri'], [',', 'rm'], ['.', 'rr'], ['/', 'rp']],
    ];
    const FINGER_OF = { ' ': 'th' };
    KEY_ROWS.forEach(row => row.forEach(([key, finger]) => { FINGER_OF[key] = finger; }));
    // 用實體按鍵位置（event.code）判斷，開著中文輸入法也能正常玩
    const CODE_TO_CHAR = { Space: ' ', Semicolon: ';', Quote: "'", Comma: ',', Period: '.', Slash: '/' };
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(c => { CODE_TO_CHAR[`Key${c.toUpperCase()}`] = c; });
    const HOME_KEYS = new Set(['a', 's', 'd', 'f', 'j', 'k', 'l', ';']);
    const TYPABLE = /^[a-z;',./ ]+$/;

    // ---------- 狀態 ----------
    let bridge = null;
    let root = null;
    let level = null;      // { id, name }
    let game = null;       // 一場遊戲的狀態；結算或離開後為 null
    let els = null;        // 這一場畫面上會更新的元素
    let frameId = 0;
    let audioCtx = null;
    let soundOn = true;
    let startToken = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function h(tag, cls, text, attrs) {
        const node = document.createElement(tag);
        if (cls) node.className = cls;
        if (text !== undefined && text !== null) node.textContent = text;
        if (attrs) for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
        return node;
    }
    function shuffle(list) {
        const a = list.slice();
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        return a;
    }
    function multiplierOf(combo) { return COMBO_TIERS.find(t => combo >= t.at).mult; }

    // ---------- 音效（程式合成，不需要音檔） ----------
    function tone(freq, duration, { type = 'square', volume = 0.06, slideTo = 0, delay = 0 } = {}) {
        if (!soundOn) return;
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const t0 = audioCtx.currentTime + delay;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, t0);
            if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
            gain.gain.setValueAtTime(volume, t0);
            gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
            osc.connect(gain).connect(audioCtx.destination);
            osc.start(t0);
            osc.stop(t0 + duration + 0.02);
        } catch (e) { /* 沒有音效不影響遊戲 */ }
    }
    const sfx = {
        hit: combo => tone(420 + Math.min(combo, 40) * 14, 0.07, { type: 'square', volume: 0.05 }),
        miss: () => tone(140, 0.16, { type: 'sawtooth', volume: 0.07, slideTo: 90 }),
        word: () => { tone(660, 0.09, { type: 'triangle', volume: 0.09 }); tone(990, 0.14, { type: 'triangle', volume: 0.09, delay: 0.08 }); },
        tier: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.1, { type: 'square', volume: 0.06, delay: i * 0.06 })); },
        kill: () => { tone(300, 0.35, { type: 'sawtooth', volume: 0.1, slideTo: 50 }); tone(880, 0.25, { type: 'triangle', volume: 0.08, delay: 0.12 }); },
        hurt: () => tone(200, 0.4, { type: 'sawtooth', volume: 0.12, slideTo: 60 }),
        win: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.18, { type: 'triangle', volume: 0.09, delay: i * 0.11 })); },
        lose: () => { [392, 330, 262].forEach((f, i) => tone(f, 0.25, { type: 'triangle', volume: 0.09, delay: i * 0.18 })); },
    };

    // ---------- 題目 ----------
    async function loadVocabWords() {
        const results = await Promise.allSettled(bridge.getVocabPaths().map(path => bridge.fetchJson(path)));
        const words = new Set();
        results.forEach(r => {
            if (r.status !== 'fulfilled') return;
            const list = Array.isArray(r.value) ? r.value : (r.value && Array.isArray(r.value.words) ? r.value.words : []);
            list.forEach(entry => {
                const word = String((entry && entry.english) || '').toLowerCase().replace(/\s+/g, ' ').trim();
                if (word.length >= 2 && word.length <= 18 && TYPABLE.test(word)) words.add(word);
            });
        });
        return [...words];
    }

    // ---------- 進入 ----------
    async function start(bridgeApi, listInfo) {
        bridge = bridgeApi;
        root = document.getElementById('typing-container');
        const token = ++startToken;
        const id = String(listInfo.path).replace(/^typing:/, '');
        level = { id: LEVELS[id] ? id : 'home', name: listInfo.name };
        soundOn = bridge.readStorage(SOUND_KEY) !== 'off';
        endLoop();
        game = null;
        document.removeEventListener('keydown', onKeyDown); // 「挑戰下一關」會再呼叫一次 start，避免重複掛上
        document.addEventListener('keydown', onKeyDown);
        const def = LEVELS[level.id];
        if (level.id === 'vocab' && def.words.length === 0) {
            root.innerHTML = '';
            root.appendChild(h('p', 'typing-loading', '單字載入中…'));
            const words = await loadVocabWords();
            if (token !== startToken) return;
            // 載不到課本單字時用常用單字頂替，還是可以練
            def.words = words.length >= 10 ? words : LEVELS.words.words;
        }
        renderIntro();
    }

    function stop() {
        startToken++;
        endLoop();
        document.removeEventListener('keydown', onKeyDown);
        game = null;
        els = null;
        if (root) root.innerHTML = '';
    }

    // 只有開打之後才算「練習中」（離站前要確認）
    function isBusy() { return Boolean(game && game.phase === 'play'); }

    function endLoop() { if (frameId) { cancelAnimationFrame(frameId); frameId = 0; } }

    // ---------- 開始前：姿勢與指法提醒 ----------
    function renderIntro() {
        endLoop();
        game = { phase: 'intro' };
        els = null;
        root.innerHTML = '';
        const box = h('div', 'typing-intro');
        box.appendChild(h('h1', 'typing-title', `英打練習｜${level.name}`));
        box.appendChild(h('p', 'typing-intro-lead', LEVELS[level.id].intro));
        const tips = h('ul', 'typing-tips');
        ['每按一個正確的鍵，就打怪獸一下；連續打對會累積連擊，傷害加倍。',
            '怪獸頭上的「攻擊倒數」滿了會扣一顆愛心，打完一個字可以把它打退。',
            '打錯不會前進，連擊會歸零。看畫面下方亮起來的鍵和手指，用正確的手指按。',
            '打倒三隻怪獸就過關，三顆愛心用完就失敗。'].forEach(t => tips.appendChild(h('li', '', t)));
        box.appendChild(tips);
        const best = readBest()[level.id];
        if (best) box.appendChild(h('p', 'typing-best', `🏅 最佳紀錄：每分鐘 ${best.wpm} 字・準確率 ${best.acc}%・${'★'.repeat(best.stars)}${'☆'.repeat(3 - best.stars)}`));
        box.appendChild(buildGuide());
        const actions = h('div', 'typing-actions');
        const go = h('button', 'start-button typing-go', '按空白鍵開始', { type: 'button' });
        go.addEventListener('click', beginGame);
        actions.appendChild(go);
        const back = h('button', 'start-button secondary', '返回主選單', { type: 'button' });
        back.addEventListener('click', () => bridge.exit());
        actions.appendChild(back);
        box.appendChild(actions);
        root.appendChild(box);
        setGuideTarget(' ');
        go.focus({ preventScroll: true });
    }

    // ---------- 指法圖：鍵盤＋雙手 ----------
    function buildGuide() {
        const guide = h('div', 'typing-guide');
        const caption = h('p', 'typing-finger-caption', '', { 'aria-live': 'off' });
        guide.appendChild(caption);
        const keyboard = h('div', 'typing-keyboard', null, { 'aria-hidden': 'true' });
        const keyEls = {};
        KEY_ROWS.forEach((row, r) => {
            const rowEl = h('div', `typing-key-row row-${r}`);
            row.forEach(([key, finger]) => {
                const el = h('span', `typing-key f-${finger}${HOME_KEYS.has(key) ? ' is-home' : ''}${key === 'f' || key === 'j' ? ' has-bump' : ''}`, key.toUpperCase());
                keyEls[key] = el;
                rowEl.appendChild(el);
            });
            keyboard.appendChild(rowEl);
        });
        const spaceRow = h('div', 'typing-key-row row-3');
        keyEls[' '] = h('span', 'typing-key typing-key-space f-th', '空白鍵');
        spaceRow.appendChild(keyEls[' ']);
        keyboard.appendChild(spaceRow);
        guide.appendChild(keyboard);

        // 雙手：每根手指一個圓角長條，該用哪一根就亮哪一根
        const NS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', '0 0 520 128');
        svg.setAttribute('class', 'typing-hands');
        svg.setAttribute('aria-hidden', 'true');
        const fingerEls = {};
        const shape = (tag, attrs, cls) => {
            const node = document.createElementNS(NS, tag);
            Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
            if (cls) node.setAttribute('class', cls);
            svg.appendChild(node);
            return node;
        };
        // [手指代號, x, 長度]；右手是左手的鏡像
        const left = [['lp', 34, 50], ['lr', 68, 68], ['lm', 102, 78], ['li', 136, 68]];
        const drawHand = (list, palmX, thumbX, thumbAngle, label, labelX) => {
            shape('rect', { x: palmX, y: 80, width: 150, height: 44, rx: 20 }, 'typing-palm');
            list.forEach(([id, x, len]) => { fingerEls[id] = [shape('rect', { x, y: 96 - len, width: 26, height: len, rx: 13 }, `typing-finger f-${id}`)]; });
            const thumb = shape('rect', { x: thumbX, y: 56, width: 26, height: 52, rx: 13, transform: `rotate(${thumbAngle} ${thumbX + 13} 102)` }, 'typing-finger f-th');
            (fingerEls.th = fingerEls.th || []).push(thumb);
            const text = shape('text', { x: labelX, y: 112, 'text-anchor': 'middle' }, 'typing-hand-label');
            text.textContent = label;
        };
        drawHand(left, 30, 160, 50, '左手', 98);
        drawHand(left.map(([id, x, len]) => [`r${id[1]}`, 520 - x - 26, len]), 340, 334, -50, '右手', 422);
        guide.appendChild(svg);

        guide.keyEls = keyEls;
        guide.fingerEls = fingerEls;
        guide.caption = caption;
        root.guide = guide;
        return guide;
    }

    // 標出下一個要按的鍵和該用的手指
    function setGuideTarget(char) {
        const guide = root.guide;
        if (!guide) return;
        Object.values(guide.keyEls).forEach(el => el.classList.remove('is-next'));
        Object.values(guide.fingerEls).forEach(list => list.forEach(el => el.classList.remove('is-active')));
        const finger = FINGER_OF[char];
        if (!finger) { guide.caption.textContent = ''; return; }
        guide.keyEls[char].classList.add('is-next');
        guide.fingerEls[finger].forEach(el => el.classList.add('is-active'));
        const info = FINGERS[finger];
        guide.caption.textContent = '';
        guide.caption.appendChild(document.createTextNode('用 '));
        guide.caption.appendChild(h('strong', `typing-finger-name f-${finger}`, `${info.hand}${info.name}`));
        guide.caption.appendChild(document.createTextNode(` 按 ${char === ' ' ? '空白鍵' : char.toUpperCase()}`));
    }
    function flashKey(char, cls) {
        const el = root.guide && root.guide.keyEls[char];
        if (!el) return;
        el.classList.remove(cls);
        void el.offsetWidth;
        el.classList.add(cls);
        setTimeout(() => el.classList.remove(cls), 220);
    }

    // ---------- 遊戲畫面 ----------
    function beginGame() {
        endLoop();
        const pool = LEVELS[level.id].words;
        game = {
            phase: 'play', queue: shuffle(pool), word: '', pos: 0, monsters: pickMonsters(level.id),
            monsterIndex: -1, hp: 0, maxHp: 0, gauge: 0, fill: 16, graceUntil: 0,
            hearts: MAX_HEARTS, combo: 0, maxCombo: 0, correct: 0, wrong: 0, score: 0, words: 0,
            activeMs: 0, lastFrame: 0, armed: false, // armed：按下第一個鍵之後才開始計時與倒數
        };
        root.innerHTML = '';
        const stage = h('div', 'typing-stage');

        const top = h('div', 'typing-top');
        top.appendChild(h('span', 'typing-level-name', level.name));
        const hearts = h('span', 'typing-hearts', '', { 'aria-label': '剩餘愛心' });
        const wave = h('span', 'typing-wave');
        const score = h('span', 'typing-score');
        top.appendChild(hearts);
        top.appendChild(wave);
        top.appendChild(score);
        const soundBtn = h('button', 'typing-icon-btn', '', { type: 'button' });
        const renderSound = () => { soundBtn.textContent = soundOn ? '🔊' : '🔇'; soundBtn.setAttribute('aria-label', soundOn ? '關閉音效' : '開啟音效'); soundBtn.title = soundOn ? '關閉音效' : '開啟音效'; };
        soundBtn.addEventListener('click', () => { soundOn = !soundOn; bridge.writeStorage(SOUND_KEY, soundOn ? 'on' : 'off'); renderSound(); soundBtn.blur(); });
        renderSound();
        top.appendChild(soundBtn);
        const quitBtn = h('button', 'quit-button', '離開', { type: 'button' });
        quitBtn.addEventListener('click', () => { quitBtn.blur(); confirmQuit(); });
        top.appendChild(quitBtn);
        stage.appendChild(top);

        const arena = h('div', 'typing-arena');
        const gaugeWrap = h('div', 'typing-gauge');
        gaugeWrap.appendChild(h('span', 'typing-gauge-label', '⚠️ 攻擊倒數'));
        const gaugeTrack = h('div', 'typing-gauge-track');
        const gaugeFill = h('div', 'typing-gauge-fill');
        gaugeTrack.appendChild(gaugeFill);
        gaugeWrap.appendChild(gaugeTrack);
        arena.appendChild(gaugeWrap);
        const monster = h('div', 'typing-monster', '', { 'aria-hidden': 'true' });
        arena.appendChild(monster);
        const monsterName = h('div', 'typing-monster-name');
        arena.appendChild(monsterName);
        const hpTrack = h('div', 'typing-hp-track');
        const hpFill = h('div', 'typing-hp-fill');
        hpTrack.appendChild(hpFill);
        arena.appendChild(hpTrack);
        const combo = h('div', 'typing-combo');
        arena.appendChild(combo);
        const banner = h('div', 'typing-banner', '', { 'aria-hidden': 'true' });
        arena.appendChild(banner);
        const fx = h('div', 'typing-fx', null, { 'aria-hidden': 'true' });
        arena.appendChild(fx);
        stage.appendChild(arena);

        const wordZone = h('div', 'typing-word-zone');
        const word = h('div', 'typing-word', '', { 'aria-label': '要打的字' });
        const next = h('div', 'typing-next');
        const hint = h('div', 'typing-start-hint', '按下第一個鍵就開始！');
        wordZone.appendChild(word);
        wordZone.appendChild(next);
        wordZone.appendChild(hint);
        stage.appendChild(wordZone);
        stage.appendChild(buildGuide());
        root.appendChild(stage);

        els = { stage, arena, hearts, wave, score, gaugeFill, gaugeWrap, monster, monsterName, hpFill, combo, banner, fx, word, next, hint };
        nextMonster();
        nextWord();
        renderHud();
        game.lastFrame = performance.now();
        frameId = requestAnimationFrame(loop);
    }

    function renderHud() {
        els.hearts.textContent = '❤️'.repeat(game.hearts) + '🖤'.repeat(MAX_HEARTS - game.hearts);
        els.wave.textContent = `第 ${game.monsterIndex + 1} / ${game.monsters.length} 隻`;
        els.score.textContent = `⭐ ${game.score}`;
        els.hpFill.style.width = `${Math.max(0, game.hp / game.maxHp) * 100}%`;
        const mult = multiplierOf(game.combo);
        els.combo.textContent = '';
        if (game.combo >= 3) {
            els.combo.appendChild(h('span', 'typing-combo-count', String(game.combo)));
            els.combo.appendChild(h('span', 'typing-combo-label', mult > 1 ? `連擊 ×${mult}` : '連擊'));
        }
        els.combo.dataset.mult = String(mult);
    }
    function renderGauge() {
        els.gaugeFill.style.width = `${Math.min(1, game.gauge) * 100}%`;
        els.gaugeWrap.classList.toggle('is-danger', game.gauge >= 0.7);
    }
    function renderWord() {
        els.word.textContent = '';
        game.word.split('').forEach((ch, i) => {
            const cls = i < game.pos ? 'done' : i === game.pos ? 'current' : 'todo';
            els.word.appendChild(h('span', `typing-char ${cls}${ch === ' ' ? ' is-space' : ''}`, ch === ' ' ? '␣' : ch));
        });
        els.next.textContent = `下一個：${game.queue[0] || ''}`;
        setGuideTarget(game.word[game.pos]);
    }

    function nextWord() {
        if (game.queue.length < 2) game.queue = game.queue.concat(shuffle(LEVELS[level.id].words).filter(w => w !== game.word));
        game.word = game.queue.shift();
        game.pos = 0;
        renderWord();
    }
    function nextMonster() {
        game.monsterIndex++;
        const m = game.monsters[game.monsterIndex];
        game.hp = game.maxHp = m.hp;
        game.fill = m.fill;
        game.gauge = 0;
        game.graceUntil = performance.now() + 900; // 新怪獸登場時先不倒數
        els.monster.textContent = m.emoji;
        els.monster.className = `typing-monster${m.boss ? ' is-boss' : ''} is-enter`;
        els.monsterName.textContent = m.boss ? `👑 魔王　${m.name}` : m.name;
        renderGauge();
    }

    // ---------- 主迴圈：攻擊倒數 ----------
    function loop(now) {
        frameId = requestAnimationFrame(loop);
        if (!game || game.phase !== 'play') return;
        const dt = Math.min(100, now - game.lastFrame);
        game.lastFrame = now;
        // 還沒開打、視窗開著、切到別的分頁時都不倒數
        if (!game.armed || bridge.isAnyModalOpen() || document.hidden) return;
        game.activeMs += dt;
        if (now < game.graceUntil) return;
        game.gauge += dt / 1000 / game.fill;
        if (game.gauge >= 1) monsterAttack();
        renderGauge();
    }

    function monsterAttack() {
        game.gauge = 0;
        game.hearts--;
        game.combo = 0;
        game.lostHeart = true;
        sfx.hurt();
        restartClass(els.stage, 'is-hurt');
        restartClass(els.monster, 'is-attack');
        showBanner('被打到了！', 'bad');
        renderHud();
        if (game.hearts <= 0) finish(false);
    }

    // ---------- 按鍵 ----------
    function onKeyDown(event) {
        if (!game || bridge.isAnyModalOpen()) return;
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        const target = event.target;
        const onButton = target instanceof HTMLElement && target.tagName === 'BUTTON';
        if (game.phase === 'intro') {
            if (event.code === 'Space' && !onButton) { event.preventDefault(); beginGame(); }
            return;
        }
        if (game.phase === 'result') return;
        if (event.key === 'Escape') { event.preventDefault(); confirmQuit(); return; }
        const char = CODE_TO_CHAR[event.code] || (event.key.length === 1 ? event.key.toLowerCase() : '');
        if (!char || !FINGER_OF[char]) return;
        event.preventDefault(); // 空白鍵不捲頁、引號不觸發瀏覽器的快速搜尋
        if (event.repeat) return;
        if (!game.armed) { game.armed = true; game.lastFrame = performance.now(); els.hint.hidden = true; }
        if (char === game.word[game.pos]) hitKey(char);
        else missKey(char);
    }

    function hitKey(char) {
        const beforeMult = multiplierOf(game.combo);
        game.combo++;
        game.maxCombo = Math.max(game.maxCombo, game.combo);
        game.correct++;
        const mult = multiplierOf(game.combo);
        game.pos++;
        game.gauge = Math.max(0, game.gauge - 0.02);
        flashKey(char, 'is-hit');
        sfx.hit(game.combo);
        if (mult > beforeMult) { sfx.tier(); showBanner(`連擊 ×${mult}！`, 'good'); }
        const wordDone = game.pos >= game.word.length;
        let damage = mult;
        if (wordDone) {
            // 打完一個字：追加一擊，並把怪獸的攻擊倒數打退
            damage += Math.ceil(game.word.length / 2) * mult;
            game.words++;
            game.gauge = Math.max(0, game.gauge - 0.45);
            sfx.word();
        }
        dealDamage(damage, wordDone);
        if (!game || game.phase !== 'play') return;
        if (wordDone) nextWord(); else renderWord();
        renderHud();
        renderGauge();
        restartClass(els.combo, 'is-bump');
    }

    function missKey(char) {
        game.wrong++;
        game.combo = 0;
        game.gauge = Math.min(0.999, game.gauge + 0.06);
        sfx.miss();
        flashKey(char, 'is-miss');
        restartClass(els.word, 'is-miss');
        renderHud();
        renderGauge();
    }

    function dealDamage(damage, heavy) {
        game.hp -= damage;
        game.score += damage * 10;
        restartClass(els.monster, heavy ? 'is-hit-heavy' : 'is-hit');
        popNumber(damage, heavy);
        sparks(heavy ? 10 : 4);
        if (heavy) restartClass(els.arena, 'is-shake');
        if (game.hp > 0) return;
        // 打倒了
        sfx.kill();
        sparks(22, true);
        restartClass(els.arena, 'is-shake-big');
        if (game.monsterIndex + 1 >= game.monsters.length) { renderHud(); finish(true); return; }
        showBanner('擊倒！', 'good');
        nextMonster();
    }

    // ---------- 特效 ----------
    const FX_CLASSES = ['is-hit', 'is-hit-heavy', 'is-attack', 'is-enter', 'is-shake', 'is-shake-big', 'is-hurt', 'is-bump', 'is-miss'];
    function restartClass(el, cls) {
        el.classList.remove(...FX_CLASSES); // 同一個元素一次只播一種特效，後來的蓋掉前面的
        void el.offsetWidth; // 強制重排，讓同一個動畫可以連續重播
        el.classList.add(cls);
    }
    function showBanner(text, tone) {
        els.banner.textContent = text;
        els.banner.className = `typing-banner tone-${tone}`;
        restartClass(els.banner, 'is-show');
    }
    function popNumber(damage, heavy) {
        const el = h('span', `typing-damage${heavy ? ' is-heavy' : ''}`, `-${damage}`);
        el.style.left = `${50 + (Math.random() - 0.5) * 26}%`;
        el.style.top = `${38 + (Math.random() - 0.5) * 16}%`;
        els.fx.appendChild(el);
        setTimeout(() => el.remove(), 700);
    }
    function sparks(count, big) {
        if (reducedMotion.matches) return;
        for (let i = 0; i < count; i++) {
            const el = h('span', 'typing-spark', ['✦', '★', '✸', '•'][i % 4]);
            el.style.left = '50%';
            el.style.top = '45%';
            els.fx.appendChild(el);
            const angle = Math.random() * Math.PI * 2;
            const dist = (big ? 90 : 46) + Math.random() * (big ? 110 : 54);
            const anim = el.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(0.2)`, opacity: 0 },
            ], { duration: big ? 650 : 380, easing: 'cubic-bezier(0.1, 0.7, 0.3, 1)' });
            const done = () => el.remove();
            anim.finished.then(done, done);
        }
    }

    // ---------- 離開 ----------
    async function confirmQuit() {
        if (!game || game.phase !== 'play') { bridge.exit(); return; }
        const ok = await bridge.showDialog({ title: '要離開這一關嗎？', message: '這一關的進度不會保留，也拿不到這一關的點數。', confirmText: '離開', cancelText: '繼續打', focusCancel: true });
        if (ok) bridge.exit();
        else if (game) game.lastFrame = performance.now();
    }

    // ---------- 結算 ----------
    function readBest() {
        try { const v = JSON.parse(bridge.readStorage(BEST_KEY) || '{}'); return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; }
    }

    // 回傳這次拿到的點數明細 [{ label, points }]
    function grantRewards(accuracy) {
        const ledger = bridge.getLedger();
        const today = bridge.getLocalDateString();
        if (!ledger.daily || ledger.daily.date !== today || typeof ledger.daily.flags !== 'object' || !ledger.daily.flags) ledger.daily = { date: today, points: 0, flags: {} };
        const got = [];
        const give = (points, label) => { if (points > 0) { bridge.grantPoints(points, `「${level.name}」${label}`); got.push({ label, points }); } };
        if (!ledger.once[level.id]) { ledger.once[level.id] = today; give(REWARDS.FIRST_CLEAR, '第一次過關'); }
        const daily = (flag, points, label) => {
            if (ledger.daily.flags[flag]) return;
            ledger.daily.flags[flag] = true;
            const allowed = Math.max(0, Math.min(points, REWARDS.DAILY_CAP - ledger.daily.points));
            ledger.daily.points += allowed;
            give(allowed, label);
        };
        daily(`clear:${level.id}`, REWARDS.DAILY_CLEAR, '今日過關');
        if (accuracy >= REWARDS.ACCURACY_TARGET) daily(`acc:${level.id}`, REWARDS.DAILY_ACCURACY, `準確率 ${Math.round(REWARDS.ACCURACY_TARGET * 100)}% 以上`);
        bridge.saveLedger();
        return got;
    }

    function finish(won) {
        endLoop();
        const total = game.correct + game.wrong;
        const accuracy = total ? game.correct / total : 0;
        const minutes = Math.max(game.activeMs, 1000) / 60000;
        const wpm = Math.round(game.correct / 5 / minutes);
        const stars = !won ? 0 : (accuracy >= 0.95 && !game.lostHeart ? 3 : accuracy >= 0.9 ? 2 : 1);
        const stats = { won, accuracy, wpm, stars, score: game.score, maxCombo: game.maxCombo, words: game.words };
        game.phase = 'result';
        (won ? sfx.win : sfx.lose)();

        let rewards = [];
        let isNewBest = false;
        if (won) {
            rewards = grantRewards(accuracy);
            const best = readBest();
            const old = best[level.id];
            const accPct = Math.round(accuracy * 100);
            if (!old || wpm > old.wpm) { isNewBest = Boolean(old); best[level.id] = { wpm, acc: accPct, stars: Math.max(stars, old ? old.stars : 0) }; }
            else if (stars > old.stars) best[level.id] = { ...old, stars };
            bridge.writeStorage(BEST_KEY, JSON.stringify(best));
        }
        // 讓最後一擊的特效播完再換畫面
        const token = startToken;
        setTimeout(() => { if (token === startToken && game && game.phase === 'result') renderResult(stats, rewards, isNewBest); }, won ? 900 : 700);
    }

    function renderResult(stats, rewards, isNewBest) {
        root.innerHTML = '';
        root.guide = null;
        const box = h('div', `typing-result${stats.won ? '' : ' is-fail'}`);
        box.appendChild(h('div', 'typing-result-icon', stats.won ? '🏆' : '💪', { 'aria-hidden': 'true' }));
        const title = h('h1', 'typing-title', stats.won ? `過關！${level.name}` : '差一點！再試一次');
        box.appendChild(title);
        if (stats.won) box.appendChild(h('div', 'typing-stars', '★'.repeat(stats.stars) + '☆'.repeat(3 - stats.stars), { 'aria-label': `${stats.stars} 顆星` }));
        else box.appendChild(h('p', 'typing-intro-lead', '愛心用完了。先求打對，速度自然會變快。'));
        const grid = h('div', 'typing-stat-grid');
        [['每分鐘字數', String(stats.wpm)], ['準確率', `${Math.round(stats.accuracy * 100)}%`], ['最高連擊', String(stats.maxCombo)], ['分數', String(stats.score)]].forEach(([label, value]) => {
            const cell = h('div', 'typing-stat');
            cell.appendChild(h('div', 'typing-stat-value', value));
            cell.appendChild(h('div', 'typing-stat-label', label));
            grid.appendChild(cell);
        });
        box.appendChild(grid);
        if (isNewBest) box.appendChild(h('p', 'typing-best', '🎉 刷新最佳紀錄！'));
        if (stats.won) {
            box.appendChild(h('p', 'typing-reward-line', rewards.length
                ? '🪙 ' + rewards.map(r => `${r.label} +${r.points}`).join('、')
                : '今天這一關的點數已經拿過了，明天再來拿！'));
            if (stats.stars < 3) box.appendChild(h('p', 'typing-tip-line', stats.accuracy < 0.95 ? `💡 準確率到 ${Math.round(REWARDS.ACCURACY_TARGET * 100)}% 而且不被打到，就能拿三顆星。` : '💡 不被怪獸打到就能拿三顆星。'));
        }
        const actions = h('div', 'typing-actions');
        const again = h('button', `start-button${stats.won ? ' secondary' : ''}`, stats.won ? '再玩一次' : '再試一次', { type: 'button' });
        again.addEventListener('click', renderIntro);
        const levels = bridge.getLevels();
        const nextLevel = stats.won ? levels[levels.findIndex(l => l.path === `typing:${level.id}`) + 1] : null;
        let primary = again;
        if (nextLevel) {
            primary = h('button', 'start-button', '挑戰下一關', { type: 'button' });
            primary.addEventListener('click', () => { bridge.selectLevel(nextLevel.path); start(bridge, nextLevel); });
            actions.appendChild(primary);
        }
        actions.appendChild(again);
        const back = h('button', 'start-button secondary', '返回主選單', { type: 'button' });
        back.addEventListener('click', () => bridge.exit());
        actions.appendChild(back);
        box.appendChild(actions);
        root.appendChild(box);
        primary.focus({ preventScroll: true });
    }

    window.TypingMode = { start, stop, isBusy, REWARDS };
})();
