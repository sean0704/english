document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素 ---
    const startContainer = document.getElementById('start-container');
    const gameContainer = document.getElementById('game-container');
    const completionContainer = document.getElementById('completion-container');
    const achievementContainer = document.getElementById('achievement-container');
    const sentenceContainer = document.getElementById('sentence-container');

    // 新的啟動流程元素
    const modeBtnSpelling = document.getElementById('mode-btn-spelling');
    const modeBtnSentence = document.getElementById('mode-btn-sentence');
    const wordListSelectEl = document.getElementById('word-list-select');
    const startGameBtn = document.getElementById('start-game-btn');

    // 拼寫遊戲元素
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
    const sentenceBackToMenuBtn = document.getElementById('sentence-back-to-menu-btn');

    const flashOverlayEl = document.getElementById('flash-overlay');
    const healthDisplayEl = document.getElementById('health-display');

    // --- 字庫設定 ---
    const wordLists = [
        { name: '五年級 上 Unit 1,2', path: 'g5_1_unit1.json', type: 'spelling' },
        { name: '五年級 上 Unit 3,4', path: 'g5_1_unit3.json', type: 'spelling' },
        { name: '七年級 上 Unit 0', path: 'g7_1_unit0.json', type: 'spelling' },
        { name: '七年級 上 Unit 1', path: 'g7_1_unit1.json', type: 'spelling' },
        { name: '七年級 上 Unit 2', path: 'g7_1_unit2.json', type: 'spelling' },
        { name: '七年級 上 Unit 3', path: 'g7_1_unit3.json', type: 'spelling' },
        { name: '七年級 上 Unit 3 (課文句型)', path: 'g7_1_unit3_s.json', type: 'sentence' },
        { name: '七年級 上 Unit 4', path: 'g7_1_unit4.json', type: 'spelling' },
        { name: '七年級 上 Unit 5', path: 'g7_1_unit5.json', type: 'spelling' },
        { name: '七年級 上 Unit 6', path: 'g7_1_unit6.json', type: 'spelling' },
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

    // 拼寫狀態
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
    let currentHealth;

    // 句型狀態
    let sentencePool = [];
    let currentSentence = null;

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
            const response = await fetch(filePath);
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
                if (roundCount >= 3) {
                    gameOver(true);
                    return;
                }
                gameMode = 'practice';
                roundCount++;
                wordsToPractice = [...wordList].sort(() => Math.random() - 0.5);
                stageTotal = wordsToPractice.length;
                feedbackEl.textContent = `太棒了！第 ${roundCount} 回合開始！`;
                feedbackEl.className = 'feedback-message notice';
                if (HEALTH_REPLENISH_ROUNDS.includes(roundCount - 1) && currentHealth < MAX_HEALTH) {
                    currentHealth++;
                    updateHealthDisplay();
                    feedbackEl.textContent += ` 生命值回補！❤️`;
                }
            }
        }
        const practicedInStage = stageTotal - wordsToPractice.length;
        const progressPercent = stageTotal > 0 ? (practicedInStage / stageTotal) * 100 : 0;
        progressBarEl.style.width = `${progressPercent}%`;
        roundDisplayEl.textContent = gameMode === 'review' ? `訂正時間` : `第 ${roundCount} 回合`;
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

    function playWordAudio() {
        if (isPlaying || !currentWord || !synth) return;
        synth.cancel();
        let textToSpeak = '';
        const word = currentWord.english.split('(')[0].trim();
        const example = currentWord.example;
        if (gameMode === 'practice') {
            if (roundCount === 1) textToSpeak = `${word}. ${example}`;
            else if (roundCount === 2) textToSpeak = word;
            else textToSpeak = example;
        } else {
            textToSpeak = word;
        }
        if (!textToSpeak) return;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.onstart = () => { isPlaying = true; playAudioBtnEl.disabled = true; };
        utterance.onend = () => { isPlaying = false; playAudioBtnEl.disabled = false; };
        utterance.onerror = (event) => { console.error('語音合成發生錯誤:', event); isPlaying = false; playAudioBtnEl.disabled = false; };
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
                    feedbackEl.textContent = `拼寫仍然不對喔，請再試一次 (${correctionCount}/${REQUIRED_CORRECTIONS})`;
                    spellingInputEl.value = '';
                }
            } else {
                feedbackEl.textContent = `拼寫仍然不對喔，請再試一次: ${currentWord.english}`;
                spellingInputEl.value = '';
                spellingInputEl.classList.add('input-incorrect');
                setTimeout(() => spellingInputEl.classList.remove('input-incorrect'), 600);
            }
            return;
        }
        spellingInputEl.disabled = true;
        if (answer.toLowerCase() === currentWord.english.toLowerCase()) {
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
            setTimeout(setupNextWord, 500);
        } else {
            feedbackEl.textContent = `錯誤！你輸入的是 "${answer}"，正確答案是: ${currentWord.english} (請照著輸入 ${REQUIRED_CORRECTIONS} 次)`;
            feedbackEl.className = 'feedback-message incorrect';
            wordDisplayEl.textContent = currentWord.english;
            spellingInputEl.classList.add('input-incorrect');
            flashOverlayEl.classList.add('flash-incorrect');
            setTimeout(() => { spellingInputEl.classList.remove('input-incorrect'); flashOverlayEl.classList.remove('flash-incorrect'); }, 600);
            currentStreak = 0;
            wordsWrongInSession.add(currentWord.english);
            if (!wordsToReview.some(w => w.english === currentWord.english)) wordsToReview.push(currentWord);
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
                return wordCount >= 2 && wordCount <= 20; // Loosened filter
            })
            .sort(() => Math.random() - 0.5);
        
        if (sentencePool.length === 0) {
            alert('這個單元沒有適合進行句型練習的句子。');
            showStartScreen();
            return;
        }
        setupNextSentence();
    }

    function setupNextSentence() {
        if (sentencePool.length === 0) {
            sentenceFeedbackEl.textContent = '恭喜！已完成本單元所有句型練習！';
            sentenceFeedbackEl.className = 'feedback-message notice';
            checkSentenceBtn.style.display = 'none';
            nextSentenceBtn.style.display = 'none';
            return;
        }
        currentSentence = sentencePool.pop();
        const cleanedSentence = (currentSentence.sentence || '').replace(/[.,?]/g, '');
        const words = cleanedSentence.split(' ').filter(w => w && !w.includes(':'));
        if (words.length < 2) { setupNextSentence(); return; }
        const shuffledWords = [...words].sort(() => Math.random() - 0.5);
        sentenceHintEl.textContent = `提示：${currentSentence.hint}`;
        sentenceAnswerAreaEl.innerHTML = '';
        sentenceWordBankEl.innerHTML = '';
        sentenceFeedbackEl.textContent = '';
        checkSentenceBtn.style.display = 'block';
        nextSentenceBtn.style.display = 'none';
        shuffledWords.forEach(word => {
            const wordEl = document.createElement('div');
            wordEl.textContent = word;
            wordEl.className = 'word-block';
            wordEl.addEventListener('click', () => moveWord(wordEl));
            sentenceWordBankEl.appendChild(wordEl);
        });
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
            sentenceFeedbackEl.textContent = '不正確，請再試一次。';
            sentenceFeedbackEl.className = 'feedback-message incorrect';
        }
    }

    // --- 通用遊戲邏輯 ---
    function gameOver(isSuccess) {
        const unitPath = currentWordListPath;
        const unitName = currentWordListName;
        if (!playerStats.unitData[unitPath]) {
            playerStats.unitData[unitPath] = { achievements: {}, completionHistory: [] };
        } else if (!playerStats.unitData[unitPath].completionHistory) {
            playerStats.unitData[unitPath].completionHistory = [];
        }
        if (isSuccess) {
            playerStats.unitData[unitPath].completionHistory.push(Date.now());
        }
        const unlockedInSession = [];
        if (isSuccess) {
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
            completionContainer.querySelector('.start-title').textContent = '恭喜通關！';
            completionContainer.querySelector('p').textContent = '你已完成本單元的所有練習。';
            document.getElementById('restart-btn').style.display = 'block';
            document.getElementById('back-to-menu-btn').style.display = 'block';
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
            document.getElementById('restart-btn').style.display = 'block';
            document.getElementById('back-to-menu-btn').style.display = 'block';
        }
        checkGlobalAchievements();
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
        startContainer.style.display = 'flex';
        wordListSelectEl.disabled = true;
        wordListSelectEl.innerHTML = '<option value="">請先選擇模式</option>';
        startGameBtn.disabled = true;
        modeBtnSpelling.classList.remove('mode-selected');
        modeBtnSentence.classList.remove('mode-selected');
        updateTotalPointsDisplay();
    }

    function updateTotalPointsDisplay() {
        const pointsDisplay = document.getElementById('total-points-display');
        if (pointsDisplay) pointsDisplay.textContent = playerStats.totalPoints || 0;
    }

    function updateHealthDisplay() {
        healthDisplayEl.innerHTML = '';
        for (let i = 0; i < MAX_HEALTH; i++) {
            const heartSpan = document.createElement('span');
            heartSpan.classList.add('heart');
            heartSpan.textContent = '❤️';
            if (i < currentHealth) {
                heartSpan.classList.add('full');
            }
            healthDisplayEl.appendChild(heartSpan);
        }
    }

    // --- 新的啟動流程 ---
    function updateWordListDropdown(selectedMode) {
        wordListSelectEl.innerHTML = '';
        const filteredLists = wordLists.filter(list => list.type === selectedMode);
        
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
            gameContainer.style.display = 'block';
            initializeGame();
        } else if (activeGameMode === 'sentence') {
            sentenceContainer.style.display = 'block';
            initializeSentenceGame();
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
            updateWordListDropdown('spelling');
        });

        modeBtnSentence.addEventListener('click', () => {
            activeGameMode = 'sentence';
            modeBtnSentence.classList.add('mode-selected');
            modeBtnSpelling.classList.remove('mode-selected');
            updateWordListDropdown('sentence');
        });

        startGameBtn.addEventListener('click', startGame);

        spellingFormEl.addEventListener('submit', handleSubmission);
        playAudioBtnEl.addEventListener('click', playWordAudio);

        restartBtn.addEventListener('click', () => {
            completionContainer.style.display = 'none';
            if (activeGameMode === 'spelling') {
                gameContainer.style.display = 'block';
                initializeGame();
            }
        });

        backToMenuBtn.addEventListener('click', showStartScreen);

        // 句型遊戲按鈕
        checkSentenceBtn.addEventListener('click', checkSentence);
        nextSentenceBtn.addEventListener('click', setupNextSentence);
        sentenceBackToMenuBtn.addEventListener('click', showStartScreen);

        // 成就和兌換按鈕
        showAchievementsBtn.addEventListener('click', () => { updateAchievementDisplay(); achievementContainer.style.display = 'flex'; });
        closeAchievementsBtn.addEventListener('click', () => { achievementContainer.style.display = 'none'; });
        showRedemptionsBtn.addEventListener('click', () => { renderRedemptionHistory(); redemptionContainer.style.display = 'flex'; });
        closeRedemptionsBtn.addEventListener('click', () => { redemptionContainer.style.display = 'none'; });
        redemptionForm.addEventListener('submit', handleManualRedeem);
    }

    main();
});