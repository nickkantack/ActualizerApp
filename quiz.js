let isAwaitingUserPress = false;
let buttonChangeTimeout = null;

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
}

function hideQuizDiv() {
    quizDiv.style.display = "none";
}

function resetQuizButton() {
    quizButtonAdvanceSlow.style.display = "none";
    quizButtonAdvanceFast.style.display = "inline";
    buttonChangeTimeout = setTimeout(() => {
        if (isAwaitingUserPress) {
            quizButtonAdvanceSlow.style.display = "inline";
            quizButtonAdvanceFast.style.display = "none";
        }
    }, 1500);
}

function advanceQuizFast() {
    isAwaitingUserPress = false;
    console.log("Nice fast advance!");
    clearTimeout(buttonChangeTimeout);
    // TODO give credit for a fast advance
    advanceQuiz();
}

function advanceQuiz() {
    // TODO change the prompt
    quizPrompt.innerHTML = Math.random();
    isAwaitingUserPress = true;
    resetQuizButton();
}