document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素 ---
    const startContainer = document.getElementById('start-container');
    const gameContainer = document.getElementById('game-container');
    const completionContainer = document.getElementById('completion-container');
    const achievementContainer = document.getElementById('achievement-container');

    const startGameBtn = document.getElementById('start-game-btn');
    const wordListSelectEl = document.getElementById('word-list-select');
    
    const wordDisplayEl = document.getElementById('current-word-display');
    const translationEl = document.getElementById('translation-display');
    const phoneticsEl = document.getElementById('phonetics-display');
    const exampleEl = document.getElementById('example-display');
    const spellingFormEl = document.getElementById('spelling-form');
    const spellingInputEl = document.getElementById('spelling-input');
    const feedbackEl = document.getElementById('feedback-message');
    const playAudioBtnEl = document.getElementById('play-audio-btn');
    const progressBarEl = document.getElementById('progress-bar');
    const roundDisplayEl = document.getElementById('round-display');

    const restartBtn = document.getElementById('restart-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');

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

    // --- 字庫設定 ---
    const wordLists = [
        { name: '小五上 Unit 1', path: 'g5_1_unit1.json' },
        { name: '國一上 Unit 0', path: 'g7_1_unit0.json' },
        { name: '國一上 Unit 1', path: 'g7_1_unit1.json' },
        { name: '國一上 Unit 2', path: 'g7_1_unit2.json' },
        { name: '國一上 Unit 3', path: 'g7_1_unit3.json' },
        { name: '國一上 Unit 4', path: 'g7_1_unit4.json' },
        { name: '國一上 Unit 5', path: 'g7_1_unit5.json' },
        { name: '國一上 Unit 6', path: 'g7_1_unit6.json' },
    ];

    // --- 成就系統定義 ---
    const GLOBAL_ACHIEVEMENTS = {

        PLATINUM: {
            name: '白金獎盃 🏆 ($150)',
            description: '在 3 個不同單元中，同時獲得「金牌」與「日積月累」成就',
            points: 150,
            progress: (stats) => {
                const platinumUnitCount = Object.values(stats.unitData).filter(unit => unit.achievements.GOLD && unit.achievements.THREE_DAY_STREAK).length;
                return { current: platinumUnitCount, target: 3 };
            }
        },
        CULTIVATION_DEMON: {
            name: '修練狂魔 😈 ($150)',
            description: '沉迷於修練，累計在 15 個不同的日子裡完成過練習',
            points: 150,
            progress: (stats) => {
                const allTimestamps = Object.values(stats.unitData).flatMap(unit => unit.completionHistory);
                const uniqueDays = new Set(allTimestamps.map(ts => new Date(ts).toISOString().slice(0, 10)));
                return { current: uniqueDays.size, target: 15 };
            }
        },
    };
    const UNIT_ACHIEVEMENTS = {
        BRONZE: { name: '銅牌 🥉 ($25)', description: '以 3 個或以下的錯誤數完成本單元練習', points: 25 },
        SILVER: { name: '銀牌 🥈 ($50)', description: '以 2 個或以下的錯誤數完成本單元練習', points: 50 },
        GOLD: { name: '金牌 🥇 ($75)', description: '以 1 個或以下的錯誤數完成本單元練習', points: 75 },
        THREE_DAY_STREAK: { name: '日積月累 🏃 ($25)', description: '累計 3 天完成本單元練習', points: 25 },
        THREE_WEEK_STREAK: { name: '週而復始 📅 ($50)', description: '累計 3 週完成本單元練習', points: 50 },
        THREE_MONTH_STREAK: { name: '持之以恆 🗓️ ($75)', description: '累計 3 個月完成本單元練習', points: 75 },
    };

    // --- 遊戲 & 玩家狀態 ---
    let playerStats;
    let wordList = [];
    let currentWordListPath = '';
    let currentWordListName = '';
    let roundCount = 1;
    let wordsToPractice = [];
    let wordsToReview = [];
    let wordsWrongInSession = new Set();
    let currentStreak = 0;
    let gameMode = 'practice';
    let stageTotal = 0;
    let currentWord = null;
    let isCorrecting = false;
    let correctionCount = 0;
    const REQUIRED_CORRECTIONS = 2;
    const synth = window.speechSynthesis;
    let isPlaying = false;

    // --- 存儲 & 數據管理 ---
    function saveProgress() {
        localStorage.setItem('playerStats_v2', JSON.stringify(playerStats));
    }

    function loadProgress() {
        const savedStats = localStorage.getItem('playerStats_v2');
        if (savedStats) {
            playerStats = JSON.parse(savedStats);
            if (playerStats.totalPoints === undefined) {
                playerStats.totalPoints = 0;
            }
            if (playerStats.redemptionHistory === undefined) { // 確保舊存檔相容
                playerStats.redemptionHistory = [];
            }
        } else {
            playerStats = {
                totalPoints: 0,
                unitData: {},
                globalStats: {
                    totalWordsCorrect: 0,
                    longestStreak: 0,
                },
                unlockedGlobalAchievements: {},
                redemptionHistory: [], // 新增欄位
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

            let unlocked = false;

            if (id === 'PLATINUM') {
                const platinumUnitCount = Object.values(stats.unitData).filter(unit => unit.achievements.GOLD && unit.achievements.THREE_DAY_STREAK).length;
                if (platinumUnitCount >= 3) {
                    unlocked = true;
                }
            }
            if (id === 'CULTIVATION_DEMON') {
                const allTimestamps = Object.values(stats.unitData).flatMap(unit => unit.completionHistory);
                const uniqueDays = new Set(allTimestamps.map(ts => new Date(ts).toISOString().slice(0, 10)));
                if (uniqueDays.size >= 15) {
                    unlocked = true;
                }
            }

            if (unlocked) {
                stats.totalPoints += GLOBAL_ACHIEVEMENTS[id].points;
                stats.unlockedGlobalAchievements[id] = true;
                showToast(GLOBAL_ACHIEVEMENTS[id].name);
            }
        }
    }

    function updateAchievementDisplay() {
        achievementListEl.innerHTML = '';
        const achievementModalTitle = document.querySelector('#achievement-modal h2');
        achievementModalTitle.textContent = `我的成就 (總點數: ${playerStats.totalPoints || 0})`;

        // Render Global Achievements
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
                progressHTML = `
                    <div class="ach-progress-text">(${p.current} / ${p.target})</div>
                    <div class="ach-progress-bar-container">
                        <div class="ach-progress-bar" style="width: ${percent}%;"></div>
                    </div>
                `;
            }

            li.innerHTML = `
                <div class="ach-icon">${isUnlocked ? '🏆' : '🔒'}</div>
                <div class="ach-text">
                    <h3>${ach.name}</h3>
                    <p>${ach.description}</p>
                    ${progressHTML}
                </div>
            `;
            achievementListEl.appendChild(li);
        }

        // Render Unit-Specific Achievements
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
                
                let progressHTML = ''; // Default to no progress bar

                // If it's a cumulative achievement and not unlocked, calculate and generate the progress bar
                if (!isUnlocked && (id === 'THREE_DAY_STREAK' || id === 'THREE_WEEK_STREAK' || id === 'THREE_MONTH_STREAK')) {
                    let currentProgress = 0;
                    const history = playerStats.unitData[unitPath]?.completionHistory || [];
                    
                    if (id === 'THREE_DAY_STREAK') {
                        currentProgress = new Set(history.map(ts => new Date(ts).toISOString().slice(0, 10))).size;
                    } else if (id === 'THREE_WEEK_STREAK') {
                        currentProgress = new Set(history.map(ts => {
                            const [year, week] = getWeekNumber(new Date(ts));
                            return `${year}-${String(week).padStart(2, '0')}`;
                        })).size;
                    } else if (id === 'THREE_MONTH_STREAK') {
                        currentProgress = new Set(history.map(ts => new Date(ts).toISOString().slice(0, 7))).size;
                    }

                    const targetProgress = 3;
                    const percent = targetProgress > 0 ? Math.min((currentProgress / targetProgress) * 100, 100) : 0;
                    
                    progressHTML = `
                        <div class="ach-progress-text">(${currentProgress} / ${targetProgress})</div>
                        <div class="ach-progress-bar-container">
                            <div class="ach-progress-bar" style="width: ${percent}%;"></div>
                        </div>
                    `;
                }

                li.innerHTML = `
                    <div class="ach-icon">${isUnlocked ? '🏆' : '🔒'}</div>
                    <div class="ach-text">
                        <h3>${ach.name}</h3>
                        <p>${ach.description}</p>
                        ${progressHTML}
                    </div>
                `;
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
            li.innerHTML = `
                <div class="history-item">
                    <span class="history-date">${date}</span>
                    <span class="history-desc">${record.description}</span>
                    <span class="history-points">- ${record.points} 點</span>
                </div>
            `;
            redemptionHistoryList.appendChild(li);
        });
    }

    function handleManualRedeem(event) {
        event.preventDefault();

        const pointsToRedeem = parseInt(redeemPointsInput.value, 10);
        const description = redeemDescInput.value;

        if (isNaN(pointsToRedeem) || pointsToRedeem <= 0) {
            alert('請輸入一個有效的正數點數！');
            return;
        }
        if (playerStats.totalPoints < pointsToRedeem) {
            alert('點數不足！');
            return;
        }
        if (!description.trim()) {
            alert('請填寫兌換說明！');
            return;
        }

        // 新增再次確認視窗
        const confirmationMessage = `您確定要花費 ${pointsToRedeem} 點來兌換「${description}」嗎？`;
        if (window.confirm(confirmationMessage)) {
            playerStats.totalPoints -= pointsToRedeem;
            playerStats.redemptionHistory.unshift({
                points: pointsToRedeem,
                description: description,
                timestamp: Date.now()
            });

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
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`無法讀取 ${filePath}: ${response.statusText}`);
            // 直接將回應解析為 JSON
            wordList = await response.json(); 
            if (!Array.isArray(wordList) || wordList.length === 0) {
                throw new Error("單字列表為空或格式錯誤。");
            }
        } catch (error) {
            alert(`載入單字失敗，請檢查 ${filePath} 檔案是否存在且格式正確。\n${error.message}`);
            showStartScreen();
        }
    }

    function initializeGame() {
        if (wordList.length === 0) return;
        roundCount = 1;
        gameMode = 'practice';
        wordsToReview = [];
        wordsWrongInSession.clear();
        currentStreak = 0;
        wordsToPractice = [...wordList].sort(() => Math.random() - 0.5);
        stageTotal = wordsToPractice.length;
        if (!synth) playAudioBtnEl.style.display = 'none';
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
                if (roundCount >= 3) {
                    endGame();
                    return;
                }
                gameMode = 'practice';
                roundCount++;
                wordsToPractice = [...wordList].sort(() => Math.random() - 0.5);
                stageTotal = wordsToPractice.length;
                feedbackEl.textContent = `太棒了！第 ${roundCount} 回合開始！`;
                feedbackEl.className = 'feedback-message notice';
            }
        }

        const practicedInStage = stageTotal - wordsToPractice.length;
        const progressPercent = stageTotal > 0 ? (practicedInStage / stageTotal) * 100 : 0;
        progressBarEl.style.width = `${progressPercent}%`;
        
        roundDisplayEl.textContent = gameMode === 'review' ? `訂正時間` : `第 ${roundCount} 回合`;
        progressBarEl.style.backgroundImage = gameMode === 'review' 
            ? 'linear-gradient(45deg, var(--incorrect-color), #f56565)'
            : 'linear-gradient(45deg, var(--correct-color), #68d391)';

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
            // 第三回合及以後：只提供例句作為提示，不提供底線
            translationEl.textContent = '';
            exampleEl.textContent = currentWord.example.replace(new RegExp(currentWord.english, 'gi'), '_______');
            wordDisplayEl.textContent = ''; // 移除底線字數提示
        }
        
        spellingInputEl.value = '';
        spellingInputEl.disabled = false;
        spellingInputEl.focus();
        setTimeout(playWordAudio, 100);
    }

    function playWordAudio() {
        if (isPlaying || !currentWord || !synth) return;
        synth.cancel();

        let textToSpeak = '';
        const word = currentWord.english.split('(')[0].trim();
        const example = currentWord.example;

        if (gameMode === 'practice') {
            if (roundCount === 1) {
                // 第一回合：單字 + 例句
                textToSpeak = `${word}. ${example}`;
            } else if (roundCount === 2) {
                // 第二回合：只有單字
                textToSpeak = word;
            } else {
                // 第三回合及以後：只有例句
                textToSpeak = example;
            }
        } else {
            // 訂正模式：只念單字
            textToSpeak = word;
        }
        
        if (!textToSpeak) return; // 如果沒有要朗讀的內容，則直接返回

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.onstart = () => { isPlaying = true; playAudioBtnEl.disabled = true; };
        utterance.onend = () => { isPlaying = false; playAudioBtnEl.disabled = false; };
        utterance.onerror = (event) => {
            console.error('語音合成發生錯誤:', event);
            isPlaying = false;
            playAudioBtnEl.disabled = false;
        };
        synth.speak(utterance);
    }

    function handleSubmission(e) {
        e.preventDefault();
        const userAnswer = spellingInputEl.value.trim();
        if (userAnswer) checkAnswer(userAnswer);
    }

    function checkAnswer(answer) {
        if (isCorrecting) {
            if (answer.toLowerCase() === currentWord.english.toLowerCase()) {
                correctionCount++;
                if (correctionCount >= REQUIRED_CORRECTIONS) {
                    isCorrecting = false;
                    correctionCount = 0;
                    feedbackEl.textContent = '很好，現在記住了！';
                    feedbackEl.className = 'feedback-message notice';
                    setTimeout(setupNextWord, 1000);
                } else {
                    feedbackEl.textContent = `做得好！請再輸入一次 (${correctionCount}/${REQUIRED_CORRECTIONS})`;
                    spellingInputEl.value = '';
                }
            } else {
                feedbackEl.textContent = `拼寫仍然不對喔，請再試一次: ${currentWord.english}`;
                spellingInputEl.value = '';
            }
            return;
        }

        spellingInputEl.disabled = true;

        if (answer.toLowerCase() === currentWord.english.toLowerCase()) {
            feedbackEl.textContent = '正確！';
            feedbackEl.className = 'feedback-message correct';
            wordDisplayEl.textContent = currentWord.english;
            
            currentStreak++;
            playerStats.globalStats.totalWordsCorrect++;
            if (currentStreak > playerStats.globalStats.longestStreak) {
                playerStats.globalStats.longestStreak = currentStreak;
            }
            checkGlobalAchievements();
            saveProgress();

            setTimeout(setupNextWord, 500);
        } else {
            feedbackEl.textContent = `錯誤！你輸入的是 "${answer}"，正確答案是: ${currentWord.english} (請照著輸入 ${REQUIRED_CORRECTIONS} 次)`;
            feedbackEl.className = 'feedback-message incorrect';
            wordDisplayEl.textContent = currentWord.english;
            currentStreak = 0;
            wordsWrongInSession.add(currentWord.english);
            if (!wordsToReview.some(w => w.english === currentWord.english)) {
                wordsToReview.push(currentWord);
            }
            isCorrecting = true;
            correctionCount = 0;
            spellingInputEl.value = '';
            spellingInputEl.disabled = false;
            spellingInputEl.focus();
        }
    }

    // --- 成就系統輔助函式 ---
    // 根據 ISO 8601 標準獲取年份和週數
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

        const history = unitData.completionHistory || [];
        if (history.length < 3) return; // 通關次數少於3次，不可能達成任何連續成就

        // --- 累計每日檢查 (Cumulative Daily Check) ---
        if (!unitData.achievements.THREE_DAY_STREAK) {
            const uniqueDays = new Set(history.map(ts => new Date(ts).toISOString().slice(0, 10)));
            if (uniqueDays.size >= 3) {
                playerStats.totalPoints += UNIT_ACHIEVEMENTS.THREE_DAY_STREAK.points;
                unitData.achievements.THREE_DAY_STREAK = true;
                unlockedInSession.push(UNIT_ACHIEVEMENTS.THREE_DAY_STREAK.name);
            }
        }

        // --- 累計每月檢查 (Cumulative Monthly Check) ---
        if (!unitData.achievements.THREE_MONTH_STREAK) {
            const uniqueMonths = new Set(history.map(ts => new Date(ts).toISOString().slice(0, 7)));
            if (uniqueMonths.size >= 3) {
                playerStats.totalPoints += UNIT_ACHIEVEMENTS.THREE_MONTH_STREAK.points;
                unitData.achievements.THREE_MONTH_STREAK = true;
                unlockedInSession.push(UNIT_ACHIEVEMENTS.THREE_MONTH_STREAK.name);
            }
        }

        // --- 累計每週檢查 (Cumulative Weekly Check) ---
        if (!unitData.achievements.THREE_WEEK_STREAK) {
            const uniqueWeeks = new Set(history.map(ts => {
                const [year, week] = getWeekNumber(new Date(ts));
                return `${year}-${String(week).padStart(2, '0')}`;
            }));
            if (uniqueWeeks.size >= 3) {
                playerStats.totalPoints += UNIT_ACHIEVEMENTS.THREE_WEEK_STREAK.points;
                unitData.achievements.THREE_WEEK_STREAK = true;
                unlockedInSession.push(UNIT_ACHIEVEMENTS.THREE_WEEK_STREAK.name);
            }
        }
    }

    function endGame() {
        const errorCount = wordsWrongInSession.size;
        const unitPath = currentWordListPath;
        const unitName = currentWordListName;

        // Initialize unit data if it doesn't exist, and ensure completionHistory is present for legacy saves
        if (!playerStats.unitData[unitPath]) {
            playerStats.unitData[unitPath] = { achievements: {}, completionHistory: [] };
        } else if (!playerStats.unitData[unitPath].completionHistory) {
            playerStats.unitData[unitPath].completionHistory = [];
        }

        // Record the timestamp for this completion
        playerStats.unitData[unitPath].completionHistory.push(Date.now());

        const unlockedInSession = [];
        // NOTE: The logic is inclusive. Gold implies Silver and Bronze.
        if (errorCount <= 1) { // GOLD
            if (!playerStats.unitData[unitPath].achievements.GOLD) {
                playerStats.totalPoints += UNIT_ACHIEVEMENTS.GOLD.points;
                unlockedInSession.push(UNIT_ACHIEVEMENTS.GOLD.name);
                playerStats.unitData[unitPath].achievements.GOLD = true;
            }
        }
        if (errorCount <= 2) { // SILVER
            if (!playerStats.unitData[unitPath].achievements.SILVER) {
                playerStats.totalPoints += UNIT_ACHIEVEMENTS.SILVER.points;
                unlockedInSession.push(UNIT_ACHIEVEMENTS.SILVER.name);
                playerStats.unitData[unitPath].achievements.SILVER = true;
            }
        }
        if (errorCount <= 3) { // BRONZE
            if (!playerStats.unitData[unitPath].achievements.BRONZE) {
                playerStats.totalPoints += UNIT_ACHIEVEMENTS.BRONZE.points;
                unlockedInSession.push(UNIT_ACHIEVEMENTS.BRONZE.name);
                playerStats.unitData[unitPath].achievements.BRONZE = true;
            }
        }

        // 在此處新增對連續成就的檢查
        checkStreakAchievements(unitPath, unlockedInSession);

        if(unlockedInSession.length > 0){
            showToast(`在 ${unitName} 中解鎖: ${unlockedInSession.join(', ')}`);
        }

        checkGlobalAchievements();
        saveProgress();

        gameContainer.style.display = 'none';
        completionContainer.style.display = 'flex';
        updateTotalPointsDisplay();
    }

    function showStartScreen() {
        gameContainer.style.display = 'none';
        completionContainer.style.display = 'none';
        achievementContainer.style.display = 'none';
        startContainer.style.display = 'flex';
        updateTotalPointsDisplay();
    }

    function updateTotalPointsDisplay() {
        const pointsDisplay = document.getElementById('total-points-display');
        if (pointsDisplay) {
            pointsDisplay.textContent = `總點數: ${playerStats.totalPoints || 0}`;
        }
    }

    // --- 程式進入點 ---
    function populateWordListSelector() {
        wordLists.forEach(list => {
            const option = document.createElement('option');
            option.value = list.path;
            option.textContent = list.name;
            wordListSelectEl.appendChild(option);
        });
    }

    async function main() {
        loadProgress();
        populateWordListSelector();
        updateTotalPointsDisplay();

        // Event Listeners
        spellingFormEl.addEventListener('submit', handleSubmission);
        playAudioBtnEl.addEventListener('click', playWordAudio);

        startGameBtn.addEventListener('click', async () => {
            const selectedOption = wordListSelectEl.options[wordListSelectEl.selectedIndex];
            currentWordListPath = selectedOption.value;
            currentWordListName = selectedOption.text;

            // Initialize unit data on start, if it doesn't exist
            if (!playerStats.unitData[currentWordListPath]) {
                playerStats.unitData[currentWordListPath] = { achievements: {}, completionHistory: [] };
                saveProgress();
            }

            showStartScreen();
            startContainer.style.display = 'none';
            gameContainer.style.display = 'block';
            await loadWords(currentWordListPath);
            initializeGame();
        });

        restartBtn.addEventListener('click', () => {
            completionContainer.style.display = 'none';
            gameContainer.style.display = 'block';
            initializeGame();
        });

        backToMenuBtn.addEventListener('click', showStartScreen);

        showAchievementsBtn.addEventListener('click', () => {
            updateAchievementDisplay();
            achievementContainer.style.display = 'flex';
        });

        closeAchievementsBtn.addEventListener('click', () => {
            achievementContainer.style.display = 'none';
        });

        // 兌換事件監聽器
        showRedemptionsBtn.addEventListener('click', () => {
            renderRedemptionHistory();
            redemptionContainer.style.display = 'flex';
        });

        closeRedemptionsBtn.addEventListener('click', () => {
            redemptionContainer.style.display = 'none';
        });

        redemptionForm.addEventListener('submit', handleManualRedeem);
    }

    main();
});