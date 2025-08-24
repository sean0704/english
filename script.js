document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素 ---
    const wordDisplayEl = document.getElementById('current-word-display');
    const translationEl = document.getElementById('translation-display');
    const phoneticsEl = document.getElementById('phonetics-display');
    const exampleEl = document.getElementById('example-display');
    const spellingAreaEl = document.getElementById('spelling-input-area');
    const feedbackEl = document.getElementById('feedback-message');

    // --- 遊戲狀態 ---
    let wordList = []; // 將從 CSV 載入
    let wordsToPractice = [];
    let currentWord = null;
    let typedIndex = 0;
    let isWrong = false;

    // --- 遊戲主要功能 ---

    /**
     * 從 CSV 檔案載入單字列表
     */
    async function loadWords() {
        try {
            const response = await fetch('words.csv');
            if (!response.ok) {
                throw new Error(`無法讀取 words.csv: ${response.statusText}`);
            }
            const csvText = await response.text();
            wordList = csvText
                .trim()
                .split('\n')
                .map(line => {
                    const [english, chinese, phonetics, example] = line.split(',');
                    if (english && chinese && phonetics && example) {
                        return {
                            english: english.trim(),
                            chinese: chinese.trim(),
                            phonetics: phonetics.trim(),
                            example: example.trim()
                        };
                    }
                    return null;
                })
                .filter(word => word !== null); // 過濾掉解析失敗或空行的項目

            if (wordList.length === 0) {
                throw new Error("單字列表為空或格式錯誤。");
            }
            
        } catch (error) {
            console.error('載入單字時發生錯誤:', error);
            feedbackEl.textContent = '載入單字失敗，請檢查 words.csv 檔案是否存在且格式正確。';
        }
    }

    /**
     * 初始化或重置遊戲
     */
    function initializeGame() {
        if (wordList.length === 0) {
            feedbackEl.textContent = '沒有可練習的單字。';
            return;
        }
        wordsToPractice = [...wordList].sort(() => Math.random() - 0.5);
        setupNextWord();
        window.removeEventListener('keydown', handleKeyboardInput);
        window.addEventListener('keydown', handleKeyboardInput);
    }

    /**
     * 準備下一個單字
     */
    function setupNextWord() {
        if (wordsToPractice.length === 0) {
            wordsToPractice = [...wordList].sort(() => Math.random() - 0.5);
            feedbackEl.textContent = "太棒了！所有單字都練習完畢，現在重新開始！";
        }

        currentWord = wordsToPractice.shift();
        typedIndex = 0;
        isWrong = false;

        // 更新畫面顯示
        wordDisplayEl.textContent = currentWord.english;
        translationEl.textContent = currentWord.chinese;
        phoneticsEl.textContent = currentWord.phonetics;
        exampleEl.textContent = currentWord.example;
        
        if (feedbackEl.textContent.includes("太棒了")) {
            setTimeout(() => { feedbackEl.textContent = ''; }, 2000);
        } else {
            feedbackEl.textContent = '';
        }

        spellingAreaEl.innerHTML = '';
        currentWord.english.split('').forEach(() => {
            const box = document.createElement('div');
            box.className = 'letter-box';
            spellingAreaEl.appendChild(box);
        });

        // Set initial cursor
        if (spellingAreaEl.children.length > 0) {
            spellingAreaEl.children[0].classList.add('current-input');
        }
    }

    /**
     * 處理鍵盤輸入
     * @param {KeyboardEvent} e 
     */
    function handleKeyboardInput(e) {
        if (!currentWord) return;
        if (!e.key.match(/^[a-zA-Z .?!']$/)) return;

        const letter = e.key;
        const correctLetter = currentWord.english[typedIndex];
        const letterBoxes = spellingAreaEl.children;

        if (isWrong) {
            if (letter === correctLetter) {
                isWrong = false;
                feedbackEl.textContent = '';
                letterBoxes[typedIndex].classList.remove('incorrect');
                // Re-add cursor to the corrected box before processing
                letterBoxes[typedIndex].classList.add('current-input');
                processCorrectInput(letter, letterBoxes);
            }
        } else {
            if (letter === correctLetter) {
                processCorrectInput(letter, letterBoxes);
            } else {
                isWrong = true;
                // Remove cursor from incorrect box
                letterBoxes[typedIndex].classList.remove('current-input');
                letterBoxes[typedIndex].classList.add('incorrect');
                feedbackEl.textContent = `不對喔！這裡應該是 '${correctLetter}'`;
            }
        }
    }

    /**
     * 處理正確輸入的邏輯
     * @param {string} letter 
     * @param {HTMLCollection} letterBoxes 
     */
    function processCorrectInput(letter, letterBoxes) {
        letterBoxes[typedIndex].textContent = letter;
        letterBoxes[typedIndex].classList.add('correct');
        // Move cursor
        letterBoxes[typedIndex].classList.remove('current-input');
        typedIndex++;

        if (typedIndex < currentWord.english.length) {
            letterBoxes[typedIndex].classList.add('current-input');
        }

        // 檢查是否完成整個單字
        if (typedIndex === currentWord.english.length) {
            feedbackEl.textContent = '正確！';
            setTimeout(setupNextWord, 600);
        }
    }

    /**
     * 啟動遊戲的非同步函數
     */
    async function startGame() {
        await loadWords();
        initializeGame();
    }

    // --- 啟動遊戲 ---
    startGame();
});
