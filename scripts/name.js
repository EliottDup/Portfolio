let title = document.getElementById("title");
let nameElement = document.getElementById("name");
let abtElement = document.getElementById("row2");
let goDown = document.getElementById("row3");

let chars = "!<>-_\\/[]{}—=+*^?#______";
let name = "Eliott Duparc";
let row2 = " My main hobbies are {Programming}, {Gaming} and {Freerunning}";

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

async function scrambler(
  wordToScramble,
  htmlthing,
  prefix = "",
  speed = 50,
  shufflespeed = 1 / 3
) {
  htmlthing.innerHTML = prefix;
  await sleep(speed);
  for (let i = 0; i < wordToScramble.length + 1; i += shufflespeed) {
    let innerHTML =
      wordToScramble.slice(0, i) + getRandomString(wordToScramble.length - i);

    for (let j = 0; j < wordToScramble.length; j++) {
      if (wordToScramble[j] == " ") {
        innerHTML =
          innerHTML.substring(0, j) + " " + innerHTML.substring(j + 1);
      }
    }
    htmlthing.innerHTML = prefix + innerHTML;
    if (innerHTML == wordToScramble) {
      return;
    }
    await sleep(speed);
  }
  htmlthing.innerHTML = prefix + wordToScramble;
  return;
}

async function type(
  wordTotype,
  htmlthing,
  prefix = "",
  suffix = "",
  speed,
  spaceDelay = 0
) {
  htmlthing.innerHTML = prefix;
  for (let i = 0; i < wordTotype.length + 1; i++) {
    let innerHTML = wordTotype
      .slice(0, i)
      .replace(/:/g, "")
      .replace(/{/g, '<span class="purple">')
      .replace(/}/g, "</span>");

    htmlthing.innerHTML = prefix + innerHTML;
    if (wordTotype[i] == ":") {
      await sleep(spaceDelay);
    }
    await sleep(speed);
  }

  htmlthing.innerHTML =
    prefix +
    wordTotype
      .replace(/:/g, "")
      .replace(/{/g, '<span class="purple">')
      .replace(/}/g, "</span>") +
    suffix;
  return;
}

async function start() {
  await scrambler(name, nameElement, "", 40, 1 / 2);
  await sleep(300);
  await type(row2, abtElement, ">", "", 30);
  await sleep(10000);
  await type(
    " What are you waiting for? :Go check out my work! ",
    goDown,
    '> <span class="purple">V</span>',
    '<span class="purple">V</span>',
    25,
    500
  );
}

start();
