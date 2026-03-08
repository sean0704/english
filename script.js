document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素 ---
    const startContainer = document.getElementById('start-container');
    const gameContainer = document.getElementById('game-container');
    const completionContainer = document.getElementById('completion-container');
    const achievementContainer = document.getElementById('achievement-container');
    const sentenceContainer = document.getElementById('sentence-container');
    const passageTranslationContainer = document.getElementById('passage-translation-container');

    // 新的啟動流程元素
    const modeBtnSpelling = document.getElementById('mode-btn-spelling');
    const modeBtnSentence = document.getElementById('mode-btn-sentence');
    const modeBtnTranslation = document.getElementById('mode-btn-translation');
    const modeBtnPassageTranslation = document.getElementById('mode-btn-passage-translation');
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

    // 翻譯填空專用
    const translationControls = document.getElementById('translation-controls');
    const checkTranslationBtn = document.getElementById('check-translation-btn');
    const nextTranslationBtn = document.getElementById('next-translation-btn');

    const restartBtn = document.getElementById('restart-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');

    // 成就元素
    const showAchievementsBtn = document.getElementById('show-achievements-btn');
    const closeAchievementsBtn = document.getElementById('close-achievements-btn');
    const achievementListEl = document.getElementById('achievement-list');
    const achievementToastEl = document.getElementById('achievement-toast');

    // --- 兌換 DOM 元素 ---
    const redemptionContainer = document.getElementById('redemption-container');
    const showRedemptionsBtn = document.getElementById('show-redemptions-btn');
    const closeRedemptionsBtn = document.getElementById('close-redemptions-btn');
    const redemptionForm = document.getElementById('redemption-form');
    const redeemPointsInput = document.getElementById('redeem-points-input');
    const redeemDescInput = document.getElementById('redeem-desc-input');
    const redemptionHistoryList = document.getElementById('redemption-history-list');

    // --- 句型 DOM 元素 ---
    const sentenceHintEl = document.getElementById('sentence-hint-display');
    const sentenceAnswerAreaEl = document.getElementById('sentence-answer-area');
    const sentenceWordBankEl = document.getElementById('sentence-word-bank');
    const sentenceFeedbackEl = document.getElementById('sentence-feedback-display');
    const checkSentenceBtn = document.getElementById('check-sentence-btn');
    const nextSentenceBtn = document.getElementById('next-sentence-btn');
    const playSentenceAudioBtn = document.getElementById('play-sentence-audio-btn');

    // --- 文章翻譯 DOM 元素 ---
    const passageEnglishDisplayEl = document.getElementById('passage-english-display');
    const passageTranslationInputEl = document.getElementById('passage-translation-input');
    const passageFeedbackDisplayEl = document.getElementById('passage-feedback-display');
    const checkPassageBtn = document.getElementById('check-passage-btn');
    const nextPassageBtn = document.getElementById('next-passage-btn');
    const playPassageAudioBtn = document.getElementById('play-passage-audio-btn');

    const flashOverlayEl = document.getElementById('flash-overlay');
    const healthDisplayEl = document.getElementById('health-display');

    // --- 字庫設定 ---
    const wordLists = [
        /*  上學期已結束 故關閉
        { name: '五年級 上 Unit 1,2', path: 'g5_1_unit1.json', type: 'spelling' },
        { name: '五年級 上 Unit 3,4', path: 'g5_1_unit3.json', type: 'spelling' },
        */
        { name: '五年級 下 Unit 1', path: 'g5_2_unit1.json', type: 'spelling' },
        { name: '五年級 下 Unit 2', path: 'g5_2_unit2.json', type: 'spelling' },
        { name: '五年級 下 Unit 3', path: 'g5_2_unit3.json', type: 'spelling' },
        { name: '五年級 下 Unit 4', path: 'g5_2_unit4.json', type: 'spelling' },
        /*  上學期已結束 故關閉
        { name: '七年級 上 Unit 0', path: 'g7_1_unit0.json', type: 'spelling' },
        { name: '七年級 上 Unit 1', path: 'g7_1_unit1.json', type: 'spelling' },
        { name: '七年級 上 Unit 2', path: 'g7_1_unit2.json', type: 'spelling' },
        { name: '七年級 上 Unit 3', path: 'g7_1_unit3.json', type: 'spelling' },
        { name: '七年級 上 Unit 3 (課文句型)', path: 'g7_1_unit3_s.json', type: 'sentence' },
        { name: '七年級 上 Unit 3 (文章翻譯)', path: 'g7_1_unit3_a.json', type: 'passage-translation' },
        { name: '七年級 上 Unit 4', path: 'g7_1_unit4.json', type: 'spelling' },
        { name: '七年級 上 Unit 5', path: 'g7_1_unit5.json', type: 'spelling' },
        { name: '七年級 上 Unit 6', path: 'g7_1_unit6.json', type: 'spelling' },
        */
        { name: '七年級 下 Unit 1', path: 'g7_2_unit1.json', type: 'spelling' },
        { name: '七年級 下 Unit 2', path: 'g7_2_unit2.json', type: 'spelling' },
        { name: '七年級 下 Unit 3', path: 'g7_2_unit3.json', type: 'spelling' },
        { name: '七年級 下 Unit 4', path: 'g7_2_unit4.json', type: 'spelling' },
        { name: '七年級 下 Unit 5', path: 'g7_2_unit5.json', type: 'spelling' },
        { name: '七年級 下 Unit 6', path: 'g7_2_unit6.json', type: 'spelling' },
    ];

    // --- 生命值設定 ---
    const MAX_HEALTH = 5;
    const HEALTH_REPLENISH_ROUNDS = [1, 2];

    // --- 成就系統定義 ---
    const GLOBAL_ACHIEVEMENTS = {
        PLATINUM: { name: '白金獎盃 🏆 ($150)', description: '在 3 個不同單元中，同時獲得「金牌」與「日積月累」成就', points: 150, progress: (stats) => { const platinumUnitCount = Object.keys(stats.unitData).filter(unitPath => { const goldProgress = UNIT_ACHIEVEMENTS.GOLD.progress(stats, unitPath); const streakProgress = UNIT_ACHIEVEMENTS.THREE_DAY_STREAK.progress(stats, unitPath); return (goldProgress.current >= goldProgress.target) && (streakProgress.current >= streakProgress.target); }).length; return { current: platinumUnitCount, target: 3 }; } },
        CULTIVATION_DEMON: { name: '修練狂魔 😈 ($150)', description: '累計在 15 個不同的日子裡完成過練習', points: 150, progress: (stats) => { const allTimestamps = Object.values(stats.unitData).flatMap(unit => unit.completionHistory || []); const uniqueDays = new Set(allTimestamps.map(ts => new Date(ts).toISOString().slice(0, 10))); return { current: uniqueDays.size, target: 15 }; } },
    };
    const UNIT_ACHIEVEMENTS = {
        BRONZE: { name: '銅牌 🥉 ($25)', description: '通關時扣心在 2 顆以內 完成本單元練習', points: 25, progress: (stats, unitPath) => ({ current: stats.unitData[unitPath]?.achievements.BRONZE ? 1 : 0, target: 1 }) },
        SILVER: { name: '銀牌 🥈 ($50)', description: '通關時扣心在 1 顆以內 完成本單元練習', points: 50, progress: (stats, unitPath) => ({ current: stats.unitData[unitPath]?.achievements.SILVER ? 1 : 0, target: 1 }) },
        GOLD: { name: '金牌 🥇 ($75)', description: '通關時未扣心 完成本單元練習', points: 75, progress: (stats, unitPath) => ({ current: stats.unitData[unitPath]?.achievements.GOLD ? 1 : 0, target: 1 }) },
        THREE_DAY_STREAK: { name: '日積月累 🏃 ($25)', description: '累計 3 天完成本單元練習', points: 25, progress: (stats, unitPath) => { const history = stats.unitData[unitPath]?.completionHistory || []; return { current: new Set(history.map(ts => new Date(ts).toISOString().slice(0, 10))).size, target: 3 }; } },
        THREE_WEEK_STREAK: { name: '週而復始 📅 ($50)', description: '累計 3 週完成本單元練習', points: 50, progress: (stats, unitPath) => { const history = stats.unitData[unitPath]?.completionHistory || []; return { current: new Set(history.map(ts => { const [year, week] = getWeekNumber(new Date(ts)); return `${year}-${String(week).padStart(2, '0')}`; })).size, target: 3 }; } },
        THREE_MONTH_STREAK: { name: '持之以恆 🗓️ ($75)', description: '累計 3 個月完成本單元練習', points: 75, progress: (stats, unitPath) => { const history = stats.unitData[unitPath]?.completionHistory || []; return { current: new Set(history.map(ts => new Date(ts).toISOString().slice(0, 7))).size, target: 3 }; } },
    };

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
    let gameMode = 'practice'; // 'practice', 'review', 'translation'
    let stageTotal = 0;
    let currentWord = null;
    let isCorrecting = false;
    let isWaitingForNextQuestion = false;
    let isWaitingForNextPassage = false;
    const REQUIRED_CORRECTIONS = 2;
    const synth = window.speechSynthesis;
    let isPlaying = false;
    let currentHealth;
    let hasLostHealthOnCurrentWord = false;

    // 句型狀態
    let sentencePool = [];
    let currentSentence = null;
    let hasLostHealthOnCurrentSentence = false;

    // 文章填空狀態
    let passagePool = [];
    let currentPassage = null; // This is actually the current question object
    let hasLostHealthOnCurrentQuestion = false;

    // --- 存儲 & 數據管理 ---
    function saveProgress() {
        localStorage.setItem('playerStats_v2', JSON.stringify(playerStats));
    }

    function loadProgress() {
        const savedStats = localStorage.getItem('playerStats_v2');
        if (savedStats) {
            playerStats = JSON.parse(savedStats);
            if (playerStats.totalPoints === undefined) playerStats.totalPoints = 0;
            if (playerStats.redemptionHistory === undefined) playerStats.redemptionHistory = [];
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
                showToast(ach.name);
            }
        }
    }

    function updateAchievementDisplay() {
        achievementListEl.innerHTML = '';
        const achievementModalTitle = document.querySelector('#achievement-modal h2');
        achievementModalTitle.textContent = `我的成就 (總點數: ${playerStats.totalPoints || 0})`;
        const globalHeader = document.createElement('h3');
        globalHeader.className = 'ach-section-header';
        globalHeader.textContent = '全域成就';
        achievementListEl.appendChild(globalHeader);
        for (const id in GLOBAL_ACHIEVEMENTS) {
            const ach = GLOBAL_ACHIEVEMENTS[id];
            const isUnlocked = playerStats.unlockedGlobalAchievements[id];
            const li = document.createElement('li');
            li.className = `achievement-item ${isUnlocked ? 'unlocked' : ''}`;
            let progressHTML = '';
            if (!isUnlocked && ach.progress) {
                const p = ach.progress(playerStats);
                const percent = p.target > 0 ? Math.min((p.current / p.target) * 100, 100) : 0;
                progressHTML = `<div class="ach-progress-text">(${p.current} / ${p.target})</div><div class="ach-progress-bar-container"><div class="ach-progress-bar" style="width: ${percent}%;"></div></div>`;
            }
            li.innerHTML = `<div class="ach-icon">${isUnlocked ? '🏆' : '🔒'}</div><div class="ach-text"><h3>${ach.name}</h3><p>${ach.description}</p>${progressHTML}</div>`;
            achievementListEl.appendChild(li);
        }
        const playedUnits = Object.keys(playerStats.unitData);
        playedUnits.forEach(unitPath => {
            const unitName = wordLists.find(w => w.path === unitPath)?.name || unitPath;
            const unitHeader = document.createElement('h3');
            unitHeader.className = 'ach-section-header';
            unitHeader.textContent = unitName;
            achievementListEl.appendChild(unitHeader);
            const unitData = playerStats.unitData[unitPath];
            for (const id in UNIT_ACHIEVEMENTS) {
                const ach = UNIT_ACHIEVEMENTS[id];
                const isUnlocked = unitData.achievements[id];
                const li = document.createElement('li');
                li.className = `achievement-item ${isUnlocked ? 'unlocked' : ''}`;
                let progressHTML = '';
                if (!isUnlocked && ach.progress) {
                    const p = ach.progress(playerStats, unitPath);
                    const percent = p.target > 0 ? Math.min((p.current / p.target) * 100, 100) : 0;
                    progressHTML = `<div class="ach-progress-text">(${p.current} / ${p.target})</div><div class="ach-progress-bar-container"><div class="ach-progress-bar" style="width: ${percent}%;"></div></div>`;
                }
                li.innerHTML = `<div class="ach-icon">${isUnlocked ? '🏆' : '🔒'}</div><div class="ach-text"><h3>${ach.name}</h3><p>${ach.description}</p>${progressHTML}</div>`;
                achievementListEl.appendChild(li);
            }
        });
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
            li.innerHTML = `<div class="history-item"><span class="history-date">${date}</span><span class="history-desc">${record.description}</span><span class="history-points">- ${record.points} 點</span></div>`;
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
        } catch (error) {
            alert(`載入單字失敗...\n${error.message}`);
            showStartScreen();
        }
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
        wordsToPractice = [...wordList].sort(() => Math.random() - 0.5);
        stageTotal = wordsToPractice.length;
        if (!synth) playAudioBtnEl.style.display = 'none';
        updateHealthDisplay();
        setupNextWord();
    }

    function setupNextWord() {
        if (wordsToPractice.length === 0) {
            if (wordsToReview.length > 0) {
                gameMode = 'review';
                wordsToPractice = [...wordsToReview].sort(() => Math.random() - 0.5);
                stageTotal = wordsToPractice.length;
                wordsToReview = [];
                feedbackEl.textContent = `第 ${roundCount} 回合結束！現在開始訂正錯題...`;
                feedbackEl.className = 'feedback-message notice';
            } else {
                // Successfully completed a round. Award points before moving to the next round or ending the game.
                if (activeGameMode === 'spelling') {
                    if (roundCount === 1) {
                        playerStats.totalPoints += 5;
                        showToast('完成第 1 回合，獲得 5 點！');
                        saveProgress();
                        updateTotalPointsDisplay();
                    } else if (roundCount === 2) {
                        playerStats.totalPoints += 5;
                        showToast('完成第 2 回合，獲得 5 點！');
                        saveProgress();
                        updateTotalPointsDisplay();
                    }
                }

                if (roundCount >= 3) {
                    // Award points for completing the final round right before the game ends.
                    if (activeGameMode === 'spelling' && roundCount === 3) {
                        playerStats.totalPoints += 10;
                        showToast('完成第 3 回合，獲得 10 點！');
                    }
                    gameOver(true);
                    return;
                }

                // Start next round
                gameMode = 'practice';
                roundCount++;
                wordsToPractice = [...wordList].sort(() => Math.random() - 0.5);
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
        if (gameMode === 'practice' && roundCount === 1) {
            translationEl.textContent = currentWord.chinese;
            exampleEl.textContent = currentWord.example.replace(new RegExp(currentWord.english, 'gi'), '_______');
            wordDisplayEl.textContent = currentWord.english.split(' ').map(w => w.length > 0 ? w[0] + '_'.repeat(w.length - 1) : '').join(' ');
        } else if (gameMode === 'practice' && roundCount === 2) {
            translationEl.textContent = currentWord.chinese;
            exampleEl.textContent = currentWord.example.replace(new RegExp(currentWord.english, 'gi'), '_______');
            wordDisplayEl.textContent = currentWord.english.replace(/\S/g, '_');
        } else {
            translationEl.textContent = '';
            exampleEl.textContent = currentWord.example.replace(new RegExp(currentWord.english, 'gi'), '_______');
            wordDisplayEl.textContent = '';
        }
        spellingInputEl.value = '';
        spellingInputEl.disabled = false;
        spellingInputEl.focus();
        setTimeout(playWordAudio, 100);
    }

    // --- 語音輔助函式 ---
    function getPreferredVoice() {
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

    // --- 翻譯填空遊戲邏輯 ---
    function initializeTranslationGame() {
        if (wordList.length === 0) return;
        gameMode = 'translation';
        wordsToReview = [];
        wordsWrongInSession.clear();
        currentStreak = 0;
        currentHealth = MAX_HEALTH;
        wordsToPractice = [...wordList].filter(item => item.english && item.chinese && item.english.split(' ').length > 3).sort(() => Math.random() - 0.5);
        stageTotal = wordsToPractice.length;
        if (stageTotal === 0) {
            alert('這個單元沒有適合進行翻譯練習的句子(長度 > 3)。');
            showStartScreen();
            return;
        }
        if (!synth) playAudioBtnEl.style.display = 'none';
        updateHealthDisplay();
        setupNextTranslationWord();
    }

    function setupNextTranslationWord() {
        isWaitingForNextQuestion = false;
        hasLostHealthOnCurrentWord = false;
        feedbackEl.textContent = '';
        exampleEl.textContent = '';
        checkTranslationBtn.style.display = 'inline-block';
        nextTranslationBtn.style.display = 'none';

        if (wordsToPractice.length === 0) {
            if (wordsToReview.length > 0) {
                gameMode = 'review';
                wordsToPractice = [...wordsToReview].sort(() => Math.random() - 0.5);
                stageTotal = wordsToPractice.length;
                wordsToReview = [];
                feedbackEl.textContent = `回合結束！現在開始訂正錯題...`;
                feedbackEl.className = 'feedback-message notice';
            } else {
                gameOver(true);
                return;
            }
        }

        const practicedInStage = stageTotal - wordsToPractice.length;
        const progressPercent = stageTotal > 0 ? (practicedInStage / stageTotal) * 100 : 0;
        progressBarEl.style.width = `${progressPercent}%`;
        roundDisplayEl.textContent = gameMode === 'review' ? '訂正時間' : '翻譯填空';
        progressBarEl.style.backgroundImage = gameMode === 'review' ? 'linear-gradient(45deg, var(--incorrect-color), #f56565)' : 'linear-gradient(45deg, #4299e1, #63b3ed)';

        currentWord = wordsToPractice.shift();
        
        const sentence = currentWord.english;
        const words = sentence.split(' ');

        let blanksCount = 1;
        if (words.length > 10) {
            blanksCount = 3;
        } else if (words.length > 5) {
            blanksCount = 2;
        }

        const nonCommonWords = words.map((word, index) => ({ word, index })).filter(item => item.word.length > 3 && !/^(the|and|but|for|not|you|are|was|were)$/i.test(item.word));
        let wordsToBlankInfo = [];
        let availableWords = [...nonCommonWords];
        for (let i = 0; i < blanksCount; i++) {
            if (availableWords.length === 0) break;
            const randomIndex = Math.floor(Math.random() * availableWords.length);
            wordsToBlankInfo.push(availableWords[randomIndex]);
            availableWords.splice(randomIndex, 1);
        }

        if (wordsToBlankInfo.length === 0 && words.length > 0) {
            const randomIndex = Math.floor(Math.random() * words.length);
            wordsToBlankInfo.push({ word: words[randomIndex], index: randomIndex });
        }
        
        wordsToBlankInfo.sort((a, b) => a.index - b.index);

        currentWord.answers = wordsToBlankInfo.map(info => info.word);
        const blankedIndexes = wordsToBlankInfo.map(info => info.index);

        wordDisplayEl.innerHTML = '';
        words.forEach((word, index) => {
            if (blankedIndexes.includes(index)) {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'translation-input';
                input.autocomplete = 'off';
                input.autocorrect = 'off';
                input.autocapitalize = 'off';
                input.spellcheck = false;
                wordDisplayEl.appendChild(input);
            } else {
                const span = document.createElement('span');
                span.textContent = word;
                span.className = 'translation-text';
                wordDisplayEl.appendChild(span);
            }
            wordDisplayEl.appendChild(document.createTextNode(' '));
        });

        playAudioBtnEl.style.display = synth ? 'block' : 'none';
        phoneticsEl.textContent = '';
        translationEl.textContent = currentWord.chinese;

        const firstInput = wordDisplayEl.querySelector('.translation-input');
        if (firstInput) {
            firstInput.focus();
        }
        
        setTimeout(playWordAudio, 100);
    }

    function checkTranslationAnswer() {
        const inputs = Array.from(wordDisplayEl.querySelectorAll('.translation-input'));
        const userAnswers = inputs.map(input => input.value.trim());
        const correctAnswers = currentWord.answers;
        let allCorrect = true;

        userAnswers.forEach((userAnswer, index) => {
            const cleanCorrectAnswer = correctAnswers[index].replace(/[.,?!;:]+$/, "");
            const cleanUserAnswer = userAnswer.replace(/[.,?!;:]+$/, "");
            const inputEl = inputs[index];

            if (cleanUserAnswer.toLowerCase() === cleanCorrectAnswer.toLowerCase()) {
                inputEl.classList.remove('input-incorrect');
                inputEl.classList.add('input-correct');
                inputEl.disabled = true;
            } else {
                inputEl.classList.add('input-incorrect');
                allCorrect = false;
            }
        });

        if (allCorrect) {
            feedbackEl.textContent = '正確！ 按 Enter 進入下一題...';
            feedbackEl.className = 'feedback-message correct';
            flashOverlayEl.classList.add('flash-correct');
            setTimeout(() => { flashOverlayEl.classList.remove('flash-correct'); }, 600);
            
            currentStreak++;
            playerStats.globalStats.totalWordsCorrect++;
            if (currentStreak > playerStats.globalStats.longestStreak) playerStats.globalStats.longestStreak = currentStreak;
            checkGlobalAchievements();
            saveProgress();
            
            checkTranslationBtn.style.display = 'none';
            nextTranslationBtn.style.display = 'inline-block';
            isWaitingForNextQuestion = true;
        } else {
            feedbackEl.textContent = '部分答案不正確，請修正紅色框內的答案。';
            exampleEl.textContent = `正確句子: ${currentWord.english}`;
            feedbackEl.className = 'feedback-message incorrect';
            
            if (!hasLostHealthOnCurrentWord) {
                currentHealth--;
                updateHealthDisplay();
                wordsWrongInSession.add(currentWord.english);
                if (!wordsToReview.some(w => w.english === currentWord.english)) {
                    wordsToReview.push(currentWord);
                }
                hasLostHealthOnCurrentWord = true;
            }

            if (currentHealth <= 0) {
                gameOver(false);
            }
        }
    }

    function playWordAudio() {
        if (isPlaying || !currentWord || !synth) return;
        synth.cancel();
        let textToSpeak = '';
        
        if (activeGameMode === 'spelling') {
            const word = currentWord.english.split('(')[0].trim();
            const example = currentWord.example;
            if (gameMode === 'practice') {
                if (roundCount === 1) textToSpeak = `${word}. ${example}`;
                else if (roundCount === 2) textToSpeak = word;
                else textToSpeak = example;
            } else { // review mode
                textToSpeak = word;
            }
        } else if (activeGameMode === 'translation') {
            textToSpeak = currentWord.english;
        }

        if (!textToSpeak) return;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        const preferredVoice = getPreferredVoice();
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.onstart = () => { isPlaying = true; playAudioBtnEl.disabled = true; };
        utterance.onend = () => { isPlaying = false; playAudioBtnEl.disabled = false; };
        utterance.onerror = (event) => { console.error('語音合成發生錯誤:', event); isPlaying = false; playAudioBtnEl.disabled = false; };
        synth.speak(utterance);
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
            feedbackEl.textContent = `錯誤！你輸入的是 "${answer}"，正確答案是: ${cleanCorrectAnswer} (請照著輸入 ${REQUIRED_CORRECTIONS} 次)`;
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

    // --- 句型遊戲邏輯 ---
    function initializeSentenceGame() {
        sentencePool = wordList
            .map(item => ({ hint: item.chinese, sentence: item.english }))
            .filter(item => {
                const cleanedSentence = (item.sentence || '').replace(/<[^>]*>/g, '').trim();
                const wordCount = cleanedSentence.split(' ').length;
                return wordCount >= 2 && wordCount <= 20;
            })
            .sort(() => Math.random() - 0.5);
        
        if (sentencePool.length === 0) {
            alert('這個單元沒有適合進行句型練習的句子。');
            showStartScreen();
            return;
        }
        
        currentHealth = MAX_HEALTH;
        wordsWrongInSession.clear();
        updateHealthDisplay();
        setupNextSentence();
    }

    function playSentenceAudio() {
        if (isPlaying || !currentSentence || !synth) return;
        synth.cancel();
        const textToSpeak = currentSentence.sentence;
        if (!textToSpeak) return;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        const preferredVoice = getPreferredVoice();
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.onstart = () => { isPlaying = true; playSentenceAudioBtn.disabled = true; };
        utterance.onend = () => { isPlaying = false; playSentenceAudioBtn.disabled = false; };
        utterance.onerror = (event) => {
            console.error('語音合成發生錯誤:', event);
            isPlaying = false;
            playSentenceAudioBtn.disabled = false;
        };
        synth.speak(utterance);
    }

    function setupNextSentence() {
        hasLostHealthOnCurrentSentence = false;
        if (sentencePool.length === 0) {
            // Call gameOver(true) for sentence mode completion
            gameOver(true);
            return;
        }
        currentSentence = sentencePool.pop();
        const cleanedSentence = (currentSentence.sentence || '').replace(/[.,?]/g, '');
        const words = cleanedSentence.split(' ').filter(w => w && !w.includes(':'));
        if (words.length < 2) { setupNextSentence(); return; }
        const shuffledWords = [...words].sort(() => Math.random() - 0.5);
        sentenceHintEl.textContent = `${currentSentence.hint}`;
        sentenceAnswerAreaEl.innerHTML = '';
        sentenceWordBankEl.innerHTML = '';
        sentenceFeedbackEl.textContent = '';
        checkSentenceBtn.style.display = 'block';
        nextSentenceBtn.style.display = 'none';
        playSentenceAudioBtn.style.display = synth ? 'block' : 'none';

        shuffledWords.forEach(word => {
            const wordEl = document.createElement('div');
            wordEl.textContent = word;
            wordEl.className = 'word-block';
            wordEl.addEventListener('click', () => moveWord(wordEl));
            sentenceWordBankEl.appendChild(wordEl);
        });
        
        setTimeout(playSentenceAudio, 100);
    }

    function moveWord(wordEl) {
        if (wordEl.parentElement === sentenceWordBankEl) {
            sentenceAnswerAreaEl.appendChild(wordEl);
        } else {
            sentenceWordBankEl.appendChild(wordEl);
        }
    }

    function checkSentence() {
        const answerWords = Array.from(sentenceAnswerAreaEl.children).map(el => el.textContent);
        const userAnswer = answerWords.join(' ').toLowerCase();
        const correctAnswer = (currentSentence.sentence || '').replace(/[.,?]/g, '').split(' ').filter(w => w && !w.includes(':')).join(' ').toLowerCase();
        if (userAnswer === correctAnswer) {
            sentenceFeedbackEl.textContent = '正確！';
            sentenceFeedbackEl.className = 'feedback-message correct';
            checkSentenceBtn.style.display = 'none';
            nextSentenceBtn.style.display = 'block';
            const finalSentence = document.createElement('div');
            finalSentence.className = 'word-block';
            finalSentence.style.cursor = 'default';
            finalSentence.style.backgroundColor = 'var(--bg-color)';
            finalSentence.textContent = currentSentence.sentence;
            sentenceAnswerAreaEl.innerHTML = '';
            sentenceAnswerAreaEl.appendChild(finalSentence);
        } else {
            sentenceFeedbackEl.innerHTML = `不正確，請再試一次。<br>正確答案是: <strong>${currentSentence.sentence}</strong>`;
            sentenceFeedbackEl.className = 'feedback-message incorrect';

            if (!hasLostHealthOnCurrentSentence) {
                currentHealth--;
                updateHealthDisplay();
                wordsWrongInSession.add(currentSentence.sentence);
                hasLostHealthOnCurrentSentence = true;
            }

            if (currentHealth <= 0) {
                sentenceFeedbackEl.innerHTML = `生命值耗盡！<br>正確答案是: <strong>${currentSentence.sentence}</strong>`;
                checkSentenceBtn.style.display = 'none';
                nextSentenceBtn.style.display = 'none';
                setTimeout(() => gameOver(false), 2000);
            }
        }
    }

    // --- 文章填空遊戲邏輯 ---
    function playPassageAudio() {
        if (isPlaying || !currentPassage || !synth) return;
        synth.cancel();
        const textToSpeak = currentPassage.fullEnglish;
        if (!textToSpeak) return;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        const preferredVoice = getPreferredVoice();
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.onstart = () => { isPlaying = true; playPassageAudioBtn.disabled = true; };
        utterance.onend = () => { isPlaying = false; playPassageAudioBtn.disabled = false; };
        utterance.onerror = (event) => {
            console.error('語音合成發生錯誤:', event);
            isPlaying = false;
            playPassageAudioBtn.disabled = false;
        };
        synth.speak(utterance);
    }

    function initializePassageFillGame() {
        const passages = wordList.reduce((acc, item) => {
            if (!acc[item.passage]) {
                acc[item.passage] = [];
            }
            acc[item.passage].push(item);
            return acc;
        }, {});

        const questionPool = [];
        for (const passageNum in passages) {
            const sentences = passages[passageNum].sort((a, b) => a.sort - b.sort);
            sentences.forEach((sentence, index) => {
                if (sentence.cloze) {
                    questionPool.push({
                        contextSentences: sentences,
                        blankIndex: index,
                        answer: sentence.cloze,
                        hint: sentence.chinese,
                        fullEnglish: sentence.english
                    });
                }
            });
        }

        passagePool = questionPool.sort(() => Math.random() - 0.5);
        currentHealth = MAX_HEALTH;
        wordsWrongInSession.clear();
        updateHealthDisplay();

        if (passagePool.length === 0) {
            alert('這個單元沒有適合進行文章填空練習的內容 (缺少 "cloze" 屬性)。');
            showStartScreen();
            return;
        }
        setupNextPassageFill();
    }

    function setupNextPassageFill() {
        if (passagePool.length === 0) {
            // Since there's no separate review round, we consider the game won.
            gameOver(true); 
            return;
        }
        currentPassage = passagePool.shift();
        hasLostHealthOnCurrentQuestion = false;
        isWaitingForNextPassage = false;

        passageEnglishDisplayEl.innerHTML = '';
        currentPassage.contextSentences.forEach((sentence, index) => {
            const sentenceEl = document.createElement('div');
            sentenceEl.className = 'passage-sentence';

            if (index === currentPassage.blankIndex) {
                sentenceEl.classList.add('blank');
                
                const hintEl = document.createElement('p');
                hintEl.className = 'passage-hint';
                hintEl.textContent = `提示: ${currentPassage.hint}`;
                
                const clozeText = currentPassage.answer;
                const fullText = currentPassage.fullEnglish;
                const parts = fullText.split(clozeText);

                const lineContainer = document.createElement('div');
                lineContainer.className = 'passage-line-container';
                
                const inputEl = document.createElement('input');
                inputEl.type = 'text';
                inputEl.className = 'passage-fill-input';
                inputEl.placeholder = '請填寫此處';
                inputEl.style.width = `${Math.max(clozeText.length * 0.9, 15)}ch`;

                lineContainer.appendChild(document.createTextNode(parts[0]));
                lineContainer.appendChild(inputEl);
                lineContainer.appendChild(document.createTextNode(parts[1]));

                sentenceEl.appendChild(lineContainer);
                sentenceEl.appendChild(hintEl);

            } else {
                sentenceEl.textContent = sentence.english;
            }
            passageEnglishDisplayEl.appendChild(sentenceEl);
        });

        passageFeedbackDisplayEl.innerHTML = '';
        checkPassageBtn.style.display = 'block';
        nextPassageBtn.style.display = 'none';
        playPassageAudioBtn.style.display = synth ? 'block' : 'none';
        
        const input = passageEnglishDisplayEl.querySelector('.passage-fill-input');
        if (input) input.focus();

        setTimeout(playPassageAudio, 100);
    }

    function checkPassageFill() {
        const inputEl = passageEnglishDisplayEl.querySelector('.passage-fill-input');
        if (!inputEl || isWaitingForNextPassage) return;

        const userAnswer = inputEl.value.trim();
        const correctAnswer = currentPassage.answer;
        
        const cleanUserAnswer = userAnswer.replace(/[.,?!;:]/g, '').replace(/\s/g, '').toLowerCase();
        const cleanCorrectAnswer = correctAnswer.replace(/[.,?!;:]/g, '').replace(/\s/g, '').toLowerCase();

        if (cleanUserAnswer === cleanCorrectAnswer) {
            passageFeedbackDisplayEl.innerHTML = '正確！ <span class="enter-hint">按 Enter 繼續...</span>';
            passageFeedbackDisplayEl.className = 'feedback-message correct';
            
            const lineContainer = inputEl.parentElement;
            lineContainer.innerHTML = currentPassage.fullEnglish;

            checkPassageBtn.style.display = 'none';
            nextPassageBtn.style.display = 'block';
            nextPassageBtn.textContent = '下一題';
            nextPassageBtn.onclick = setupNextPassageFill;
            isWaitingForNextPassage = true;

        } else {
            passageFeedbackDisplayEl.innerHTML = `不正確，請修正紅色框內的答案。<br>正確答案是: <strong>${currentPassage.answer}</strong>`;
            passageFeedbackDisplayEl.className = 'feedback-message incorrect';
            inputEl.classList.add('input-incorrect');
            setTimeout(() => inputEl.classList.remove('input-incorrect'), 600);

            if (!hasLostHealthOnCurrentQuestion) {
                currentHealth--;
                updateHealthDisplay();
                wordsWrongInSession.add(currentPassage.answer);
                hasLostHealthOnCurrentQuestion = true;
            }

            if (currentHealth <= 0) {
                passageFeedbackDisplayEl.innerHTML = `生命值耗盡！<br>正確答案是: <strong>${currentPassage.answer}</strong>`;
                checkPassageBtn.style.display = 'none';
                nextPassageBtn.style.display = 'none';
                setTimeout(() => gameOver(false), 2000);
            }
        }
    }


    // --- 通用遊戲邏輯 ---
    function gameOver(isSuccess) {
        const unitPath = currentWordListPath;
        const unitName = currentWordListName;
        
        if (isSuccess) {
            // Achievement tracking and history for spelling mode only
            if (activeGameMode === 'spelling') {
                if (!playerStats.unitData[unitPath]) {
                    playerStats.unitData[unitPath] = { achievements: {}, completionHistory: [] };
                } else if (!playerStats.unitData[unitPath].completionHistory) {
                    playerStats.unitData[unitPath].completionHistory = [];
                }
                playerStats.unitData[unitPath].completionHistory.push(Date.now());

                const unlockedInSession = [];
                if (currentHealth === MAX_HEALTH) {
                    if (!playerStats.unitData[unitPath].achievements.GOLD) { playerStats.totalPoints += UNIT_ACHIEVEMENTS.GOLD.points; unlockedInSession.push(UNIT_ACHIEVEMENTS.GOLD.name); playerStats.unitData[unitPath].achievements.GOLD = true; }
                }
                if (currentHealth >= (MAX_HEALTH - 1)) {
                    if (!playerStats.unitData[unitPath].achievements.SILVER) { playerStats.totalPoints += UNIT_ACHIEVEMENTS.SILVER.points; unlockedInSession.push(UNIT_ACHIEVEMENTS.SILVER.name); playerStats.unitData[unitPath].achievements.SILVER = true; }
                }
                if (currentHealth >= (MAX_HEALTH - 2)) {
                    if (!playerStats.unitData[unitPath].achievements.BRONZE) { playerStats.totalPoints += UNIT_ACHIEVEMENTS.BRONZE.points; unlockedInSession.push(UNIT_ACHIEVEMENTS.BRONZE.name); playerStats.unitData[unitPath].achievements.BRONZE = true; }
                }
                checkStreakAchievements(unitPath, unlockedInSession);
                if(unlockedInSession.length > 0) showToast(`在 ${unitName} 中解鎖: ${unlockedInSession.join(', ')}`);
                
                checkGlobalAchievements(); // Global achievements are still checked for spelling mode completions
                completionContainer.querySelector('.start-title').textContent = '恭喜通關！';
                completionContainer.querySelector('p').textContent = '你已完成本單元的所有練習。';
            } else if (['translation', 'passage-translation', 'sentence'].includes(activeGameMode)) {
                // Reward for non-spelling modes
                playerStats.totalPoints += 10;
                showToast('完成練習，獲得 10 點獎勵！');
                completionContainer.querySelector('.start-title').textContent = '恭喜完成練習！';
                completionContainer.querySelector('p').textContent = '你已完成本單元的練習，獲得 10 點獎勵。';
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
                        unlockedInSession.push(ach.name);
                    }
                }
            }
        }
    }

    function showStartScreen() {
        gameContainer.style.display = 'none';
        completionContainer.style.display = 'none';
        achievementContainer.style.display = 'none';
        sentenceContainer.style.display = 'none';
        passageTranslationContainer.style.display = 'none';
        startContainer.style.display = 'flex';
        
        translationControls.style.display = 'none';
        spellingFormEl.style.display = 'none';

        wordListSelectEl.disabled = true;
        wordListSelectEl.innerHTML = '<option value="">請先選擇模式</option>';
        startGameBtn.disabled = true;
        modeBtnSpelling.classList.remove('mode-selected');
        modeBtnSentence.classList.remove('mode-selected');
        modeBtnTranslation.classList.remove('mode-selected');
        modeBtnPassageTranslation.classList.remove('mode-selected');
        updateTotalPointsDisplay();
    }

    function updateTotalPointsDisplay() {
        const pointsDisplay = document.getElementById('total-points-display');
        if (pointsDisplay) pointsDisplay.textContent = playerStats.totalPoints || 0;
    }

    function updateHealthDisplay() {
        const healthDisplays = document.querySelectorAll('.health-display');
        healthDisplays.forEach(displayEl => {
            displayEl.innerHTML = '';
            for (let i = 0; i < MAX_HEALTH; i++) {
                const heartSpan = document.createElement('span');
                heartSpan.classList.add('heart');
                heartSpan.textContent = '❤️';
                if (i < currentHealth) {
                    heartSpan.classList.add('full');
                }
                displayEl.appendChild(heartSpan);
            }
        });
    }

    // --- 新的啟動流程 ---
    function updateWordListDropdown(selectedMode) {
        wordListSelectEl.innerHTML = '';
        // For translation mode, we use 'sentence' type lists
        const typeToFilter = selectedMode === 'translation' ? 'sentence' : selectedMode;
        const filteredLists = wordLists.filter(list => list.type === typeToFilter);
        
        if (filteredLists.length === 0) {
            const option = document.createElement('option');
            option.textContent = '此模式無可用單元';
            wordListSelectEl.appendChild(option);
            wordListSelectEl.disabled = true;
            startGameBtn.disabled = true;
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
    }

    async function startGame() {
        currentWordListPath = wordListSelectEl.value;
        currentWordListName = wordListSelectEl.options[wordListSelectEl.selectedIndex].text;

        if (!playerStats.unitData[currentWordListPath]) {
            playerStats.unitData[currentWordListPath] = { achievements: {}, completionHistory: [] };
            saveProgress();
        }

        await loadWords(currentWordListPath);

        startContainer.style.display = 'none';
        if (activeGameMode === 'spelling') {
            spellingFormEl.style.display = 'block';
            translationControls.style.display = 'none';
            gameContainer.style.display = 'block';
            initializeGame();
        } else if (activeGameMode === 'sentence') {
            sentenceContainer.style.display = 'block';
            initializeSentenceGame();
        } else if (activeGameMode === 'translation') {
            spellingFormEl.style.display = 'none';
            translationControls.style.display = 'block';
            gameContainer.style.display = 'block';
            initializeTranslationGame();
        } else if (activeGameMode === 'passage-translation') {
            passageTranslationContainer.style.display = 'block';
            initializePassageFillGame();
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
            modeBtnSentence.classList.remove('mode-selected');
            modeBtnTranslation.classList.remove('mode-selected');
            modeBtnPassageTranslation.classList.remove('mode-selected');
            updateWordListDropdown('spelling');
        });

        modeBtnSentence.addEventListener('click', () => {
            activeGameMode = 'sentence';
            modeBtnSentence.classList.add('mode-selected');
            modeBtnSpelling.classList.remove('mode-selected');
            modeBtnTranslation.classList.remove('mode-selected');
            modeBtnPassageTranslation.classList.remove('mode-selected');
            updateWordListDropdown('sentence');
        });

        modeBtnTranslation.addEventListener('click', () => {
            activeGameMode = 'translation';
            modeBtnTranslation.classList.add('mode-selected');
            modeBtnSpelling.classList.remove('mode-selected');
            modeBtnSentence.classList.remove('mode-selected');
            modeBtnPassageTranslation.classList.remove('mode-selected');
            updateWordListDropdown('translation');
        });

        modeBtnPassageTranslation.addEventListener('click', () => {
            activeGameMode = 'passage-translation';
            modeBtnPassageTranslation.classList.add('mode-selected');
            modeBtnSpelling.classList.remove('mode-selected');
            modeBtnSentence.classList.remove('mode-selected');
            modeBtnTranslation.classList.remove('mode-selected');
            updateWordListDropdown('passage-translation');
        });

        startGameBtn.addEventListener('click', startGame);

        spellingFormEl.addEventListener('submit', handleSpellingSubmission);
        playAudioBtnEl.addEventListener('click', playWordAudio);

        // 全域 Enter 鍵處理
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;

            if (activeGameMode === 'translation') {
                if (isWaitingForNextQuestion) {
                    e.preventDefault();
                    setupNextTranslationWord();
                } else if (document.activeElement.classList.contains('translation-input')) {
                    e.preventDefault();
                    checkTranslationAnswer();
                }
            } else if (activeGameMode === 'passage-translation') {
                if (isWaitingForNextPassage) {
                    e.preventDefault();
                    setupNextPassageFill();
                } else if (document.activeElement.classList.contains('passage-fill-input')) {
                    e.preventDefault();
                    checkPassageFill();
                }
            }
        });

        checkTranslationBtn.addEventListener('click', checkTranslationAnswer);
        nextTranslationBtn.addEventListener('click', setupNextTranslationWord);

        restartBtn.addEventListener('click', () => {
            completionContainer.style.display = 'none';
            if (activeGameMode === 'spelling') {
                gameContainer.style.display = 'block';
                initializeGame();
            } else if (activeGameMode === 'translation') {
                gameContainer.style.display = 'block';
                initializeTranslationGame();
            } else if (activeGameMode === 'sentence') {
                sentenceContainer.style.display = 'block';
                initializeSentenceGame();
            } else if (activeGameMode === 'passage-translation') {
                passageTranslationContainer.style.display = 'block';
                initializePassageFillGame();
            }
        });

        backToMenuBtn.addEventListener('click', showStartScreen);

        // 句型遊戲按鈕
        checkSentenceBtn.addEventListener('click', checkSentence);
        nextSentenceBtn.addEventListener('click', setupNextSentence);
        playSentenceAudioBtn.addEventListener('click', playSentenceAudio);

        // 文章填空按鈕
        checkPassageBtn.addEventListener('click', checkPassageFill);
        nextPassageBtn.addEventListener('click', setupNextPassageFill);
        playPassageAudioBtn.addEventListener('click', playPassageAudio);

        // 成就和兌換按鈕
        showAchievementsBtn.addEventListener('click', () => { updateAchievementDisplay(); achievementContainer.style.display = 'flex'; });
        closeAchievementsBtn.addEventListener('click', () => { achievementContainer.style.display = 'none'; });
        showRedemptionsBtn.addEventListener('click', () => { renderRedemptionHistory(); redemptionContainer.style.display = 'flex'; });
        closeRedemptionsBtn.addEventListener('click', () => { redemptionContainer.style.display = 'none'; });
        redemptionForm.addEventListener('submit', handleManualRedeem);

    }

    main();
});
