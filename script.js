document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素 ---
    const wordDisplayEl = document.getElementById('current-word-display');
    const translationEl = document.getElementById('translation-display');
    const spellingAreaEl = document.getElementById('spelling-input-area');
    const feedbackEl = document.getElementById('feedback-message');

    // --- 單字庫 (直接內嵌) ---
    const wordList = [
        { english: 'apple', chinese: '蘋果' },
        { english: 'banana', chinese: '香蕉' },
        { english: 'cat', chinese: '貓' },
        { english: 'dog', chinese: '狗' },
        { english: 'elephant', chinese: '大象' },
        { english: 'flower', chinese: '花' },
        { english: 'guitar', chinese: '吉他' },
        { english: 'house', chinese: '房子' },
        { english: 'ice', chinese: '冰' },
        { english: 'juice', chinese: '果汁' },
        { english: 'key', chinese: '鑰匙' },
        { english: 'lion', chinese: '獅子' },
        { english: 'moon', chinese: '月亮' },
        { english: 'notebook', chinese: '筆記本' },
        { english: 'ocean', chinese: '海洋' },
        { english: 'pencil', chinese: '鉛筆' },
        { english: 'queen', chinese: '女王' },
        { english: 'rabbit', chinese: '兔子' },
        { english: 'sun', chinese: '太陽' },
        { english: 'tree', chinese: '樹' },
        { english: 'umbrella', chinese: '雨傘' },
        { english: 'violin', chinese: '小提琴' },
        { english: 'water', chinese: '水' },
        { english: 'xylophone', chinese: '木琴' },
        { english: 'yacht', chinese: '遊艇' },
        { english: 'zebra', chinese: '斑馬' }
    ];

    // --- 遊戲狀態 ---
    let wordsToPractice = [];
    let currentWord = null;
    let typedIndex = 0;
    let isWrong = false;

    // --- 遊戲主要功能 ---

    /**
     * 初始化或重置遊戲
     */
    function initializeGame() {
        // 複製並打亂單字順序
        wordsToPractice = [...wordList].sort(() => Math.random() - 0.5);
        setupNextWord();
        window.addEventListener('keydown', handleKeyboardInput);
    }

    /**
     * 準備下一個單字
     */
    function setupNextWord() {
        // 如果單字都練習完了，就重新開始
        if (wordsToPractice.length === 0) {
            wordsToPractice = [...wordList].sort(() => Math.random() - 0.5);
            feedbackEl.textContent = "太棒了！所有單字都練習完畢，現在重新開始！";
        }

        currentWord = wordsToPractice.shift(); // 取出下一個單字
        typedIndex = 0;
        isWrong = false;

        // 更新畫面顯示
        wordDisplayEl.textContent = currentWord.english;
        translationEl.textContent = currentWord.chinese;
        if (feedbackEl.textContent.includes("太棒了")) {
            // 如果是新一輪，延遲清除提示
            setTimeout(() => { feedbackEl.textContent = ''; }, 2000);
        } else {
            feedbackEl.textContent = '';
        }


        // 建立字母輸入框
        spellingAreaEl.innerHTML = ''; // 清空舊的
        currentWord.english.split('').forEach(() => {
            const box = document.createElement('div');
            box.className = 'letter-box';
            spellingAreaEl.appendChild(box);
        });
    }

    /**
     * 處理鍵盤輸入
     * @param {KeyboardEvent} e 
     */
    function handleKeyboardInput(e) {
        // 只處理單個英文字母
        if (!e.key.match(/^[a-zA-Z]$/)) return;

        const letter = e.key.toLowerCase();
        const correctLetter = currentWord.english[typedIndex];
        const letterBoxes = spellingAreaEl.children;

        if (isWrong) {
            // 如果前一個輸入是錯的，必須輸入正確的字母才能繼續
            if (letter === correctLetter) {
                isWrong = false;
                feedbackEl.textContent = '';
                letterBoxes[typedIndex].classList.remove('incorrect');
                processCorrectInput(letter, letterBoxes);
            }
        } else {
            // 正常輸入流程
            if (letter === correctLetter) {
                processCorrectInput(letter, letterBoxes);
            } else {
                // 輸入錯誤
                isWrong = true;
                letterBoxes[typedIndex].classList.add('incorrect');
                feedbackEl.textContent = `不對喔！這裡應該是 '${correctLetter.toUpperCase()}'`;
            }
        }
    }

    /**
     * 處理正確輸入的邏輯
     * @param {string} letter 
     * @param {HTMLCollection} letterBoxes 
     */
    function processCorrectInput(letter, letterBoxes) {
        letterBoxes[typedIndex].textContent = letter.toUpperCase();
        letterBoxes[typedIndex].classList.add('correct');
        typedIndex++;

        // 檢查是否完成整個單字
        if (typedIndex === currentWord.english.length) {
            feedbackEl.textContent = '正確！';
            // 短暫延遲後進入下一個單字
            setTimeout(setupNextWord, 600);
        }
    }

    // --- 啟動遊戲 ---
    initializeGame();
});
