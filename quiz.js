let buttonChangeTimeout = null;
let lastButtonResetTime = null;
let keyOfWordThatIsPrompted = null;
let newlyGraduatedKeysAsOfThisQuiz = [];

quizBackButton.addEventListener("click", () => {
    hideQuizDiv();
});

startQuizButton.addEventListener("click", () => {
    showQuizDiv();
});

quizButtonAdvanceFast.addEventListener("click", advanceQuizFast);
quizButtonAdvanceSlow.addEventListener("click", advanceQuiz);

function showQuizDiv() {
    quizDiv.style.display = "block";
    resetQuizButton();
    newlyGraduatedKeysAsOfThisQuiz = [];
    let newPrompt = Object.keys(spanishKeyVocab)[parseInt(Object.keys(spanishKeyVocab).length * Math.random())];
    quizPrompt.innerHTML = newPrompt;
}

function hideQuizDiv() {
    quizDiv.style.display = "none";
    // TODO consider showing a div to prompt for graduating words (or just redirecting to the graduation-
    // eligible words list view) if there are any words in newlyGraduatedKeysAsOfThisQuiz.
}

function resetQuizButton() {
    quizButtonAdvanceSlow.style.display = "none";
    quizButtonAdvanceFast.style.display = "inline";
    buttonChangeTimeout = setTimeout(() => {
        quizButtonAdvanceSlow.style.display = "inline";
        quizButtonAdvanceFast.style.display = "none";
    }, MILLIS_TO_GRADUATE);
    lastButtonResetTime = Date.now();
}

function advanceQuizFast() {
    console.log("Nice fast advance!");
    clearTimeout(buttonChangeTimeout);
    // TODO give credit for a fast advance
    advanceQuiz();
}

function advanceQuiz() {
    // TODO parse the spanishKeyVocab for the word that was prompted and get the queue of past durations
    let promptWord = quizPrompt.innerHTML;
    let timeQueue = spanishKeyVocab[promptWord].times || [];
    let newTime = Date.now() - lastButtonResetTime;
    if (timeQueue.length >= MAX_TIME_QUEUE_LENGTH) timeQueue = timeQueue.shift();
    timeQueue.push(newTime);
    spanishKeyVocab[promptWord].times = timeQueue;
    saveSpanishKeyVocab();
    // TODO check if the word can now graduate and add it to a list that tracks words eligible for graduation
    //  We might want to show this in a prompt when you exit the quiz.
    //  this entails scanning the vocab list and randomy picking a key?
    let newPrompt = Object.keys(spanishKeyVocab)[parseInt(Object.keys(spanishKeyVocab).length * Math.random())];
    quizPrompt.innerHTML = newPrompt;
    resetQuizButton();
}