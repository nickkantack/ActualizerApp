
const vocabInput = document.getElementById("vocabInput");
const addVocabButton = document.getElementById("addVocabButton");
const vocabListTable = document.getElementById("vocabListTable");
const vocabListRowTemplate = document.getElementById("vocabListRowTemplate");

// Read in vocab words from local storage
const STORAGE_KEY = "actualizer-app-vocab-list";
let wordListStorageCache = window.localStorage.getItem(STORAGE_KEY) ? JSON.parse(window.localStorage.getItem(STORAGE_KEY)) : [];
console.log(wordListStorageCache);

// Populate the table
for (let word of wordListStorageCache) {
    addWordToTable(word, false);
}

// Set listeners
addVocabButton.addEventListener("click", () => {
    // TODO perform validation on the word
    let stagedWord = vocabInput.value;
    stagedWord = stagedWord.toLowerCase();
    if (wordListStorageCache.includes(stagedWord)) {
        alert("That word is already present in the list");
        return;
    }
    addWordToTable(vocabInput.value, true);
});

// Define utility functions
function addWordToTable(word, saveAfterwards = false) {
    console.log(`Save aftewards was ${saveAfterwards}`);
    const newRow = vocabListRowTemplate.content.cloneNode(true).querySelector(".vocabListRow");
    newRow.innerHTML = word;
    vocabListTable.appendChild(newRow);
    if (saveAfterwards) {
        wordListStorageCache.push(word);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wordListStorageCache));
    }
}