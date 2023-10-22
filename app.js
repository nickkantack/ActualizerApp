

const vocabListDiv = document.querySelector(".vocabListDiv");

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
    window.localStorage.setItem(SPANISH_KEY_VOCAB_KEY, JSON.stringify(spanishKeyVocab));
});

backToVocabList.addEventListener("click", showVocabListDiv);
editEnglishTranslation.addEventListener("click", toggleEnglishDefinitionEdit);

function addWordToTable(spanishWord) {
    const newRow = vocabListRowTemplate.content.cloneNode(true).querySelector(".vocabListRow");
    newRow.querySelector(".vocabWordDisplayDiv").innerHTML = spanishWord;
    // Attach the reclick listener to the delete button
    addReclickListener(newRow.querySelector(".removeVocabWord"), () => {
        console.log("Need to tap again soon!");   
        newRow.querySelector(".removeVocabWord").querySelector("svg").classList.add("deleteButtonActive");
        for (let path of newRow.querySelector(".removeVocabWord").querySelectorAll("path")) {
            path.classList.add("deleteButtonActive");
        }
    }, () => {
        wordListStorageCache.splice(wordListStorageCache.indexOf(spanishWord), 1);
        delete spanishKeyVocab[spanishWord];
        vocabListTable.removeChild(newRow);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wordListStorageCache));
        window.localStorage.setItem(SPANISH_KEY_VOCAB_KEY, JSON.stringify(spanishKeyVocab));
        totalWords.innerHTML = Object.keys(spanishKeyVocab).length;
    }, 1000, () => {
        newRow.querySelector(".removeVocabWord").querySelector("svg").classList.remove("deleteButtonActive");
        for (let path of newRow.querySelector(".removeVocabWord").querySelectorAll("path")) {
            path.classList.remove("deleteButtonActive");
        }
        console.log("Time is up");
    });
    // Attach listener for the info button
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
    cachedScrollHeightOfSpanishVocab = document.documentElement.scrollTop || document.body.scrollTop
    singleWordView.style.display = "inline";
    vocabListDiv.style.display = "none";
    singleWordTitle.innerHTML = spanishWord;
    const englishDefinition = spanishKeyVocab[spanishWord][ENGLISH];
    singleWordView.querySelector(".otherLanguageDefinition").innerHTML = englishDefinition || "no translation saved";
    currentSingleSpanishWord = spanishWord;
    // TODO populate the table with stored sentences
    if (spanishKeyVocab[currentSingleSpanishWord][SENTENCES]) {
        for (let sentence of spanishKeyVocab[currentSingleSpanishWord][SENTENCES]) {
            addSentence(sentence);
        }
    }
}

function showVocabListDiv() {
    setTimeout(() => {
        document.documentElement.scrollTop = document.body.scrollTop = cachedScrollHeightOfSpanishVocab;
    }, 250);
    singleWordView.style.display = "none";
    vocabListDiv.style.display = "inline";
    editEnglishTranslation.innerHTML = "edit";
    englishTranslationEntry.style.display = "none";
    // For each sentence in the sentence table, construct an new array for the sentences to save, then save
    const newSentencesArrayForThisWord = [];
    for (let textArea of sentencesTable.querySelectorAll("textarea")) {
        if (textArea.value !== "") newSentencesArrayForThisWord.push(textArea.value);
    }
    spanishKeyVocab[currentSingleSpanishWord][SENTENCES] = newSentencesArrayForThisWord;
    saveSpanishKeyVocab();
    currentSingleSpanishWord = null;
    clearSentences();
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
