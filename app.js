
const ENGLISH = "english";

const vocabInput = document.getElementById("vocabInput");
const addVocabButton = document.getElementById("addVocabButton");
const vocabListTable = document.getElementById("vocabListTable");
const vocabListRowTemplate = document.getElementById("vocabListRowTemplate");
const totalWords = document.getElementById("totalWords");
const vocabListDiv = document.querySelector(".vocabListDiv");
const singleWordView = document.getElementById("singleWordView");
const singleWordTitle = document.getElementById("singleWordTitle");
const backToVocabList = document.getElementById("backToVocabList");
const editEnglishTranslation = document.getElementById("editEnglishTranslation");
const englishTranslationEntry = document.getElementById("englishTranslationEntry");
const singleWordTranslation = document.getElementById("singleWordTranslation");

let currentSingleSpanishWord = null;

// Read in vocab words from local storage
const STORAGE_KEY = "actualizer-app-vocab-list";
let wordListStorageCache = window.localStorage.getItem(STORAGE_KEY) ? JSON.parse(window.localStorage.getItem(STORAGE_KEY)) : [];
console.log(wordListStorageCache);

const SPANISH_KEY_VOCAB_KEY = "spanish-key-vocab-key";
let spanishKeyVocab = {};
try {
    spanishKeyVocab = window.localStorage.getItem(SPANISH_KEY_VOCAB_KEY) ? JSON.parse(window.localStorage.getItem(SPANISH_KEY_VOCAB_KEY)) : {};
} catch (e) {
    console.warn("Error loading vocab. Will use a blank slate.");
}
// Keys are strings which are spanish words
// Values are objects with the following properties
//   * "english" - the english translation of the word

convertLegacyData();

// Populate the table
refreshTableWithCachedWords();

// Set listeners
addVocabButton.addEventListener("click", () => {
    // TODO perform validation on the word
    let stagedWord = vocabInput.value;
    stagedWord = stagedWord.toLowerCase();
    if (wordListStorageCache.includes(stagedWord)) {
        alert("That word is already present in the list");
        return;
    }
    vocabInput.value = "";
    spanishKeyVocab[stagedWord] = {ENGLISH:""};
    refreshTableWithCachedWords();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wordListStorageCache));
});

backToVocabList.addEventListener("click", showVocabListDiv);
editEnglishTranslation.addEventListener("click", toggleEnglishDefinitionEdit);

// Define utility functions
function addWordToTable(spanishWord) {
    const newRow = vocabListRowTemplate.content.cloneNode(true).querySelector(".vocabListRow");
    newRow.querySelector(".vocabWordDisplayDiv").innerHTML = spanishWord;
    newRow.querySelector(".removeVocabWord").addEventListener("click", () => {
        wordListStorageCache.splice(wordListStorageCache.indexOf(spanishWord), 1);
        delete spanishKeyVocab[spanishWord];
        vocabListTable.removeChild(newRow);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wordListStorageCache));
        window.localStorage.setItem(SPANISH_KEY_VOCAB_KEY, JSON.stringify(spanishKeyVocab));
        totalWords.innerHTML = Object.keys(spanishKeyVocab).length;
    });
    newRow.querySelector(".openWord").addEventListener("click", () => {
        showSingleWordView(spanishWord);
    });
    vocabListTable.appendChild(newRow);
}

function refreshTableWithCachedWords() {
    for (let i = vocabListTable.children.length - 1; i >= 0; i--) vocabListTable.removeChild(vocabListTable.children[i]);
    // TODO create a list of spanishWordKeys and order them alphabetically
    const spanishKeysInOrder = Object.keys(spanishKeyVocab);
    spanishKeysInOrder.sort();
    for (let spanishWord of spanishKeysInOrder) addWordToTable(spanishWord);
    totalWords.innerHTML = spanishKeysInOrder.length;
}

function convertLegacyData() {

    // For every list in the old primitive list of spanish words, create an entry in the spanish key vocab
    for (let legacySpanishWordString of wordListStorageCache) {
        if (!spanishKeyVocab.hasOwnProperty(legacySpanishWordString)) {
            spanishKeyVocab[legacySpanishWordString] = {};
        }
    }
    window.localStorage.setItem(SPANISH_KEY_VOCAB_KEY, JSON.stringify(spanishKeyVocab));

    // TODO once wordListStorageCache is fully deprecated, delete it here now after some checks.

}

function showSingleWordView(spanishWord) {
    singleWordView.style.display = "inline";
    vocabListDiv.style.display = "none";
    singleWordTitle.innerHTML = spanishWord;
    const englishDefinition = spanishKeyVocab[spanishWord][ENGLISH];
    singleWordView.querySelector(".otherLanguageDefinition").innerHTML = englishDefinition || "no translation saved";
    currentSingleSpanishWord = spanishWord;
}

function showVocabListDiv() {
    singleWordView.style.display = "none";
    vocabListDiv.style.display = "inline";
    editEnglishTranslation.innerHTML = "edit";
    englishTranslationEntry.style.display = "none";
}

function toggleEnglishDefinitionEdit() {
    if (editEnglishTranslation.innerHTML === "edit") {
        editEnglishTranslation.innerHTML = "save";
        englishTranslationEntry.style.display = "inline";
        englishTranslationEntry.value = spanishKeyVocab[currentSingleSpanishWord][ENGLISH] || "";
    } else {
        editEnglishTranslation.innerHTML = "edit";
        englishTranslationEntry.style.display = "none";
        singleWordTranslation.innerHTML = englishTranslationEntry.value;
        // change the local data cache
        spanishKeyVocab[currentSingleSpanishWord][ENGLISH] = englishTranslationEntry.value;
        saveSpanishKeyVocab();
    }
}

function saveSpanishKeyVocab() {
    window.localStorage.setItem(SPANISH_KEY_VOCAB_KEY, JSON.stringify(spanishKeyVocab));
}