// 段考特訓：判分引擎（純函式，無 DOM）。瀏覽器掛在 window.TrainerGrading，node 可直接 require。
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.TrainerGrading = api;
})(typeof self !== 'undefined' ? self : this, function () {
    const MAX_EXPANSIONS = 400;

    // ---------- 答案樣板展開 ----------
    // (a|b) 擇一，可巢狀，可有空選項；[x] 可省略。
    function expandTemplate(template) {
        const src = String(template);
        let pos = 0;

        function cross(left, right) {
            const out = [];
            for (const a of left) for (const b of right) {
                out.push(a + b);
                if (out.length > MAX_EXPANSIONS) throw new Error('樣板展開數超過上限：' + template);
            }
            return out;
        }
        // 解析一串連續內容，遇到 stop 字元停止
        function parseSeq(stops) {
            let results = [''];
            while (pos < src.length && !stops.includes(src[pos])) {
                const ch = src[pos];
                if (ch === '(') {
                    pos++;
                    let alts = [];
                    for (;;) {
                        alts = alts.concat(parseSeq('|)'));
                        if (src[pos] === '|') { pos++; continue; }
                        break;
                    }
                    if (src[pos] !== ')') throw new Error('樣板括號不成對：' + template);
                    pos++;
                    results = cross(results, alts);
                } else if (ch === '[') {
                    pos++;
                    const inner = parseSeq(']');
                    if (src[pos] !== ']') throw new Error('樣板中括號不成對：' + template);
                    pos++;
                    results = cross(results, inner.concat(['']));
                } else {
                    let lit = '';
                    while (pos < src.length && !'()[]|'.includes(src[pos])) lit += src[pos++];
                    if (pos < src.length && !stops.includes(src[pos]) && src[pos] !== '(' && src[pos] !== '[') {
                        throw new Error('樣板語法錯誤：' + template);
                    }
                    results = cross(results, [lit]);
                }
            }
            return results;
        }

        const all = parseSeq('');
        if (pos !== src.length) throw new Error('樣板語法錯誤：' + template);
        const seen = new Set();
        const out = [];
        for (const raw of all) {
            const tidy = raw.replace(/\s+/g, ' ').replace(/\s+([,.?!])/g, '$1').trim();
            if (tidy && !seen.has(tidy)) { seen.add(tidy); out.push(tidy); }
        }
        return out;
    }

    function expandAll(templates) {
        const list = Array.isArray(templates) ? templates : [templates];
        const seen = new Set();
        const out = [];
        for (const t of list) for (const s of expandTemplate(t)) {
            if (!seen.has(s)) { seen.add(s); out.push(s); }
        }
        return out;
    }

    // ---------- 正規化 ----------
    function baseNormalize(text) {
        return String(text == null ? '' : text)
            .normalize('NFKC')
            .replace(/[‘’ʼ`´＇]/g, "'")
            .replace(/[“”]/g, '"')
            .replace(/。/g, '.')
            .replace(/、/g, ',')
            .replace(/[ 　]/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/\s+([,.?!])/g, '$1')
            .trim();
    }

    const IS_HOSTS = 'it|he|she|that|what|who|where|there|here|how|when|why';
    function expandContractions(text) {
        return text
            .replace(/\bwon't\b/gi, m => (m[0] === 'W' ? 'Will not' : 'will not'))
            .replace(/\bcan't\b/gi, m => (m[0] === 'C' ? 'Can not' : 'can not'))
            .replace(/\bcannot\b/gi, m => (m[0] === 'C' ? 'Can not' : 'can not'))
            .replace(/\b(was|were|is|are|do|does|did|have|has|had|would|should|could|must|need)n't\b/gi, '$1 not')
            .replace(/\bI'm\b/gi, 'I am')
            .replace(/\blet's\b/gi, m => (m[0] === 'L' ? 'Let us' : 'let us'))
            .replace(/\b(\w+)'re\b/gi, '$1 are')
            .replace(/\b(\w+)'ve\b/gi, '$1 have')
            .replace(/\b(\w+)'ll\b/gi, '$1 will')
            .replace(new RegExp("\\b(" + IS_HOSTS + ")'s\\b", 'gi'), '$1 is');
    }

    // 保留大小寫，展開縮寫、統一 a.m./p.m.
    function canonical(text) {
        return expandContractions(baseNormalize(text))
            .replace(/\b([ap])\.\s?m\.?(?=\s|$|[,?!])/gi, '$1m')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function endMark(canon) {
        const m = canon.match(/[.?!]$/);
        return m ? m[0] : '';
    }

    // 轉成比對用的 token（保留大小寫；去標點；連字號視為空白；保留字內撇號）
    function tokens(canon) {
        return canon
            .replace(/-/g, ' ')
            .replace(/[^A-Za-z0-9' ]+/g, ' ')
            .replace(/(^|\s)'+|'+(?=\s|$)/g, '$1')
            .split(' ')
            .filter(Boolean);
    }

    function looseKey(text) {
        return tokens(canonical(text)).join(' ').toLowerCase();
    }

    // ---------- 字元／token 編輯距離 ----------
    function charDistance(a, b) {
        const m = a.length, n = b.length;
        let prev = Array.from({ length: n + 1 }, (_, j) => j);
        for (let i = 1; i <= m; i++) {
            const cur = [i];
            for (let j = 1; j <= n; j++) {
                cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
            }
            prev = cur;
        }
        return prev[n];
    }

    // 回傳 { distance, ops }；ops: same / replace / missing / extra
    function tokenDiff(given, expected) {
        const g = given.map(t => t.toLowerCase());
        const e = expected.map(t => t.toLowerCase());
        const m = g.length, n = e.length;
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (g[i - 1] === e[j - 1] ? 0 : 1));
        }
        const ops = [];
        let i = m, j = n;
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && g[i - 1] === e[j - 1] && dp[i][j] === dp[i - 1][j - 1]) {
                ops.push({ type: 'same', given: given[i - 1], expected: expected[j - 1] }); i--; j--;
            } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
                const spelling = charDistance(g[i - 1], e[j - 1]) <= 2 && Math.min(g[i - 1].length, e[j - 1].length) >= 3;
                ops.push({ type: 'replace', given: given[i - 1], expected: expected[j - 1], spelling }); i--; j--;
            } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
                ops.push({ type: 'missing', expected: expected[j - 1] }); j--;
            } else {
                ops.push({ type: 'extra', given: given[i - 1] }); i--;
            }
        }
        ops.reverse();
        return { distance: dp[m][n], ops };
    }

    function sameMultiset(a, b) {
        if (a.length !== b.length) return false;
        const x = a.map(t => t.toLowerCase()).sort();
        const y = b.map(t => t.toLowerCase()).sort();
        return x.every((t, k) => t === y[k]);
    }

    // ---------- 整句判分 ----------
    // 回傳 { verdict: 'ok'|'careless'|'wrong', notes: [], best, diff, orderOnly }
    function gradeSentence(input, templates) {
        const expanded = expandAll(templates);
        const inCanon = canonical(input);
        const inTokens = tokens(inCanon);
        const inKey = inTokens.join(' ').toLowerCase();

        let looseMatch = null;
        for (const ans of expanded) {
            const aCanon = canonical(ans);
            const aTokens = tokens(aCanon);
            if (aTokens.join(' ').toLowerCase() !== inKey) continue;
            const notes = [];
            if (aTokens.some((t, k) => t !== inTokens[k])) {
                const first = aTokens[0] !== inTokens[0] && aTokens[0].toLowerCase() === inTokens[0].toLowerCase();
                const others = aTokens.some((t, k) => k > 0 && t !== inTokens[k]);
                if (first) notes.push('句首要大寫');
                if (others) notes.push('大小寫有誤（人名、I、星期等要大寫，其他字小寫）');
            }
            if (endMark(aCanon) !== endMark(inCanon)) {
                notes.push(endMark(aCanon) ? `句尾要加「${endMark(aCanon)}」` : '句尾標點不對');
            }
            const commas = s => (s.match(/,/g) || []).length;
            if (commas(aCanon) !== commas(inCanon)) notes.push(commas(aCanon) > commas(inCanon) ? '漏了逗號' : '多了逗號');
            if (notes.length === 0) return { verdict: 'ok', notes: [], best: ans, diff: null, orderOnly: false };
            if (!looseMatch || notes.length < looseMatch.notes.length) looseMatch = { verdict: 'careless', notes, best: ans, diff: null, orderOnly: false };
        }
        if (looseMatch) return looseMatch;

        let best = null;
        for (const ans of expanded) {
            const d = tokenDiff(inTokens, tokens(canonical(ans)));
            if (!best || d.distance < best.distance) best = { distance: d.distance, ops: d.ops, ans };
        }
        return {
            verdict: 'wrong',
            notes: [],
            best: best ? best.ans : '',
            diff: best ? best.ops : [],
            orderOnly: best ? sameMultiset(inTokens, tokens(canonical(best.ans))) : false,
        };
    }

    // ---------- 短空格判分（不計大小寫與標點） ----------
    function gradeBlank(input, template, opts) {
        const expanded = expandAll(template);
        const key = looseKey(input);
        const ok = key !== '' && expanded.some(ans => looseKey(ans) === key);
        const result = { ok, best: expanded[0] || '' };
        if (!ok && opts && (opts.lead || opts.tail)) {
            const raw = baseNormalize(input).toLowerCase();
            const lead = (opts.lead || '').toLowerCase();
            const tail = (opts.tail || '').toLowerCase();
            result.frameMismatch = raw !== '' && (!raw.startsWith(lead) || !raw.endsWith(tail));
        }
        if (!ok && key) {
            const dist = Math.min(...expanded.map(ans => charDistance(key, looseKey(ans))));
            result.near = dist <= 2;
        }
        return result;
    }

    function isAccepted(input, templates) {
        return gradeSentence(input, templates).verdict !== 'wrong';
    }

    return { expandTemplate, expandAll, baseNormalize, canonical, tokens, looseKey, gradeSentence, gradeBlank, isAccepted, tokenDiff, charDistance, MAX_EXPANSIONS };
});
