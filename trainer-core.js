// 段考特訓：資料與規則層（無 DOM）。選題、判分、錯題間隔複習、點數、做題歷程、匯出。
(function (root, factory) {
    const api = factory(typeof module === 'object' && module.exports ? require('./trainer-grading.js') : root.TrainerGrading);
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.TrainerCore = api;
})(typeof self !== 'undefined' ? self : this, function (G) {
    const STORE_KEY = 'englishTrainer_v1';
    const LOG_LIMIT = 4000;
    // 每日類點數只有三種，各每天一次：完整卷及格 20＋半卷及格 10＋到期錯題全對 5
    const DAILY_CAP = 35;
    const PASS_RATE = 0.8;
    const FORMAT_ONCE = 5;   // 題型專練：每種題型第一次過關的點數

    const UNITS = [
        { key: 'u3', path: 'g8_1_unit3_trainer.json', short: 'Unit 3' },
        { key: 'u4', path: 'g8_1_unit4_trainer.json', short: 'Unit 4' },
    ];

    const FORMATS = [
        { id: 'vocab', label: '文意字彙', desc: '看句子，依首尾字母寫出整個單字', kind: 'blanks' },
        { id: 'choice', label: '語法選擇', desc: '選出文法正確的答案', kind: 'choice' },
        { id: 'dialogue', label: '對話選擇', desc: '選出最適合的回應', kind: 'choice' },
        { id: 'verbform', label: '動詞形式', desc: '把括號裡的動詞改成正確形式', kind: 'blanks' },
        { id: 'cloze', label: '克漏字', desc: '整篇文章挖空，選出正確答案', kind: 'choice', grouped: true },
        { id: 'reading', label: '閱讀測驗', desc: '讀文章回答問題', kind: 'choice', grouped: true },
        { id: 'rewrite', label: '依提示作答', desc: '照指示改寫句子', kind: 'sentence' },
        { id: 'order', label: '重組', desc: '把字塊排成正確的句子', kind: 'sentence' },
        { id: 'guided', label: '引導式翻譯', desc: '看中文，一格填一個字', kind: 'blanks' },
        { id: 'translate', label: '整句翻譯', desc: '把中文翻成完整的英文句子', kind: 'sentence' },
    ];
    const FORMAT_BY_ID = Object.fromEntries(FORMATS.map(f => [f.id, f]));
    const STAGE_BY_FORMAT = { choice: 1, verbform: 2, order: 2, guided: 2, rewrite: 3, translate: 3 };
    const STAGES = [
        { stage: 1, label: '第 1 階 辨認', desc: '選擇題', once: 5 },
        { stage: 2, label: '第 2 階 引導產出', desc: '動詞形式、重組、引導式翻譯', once: 7 },
        { stage: 3, label: '第 3 階 完整產出', desc: '改寫、整句翻譯', once: 10 },
    ];
    const SESSION_SIZE = 8;

    // 模擬段考藍圖：[題型, 題數（題組為篇數）, 每題配分]
    const MOCK = {
        full: {
            label: '完整卷', minutes: 45, minSeconds: 480,
            sections: [['vocab', 8, 2], ['choice', 10, 2], ['dialogue', 4, 2], ['verbform', 6, 1], ['cloze', 2, 1], ['reading', 2, 2], ['rewrite', 3, 2], ['order', 3, 2], ['guided', 3, 2], ['translate', 3, 2]],
        },
        half: {
            label: '半卷', minutes: 20, minSeconds: 240,
            sections: [['vocab', 4, 2], ['choice', 5, 2], ['dialogue', 2, 2], ['verbform', 4, 1], ['cloze', 1, 1], ['reading', 1, 2], ['rewrite', 2, 2], ['order', 1, 2], ['guided', 2, 2], ['translate', 2, 2]],
        },
    };
    const SECTION_NUMERALS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    const SCOPES = { u3: ['u3'], u4: ['u4'], u34: ['u3', 'u4'] };
    const SCOPE_LABELS = { u3: 'Unit 3', u4: 'Unit 4', u34: 'Unit 3＋4 合卷' };
    const CTX_LABELS = { diag: '診斷', concept: '觀念卡檢核', ladder: '文法點階梯', format: '題型專練', mock: '模擬段考', review: '錯題訂正', cram: '錯題總複習' };
    const VERDICT_LABELS = { ok: '對', careless: '對（粗心）', wrong: '錯', blank: '未作答' };

    function addDays(dateStr, days) {
        const [y, m, d] = dateStr.split('-').map(Number);
        const dt = new Date(y, m - 1, d + days);
        const pad = n => String(n).padStart(2, '0');
        return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
    }
    function isObj(v) { return Boolean(v) && typeof v === 'object' && !Array.isArray(v); }
    function pct(ok, n) { return n ? Math.round((ok / n) * 100) : 0; }
    function unitOf(id) { return String(id).slice(0, 2); }

    function createCore(env) {
        // env: { read(key), write(key, value), today(), now(), shuffle(arr), bridge }
        const data = { units: {}, items: new Map(), passages: new Map() };
        let state = null;

        // ---------- 存檔 ----------
        function blankState() { return { v: 1, units: {}, examInProgress: null, log: [], disputes: [] }; }
        function unitState(key) {
            if (!isObj(state.units[key])) state.units[key] = {};
            const u = state.units[key];
            for (const k of ['concepts', 'ladder', 'formats', 'wrong', 'items']) if (!isObj(u[k])) u[k] = {};
            if (!isObj(u.stat)) u.stat = {};
            if (!isObj(u.stat.point)) u.stat.point = {};
            if (!isObj(u.stat.format)) u.stat.format = {};
            if (!Array.isArray(u.exams)) u.exams = [];
            if (typeof u.mastered !== 'number') u.mastered = 0;
            return u;
        }
        function normalize(raw) {
            const s = isObj(raw) ? raw : blankState();
            if (!isObj(s.units)) s.units = {};
            if (!Array.isArray(s.log)) s.log = [];
            if (!Array.isArray(s.disputes)) s.disputes = [];
            if (!isObj(s.examInProgress)) s.examInProgress = null;
            if (!Array.isArray(s.exams)) s.exams = [];
            s.v = 1;
            return s;
        }
        function load() {
            let raw = null;
            try { raw = JSON.parse(env.read(STORE_KEY) || 'null'); } catch (e) { raw = null; }
            state = normalize(raw);
            UNITS.forEach(u => unitState(u.key));
            return state;
        }
        function save() {
            if (state.log.length > LOG_LIMIT) state.log = state.log.slice(-LOG_LIMIT);
            env.write(STORE_KEY, JSON.stringify(state));
        }

        // ---------- 題庫 ----------
        function addUnit(key, json) {
            const unit = { key, title: json.unit.title, subtitle: json.unit.subtitle || '', points: json.points || [], concepts: json.concepts || [], items: json.items || [], passages: json.passages || [] };
            unit.grammarPoints = unit.points.filter(p => !['vocab', 'reading', 'mixed'].includes(p.id));
            data.units[key] = unit;
            unit.items.forEach(it => data.items.set(it.id, it));
            unit.passages.forEach(p => data.passages.set(p.id, p));
        }
        function hasUnit(key) { return Boolean(data.units[key]); }
        function pointLabel(id) {
            for (const u of Object.values(data.units)) { const p = u.points.find(x => x.id === id); if (p) return p.label; }
            return id;
        }

        // ---------- 判分 ----------
        function isBlankAnswer(item, answer) {
            if (Array.isArray(answer)) return answer.every(a => !String(a || '').trim());
            return !String(answer || '').trim();
        }
        function correctText(item) {
            const kind = FORMAT_BY_ID[item.format].kind;
            if (kind === 'choice') return item.answer;
            if (kind === 'blanks') return item.blanks.map(b => G.expandTemplate(b.answer)[0]).join(' ／ ');
            return G.expandTemplate(item.answers[0])[0];
        }
        function altAnswers(item, limit = 4) {
            if (FORMAT_BY_ID[item.format].kind !== 'sentence') return [];
            return G.expandAll(item.answers).slice(1, limit + 1);
        }
        // 回傳 { verdict: ok|careless|wrong|blank, score 0~1, parts?, sentence?, notes }
        function gradeItem(item, answer, opts = {}) {
            const kind = FORMAT_BY_ID[item.format].kind;
            if (isBlankAnswer(item, answer)) {
                const parts = kind === 'blanks' ? item.blanks.map(b => ({ ok: false, best: G.expandTemplate(b.answer)[0], given: '' })) : undefined;
                return { verdict: 'blank', score: 0, notes: [], parts };
            }
            if (kind === 'choice') {
                const ok = answer === item.answer;
                return { verdict: ok ? 'ok' : 'wrong', score: ok ? 1 : 0, notes: [] };
            }
            if (kind === 'blanks') {
                const parts = item.blanks.map((b, i) => {
                    const r = G.gradeBlank(answer[i] || '', b.answer, item.format === 'vocab' ? { lead: b.lead, tail: b.tail } : null);
                    return { ok: r.ok, best: r.best, given: String(answer[i] || '').trim(), near: r.near, frameMismatch: r.frameMismatch };
                });
                const right = parts.filter(p => p.ok).length;
                return { verdict: right === parts.length ? 'ok' : 'wrong', score: right / parts.length, parts, notes: [] };
            }
            const s = G.gradeSentence(answer, item.answers);
            const score = s.verdict === 'ok' ? 1 : s.verdict === 'careless' ? (opts.mock ? 0.5 : 1) : 0;
            return { verdict: s.verdict, score, notes: s.notes, sentence: s };
        }
        function answerText(answer) {
            return Array.isArray(answer) ? answer.map(a => String(a || '').trim() || '（空）').join(' ／ ') : String(answer || '').trim();
        }

        // ---------- 做題紀錄、統計、錯題箱 ----------
        function bump(table, key, verdict) {
            if (!isObj(table[key])) table[key] = { n: 0, ok: 0, careless: 0 };
            table[key].n++;
            if (verdict === 'ok' || verdict === 'careless') table[key].ok++;
            if (verdict === 'careless') table[key].careless++;
        }
        // 每一題在一場練習裡只記第一次作答
        function recordAttempt({ item, ctx, answer, result, ms, due }) {
            const key = unitOf(item.id);
            const u = unitState(key);
            const right = result.verdict === 'ok' || result.verdict === 'careless';
            state.log.push({ t: env.now(), id: item.id, c: ctx, a: answerText(answer), r: result.verdict, s: Math.round(result.score * 100) / 100, ms: Math.max(0, Math.round(ms || 0)) });
            bump(u.stat.point, item.point, result.verdict);
            bump(u.stat.format, item.format, result.verdict);
            if (!isObj(u.items[item.id])) u.items[item.id] = { n: 0, ok: 0 };
            u.items[item.id].n++;
            if (right) u.items[item.id].ok++;
            u.items[item.id].last = env.today();

            const today = env.today();
            const entry = u.wrong[item.id];
            let promoted = false, graduated = false;
            // 訂正到期錯題時只要答錯一題，當天就拿不到「到期錯題全對」（中途離開也算）
            if (!right && ctx === 'review' && due) { dailyOf(key).flags.reviewMiss = true; env.bridge.saveLedger(); }
            if (!right) {
                u.wrong[item.id] = { box: 1, due: addDays(today, 1), lapses: (entry ? entry.lapses : 0) + 1, last: answerText(answer), added: entry ? entry.added : today };
            } else if (entry && ctx === 'review' && due) {
                promoted = true;
                if (entry.box >= 3) { delete u.wrong[item.id]; u.mastered++; graduated = true; }
                else { entry.box++; entry.due = addDays(today, entry.box === 2 ? 3 : 7); }
            }
            return { right, promoted, graduated };
        }
        function addDispute(item, answer) {
            state.disputes.push({ t: env.now(), id: item.id, a: answerText(answer) });
            if (state.disputes.length > 200) state.disputes = state.disputes.slice(-200);
            save();
        }

        // ---------- 選題 ----------
        function seenCount(id) { const e = unitState(unitOf(id)).items[id]; return e ? e.n : 0; }
        // 優先出沒做過／做得少的題目
        function pickLeastSeen(pool, n) {
            const shuffled = env.shuffle(pool.slice());
            shuffled.sort((a, b) => seenCount(a.id) - seenCount(b.id));
            return shuffled.slice(0, n);
        }
        function single(item) { return { passage: null, items: [item] }; }
        function ladderPool(unitKey, point, stage) {
            return data.units[unitKey].items.filter(it => it.point === point && STAGE_BY_FORMAT[it.format] === stage);
        }
        function pickLadder(unitKey, point, stage) {
            return env.shuffle(pickLeastSeen(ladderPool(unitKey, point, stage), SESSION_SIZE)).map(single);
        }
        function pickConceptCheck(unitKey, concept) {
            const listed = (concept.check || []).map(id => data.items.get(id)).filter(Boolean);
            if (listed.length >= 3) return listed.slice(0, 4).map(single);
            const pool = data.units[unitKey].items.filter(it => it.point === concept.point && ['choice', 'verbform'].includes(it.format));
            const choice = pickLeastSeen(pool.filter(it => it.format === 'choice'), 2);
            const verb = pickLeastSeen(pool.filter(it => it.format === 'verbform'), 2);
            return choice.concat(verb).map(single);
        }
        function passageGroups(unitKeys, format) {
            const groups = [];
            for (const key of unitKeys) {
                const unit = data.units[key];
                if (!unit) continue;
                for (const p of unit.passages.filter(x => x.kind === format)) {
                    const items = unit.items.filter(it => it.passage === p.id);
                    if (format === 'cloze') items.sort((a, b) => a.slot - b.slot);
                    if (items.length) groups.push({ passage: p, items });
                }
            }
            return groups;
        }
        function pickGroups(unitKeys, format, n) {
            const groups = env.shuffle(passageGroups(unitKeys, format));
            const seen = g => g.items.reduce((sum, it) => sum + seenCount(it.id), 0);
            groups.sort((a, b) => seen(a) - seen(b));
            // 合卷時各單元輪流取
            const byUnit = unitKeys.map(k => groups.filter(g => unitOf(g.passage.id) === k));
            const out = [];
            for (let i = 0; out.length < n && byUnit.some(list => list.length); i++) {
                const list = byUnit[i % byUnit.length];
                if (list.length) out.push(list.shift());
            }
            return out;
        }
        // 各文法點輪流取題，讓每個文法點都被考到
        function pickSpread(unitKeys, format, n) {
            const pool = unitKeys.flatMap(k => (data.units[k] ? data.units[k].items.filter(it => it.format === format) : []));
            const buckets = new Map();
            for (const it of pickLeastSeen(pool, pool.length)) {
                const bkey = unitOf(it.id) + ':' + it.point;
                if (!buckets.has(bkey)) buckets.set(bkey, []);
                buckets.get(bkey).push(it);
            }
            const lists = env.shuffle([...buckets.values()]);
            const out = [];
            while (out.length < n && lists.some(l => l.length)) {
                for (const l of lists) { if (out.length < n && l.length) out.push(l.shift()); }
            }
            return env.shuffle(out);
        }
        function pickFormat(unitKey, format) {
            if (FORMAT_BY_ID[format].grouped) return pickGroups([unitKey], format, 2).map(g => ({ passage: g.passage, items: g.items }));
            return pickSpread([unitKey], format, SESSION_SIZE).map(single);
        }

        // ---------- 錯題 ----------
        function wrongIds(unitKey, onlyDue) {
            const u = unitState(unitKey);
            const today = env.today();
            return Object.keys(u.wrong).filter(id => data.items.has(id) && (!onlyDue || u.wrong[id].due <= today));
        }
        function toWorkUnits(ids, limit) {
            const picked = env.shuffle(ids.slice()).slice(0, limit);
            const groups = new Map();
            const out = [];
            for (const id of picked) {
                const it = data.items.get(id);
                if (it.passage) {
                    if (!groups.has(it.passage)) { const g = { passage: data.passages.get(it.passage), items: [] }; groups.set(it.passage, g); out.push(g); }
                    groups.get(it.passage).items.push(it);
                } else out.push(single(it));
            }
            for (const g of groups.values()) if (g.passage.kind === 'cloze') g.items.sort((a, b) => a.slot - b.slot);
            return out;
        }
        function pickReview(unitKey, onlyDue) { return toWorkUnits(wrongIds(unitKey, onlyDue), onlyDue ? 15 : 20); }

        // ---------- 模擬段考 ----------
        // unitKey：從哪個單元的大廳開考，每日點數就記在那個單元
        function buildExam(scope, kind, isDiag, unitKey) {
            const unitKeys = SCOPES[scope].filter(hasUnit);
            const spec = MOCK[kind];
            const sections = spec.sections.map(([format, count, each], i) => {
                const f = FORMAT_BY_ID[format];
                const units = f.grouped
                    ? pickGroups(unitKeys, format, count).map(g => ({ passage: g.passage.id, ids: g.items.map(it => it.id) }))
                    : pickSpread(unitKeys, format, count).map(it => ({ passage: null, ids: [it.id] }));
                return { format, title: `${SECTION_NUMERALS[i]}、${f.label}`, each, units };
            }).filter(s => s.units.length);
            const now = env.now();
            state.examInProgress = { scope, kind, unit: SCOPES[scope].includes(unitKey) ? unitKey : SCOPES[scope][0], diag: Boolean(isDiag), startedAt: now, deadline: now + spec.minutes * 60000, sections, answers: {} };
            save();
            return state.examInProgress;
        }
        function examItems(exam) { return exam.sections.flatMap(s => s.units.flatMap(u => u.ids.map(id => ({ section: s, item: data.items.get(id) })))).filter(x => x.item); }
        function gradeExam(exam) {
            const usedSec = Math.round((Math.min(env.now(), exam.deadline) - exam.startedAt) / 1000);
            const rows = [];
            const bySection = [];
            const byPoint = {};
            let got = 0, max = 0, blanks = 0;
            for (const s of exam.sections) {
                const sec = { title: s.title, format: s.format, got: 0, max: 0, n: 0, ok: 0 };
                for (const u of s.units) for (const id of u.ids) {
                    const item = data.items.get(id);
                    if (!item) continue;
                    const answer = exam.answers[id];
                    const result = gradeItem(item, answer, { mock: true });
                    const points = Math.round(s.each * result.score * 100) / 100;
                    if (result.verdict === 'blank') blanks++;
                    sec.got += points; sec.max += s.each; sec.n++;
                    if (result.score === 1) sec.ok++;
                    if (!byPoint[item.point]) byPoint[item.point] = { n: 0, ok: 0 };
                    byPoint[item.point].n++;
                    if (result.verdict === 'ok' || result.verdict === 'careless') byPoint[item.point].ok++;
                    rows.push({ item, answer, result, points, each: s.each, section: s.title });
                }
                got += sec.got; max += sec.max;
                bySection.push(sec);
            }
            const score = max ? Math.round((got / max) * 100) : 0;
            return { scope: exam.scope, kind: exam.kind, diag: exam.diag, usedSec, got: Math.round(got * 10) / 10, max, score, bySection, byPoint, rows, blankRate: rows.length ? blanks / rows.length : 1 };
        }
        // 交卷：寫入歷程、錯題箱、成績紀錄，並發放點數
        function submitExam() {
            const exam = state.examInProgress;
            if (!exam) return null;
            const report = gradeExam(exam);
            const ctx = exam.diag ? 'diag' : 'mock';
            const avgMs = report.rows.length ? (report.usedSec * 1000) / report.rows.length : 0;
            for (const row of report.rows) recordAttempt({ item: row.item, ctx, answer: row.answer, result: row.result, ms: avgMs });
            const key = `${exam.scope}:${exam.kind}`;
            const previous = state.exams.filter(e => e.key === key);
            const bestBefore = previous.length ? Math.max(...previous.map(e => e.score)) : null;
            state.exams.push({
                t: env.now(), key, scope: exam.scope, kind: exam.kind, diag: exam.diag, score: report.score, got: report.got, max: report.max, usedSec: report.usedSec,
                bySection: report.bySection.map(s => ({ title: s.title, format: s.format, got: Math.round(s.got * 10) / 10, max: s.max })),
                byPoint: report.byPoint,
            });
            if (state.exams.length > 60) state.exams = state.exams.slice(-60);
            if (exam.diag) SCOPES[exam.scope].forEach(k => { unitState(k).diagnosed = true; });
            state.examInProgress = null;

            // 點數
            const rewards = [];
            const serious = report.usedSec >= MOCK[exam.kind].minSeconds && report.blankRate <= 0.5;
            report.serious = serious;
            if (serious) {
                if (exam.diag) rewards.push(grantOnce(`diag:${exam.scope}`, 10, '完成診斷'));
                else {
                    const passPoints = exam.kind === 'full' ? 20 : 10;
                    if (report.score >= 60) rewards.push(grantDaily(exam.unit || SCOPES[exam.scope][0], passPoints, '模擬段考及格', `mockpass:${exam.kind}`));
                    // 首次及格獎勵：每個範圍的完整卷、半卷各一次（完整卷沿用舊的紀錄名稱，領過的不會重發）
                    if (exam.kind === 'full' && report.score >= 60) rewards.push(grantOnce(`mock60:${exam.scope}`, 30, '完整卷第一次 60 分以上'));
                    if (exam.kind === 'half' && report.score >= 60) rewards.push(grantOnce(`mock60half:${exam.scope}`, 15, '半卷第一次 60 分以上'));
                }
            }
            report.rewards = rewards.filter(r => r && r.points > 0);
            report.bestBefore = bestBefore;
            practiceDay(SCOPES[exam.scope][0]);
            save();
            return report;
        }
        function abandonExam() { state.examInProgress = null; save(); }

        // ---------- 點數 ----------
        function ledger() { return env.bridge.getRewardLedger(); }
        // 每日類點數每個單元各有一本帳，換日就歸零
        function dailyOf(unitKey) {
            const l = ledger();
            if (!isObj(l.dailyUnits)) l.dailyUnits = {};
            const d = l.dailyUnits[unitKey];
            if (!isObj(d) || d.date !== env.today() || !isObj(d.flags)) l.dailyUnits[unitKey] = { date: env.today(), points: 0, flags: {} };
            return l.dailyUnits[unitKey];
        }
        function grantOnce(key, points, label) {
            const l = ledger();
            if (l.once[key]) return { points: 0, label };
            l.once[key] = env.today();
            env.bridge.grantPoints(points);
            return { points, label };
        }
        // 每日類點數：每個單元每天合計上限 DAILY_CAP；flag 用來限制「每天一次」
        function grantDaily(unitKey, points, label, flag) {
            const d = dailyOf(unitKey);
            if (flag && d.flags[flag]) return { points: 0, label };
            const allowed = Math.max(0, Math.min(points, DAILY_CAP - d.points));
            if (flag) d.flags[flag] = true;
            if (allowed > 0) { d.points += allowed; env.bridge.grantPoints(allowed); }
            else env.bridge.saveLedger();
            return { points: allowed, label, capped: allowed < points };
        }
        function dailyLeft(unitKey) { return Math.max(0, DAILY_CAP - dailyOf(unitKey).points); }
        function practiceDay(unitKey) {
            const u = UNITS.find(x => x.key === unitKey);
            if (u) env.bridge.recordPracticeDay(u.path);
        }

        // 一般練習結束：回傳 { rate, passed, rewards }
        function finishSession(session) {
            const total = session.results.length;
            const right = session.results.filter(r => r.right).length;
            const rate = total ? right / total : 0;
            const passed = rate >= PASS_RATE;
            const u = unitState(session.unit);
            const rewards = [];
            if (session.kind === 'ladder') {
                const lad = u.ladder[session.point] = isObj(u.ladder[session.point]) ? u.ladder[session.point] : {};
                const prev = isObj(lad[session.stage]) ? lad[session.stage] : { best: 0, plays: 0 };
                lad[session.stage] = { best: Math.max(prev.best, rate), plays: prev.plays + 1, passed: prev.passed || passed };
                if (passed) rewards.push(grantOnce(`ladder:${session.unit}:${session.point}:${session.stage}`, STAGES[session.stage - 1].once, `${STAGES[session.stage - 1].label}第一次達標`));
            } else if (session.kind === 'format') {
                const prev = isObj(u.formats[session.format]) ? u.formats[session.format] : { best: 0, plays: 0 };
                u.formats[session.format] = { best: Math.max(prev.best, rate), plays: prev.plays + 1 };
                // 每種題型第一次過關給一次（每個單元各算）
                if (passed) rewards.push(grantOnce(`format:${session.unit}:${session.format}`, FORMAT_ONCE, `題型專練「${FORMAT_BY_ID[session.format].label}」第一次過關`));
            } else if (session.kind === 'concept') {
                const c = u.concepts[session.conceptId] = isObj(u.concepts[session.conceptId]) ? u.concepts[session.conceptId] : {};
                c.readAt = c.readAt || env.today();
                if (rate >= 0.75) { c.passedAt = c.passedAt || env.today(); rewards.push(grantOnce(`concept:${session.conceptId}`, 3, '觀念卡檢核通過')); }
            } else if (session.kind === 'review') {
                const promoted = session.results.filter(r => r.promoted).length;
                // 今天到期的都做完，而且沒有任何一題答錯，才給
                if (wrongIds(session.unit, true).length === 0 && promoted && !dailyOf(session.unit).flags.reviewMiss) rewards.push(grantDaily(session.unit, 5, '今天到期的錯題全部答對', 'clear'));
            }
            practiceDay(session.unit);
            save();
            return { total, right, rate, passed, rewards: rewards.filter(r => r && r.points > 0) };
        }

        // ---------- 大廳與報告用的統計 ----------
        function rateOf(entry) { return entry && entry.n ? entry.ok / entry.n : null; }
        function hubInfo(unitKey) {
            const unit = data.units[unitKey];
            const u = unitState(unitKey);
            const weak = entry => entry && entry.n >= 3 && entry.ok / entry.n < 0.6;
            return {
                unit,
                diagnosed: Boolean(u.diagnosed),
                points: unit.grammarPoints.map(p => {
                    const concept = unit.concepts.find(c => c.point === p.id) || null;
                    return {
                        id: p.id, label: p.label, concept,
                        conceptState: concept ? (u.concepts[concept.id] || {}) : {},
                        stages: STAGES.map(s => ({ ...s, state: (u.ladder[p.id] || {})[s.stage] || null, pool: ladderPool(unitKey, p.id, s.stage).length })),
                        stat: u.stat.point[p.id] || null,
                        weak: weak(u.stat.point[p.id]),
                    };
                }),
                formats: FORMATS.map(f => ({ ...f, rewarded: Boolean(ledger().once[`format:${unitKey}:${f.id}`]), state: u.formats[f.id] || null, stat: u.stat.format[f.id] || null, weak: weak(u.stat.format[f.id]) })),
                wrongTotal: wrongIds(unitKey, false).length,
                wrongDue: wrongIds(unitKey, true).length,
                mastered: u.mastered,
                exam: state.examInProgress,
                exams: state.exams.slice(),
                dailyLeft: dailyLeft(unitKey),
                daily: { points: dailyOf(unitKey).points, flags: { ...dailyOf(unitKey).flags }, cap: DAILY_CAP },
            };
        }
        function bestExam(scope, kind) {
            const list = state.exams.filter(e => e.key === `${scope}:${kind}` && !e.diag);
            return list.length ? Math.max(...list.map(e => e.score)) : null;
        }

        // ---------- 題目轉成純文字（匯出用） ----------
        function sentenceAround(text, slot) {
            const marked = text.replace(/\{\{(\d+)\}\}/g, (m, n) => (Number(n) === slot ? '____' : `(${n})`));
            const parts = marked.split(/(?<=[.?!])\s+|\n+/);
            return (parts.find(p => p.includes('____')) || marked).trim();
        }
        function itemPlain(item) {
            const opts = item.options ? '　選項：' + item.options.map((o, i) => `(${'ABCD'[i]}) ${o}`).join(' ') : '';
            switch (item.format) {
                case 'vocab': return item.prompt.replace('{{1}}', `${item.blanks[0].lead}____${item.blanks[0].tail}`);
                case 'verbform': return item.prompt.replace(/\{\{\d+\}\}/g, '____');
                case 'guided': return `${item.zh}　${item.prompt.replace(/\{\{\d+\}\}/g, '____')}`;
                case 'choice': return item.prompt + opts;
                case 'dialogue': return item.prompt.replace(/\n/g, ' ／ ') + opts;
                case 'cloze': { const p = data.passages.get(item.passage); return `〔克漏字〕${p ? sentenceAround(p.text, item.slot) : ''}${opts}`; }
                case 'reading': { const p = data.passages.get(item.passage); return `〔閱讀：${p ? p.title : ''}〕${item.prompt}${opts}`; }
                case 'rewrite': return `${item.prompt.replace(/<\/?u>/g, '_')}（${item.cue}）`;
                case 'order': return `${item.zh ? item.zh + '　' : ''}${item.tiles.join(' / ')}`;
                case 'translate': return `${item.zh}${item.cue ? `（${item.cue}）` : ''}`;
                default: return '';
            }
        }

        // ---------- 做題歷程匯出（貼給 AI 分析） ----------
        function fmtTime(ts) {
            const d = new Date(ts);
            const pad = n => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        }
        function exportLogText(days) {
            const since = days ? env.now() - days * 86400000 : 0;
            const entries = state.log.filter(e => e.t >= since);
            const lines = [];
            lines.push('# 英文「段考特訓」做題歷程');
            lines.push('');
            lines.push('請你擔任國中英文家教，根據下面這位台灣八年級學生的做題紀錄，分析：');
            lines.push('1. 他最弱的文法點與題型是哪些？請引用具體的錯誤答案當證據。');
            lines.push('2. 他的錯誤屬於哪些類型（觀念不懂、規則混淆、拼字、粗心、看不懂題意、中文直翻）？各占多少？');
            lines.push('3. 有沒有同一種錯反覆出現？請整理成「錯誤模式」。');
            lines.push('4. 接下來一週每天 15～20 分鐘的具體練習建議，以及家長可以怎麼協助。');
            lines.push('');
            lines.push(`- 匯出時間：${fmtTime(env.now())}`);
            lines.push(`- 範圍：${days ? `最近 ${days} 天` : '全部紀錄'}，共 ${entries.length} 筆作答`);
            lines.push('- 教材：翰林版八年級上學期 Unit 3（過去進行式、when 子句、時間逆讀法、片語動詞）、Unit 4（不定詞與動名詞）');
            lines.push('- 結果欄：對／對（粗心）＝文法對但大小寫或標點有誤／錯／未作答');
            lines.push('');

            lines.push('## 一、模擬段考與診斷成績');
            const exams = state.exams.filter(e => e.t >= since);
            if (!exams.length) lines.push('（這段期間沒有紀錄）');
            for (const e of exams) {
                lines.push(`- ${fmtTime(e.t)}｜${e.diag ? '診斷' : '模擬段考'}｜${SCOPE_LABELS[e.scope]} ${MOCK[e.kind].label}｜${e.score} 分（${e.got}/${e.max}）｜用時 ${Math.round(e.usedSec / 60)} 分鐘`);
                lines.push('  各大題：' + e.bySection.map(s => `${s.title.replace(/^.、/, '')} ${s.got}/${s.max}`).join('、'));
            }
            lines.push('');

            const agg = (keyFn) => {
                const table = new Map();
                for (const e of entries) {
                    const item = data.items.get(e.id);
                    if (!item) continue;
                    const k = keyFn(item);
                    if (!table.has(k)) table.set(k, { n: 0, ok: 0, careless: 0, blank: 0 });
                    const row = table.get(k);
                    row.n++;
                    if (e.r === 'ok' || e.r === 'careless') row.ok++;
                    if (e.r === 'careless') row.careless++;
                    if (e.r === 'blank') row.blank++;
                }
                return [...table.entries()].sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n);
            };
            lines.push('## 二、各文法點正確率（由低到高）');
            for (const [k, r] of agg(it => `${unitOf(it.id).toUpperCase()} ${pointLabel(it.point)}`)) lines.push(`- ${k}：${pct(r.ok, r.n)}%（${r.ok}/${r.n}，粗心 ${r.careless}，未作答 ${r.blank}）`);
            lines.push('');
            lines.push('## 三、各題型正確率（由低到高）');
            for (const [k, r] of agg(it => FORMAT_BY_ID[it.format].label)) lines.push(`- ${k}：${pct(r.ok, r.n)}%（${r.ok}/${r.n}，粗心 ${r.careless}，未作答 ${r.blank}）`);
            lines.push('');

            lines.push('## 四、目前還在錯題本裡的題目');
            let anyWrong = false;
            for (const u of UNITS) {
                const us = unitState(u.key);
                for (const [id, w] of Object.entries(us.wrong)) {
                    const item = data.items.get(id);
                    if (!item) continue;
                    anyWrong = true;
                    lines.push(`- [${pointLabel(item.point)}／${FORMAT_BY_ID[item.format].label}] ${itemPlain(item)}　正解：${correctText(item)}　最近一次寫：${w.last || '（空）'}　累計答錯 ${w.lapses} 次`);
                }
            }
            if (!anyWrong) lines.push('（沒有）');
            lines.push('');

            if (state.disputes.length) {
                lines.push('## 五、孩子認為自己答對、但被系統判錯的題目（請你判斷孩子的寫法是否其實正確）');
                for (const d of state.disputes.filter(x => x.t >= since)) {
                    const item = data.items.get(d.id);
                    if (item) lines.push(`- ${itemPlain(item)}　系統正解：${correctText(item)}　孩子寫：${d.a}`);
                }
                lines.push('');
            }

            lines.push('## 六、逐題作答紀錄（依時間先後）');
            lines.push('格式：時間｜活動｜文法點｜題型｜題目｜正解｜孩子的作答｜結果｜用時');
            for (const e of entries) {
                const item = data.items.get(e.id);
                if (!item) continue;
                lines.push([fmtTime(e.t), CTX_LABELS[e.c] || e.c, `${unitOf(item.id).toUpperCase()} ${pointLabel(item.point)}`, FORMAT_BY_ID[item.format].label, itemPlain(item), correctText(item), e.a || '（空）', VERDICT_LABELS[e.r] || e.r, `${Math.round(e.ms / 1000)} 秒`].join('｜'));
            }
            return lines.join('\n');
        }

        function exportProgress() { return JSON.stringify({ kind: 'englishTrainerBackup', exportedAt: env.now(), state }); }
        function importProgress(text) {
            let parsed = null;
            try { parsed = JSON.parse(text); } catch (e) { throw new Error('貼上的內容不完整或不是備份檔。'); }
            if (!isObj(parsed) || parsed.kind !== 'englishTrainerBackup' || !isObj(parsed.state)) throw new Error('這不是段考特訓的進度備份。');
            state = normalize(parsed.state);
            UNITS.forEach(u => unitState(u.key));
            save();
        }

        return {
            load, save, addUnit, hasUnit, data, getState: () => state, unitState, pointLabel,
            gradeItem, correctText, altAnswers, answerText, isBlankAnswer, recordAttempt, addDispute,
            pickLadder, pickFormat, pickConceptCheck, pickReview, ladderPool, wrongIds,
            buildExam, gradeExam, submitExam, abandonExam, examItems, bestExam,
            finishSession, hubInfo, dailyLeft, itemPlain, exportLogText, exportProgress, importProgress,
        };
    }

    return { createCore, UNITS, FORMATS, FORMAT_BY_ID, STAGES, STAGE_BY_FORMAT, MOCK, SCOPES, SCOPE_LABELS, CTX_LABELS, VERDICT_LABELS, SESSION_SIZE, DAILY_CAP, PASS_RATE, FORMAT_ONCE, addDays, pct };
});
