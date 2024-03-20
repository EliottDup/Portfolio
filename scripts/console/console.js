class Console {
  userInputNode = document.getElementById("consoleUserInput");
  consoleBacklogNode = document.getElementById("consoleText");
  commandHistory = [];
  historyIndex = -1;
  lastInput;

  Init() {
    this.userInputNode = document.getElementById("consoleUserInput");
    this.consoleBacklogNode = document.getElementById("consoleText");
  }

  Execute() {
    let userInput = this.userInputNode.innerHTML;
    if (userInput == "") return;
    this.commandHistory.push(userInput);

    this.consoleBacklogNode.innerHTML += userInput;
    let splitInput = userInput.split(" ");

    let args = splitInput.slice(1);
    let command = splitInput[0].toUpperCase();
    console.log(args);
    console.log(command);

    this.userInputNode.innerHTML = "";

    switch (command) {
      case "HELLO": {
        this.Log(args.join(" "));
        break;
      }
      case "CLS": {
        this.consoleBacklogNode.innerHTML = "";
        break;
      }
      default: {
        this.Log("ERROR: '" + command + "' IS NOT A RECOGNISED COMMAND");
        break;
      }
    }

    this.consoleBacklogNode.innerHTML += "$ root > ";
  }

  Log(string) {
    this.consoleBacklogNode.innerHTML += "<br>" + string + "<br><br>";
    console.log(this.consoleBacklogNode.innerHTML);
  }
}

let CMD = new Console();
CMD.Init();

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();

    CMD.Execute();
  }
});
