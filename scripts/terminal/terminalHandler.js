let terminalWindow = document.getElementById("terminal");
let terminalInput = document.getElementById("terminalUserInput");
let terminal = CreateTerminal();

let terminalIsOpen = false;

function ToggleTerminal() {
  if (terminalIsOpen) {
    CloseTerminal();
  } else {
    OpenTerminal();
  }
}

terminalWindow.addEventListener("animationend", (event) => {
  let tmp = terminalWindow.classList;
  if (tmp[tmp.length - 1] == "terminalCloseAnim") {
    terminalWindow.style.display = "none";
  } else {
    terminalInput.focus();
  }
  terminalWindow.classList.remove(tmp[tmp.length - 1]);
});

async function OpenTerminal() {
  terminalWindow.style.setProperty(
    "--terminalWidth",
    terminalWindow.style.width
  );
  terminalWindow.style.setProperty(
    "--terminalHeight",
    terminalWindow.style.height
  );
  terminalIsOpen = true;
  terminalWindow.style.display = "block";
  terminalWindow.classList.add("terminalOpenAnim");
}

async function CloseTerminal() {
  terminalWindow.style.setProperty(
    "--terminalWidth",
    terminalWindow.style.width
  );
  terminalWindow.style.setProperty(
    "--terminalHeight",
    terminalWindow.style.height
  );
  terminalIsOpen = false;
  terminalWindow.classList.add("terminalCloseAnim");
}
