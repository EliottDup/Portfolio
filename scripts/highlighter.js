function highlight() {
  const paragraphs = document.getElementsByClassName("paragraph");

  if (paragraphs) {
    for (let i = 0; i < paragraphs.length; i++) {
      highlight(paragraphs[i]);
    }
  }

  function highlight(p) {
    let textContent = p.textContent;

    let highlightedWords = textContent.match(/\\{([^\\}]+)\\}/g);
    if (highlightedWords) {
      highlightedWords.forEach((word) => {
        const highlightedText = word.slice(2, -2);
        const spanElement = document.createElement("span");

        spanElement.classList.add("highlight");
        spanElement.textContent = highlightedText;

        p.innerHTML = p.innerHTML.replace(word, spanElement.outerHTML);
      });
    }
  }
}
