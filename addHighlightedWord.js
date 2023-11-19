
let lastSelection = null;

document.addEventListener("mouseup", () => {
    const selection = document.getSelection().toString();
    if (lastSelection && lastSelection !== selection) {
        addHighlightedWord.style.display = "none";
    }
    if (selection !== "" && !/\s/.test(selection)) {
        // Make sure the word isn't already added
        if (spanishKeyVocab.hasOwnProperty(selection)) return;
        wordSuggestionSpan.innerHTML = selection;
        addHighlightedWord.style.display = "block";
    }
    lastSelection = selection;
});

addHighlightedWordButton.addEventListener("click", () => {
    const newSpanishWord = wordSuggestionSpan.innerHTML;
    spanishKeyVocab[newSpanishWord] = {ENGLISH:"",times:[],sentences:[]};
    addWordToTable(newSpanishWord, true);
    addHighlightedWord.style.display = "none";
});