document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素 ---
    const wordDisplayEl = document.getElementById('current-word-display');
    const translationEl = document.getElementById('translation-display');
    const phoneticsEl = document.getElementById('phonetics-display');
    const exampleEl = document.getElementById('example-display');
    const spellingFormEl = document.getElementById('spelling-form');
    const spellingInputEl = document.getElementById('spelling-input');
    const feedbackEl = document.getElementById('feedback-message');
    const playAudioBtnEl = document.getElementById('play-audio-btn');
    // const audioEl = document.getElementById('word-audio'); // No longer needed

    // --- 遊戲狀態 & 資料 ---
    let wordList = [];
    let wordsToPractice = [];
    let currentWord = null;
    const synth = window.speechSynthesis;
    let isPlaying = false;

    // --- 遊戲主要功能 ---

    async function loadWords() {
        try {
            const response = await fetch('words.csv');
            if (!response.ok) throw new Error(`無法讀取 words.csv: ${response.statusText}`);
            const csvText = await response.text();
            wordList = csvText.trim().split('\n').map(line => {
                const [english, chinese, phonetics, example] = line.split(',');
                if (english && chinese && phonetics && example) {
                    return { english: english.trim(), chinese: chinese.trim(), phonetics: phonetics.trim(), example: example.trim() };
                }
                return null;
            }).filter(word => word !== null);
            if (wordList.length === 0) throw new Error("單字列表為空或格式錯誤。");
        } catch (error) {
            console.error('載入單字時發生錯誤:', error);
            feedbackEl.textContent = '載入單字失敗，請檢查 words.csv 檔案是否存在且格式正確。';
        }
    }

    function initializeGame() {
        if (wordList.length === 0 || !synth) {
            playAudioBtnEl.style.display = 'none'; // Hide button if not supported
            return;
        }
        wordsToPractice = [...wordList].sort(() => Math.random() - 0.5);
        spellingFormEl.addEventListener('submit', handleSubmission);
        playAudioBtnEl.addEventListener('click', playWordAudio);
        setupNextWord();
    }

    function setupNextWord() {
        if (wordsToPractice.length === 0) {
            wordsToPractice = [...wordList].sort(() => Math.random() - 0.5);
            feedbackEl.textContent = "太棒了！所有單字都練習完畢，現在重新開始！";
            feedbackEl.className = 'feedback-message notice';
        } else {
            feedbackEl.textContent = '';
            feedbackEl.className = 'feedback-message';
        }

        currentWord = wordsToPractice.shift();
        
        playAudioBtnEl.style.display = 'block';

        translationEl.textContent = currentWord.chinese;
        phoneticsEl.textContent = currentWord.phonetics;
        
        const placeholder = '_______';
        const regex = new RegExp(currentWord.english, 'gi');
        const modifiedExample = currentWord.example.replace(regex, placeholder);
        exampleEl.textContent = modifiedExample;
        
        wordDisplayEl.textContent = '_'.repeat(currentWord.english.length).trim();

        spellingInputEl.value = '';
        spellingInputEl.disabled = false;
        spellingInputEl.focus();
    }

    function playWordAudio() {
        if (isPlaying || !currentWord || !synth) return;

        // 如果有正在說話的，先取消
        synth.cancel();

        const wordToSpeak = currentWord.english.split('(')[0].trim(); // Handle cases like "year(s) old"
        const exampleToSpeak = currentWord.example;
        const fullTextToSpeak = `${wordToSpeak}. ${exampleToSpeak}`;

        const utterance = new SpeechSynthesisUtterance(fullTextToSpeak);
        
        utterance.lang = 'en-US';
        utterance.rate = 0.9;

        utterance.onstart = () => {
            isPlaying = true;
            playAudioBtnEl.disabled = true;
        };

        utterance.onend = () => {
            isPlaying = false;
            playAudioBtnEl.disabled = false;
        };

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
        spellingInputEl.disabled = true;
        playAudioBtnEl.style.display = 'none';

        if (answer.toLowerCase() === currentWord.english.toLowerCase()) {
            feedbackEl.textContent = '正確！';
            feedbackEl.className = 'feedback-message correct';
        } else {
            feedbackEl.textContent = `錯誤！正確答案是: ${currentWord.english}`;
            feedbackEl.className = 'feedback-message incorrect';
        }
        wordDisplayEl.textContent = currentWord.english;

        setTimeout(setupNextWord, 2000);
    }

    async function startGame() {
        await loadWords();
        initializeGame();
    }

    startGame();
});
