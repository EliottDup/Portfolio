const paragraphs = document.getElementsByClassName("paragraph");

if (paragraphs) {
  paragraphs.forEach((paragaph) => {
    highlight(paragaph);
  });
}

function highlight(p) {
  let textContent = p.textContent;

  let highlightedwords = textContent.match(/\\{ ([^\\}]+) \\}/g);
  console.log(highlightedwords);
}
