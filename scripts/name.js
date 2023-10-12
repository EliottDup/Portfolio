let doc = document.getElementById("name");

let chars = "!<>-_\\/[]{}—=+*^?#______";
let word = "Eliott Duparc";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomString(length) {
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars[getRandomInt(chars.length)];
  }
  return str;
}

async function scrambler() {
  for (let i = 0; i < word.length + 1; i += 1 / 3) {
    let innerHTML = word.slice(0, i) + getRandomString(word.length - i);

    for (let j = 0; j < word.length; j++) {
      if (word[j] == " ") {
        console.log(j);
        innerHTML =
          innerHTML.substring(0, j) + " " + innerHTML.substring(j + 1);
      }
    }
    doc.innerHTML = innerHTML;
    await sleep(50);
  }
}

scrambler();
