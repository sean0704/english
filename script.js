document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素 ---
    const startContainer = document.getElementById('start-container');
    const gameContainer = document.getElementById('game-container');
    const grammarContainer = document.getElementById('grammar-container');
    const completionContainer = document.getElementById('completion-container');
    const challengeContainer = document.getElementById('challenge-container');
    const achievementContainer = document.getElementById('achievement-container');

    // 首頁元素
    const modeBtnSpelling = document.getElementById('mode-btn-spelling');
    const modeBtnGrammar = document.getElementById('mode-btn-grammar');
    const modeBtnChallenge = document.getElementById('mode-btn-challenge');
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

    // 文法練習專用
    const grammarProgressBarEl = document.getElementById('grammar-progress-bar');
    const grammarProgressDisplayEl = document.getElementById('grammar-progress-display');
    const grammarTopicEl = document.getElementById('grammar-topic-badge');
    const grammarHealthDisplayEl = document.getElementById('grammar-health-display');
    const grammarInstructionEl = document.getElementById('grammar-instruction');
    const grammarPlayAudioBtn = document.getElementById('grammar-play-audio-btn');
    const grammarQuestionEl = document.getElementById('grammar-question');
    const grammarAnswerAreaEl = document.getElementById('grammar-answer-area');
    const grammarHintEl = document.getElementById('grammar-hint');
    const grammarFeedbackEl = document.getElementById('grammar-feedback');
    const grammarHintBtn = document.getElementById('grammar-hint-btn');
    const grammarCheckBtn = document.getElementById('grammar-check-btn');
    const grammarNextBtn = document.getElementById('grammar-next-btn');
    const grammarQuitBtn = document.getElementById('grammar-quit-btn');

    // 文法闖關專用
    const challengeTitleEl = document.getElementById('challenge-title');
    const challengeHubContentEl = document.getElementById('challenge-hub-content');
    const challengeBackBtn = document.getElementById('challenge-back-btn');

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

    const totalPointsDisplayEl = document.getElementById('total-points-display');
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
        { name: '八年級 上 Unit 1 文法練習', path: 'g8_1_unit1_grammar.json', type: 'grammar' },
        { name: '八年級 上 Unit 2 (1)', path: 'g8_1_unit2_1.json', type: 'spelling' },
        { name: '八年級 上 Unit 2 (2)', path: 'g8_1_unit2_2.json', type: 'spelling' },
        { name: '八年級 上 Unit 3 (1)', path: 'g8_1_unit3_1.json', type: 'spelling' },
        { name: '八年級 上 Unit 3 (2)', path: 'g8_1_unit3_2.json', type: 'spelling' },
        { name: '八年級 上 Unit 3 文法練習', path: 'g8_1_unit3_grammar.json', type: 'grammar' },
        { name: '八年級 上 Unit 3 文法闖關', path: 'g8_1_unit3_challenge.json', type: 'challenge' },
        { name: '八年級 上 Unit 4 (1)', path: 'g8_1_unit4_1.json', type: 'spelling' },
        { name: '八年級 上 Unit 4 (2)', path: 'g8_1_unit4_2.json', type: 'spelling' },
        { name: '八年級 上 Unit 4 文法練習', path: 'g8_1_unit4_grammar.json', type: 'grammar' },
        { name: '八年級 上 Unit 4 文法闖關', path: 'g8_1_unit4_challenge.json', type: 'challenge' },
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

    function formatAchievementLabel(ach) {
        return `${ach.icon} ${ach.name}（+${ach.points}）`;
    }

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

    // 文法練習狀態
    let grammarQuestions = [];
    let grammarQuestionPool = [];
    let grammarReviewQuestions = [];
    let currentGrammarQuestion = null;
    let grammarCurrentIndex = 0;
    let grammarStageTotal = 0;
    const grammarWrongInSession = new Map(); // 題目 id → 題目，結算時列出需加強的題目
    let grammarRoundCount = 1;
    let grammarHealth = MAX_HEALTH;
    let grammarIsReview = false;
    let grammarQuestionAnswered = false;
    let grammarQuestionHadMistake = false;
    let grammarSelectedAnswer = '';
    let grammarRewardClaimed = false;

    // 每回合通關的每日點數（拼寫與文法共用）
    const ROUND_REWARDS = { 1: 5, 2: 5, 3: 10 };
    const ROUND_REWARD_KEYS = { spelling: 'spellingRoundRewardsClaimed', grammar: 'grammarRoundRewardsClaimed' };

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

        const challengePaths = new Set(wordLists.filter(list => list.type === 'challenge').map(list => list.path));
        Object.keys(stats.unitData).forEach(unitPath => {
            if (!isPlainObject(stats.unitData[unitPath])) stats.unitData[unitPath] = {};
            const unit = stats.unitData[unitPath];
            if (!isPlainObject(unit.achievements)) unit.achievements = {};
            if (!Array.isArray(unit.completionHistory)) unit.completionHistory = [];
            // 補齊舊玩家的「初試身手」成就標記，避免重複領取點數（闖關單元沒有這項成就）
            if (unit.completionHistory.length > 0 && !challengePaths.has(unitPath)) {
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

        [achievementContainer, redemptionContainer, adminModalContainer, dialogContainer].forEach(container => {
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
                stats.totalPoints += ach.points;
                stats.unlockedGlobalAchievements[id] = true;
                showToast(formatAchievementLabel(ach));
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
        summary.appendChild(createEl('span', `ach-mode-tag ${listInfo.type}`, listInfo.type === 'grammar' ? '文法' : '拼寫'));
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
        const activeLists = getActiveWordLists().filter(list => list.type !== 'challenge');
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
    function isValidListItem(item, mode) {
        if (!isPlainObject(item)) return false;
        if (mode === 'spelling') return isNonEmptyString(item.english) && isNonEmptyString(item.chinese);
        if (!['id', 'topic', 'question', 'answer'].every(key => isNonEmptyString(item[key]))) return false;
        if (item.type === 'choice') return Array.isArray(item.options) && item.options.length > 0;
        if (item.type === 'order') return Array.isArray(item.tiles) && item.tiles.length > 0;
        return true;
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
    let grammarAutoPlayTimeout = null;
    let grammarAudioRequestId = 0;
    let grammarSpeechResolve = null;
    let grammarBeepResolve = null;
    let grammarBeepOscillator = null;
    let grammarAudioContext = null;
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
                    feedbackEl.className = 'feedback-message notice';
                    setSpellingLocked(true);
                    updateSpellingProgress();
                    scheduleNextWord(1000);
                } else {
                    feedbackEl.textContent = `請再輸入一次（${correctionCount} / ${REQUIRED_CORRECTIONS}）`;
                    spellingInputEl.value = '';
                }
            } else {
                feedbackEl.textContent = `拼寫還是不對喔，請再試一次：${cleanCorrectAnswer}`;
                spellingInputEl.value = '';
                spellingInputEl.classList.add('input-incorrect');
                setTimeout(() => spellingInputEl.classList.remove('input-incorrect'), 600);
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

    // --- 文法練習邏輯 ---
    function normalizeGrammarAnswer(value) {
        return String(value || '')
            .replace(/[’‘]/g, "'")
            .replace(/[.,?!;:]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    function getGrammarAcceptedAnswers(question) {
        return [question.answer, ...(question.acceptedAnswers || [])]
            .map(normalizeGrammarAnswer)
            .filter(Boolean);
    }

    function updateGrammarProgress() {
        const total = grammarStageTotal;
        // 進度條反映「已完成」的題數；作答中的這一題還不算
        const answered = Math.max(0, grammarCurrentIndex - (grammarQuestionAnswered ? 0 : 1));
        const progress = total > 0 ? Math.min(answered / total, 1) * 100 : 0;
        grammarProgressBarEl.style.width = `${progress}%`;
        grammarProgressDisplayEl.textContent = grammarIsReview
            ? `第 ${grammarRoundCount} 回合・訂正第 ${Math.min(grammarCurrentIndex, total)} / ${total} 題`
            : `第 ${grammarRoundCount} 回合・第 ${Math.min(grammarCurrentIndex, total)} / ${total} 題`;
    }

    function updateGrammarHealthDisplay() {
        renderHearts(grammarHealthDisplayEl, grammarHealth);
    }

    function setGrammarAnswerDisabled(disabled) {
        grammarAnswerAreaEl.querySelectorAll('button, input').forEach(element => {
            element.disabled = disabled;
        });
    }

    function renderGrammarAnswerArea(question) {
        grammarAnswerAreaEl.innerHTML = '';

        if (question.type === 'choice') {
            question.options.forEach(optionText => {
                const optionButton = document.createElement('button');
                optionButton.type = 'button';
                optionButton.className = 'grammar-option';
                optionButton.textContent = optionText;
                optionButton.addEventListener('click', () => {
                    grammarSelectedAnswer = optionText;
                    grammarAnswerAreaEl.querySelectorAll('.grammar-option').forEach(button => {
                        button.classList.remove('selected');
                        button.classList.remove('input-incorrect');
                    });
                    optionButton.classList.add('selected');
                });
                grammarAnswerAreaEl.appendChild(optionButton);
            });
            return;
        }

        if (question.type === 'order') {
            renderGrammarOrderTiles(question);
            return;
        }

        const answerInput = document.createElement('input');
        answerInput.type = 'text';
        answerInput.className = 'grammar-input';
        answerInput.autocomplete = 'off';
        answerInput.autocapitalize = 'off';
        answerInput.spellcheck = false;
        answerInput.setAttribute('autocorrect', 'off');
        answerInput.enterKeyHint = 'send';
        answerInput.placeholder = question.type === 'transform' ? '請輸入完整句子' : '請輸入答案';
        grammarAnswerAreaEl.appendChild(answerInput);
        answerInput.addEventListener('input', () => answerInput.classList.remove('input-incorrect'));
        answerInput.focus();
    }

    // 重組題：依序點選單字方塊組成句子，可退回或清除
    function renderGrammarOrderTiles(question) {
        const picked = [];
        const builtEl = createEl('div', 'grammar-order-built');
        const poolEl = createEl('div', 'grammar-order-pool');
        const toolsEl = createEl('div', 'grammar-order-tools');

        const updateBuilt = () => {
            grammarSelectedAnswer = picked.map(item => item.text).join(' ');
            builtEl.textContent = grammarSelectedAnswer || '依序點選下方的單字';
            builtEl.classList.toggle('empty', picked.length === 0);
            builtEl.classList.remove('input-incorrect');
        };

        shuffle(question.tiles).forEach(text => {
            const tile = createEl('button', 'grammar-option grammar-tile', text);
            tile.type = 'button';
            tile.addEventListener('click', () => {
                picked.push({ text, tile });
                const hadFocus = document.activeElement === tile;
                tile.disabled = true;
                updateBuilt();
                // 方塊停用後焦點會消失；移到下一個可用方塊，都用完就移到「檢查答案」
                if (hadFocus) (poolEl.querySelector('.grammar-tile:not(:disabled)') || grammarCheckBtn).focus();
            });
            poolEl.appendChild(tile);
        });

        const undoBtn = createEl('button', 'grammar-button secondary', '退回一個');
        undoBtn.type = 'button';
        undoBtn.addEventListener('click', () => {
            const last = picked.pop();
            if (last) last.tile.disabled = false;
            updateBuilt();
        });
        const clearBtn = createEl('button', 'grammar-button secondary', '全部清除');
        clearBtn.type = 'button';
        clearBtn.addEventListener('click', () => {
            picked.splice(0).forEach(item => { item.tile.disabled = false; });
            updateBuilt();
        });
        toolsEl.append(undoBtn, clearBtn);

        grammarAnswerAreaEl.append(builtEl, poolEl, toolsEl);
        updateBuilt();
    }

    function stopGrammarAudio() {
        grammarAudioRequestId++;
        if (synth) synth.cancel();
        if (grammarSpeechResolve) {
            const resolve = grammarSpeechResolve;
            grammarSpeechResolve = null;
            resolve();
        }
        if (grammarBeepOscillator) {
            try { grammarBeepOscillator.stop(); } catch (error) { /* 音效可能已結束 */ }
            grammarBeepOscillator.disconnect();
            grammarBeepOscillator = null;
        }
        if (grammarBeepResolve) {
            const resolve = grammarBeepResolve;
            grammarBeepResolve = null;
            resolve();
        }
        if (grammarAutoPlayTimeout) {
            clearTimeout(grammarAutoPlayTimeout);
            grammarAutoPlayTimeout = null;
        }
        if (currentSpeechTimeout) {
            clearTimeout(currentSpeechTimeout);
            currentSpeechTimeout = null;
        }
        isPlaying = false;
        grammarPlayAudioBtn.disabled = false;
    }

    function speakGrammarText(text) {
        return new Promise(resolve => {
            let finished = false;
            let watchdog = null;
            const finish = () => {
                if (finished) return;
                finished = true;
                clearTimeout(watchdog);
                if (grammarSpeechResolve === finish) grammarSpeechResolve = null;
                resolve();
            };
            grammarSpeechResolve = finish;
            // 部分瀏覽器偶爾不會觸發 onend，設保險計時避免播放鈕永遠停在停用狀態
            watchdog = setTimeout(finish, 6000 + text.length * 150);

            const preferredVoice = getPreferredVoice();
            const utterance = new SpeechSynthesisUtterance(text);
            if (preferredVoice) utterance.voice = preferredVoice;
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            utterance.onend = finish;
            utterance.onerror = event => {
                if (!['interrupted', 'canceled', 'not-allowed'].includes(event.error)) {
                    console.warn('文法題目語音合成發生錯誤:', event.error);
                }
                finish();
            };
            synth.speak(utterance);
        });
    }

    async function playGrammarBeep(requestId) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            await new Promise(resolve => setTimeout(resolve, 180));
            return;
        }
        try {
            if (!grammarAudioContext) grammarAudioContext = new AudioContextClass();
            if (grammarAudioContext.state === 'suspended') {
                // 沒有使用者操作時 resume() 可能一直等不到結果，最多等 0.5 秒
                await Promise.race([grammarAudioContext.resume(), new Promise(resolve => setTimeout(resolve, 500))]);
            }
            if (grammarAudioContext.state !== 'running') {
                await new Promise(resolve => setTimeout(resolve, 180)); // 無法發聲時以短暫停頓代替提示音
                return;
            }
        } catch (error) {
            console.error('文法空格音效初始化發生錯誤:', error);
            return;
        }
        // 等待音訊裝置恢復的期間，這次播放可能已被取消
        if (requestId !== grammarAudioRequestId) return;

        await new Promise(resolve => {
            try {
                const oscillator = grammarAudioContext.createOscillator();
                const gain = grammarAudioContext.createGain();
                oscillator.type = 'sine';
                oscillator.frequency.value = 880;
                gain.gain.setValueAtTime(0.08, grammarAudioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, grammarAudioContext.currentTime + 0.18);
                oscillator.connect(gain);
                gain.connect(grammarAudioContext.destination);

                // 只清理屬於這一次提示音的狀態，避免舊音效的 onended 影響下一次播放
                const finish = () => {
                    if (grammarBeepOscillator === oscillator) grammarBeepOscillator = null;
                    if (grammarBeepResolve === finish) grammarBeepResolve = null;
                    resolve();
                };
                grammarBeepOscillator = oscillator;
                grammarBeepResolve = finish;
                oscillator.onended = finish;
                oscillator.start();
                oscillator.stop(grammarAudioContext.currentTime + 0.18);
            } catch (error) {
                console.error('文法空格音效播放發生錯誤:', error);
                grammarBeepOscillator = null;
                grammarBeepResolve = null;
                resolve();
            }
        });
    }

    async function playGrammarAudio() {
        if (!currentGrammarQuestion || !synth || isPlaying) return;

        const requestId = ++grammarAudioRequestId;
        isPlaying = true;
        grammarPlayAudioBtn.disabled = true;

        // 題目中的空格（連續底線）以提示音代替
        const audioSegments = currentGrammarQuestion.question.split(/(_{2,})/);
        for (const segment of audioSegments) {
            if (requestId !== grammarAudioRequestId) return;
            if (/^_{2,}$/.test(segment)) {
                await playGrammarBeep(requestId);
            } else if (segment.trim()) {
                await speakGrammarText(segment);
            }
        }

        if (requestId === grammarAudioRequestId) {
            isPlaying = false;
            grammarPlayAudioBtn.disabled = false;
        }
    }

    // 顯示新題目後自動朗讀；含中文的題目（如重組題的中文提示）不朗讀
    function scheduleGrammarAutoPlay(question) {
        const canSpeak = Boolean(synth) && !hasChinese(question.question);
        grammarPlayAudioBtn.style.display = canSpeak ? 'inline-flex' : 'none';
        if (!canSpeak) return;
        grammarAutoPlayTimeout = setTimeout(() => {
            grammarAutoPlayTimeout = null;
            playGrammarAudio();
        }, 150);
    }

    function awardRoundReward(mode, round) {
        const pointsAwarded = ROUND_REWARDS[round];
        if (!pointsAwarded) return;
        const unitData = ensureUnitData(currentWordListPath);
        const rewardKey = ROUND_REWARD_KEYS[mode];
        if (!unitData[rewardKey]) unitData[rewardKey] = {};

        const roundLabel = mode === 'grammar' ? `文法第 ${round} 回合` : `第 ${round} 回合`;
        const todayKey = getLocalDateString();
        const toastOptions = { title: '回合完成！', icon: '🪙' };
        if (unitData[rewardKey][round] !== todayKey) {
            playerStats.totalPoints += pointsAwarded;
            unitData[rewardKey][round] = todayKey;
            showToast(`完成${roundLabel}，獲得 ${pointsAwarded} 點！`, toastOptions);
        } else {
            showToast(`完成${roundLabel}！（今日點數已領取）`, toastOptions);
        }
        saveProgress();
        updateTotalPointsDisplay();
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
        const unlockedInSession = [];
        medalRules.forEach(([id, qualified]) => {
            if (!qualified || unitData.achievements[id]) return;
            playerStats.totalPoints += UNIT_ACHIEVEMENTS[id].points;
            unitData.achievements[id] = true;
            unlockedInSession.push(formatAchievementLabel(UNIT_ACHIEVEMENTS[id]));
        });
        checkStreakAchievements(unitPath, unlockedInSession);
        if (unlockedInSession.length > 0) {
            showToast(`在「${unitName}」解鎖：${unlockedInSession.join('、')}`);
        }
        checkGlobalAchievements();
    }

    function createGrammarRoundQuestions() {
        const questionsByTopic = grammarQuestionPool.reduce((groups, question) => {
            if (!groups[question.topic]) groups[question.topic] = [];
            groups[question.topic].push(question);
            return groups;
        }, {});

        // 只隨機主題順序；同一主題的題目會連續完整出完。
        return shuffle(Object.values(questionsByTopic))
            .flatMap(questions => questions);
    }

    function setupNextGrammarQuestion() {
        stopGrammarAudio();
        if (activeGameMode === 'challenge') {
            setupNextChallengeQuestion();
            return;
        }
        // 回合切換的提示要保留到下一題顯示時；其餘情況清掉上一題的回饋
        let hasStageNotice = false;
        if (grammarQuestions.length === 0) {
            hasStageNotice = true;
            if (grammarReviewQuestions.length > 0 && !grammarIsReview) {
                grammarIsReview = true;
                // 錯題沿用原本的主題順序，讓同一主題的錯題仍連續訂正。
                grammarQuestions = [...grammarReviewQuestions];
                grammarReviewQuestions = [];
                grammarCurrentIndex = 0;
                grammarStageTotal = grammarQuestions.length;
                grammarFeedbackEl.textContent = '這一輪練習完成，現在開始訂正錯題。';
                grammarFeedbackEl.className = 'feedback-message notice';
            } else {
                awardRoundReward('grammar', grammarRoundCount);
                if (grammarRoundCount >= 3) {
                    grammarGameOver();
                    return;
                }

                grammarIsReview = false;
                grammarRoundCount++;
                grammarQuestions = createGrammarRoundQuestions();
                grammarStageTotal = grammarQuestions.length;
                grammarCurrentIndex = 0;
                grammarFeedbackEl.textContent = `太棒了！文法第 ${grammarRoundCount} 回合開始！`;
                grammarFeedbackEl.className = 'feedback-message notice';
                if (HEALTH_REPLENISH_ROUNDS.includes(grammarRoundCount - 1) && grammarHealth < MAX_HEALTH) {
                    grammarHealth++;
                    updateGrammarHealthDisplay();
                    grammarFeedbackEl.textContent += '愛心回補！❤️';
                }
            }
        }

        currentGrammarQuestion = grammarQuestions.shift();
        grammarCurrentIndex++;
        grammarQuestionAnswered = false;
        // 訂正題原本已答錯，因此訂正階段不再重複扣除愛心。
        grammarQuestionHadMistake = grammarIsReview;
        grammarSelectedAnswer = '';

        grammarTopicEl.textContent = currentGrammarQuestion.topicLabel;
        grammarInstructionEl.textContent = currentGrammarQuestion.instruction;
        grammarQuestionEl.textContent = currentGrammarQuestion.question;
        grammarHintEl.textContent = `提示：${currentGrammarQuestion.hint}`;
        grammarHintEl.style.display = 'none';
        if (!hasStageNotice) {
            grammarFeedbackEl.textContent = '';
            grammarFeedbackEl.className = 'feedback-message';
        }
        showGrammarCheckButton();
        updateGrammarProgress();
        renderGrammarAnswerArea(currentGrammarQuestion);

        const input = grammarAnswerAreaEl.querySelector('input');
        if (input) input.focus();
        scheduleGrammarAutoPlay(currentGrammarQuestion);
    }

    // 作答前顯示「檢查答案」，作答後換成「下一題」並把焦點移過去，
    // 這樣不論滑鼠或鍵盤，按 Enter 都能直接前往下一題
    function showGrammarCheckButton() {
        if (document.activeElement === grammarNextBtn) grammarNextBtn.blur();
        grammarNextBtn.style.display = 'none';
        grammarCheckBtn.style.display = 'inline-block';
    }

    function showGrammarNextButton() {
        // 按下去就會進入結算／結果畫面的那一題，按鈕改寫「看結果」
        const isLastChallengeQuestion = Boolean(challengeSession) && challengeSession.index >= challengeSession.questions.length;
        const isLastGrammarQuestion = !challengeSession && grammarRoundCount >= 3 && grammarQuestions.length === 0
            && (grammarIsReview || grammarReviewQuestions.length === 0);
        grammarNextBtn.textContent = isLastChallengeQuestion || isLastGrammarQuestion ? '看結果' : '下一題';
        grammarCheckBtn.style.display = 'none';
        grammarNextBtn.style.display = 'inline-block';
        grammarNextBtn.focus();
    }

    function showGrammarHint() {
        if (!currentGrammarQuestion || grammarQuestionAnswered) return;
        if (activeGameMode === 'challenge') challengeHintUsed = true;
        grammarHintEl.style.display = 'block';
    }

    function checkGrammarAnswer() {
        if (activeGameMode === 'challenge') {
            checkChallengeAnswer();
            return;
        }
        if (!currentGrammarQuestion || grammarQuestionAnswered) return;

        const input = grammarAnswerAreaEl.querySelector('input');
        const answer = input ? input.value.trim() : grammarSelectedAnswer;
        if (!answer) {
            grammarFeedbackEl.textContent = `請先作答，再按「${grammarCheckBtn.textContent}」。`;
            grammarFeedbackEl.className = 'feedback-message notice';
            return;
        }

        const isCorrect = getGrammarAcceptedAnswers(currentGrammarQuestion)
            .includes(normalizeGrammarAnswer(answer));

        if (isCorrect) {
            grammarQuestionAnswered = true;
            grammarAnswerAreaEl.querySelectorAll('.input-incorrect').forEach(element => {
                element.classList.remove('input-incorrect');
            });
            grammarFeedbackEl.textContent = `正確！${currentGrammarQuestion.explanation}`;
            grammarFeedbackEl.className = 'feedback-message correct';
            setGrammarAnswerDisabled(true);
            showGrammarNextButton();
            updateGrammarProgress();
            return;
        }

        grammarHintEl.style.display = 'block';
        if (!grammarQuestionHadMistake) {
            grammarQuestionHadMistake = true;
            grammarHealth--;
            updateGrammarHealthDisplay();
            grammarWrongInSession.set(currentGrammarQuestion.id, currentGrammarQuestion);
            if (!grammarIsReview && !grammarReviewQuestions.some(question => question.id === currentGrammarQuestion.id)) {
                grammarReviewQuestions.push(currentGrammarQuestion);
            }
            grammarFeedbackEl.textContent = '答案還不正確，請參考提示再試一次。';
            grammarFeedbackEl.className = 'feedback-message incorrect';
            if (input) input.classList.add('input-incorrect');
            grammarAnswerAreaEl.querySelectorAll('.grammar-option').forEach(button => {
                if (button.classList.contains('selected')) button.classList.add('input-incorrect');
            });
            grammarAnswerAreaEl.querySelectorAll('.grammar-order-built').forEach(element => element.classList.add('input-incorrect'));
            if (grammarHealth <= 0) {
                grammarGameOver(false);
                return;
            }
            return;
        }

        grammarQuestionAnswered = true;
        grammarFeedbackEl.textContent = `正確答案：${currentGrammarQuestion.answer}\n${currentGrammarQuestion.explanation}`;
        grammarFeedbackEl.className = 'feedback-message incorrect';
        setGrammarAnswerDisabled(true);
        showGrammarNextButton();
        updateGrammarProgress();
    }

    function initializeGrammarGame() {
        if (!Array.isArray(wordList) || wordList.length === 0) return;
        // 還原文法闖關可能改過的共用畫面
        grammarHealthDisplayEl.style.display = '';
        grammarHintBtn.style.display = '';
        grammarHintBtn.textContent = '提示';
        grammarCheckBtn.textContent = '檢查答案';
        sessionStartPoints = playerStats.totalPoints;
        grammarWrongInSession.clear();

        // 將題庫中的所有題目加入練習，並在每回合重新隨機排列。
        const questionsByTopic = wordList.reduce((groups, question) => {
            if (!question || !question.id || !question.answer) return groups;
            if (!groups[question.topic]) groups[question.topic] = [];
            groups[question.topic].push(question);
            return groups;
        }, {});
        grammarQuestionPool = Object.values(questionsByTopic).flat();
        grammarQuestions = createGrammarRoundQuestions();
        grammarReviewQuestions = [];
        currentGrammarQuestion = null;
        grammarCurrentIndex = 0;
        grammarStageTotal = grammarQuestionPool.length;
        grammarRoundCount = 1;
        grammarHealth = MAX_HEALTH;
        grammarIsReview = false;
        grammarRewardClaimed = false;
        updateGrammarHealthDisplay();
        setupNextGrammarQuestion();
    }

    function grammarGameOver(isSuccess = true) {
        if (grammarRewardClaimed) return;
        grammarRewardClaimed = true;
        stopGrammarAudio();

        if (isSuccess) awardUnitCompletion(currentWordListPath, currentWordListName, grammarHealth);
        saveProgress();
        updateTotalPointsDisplay();

        showCompletionScreen({
            isSuccess,
            title: isSuccess ? '文法練習完成！' : '練習失敗',
            message: isSuccess ? '你已完成本單元的三回合文法練習。' : '愛心已耗盡，看看下面的題目，再試一次吧！',
            remainingHealth: grammarHealth,
            reviewTitle: '本次需要加強的題目',
            reviewItems: [...grammarWrongInSession.values()].map(question => ({
                main: question.question,
                sub: `正確答案：${question.answer}`,
            })),
        });
    }

    // 拼寫與文法共用的結算畫面
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
        grammarContainer.style.display = 'none';
        completionContainer.style.display = 'flex';
        window.scrollTo(0, 0);
        moveFocusTo(completionTitleEl);
    }

    // --- 文法闖關邏輯 ---
    // 星星依正確率發放，每顆星的點數只在第一次拿到時給
    const CHALLENGE_STAR_RULES = [
        { stars: 1, accuracy: 0.6, points: 10 },
        { stars: 2, accuracy: 0.8, points: 15 },
        { stars: 3, accuracy: 1, points: 20 },
    ];
    const CHALLENGE_RECYCLE_POINTS = 3;
    const CHALLENGE_RECYCLE_MAX_QUESTIONS = 15;
    const CHALLENGE_CLEAR_BANK_BONUS = 20;
    const CHALLENGE_EXAM_PER_TOPIC = 4;
    const CHALLENGE_EXAM_UNLOCK_STARS = 2;
    const CHALLENGE_EXAM_PASS_SCORE = 60;
    const CHALLENGE_EXAM_PASS_POINTS = 20;
    const CHALLENGE_EXAM_PERFECT_POINTS = 50;
    // 錯題回收與模擬小考的每日點數上限；星星與滿分獎勵為一次性，不受此限
    const CHALLENGE_DAILY_CAP = 60;
    const CHALLENGE_KIND_LABELS = { level: '關卡挑戰', recycle: '錯題回收', exam: '模擬小考' };

    let challengeSession = null;
    let challengeLastResult = null;
    let challengeHintUsed = false;

    function hasChinese(text) {
        return /[㐀-鿿]/.test(String(text || ''));
    }

    function ensureChallengeData(unitPath) {
        const unitData = ensureUnitData(unitPath);
        if (!unitData.challenge) unitData.challenge = {};
        const data = unitData.challenge;
        if (!data.stars) data.stars = {};
        if (!data.bestAccuracy) data.bestAccuracy = {};
        if (!data.wrongBank) data.wrongBank = {}; // 題目 id → 放入錯題回收站的日期
        if (!data.topicStats) data.topicStats = {};
        if (!data.exams) data.exams = [];
        if (!data.daily) data.daily = { date: '', points: 0 };
        return data;
    }

    function getChallengePool() {
        return wordList.filter(question => question && question.id && question.answer && question.topic);
    }

    function getChallengeTopics() {
        const topics = [];
        getChallengePool().forEach(question => {
            if (!topics.some(topic => topic.id === question.topic)) {
                topics.push({ id: question.topic, label: question.topicLabel || question.topic });
            }
        });
        return topics;
    }

    function getWrongBankIds(data) {
        const poolIds = new Set(getChallengePool().map(question => question.id));
        return Object.keys(data.wrongBank).filter(id => poolIds.has(id));
    }

    // 錯題要隔天以後才能回收，避免看完解答馬上重答
    function getRecyclableIds(data) {
        const today = getLocalDateString();
        return getWrongBankIds(data).filter(id => data.wrongBank[id] < today);
    }

    function getChallengeExamTotal() {
        const pool = getChallengePool();
        return getChallengeTopics().reduce((sum, topic) =>
            sum + Math.min(CHALLENGE_EXAM_PER_TOPIC, pool.filter(question => question.topic === topic.id).length), 0);
    }

    function isChallengeExamUnlocked(data) {
        return getChallengeTopics().every(topic => (data.stars[topic.id] || 0) >= CHALLENGE_EXAM_UNLOCK_STARS);
    }

    function getTodayChallengePoints(data) {
        return data.daily.date === getLocalDateString() ? data.daily.points : 0;
    }

    function grantCappedChallengePoints(data, points) {
        const today = getLocalDateString();
        if (data.daily.date !== today) data.daily = { date: today, points: 0 };
        const granted = Math.max(0, Math.min(points, CHALLENGE_DAILY_CAP - data.daily.points));
        data.daily.points += granted;
        playerStats.totalPoints += granted;
        return granted;
    }

    function formatGrantedPoints(points) {
        return points > 0 ? `+${points} 點` : '今日點數已達上限';
    }

    function formatStars(count) {
        return '★'.repeat(count) + '☆'.repeat(CHALLENGE_STAR_RULES.length - count);
    }

    function formatPercent(value) {
        return `${Math.round(value * 100)}%`;
    }

    function showChallengeHub() {
        stopGrammarAudio();
        challengeSession = null;
        currentGrammarQuestion = null;
        grammarContainer.style.display = 'none';
        startContainer.style.display = 'none';
        challengeContainer.style.display = 'flex';
        renderChallengeHub();
        window.scrollTo(0, 0);
        // 把焦點帶到結果卡片（沒有結果時是標題），鍵盤與螢幕閱讀器使用者才知道畫面換了
        moveFocusTo(challengeHubContentEl.querySelector('.challenge-result') || challengeTitleEl);
    }

    // 以程式把焦點移到非互動元素（標題、結果卡片）
    function moveFocusTo(element) {
        if (!element) return;
        if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
        element.focus({ preventScroll: true });
    }

    function buildChallengeCard(title, meta, buttonText, onClick, options = {}) {
        const card = createEl('div', 'challenge-card');
        const info = createEl('div', 'challenge-card-info');
        info.appendChild(createEl('div', 'challenge-card-title', title));
        info.appendChild(createEl('div', 'challenge-card-meta', meta));
        if (options.note) info.appendChild(createEl('div', 'challenge-card-note', options.note));
        card.appendChild(info);
        if (options.stars !== undefined) card.appendChild(createEl('div', 'challenge-stars', formatStars(options.stars)));
        const button = createEl('button', 'grammar-button', buttonText);
        button.type = 'button';
        button.disabled = Boolean(options.disabled);
        button.addEventListener('click', onClick);
        card.appendChild(button);
        return card;
    }

    function buildChallengeSection(title) {
        const section = createEl('section', 'challenge-section');
        section.appendChild(createEl('h2', 'challenge-section-title', title));
        return section;
    }

    function renderChallengeHub() {
        const data = ensureChallengeData(currentWordListPath);
        const pool = getChallengePool();
        const topics = getChallengeTopics();
        challengeTitleEl.textContent = currentWordListName;
        challengeHubContentEl.innerHTML = '';

        challengeHubContentEl.appendChild(createEl('p', 'challenge-today',
            `今日錯題回收與模擬小考點數：${getTodayChallengePoints(data)} / ${CHALLENGE_DAILY_CAP}`));

        if (challengeLastResult) challengeHubContentEl.appendChild(buildChallengeResultCard(challengeLastResult));

        // ① 文法關卡
        const levelSection = buildChallengeSection('① 文法關卡');
        topics.forEach(topic => {
            const stars = data.stars[topic.id] || 0;
            const best = data.bestAccuracy[topic.id];
            const count = pool.filter(question => question.topic === topic.id).length;
            levelSection.appendChild(buildChallengeCard(
                topic.label,
                `${count} 題・最佳正確率 ${best === undefined ? '—' : formatPercent(best)}`,
                stars > 0 ? '再挑戰' : '挑戰',
                () => startChallengeSession('level', topic.id),
                { stars }
            ));
        });
        challengeHubContentEl.appendChild(levelSection);

        // ② 錯題回收站
        const bankCount = getWrongBankIds(data).length;
        const recyclableCount = Math.min(getRecyclableIds(data).length, CHALLENGE_RECYCLE_MAX_QUESTIONS);
        const recycleSection = buildChallengeSection('② 錯題回收站');
        recycleSection.appendChild(buildChallengeCard(
            bankCount === 0 ? '目前沒有錯題 🎉' : `錯題 ${bankCount} 題`,
            bankCount === 0 ? '答錯的題目會自動收進這裡。' : `今天可以回收 ${recyclableCount} 題（答錯的題目隔天才能回收）`,
            recyclableCount > 0 ? `開始回收（${recyclableCount} 題）` : '明天再來',
            () => startChallengeSession('recycle'),
            {
                disabled: recyclableCount === 0,
                note: `每回收一題 +${CHALLENGE_RECYCLE_POINTS} 點，錯題全部清空再 +${CHALLENGE_CLEAR_BANK_BONUS} 點`,
            }
        ));
        challengeHubContentEl.appendChild(recycleSection);

        // ③ 模擬小考
        const examUnlocked = isChallengeExamUnlocked(data);
        const readyCount = topics.filter(topic => (data.stars[topic.id] || 0) >= CHALLENGE_EXAM_UNLOCK_STARS).length;
        const examSection = buildChallengeSection('③ 模擬小考');
        examSection.appendChild(buildChallengeCard(
            examUnlocked ? `共 ${getChallengeExamTotal()} 題・${CHALLENGE_EXAM_PASS_SCORE} 分及格` : '🔒 尚未解鎖',
            examUnlocked
                ? `最高分：${typeof data.bestExam === 'number' ? `${data.bestExam} 分` : '還沒考過'}`
                : `每一關都拿到 ${formatStars(CHALLENGE_EXAM_UNLOCK_STARS)} 以上才能解鎖（目前 ${readyCount} / ${topics.length} 關）`,
            '開始考試',
            () => startChallengeSession('exam'),
            { disabled: !examUnlocked, note: '考試中不能看提示，也不會顯示對錯，寫完才公布成績。' }
        ));
        challengeHubContentEl.appendChild(examSection);

        challengeHubContentEl.appendChild(buildChallengeRules());
        challengeHubContentEl.appendChild(buildChallengeParentView(data, topics));
    }

    // 闖關得點規則文字，同時用於闖關大廳與首頁說明區塊
    function getChallengeRuleTexts() {
        const starText = CHALLENGE_STAR_RULES
            .map(rule => `${'⭐'.repeat(rule.stars)} +${rule.points}`).join('、');
        return [
            `每一關答對越多，星星越多：${starText}。第一次拿到才有點數。`,
            '看了提示才答對，只算半題。',
            `答錯的題目，隔天再答對一題 +${CHALLENGE_RECYCLE_POINTS}。全部改完再 +${CHALLENGE_CLEAR_BANK_BONUS}。`,
            `模擬小考 ${CHALLENGE_EXAM_PASS_SCORE} 分以上 +${CHALLENGE_EXAM_PASS_POINTS}。比自己的最高分多幾分，就多幾點。第一次 100 分 +${CHALLENGE_EXAM_PERFECT_POINTS}。`,
            `改錯題和小考，每天最多拿 ${CHALLENGE_DAILY_CAP} 點。`,
        ];
    }

    function buildChallengeRules() {
        const details = createEl('details', 'challenge-details');
        details.appendChild(createEl('summary', '', '🪙 怎麼得點數？'));
        const list = createEl('ul', 'challenge-rule-list');
        getChallengeRuleTexts().forEach(text => list.appendChild(createEl('li', '', text)));
        details.appendChild(list);
        return details;
    }

    function buildChallengeParentView(data, topics) {
        const details = createEl('details', 'challenge-details');
        details.appendChild(createEl('summary', '', '👨‍👩‍👧 家長檢視'));

        const bankIds = getWrongBankIds(data);
        const pool = getChallengePool();
        const table = createEl('table', 'challenge-table');
        const headRow = createEl('tr');
        ['文法重點', '作答', '答對', '正確率', '錯題'].forEach(text => headRow.appendChild(createEl('th', '', text)));
        table.appendChild(headRow);
        topics.forEach(topic => {
            const stats = data.topicStats[topic.id] || { attempts: 0, correct: 0 };
            const wrongCount = bankIds.filter(id => pool.find(question => question.id === id)?.topic === topic.id).length;
            const row = createEl('tr');
            [
                topic.label,
                String(stats.attempts),
                String(stats.correct),
                stats.attempts > 0 ? formatPercent(stats.correct / stats.attempts) : '—',
                String(wrongCount),
            ].forEach(text => row.appendChild(createEl('td', '', text)));
            table.appendChild(row);
        });
        details.appendChild(table);
        details.appendChild(createEl('p', 'challenge-card-note', '「答對」只計算沒看提示就答對的題目。'));

        details.appendChild(createEl('h3', 'challenge-subtitle', '模擬小考紀錄'));
        if (data.exams.length === 0) {
            details.appendChild(createEl('p', 'challenge-card-note', '還沒有考試紀錄。'));
        } else {
            const list = createEl('ul', 'challenge-exam-list');
            data.exams.slice(-10).reverse().forEach(exam => {
                const passed = exam.score >= CHALLENGE_EXAM_PASS_SCORE;
                const item = createEl('li', passed ? 'pass' : 'fail',
                    `${formatDateTime(exam.timestamp)}　${exam.score} 分${passed ? '' : '（未及格）'}`);
                list.appendChild(item);
            });
            details.appendChild(list);
        }
        return details;
    }

    function buildChallengeResultCard(result) {
        const card = createEl('div', `challenge-result ${result.tone || ''}`);
        card.appendChild(createEl('h2', 'challenge-result-title', result.title));
        result.lines.forEach(line => card.appendChild(createEl('p', 'challenge-result-line', line)));

        if (result.wrong.length > 0) {
            const details = createEl('details', 'challenge-details');
            details.open = true;
            details.appendChild(createEl('summary', '', `錯題解析（${result.wrong.length} 題）`));
            const list = createEl('ol', 'challenge-wrong-list');
            result.wrong.forEach(item => {
                const li = createEl('li');
                li.appendChild(createEl('div', 'challenge-wrong-question', item.question.question));
                li.appendChild(createEl('div', 'challenge-wrong-yours', `你的答案：${item.answer}`));
                li.appendChild(createEl('div', 'challenge-wrong-answer', `正確答案：${item.question.answer}`));
                li.appendChild(createEl('div', 'challenge-wrong-explain', item.question.explanation));
                list.appendChild(li);
            });
            details.appendChild(list);
            card.appendChild(details);
        }
        return card;
    }

    function startChallengeSession(kind, topicId) {
        const data = ensureChallengeData(currentWordListPath);
        const pool = getChallengePool();
        let questions;
        if (kind === 'level') {
            questions = shuffle(pool.filter(question => question.topic === topicId));
        } else if (kind === 'recycle') {
            const recyclableIds = new Set(getRecyclableIds(data));
            questions = shuffle(pool.filter(question => recyclableIds.has(question.id))).slice(0, CHALLENGE_RECYCLE_MAX_QUESTIONS);
        } else {
            // 模擬小考：每個文法重點各抽幾題，再整體打亂
            questions = shuffle(getChallengeTopics().flatMap(topic =>
                shuffle(pool.filter(question => question.topic === topic.id)).slice(0, CHALLENGE_EXAM_PER_TOPIC)));
        }
        if (questions.length === 0) return;

        challengeSession = { kind, topicId, questions, index: 0, results: [] };
        challengeLastResult = null;
        challengeContainer.style.display = 'none';
        grammarContainer.style.display = 'block';
        grammarHealthDisplayEl.style.display = 'none';
        grammarHintBtn.style.display = kind === 'exam' ? 'none' : '';
        grammarHintBtn.textContent = kind === 'recycle' ? '提示（看了就不算回收）' : '提示（看了只算半題）';
        // 小考不會當場顯示對錯，按鈕不該叫「檢查答案」
        grammarCheckBtn.textContent = kind === 'exam' ? '送出答案' : '檢查答案';
        setupNextChallengeQuestion();
    }

    function updateChallengeProgress(answeredCount) {
        const session = challengeSession;
        grammarProgressBarEl.style.width = `${(answeredCount / session.questions.length) * 100}%`;
        grammarProgressDisplayEl.textContent =
            `${CHALLENGE_KIND_LABELS[session.kind]}・第 ${session.index} / ${session.questions.length} 題`;
    }

    function setupNextChallengeQuestion() {
        stopGrammarAudio();
        const session = challengeSession;
        if (!session) return;
        if (session.index >= session.questions.length) {
            finishChallengeSession();
            return;
        }

        const question = session.questions[session.index];
        session.index++;
        currentGrammarQuestion = question;
        grammarQuestionAnswered = false;
        grammarSelectedAnswer = '';
        challengeHintUsed = false;

        grammarTopicEl.textContent = question.topicLabel;
        grammarInstructionEl.textContent = question.instruction;
        grammarQuestionEl.textContent = question.question;
        grammarHintEl.textContent = `提示：${question.hint}`;
        grammarHintEl.style.display = 'none';
        if (session.kind === 'exam' && session.index === 1) {
            grammarFeedbackEl.textContent = '模擬小考開始！作答時不會顯示對錯，全部寫完才公布成績。';
            grammarFeedbackEl.className = 'feedback-message notice';
        } else {
            grammarFeedbackEl.textContent = '';
            grammarFeedbackEl.className = 'feedback-message';
        }
        showGrammarCheckButton();
        updateChallengeProgress(session.index - 1);
        renderGrammarAnswerArea(question);
        scheduleGrammarAutoPlay(question);
    }

    function checkChallengeAnswer() {
        const session = challengeSession;
        const question = currentGrammarQuestion;
        if (!session || !question || grammarQuestionAnswered) return;

        const input = grammarAnswerAreaEl.querySelector('input');
        const answer = input ? input.value.trim() : grammarSelectedAnswer;
        if (!answer) {
            grammarFeedbackEl.textContent = `請先作答，再按「${grammarCheckBtn.textContent}」。`;
            grammarFeedbackEl.className = 'feedback-message notice';
            return;
        }

        const isCorrect = getGrammarAcceptedAnswers(question).includes(normalizeGrammarAnswer(answer));
        const cleanCorrect = isCorrect && !challengeHintUsed;
        const data = ensureChallengeData(currentWordListPath);

        if (!data.topicStats[question.topic]) data.topicStats[question.topic] = { attempts: 0, correct: 0 };
        data.topicStats[question.topic].attempts++;
        if (cleanCorrect) data.topicStats[question.topic].correct++;

        let points = 0;
        if (!isCorrect || (session.kind === 'recycle' && !cleanCorrect)) {
            // 答錯，或回收時看了提示才答對：放回錯題回收站，隔天再回收
            data.wrongBank[question.id] = getLocalDateString();
        } else if (session.kind === 'recycle') {
            delete data.wrongBank[question.id];
            points = grantCappedChallengePoints(data, CHALLENGE_RECYCLE_POINTS);
        }

        session.results.push({ question, answer, isCorrect, hintUsed: challengeHintUsed, points });
        saveProgress();
        updateTotalPointsDisplay();

        grammarQuestionAnswered = true;
        setGrammarAnswerDisabled(true);
        grammarCheckBtn.style.display = 'none';

        if (session.kind === 'exam') {
            setupNextChallengeQuestion();
            return;
        }

        if (isCorrect) {
            let message = `正確！${question.explanation}`;
            if (session.kind === 'recycle') {
                message = cleanCorrect
                    ? `回收成功！${formatGrantedPoints(points)}\n${question.explanation}`
                    : `答對了，但看過提示，這題明天再回收一次。\n${question.explanation}`;
            } else if (challengeHintUsed) {
                message = `正確！（看過提示，本題算半題）\n${question.explanation}`;
            }
            grammarFeedbackEl.textContent = message;
            grammarFeedbackEl.className = 'feedback-message correct';
        } else {
            grammarFeedbackEl.textContent =
                `正確答案：${question.answer}\n${question.explanation}\n這題已收進錯題回收站，明天起可以回收。`;
            grammarFeedbackEl.className = 'feedback-message incorrect';
            grammarAnswerAreaEl.querySelectorAll('.grammar-input, .grammar-order-built, .grammar-option.selected')
                .forEach(element => element.classList.add('input-incorrect'));
        }
        showGrammarNextButton();
        updateChallengeProgress(session.index);
    }

    function finishLevelSession(session, data) {
        const total = session.results.length;
        const score = session.results.reduce((sum, result) => sum + (result.isCorrect ? (result.hintUsed ? 0.5 : 1) : 0), 0);
        const accuracy = total > 0 ? score / total : 0;
        const previousStars = data.stars[session.topicId] || 0;
        const earnedRules = CHALLENGE_STAR_RULES.filter(rule => accuracy >= rule.accuracy);
        const newRules = earnedRules.filter(rule => rule.stars > previousStars);
        const starPoints = newRules.reduce((sum, rule) => sum + rule.points, 0);

        playerStats.totalPoints += starPoints;
        data.stars[session.topicId] = Math.max(previousStars, earnedRules.length);
        data.bestAccuracy[session.topicId] = Math.max(data.bestAccuracy[session.topicId] || 0, accuracy);

        const topicLabel = session.questions[0].topicLabel;
        const lines = [`正確率 ${formatPercent(accuracy)}（得分 ${score} / ${total} 題）`];
        if (starPoints > 0) {
            lines.push(`新拿到 ${newRules.length} 顆星，+${starPoints} 點！`);
        } else if (earnedRules.length < previousStars) {
            lines.push(`這次 ${earnedRules.length} 顆星，你的最佳紀錄是 ${previousStars} 顆星。`);
        }
        const nextRule = CHALLENGE_STAR_RULES[data.stars[session.topicId]];
        if (nextRule) lines.push(`下一顆星：正確率達 ${formatPercent(nextRule.accuracy)}，可得 +${nextRule.points} 點。`);
        return {
            title: `${topicLabel}　${formatStars(earnedRules.length)}`,
            tone: earnedRules.length > 0 ? 'pass' : 'fail',
            lines,
        };
    }

    function finishRecycleSession(session, data) {
        const total = session.results.length;
        const recycledCount = session.results.filter(result => result.isCorrect && !result.hintUsed).length;
        const earned = session.results.reduce((sum, result) => sum + result.points, 0);
        const remaining = getWrongBankIds(data).length;
        const lines = [`回收成功 ${recycledCount} / ${total} 題，共 +${earned} 點`];
        const today = getLocalDateString();
        if (recycledCount > 0 && remaining === 0) {
            if (data.clearBonusDate !== today) {
                data.clearBonusDate = today;
                const bonus = grantCappedChallengePoints(data, CHALLENGE_CLEAR_BANK_BONUS);
                lines.push(bonus > 0 ? `錯題全部清空！額外獎勵 +${bonus} 點 🎉` : '錯題全部清空！🎉（今日點數已達上限）');
            } else {
                lines.push('錯題全部清空！🎉');
            }
        } else if (remaining > 0) {
            const stillRecyclable = getRecyclableIds(data).length;
            lines.push(stillRecyclable > 0
                ? `錯題回收站還有 ${remaining} 題，其中 ${stillRecyclable} 題今天還可以繼續回收。`
                : `錯題回收站還有 ${remaining} 題，明天再來回收。`);
        }
        return { title: '錯題回收結果', tone: recycledCount === total ? 'pass' : '', lines };
    }

    function finishExamSession(session, data) {
        const total = session.results.length;
        const correctCount = session.results.filter(result => result.isCorrect).length;
        const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
        const previousBest = data.bestExam;
        const passed = score >= CHALLENGE_EXAM_PASS_SCORE;
        const today = getLocalDateString();
        data.exams.push({ timestamp: Date.now(), score });

        const lines = [passed
            ? `及格！答對 ${correctCount} / ${total} 題。`
            : `答對 ${correctCount} / ${total} 題，${CHALLENGE_EXAM_PASS_SCORE} 分及格，再加油！`];
        if (passed) {
            if (data.examPassDate !== today) {
                data.examPassDate = today;
                lines.push(`及格獎勵：${formatGrantedPoints(grantCappedChallengePoints(data, CHALLENGE_EXAM_PASS_POINTS))}`);
            } else {
                lines.push('今日及格獎勵已領取。');
            }
        }
        if (typeof previousBest === 'number' && score > previousBest) {
            const gain = score - previousBest;
            lines.push(`比最高分進步 ${gain} 分！${formatGrantedPoints(grantCappedChallengePoints(data, gain))}`);
        }
        if (typeof previousBest !== 'number' || score > previousBest) data.bestExam = score;
        if (score === 100 && !data.perfectExamAwarded) {
            data.perfectExamAwarded = true;
            playerStats.totalPoints += CHALLENGE_EXAM_PERFECT_POINTS;
            lines.push(`第一次考滿分！+${CHALLENGE_EXAM_PERFECT_POINTS} 點 🏆`);
        }
        if (!passed || correctCount < total) lines.push('答錯的題目已收進錯題回收站。');
        return { title: `模擬小考：${score} 分`, tone: passed ? 'pass' : 'fail', lines };
    }

    function finishChallengeSession() {
        const session = challengeSession;
        const data = ensureChallengeData(currentWordListPath);
        const finishers = { level: finishLevelSession, recycle: finishRecycleSession, exam: finishExamSession };
        const result = finishers[session.kind](session, data);

        // 計入練習天數（全域成就「修練狂魔」）
        ensureUnitData(currentWordListPath).completionHistory.push(Date.now());
        checkGlobalAchievements();
        saveProgress();
        updateTotalPointsDisplay();

        challengeLastResult = { ...result, wrong: session.results.filter(item => !item.isCorrect) };
        showChallengeHub();
    }

    async function quitChallengeSession() {
        const session = challengeSession;
        if (!session) return;
        // 已經作答過才需要確認；一題都還沒答就直接離開
        if (session.results.length > 0) {
            const confirmed = await showDialog({
                title: '要離開這次練習嗎？',
                message: `已經作答 ${session.results.length} / ${session.questions.length} 題。現在離開不會計算星星與成績，答錯的題目仍會留在錯題回收站。`,
                confirmText: '離開',
                cancelText: '繼續作答',
                focusCancel: true,
            });
            if (challengeSession !== session) return;
            if (!confirmed) {
                focusGrammarAnswer();
                return;
            }
        }
        challengeLastResult = session.results.length === 0 ? null : {
            title: '已離開本次練習',
            tone: '',
            lines: ['已作答的題目都有記錄，答錯的也已收進錯題回收站；這次不計星星與成績。'],
            wrong: [],
        };
        showChallengeHub();
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
        } else if (grammarContainer.style.display !== 'none') {
            focusGrammarAnswer();
        }
    }

    // 把焦點放回文法作答區（沒有輸入框時移開焦點，避免停在「離開」鈕上被 Enter 再次觸發）
    function focusGrammarAnswer() {
        const input = grammarAnswerAreaEl.querySelector('input:not(:disabled)');
        if (input) input.focus();
        else if (grammarQuestionAnswered && grammarNextBtn.style.display !== 'none') grammarNextBtn.focus();
        else if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    }

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return [d.getUTCFullYear(), weekNo];
    }

    function checkStreakAchievements(unitPath, unlockedInSession) {
        const unitData = playerStats.unitData[unitPath];
        if (!unitData) return;
        for (const id in UNIT_ACHIEVEMENTS) {
            if (id.includes('STREAK')) {
                if (!unitData.achievements[id]) {
                    const ach = UNIT_ACHIEVEMENTS[id];
                    const progress = ach.progress(playerStats, unitPath);
                    if (progress.current >= progress.target) {
                        playerStats.totalPoints += ach.points;
                        unitData.achievements[id] = true;
                        unlockedInSession.push(formatAchievementLabel(ach));
                    }
                }
            }
        }
    }

    function showStartScreen() {
        // 停掉練習中殘留的計時器與語音，避免回到首頁後還在背景執行
        clearNextWordTimeout();
        stopWordAudio();
        stopGrammarAudio();
        challengeSession = null;
        currentWord = null;
        currentGrammarQuestion = null;

        gameContainer.style.display = 'none';
        grammarContainer.style.display = 'none';
        challengeContainer.style.display = 'none';
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
        totalPointsDisplayEl.textContent = playerStats.totalPoints || 0;
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
    const modeButtons = { spelling: modeBtnSpelling, grammar: modeBtnGrammar, challenge: modeBtnChallenge };

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
    const MODE_LABELS = { spelling: '單字拼寫', grammar: '文法練習', challenge: '文法闖關' };

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
            `每天過關就有點數：${roundText}。`,
            `第一次完成這個單元：${firstClear.icon} +${firstClear.points}。`,
            `通關時愛心剩越多，獎牌越好：${medalText}。愛心全滿就是金牌！`,
            `常常回來練同一個單元：練滿 ${streakText}。`,
            `超級大獎：${globalText}。詳情請看 🏆 我的成就。`,
        ];
    }

    function getPointsInfoTexts(mode) {
        if (mode === 'spelling' || mode === 'grammar') return getUnitPointsInfoTexts();
        if (mode === 'challenge') return getChallengeRuleTexts();
        return [
            '單字拼寫、文法練習：每天過關就有點數，還能拿獎牌和成就。',
            '文法闖關：拿星星、改錯題、考小考，都有點數。',
            '👆 點一下上面的練習模式，看看怎麼拿點數！',
        ];
    }

    function renderPointsInfo(mode) {
        pointsInfoTitleEl.textContent = MODE_LABELS[mode] ? `「${MODE_LABELS[mode]}」如何獲得點數？🪙` : '如何獲得點數？🪙';
        pointsInfoListEl.innerHTML = '';
        getPointsInfoTexts(mode).forEach(text => pointsInfoListEl.appendChild(createEl('li', '', text)));
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

    function updateUnitRewardsBadge() {
        const badgeContainer = unitRewardsBadgeContainer;

        if (activeGameMode === 'challenge' && wordListSelectEl.value) {
            badgeContainer.style.display = 'none';
            setUnitRewardsHint('🏅 拿星星、改錯題、考小考，都有點數！');
            return;
        }

        // 只有拼寫與文法模式顯示每日回合獎勵
        if (!['spelling', 'grammar'].includes(activeGameMode) || !wordListSelectEl.value) {
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
            
            const badge = document.createElement('div');
            badge.className = `reward-badge ${hasClaimed ? 'active' : ''}`;
            
            const coin = document.createElement('div');
            coin.className = 'coin';
            coin.textContent = `+${r.points}`;
            
            const label = document.createElement('div');
            label.className = 'badge-label';
            label.textContent = r.label;
            
            badge.appendChild(coin);
            badge.appendChild(label);
            badgeContainer.appendChild(badge);

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
        if (activeGameMode === 'challenge') {
            spellingFormEl.style.display = 'none';
            gameContainer.style.display = 'none';
            challengeLastResult = null;
            showChallengeHub();
        } else if (activeGameMode === 'grammar') {
            spellingFormEl.style.display = 'none';
            gameContainer.style.display = 'none';
            grammarContainer.style.display = 'block';
            initializeGrammarGame();
        } else {
            spellingFormEl.style.display = 'block';
            grammarContainer.style.display = 'none';
            gameContainer.style.display = 'block';
            initializeGame();
        }
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

        playerStats.totalPoints += points;
        // 兌換紀錄中以負數代表加點
        playerStats.redemptionHistory.unshift({ points: -points, description: `[獎勵] ${reason}`, timestamp: Date.now() });
        saveProgress();
        updateTotalPointsDisplay();
        closeModal(adminModalContainer);
        showToast(`已增加 ${points} 點（${reason}）`, { title: '加點成功', icon: '🪙' });
    }

    // 文法作答畫面的 Enter 快速鍵：未作答時檢查答案，已作答時前往下一題
    function handleGrammarEnterKey(event) {
        if (event.key === 'Enter' && event.repeat && grammarContainer.style.display !== 'none') {
            event.preventDefault(); // 按住不放不連續觸發（包含焦點所在的按鈕）
            return;
        }
        if (
            event.key !== 'Enter' ||
            event.isComposing ||     // 輸入法選字中的 Enter 不算作答
            event.keyCode === 229 || // Safari 在選字結束後才送出 keydown，要另外擋
            !['grammar', 'challenge'].includes(activeGameMode) ||
            grammarContainer.style.display === 'none' ||
            isAnyModalOpen()
        ) return;
        // 焦點在看得見的按鈕上時，讓 Enter 維持「按下該按鈕」的原本行為（選選項、點方塊、提示、離開…）。
        // 唯一例外是已經選取的選項：再按一次 Enter 就是送出答案。
        const focusedButton = event.target instanceof Element ? event.target.closest('button') : null;
        const isVisibleButton = focusedButton && !focusedButton.disabled && focusedButton.offsetParent !== null;
        const isSelectedOption = isVisibleButton && focusedButton.classList.contains('grammar-option')
            && focusedButton.classList.contains('selected');
        if (isVisibleButton && !isSelectedOption) return;

        event.preventDefault();
        if (grammarQuestionAnswered) {
            setupNextGrammarQuestion();
        } else {
            checkGrammarAnswer();
        }
    }

    // 其他分頁更新了存檔時同步過來，避免兩個分頁互相覆蓋進度
    function handleStorageChange(event) {
        if (event.key !== STORAGE_KEY || !event.newValue) return;
        loadProgress();
        updateTotalPointsDisplay();
        if (startContainer.style.display !== 'none') updateUnitRewardsBadge();
        if (redemptionContainer.style.display !== 'none') renderRedemptionHistory();
    }

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

        // 文法練習／文法闖關
        grammarHintBtn.addEventListener('click', showGrammarHint);
        grammarPlayAudioBtn.addEventListener('click', playGrammarAudio);
        // 滑鼠／觸控的連點防護（event.detail 為 0 的鍵盤觸發不受影響）：
        // 雙擊「檢查答案」時，第二下不可被當成第二次作答，也不可落在同位置的「下一題」上
        let lastGrammarActionAt = 0;
        const guardDoubleClick = handler => event => {
            const isPointerClick = event.detail > 0;
            if (isPointerClick && Date.now() - lastGrammarActionAt < 400) return;
            if (isPointerClick) lastGrammarActionAt = Date.now();
            handler();
        };
        grammarCheckBtn.addEventListener('click', guardDoubleClick(checkGrammarAnswer));
        grammarNextBtn.addEventListener('click', guardDoubleClick(setupNextGrammarQuestion));
        grammarQuitBtn.addEventListener('click', () => {
            if (activeGameMode === 'challenge') quitChallengeSession();
            else confirmQuitPractice();
        });
        challengeBackBtn.addEventListener('click', showStartScreen);
        document.addEventListener('keydown', handleGrammarEnterKey);

        // 結算畫面
        restartBtn.addEventListener('click', () => {
            completionContainer.style.display = 'none';
            if (activeGameMode === 'grammar') {
                grammarContainer.style.display = 'block';
                initializeGrammarGame();
            } else {
                gameContainer.style.display = 'block';
                initializeGame();
            }
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
            const isPracticing = gameContainer.style.display !== 'none' || grammarContainer.style.display !== 'none';
            if (!isPracticing) return;
            event.preventDefault();
            event.returnValue = '';
        });
    }

    main();
});
