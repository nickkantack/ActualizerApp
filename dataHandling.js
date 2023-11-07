
// Read in vocab words from local storage
wordListStorageCache = window.localStorage.getItem(STORAGE_KEY) ? JSON.parse(window.localStorage.getItem(STORAGE_KEY)) : [];
console.log(wordListStorageCache);

try {
    spanishKeyVocab = window.localStorage.getItem(SPANISH_KEY_VOCAB_KEY) ? JSON.parse(window.localStorage.getItem(SPANISH_KEY_VOCAB_KEY)) : {};
} catch (e) {
    console.warn("Error loading vocab. Will use a blank slate.");
}
// Keys are strings which are spanish words
// Values are objects with the following properties
//   * "english" - the english translation of the word
//   * "sentences" - and array of spanish sentences (strings) that use the word

convertLegacyData();


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

function saveSpanishKeyVocab() {
    window.localStorage.setItem(SPANISH_KEY_VOCAB_KEY, JSON.stringify(spanishKeyVocab));
}

function graduateWord(word) {
    if (spanishKeyVocab.hasOwnProperty(word)) {
        delete spanishKeyVocab[word].times;
        delete spanishKeyVocab[word][SENTENCES];
    }
}