
addSentence.addEventListener("click", () => {
    const newRow = sentencesTable.insertRow(sentencesTable.rows.length - 1);
    const textArea = sentencesTextareaTemplate.content.cloneNode(true).querySelector("textarea");
    const cell = newRow.insertCell(0);
    cell.appendChild(textArea);
});
