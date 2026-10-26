document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素 ---
    const startContainer = document.getElementById('start-container');
    const gameContainer = document.getElementById('game-container');
    const grammarContainer = document.getElementById('grammar-container');
    const completionContainer = document.getElementById('completion-container');
    const achievementContainer = document.getElementById('achievement-container');

    // 新的啟動流程元素
    const modeBtnSpelling = document.getElementById('mode-btn-spelling');
    const modeBtnGrammar = document.getElementById('mode-btn-grammar');
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

    const restartBtn = document.getElementById('restart-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');

    // 成就元素
    const showAchievementsBtn = document.getElementById('show-achievements-btn');
    const closeAchievementsBtn = document.getElementById('close-achievements-btn');
    const achievementListEl = document.getElementById('achievement-list');
    const achievementToastEl = document.getElementById('achievement-toast');

    // --- 管理者/兌換 DOM 元素 ---
    const adminModalContainer = document.getElementById('admin-modal-container');
    const adminPasswordForm = document.getElementById('admin-password-form');
    const adminPasswordInput = document.getElementById('admin-password-input');
    const closeAdminModalBtn = document.getElementById('close-admin-modal-btn');
    const adminAddPointsBtn = document.getElementById('admin-add-points-btn');

    const redemptionContainer = document.getElementById('redemption-container');
    const showRedemptionsBtn = document.getElementById('show-redemptions-btn');
    const closeRedemptionsBtn = document.getElementById('close-redemptions-btn');
    const redemptionForm = document.getElementById('redemption-form');
    const redeemPointsInput = document.getElementById('redeem-points-input');
    const redeemDescInput = document.getElementById('redeem-desc-input');
    const redemptionHistoryList = document.getElementById('redemption-history-list');

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
        { name: '六年級 上 Unit 1', path: 'g6_1_unit1.json', type: 'spelling' },
        { name: '六年級 上 Unit 2', path: 'g6_1_unit2.json', type: 'spelling' },
        { name: '六年級 上 Phonics 3~5', path: 'g6_1_phonics3_5.json', type: 'spelling' },
    ];

    // --- 生命值設定 ---
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
        BRONZE: { icon: '🥉', name: '銅牌', description: '通關時扣心在 2 顆以內 完成本單元練習', points: 5, progress: (stats, unitPath) => ({ current: stats.unitData[unitPath]?.achievements?.BRONZE ? 1 : 0, target: 1 }) },
        SILVER: { icon: '🥈', name: '銀牌', description: '通關時扣心在 1 顆以內 完成本單元練習', points: 10, progress: (stats, unitPath) => ({ current: stats.unitData[unitPath]?.achievements?.SILVER ? 1 : 0, target: 1 }) },
        GOLD: { icon: '🥇', name: '金牌', description: '通關時未扣心 完成本單元練習', points: 15, progress: (stats, unitPath) => ({ current: stats.unitData[unitPath]?.achievements?.GOLD ? 1 : 0, target: 1 }) },
        THREE_DAY_STREAK: { icon: '🏃', name: '日積月累', description: '累計 3 天完成本單元練習', points: 25, progress: (stats, unitPath) => { const history = stats.unitData[unitPath]?.completionHistory || []; return { current: new Set(history.map(ts => getLocalDateString(ts))).size, target: 3 }; } },
        THREE_WEEK_STREAK: { icon: '📅', name: '週而復始', description: '累計 3 週完成本單元練習', points: 50, progress: (stats, unitPath) => { const history = stats.unitData[unitPath]?.completionHistory || []; return { current: new Set(history.map(ts => { const [year, week] = getWeekNumber(new Date(ts)); return `${year}-${String(week).padStart(2, '0')}`; })).size, target: 3 }; } },
        THREE_MONTH_STREAK: { icon: '🗓️', name: '持之以恆', description: '累計 3 個月完成本單元練習', points: 75, progress: (stats, unitPath) => { const history = stats.unitData[unitPath]?.completionHistory || []; return { current: new Set(history.map(ts => getLocalYearMonthString(ts))).size, target: 3 }; } },
    };
    const MEDAL_IDS = ['BRONZE', 'SILVER', 'GOLD'];
    const STREAK_IDS = ['THREE_DAY_STREAK', 'THREE_WEEK_STREAK', 'THREE_MONTH_STREAK'];

    function formatAchievementLabel(ach) {
        return `${ach.icon} ${ach.name} (+${ach.points})`;
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
    let wordsWrongInSession = new Set();
    let currentStreak = 0;
    let gameMode = 'practice'; // 'practice' or 'review'
    let stageTotal = 0;
    let currentWord = null;
    let isCorrecting = false;
    let correctionCount = 0;
    const REQUIRED_CORRECTIONS = 2;
    const synth = window.speechSynthesis;
    let isPlaying = false;
    let currentHealth;
    let hasLostHealthOnCurrentWord = false;

    // 文法練習狀態
    let grammarQuestions = [];
    let grammarQuestionPool = [];
    let grammarReviewQuestions = [];
    let currentGrammarQuestion = null;
    let grammarCurrentIndex = 0;
    let grammarSessionTotal = 0;
    let grammarStageTotal = 0;
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

    function saveProgress() {
        localStorage.setItem('playerStats_v2', JSON.stringify(playerStats));
    }

    function loadProgress() {
        const savedStats = localStorage.getItem('playerStats_v2');
        if (savedStats) {
            playerStats = JSON.parse(savedStats);
            if (playerStats.totalPoints === undefined) playerStats.totalPoints = 0;
            if (!playerStats.unitData) playerStats.unitData = {};
            if (!playerStats.globalStats) playerStats.globalStats = { totalWordsCorrect: 0, longestStreak: 0 };
            if (!playerStats.unlockedGlobalAchievements) playerStats.unlockedGlobalAchievements = {};
            if (playerStats.redemptionHistory === undefined) playerStats.redemptionHistory = [];
            
            // 補齊舊玩家的「初試身手」成就標記，避免重複領取點數
            if (playerStats.unitData) {
                for (const unitPath in playerStats.unitData) {
                    const unit = playerStats.unitData[unitPath];
                    if (unit.completionHistory && unit.completionHistory.length > 0) {
                        if (unit.achievements && !unit.achievements.FIRST_CLEAR) {
                            unit.achievements.FIRST_CLEAR = true;
                        }
                    }
                }
            }
        } else {
            playerStats = {
                totalPoints: 0,
                unitData: {},
                globalStats: { totalWordsCorrect: 0, longestStreak: 0 },
                unlockedGlobalAchievements: {},
                redemptionHistory: [],
            };
        }
    }

    // --- 成就系統 UI & 邏輯 ---
    function showToast(text) {
        achievementToastEl.querySelector('.toast-description').textContent = text;
        achievementToastEl.style.display = 'flex';
        setTimeout(() => { achievementToastEl.classList.add('show'); }, 10);
        setTimeout(() => {
            achievementToastEl.classList.remove('show');
            setTimeout(() => { achievementToastEl.style.display = 'none'; }, 500);
        }, 4000);
    }

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
            description: '通關時扣心 2 顆內銅牌、1 顆內銀牌、未扣心金牌',
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
        document.querySelector('#achievement-modal h2').textContent = '我的成就';

        const emptyUnitData = { achievements: {}, completionHistory: [] };
        const activeLists = getActiveWordLists();
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
        const history = playerStats.redemptionHistory || [];
        if (history.length === 0) {
            redemptionHistoryList.innerHTML = '<li>尚無兌換紀錄。</li>';
            return;
        }
        history.forEach(record => {
            const li = document.createElement('li');
            const date = new Date(record.timestamp).toLocaleString();
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

    function handleManualRedeem(event) {
        event.preventDefault();
        const pointsToRedeem = parseInt(redeemPointsInput.value, 10);
        const description = redeemDescInput.value;
        if (isNaN(pointsToRedeem) || pointsToRedeem <= 0) { alert('請輸入一個有效的正數點數！'); return; }
        if (playerStats.totalPoints < pointsToRedeem) { alert('點數不足！'); return; }
        if (!description.trim()) { alert('請填寫兌換說明！'); return; }
        const confirmationMessage = `您確定要花費 ${pointsToRedeem} 點來兌換「${description}」嗎？`;
        if (window.confirm(confirmationMessage)) {
            playerStats.totalPoints -= pointsToRedeem;
            playerStats.redemptionHistory.unshift({ points: pointsToRedeem, description: description, timestamp: Date.now() });
            saveProgress();
            updateTotalPointsDisplay();
            renderRedemptionHistory();
            redeemPointsInput.value = '';
            redeemDescInput.value = '';
        }
    }

    // --- 遊戲主要功能 ---
    async function loadWords(filePath) {
        try {
            const response = await fetch(`${filePath}?v=${Date.now()}`);
            if (!response.ok) throw new Error(`無法讀取 ${filePath}: ${response.statusText}`);
            wordList = await response.json();
            if (!Array.isArray(wordList) || wordList.length === 0) throw new Error("單字列表為空或格式錯誤。");
            return true;
        } catch (error) {
            alert(`載入單字失敗...\n${error.message}`);
            showStartScreen();
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
        wordsToPractice = shuffle(wordList);
        stageTotal = wordsToPractice.length;
        if (!synth) playAudioBtnEl.style.display = 'none';
        updateHealthDisplay();
        setupNextWord();
    }

    function setupNextWord() {
        if (wordsToPractice.length === 0) {
            if (wordsToReview.length > 0) {
                gameMode = 'review';
                wordsToPractice = shuffle(wordsToReview);
                stageTotal = wordsToPractice.length;
                wordsToReview = [];
                feedbackEl.textContent = `第 ${roundCount} 回合結束！現在開始訂正錯題...`;
                feedbackEl.className = 'feedback-message notice';
            } else {
                // Successfully completed a round. Award points before moving to the next round or ending the game.
                if (activeGameMode === 'spelling') awardRoundReward('spelling', roundCount);

                if (roundCount >= 3) {
                    gameOver(true);
                    return;
                }

                // Start next round
                gameMode = 'practice';
                roundCount++;
                wordsToPractice = shuffle(wordList);
                stageTotal = wordsToPractice.length;
                feedbackEl.textContent = `太棒了！第 ${roundCount} 回合開始！`;
                feedbackEl.className = 'feedback-message notice';
                if (HEALTH_REPLENISH_ROUNDS.includes(roundCount - 1) && currentHealth < MAX_HEALTH) {
                    currentHealth++;
                    updateHealthDisplay();
                    feedbackEl.textContent += '生命值回補！❤️';
                }
            }
        }
        const practicedInStage = stageTotal - wordsToPractice.length;
        const progressPercent = stageTotal > 0 ? (practicedInStage / stageTotal) * 100 : 0;
        progressBarEl.style.width = `${progressPercent}%`;
        roundDisplayEl.textContent = gameMode === 'review' ? '訂正時間' : `第 ${roundCount} 回合`;
        progressBarEl.style.backgroundImage = gameMode === 'review' ? 'linear-gradient(45deg, var(--incorrect-color), #f56565)' : 'linear-gradient(45deg, var(--correct-color), #68d391)';
        currentWord = wordsToPractice.shift();
        playAudioBtnEl.style.display = synth ? 'block' : 'none';
        phoneticsEl.textContent = currentWord.phonetics;
        const hasExample = Boolean(currentWord.example && currentWord.example.trim());
        const targetWordRegex = getTargetWordRegex(currentWord.english);

        if (gameMode === 'practice' && roundCount === 1) {
            translationEl.textContent = currentWord.chinese;
            renderExampleBubbles(currentWord, targetWordRegex);
            wordDisplayEl.textContent = currentWord.english.split(' ').map(w => w.length > 0 ? w[0] + '_'.repeat(w.length - 1) : '').join(' ');
        } else if (gameMode === 'practice' && roundCount === 2) {
            translationEl.textContent = currentWord.chinese;
            renderExampleBubbles(currentWord, targetWordRegex);
            wordDisplayEl.textContent = currentWord.english.replace(/\S/g, '_');
        } else {
            // 第 3 回合或訂正：若無例句則降級顯示中文作為提示，避免畫面空白卡死
            translationEl.textContent = hasExample ? '' : currentWord.chinese;
            renderExampleBubbles(currentWord, targetWordRegex);
            wordDisplayEl.textContent = '';
        }
        spellingInputEl.value = '';
        spellingInputEl.disabled = false;
        spellingInputEl.focus();
        // 上一題的語音可能還在唸（答題太快時），先停掉再播新題
        stopWordAudio();
        wordAutoPlayTimeout = setTimeout(() => {
            wordAutoPlayTimeout = null;
            playWordAudio();
        }, 100);
    }

    // --- 輔助函式 (對話解析、氣泡渲染與高亮控制) ---
    function parseExampleDialogue(example) {
        if (!example) return { lines: [], isDialogue: false, formattedText: '' };
        const isDialogue = /(?:^|\s+)[A-Za-z]:\s*/i.test(example);
        if (!isDialogue) {
            const cleanText = example.trim();
            return {
                lines: [cleanText],
                isDialogue: false,
                formattedText: cleanText
            };
        }
        const parts = example.split(/(?:^|\s+)[A-Za-z]:\s*/i).map(p => p.trim()).filter(Boolean);
        return {
            lines: parts,
            isDialogue: true,
            formattedText: parts.join('\n')
        };
    }

    function getCleanExample(example) {
        return parseExampleDialogue(example).formattedText;
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function getTargetWordRegex(english) {
        if (!english) return null;
        const cleanWord = english.replace(/[.,?!;:]+$/, "").trim();
        let escaped = escapeRegExp(cleanWord);
        // 若包含省略號 ... 允許中間穿插任意單字 (如 not... at all)
        escaped = escaped.replace(/\\\.\\\.\\\./g, "\\s+(?:\\S+\\s+)*?");
        try {
            return new RegExp(`\\b${escaped}(?:s|es|ed|d|ing)?\\b`, 'gi');
        } catch (e) {
            return new RegExp(escapeRegExp(cleanWord), 'gi');
        }
    }

    function setSpeechHighlight(activeBubbleIndex) {
        if (!exampleEl) return;
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
            dialogueInfo.lines.forEach((lineText, idx) => {
                const speaker = idx === 0 ? 'a' : 'b';
                const speakerLabel = idx === 0 ? 'A' : 'B';
                
                const bubble = document.createElement('div');
                bubble.className = `chat-bubble speaker-${speaker}`;
                bubble.id = `example-bubble-${idx}`;

                const avatar = document.createElement('span');
                avatar.className = 'avatar-badge';
                avatar.textContent = speakerLabel;

                const textSpan = document.createElement('span');
                textSpan.className = 'bubble-text';
                textSpan.textContent = lineText.replace(targetWordRegex, '_______');

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
            textSpan.textContent = dialogueInfo.formattedText.replace(targetWordRegex, '_______');

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
        if (!preferredVoice) {
            preferredVoice = voices.find(voice => voice.lang === 'en-US' && !voice.name.includes('Male'));
        }

        // 最後手段：隨便挑一個英文聲音
        if (!preferredVoice) {
            preferredVoice = voices.find(voice => voice.lang.startsWith('en'));
        }
        
        return preferredVoice || voices[0];
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

    // 停止目前單字的語音序列；舊序列的回呼會因 requestId 不符而失效
    function stopWordAudio() {
        wordAudioRequestId++;
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
            } else { // review mode
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
            const text = typeof item === 'string' ? item : item.text;
            const bubbleIdx = typeof item === 'object' ? item.bubbleIdx : null;

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

            utterance.onend = () => {
                if (requestId !== wordAudioRequestId) return;
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
                console.error('語音合成發生錯誤:', event);
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
        const userAnswer = spellingInputEl.value.trim();
        if (userAnswer) checkSpellingAnswer(userAnswer);
    }

    function checkSpellingAnswer(answer) {
        const cleanCorrectAnswer = currentWord.english.replace(/[.,?!;:]+$/, "");
        const cleanUserAnswer = answer.trim().replace(/[.,?!;:]+$/, "");
        const nextWordSetupFn = setupNextWord;

        if (isCorrecting) {
            if (cleanUserAnswer.toLowerCase() === cleanCorrectAnswer.toLowerCase()) {
                correctionCount++;
                if (correctionCount >= REQUIRED_CORRECTIONS) {
                    isCorrecting = false;
                    correctionCount = 0;
                    feedbackEl.textContent = '很好，現在記住了！';
                    feedbackEl.className = 'feedback-message notice';
                    spellingInputEl.disabled = true;
                    setTimeout(nextWordSetupFn, 1000);
                } else {
                    feedbackEl.textContent = `請再輸入一次 (${correctionCount}/${REQUIRED_CORRECTIONS})`;
                    spellingInputEl.value = '';
                }
            } else {
                feedbackEl.textContent = `拼寫仍然不對喔，請再試一次: ${cleanCorrectAnswer}`;
                spellingInputEl.value = '';
                spellingInputEl.classList.add('input-incorrect');
                setTimeout(() => spellingInputEl.classList.remove('input-incorrect'), 600);
            }
            return;
        }

        spellingInputEl.disabled = true;
        if (cleanUserAnswer.toLowerCase() === cleanCorrectAnswer.toLowerCase()) {
            feedbackEl.textContent = '正確！';
            feedbackEl.className = 'feedback-message correct';
            wordDisplayEl.textContent = currentWord.english;
            spellingInputEl.classList.add('input-correct');
            flashOverlayEl.classList.add('flash-correct');
            setTimeout(() => { spellingInputEl.classList.remove('input-correct'); flashOverlayEl.classList.remove('flash-correct'); }, 600);
            
            currentStreak++;
            playerStats.globalStats.totalWordsCorrect++;
            if (currentStreak > playerStats.globalStats.longestStreak) playerStats.globalStats.longestStreak = currentStreak;
            checkGlobalAchievements();
            saveProgress();
            
            setTimeout(nextWordSetupFn, 500);
        } else {
            feedbackEl.innerHTML = '';
            const feedbackBox = document.createElement('div');
            feedbackBox.className = 'spelling-mistake-box';
            [`你輸入的是: ${answer}`, `正確答案是: ${cleanCorrectAnswer}`, `請照著輸入 ${REQUIRED_CORRECTIONS} 次`].forEach(lineText => {
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
            wordsWrongInSession.add(cleanCorrectAnswer);
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
            spellingInputEl.disabled = false;
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
        const total = grammarStageTotal || grammarSessionTotal;
        const progress = total > 0 ? (grammarCurrentIndex / total) * 100 : 0;
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

        const answerInput = document.createElement('input');
        answerInput.type = 'text';
        answerInput.className = 'grammar-input';
        answerInput.autocomplete = 'off';
        answerInput.autocapitalize = 'off';
        answerInput.spellcheck = false;
        answerInput.placeholder = question.type === 'transform' ? '請輸入完整句子' : '請輸入答案';
        grammarAnswerAreaEl.appendChild(answerInput);
        answerInput.addEventListener('input', () => answerInput.classList.remove('input-incorrect'));
        answerInput.focus();
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
            const finish = () => {
                if (finished) return;
                finished = true;
                if (grammarSpeechResolve === finish) grammarSpeechResolve = null;
                resolve();
            };
            grammarSpeechResolve = finish;

            const preferredVoice = getPreferredVoice();
            const utterance = new SpeechSynthesisUtterance(text);
            if (preferredVoice) utterance.voice = preferredVoice;
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            utterance.onend = finish;
            utterance.onerror = event => {
                console.error('文法題目語音合成發生錯誤:', event);
                finish();
            };
            synth.speak(utterance);
        });
    }

    function playGrammarBeep() {
        return new Promise(async resolve => {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                setTimeout(resolve, 180);
                return;
            }

            try {
                if (!grammarAudioContext) grammarAudioContext = new AudioContextClass();
                if (grammarAudioContext.state === 'suspended') await grammarAudioContext.resume();

                const oscillator = grammarAudioContext.createOscillator();
                const gain = grammarAudioContext.createGain();
                oscillator.type = 'sine';
                oscillator.frequency.value = 880;
                gain.gain.setValueAtTime(0.08, grammarAudioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, grammarAudioContext.currentTime + 0.18);
                oscillator.connect(gain);
                gain.connect(grammarAudioContext.destination);

                grammarBeepOscillator = oscillator;
                grammarBeepResolve = () => {
                    grammarBeepResolve = null;
                    resolve();
                };
                oscillator.onended = () => {
                    grammarBeepOscillator = null;
                    if (grammarBeepResolve) {
                        const finish = grammarBeepResolve;
                        grammarBeepResolve = null;
                        finish();
                    }
                };
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

        const audioSegments = currentGrammarQuestion.question.split(/(___)/);
        for (const segment of audioSegments) {
            if (requestId !== grammarAudioRequestId) return;
            if (segment === '___') {
                await playGrammarBeep();
            } else if (segment.trim()) {
                await speakGrammarText(segment);
            }
        }

        if (requestId === grammarAudioRequestId) {
            isPlaying = false;
            grammarPlayAudioBtn.disabled = false;
        }
    }

    function awardRoundReward(mode, round) {
        const pointsAwarded = ROUND_REWARDS[round];
        if (!pointsAwarded) return;
        const unitData = ensureUnitData(currentWordListPath);
        const rewardKey = ROUND_REWARD_KEYS[mode];
        if (!unitData[rewardKey]) unitData[rewardKey] = {};

        const roundLabel = mode === 'grammar' ? `文法第 ${round} 回合` : `第 ${round} 回合`;
        const todayKey = getLocalDateString();
        if (unitData[rewardKey][round] !== todayKey) {
            playerStats.totalPoints += pointsAwarded;
            unitData[rewardKey][round] = todayKey;
            showToast(`完成${roundLabel}，獲得 ${pointsAwarded} 點！`);
        } else {
            showToast(`完成${roundLabel}！（今日點數已領取）`);
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
            showToast(`在 ${unitName} 中解鎖: ${unlockedInSession.join(', ')}`);
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
        if (grammarQuestions.length === 0) {
            if (grammarReviewQuestions.length > 0 && !grammarIsReview) {
                grammarIsReview = true;
                // 錯題沿用原本的主題順序，讓同一主題的錯題仍連續訂正。
                grammarQuestions = [...grammarReviewQuestions];
                grammarReviewQuestions = [];
                grammarCurrentIndex = 0;
                grammarStageTotal = grammarQuestions.length;
                grammarFeedbackEl.textContent = '本輪練習完成，現在開始訂正錯題。';
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
                    grammarFeedbackEl.textContent += ' 愛心回補！❤️';
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
        grammarFeedbackEl.textContent = '';
        grammarFeedbackEl.className = 'feedback-message';
        grammarCheckBtn.style.display = 'inline-block';
        grammarNextBtn.style.display = 'none';
        updateGrammarProgress();
        renderGrammarAnswerArea(currentGrammarQuestion);

        const input = grammarAnswerAreaEl.querySelector('input');
        if (input) input.focus();
        grammarAutoPlayTimeout = setTimeout(() => {
            grammarAutoPlayTimeout = null;
            playGrammarAudio();
        }, 150);
    }

    function showGrammarHint() {
        if (!currentGrammarQuestion || grammarQuestionAnswered) return;
        grammarHintEl.style.display = 'block';
    }

    function checkGrammarAnswer() {
        if (!currentGrammarQuestion || grammarQuestionAnswered) return;

        const input = grammarAnswerAreaEl.querySelector('input');
        const answer = input ? input.value.trim() : grammarSelectedAnswer;
        if (!answer) {
            grammarFeedbackEl.textContent = '請先作答，再按「檢查答案」。';
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
            grammarCheckBtn.style.display = 'none';
            grammarNextBtn.style.display = 'inline-block';
            updateGrammarProgress();
            return;
        }

        grammarHintEl.style.display = 'block';
        if (!grammarQuestionHadMistake) {
            grammarQuestionHadMistake = true;
            grammarHealth--;
            updateGrammarHealthDisplay();
            if (!grammarIsReview && !grammarReviewQuestions.some(question => question.id === currentGrammarQuestion.id)) {
                grammarReviewQuestions.push(currentGrammarQuestion);
            }
            grammarFeedbackEl.textContent = '答案還不正確，請參考提示再試一次。';
            grammarFeedbackEl.className = 'feedback-message incorrect';
            if (input) input.classList.add('input-incorrect');
            grammarAnswerAreaEl.querySelectorAll('.grammar-option').forEach(button => {
                if (button.classList.contains('selected')) button.classList.add('input-incorrect');
            });
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
        grammarCheckBtn.style.display = 'none';
        grammarNextBtn.style.display = 'inline-block';
    }

    function initializeGrammarGame() {
        if (!Array.isArray(wordList) || wordList.length === 0) return;
        grammarPlayAudioBtn.style.display = synth ? 'inline-flex' : 'none';

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
        grammarSessionTotal = grammarQuestionPool.length * 3;
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

        if (!isSuccess) {
            completionContainer.querySelector('.start-title').textContent = '練習失敗！';
            completionContainer.querySelector('p').textContent = '愛心已耗盡，請再接再厲！';
            restartBtn.style.display = 'block';
            backToMenuBtn.style.display = 'block';
            grammarContainer.style.display = 'none';
            completionContainer.style.display = 'flex';
            saveProgress();
            updateTotalPointsDisplay();
            return;
        }

        awardUnitCompletion(currentWordListPath, currentWordListName, grammarHealth);
        saveProgress();
        updateTotalPointsDisplay();

        completionContainer.querySelector('.start-title').textContent = '文法練習完成！';
        completionContainer.querySelector('p').textContent =
            `三回合練習完成！剩餘愛心：${grammarHealth} 顆。`;
        restartBtn.style.display = 'block';
        backToMenuBtn.style.display = 'block';
        grammarContainer.style.display = 'none';
        completionContainer.style.display = 'flex';
    }

    // --- 通用遊戲邏輯 ---
    function gameOver(isSuccess) {
        if (isSuccess) {
            // Achievement tracking and history for spelling mode only
            if (activeGameMode === 'spelling') {
                awardUnitCompletion(currentWordListPath, currentWordListName, currentHealth);
                completionContainer.querySelector('.start-title').textContent = '恭喜通關！';
                completionContainer.querySelector('p').textContent = '你已完成本單元的所有練習。';
            }
        } else {
            const completionTitle = completionContainer.querySelector('.start-title');
            const completionMessage = completionContainer.querySelector('p');
            completionTitle.textContent = '遊戲失敗！';
            let messageHTML = '生命值已耗盡，請再接再厲！';
            if (wordsWrongInSession.size > 0) {
                const wrongWordsArray = Array.from(wordsWrongInSession);
                const wrongWordsListHTML = wrongWordsArray.map(word => `<li style="color: var(--text-color); margin-bottom: 0.5rem;">${word}</li>`).join('');
                messageHTML += `<div style="text-align: left; margin-top: 1.5rem; font-size: 1rem;"><strong style="color: var(--header-color);">本輪錯題列表：</strong><ul style="list-style-type: disc; padding-left: 20px; margin-top: 0.5rem;">${wrongWordsListHTML}</ul></div>`;
            }
            completionMessage.innerHTML = messageHTML;
        }
        
        document.getElementById('restart-btn').style.display = 'block';
        document.getElementById('back-to-menu-btn').style.display = 'block';
        
        saveProgress();
        gameContainer.style.display = 'none';
        completionContainer.style.display = 'flex';
        updateTotalPointsDisplay();
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
        gameContainer.style.display = 'none';
        grammarContainer.style.display = 'none';
        completionContainer.style.display = 'none';
        achievementContainer.style.display = 'none';
        startContainer.style.display = 'flex';
        
        spellingFormEl.style.display = 'none';

        wordListSelectEl.disabled = true;
        wordListSelectEl.innerHTML = '<option value="">請先選擇模式</option>';
        startGameBtn.disabled = true;
        modeBtnSpelling.classList.remove('mode-selected');
        modeBtnGrammar.classList.remove('mode-selected');
        activeGameMode = '';
        updateTotalPointsDisplay();
        updateUnitRewardsBadge();
    }

    function updateTotalPointsDisplay() {
        const pointsDisplay = document.getElementById('total-points-display');
        if (pointsDisplay) pointsDisplay.textContent = playerStats.totalPoints || 0;
    }

    function renderHearts(displayEl, health) {
        displayEl.innerHTML = '';
        for (let i = 0; i < MAX_HEALTH; i++) {
            const heartSpan = document.createElement('span');
            heartSpan.classList.add('heart');
            heartSpan.textContent = '❤️';
            if (i < health) heartSpan.classList.add('full');
            displayEl.appendChild(heartSpan);
        }
    }

    function updateHealthDisplay() {
        renderHearts(healthDisplayEl, currentHealth);
    }

    // --- 新的啟動流程 ---
    function updateWordListDropdown(selectedMode) {
        wordListSelectEl.innerHTML = '';
        const selectedType = typeof selectedMode === 'string' ? selectedMode : activeGameMode;
        const filteredLists = wordLists.filter(list => list.type === selectedType && !list.disabled);
        
        if (filteredLists.length === 0) {
            const option = document.createElement('option');
            option.textContent = '此模式無可用單元';
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
        wordListSelectEl.disabled = false;
        startGameBtn.disabled = false;
        updateUnitRewardsBadge();
    }

    function updateUnitRewardsBadge() {
        const badgeContainer = document.getElementById('unit-rewards-badge-container');
        let hintEl = document.getElementById('unit-rewards-hint');
        if (!badgeContainer) return;

        // 如果 hintEl 不存在，動態建立它並放到 badgeContainer 後方
        if (!hintEl) {
            hintEl = document.createElement('div');
            hintEl.id = 'unit-rewards-hint';
            hintEl.style.textAlign = 'center';
            hintEl.style.marginTop = '1rem';
            hintEl.style.fontSize = '0.9rem';
            hintEl.style.color = '#ffd700'; // 漂亮的金色
            hintEl.style.textShadow = '0 0 5px rgba(255, 215, 0, 0.2)';
            badgeContainer.parentNode.insertBefore(hintEl, badgeContainer.nextSibling);
        }

        // 只有拼寫與文法模式顯示每日回合獎勵
        if (!['spelling', 'grammar'].includes(activeGameMode) || !wordListSelectEl.value || wordListSelectEl.value === "") {
            badgeContainer.style.display = 'none';
            hintEl.style.display = 'none';
            return;
        }

        const unitPath = wordListSelectEl.value;
        const rewardKey = ROUND_REWARD_KEYS[activeGameMode];
        const practiceName = activeGameMode === 'grammar' ? '文法' : '拼寫';
        
        // 唯讀取得該單元的今日獎勵進度，避免只是瀏覽選單就寫入空資料
        const today = getLocalDateString();
        const claimedInfo = playerStats.unitData[unitPath]?.[rewardKey] || {};

        badgeContainer.innerHTML = '';
        badgeContainer.style.display = 'flex';
        hintEl.style.display = 'block';

        let completedRounds = 0;
        const rounds = Object.entries(ROUND_REWARDS).map(([round, points]) => ({ round: Number(round), points, label: `第${round}回合` }));
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
        if (completedRounds === 0) {
            hintEl.textContent = `💡 完成今日${practiceName}挑戰，最高可獲得 ${maxDailyPoints} 點！`;
            hintEl.style.color = '#e2e8f0'; // 灰色偏白
        } else if (completedRounds < rounds.length) {
            const nextRound = completedRounds + 1;
            const nextPoints = ROUND_REWARDS[nextRound];
            hintEl.textContent = `🔥 再接再厲！今日${practiceName}通過第 ${nextRound} 回合可再獲得 ${nextPoints} 點！`;
            hintEl.style.color = '#ffd700'; // 金色
        } else {
            hintEl.textContent = `🎉 太棒了！今日此單元的所有${practiceName}回合獎勵已全數拿滿！`;
            hintEl.style.color = '#48bb78'; // 綠色
        }
    }

    async function startGame() {
        currentWordListPath = wordListSelectEl.value;
        currentWordListName = wordListSelectEl.options[wordListSelectEl.selectedIndex].text;

        if (!playerStats.unitData[currentWordListPath]) {
            ensureUnitData(currentWordListPath);
            saveProgress();
        }

        if (!(await loadWords(currentWordListPath))) return;

        startContainer.style.display = 'none';
        if (activeGameMode === 'grammar') {
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

    // --- 程式進入點 ---
    async function main() {
        loadProgress();
        showStartScreen();

        // Event Listeners
        modeBtnSpelling.addEventListener('click', () => {
            activeGameMode = 'spelling';
            modeBtnSpelling.classList.add('mode-selected');
            modeBtnGrammar.classList.remove('mode-selected');
            updateWordListDropdown('spelling');
        });

        modeBtnGrammar.addEventListener('click', () => {
            activeGameMode = 'grammar';
            modeBtnGrammar.classList.add('mode-selected');
            modeBtnSpelling.classList.remove('mode-selected');
            updateWordListDropdown('grammar');
        });

        startGameBtn.addEventListener('click', startGame);
        wordListSelectEl.addEventListener('change', updateUnitRewardsBadge);

        spellingFormEl.addEventListener('submit', handleSpellingSubmission);
        playAudioBtnEl.addEventListener('click', playWordAudio);
        grammarHintBtn.addEventListener('click', showGrammarHint);
        grammarPlayAudioBtn.addEventListener('click', playGrammarAudio);
        grammarCheckBtn.addEventListener('click', checkGrammarAnswer);
        grammarNextBtn.addEventListener('click', setupNextGrammarQuestion);

        function isAnyModalOpen() {
            return Boolean(
                (adminModalContainer && adminModalContainer.style.display !== 'none') ||
                (achievementContainer && achievementContainer.style.display !== 'none') ||
                (redemptionContainer && redemptionContainer.style.display !== 'none')
            );
        }

        document.addEventListener('keydown', event => {
            if (
                event.key !== 'Enter' ||
                activeGameMode !== 'grammar' ||
                startContainer.style.display !== 'none' ||
                isAnyModalOpen()
            ) return;
            event.preventDefault();
            if (grammarQuestionAnswered) {
                setupNextGrammarQuestion();
            } else {
                checkGrammarAnswer();
            }
        });

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

        // 成就和兌換按鈕
        showAchievementsBtn.addEventListener('click', () => { updateAchievementDisplay(); achievementContainer.style.display = 'flex'; });
        closeAchievementsBtn.addEventListener('click', () => { achievementContainer.style.display = 'none'; });
        showRedemptionsBtn.addEventListener('click', () => { renderRedemptionHistory(); redemptionContainer.style.display = 'flex'; });

        // --- 管理員加點功能 (SHA-256 驗證 + 隱私遮罩) ---
        const ADMIN_PASSWORD_HASH = '5406151279c1cf649ced0b0c66dfca309cb446ea15ddfb2ef3565d17089ac71a'; // 加密密碼

        async function sha256(message) {
            const msgUint8 = new TextEncoder().encode(message);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        }

        adminAddPointsBtn.addEventListener('click', () => {
            adminModalContainer.style.display = 'flex';
            adminPasswordInput.value = '';
            adminPasswordInput.focus();
        });

        closeAdminModalBtn.addEventListener('click', () => {
            adminModalContainer.style.display = 'none';
        });

        adminPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const pwd = adminPasswordInput.value;
            const inputHash = await sha256(pwd);

            if (inputHash === ADMIN_PASSWORD_HASH) {
                adminModalContainer.style.display = 'none';
                const pointsStr = prompt('驗證成功！請輸入要增加的點數:', '100');
                const points = parseInt(pointsStr, 10);
                const reason = prompt('請輸入加點原因:', '管理員手動獎勵');

                if (!isNaN(points) && points > 0 && reason) {
                    playerStats.totalPoints += points;
                    playerStats.redemptionHistory.unshift({
                        points: -points,
                        description: `[獎勵] ${reason}`,
                        timestamp: Date.now()
                    });
                    saveProgress();
                    updateTotalPointsDisplay();
                    alert(`成功增加 ${points} 點！`);
                }
            } else {
                alert('密碼錯誤！');
                adminPasswordInput.value = '';
                adminPasswordInput.focus();
            }
        });

        closeRedemptionsBtn.addEventListener('click', () => { redemptionContainer.style.display = 'none'; });
        redemptionForm.addEventListener('submit', handleManualRedeem);

    }

    main();
});
