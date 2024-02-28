//animations
let title = document.getElementById("title");
let nameElement = document.getElementById("name");
let abtElement = document.getElementById("row2");
let goDown = document.getElementById("row3");

//age
let age = document.getElementsByClassName("age");

let chars = "!<>-_\\/[]{}—=+*^?#______";
let name = "Eliott Duparc";
let row2 = " My main hobbies are {Programming}, {Gaming} and {Freerunning}";

function Sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function GetRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function GetRandomString(length) {
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars[GetRandomInt(chars.length)];
  }
  return str;
}

async function Scrambler(
  wordToScramble,
  htmlthing,
  prefix = "",
  speed = 50,
  shufflespeed = 1 / 3
) {
  htmlthing.innerHTML = prefix;
  await Sleep(speed);
  for (let i = 0; i < wordToScramble.length + 1; i += shufflespeed) {
    let innerHTML =
      wordToScramble.slice(0, i) + GetRandomString(wordToScramble.length - i);

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
    await Sleep(speed);
  }
  htmlthing.innerHTML = prefix + wordToScramble;
  return;
}

async function Type(
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
      .replace(/ඞ/g, "")
      .replace(/{/g, '<span class="highlight">')
      .replace(/}/g, "</span>");

    htmlthing.innerHTML = prefix + innerHTML;
    if (wordTotype[i] == "ඞ") {
      await Sleep(spaceDelay);
    }
    await Sleep(speed);
  }

  htmlthing.innerHTML =
    prefix +
    wordTotype
      .replace(/ඞ/g, "")
      .replace(/{/g, '<span class="highlight">')
      .replace(/}/g, "</span>") +
    suffix;
  return;
}

async function StartAnimation() {
  await Scrambler(name, nameElement, "", 40, 1 / 2);
  await Sleep(300);
  await Type(row2, abtElement, ">", "", 30);
  await Sleep(1000);
  await Type(
    " What are you waiting for? ඞGo check out my work! ",
    goDown,
    '<span class="purple">V</span>',
    '<span class="purple">V</span>',
    25,
    500
  );
}

function UpdateAge() {
  var today = new Date();
  var birthDate = new Date("2006/06/07");
  var myAge = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    myAge--;
  }
  for (let i = 0; i < age.length; i++) {
    age[i].innerHTML = myAge;
  }
}
