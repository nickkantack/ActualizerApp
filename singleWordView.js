
addSentenceButton.addEventListener("click", () => {
    addSentence();
});

function addSentence(sentence) {
    const newRow = sentencesTable.insertRow(sentencesTable.rows.length - 1);
    const textArea = sentencesTextareaTemplate.content.cloneNode(true).querySelector("textarea");
    const cell = newRow.insertCell(0);
    cell.appendChild(textArea);

    textArea.addEventListener("focus", () => {
        textArea.classList.remove("unfocusedTextArea");
        textArea.classList.add("focusedTextArea");
    });
    textArea.addEventListener("focusout", () => {
        if (textArea.value === "") {
            textArea.parentNode.remove(textArea);
        } else {
            textArea.classList.remove("focusedTextArea");
            textArea.classList.add("unfocusedTextArea");
        }
        saveCurrentSentences();
    });

    if (sentence) {
        textArea.value = sentence;
        textArea.classList.add("unfocusedTextArea");
    } else {
        textArea.focus();
    }
}

/*
This method is used to remove all of the sentence textareas when navigating away from the single word view,
so that when it is loaded again it can assume the table is empty.
*/
function clearSentences() {
    for (let i = sentencesTable.rows.length - 2; i >= 0; i--) {
        sentencesTable.deleteRow(0);
    }
}
