const paragraphs = document.getElementsByClassName("paragraph");
console.log(paragraphs);

if (paragraphs) {
  for (let paragaph of paragraphs) {
    highlight(paragaph);
  }
}

function highlight(p) {
  let textContent = p.textContent;

  let highlightedwords = textContent.match(/\\{([^\\}]+)\\}/g);
  console.log(highlightedwords);
}
