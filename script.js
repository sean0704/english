document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素 ---
    const startGameBtn = document.getElementById('start-game-btn');
    const startContainer = document.getElementById('start-container');
    const gameContainer = document.getElementById('game-container');
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
    const wordListSelectEl = document.getElementById('word-list-select');

    // --- 字庫設定 ---
    const wordLists = [
        { name: '國一上 Unit 0', path: 'unit0.csv' },
        { name: '國一上 Unit 1', path: 'unit1.csv' },
        // { name: 'Unit 2 單字', path: 'unit2.csv' }, // 未來可以像這樣新增
    ];

    // --- 遊戲狀態 & 資料 ---
    let wordList = [];
    let totalWords = 0;
    let roundCount = 1;
    let wordsToPractice = [];
    let wordsToReview = [];
    let gameMode = 'practice';
    let stageTotal = 0;
    let currentWord = null;
    let isCorrecting = false;
    let correctionCount = 0;
    const REQUIRED_CORRECTIONS = 2;
    const synth = window.speechSynthesis;
    let isPlaying = false;

    // --- 遊戲主要功能 ---

    function parseCsvLine(line) {
        const regex = /"([^"]*)"|[^,]+/g;
        const fields = [];
        let match;
        while (match = regex.exec(line)) {
            const value = match[1] !== undefined ? match[1] : match[0];
            fields.push(value.trim());
        }
        return fields;
    }

    async function loadWords(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`無法讀取 ${filePath}: ${response.statusText}`);
            const csvText = await response.text();
            wordList = csvText.trim().split('\n').map(line => {
                const [english, chinese, phonetics, example] = parseCsvLine(line);
                if (english && chinese && phonetics && example) {
                    return { english: english.trim(), chinese: chinese.trim(), phonetics: phonetics.trim(), example: example.trim() };
                }
                return null;
            }).filter(word => word !== null);
            if (wordList.length === 0) throw new Error("單字列表為空或格式錯誤。");
        } catch (error) {
            console.error('載入單字時發生錯誤:', error);
            alert(`載入單字失敗，請檢查 ${filePath} 檔案是否存在且格式正確。`);
            startContainer.style.display = 'flex';
            gameContainer.style.display = 'none';
        }
    }

    function initializeGame() {
        if (wordList.length === 0) return;
        totalWords = wordList.length;
        stageTotal = wordList.length;
        roundCount = 1;
        gameMode = 'practice';
        wordsToReview = [];
        wordsToPractice = [...wordList].sort(() => Math.random() - 0.5);
        if (!synth) {
            playAudioBtnEl.style.display = 'none';
        }
        spellingFormEl.addEventListener('submit', handleSubmission);
        playAudioBtnEl.addEventListener('click', playWordAudio);
        setupNextWord();
    }

    function setupNextWord() {
        if (wordsToPractice.length === 0) {
            if (gameMode === 'practice' && wordsToReview.length > 0) {
                gameMode = 'review';
                wordsToPractice = [...wordsToReview].sort(() => Math.random() - 0.5);
                stageTotal = wordsToPractice.length;
                wordsToReview = [];
                feedbackEl.textContent = `第 ${roundCount} 回合結束！現在開始訂正錯題...`;
                feedbackEl.className = 'feedback-message notice';
            } else {
                gameMode = 'practice';
                if (stageTotal > 0) {
                    roundCount++;
                }
                wordsToPractice = [...wordList].sort(() => Math.random() - 0.5);
                stageTotal = wordsToPractice.length;
                wordsToReview = [];
                feedbackEl.textContent = `太棒了！第 ${roundCount} 回合開始！`;
                feedbackEl.className = 'feedback-message notice';
            }
        }

        const practicedInStage = stageTotal - wordsToPractice.length;
        const progressPercent = stageTotal > 0 ? (practicedInStage / stageTotal) * 100 : 0;
        progressBarEl.style.width = `${progressPercent}%`;
        
        if (gameMode === 'review') {
            roundDisplayEl.textContent = `訂正時間`;
            progressBarEl.style.backgroundImage = 'linear-gradient(45deg, var(--incorrect-color), #f56565)';
        } else {
            roundDisplayEl.textContent = `第 ${roundCount} 回合`;
            progressBarEl.style.backgroundImage = 'linear-gradient(45deg, var(--correct-color), #68d391)';
        }

        currentWord = wordsToPractice.shift();
        playAudioBtnEl.style.display = synth ? 'block' : 'none';

        phoneticsEl.textContent = currentWord.phonetics;
        if (roundCount === 1 && gameMode === 'practice') {
            translationEl.textContent = currentWord.chinese;
            const placeholder = '_______';
            const regex = new RegExp(currentWord.english, 'gi');
            const modifiedExample = currentWord.example.replace(regex, placeholder);
            exampleEl.textContent = modifiedExample;
        } else {
            translationEl.textContent = '';
            exampleEl.textContent = '';
        }
        
        wordDisplayEl.textContent = currentWord.english.replace(/\S/g, '_');
        spellingInputEl.value = '';
        spellingInputEl.disabled = false;
        spellingInputEl.focus();
        setTimeout(playWordAudio, 100);
    }

    function playWordAudio() {
        if (isPlaying || !currentWord || !synth) return;
        synth.cancel();
        const wordToSpeak = currentWord.english.split('(')[0].trim();
        const exampleToSpeak = (gameMode === 'practice' && roundCount === 1) ? currentWord.example : '';
        const fullTextToSpeak = `${wordToSpeak}. ${exampleToSpeak}`;
        const utterance = new SpeechSynthesisUtterance(fullTextToSpeak);
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
        if (userAnswer) {
            checkAnswer(userAnswer);
        }
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
                    feedbackEl.className = 'feedback-message notice';
                    spellingInputEl.value = '';
                    spellingInputEl.focus();
                }
            } else {
                feedbackEl.textContent = `拼寫仍然不對喔，請再試一次: ${currentWord.english}`;
                feedbackEl.className = 'feedback-message incorrect';
                spellingInputEl.value = '';
                spellingInputEl.focus();
            }
            return;
        }

        spellingInputEl.disabled = true;
        playAudioBtnEl.style.display = 'none';

        if (answer.toLowerCase() === currentWord.english.toLowerCase()) {
            feedbackEl.textContent = '正確！';
            feedbackEl.className = 'feedback-message correct';
            wordDisplayEl.textContent = currentWord.english;
            setTimeout(setupNextWord, 500);
        } else {
            if (gameMode === 'practice' && !wordsToReview.some(w => w.english === currentWord.english)) {
                wordsToReview.push(currentWord);
            }
            isCorrecting = true;
            correctionCount = 0;
            feedbackEl.textContent = `錯誤！正確答案是: ${currentWord.english} (請照著輸入 ${REQUIRED_CORRECTIONS} 次)`;
            feedbackEl.className = 'feedback-message incorrect';
            wordDisplayEl.textContent = currentWord.english;
            spellingInputEl.value = '';
            spellingInputEl.disabled = false;
            spellingInputEl.focus();
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
        populateWordListSelector();
        startGameBtn.addEventListener('click', async () => {
            const selectedListPath = wordListSelectEl.value;
            startContainer.style.display = 'none';
            gameContainer.style.display = 'block';
            await loadWords(selectedListPath);
            initializeGame();
        });
    }

    main();
});
