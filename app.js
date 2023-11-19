

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
    if (stagedWord === "") return;
    vocabInput.value = "";
    spanishKeyVocab[stagedWord] = {ENGLISH:"",times:[]};
    refreshTableWithCachedWords();
    window.localStorage.setItem(SPANISH_KEY_VOCAB_KEY, JSON.stringify(spanishKeyVocab));
    showSingleWordView(stagedWord);
    // Since this is the first time we're adding the word, focus the defintion input and make sure it's visible
    if (editEnglishTranslation.innerHTML === "edit") toggleEnglishDefinitionEdit();
});

backToVocabList.addEventListener("click", () => {
    // Whatever's in the definition edit if we're editing, just save it
    if (editEnglishTranslation.innerHTML === "save") toggleEnglishDefinitionEdit();
    // TODO consider doing the same for newly added sentences
    showVocabListDiv();
});
editEnglishTranslation.addEventListener("click", toggleEnglishDefinitionEdit);

graduateButton.addEventListener("click", () => {
    graduateWord(currentSingleSpanishWord);
});

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
        refreshStatistics();
    }, 1000, () => {
        newRow.querySelector(".removeVocabWord").querySelector("svg").classList.remove("deleteButtonActive");
        for (let path of newRow.querySelector(".removeVocabWord").querySelectorAll("path")) {
            path.classList.remove("deleteButtonActive");
        }
        console.log("Time is up");
    });
    // Attach listener for the info button
    newRow.querySelector(".vocabWordDisplayCell").addEventListener("click", () => {
        showSingleWordView(spanishWord);
    });
    newRow.querySelector(".statsClass").innerHTML = spanishKeyVocab[spanishWord] && spanishKeyVocab[spanishWord].hasOwnProperty(SENTENCES) ? 
        spanishKeyVocab[spanishWord][SENTENCES].length : 0;
    // Style the row as a graduatable word if so
    if (spanishKeyVocab[spanishWord] && isWordGraduationEligible(spanishWord)) newRow.querySelector(".vocabWordDisplayDiv").classList.add("graduationEligible");

    vocabListTable.appendChild(newRow);
}

function refreshTableWithCachedWords() {
    for (let i = vocabListTable.children.length - 1; i >= 0; i--) vocabListTable.removeChild(vocabListTable.children[i]);
    // TODO create a list of spanishWordKeys and order them alphabetically
    const spanishKeysInOrder = Object.keys(spanishKeyVocab);
    spanishKeysInOrder.sort();
    for (let spanishWord of spanishKeysInOrder) addWordToTable(spanishWord);
    refreshStatistics();
}

function refreshStatistics() {
    // Update top level statistics
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
    totalWords.innerHTML = `${Object.keys(spanishKeyVocab).length} words, ${truncatedDecimal} ${unit}`;
    // Update stats in each row
    for (let vocabDivInTable of vocabListTable.querySelectorAll(".vocabListRow")) {
        const spanishWord = vocabDivInTable.querySelector(".vocabWordDisplayDiv").innerHTML;
        const sentenceCount = spanishKeyVocab[spanishWord] && spanishKeyVocab[spanishWord].hasOwnProperty(SENTENCES) ? spanishKeyVocab[spanishWord][SENTENCES].length : 0;
        vocabDivInTable.querySelector(".statsClass").innerHTML = sentenceCount;
        if (isWordGraduationEligible(spanishWord)) { 
            vocabDivInTable.classList.add("graduationEligible");
        } else {
            vocabDivInTable.classList.remove("graduationEligible");
        }
    }
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
        sentenceCount.innerHTML = `Sentence count: ${spanishKeyVocab[currentSingleSpanishWord][SENTENCES].length}/${NUM_SENTENCES_REQUIRED}`;
        for (let sentence of spanishKeyVocab[currentSingleSpanishWord][SENTENCES]) {
            addSentence(sentence);
        }
    } else {
        sentenceCount.innerHTML = `Sentence count: 0/${NUM_SENTENCES_REQUIRED}`;
    }
    const quizSuccessesCount = (spanishKeyVocab[currentSingleSpanishWord].times || []).filter(x => x <= MILLIS_TO_GRADUATE).length;
    quizResults.innerHTML = `Quiz successes: ${quizSuccessesCount}/${MAX_TIME_QUEUE_LENGTH}`;
    showGraduateButtonIfAppropriate();
}

function showGraduateButtonIfAppropriate() {
    if (isWordGraduationEligible(currentSingleSpanishWord)) {
        graduateButton.style.display = "inline";
    } else {
        graduateButton.style.display = "none";
    }
}

function isWordGraduationEligible(spanishWord) {
    const quizSuccessesCount = (spanishKeyVocab[spanishWord].times || []).filter(x => x <= MILLIS_TO_GRADUATE).length;
    return quizSuccessesCount >= MAX_TIME_QUEUE_LENGTH && spanishKeyVocab[spanishWord][SENTENCES].length >= NUM_SENTENCES_REQUIRED;
}

function showVocabListDiv() {
    setTimeout(() => {
        document.documentElement.scrollTop = document.body.scrollTop = cachedScrollHeightOfSpanishVocab;
    }, 100);
    singleWordView.style.display = "none";
    vocabListDiv.style.display = "inline";
    editEnglishTranslation.innerHTML = "edit";
    singleWordTranslation.style.display = "inline";
    englishTranslationEntry.style.display = "none";
    // For each sentence in the sentence table, construct an new array for the sentences to save, then save
    saveCurrentSentences();
    currentSingleSpanishWord = null;
    clearSentences();
    refreshStatistics();
}

function saveCurrentSentences() {
    const newSentencesArrayForThisWord = [];
    for (let textArea of sentencesTable.querySelectorAll("textarea")) {
        if (textArea.value !== "") newSentencesArrayForThisWord.push(textArea.value);
    }
    spanishKeyVocab[currentSingleSpanishWord][SENTENCES] = newSentencesArrayForThisWord;
    sentenceCount.innerHTML = `Sentence count: ${spanishKeyVocab[currentSingleSpanishWord][SENTENCES].length}/${NUM_SENTENCES_REQUIRED}`;
    saveSpanishKeyVocab();
    showGraduateButtonIfAppropriate();
}

function toggleEnglishDefinitionEdit() {
    if (editEnglishTranslation.innerHTML === "edit") {
        editEnglishTranslation.innerHTML = "save";
        englishTranslationEntry.style.display = "inline";
        singleWordTranslation.style.display = "none";
        englishTranslationEntry.value = spanishKeyVocab[currentSingleSpanishWord][ENGLISH] || "";
        englishTranslationEntry.focus();
    } else {
        editEnglishTranslation.innerHTML = "edit";
        englishTranslationEntry.style.display = "none";
        singleWordTranslation.style.display = "inline";
        singleWordTranslation.innerHTML = englishTranslationEntry.value;
        // change the local data cache
        spanishKeyVocab[currentSingleSpanishWord][ENGLISH] = englishTranslationEntry.value;
        saveSpanishKeyVocab();
    }
}
