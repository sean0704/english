document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素 ---
    const startContainer = document.getElementById('start-container');
    const gameContainer = document.getElementById('game-container');
    const completionContainer = document.getElementById('completion-container');
    const trainerContainer = document.getElementById('trainer-container');
    const achievementContainer = document.getElementById('achievement-container');

    // 首頁元素
    const modeBtnSpelling = document.getElementById('mode-btn-spelling');
    const modeBtnTrainer = document.getElementById('mode-btn-trainer');
    const wordListSelectEl = document.getElementById('word-list-select');
    const startGameBtn = document.getElementById('start-game-btn');

    // 遊戲通用元素
    const wordDisplayEl = document.getElementById('current-word-display');
    const translationEl = document.getElementById('translation-display');
    const phoneticsEl = document.getElementById('phonetics-display');
    const exampleEl = document.getElementById('example-display');
    const feedbackEl = document.getElementById('feedback-message');
    const playAudioBtnEl = document.getElementById('play-audio-btn');
    const progressBarEl = document.getElementById('progress-bar');
    const roundDisplayEl = document.getElementById('round-display');
    
    // 拼寫遊戲專用
    const spellingFormEl = document.getElementById('spelling-form');
    const spellingInputEl = document.getElementById('spelling-input');

    // 結算畫面
    const restartBtn = document.getElementById('restart-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    const completionIconEl = document.getElementById('completion-icon');
    const completionTitleEl = document.getElementById('completion-title');
    const completionMessageEl = document.getElementById('completion-message');
    const completionStatsEl = document.getElementById('completion-stats');
    const completionReviewEl = document.getElementById('completion-review');
    const completionReviewTitleEl = document.getElementById('completion-review-title');
    const completionReviewListEl = document.getElementById('completion-review-list');
    const spellingQuitBtn = document.getElementById('spelling-quit-btn');

    // 成就元素
    const showAchievementsBtn = document.getElementById('show-achievements-btn');
    const closeAchievementsBtn = document.getElementById('close-achievements-btn');
    const achievementListEl = document.getElementById('achievement-list');
    const toastContainerEl = document.getElementById('toast-container');

    // 通用對話框
    const dialogContainer = document.getElementById('dialog-container');
    const dialogTitleEl = document.getElementById('dialog-title');
    const dialogMessageEl = document.getElementById('dialog-message');
    const dialogConfirmBtn = document.getElementById('dialog-confirm-btn');
    const dialogCancelBtn = document.getElementById('dialog-cancel-btn');

    // --- 管理者/兌換 DOM 元素 ---
    const adminModalContainer = document.getElementById('admin-modal-container');
    const adminPasswordForm = document.getElementById('admin-password-form');
    const adminPasswordInput = document.getElementById('admin-password-input');
    const closeAdminModalBtn = document.getElementById('close-admin-modal-btn');
    const adminAddPointsBtn = document.getElementById('admin-add-points-btn');
    const adminModalTitleEl = document.getElementById('admin-modal-title');
    const adminPasswordErrorEl = document.getElementById('admin-password-error');
    const adminGrantForm = document.getElementById('admin-grant-form');
    const adminPointsInput = document.getElementById('admin-points-input');
    const adminReasonInput = document.getElementById('admin-reason-input');
    const adminGrantErrorEl = document.getElementById('admin-grant-error');

    const redemptionContainer = document.getElementById('redemption-container');
    const showRedemptionsBtn = document.getElementById('show-redemptions-btn');
    const closeRedemptionsBtn = document.getElementById('close-redemptions-btn');
    const redemptionForm = document.getElementById('redemption-form');
    const redeemPointsInput = document.getElementById('redeem-points-input');
    const redeemDescInput = document.getElementById('redeem-desc-input');
    const redemptionHistoryList = document.getElementById('redemption-history-list');
    const redemptionBalanceEl = document.getElementById('redemption-balance');
    const redemptionErrorEl = document.getElementById('redemption-error');

    buildPointsUi();
    const totalPointsDisplayEl = document.getElementById('total-points-display');
    const pointsHudEl = document.getElementById('points-hud');
    const pointsCelebrationEl = document.getElementById('points-celebration');
    const pointsAnnouncerEl = document.getElementById('points-announcer');
    const pointsHistoryContainer = document.getElementById('points-history-container');
    const closePointsHistoryBtn = document.getElementById('close-points-history-btn');
    const pointsHistoryBalanceEl = document.getElementById('points-history-balance');
    const pointsHistoryBodyEl = document.getElementById('points-history-body');
    const unitRewardsBadgeContainer = document.getElementById('unit-rewards-badge-container');
    const unitRewardsHintEl = document.getElementById('unit-rewards-hint');
    const pointsInfoTitleEl = document.getElementById('points-info-title');
    const pointsInfoListEl = document.getElementById('points-info-list');

    const flashOverlayEl = document.getElementById('flash-overlay');
    const healthDisplayEl = document.getElementById('health-display');

    // --- 字庫設定 ---
    const wordLists = [
        // 學期已結束 故關閉，標記為 disabled
        { name: '五年級 上 Unit 1,2', path: 'g5_1_unit1.json', type: 'spelling', disabled: true },
        { name: '五年級 上 Unit 3,4', path: 'g5_1_unit3.json', type: 'spelling', disabled: true },
        { name: '五年級 下 Unit 1', path: 'g5_2_unit1.json', type: 'spelling', disabled: true },
        { name: '五年級 下 Unit 2', path: 'g5_2_unit2.json', type: 'spelling', disabled: true },
        { name: '五年級 下 Unit 3', path: 'g5_2_unit3.json', type: 'spelling', disabled: true },
        { name: '五年級 下 Unit 4', path: 'g5_2_unit4.json', type: 'spelling', disabled: true },
        { name: '七年級 上 Unit 0', path: 'g7_1_unit0.json', type: 'spelling', disabled: true },
        { name: '七年級 上 Unit 1', path: 'g7_1_unit1.json', type: 'spelling', disabled: true },
        { name: '七年級 上 Unit 2', path: 'g7_1_unit2.json', type: 'spelling', disabled: true },
        { name: '七年級 上 Unit 3', path: 'g7_1_unit3.json', type: 'spelling', disabled: true },
        { name: '七年級 上 Unit 4', path: 'g7_1_unit4.json', type: 'spelling', disabled: true },
        { name: '七年級 上 Unit 5', path: 'g7_1_unit5.json', type: 'spelling', disabled: true },
        { name: '七年級 上 Unit 6', path: 'g7_1_unit6.json', type: 'spelling', disabled: true },
        { name: '七年級 下 Unit 1', path: 'g7_2_unit1.json', type: 'spelling', disabled: true },
        { name: '七年級 下 Unit 2', path: 'g7_2_unit2.json', type: 'spelling', disabled: true },
        { name: '七年級 下 Unit 3', path: 'g7_2_unit3.json', type: 'spelling', disabled: true },
        { name: '七年級 下 Unit 4', path: 'g7_2_unit4.json', type: 'spelling', disabled: true },
        { name: '七年級 下 Unit 5', path: 'g7_2_unit5.json', type: 'spelling', disabled: true },
        { name: '七年級 下 Unit 6', path: 'g7_2_unit6.json', type: 'spelling', disabled: true },
        { name: '七年級 下 動詞三態', path: 'g7_2_verbs.json', type: 'spelling', disabled: true },
        // 開放練習的學期選單
        { name: '八年級 上 Unit 1 (1)', path: 'g8_1_unit1_1.json', type: 'spelling' },
        { name: '八年級 上 Unit 1 (2)', path: 'g8_1_unit1_2.json', type: 'spelling' },
        { name: '八年級 上 Unit 2 (1)', path: 'g8_1_unit2_1.json', type: 'spelling' },
        { name: '八年級 上 Unit 2 (2)', path: 'g8_1_unit2_2.json', type: 'spelling' },
        { name: '八年級 上 Unit 3 (1)', path: 'g8_1_unit3_1.json', type: 'spelling' },
        { name: '八年級 上 Unit 3 (2)', path: 'g8_1_unit3_2.json', type: 'spelling' },
        { name: '八年級 上 Unit 4 (1)', path: 'g8_1_unit4_1.json', type: 'spelling' },
        { name: '八年級 上 Unit 4 (2)', path: 'g8_1_unit4_2.json', type: 'spelling' },
        { name: '八年級 上 Unit 3 段考特訓', path: 'g8_1_unit3_trainer.json', type: 'trainer' },
        { name: '八年級 上 Unit 4 段考特訓', path: 'g8_1_unit4_trainer.json', type: 'trainer' },
        { name: '六年級 上 Unit 1', path: 'g6_1_unit1.json', type: 'spelling' },
        { name: '六年級 上 Unit 2', path: 'g6_1_unit2.json', type: 'spelling' },
        { name: '六年級 上 Phonics 3~5', path: 'g6_1_phonics3_5.json', type: 'spelling' },
    ];

    // --- 愛心（生命值）設定 ---
    const MAX_HEALTH = 5;
    const HEALTH_REPLENISH_ROUNDS = [1, 2];

    function getActiveWordLists() {
        return wordLists.filter(list => !list.disabled);
    }

    function getActiveUnitPaths() {
        return new Set(getActiveWordLists().map(list => list.path));
    }

    function getLocalDateString(date = new Date()) {
        const d = date instanceof Date ? date : new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function getLocalYearMonthString(date = new Date()) {
        const d = date instanceof Date ? date : new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }

    // 顯示用的日期時間（例：2026/11/14 15:06）
    function formatDateTime(timestamp) {
        const d = new Date(timestamp);
        if (Number.isNaN(d.getTime())) return '';
        return `${getLocalDateString(d).replace(/-/g, '/')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    // --- 成就系統定義 ---
    const GLOBAL_ACHIEVEMENTS = {
        PLATINUM: {
            icon: '🏆',
            name: '白金獎盃',
            description: '在 3 個不同單元中，同時獲得「金牌」與「日積月累」成就',
            points: 150,
            progress: (stats) => {
                const allKnownUnitPaths = new Set([...getActiveUnitPaths(), ...Object.keys(stats.unitData || {})]);
                const platinumUnitCount = [...allKnownUnitPaths].filter(unitPath => {
                    const goldProgress = UNIT_ACHIEVEMENTS.GOLD.progress(stats, unitPath);
                    const streakProgress = UNIT_ACHIEVEMENTS.THREE_DAY_STREAK.progress(stats, unitPath);
                    return (goldProgress.current >= goldProgress.target) && (streakProgress.current >= streakProgress.target);
                }).length;
                return { current: platinumUnitCount, target: 3 };
            }
        },
        CULTIVATION_DEMON: {
            icon: '😈',
            name: '修練狂魔',
            description: '累計在 15 個不同的日子裡完成過練習',
            points: 150,
            progress: (stats) => {
                const allTimestamps = Object.values(stats.unitData || {}).flatMap(unit => unit?.completionHistory || []);
                const uniqueDays = new Set(allTimestamps.map(ts => getLocalDateString(ts)));
                return { current: uniqueDays.size, target: 15 };
            }
        },
    };
    const UNIT_ACHIEVEMENTS = {
        FIRST_CLEAR: { icon: '🔰', name: '初試身手', description: '首次完成本單元練習', points: 50, progress: (stats, unitPath) => ({ current: stats.unitData[unitPath]?.achievements?.FIRST_CLEAR ? 1 : 0, target: 1 }) },
        BRONZE: { icon: '🥉', name: '銅牌', description: '通關時剩下 3 顆以上的愛心', points: 5, progress: (stats, unitPath) => ({ current: stats.unitData[unitPath]?.achievements?.BRONZE ? 1 : 0, target: 1 }) },
        SILVER: { icon: '🥈', name: '銀牌', description: '通關時剩下 4 顆以上的愛心', points: 10, progress: (stats, unitPath) => ({ current: stats.unitData[unitPath]?.achievements?.SILVER ? 1 : 0, target: 1 }) },
        GOLD: { icon: '🥇', name: '金牌', description: '通關時愛心全滿', points: 15, progress: (stats, unitPath) => ({ current: stats.unitData[unitPath]?.achievements?.GOLD ? 1 : 0, target: 1 }) },
        THREE_DAY_STREAK: { icon: '🏃', name: '日積月累', description: '累計 3 天完成本單元練習', points: 25, progress: (stats, unitPath) => { const history = stats.unitData[unitPath]?.completionHistory || []; return { current: new Set(history.map(ts => getLocalDateString(ts))).size, target: 3 }; } },
        THREE_WEEK_STREAK: { icon: '📅', name: '週而復始', description: '累計 3 週完成本單元練習', points: 50, progress: (stats, unitPath) => { const history = stats.unitData[unitPath]?.completionHistory || []; return { current: new Set(history.map(ts => { const [year, week] = getWeekNumber(new Date(ts)); return `${year}-${String(week).padStart(2, '0')}`; })).size, target: 3 }; } },
        THREE_MONTH_STREAK: { icon: '🗓️', name: '持之以恆', description: '累計 3 個月完成本單元練習', points: 75, progress: (stats, unitPath) => { const history = stats.unitData[unitPath]?.completionHistory || []; return { current: new Set(history.map(ts => getLocalYearMonthString(ts))).size, target: 3 }; } },
    };
    const MEDAL_IDS = ['BRONZE', 'SILVER', 'GOLD'];
    const STREAK_IDS = ['THREE_DAY_STREAK', 'THREE_WEEK_STREAK', 'THREE_MONTH_STREAK'];

    // --- 遊戲 & 玩家狀態 ---
    let playerStats;
    let wordList = [];
    let currentWordListPath = '';
    let currentWordListName = '';
    let activeGameMode = '';

    // 遊戲狀態
    let roundCount = 1;
    let wordsToPractice = [];
    let wordsToReview = [];
    const wordsWrongInSession = new Map(); // 英文 → 單字資料，結算時列出需加強的單字
    let sessionStartPoints = 0;
    let nextWordTimeout = null;
    let lastCompositionEndAt = 0;
    let hasEnteredApp = false; // 第一次顯示首頁之後才為 true
    let isSpellingLocked = false; // 判定答案到換下一題之間，暫時不接受輸入
    let currentStreak = 0;
    let gameMode = 'practice'; // 'practice' or 'review'
    let stageTotal = 0;
    let currentWord = null;
    let isCorrecting = false;
    let correctionCount = 0;
    const REQUIRED_CORRECTIONS = 2;
    const synth = window.speechSynthesis;
    let isPlaying = false;
    let currentHealth = MAX_HEALTH;

    // 每回合通關的每日點數
    const ROUND_REWARDS = { 1: 5, 2: 5, 3: 10 };
    const ROUND_REWARD_KEYS = { spelling: 'spellingRoundRewardsClaimed' };

    // --- 存儲 & 數據管理 ---
    function ensureUnitData(unitPath) {
        if (!playerStats.unitData[unitPath]) playerStats.unitData[unitPath] = {};
        const unitData = playerStats.unitData[unitPath];
        if (!unitData.achievements) unitData.achievements = {};
        if (!unitData.completionHistory) unitData.completionHistory = [];
        return unitData;
    }

    const STORAGE_KEY = 'playerStats_v2';
    const STORAGE_CORRUPT_BACKUP_KEY = 'playerStats_v2_corrupt_backup';
    const SELECTION_KEY = 'englishPractice_lastSelection';
    let storageWarningShown = false;

    function isPlainObject(value) {
        return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    }

    // localStorage 在無痕模式或被停用時可能直接丟出例外，一律包起來
    function readStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn('無法讀取 localStorage：', error);
            return null;
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.warn('無法寫入 localStorage：', error);
            return false;
        }
    }

    function saveProgress() {
        if (writeStorage(STORAGE_KEY, JSON.stringify(playerStats)) || storageWarningShown) return;
        storageWarningShown = true;
        showToast('請確認瀏覽器沒有停用網站資料或處於無痕模式，否則重新整理後進度會消失。', {
            title: '無法儲存進度', icon: '⚠️', tone: 'warning', duration: 8000,
        });
    }

    // 將讀到的存檔補齊成目前版本需要的結構；欄位缺漏或型別錯誤都在這裡修正
    function normalizeStats(raw) {
        const stats = isPlainObject(raw) ? raw : {};
        // 數字欄位若被存成字串（"150"）要轉回數字，而不是當成壞資料歸零
        const toNumber = value => (typeof value === 'string' && value.trim() !== '' ? Number(value) : value);
        stats.totalPoints = toNumber(stats.totalPoints);
        if (!Number.isFinite(stats.totalPoints)) stats.totalPoints = 0;
        if (!isPlainObject(stats.unitData)) stats.unitData = {};
        if (!isPlainObject(stats.globalStats)) stats.globalStats = {};
        if (!Number.isFinite(stats.globalStats.totalWordsCorrect)) stats.globalStats.totalWordsCorrect = 0;
        if (!Number.isFinite(stats.globalStats.longestStreak)) stats.globalStats.longestStreak = 0;
        if (!isPlainObject(stats.unlockedGlobalAchievements)) stats.unlockedGlobalAchievements = {};
        if (!Array.isArray(stats.redemptionHistory)) stats.redemptionHistory = [];
        stats.redemptionHistory = stats.redemptionHistory
            .filter(isPlainObject)
            .map(record => ({ ...record, points: toNumber(record.points), description: String(record.description ?? '') }))
            .filter(record => Number.isFinite(record.points));
        if (!Array.isArray(stats.pointsHistory)) stats.pointsHistory = [];
        stats.pointsHistory = stats.pointsHistory
            .filter(isPlainObject)
            .map(record => ({ ...record, points: toNumber(record.points), reason: String(record.reason ?? '') }))
            .filter(record => Number.isFinite(record.points));

        const trainerPaths = new Set(wordLists.filter(list => list.type === 'trainer').map(list => list.path));
        Object.keys(stats.unitData).forEach(unitPath => {
            if (!isPlainObject(stats.unitData[unitPath])) stats.unitData[unitPath] = {};
            const unit = stats.unitData[unitPath];
            if (!isPlainObject(unit.achievements)) unit.achievements = {};
            if (!Array.isArray(unit.completionHistory)) unit.completionHistory = [];
            // 補齊舊玩家的「初試身手」成就標記，避免重複領取點數（段考特訓單元沒有這項成就）
            if (unit.completionHistory.length > 0 && !trainerPaths.has(unitPath)) {
                unit.achievements.FIRST_CLEAR = true;
            }
        });
        return stats;
    }

    function loadProgress() {
        const savedStats = readStorage(STORAGE_KEY);
        let parsed = null;
        if (savedStats) {
            try {
                parsed = JSON.parse(savedStats);
            } catch (error) {
                // 存檔損毀：另存一份原始內容以便日後救回，再以全新進度開始
                console.error('存檔資料損毀，已另存備份：', error);
                writeStorage(STORAGE_CORRUPT_BACKUP_KEY, savedStats);
            }
        }
        playerStats = normalizeStats(parsed);
    }

    // 常駐總點數、點數紀錄視窗與得點慶祝的元素由程式建立，不寫在 index.html：
    // index.html 沒有防快取，瀏覽器可能拿舊的 index.html 配新的 script.js，元素寫在那裡會找不到。
    function buildPointsUi() {
        // 舊版 index.html 把總點數放在首頁標題下方
        document.getElementById('total-points-display')?.remove();
        document.body.insertAdjacentHTML('afterbegin', `
            <button id="points-hud" class="points-hud" type="button" title="查看點數紀錄">
                <span class="points-hud-coin" aria-hidden="true">🪙</span><span id="total-points-display">0</span><span class="visually-hidden"> 點，查看點數紀錄</span>
            </button>`);
        document.body.insertAdjacentHTML('beforeend', `
            <div id="points-history-container" style="display: none;">
                <div id="points-history-modal" role="dialog" aria-modal="true" aria-labelledby="points-history-title">
                    <button id="close-points-history-btn" type="button" aria-label="關閉">&times;</button>
                    <h2 id="points-history-title">點數紀錄</h2>
                    <p id="points-history-balance" class="points-history-balance"></p>
                    <p class="points-history-note">每次拿到或使用點數，都會記在這裡。</p>
                    <div id="points-history-body"></div>
                </div>
            </div>
            <div id="points-celebration" class="points-celebration" aria-hidden="true"></div>
            <div id="points-announcer" class="visually-hidden" role="status" aria-live="polite"></div>`);
    }

    // --- 加點：所有得點都走這裡，負責加總、記錄與慶祝 ---
    const MAX_POINTS_HISTORY = 300;

    // log 為 false 時不寫進得點紀錄（管理員加點已記在兌換紀錄裡）；呼叫端負責 saveProgress()
    // label 是慶祝畫面上的簡短說明，沒給就沿用 reason
    function grantPoints(points, reason, { title = '獲得點數！', label = reason, log = true } = {}) {
        if (!(points > 0)) return;
        playerStats.totalPoints += points;
        if (log) {
            playerStats.pointsHistory.unshift({ points, reason, timestamp: Date.now() });
            playerStats.pointsHistory.length = Math.min(playerStats.pointsHistory.length, MAX_POINTS_HISTORY);
        }
        queueCelebration({ points, reason, label, title });
    }

    // --- 得點慶祝：中央彈出「+N 點」，金幣飛向常駐總點數 ---
    const celebrationQueue = [];
    let celebrationBatch = null;      // 同一時間點發出的得點先收在這裡，合併成一次彈出
    let celebrationPlaying = false;
    let uncelebratedPoints = 0;       // 已入帳但動畫還沒播到的點數；常駐總點數先不顯示這部分
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    function queueCelebration(item) {
        uncelebratedPoints += item.points;
        if (!celebrationBatch) {
            celebrationBatch = [];
            setTimeout(() => {
                celebrationQueue.push(celebrationBatch);
                celebrationBatch = null;
                if (!celebrationPlaying) runCelebrations();
            }, 0);
        }
        celebrationBatch.push(item);
    }

    async function runCelebrations() {
        celebrationPlaying = true;
        while (celebrationQueue.length > 0) {
            const items = celebrationQueue.shift();
            try {
                await playCelebration(items);
            } catch (error) {
                console.warn('得點動畫播放失敗：', error);
                pointsCelebrationEl.innerHTML = '';
            }
            // 不論動畫是否順利，這批點數都要算進顯示的總點數
            uncelebratedPoints = Math.max(0, uncelebratedPoints - items.reduce((sum, item) => sum + item.points, 0));
            updateTotalPointsDisplay();
        }
        celebrationPlaying = false;
    }

    async function playCelebration(items) {
        const sum = items.reduce((total, item) => total + item.points, 0);
        const title = items[items.length - 1].title;
        const isSingle = items.length === 1;

        const card = createEl('div', 'celebration-card');
        card.appendChild(createEl('div', 'celebration-coin', '🪙'));
        card.appendChild(createEl('div', 'celebration-title', title));
        card.appendChild(createEl('div', 'celebration-amount', `+${sum} 點`));
        const list = createEl('ul', `celebration-reasons${isSingle ? ' single' : ''}`);
        items.forEach(item => {
            const li = createEl('li');
            li.appendChild(createEl('span', '', item.label));
            if (!isSingle) li.appendChild(createEl('span', '', `+${item.points}`));
            list.appendChild(li);
        });
        card.appendChild(list);
        pointsCelebrationEl.appendChild(card);
        card.classList.add('show');
        pointsAnnouncerEl.textContent = `獲得 ${sum} 點：${items.map(item => item.reason).join('、')}`;

        // 項目越多停留越久，讓孩子來得及看完
        await wait(1500 + Math.min(items.length, 5) * 300);

        const cardRect = card.getBoundingClientRect();
        card.classList.replace('show', 'hide');
        const shownBefore = (playerStats.totalPoints || 0) - uncelebratedPoints;
        if (reducedMotionQuery.matches) {
            totalPointsDisplayEl.textContent = shownBefore + sum;
        } else {
            await flyCoinsToHud(cardRect, Math.min(8, 3 + Math.floor(sum / 15)));
            await countUpHud(shownBefore, shownBefore + sum);
        }
        await wait(350);
        card.remove();
    }

    function bumpHud() {
        pointsHudEl.classList.remove('bump');
        void pointsHudEl.offsetWidth; // 強制重排，讓同一個動畫可以連續重播
        pointsHudEl.classList.add('bump');
    }

    function flyCoinsToHud(fromRect, count) {
        const target = pointsHudEl.getBoundingClientRect();
        const startX = fromRect.left + fromRect.width / 2 - 12;
        const startY = fromRect.top + 40;
        const endX = target.left + 14 - 12;
        const endY = target.top + target.height / 2 - 12;
        const flights = [];
        for (let i = 0; i < count; i++) {
            const coin = createEl('div', 'fly-coin', '🪙');
            document.body.appendChild(coin);
            const driftX = (Math.random() - 0.5) * 120;
            const driftY = (Math.random() - 0.5) * 80;
            const animation = coin.animate([
                { transform: `translate(${startX}px, ${startY}px) scale(1)`, opacity: 1 },
                { transform: `translate(${startX + driftX}px, ${startY + driftY}px) scale(1.25)`, opacity: 1, offset: 0.3 },
                { transform: `translate(${endX}px, ${endY}px) scale(0.6)`, opacity: 0.9 },
            ], { duration: 750, delay: i * 70, easing: 'cubic-bezier(0.5, 0, 0.3, 1)', fill: 'both' });
            const land = () => { coin.remove(); bumpHud(); };
            flights.push(animation.finished.then(land, land));
        }
        return Promise.all(flights);
    }

    function countUpHud(from, to) {
        bumpHud();
        return new Promise(resolve => {
            const duration = 500;
            const startTime = performance.now();
            // 分頁在背景時 requestAnimationFrame 會暫停，用計時器保底，避免佇列卡住
            const fallback = setTimeout(finish, duration + 300);
            function finish() {
                clearTimeout(fallback);
                totalPointsDisplayEl.textContent = to;
                resolve();
            }
            function tick(now) {
                const progress = Math.min(1, (now - startTime) / duration);
                if (progress >= 1) { finish(); return; }
                totalPointsDisplayEl.textContent = Math.round(from + (to - from) * progress);
                requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    }

    // --- 通知訊息（Toast）：每則獨立顯示，可同時堆疊 ---
    const MAX_VISIBLE_TOASTS = 4;

    function showToast(text, { title = '成就解鎖！', icon = '🏆', tone = '', duration = 4500 } = {}) {
        const toast = createEl('div', `toast${tone ? ` toast-${tone}` : ''}`);
        toast.appendChild(createEl('div', 'toast-icon', icon));
        const textBox = createEl('div', 'toast-text');
        textBox.appendChild(createEl('div', 'toast-title', title));
        textBox.appendChild(createEl('div', 'toast-description', text));
        toast.appendChild(textBox);

        while (toastContainerEl.children.length >= MAX_VISIBLE_TOASTS) {
            toastContainerEl.firstElementChild.remove();
        }
        toastContainerEl.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 20);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, duration);
    }

    // --- 視窗（Modal）管理：Esc／點背景關閉、焦點鎖定與還原 ---
    const modalStack = [];

    function isAnyModalOpen() {
        return modalStack.length > 0;
    }

    function getFocusableElements(container) {
        return [...container.querySelectorAll('button, input, select, summary, [href]')]
            .filter(element => !element.disabled && element.offsetParent !== null);
    }

    function openModal(container, { focusEl, onDismiss } = {}) {
        if (modalStack.some(entry => entry.container === container)) return;
        modalStack.push({ container, onDismiss, previousFocus: document.activeElement });
        container.style.display = 'flex';
        document.body.classList.add('modal-open');
        const target = focusEl || getFocusableElements(container)[0];
        if (target) target.focus();
    }

    function closeModal(container) {
        container.style.display = 'none';
        const index = modalStack.findIndex(entry => entry.container === container);
        if (index === -1) return;
        const [entry] = modalStack.splice(index, 1);
        if (modalStack.length === 0) document.body.classList.remove('modal-open');
        if (entry.previousFocus && document.contains(entry.previousFocus) && entry.previousFocus.offsetParent !== null) {
            entry.previousFocus.focus();
        } else if (container.contains(document.activeElement)) {
            document.activeElement.blur(); // 不讓焦點留在已隱藏的視窗裡
        }
    }

    // 使用者以 Esc 或點背景關閉最上層視窗
    function dismissModal(entry) {
        if (entry.onDismiss) entry.onDismiss();
        else closeModal(entry.container);
    }

    function setupModalInteractions() {
        document.addEventListener('keydown', event => {
            const top = modalStack[modalStack.length - 1];
            if (!top) return;
            if (event.key === 'Escape') {
                event.preventDefault();
                dismissModal(top);
                return;
            }
            if (event.key !== 'Tab') return;
            // 焦點鎖定在視窗內循環
            const focusable = getFocusableElements(top.container);
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (!top.container.contains(document.activeElement)) {
                event.preventDefault();
                first.focus();
            } else if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        [achievementContainer, redemptionContainer, pointsHistoryContainer, adminModalContainer, dialogContainer].forEach(container => {
            container.addEventListener('mousedown', event => {
                if (event.target !== container) return;
                const entry = modalStack.find(item => item.container === container);
                if (entry) dismissModal(entry);
            });
        });
    }

    // --- 通用對話框：取代瀏覽器內建的 alert / confirm，回傳 Promise<boolean> ---
    let dialogResolve = null;

    function settleDialog(result) {
        if (!dialogResolve) return;
        const resolve = dialogResolve;
        dialogResolve = null;
        closeModal(dialogContainer);
        resolve(result);
    }

    // focusCancel：有破壞性的確認（離開練習等）預設停在取消鈕，避免連按 Enter 誤觸
    function showDialog({ title, message, confirmText = '確定', cancelText = '', focusCancel = false }) {
        settleDialog(false); // 同時間只會有一個對話框
        dialogTitleEl.textContent = title;
        dialogMessageEl.textContent = message;
        dialogConfirmBtn.textContent = confirmText;
        dialogCancelBtn.textContent = cancelText;
        dialogCancelBtn.hidden = !cancelText;
        return new Promise(resolve => {
            dialogResolve = resolve;
            openModal(dialogContainer, {
                focusEl: focusCancel && cancelText ? dialogCancelBtn : dialogConfirmBtn,
                onDismiss: () => settleDialog(false),
            });
        });
    }

    function setFormError(errorEl, message) {
        errorEl.textContent = message || '';
        errorEl.hidden = !message;
    }

    // --- 成就系統 UI & 邏輯 ---

    function checkGlobalAchievements() {
        const stats = playerStats;
        for (const id in GLOBAL_ACHIEVEMENTS) {
            if (stats.unlockedGlobalAchievements[id]) continue;
            const ach = GLOBAL_ACHIEVEMENTS[id];
            const progress = ach.progress(stats);
            if (progress.current >= progress.target) {
                stats.unlockedGlobalAchievements[id] = true;
                grantPoints(ach.points, `${ach.icon} ${ach.name}`, { title: '成就解鎖！' });
            }
        }
    }

    function createEl(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function buildProgressStatus(progress) {
        const status = createEl('div', 'ach-row-status');
        const percent = progress.target > 0 ? Math.min((progress.current / progress.target) * 100, 100) : 0;
        const barContainer = createEl('div', 'ach-progress-bar-container');
        const bar = createEl('div', 'ach-progress-bar');
        bar.style.width = `${percent}%`;
        barContainer.appendChild(bar);
        status.appendChild(barContainer);
        status.appendChild(createEl('span', 'ach-progress-text', `${Math.min(progress.current, progress.target)} / ${progress.target}`));
        return status;
    }

    // 單一成就列：圖示、名稱與說明、點數、狀態（✓ / 進度條 / 未達成）
    function buildAchievementRow({ icon, name, description, pointsText, unlocked, progress, statusEl }) {
        const row = createEl('li', `ach-row${unlocked ? ' unlocked' : ''}`);
        row.appendChild(createEl('span', 'ach-row-icon', icon));
        const text = createEl('div', 'ach-row-text');
        text.appendChild(createEl('span', 'ach-row-name', name));
        text.appendChild(createEl('span', 'ach-row-desc', description));
        row.appendChild(text);
        row.appendChild(createEl('span', 'ach-chip', pointsText));
        if (statusEl) {
            row.appendChild(statusEl);
        } else if (unlocked) {
            row.appendChild(createEl('div', 'ach-row-status ach-done', '✓ 已解鎖'));
        } else if (progress) {
            row.appendChild(buildProgressStatus(progress));
        } else {
            row.appendChild(createEl('div', 'ach-row-status ach-locked', '未達成'));
        }
        return row;
    }

    function getHighestMedalId(unitData) {
        return [...MEDAL_IDS].reverse().find(id => unitData.achievements?.[id]) || null;
    }

    function buildUnitDetails(listInfo, unitData, isOpen) {
        const unitPath = listInfo.path;
        const achievements = unitData.achievements || {};
        const details = createEl('details', 'ach-unit');
        details.open = isOpen;

        // 收合列：模式標籤、單元名、最高獎牌、其他成就圖示、解鎖數
        const summary = createEl('summary', 'ach-unit-summary');
        summary.appendChild(createEl('span', `ach-mode-tag ${listInfo.type}`, '拼寫'));
        summary.appendChild(createEl('span', 'ach-unit-name', listInfo.name));
        const badges = createEl('span', 'ach-unit-badges');
        const highestMedal = getHighestMedalId(unitData);
        badges.appendChild(createEl('span', `ach-mini-icon${highestMedal ? ' unlocked' : ''}`, highestMedal ? UNIT_ACHIEVEMENTS[highestMedal].icon : '🏅'));
        ['FIRST_CLEAR', ...STREAK_IDS].forEach(id => {
            badges.appendChild(createEl('span', `ach-mini-icon${achievements[id] ? ' unlocked' : ''}`, UNIT_ACHIEVEMENTS[id].icon));
        });
        summary.appendChild(badges);
        const unlockedCount = Object.keys(UNIT_ACHIEVEMENTS).filter(id => achievements[id]).length;
        summary.appendChild(createEl('span', 'ach-unit-count', `${unlockedCount} / ${Object.keys(UNIT_ACHIEVEMENTS).length}`));
        details.appendChild(summary);

        const rows = createEl('ul', 'ach-rows');
        const firstClear = UNIT_ACHIEVEMENTS.FIRST_CLEAR;
        rows.appendChild(buildAchievementRow({
            icon: firstClear.icon, name: firstClear.name, description: firstClear.description,
            pointsText: `+${firstClear.points}`, unlocked: achievements.FIRST_CLEAR,
        }));

        // 銅、銀、金是同一件事的三個等級，合併成一列階梯顯示
        const ladder = createEl('div', 'ach-row-status ach-medal-ladder');
        MEDAL_IDS.forEach(id => {
            const step = createEl('span', `ach-medal-step${achievements[id] ? ' unlocked' : ''}`, UNIT_ACHIEVEMENTS[id].icon);
            step.title = `${UNIT_ACHIEVEMENTS[id].name}：${UNIT_ACHIEVEMENTS[id].description}${achievements[id] ? '（已解鎖）' : ''}`;
            ladder.appendChild(step);
        });
        rows.appendChild(buildAchievementRow({
            icon: highestMedal ? UNIT_ACHIEVEMENTS[highestMedal].icon : '🏅',
            name: '獎牌',
            description: '通關時愛心剩 3 顆銅牌、4 顆銀牌、全滿金牌',
            pointsText: MEDAL_IDS.map(id => `+${UNIT_ACHIEVEMENTS[id].points}`).join(' / '),
            unlocked: Boolean(highestMedal),
            statusEl: ladder,
        }));

        STREAK_IDS.forEach(id => {
            const ach = UNIT_ACHIEVEMENTS[id];
            rows.appendChild(buildAchievementRow({
                icon: ach.icon, name: ach.name, description: ach.description,
                pointsText: `+${ach.points}`, unlocked: achievements[id],
                progress: ach.progress(playerStats, unitPath),
            }));
        });
        details.appendChild(rows);
        return details;
    }

    function updateAchievementDisplay() {
        achievementListEl.innerHTML = '';

        const emptyUnitData = { achievements: {}, completionHistory: [] };
        const activeLists = getActiveWordLists().filter(list => list.type === 'spelling');
        // 已結束的單元只列出曾經通關過的
        const endedLists = wordLists.filter(list => list.disabled && playerStats.unitData[list.path]?.completionHistory?.length > 0);
        const unitIds = Object.keys(UNIT_ACHIEVEMENTS);
        const globalIds = Object.keys(GLOBAL_ACHIEVEMENTS);
        const unlockedTotal = globalIds.filter(id => playerStats.unlockedGlobalAchievements[id]).length
            + [...activeLists, ...endedLists].reduce((sum, list) => {
                const achievements = playerStats.unitData[list.path]?.achievements || {};
                return sum + unitIds.filter(id => achievements[id]).length;
            }, 0);
        const achievementTotal = globalIds.length + unitIds.length * (activeLists.length + endedLists.length);

        const summary = createEl('div', 'ach-summary');
        summary.appendChild(createEl('span', 'ach-summary-item', `🪙 總點數 ${playerStats.totalPoints || 0}`));
        summary.appendChild(createEl('span', 'ach-summary-item', `🏅 已解鎖 ${unlockedTotal} / ${achievementTotal}`));
        achievementListEl.appendChild(summary);

        // --- 全域成就 ---
        achievementListEl.appendChild(createEl('h3', 'ach-section-header', '全域成就'));
        const globalRows = createEl('ul', 'ach-rows');
        globalIds.forEach(id => {
            const ach = GLOBAL_ACHIEVEMENTS[id];
            globalRows.appendChild(buildAchievementRow({
                icon: ach.icon, name: ach.name, description: ach.description,
                pointsText: `+${ach.points}`, unlocked: playerStats.unlockedGlobalAchievements[id],
                progress: ach.progress(playerStats),
            }));
        });
        achievementListEl.appendChild(globalRows);

        // --- 單元成就：從首頁開啟時，自動展開目前選取的單元 ---
        achievementListEl.appendChild(createEl('h3', 'ach-section-header', '單元成就'));
        const selectedPath = startContainer.style.display !== 'none' ? wordListSelectEl.value : currentWordListPath;
        activeLists.forEach(list => {
            achievementListEl.appendChild(buildUnitDetails(list, playerStats.unitData[list.path] || emptyUnitData, list.path === selectedPath));
        });

        if (endedLists.length > 0) {
            const endedGroup = createEl('details', 'ach-ended-group');
            endedGroup.appendChild(createEl('summary', 'ach-ended-summary', `已結束的單元（${endedLists.length}）`));
            endedLists.forEach(list => {
                endedGroup.appendChild(buildUnitDetails(list, playerStats.unitData[list.path], false));
            });
            achievementListEl.appendChild(endedGroup);
        }
    }

    // --- 兌換系統 UI & 邏輯 ---
    function renderRedemptionHistory() {
        redemptionHistoryList.innerHTML = '';
        redemptionBalanceEl.textContent = `🪙 可用點數：${playerStats.totalPoints || 0}`;
        const history = playerStats.redemptionHistory || [];
        if (history.length === 0) {
            redemptionHistoryList.appendChild(createEl('li', 'history-empty', '尚無兌換紀錄。'));
            return;
        }
        history.forEach(record => {
            const li = document.createElement('li');
            const date = formatDateTime(record.timestamp);
            const isReward = record.points < 0; // record.points 為負代表是加點獎勵
            const displayPoints = Math.abs(record.points);
            const sign = isReward ? '+' : '-';
            const pointsClass = isReward ? 'history-points reward' : 'history-points';
            
            const item = document.createElement('div');
            item.className = 'history-item';
            [
                ['history-date', date],
                ['history-desc', record.description],
                [pointsClass, `${sign} ${displayPoints} 點`],
            ].forEach(([className, text]) => {
                const span = document.createElement('span');
                span.className = className;
                span.textContent = text;
                item.appendChild(span);
            });
            li.appendChild(item);
            redemptionHistoryList.appendChild(li);
        });
    }

    // --- 點數紀錄：得點紀錄與兌換紀錄合併成一份收支明細，依日期分組 ---
    function formatHistoryDay(timestamp) {
        const d = new Date(timestamp);
        if (Number.isNaN(d.getTime())) return '日期不明';
        const dayKey = getLocalDateString(d);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (dayKey === getLocalDateString()) return '今天';
        if (dayKey === getLocalDateString(yesterday)) return '昨天';
        return dayKey.replace(/-/g, '/');
    }

    function renderPointsHistory() {
        pointsHistoryBalanceEl.textContent = `🪙 ${playerStats.totalPoints || 0} 點`;
        pointsHistoryBodyEl.innerHTML = '';
        const records = [
            ...playerStats.pointsHistory.map(record => ({ change: record.points, text: record.reason, timestamp: record.timestamp })),
            // 兌換紀錄的 points 為正代表扣點、為負代表管理員加點
            ...playerStats.redemptionHistory.map(record => ({
                change: -record.points,
                text: record.points > 0 ? `兌換：${record.description}` : record.description,
                timestamp: record.timestamp,
            })),
        ].sort((a, b) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0));

        if (records.length === 0) {
            pointsHistoryBodyEl.appendChild(createEl('p', 'history-empty', '還沒有點數紀錄，完成練習就會出現在這裡。'));
            return;
        }
        let currentDay = null;
        let list = null;
        records.forEach(record => {
            const day = formatHistoryDay(record.timestamp);
            if (day !== currentDay) {
                currentDay = day;
                pointsHistoryBodyEl.appendChild(createEl('h3', 'points-history-day', day));
                list = createEl('ul', 'points-history-list');
                pointsHistoryBodyEl.appendChild(list);
            }
            const d = new Date(record.timestamp);
            const time = Number.isNaN(d.getTime()) ? '' : `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
            const item = createEl('li', 'history-item');
            item.appendChild(createEl('span', 'history-date', time));
            item.appendChild(createEl('span', 'history-desc', record.text));
            item.appendChild(createEl('span', `history-points${record.change > 0 ? ' reward' : ''}`, `${record.change > 0 ? '+' : '−'} ${Math.abs(record.change)} 點`));
            list.appendChild(item);
        });
    }

    // 解析表單中的正整數點數；格式不對回傳 null
    function parsePositiveInteger(value) {
        const number = Number(String(value).trim());
        return Number.isSafeInteger(number) && number > 0 ? number : null;
    }

    async function handleManualRedeem(event) {
        event.preventDefault();
        const pointsToRedeem = parsePositiveInteger(redeemPointsInput.value);
        const description = redeemDescInput.value.trim();
        if (pointsToRedeem === null) {
            setFormError(redemptionErrorEl, '請輸入正整數的兌換點數。');
            redeemPointsInput.focus();
            return;
        }
        if (playerStats.totalPoints < pointsToRedeem) {
            setFormError(redemptionErrorEl, `點數不足，目前只有 ${playerStats.totalPoints} 點。`);
            redeemPointsInput.focus();
            return;
        }
        if (!description) {
            setFormError(redemptionErrorEl, '請填寫兌換說明。');
            redeemDescInput.focus();
            return;
        }
        setFormError(redemptionErrorEl, '');

        const confirmed = await showDialog({
            title: '確認兌換',
            message: `確定要花費 ${pointsToRedeem} 點兌換「${description}」嗎？`,
            confirmText: '確認兌換',
            cancelText: '取消',
        });
        // 確認期間點數可能已變動（例如另一個分頁），扣點前再檢查一次
        if (!confirmed || playerStats.totalPoints < pointsToRedeem) return;

        playerStats.totalPoints -= pointsToRedeem;
        playerStats.redemptionHistory.unshift({ points: pointsToRedeem, description, timestamp: Date.now() });
        saveProgress();
        updateTotalPointsDisplay();
        renderRedemptionHistory();
        redemptionForm.reset();
        showToast(`已使用 ${pointsToRedeem} 點兌換「${description}」`, { title: '兌換成功', icon: '🎁' });
    }

    // --- 遊戲主要功能 ---
    function isNonEmptyString(value) {
        return typeof value === 'string' && value.trim() !== '';
    }

    // 題庫資料檢查：格式不完整的項目直接略過，避免練習途中出錯
    function isValidListItem(item) {
        return isPlainObject(item) && isNonEmptyString(item.english) && isNonEmptyString(item.chinese);
    }

    const LOAD_TIMEOUT_MS = 10000;

    // 網路卡住時不能讓首頁一直停在「載入中…」：超過時限就中止請求（含讀取內容的時間）
    async function fetchJsonWithTimeout(url, options, timeoutMs) {
        const controller = typeof AbortController === 'function' ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
        try {
            const response = await fetch(url, controller ? { ...options, signal: controller.signal } : options);
            if (!response.ok) throw new Error(`伺服器回應錯誤（代碼 ${response.status}）`);
            return await response.json(); // 內容讀完、解析完才算成功，期間仍受逾時保護
        } finally {
            clearTimeout(timer);
        }
    }

    function describeLoadError(error) {
        if (error && error.name === 'AbortError') return '連線逾時';
        if (error instanceof SyntaxError) return '題庫格式錯誤';
        if (error instanceof TypeError) return '無法連線到伺服器';
        return (error && error.message) || '未知的錯誤';
    }

    async function loadWords(filePath, mode, listName) {
        try {
            // no-cache：每次都向伺服器確認題庫是否更新，未變更時仍可使用快取
            const data = await fetchJsonWithTimeout(filePath, { cache: 'no-cache' }, LOAD_TIMEOUT_MS);
            const items = Array.isArray(data) ? data.filter(item => isValidListItem(item, mode)) : [];
            if (items.length === 0) throw new Error('題庫內容為空或格式錯誤');
            wordList = items;
            return true;
        } catch (error) {
            console.error(`載入題庫 ${filePath} 失敗：`, error);
            await showDialog({
                title: '載入失敗',
                message: `無法載入「${listName}」，請確認網路連線後再試一次。\n（${describeLoadError(error)}）`,
            });
            return false;
        }
    }

    // Fisher–Yates 洗牌，回傳新陣列
    function shuffle(items) {
        const result = [...items];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    // --- 拼寫遊戲邏輯 ---
    function initializeGame() {
        if (wordList.length === 0) return;
        roundCount = 1;
        gameMode = 'practice';
        wordsToReview = [];
        wordsWrongInSession.clear();
        currentStreak = 0;
        currentHealth = MAX_HEALTH;
        isCorrecting = false;
        correctionCount = 0;
        sessionStartPoints = playerStats.totalPoints;
        wordsToPractice = shuffle(wordList);
        stageTotal = wordsToPractice.length;
        if (!synth) playAudioBtnEl.style.display = 'none';
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback-message';
        updateHealthDisplay();
        setupNextWord();
    }

    // 鎖定期間輸入框仍保持啟用與焦點：若改用 disabled，手機的螢幕鍵盤會在每一題之間收起
    function setSpellingLocked(locked) {
        isSpellingLocked = locked;
        spellingInputEl.setAttribute('aria-busy', String(locked));
    }

    // 進度條顯示本階段「已完成」的題數（含剛答完的這一題）
    function updateSpellingProgress() {
        const completed = stageTotal - wordsToPractice.length;
        progressBarEl.style.width = `${stageTotal > 0 ? Math.min(completed / stageTotal, 1) * 100 : 0}%`;
    }

    function clearNextWordTimeout() {
        if (nextWordTimeout) {
            clearTimeout(nextWordTimeout);
            nextWordTimeout = null;
        }
    }

    function scheduleNextWord(delay) {
        clearNextWordTimeout();
        nextWordTimeout = setTimeout(() => {
            nextWordTimeout = null;
            setupNextWord();
        }, delay);
    }

    function setupNextWord() {
        // 回合切換的提示要保留到下一題；其餘情況清掉上一題的回饋訊息
        let hasStageNotice = false;
        if (wordsToPractice.length === 0) {
            hasStageNotice = true;
            if (wordsToReview.length > 0) {
                gameMode = 'review';
                wordsToPractice = shuffle(wordsToReview);
                stageTotal = wordsToPractice.length;
                wordsToReview = [];
                feedbackEl.textContent = '這一輪練習完成，現在開始訂正錯題。';
                feedbackEl.className = 'feedback-message notice';
            } else {
                // 完成一個回合：先發回合獎勵，再決定進入下一回合或結算
                awardRoundReward('spelling', roundCount);

                if (roundCount >= 3) {
                    gameOver(true);
                    return;
                }

                // 開始下一回合
                gameMode = 'practice';
                roundCount++;
                wordsToPractice = shuffle(wordList);
                stageTotal = wordsToPractice.length;
                feedbackEl.textContent = `太棒了！第 ${roundCount} 回合開始！`;
                feedbackEl.className = 'feedback-message notice';
                if (HEALTH_REPLENISH_ROUNDS.includes(roundCount - 1) && currentHealth < MAX_HEALTH) {
                    currentHealth++;
                    updateHealthDisplay();
                    feedbackEl.textContent += '愛心回補！❤️';
                }
            }
        }
        if (!hasStageNotice) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'feedback-message';
        }
        updateSpellingProgress();
        roundDisplayEl.textContent = gameMode === 'review' ? '訂正時間' : `第 ${roundCount} 回合`;
        progressBarEl.style.backgroundImage = gameMode === 'review' ? 'linear-gradient(45deg, var(--incorrect-color), #f56565)' : 'linear-gradient(45deg, var(--correct-color), #68d391)';
        currentWord = wordsToPractice.shift();
        playAudioBtnEl.style.display = synth ? 'block' : 'none';
        phoneticsEl.textContent = currentWord.phonetics || '';
        const hasExample = Boolean(currentWord.example && currentWord.example.trim());
        const targetWordRegex = getTargetWordRegex(currentWord.english, currentWord.example);

        if (gameMode === 'practice' && roundCount === 1) {
            translationEl.textContent = currentWord.chinese;
            renderExampleBubbles(currentWord, targetWordRegex);
            // 每個字保留第一個字母，其餘字母以底線代替；標點（' - ...）照原樣顯示
            wordDisplayEl.textContent = currentWord.english.split(' ')
                .map(w => w.slice(0, 1) + w.slice(1).replace(/[A-Za-z]/g, '_')).join(' ');
        } else if (gameMode === 'practice' && roundCount === 2) {
            translationEl.textContent = currentWord.chinese;
            renderExampleBubbles(currentWord, targetWordRegex);
            wordDisplayEl.textContent = currentWord.english.replace(/[A-Za-z]/g, '_');
        } else {
            // 第 3 回合或訂正：若無例句則降級顯示中文作為提示，避免畫面空白卡死
            translationEl.textContent = hasExample ? '' : currentWord.chinese;
            renderExampleBubbles(currentWord, targetWordRegex);
            wordDisplayEl.textContent = '';
        }
        spellingInputEl.value = '';
        setSpellingLocked(false);
        spellingInputEl.focus();
        // 上一題的語音可能還在唸（答題太快時），先停掉再播新題
        stopWordAudio();
        wordAutoPlayTimeout = setTimeout(() => {
            wordAutoPlayTimeout = null;
            playWordAudio();
        }, 100);
    }

    // --- 輔助函式 (對話解析、氣泡渲染與高亮控制) ---
    // 將例句拆成對話：「A: ... B: ...」→ 每句一行並記下說話者；非對話則整句一行
    function parseExampleDialogue(example) {
        const text = String(example || '').trim();
        if (!text) return { lines: [], speakers: [], isDialogue: false, formattedText: '' };
        const labels = [...text.matchAll(/(?:^|\s)([A-Za-z]):\s*/g)];
        if (labels.length === 0) {
            return { lines: [text], speakers: [null], isDialogue: false, formattedText: text };
        }

        const lines = [];
        const speakers = [];
        const leadingText = text.slice(0, labels[0].index).trim();
        if (leadingText) {
            lines.push(leadingText);
            speakers.push(null);
        }
        labels.forEach((label, i) => {
            const start = label.index + label[0].length;
            const end = i + 1 < labels.length ? labels[i + 1].index : text.length;
            const line = text.slice(start, end).trim();
            if (!line) return;
            lines.push(line);
            speakers.push(label[1].toUpperCase());
        });
        return { lines, speakers, isDialogue: true, formattedText: lines.join('\n') };
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 不規則變化：例句中出現這些形態時，也要一併挖空，否則會直接洩漏答案
    const IRREGULAR_WORD_FORMS = {
        be: ['am', 'is', 'are', 'was', 'were', 'been', 'being'],
        have: ['has', 'had', 'having'], do: ['does', 'did', 'done'], go: ['goes', 'went', 'gone'],
        begin: ['began', 'begun'], bite: ['bit', 'bitten'], blow: ['blew', 'blown'], break: ['broke', 'broken'],
        bring: ['brought'], build: ['built'], buy: ['bought'], catch: ['caught'], choose: ['chose', 'chosen'],
        come: ['came'], draw: ['drew', 'drawn'], drink: ['drank', 'drunk'], drive: ['drove', 'driven'],
        eat: ['ate', 'eaten'], fall: ['fell', 'fallen'], feed: ['fed'], feel: ['felt'], fight: ['fought'],
        find: ['found'], fly: ['flew', 'flown'], forget: ['forgot', 'forgotten'], get: ['got', 'gotten'],
        give: ['gave', 'given'], grow: ['grew', 'grown'], hang: ['hung'], hear: ['heard'], hide: ['hid', 'hidden'],
        hold: ['held'], keep: ['kept'], know: ['knew', 'known'], lay: ['laid'], lead: ['led'], leave: ['left'],
        lend: ['lent'], lie: ['lay', 'lain', 'lying'], lose: ['lost'], make: ['made'], mean: ['meant'],
        meet: ['met'], pay: ['paid'], ride: ['rode', 'ridden'], ring: ['rang', 'rung'], rise: ['rose', 'risen'],
        run: ['ran'], say: ['said'], see: ['saw', 'seen'], sell: ['sold'], send: ['sent'], shake: ['shook', 'shaken'],
        shine: ['shone'], shoot: ['shot'], sing: ['sang', 'sung'], sit: ['sat'], sleep: ['slept'],
        speak: ['spoke', 'spoken'], spend: ['spent'], stand: ['stood'], steal: ['stole', 'stolen'],
        swim: ['swam', 'swum'], take: ['took', 'taken'], teach: ['taught'], tell: ['told'], think: ['thought'],
        throw: ['threw', 'thrown'], understand: ['understood'], wake: ['woke', 'woken'], wear: ['wore', 'worn'],
        win: ['won'], write: ['wrote', 'written'], die: ['dying'], tie: ['tying'],
        child: ['children'], man: ['men'], woman: ['women'], foot: ['feet'], tooth: ['teeth'], mouse: ['mice'],
        person: ['people'], knife: ['knives'], life: ['lives'], leaf: ['leaves'], wife: ['wives'],
    };
    const POSSESSIVE_PATTERN = "(?:my|your|his|her|its|our|their|[A-Za-z]+'s)";
    const REFLEXIVE_PATTERN = '(?:myself|yourself|himself|herself|itself|ourselves|yourselves|themselves)';

    // 單一單字 → 涵蓋常見詞形變化的正規表示式片段
    function getWordFormsPattern(word) {
        const lower = word.toLowerCase();
        if (lower === "one's") return POSSESSIVE_PATTERN;
        if (lower === 'oneself') return REFLEXIVE_PATTERN;

        const escaped = escapeRegExp(word);
        const forms = [`${escaped}(?:s|es|ed|d|ing)?`];
        if (/^[a-z]{3,}$/i.test(word)) {
            const stem = escapeRegExp(word.slice(0, -1));
            if (/[^aeiou]y$/i.test(word)) forms.push(`${stem}(?:ies|ied)`);              // study → studies / studied
            if (/e$/i.test(word)) forms.push(`${stem}ing`);                               // make → making
            if (/[aeiou][^aeiouwxy]$/i.test(word)) forms.push(`${escaped}${escapeRegExp(word.slice(-1))}(?:ed|ing)`); // mop → mopped
        }
        (IRREGULAR_WORD_FORMS[lower] || []).forEach(form => forms.push(form));
        return `(?:${forms.join('|')})`;
    }

    // 產生用來在例句中挖空目標單字（片語）的正規表示式
    function getTargetWordRegex(english, example = '') {
        if (!english) return null;
        const cleanWord = english.replace(/[.,?!;:]+$/, '').trim();
        if (!cleanWord) return null;
        try {
            const prefix = /^\w/.test(cleanWord) ? '\\b' : '';
            const suffix = /\w$/.test(cleanWord) ? '\\b' : '';
            // 省略號 ... 允許中間穿插任意單字（如 not... at all）
            const build = wordSeparator => new RegExp(prefix + cleanWord.split(/\s*\.{3}\s*/).filter(Boolean)
                .map(segment => segment.split(/\s+/).map(getWordFormsPattern).join(wordSeparator))
                .join('\\s+(?:\\S+\\s+)*?') + suffix, 'gi');

            const strict = build('\\s+');
            if (!example || !/\s/.test(cleanWord) || strict.test(example)) {
                strict.lastIndex = 0;
                return strict;
            }
            // 可分片語動詞（wake your sister up、turn this sofa into）：允許片語中間插入最多 3 個字
            const loose = build('\\s+(?:\\S+\\s+){0,3}?');
            if (loose.test(example)) {
                loose.lastIndex = 0;
                return loose;
            }
            return strict;
        } catch (e) {
            return new RegExp(escapeRegExp(cleanWord), 'gi');
        }
    }

    const EXAMPLE_BLANK = '_______';

    function blankTargetWord(text, targetWordRegex) {
        return targetWordRegex ? text.replace(targetWordRegex, EXAMPLE_BLANK) : text;
    }

    function setSpeechHighlight(activeBubbleIndex) {
        const allBubbles = exampleEl.querySelectorAll('.chat-bubble');
        allBubbles.forEach(b => b.classList.remove('speaking-highlight'));

        if (activeBubbleIndex !== null && activeBubbleIndex !== undefined && activeBubbleIndex >= 0) {
            const activeBubble = document.getElementById(`example-bubble-${activeBubbleIndex}`);
            if (activeBubble) {
                activeBubble.classList.add('speaking-highlight');
            }
        }
    }

    function renderExampleBubbles(currentWord, targetWordRegex) {
        exampleEl.innerHTML = '';
        setSpeechHighlight(null);
        if (!currentWord || !currentWord.example) return;

        const dialogueInfo = parseExampleDialogue(currentWord.example);
        const container = document.createElement('div');
        container.className = 'dialogue-container';

        if (dialogueInfo.isDialogue) {
            // 第一位說話者靠左（A 樣式），其他人靠右（B 樣式）
            const firstSpeaker = dialogueInfo.speakers.find(Boolean);
            dialogueInfo.lines.forEach((lineText, idx) => {
                const speakerLabel = dialogueInfo.speakers[idx] || (idx === 0 ? 'A' : 'B');
                const speaker = speakerLabel === (firstSpeaker || 'A') ? 'a' : 'b';

                const bubble = document.createElement('div');
                bubble.className = `chat-bubble speaker-${speaker}`;
                bubble.id = `example-bubble-${idx}`;

                const avatar = document.createElement('span');
                avatar.className = 'avatar-badge';
                avatar.textContent = speakerLabel;

                const textSpan = document.createElement('span');
                textSpan.className = 'bubble-text';
                textSpan.textContent = blankTargetWord(lineText, targetWordRegex);

                bubble.appendChild(avatar);
                bubble.appendChild(textSpan);
                container.appendChild(bubble);
            });
        } else {
            const bubble = document.createElement('div');
            bubble.className = 'chat-bubble single-sentence';
            bubble.id = 'example-bubble-0';

            const textSpan = document.createElement('span');
            textSpan.className = 'bubble-text';
            textSpan.textContent = blankTargetWord(dialogueInfo.formattedText, targetWordRegex);

            bubble.appendChild(textSpan);
            container.appendChild(bubble);
        }

        exampleEl.appendChild(container);
    }

    // --- 語音輔助函式 ---
    // Chrome 首次呼叫 getVoices() 常回傳空陣列，待 voiceschanged 後再挑選並快取
    let cachedPreferredVoice = null;
    if (synth && 'onvoiceschanged' in synth) {
        synth.addEventListener('voiceschanged', () => { cachedPreferredVoice = null; });
    }

    function getPreferredVoice() {
        if (!cachedPreferredVoice) cachedPreferredVoice = findPreferredVoice();
        return cachedPreferredVoice;
    }

    function findPreferredVoice() {
        const voices = synth.getVoices();
        if (voices.length === 0) return null;

        // 優先尋找 Google 提供的女聲 (通常品質較好，特別是 Chrome)
        let preferredVoice = voices.find(voice => voice.name === 'Google US English');
        
        // 蘋果 macOS/iOS 上常見的高品質女聲
        if (!preferredVoice) {
            preferredVoice = voices.find(voice => voice.name === 'Samantha' && voice.lang.includes('en'));
        }
        
        // 微軟 Edge 上的高品質女聲
        if (!preferredVoice) {
            preferredVoice = voices.find(voice => voice.name.includes('Microsoft Zira') && voice.lang.includes('en'));
        }

        // 如果上面都沒找到，退而求其次找任何標示為 en-US 的聲音 (盡量避開有 'Male' 標籤的)
        // Android 的語系代碼是 en_US（底線），比對前先統一格式
        const langOf = voice => String(voice.lang || '').replace('_', '-');
        if (!preferredVoice) {
            preferredVoice = voices.find(voice => langOf(voice) === 'en-US' && !voice.name.includes('Male'));
        }

        // 最後手段：隨便挑一個英文聲音
        if (!preferredVoice) {
            preferredVoice = voices.find(voice => langOf(voice).startsWith('en'));
        }

        // 沒有任何英文語音時回傳 null，交給 utterance.lang = 'en-US' 讓瀏覽器自行挑選
        return preferredVoice || null;
    }

    let currentSpeechTimeout = null;
    let wordAudioRequestId = 0;
    let wordAutoPlayTimeout = null;
    let wordSpeechWatchdog = null;

    // 停止目前單字的語音序列；舊序列的回呼會因 requestId 不符而失效
    function stopWordAudio() {
        wordAudioRequestId++;
        clearTimeout(wordSpeechWatchdog);
        if (synth) synth.cancel();
        if (wordAutoPlayTimeout) {
            clearTimeout(wordAutoPlayTimeout);
            wordAutoPlayTimeout = null;
        }
        if (currentSpeechTimeout) {
            clearTimeout(currentSpeechTimeout);
            currentSpeechTimeout = null;
        }
        isPlaying = false;
        playAudioBtnEl.disabled = false;
        setSpeechHighlight(null);
    }

    function playWordAudio() {
        if (isPlaying || !currentWord || !synth) return;
        stopWordAudio();
        const requestId = wordAudioRequestId;

        let itemsToSpeak = [];

        if (activeGameMode === 'spelling') {
            const word = currentWord.english.split('(')[0].trim();
            const dialogueInfo = parseExampleDialogue(currentWord.example);

            if (gameMode === 'practice') {
                if (roundCount === 1) {
                    itemsToSpeak = [
                        { text: word, bubbleIdx: null },
                        ...dialogueInfo.lines.map((line, idx) => ({ text: line, bubbleIdx: idx }))
                    ];
                } else if (roundCount === 2) {
                    itemsToSpeak = [{ text: word, bubbleIdx: null }];
                } else {
                    itemsToSpeak = dialogueInfo.lines.length > 0
                        ? dialogueInfo.lines.map((line, idx) => ({ text: line, bubbleIdx: idx }))
                        : [{ text: word, bubbleIdx: null }];
                }
            } else { // 訂正階段
                itemsToSpeak = [{ text: word, bubbleIdx: null }];
            }
        }

        if (itemsToSpeak.length === 0) return;

        isPlaying = true;
        playAudioBtnEl.disabled = true;

        const preferredVoice = getPreferredVoice();

        function speakSequenceIndex(index) {
            if (requestId !== wordAudioRequestId) return;
            if (index >= itemsToSpeak.length) {
                isPlaying = false;
                playAudioBtnEl.disabled = false;
                setSpeechHighlight(null);
                return;
            }

            const item = itemsToSpeak[index];
            const { text, bubbleIdx } = item;

            if (!text || !text.trim()) {
                speakSequenceIndex(index + 1);
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            utterance.lang = 'en-US';
            utterance.rate = 0.9;

            utterance.onstart = () => {
                if (requestId !== wordAudioRequestId) return;
                isPlaying = true;
                playAudioBtnEl.disabled = true;
                setSpeechHighlight(bubbleIdx);
            };

            // 部分瀏覽器偶爾不會觸發 onend／onerror，設保險計時避免播放鈕永遠停在停用狀態
            clearTimeout(wordSpeechWatchdog);
            wordSpeechWatchdog = setTimeout(() => {
                if (requestId === wordAudioRequestId) stopWordAudio();
            }, 6000 + text.length * 150);

            utterance.onend = () => {
                if (requestId !== wordAudioRequestId) return;
                clearTimeout(wordSpeechWatchdog);
                setSpeechHighlight(null);
                if (index < itemsToSpeak.length - 1) {
                    currentSpeechTimeout = setTimeout(() => {
                        speakSequenceIndex(index + 1);
                    }, 500);
                } else {
                    isPlaying = false;
                    playAudioBtnEl.disabled = false;
                }
            };

            utterance.onerror = (event) => {
                // 被 cancel() 中斷的舊語音不算錯誤，也不能影響新的序列
                if (requestId !== wordAudioRequestId) return;
                // not-allowed：瀏覽器要求先有使用者操作才能發聲，屬正常情況，按播放鈕即可
                if (!['interrupted', 'canceled', 'not-allowed'].includes(event.error)) {
                    console.warn('語音合成發生錯誤:', event.error);
                }
                clearTimeout(wordSpeechWatchdog);
                isPlaying = false;
                playAudioBtnEl.disabled = false;
                setSpeechHighlight(null);
            };

            synth.speak(utterance);
        }

        speakSequenceIndex(0);
    }

    function handleSpellingSubmission(e) {
        e.preventDefault();
        // 視窗開著、或輸入法剛選完字的那一下 Enter，都不算送出答案
        if (!currentWord || isSpellingLocked || isAnyModalOpen() || Date.now() - lastCompositionEndAt < 100) return;
        const userAnswer = spellingInputEl.value.trim();
        if (userAnswer) checkSpellingAnswer(userAnswer);
    }

    // 比對用：統一撇號樣式、合併多餘空白、去掉結尾標點、不分大小寫。
    // 片語中的刪節號（not... at all）視同空白，打不打都算對
    function normalizeSpelling(value) {
        return String(value || '')
            .replace(/[’‘]/g, "'")
            .replace(/…|\.{2,}/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/[.,?!;:]+$/, '')
            .trim()
            .toLowerCase();
    }

    // 訂正階段的輸入框回饋（綠框脈動／紅框抖動）。
    // 訂正時會很快連續送出，所以每次都先清掉上一次的 class 與計時器，動畫才會重播
    let spellingInputFlashTimer = null;
    function flashSpellingInput(className) {
        clearTimeout(spellingInputFlashTimer);
        spellingInputEl.classList.remove('input-correct', 'input-incorrect');
        void spellingInputEl.offsetWidth; // 強制重排，讓同一個動畫可以重新開始
        spellingInputEl.classList.add(className);
        spellingInputFlashTimer = setTimeout(() => spellingInputEl.classList.remove(className), 600);
    }

    function checkSpellingAnswer(answer) {
        const cleanCorrectAnswer = currentWord.english.replace(/[.,?!;:]+$/, "");
        const isAnswerCorrect = normalizeSpelling(answer) === normalizeSpelling(currentWord.english);

        if (isCorrecting) {
            if (isAnswerCorrect) {
                correctionCount++;
                if (correctionCount >= REQUIRED_CORRECTIONS) {
                    isCorrecting = false;
                    correctionCount = 0;
                    feedbackEl.textContent = '很好，現在記住了！';
                    feedbackEl.className = 'feedback-message correct';
                    flashSpellingInput('input-correct');
                    setSpellingLocked(true);
                    updateSpellingProgress();
                    scheduleNextWord(1000);
                } else {
                    feedbackEl.textContent = `正確！請再輸入一次（${correctionCount} / ${REQUIRED_CORRECTIONS}）`;
                    feedbackEl.className = 'feedback-message correct';
                    spellingInputEl.value = '';
                    flashSpellingInput('input-correct');
                }
            } else {
                feedbackEl.textContent = `拼寫還是不對喔，請再試一次：${cleanCorrectAnswer}`;
                feedbackEl.className = 'feedback-message incorrect';
                spellingInputEl.value = '';
                flashSpellingInput('input-incorrect');
            }
            return;
        }

        setSpellingLocked(true);
        if (isAnswerCorrect) {
            feedbackEl.textContent = '正確！';
            feedbackEl.className = 'feedback-message correct';
            wordDisplayEl.textContent = currentWord.english;
            updateSpellingProgress();
            spellingInputEl.classList.add('input-correct');
            flashOverlayEl.classList.add('flash-correct');
            setTimeout(() => { spellingInputEl.classList.remove('input-correct'); flashOverlayEl.classList.remove('flash-correct'); }, 600);
            
            currentStreak++;
            playerStats.globalStats.totalWordsCorrect++;
            if (currentStreak > playerStats.globalStats.longestStreak) playerStats.globalStats.longestStreak = currentStreak;
            checkGlobalAchievements();
            saveProgress();
            updateTotalPointsDisplay();

            scheduleNextWord(500);
        } else {
            feedbackEl.innerHTML = '';
            const feedbackBox = document.createElement('div');
            feedbackBox.className = 'spelling-mistake-box';
            [`你輸入的是：${answer}`, `正確答案是：${cleanCorrectAnswer}`, `請照著輸入 ${REQUIRED_CORRECTIONS} 次`].forEach(lineText => {
                const line = document.createElement('div');
                line.textContent = lineText;
                feedbackBox.appendChild(line);
            });
            feedbackEl.appendChild(feedbackBox);
            feedbackEl.className = 'feedback-message incorrect';
            wordDisplayEl.textContent = currentWord.english;
            spellingInputEl.classList.add('input-incorrect');
            flashOverlayEl.classList.add('flash-incorrect');
            setTimeout(() => { spellingInputEl.classList.remove('input-incorrect'); flashOverlayEl.classList.remove('flash-incorrect'); }, 600);
            
            currentStreak = 0;
            wordsWrongInSession.set(currentWord.english, currentWord);
            if (!wordsToReview.some(w => w.english === currentWord.english)) {
                wordsToReview.push(currentWord);
            }
            
            currentHealth--;
            updateHealthDisplay();
            if (currentHealth <= 0) {
                gameOver(false);
                return;
            }
            
            isCorrecting = true;
            correctionCount = 0;
            spellingInputEl.value = '';
            setSpellingLocked(false);
            spellingInputEl.focus();
        }
    }

    function awardRoundReward(mode, round) {
        const pointsAwarded = ROUND_REWARDS[round];
        if (!pointsAwarded) return;
        const unitData = ensureUnitData(currentWordListPath);
        const rewardKey = ROUND_REWARD_KEYS[mode];
        if (!unitData[rewardKey]) unitData[rewardKey] = {};

        const roundLabel = `第 ${round} 回合`;
        const todayKey = getLocalDateString();
        const toastOptions = { title: '回合完成！', icon: '🪙' };
        if (unitData[rewardKey][round] !== todayKey) {
            unitData[rewardKey][round] = todayKey;
            grantPoints(pointsAwarded, `「${currentWordListName}」完成${roundLabel}`, { title: '回合完成！', label: `完成${roundLabel}` });
        } else {
            showToast(`完成${roundLabel}！（今日點數已領取）`, toastOptions);
        }
        saveProgress();
        updateTotalPointsDisplay();
    }

    function grantUnitAchievement(unitName, ach) {
        grantPoints(ach.points, `「${unitName}」${ach.icon} ${ach.name}`, { title: '恭喜通關！', label: `${ach.icon} ${ach.name}` });
    }

    // 單元通關結算：記錄完成時間並發放首次通關、獎牌、累計成就點數
    function awardUnitCompletion(unitPath, unitName, remainingHealth) {
        const unitData = ensureUnitData(unitPath);
        unitData.completionHistory.push(Date.now());

        const medalRules = [
            ['FIRST_CLEAR', true],
            ['GOLD', remainingHealth === MAX_HEALTH],
            ['SILVER', remainingHealth >= MAX_HEALTH - 1],
            ['BRONZE', remainingHealth >= MAX_HEALTH - 2],
        ];
        medalRules.forEach(([id, qualified]) => {
            if (!qualified || unitData.achievements[id]) return;
            unitData.achievements[id] = true;
            grantUnitAchievement(unitName, UNIT_ACHIEVEMENTS[id]);
        });
        checkStreakAchievements(unitPath, unitName);
        checkGlobalAchievements();
    }

    // 單字拼寫的結算畫面
    function showCompletionScreen({ isSuccess, title, message, remainingHealth, reviewTitle, reviewItems = [] }) {
        completionContainer.classList.toggle('fail', !isSuccess);
        completionIconEl.textContent = isSuccess ? '🎉' : '💪';
        completionTitleEl.textContent = title;
        completionMessageEl.textContent = message;

        completionStatsEl.innerHTML = '';
        const earnedPoints = Math.max(0, playerStats.totalPoints - sessionStartPoints);
        [
            `❤️ 剩餘愛心 ${Math.max(0, remainingHealth)} / ${MAX_HEALTH}`,
            `🪙 本次獲得 ${earnedPoints} 點`,
        ].forEach(text => completionStatsEl.appendChild(createEl('li', '', text)));

        completionReviewListEl.innerHTML = '';
        completionReviewEl.hidden = reviewItems.length === 0;
        if (reviewItems.length > 0) {
            completionReviewTitleEl.textContent = `${reviewTitle}（${reviewItems.length}）`;
            reviewItems.forEach(item => {
                const li = createEl('li');
                li.appendChild(createEl('span', 'completion-review-main', item.main));
                li.appendChild(createEl('span', 'completion-review-sub', item.sub));
                completionReviewListEl.appendChild(li);
            });
        }

        gameContainer.style.display = 'none';
        completionContainer.style.display = 'flex';
        window.scrollTo(0, 0);
        moveFocusTo(completionTitleEl);
    }

    // 以程式把焦點移到非互動元素（標題、結果卡片）
    function moveFocusTo(element) {
        if (!element) return;
        if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
        element.focus({ preventScroll: true });
    }

    // --- 通用遊戲邏輯 ---
    function gameOver(isSuccess) {
        clearNextWordTimeout();
        stopWordAudio();
        currentWord = null;
        if (isSuccess) awardUnitCompletion(currentWordListPath, currentWordListName, currentHealth);
        saveProgress();
        updateTotalPointsDisplay();

        showCompletionScreen({
            isSuccess,
            title: isSuccess ? '恭喜通關！' : '練習失敗',
            message: isSuccess ? '你已完成本單元的三回合拼寫練習。' : '愛心已耗盡，複習一下這些單字，再試一次吧！',
            remainingHealth: currentHealth,
            reviewTitle: '本次需要加強的單字',
            reviewItems: [...wordsWrongInSession.values()].map(word => ({ main: word.english, sub: word.chinese })),
        });
    }

    // 練習途中離開：先確認，避免誤觸
    async function confirmQuitPractice() {
        // 確認框開著時先暫停「自動換下一題」，否則題目會在確認框底下偷偷換掉
        const hadPendingNextWord = nextWordTimeout !== null;
        clearNextWordTimeout();

        const confirmed = await showDialog({
            title: '要離開練習嗎？',
            message: '這次練習的進度不會保留，已經拿到的點數不受影響。',
            confirmText: '離開',
            cancelText: '繼續練習',
            focusCancel: true,
        });
        if (confirmed) {
            showStartScreen();
        } else if (gameContainer.style.display !== 'none') {
            if (hadPendingNextWord) scheduleNextWord(0);
            else if (!isSpellingLocked) spellingInputEl.focus();
        }
    }

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return [d.getUTCFullYear(), weekNo];
    }

    function checkStreakAchievements(unitPath, unitName) {
        const unitData = playerStats.unitData[unitPath];
        if (!unitData) return;
        for (const id in UNIT_ACHIEVEMENTS) {
            if (id.includes('STREAK')) {
                if (!unitData.achievements[id]) {
                    const ach = UNIT_ACHIEVEMENTS[id];
                    const progress = ach.progress(playerStats, unitPath);
                    if (progress.current >= progress.target) {
                        unitData.achievements[id] = true;
                        grantUnitAchievement(unitName, ach);
                    }
                }
            }
        }
    }

    function showStartScreen() {
        // 停掉練習中殘留的計時器與語音，避免回到首頁後還在背景執行
        clearNextWordTimeout();
        stopWordAudio();
        if (window.TrainerMode) window.TrainerMode.stop();
        currentWord = null;

        gameContainer.style.display = 'none';
        trainerContainer.style.display = 'none';
        completionContainer.style.display = 'none';
        spellingFormEl.style.display = 'none';
        startContainer.style.display = 'flex';

        updateTotalPointsDisplay();
        // 保留上次選的模式與單元，不必每次重選
        selectGameMode(activeGameMode);
        window.scrollTo(0, 0);
        // 從其他畫面回來時把焦點放到「開始練習」；剛載入頁面時不搶焦點
        if (hasEnteredApp) (startGameBtn.disabled ? modeBtnSpelling : startGameBtn).focus({ preventScroll: true });
        hasEnteredApp = true;
    }

    function updateTotalPointsDisplay() {
        // 得點動畫播放中由動畫負責更新數字，播完會再呼叫一次
        if (celebrationPlaying) return;
        totalPointsDisplayEl.textContent = Math.max(0, (playerStats.totalPoints || 0) - uncelebratedPoints);
    }

    function renderHearts(displayEl, health) {
        displayEl.innerHTML = '';
        // 螢幕閱讀器讀「剩餘愛心 3 / 5」，而不是逐一唸出五個愛心符號
        displayEl.setAttribute('role', 'img');
        displayEl.setAttribute('aria-label', `剩餘愛心 ${Math.max(0, health)} / ${MAX_HEALTH}`);
        for (let i = 0; i < MAX_HEALTH; i++) {
            const heartSpan = document.createElement('span');
            heartSpan.classList.add('heart');
            heartSpan.textContent = '❤️';
            heartSpan.setAttribute('aria-hidden', 'true');
            if (i < health) heartSpan.classList.add('full');
            displayEl.appendChild(heartSpan);
        }
    }

    function updateHealthDisplay() {
        renderHearts(healthDisplayEl, currentHealth);
    }

    // --- 首頁：模式與單元選擇 ---
    const modeButtons = { spelling: modeBtnSpelling, trainer: modeBtnTrainer };

    // 記住上次選的模式，以及每個模式上次選的單元（存在瀏覽器，重新整理後仍保留）
    let lastSelection = { mode: '', paths: {} };

    function loadSelection() {
        try {
            const saved = JSON.parse(readStorage(SELECTION_KEY) || 'null');
            if (isPlainObject(saved)) {
                lastSelection = {
                    mode: typeof saved.mode === 'string' ? saved.mode : '',
                    paths: isPlainObject(saved.paths) ? saved.paths : {},
                };
            }
        } catch (error) {
            // 選單記憶只是便利功能，讀取失敗就用預設值
        }
    }

    function saveSelection() {
        if (!activeGameMode) return;
        lastSelection.mode = activeGameMode;
        if (wordListSelectEl.value) lastSelection.paths[activeGameMode] = wordListSelectEl.value;
        writeStorage(SELECTION_KEY, JSON.stringify(lastSelection));
    }

    function selectGameMode(mode) {
        activeGameMode = modeButtons[mode] ? mode : '';
        Object.entries(modeButtons).forEach(([buttonMode, button]) => {
            const isSelected = buttonMode === activeGameMode;
            button.classList.toggle('mode-selected', isSelected);
            button.setAttribute('aria-pressed', String(isSelected));
        });
        updateWordListDropdown(activeGameMode);
        renderPointsInfo(activeGameMode);
        saveSelection();
    }

    // 首頁「如何獲得點數？」區塊：依目前選擇的模式列出對應的得點方式
    const MODE_LABELS = { spelling: '單字拼寫', trainer: '段考特訓' };

    function getUnitPointsInfoTexts() {
        const roundText = Object.entries(ROUND_REWARDS)
            .map(([round, points]) => `第 ${round} 回合 +${points}`).join('、');
        const medalText = MEDAL_IDS
            .map(id => `${UNIT_ACHIEVEMENTS[id].icon} +${UNIT_ACHIEVEMENTS[id].points}`).join('、');
        const streakText = [
            ['THREE_DAY_STREAK', '3 天'],
            ['THREE_WEEK_STREAK', '3 週'],
            ['THREE_MONTH_STREAK', '3 個月'],
        ].map(([id, span]) => `${span} ${UNIT_ACHIEVEMENTS[id].icon} +${UNIT_ACHIEVEMENTS[id].points}`).join('、');
        const globalText = Object.values(GLOBAL_ACHIEVEMENTS)
            .map(ach => `${ach.icon} ${ach.name} +${ach.points}`).join('、');
        const firstClear = UNIT_ACHIEVEMENTS.FIRST_CLEAR;
        return [
            { heading: '🎁 只給一次' },
            `第一次完成單元：每個單元 ${firstClear.icon} +${firstClear.points}。`,
            `獎牌：通關時愛心剩越多越好，${medalText}。愛心全滿就是金牌！`,
            `常回來練同一個單元：練滿 ${streakText}。`,
            `超級大獎：${globalText}。詳情請看 🏆 我的成就。`,
            { heading: '🔁 每天都有' },
            `過關就有點數：${roundText}。`,
        ];
    }

    const TRAINER_POINTS_INFO = [
        // { heading } 是分組小標題，其餘字串是一般項目
        { heading: '🎁 只給一次' },
        '診斷：做完 +10。',
        '文法點通關獎勵：觀念卡 +3，三階 +5、+7、+10。',
        '題型專練：每種題型第一次過關 +5。',
        '模擬段考第一次 60 分以上：完整卷 +30、半卷 +15。',
        { heading: '🔁 每天都有' },
        '模擬段考及格：完整卷 +20、半卷 +10。',
        '錯題本：當天到期的錯題全部答對 +5。',
    ];

    function getPointsInfoTexts(mode) {
        if (mode === 'spelling') return getUnitPointsInfoTexts();
        if (mode === 'trainer') return TRAINER_POINTS_INFO;
        return [
            '單字拼寫：每天過關就有點數，還能拿獎牌和成就。',
            '段考特訓：模擬段考及格、訂正錯題、練完文法點，都有點數。',
            '👆 點一下上面的練習模式，看看怎麼拿點數！',
        ];
    }

    function renderPointsInfo(mode) {
        pointsInfoTitleEl.textContent = MODE_LABELS[mode] ? `「${MODE_LABELS[mode]}」如何獲得點數？🪙` : '如何獲得點數？🪙';
        pointsInfoListEl.innerHTML = '';
        getPointsInfoTexts(mode).forEach(entry => {
            const isHeading = typeof entry === 'object';
            pointsInfoListEl.appendChild(createEl('li', isHeading ? 'points-info-heading' : '', isHeading ? entry.heading : entry));
        });
    }

    function updateWordListDropdown(selectedMode) {
        wordListSelectEl.innerHTML = '';
        const selectedType = typeof selectedMode === 'string' ? selectedMode : activeGameMode;
        const filteredLists = wordLists.filter(list => list.type === selectedType && !list.disabled);

        if (filteredLists.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = selectedType ? '此模式無可用單元' : '請先選擇模式';
            wordListSelectEl.appendChild(option);
            wordListSelectEl.disabled = true;
            startGameBtn.disabled = true;
            updateUnitRewardsBadge();
            return;
        }

        filteredLists.forEach(list => {
            const option = document.createElement('option');
            option.value = list.path;
            option.textContent = list.name;
            wordListSelectEl.appendChild(option);
        });
        // 還原這個模式上次選的單元（若仍在清單中）
        const rememberedPath = lastSelection.paths[selectedType];
        if (filteredLists.some(list => list.path === rememberedPath)) wordListSelectEl.value = rememberedPath;
        wordListSelectEl.disabled = false;
        startGameBtn.disabled = false;
        updateUnitRewardsBadge();
    }

    function setUnitRewardsHint(text, tone = '') {
        unitRewardsHintEl.textContent = text;
        unitRewardsHintEl.className = `unit-rewards-hint${tone ? ` tone-${tone}` : ''}`;
        unitRewardsHintEl.hidden = !text;
    }

    // 一枚每日獎勵金幣：拿到之後亮起並打勾
    function createRewardBadge(points, labelText, hasClaimed) {
        const badge = createEl('div', `reward-badge${hasClaimed ? ' active' : ''}`);
        badge.appendChild(createEl('div', 'coin', `+${points}`));
        badge.appendChild(createEl('div', 'badge-label', labelText));
        return badge;
    }

    // 段考特訓的每日點數：3 枚金幣就是全部的每日項目，各每天一次。
    // 規則在 trainer-core.js 的 grantDaily；這裡只讀存檔，不寫入
    function updateTrainerRewardsBadge(unitPath) {
        const badgeContainer = unitRewardsBadgeContainer;
        const core = window.TrainerCore;
        const unitDef = core?.UNITS.find(unit => unit.path === unitPath);
        if (!unitDef) {
            badgeContainer.style.display = 'none';
            setUnitRewardsHint('');
            return;
        }

        const daily = playerStats.trainerRewards?.dailyUnits?.[unitDef.key];
        const isToday = isPlainObject(daily) && daily.date === getLocalDateString();
        const flags = isToday && isPlainObject(daily.flags) ? daily.flags : {};
        const earned = isToday ? Math.max(0, Number(daily.points) || 0) : 0;
        const cap = core.DAILY_CAP;

        const badges = [
            { points: 20, label: '完整卷及格', flag: 'mockpass:full' },
            { points: 10, label: '半卷及格', flag: 'mockpass:half' },
            { points: 5, label: '錯題全對', flag: 'clear' },
        ];
        badgeContainer.innerHTML = '';
        badgeContainer.style.display = 'flex';
        badges.forEach(b => badgeContainer.appendChild(createRewardBadge(b.points, b.label, Boolean(flags[b.flag]))));

        if (earned >= cap) {
            setUnitRewardsHint(`🎉 太棒了！這個單元今天的每日點數 ${cap} 點都拿到了！`, 'done');
        } else if (earned > 0) {
            setUnitRewardsHint(`🔥 這個單元的每日點數今天已拿 ${earned} / ${cap} 點，繼續加油！`, 'gold');
        } else {
            setUnitRewardsHint(`💡 這個單元的每日點數，今天最多可以拿 ${cap} 點！`);
        }
    }

    function updateUnitRewardsBadge() {
        const badgeContainer = unitRewardsBadgeContainer;

        if (activeGameMode === 'trainer' && wordListSelectEl.value) {
            updateTrainerRewardsBadge(wordListSelectEl.value);
            return;
        }

        // 只有單字拼寫顯示每日回合獎勵
        if (activeGameMode !== 'spelling' || !wordListSelectEl.value) {
            badgeContainer.style.display = 'none';
            setUnitRewardsHint('');
            return;
        }

        const unitPath = wordListSelectEl.value;
        const rewardKey = ROUND_REWARD_KEYS[activeGameMode];
        
        // 唯讀取得該單元的今日獎勵進度，避免只是瀏覽選單就寫入空資料
        const today = getLocalDateString();
        const claimedInfo = playerStats.unitData[unitPath]?.[rewardKey] || {};

        badgeContainer.innerHTML = '';
        badgeContainer.style.display = 'flex';

        let completedRounds = 0;
        const rounds = Object.entries(ROUND_REWARDS).map(([round, points]) => ({ round: Number(round), points, label: `第 ${round} 回合` }));
        const maxDailyPoints = rounds.reduce((sum, r) => sum + r.points, 0);

        rounds.forEach(r => {
            const hasClaimed = claimedInfo[r.round] === today;
            badgeContainer.appendChild(createRewardBadge(r.points, r.label, hasClaimed));
            if (hasClaimed) {
                completedRounds++;
            }
        });

        // 更新引導文案
        const nextUnclaimed = rounds.find(r => claimedInfo[r.round] !== today);
        if (completedRounds === 0) {
            setUnitRewardsHint(`💡 今天過完 ${rounds.length} 回合，最多可以拿 ${maxDailyPoints} 點！`);
        } else if (nextUnclaimed) {
            setUnitRewardsHint(`🔥 加油！過第 ${nextUnclaimed.round} 回合再拿 ${nextUnclaimed.points} 點！`, 'gold');
        } else {
            setUnitRewardsHint('🎉 太棒了！今天這個單元的點數都拿到了！', 'done');
        }
    }

    let isStartingGame = false;

    async function startGame() {
        const mode = activeGameMode;
        const listInfo = wordLists.find(list => list.path === wordListSelectEl.value && list.type === mode && !list.disabled);
        if (isStartingGame || !listInfo) return;

        // 段考特訓自己載入題庫（格式與單字檔不同），不走 loadWords，也不動到拼寫用的 wordList
        if (mode === 'trainer') {
            if (!window.TrainerMode) {
                showDialog({ title: '載入失敗', message: '段考特訓的程式沒有載入成功，請重新整理頁面再試一次。' });
                return;
            }
            saveSelection();
            startContainer.style.display = 'none';
            gameContainer.style.display = 'none';
            spellingFormEl.style.display = 'none';
            completionContainer.style.display = 'none';
            trainerContainer.style.display = 'block';
            window.scrollTo(0, 0);
            window.TrainerMode.start(trainerBridge, listInfo);
            return;
        }

        // 載入期間鎖住按鈕，避免連點造成重複開始
        isStartingGame = true;
        startGameBtn.disabled = true;
        startGameBtn.textContent = '載入中…';
        wordListSelectEl.disabled = true;
        Object.values(modeButtons).forEach(button => { button.disabled = true; });
        let loaded = false;
        try {
            loaded = await loadWords(listInfo.path, mode, listInfo.name);
        } finally {
            isStartingGame = false;
            startGameBtn.textContent = '開始練習';
            wordListSelectEl.disabled = false;
            Object.values(modeButtons).forEach(button => { button.disabled = false; });
            startGameBtn.disabled = !wordListSelectEl.value;
        }
        if (!loaded) {
            startGameBtn.focus();
            return;
        }
        // 載入期間若開了成就／兌換視窗，先關掉，避免練習在視窗底下開始
        while (modalStack.length > 0) dismissModal(modalStack[modalStack.length - 1]);

        activeGameMode = mode;
        currentWordListPath = listInfo.path;
        currentWordListName = listInfo.name;
        saveSelection();
        if (!playerStats.unitData[currentWordListPath]) {
            ensureUnitData(currentWordListPath);
            saveProgress();
        }

        startContainer.style.display = 'none';
        window.scrollTo(0, 0);
        spellingFormEl.style.display = 'block';
        gameContainer.style.display = 'block';
        initializeGame();
    }

    // --- 管理員加點功能（SHA-256 驗證）---
    const ADMIN_PASSWORD_HASH = '5406151279c1cf649ced0b0c66dfca309cb446ea15ddfb2ef3565d17089ac71a';
    const ADMIN_DEFAULT_POINTS = 100;
    const ADMIN_DEFAULT_REASON = '管理員手動獎勵';

    async function sha256(message) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function openAdminModal() {
        adminModalTitleEl.textContent = '管理員驗證';
        adminPasswordForm.hidden = false;
        adminGrantForm.hidden = true;
        adminPasswordForm.reset();
        setFormError(adminPasswordErrorEl, '');
        openModal(adminModalContainer, { focusEl: adminPasswordInput });
    }

    async function handleAdminPasswordSubmit(event) {
        event.preventDefault();
        if (!adminPasswordInput.value) {
            setFormError(adminPasswordErrorEl, '請輸入管理員密碼。');
            adminPasswordInput.focus();
            return;
        }

        let inputHash;
        try {
            inputHash = await sha256(adminPasswordInput.value);
        } catch (error) {
            // crypto.subtle 只在 HTTPS 或 localhost 可用
            console.error('無法進行密碼驗證：', error);
            setFormError(adminPasswordErrorEl, '此環境無法進行驗證，請改用 HTTPS 網址開啟本網站。');
            return;
        }

        if (inputHash !== ADMIN_PASSWORD_HASH) {
            setFormError(adminPasswordErrorEl, '密碼錯誤，請再試一次。');
            adminPasswordInput.value = '';
            adminPasswordInput.focus();
            return;
        }

        // 驗證通過：切換到加點表單
        adminModalTitleEl.textContent = '管理員加點';
        adminPasswordForm.hidden = true;
        adminPasswordForm.reset();
        adminGrantForm.hidden = false;
        adminPointsInput.value = ADMIN_DEFAULT_POINTS;
        adminReasonInput.value = ADMIN_DEFAULT_REASON;
        setFormError(adminGrantErrorEl, '');
        adminPointsInput.focus();
        adminPointsInput.select();
    }

    function handleAdminGrantSubmit(event) {
        event.preventDefault();
        if (adminGrantForm.hidden) return;
        const points = parsePositiveInteger(adminPointsInput.value);
        const reason = adminReasonInput.value.trim();
        if (points === null) {
            setFormError(adminGrantErrorEl, '請輸入正整數的點數。');
            adminPointsInput.focus();
            return;
        }
        if (!reason) {
            setFormError(adminGrantErrorEl, '請填寫加點原因。');
            adminReasonInput.focus();
            return;
        }

        // 兌換紀錄中以負數代表加點；這筆已記在兌換紀錄，不再重複寫進得點紀錄
        playerStats.redemptionHistory.unshift({ points: -points, description: `[獎勵] ${reason}`, timestamp: Date.now() });
        grantPoints(points, reason, { title: '獲得獎勵！', log: false });
        saveProgress();
        updateTotalPointsDisplay();
        closeModal(adminModalContainer);
    }

    // 其他分頁更新了存檔時同步過來，避免兩個分頁互相覆蓋進度
    function handleStorageChange(event) {
        if (event.key !== STORAGE_KEY || !event.newValue) return;
        loadProgress();
        updateTotalPointsDisplay();
        if (startContainer.style.display !== 'none') updateUnitRewardsBadge();
        if (redemptionContainer.style.display !== 'none') renderRedemptionHistory();
        if (pointsHistoryContainer.style.display !== 'none') renderPointsHistory();
    }

    // --- 段考特訓的接點：trainer.js 透過這組函式使用共用工具與點數（一律傳函式，playerStats 會被重新指派）---
    const trainerBridge = {
        createEl, showToast, showDialog, isAnyModalOpen, shuffle, getLocalDateString, readStorage, writeStorage, moveFocusTo,
        fetchJson: url => fetchJsonWithTimeout(url, { cache: 'no-cache' }, LOAD_TIMEOUT_MS),
        // 朗讀文章用和單字發音同一個語音
        getPreferredVoice: () => (synth ? getPreferredVoice() : null),
        // 點數帳本與總點數放在同一份存檔，沿用跨分頁同步
        getRewardLedger() {
            if (!isPlainObject(playerStats.trainerRewards)) playerStats.trainerRewards = {};
            const ledger = playerStats.trainerRewards;
            // 每日類點數每個單元各一本帳：{ u3: { date, points, flags }, ... }
            if (!isPlainObject(ledger.dailyUnits)) ledger.dailyUnits = {};
            if (!isPlainObject(ledger.once)) ledger.once = {};
            return ledger;
        },
        grantPoints(points, label) {
            if (!(points > 0)) return;
            grantPoints(points, `段考特訓：${label || '練習獎勵'}`, { title: '段考特訓', label: label || '練習獎勵' });
            saveProgress();
            updateTotalPointsDisplay();
        },
        saveLedger: () => saveProgress(),
        // 每天第一次完成特訓活動時記一筆，接上「修練狂魔」的練習天數
        recordPracticeDay(unitPath) {
            const unitData = ensureUnitData(unitPath);
            const today = getLocalDateString();
            if (unitData.completionHistory.some(ts => getLocalDateString(ts) === today)) return;
            unitData.completionHistory.push(Date.now());
            checkGlobalAchievements();
            saveProgress();
            updateTotalPointsDisplay();
        },
        exit: () => showStartScreen(),
    };

    // --- 程式進入點 ---
    function main() {
        loadProgress();
        loadSelection();
        activeGameMode = lastSelection.mode;
        showStartScreen();
        setupModalInteractions();

        // 首頁
        Object.entries(modeButtons).forEach(([mode, button]) => {
            button.addEventListener('click', () => selectGameMode(mode));
        });
        startGameBtn.addEventListener('click', startGame);
        wordListSelectEl.addEventListener('change', () => {
            saveSelection();
            updateUnitRewardsBadge();
        });

        // 單字拼寫
        spellingFormEl.addEventListener('submit', handleSpellingSubmission);
        // 鎖定期間擋掉打字，避免字被打進上一題的答案裡
        spellingInputEl.addEventListener('beforeinput', event => { if (isSpellingLocked) event.preventDefault(); });
        spellingInputEl.addEventListener('compositionend', () => { lastCompositionEndAt = Date.now(); });
        playAudioBtnEl.addEventListener('click', () => {
            playWordAudio();
            // 按完播放鈕把焦點還給輸入框，可以直接繼續打字
            spellingInputEl.focus();
        });
        spellingQuitBtn.addEventListener('click', confirmQuitPractice);

        // 結算畫面
        restartBtn.addEventListener('click', () => {
            completionContainer.style.display = 'none';
            gameContainer.style.display = 'block';
            initializeGame();
        });
        backToMenuBtn.addEventListener('click', showStartScreen);

        // 成就與兌換
        showAchievementsBtn.addEventListener('click', () => {
            updateAchievementDisplay();
            openModal(achievementContainer, { focusEl: closeAchievementsBtn });
        });
        closeAchievementsBtn.addEventListener('click', () => closeModal(achievementContainer));
        showRedemptionsBtn.addEventListener('click', () => {
            redemptionForm.reset();
            setFormError(redemptionErrorEl, '');
            renderRedemptionHistory();
            openModal(redemptionContainer, { focusEl: redeemPointsInput });
        });
        closeRedemptionsBtn.addEventListener('click', () => closeModal(redemptionContainer));

        // 點數紀錄
        // 練習途中看完紀錄，把游標放回拼寫輸入框，不必再點一次
        const closePointsHistory = () => {
            closeModal(pointsHistoryContainer);
            if (gameContainer.style.display !== 'none' && !isSpellingLocked && !isAnyModalOpen()) spellingInputEl.focus();
        };
        pointsHudEl.addEventListener('click', () => {
            renderPointsHistory();
            openModal(pointsHistoryContainer, { focusEl: closePointsHistoryBtn, onDismiss: closePointsHistory });
        });
        closePointsHistoryBtn.addEventListener('click', closePointsHistory);
        redemptionForm.addEventListener('submit', handleManualRedeem);

        // 管理員加點
        adminAddPointsBtn.addEventListener('click', openAdminModal);
        closeAdminModalBtn.addEventListener('click', () => closeModal(adminModalContainer));
        adminPasswordForm.addEventListener('submit', handleAdminPasswordSubmit);
        adminGrantForm.addEventListener('submit', handleAdminGrantSubmit);

        // 通用對話框
        dialogConfirmBtn.addEventListener('click', () => settleDialog(true));
        dialogCancelBtn.addEventListener('click', () => settleDialog(false));

        window.addEventListener('storage', handleStorageChange);
        // 練習途中重新整理、關閉分頁或按上一頁離站前，請瀏覽器先跳出確認（這次練習的進度不會保留）
        window.addEventListener('beforeunload', event => {
            const isPracticing = gameContainer.style.display !== 'none' || Boolean(window.TrainerMode && window.TrainerMode.isBusy());
            if (!isPracticing) return;
            event.preventDefault();
            event.returnValue = '';
        });
    }

    main();
});
