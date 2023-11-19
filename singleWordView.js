
addSentenceButton.addEventListener("click", () => {
    addSentence();
});

function addSentence(sentence) {
    const newRow = sentencesTable.insertRow(sentencesTable.rows.length - 1);
    const mainDiv = sentencesTextareaTemplate.content.cloneNode(true).querySelector("div");
    const textArea = mainDiv.querySelector("textarea");
    const lockedInDiv = mainDiv.querySelector("div.lockedInTextDiv");
    const cell = newRow.insertCell(0);
    cell.appendChild(mainDiv);

    const editButton = document.createElement("button");

    textArea.addEventListener("focusout", () => {
        if (textArea.value === "") {
            newRow.remove(newRow.querySelector("tr"));
        } else {
            textArea.style.display = "none";
            lockedInDiv.style.display = "block";
            lockedInDiv.innerHTML = textArea.value;
            textArea.disabled = true;
            editButton.style.display = "block";
        }
        saveCurrentSentences();
    });

    const rightCell = newRow.insertCell(1);
    rightCell.style.width = "1%";
    editButton.classList.add("editSentenceButton");
    editButton.innerHTML = "edit";
    editButton.addEventListener("click", () => {
        lockedInDiv.style.display = "none";
        textArea.style.display = "block";
        textArea.disabled = false;
        textArea.focus();
        editButton.style.display = "none";
    });
    rightCell.appendChild(editButton);

    // TODO plan to add another cell that is small and has an edit button. The textarea will remain 
    // disabled unless this button is pressed and the button will toggle to a save, but we will still
    // save the sentence on focus out and on back button press.

    if (sentence) {
        textArea.value = sentence;
        textArea.style.display = "none";
    } else {
        editButton.style.display = "none";
        lockedInDiv.style.display = "none";
        textArea.focus();
    }
    lockedInDiv.innerHTML = textArea.value;
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
