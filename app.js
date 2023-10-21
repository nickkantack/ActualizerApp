

const vocabListDiv = document.querySelector(".vocabListDiv");

let currentSingleSpanishWord = null;

// Populate the spanish list table
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
    let dataSizeInBytes = 2 * JSON.stringify(spanishKeyVocab).length;
    let unit = "B";
    if (dataSizeInBytes > 1000) {
        dataSizeInBytes /= 1000;
        unit = "KB";
    }
    if (dataSizeInBytes > 1000) {
        dataSizeInBytes /= 1000;
        unit = "MB";
    }
    const truncatedDecimal = dataSizeInBytes.toString().replace(/([^\.]*\.[^\.]{2})[0-9]+/, "$1");
    totalWords.innerHTML = `${spanishKeysInOrder.length} words, ${truncatedDecimal} ${unit}`;
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
