class Console {
  userInputNode;
  consoleBacklogNode;
  consoleTitle;
  commandHistory = [];
  historyIndex = -1;
  lastInput;
  filesystem;

  constructor(userInput, consoleText, consoleTitle, filesystem) {
    this.userInputNode = userInput;
    this.consoleBacklogNode = consoleText;
    this.consoleTitle = consoleTitle;
    this.filesystem = filesystem;
  }

  Execute() {
    let userInput = this.userInputNode.innerHTML;
    if (userInput == "") return;
    this.commandHistory.push(userInput);

    this.Log(" " + userInput + "<br>");
    let splitInput = userInput.split(" ");

    let args = splitInput.slice(1);
    let command = splitInput[0].toUpperCase();

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
      case "READ": {
        if (args.length == 1) {
          this.Read(args[0]);
          break;
        }
        this.Log("ERROR: ARGUMENT COUNT INCORRECT<br><br>");
        break;
      }
      case "LIST": {
        if (args.length == 0) {
          this.List();
          break;
        }
        this.log("ERROR: TOO MANY ARGUMENTS<br><br>");
        break;
      }
      case "HELP":
      case "COMMANDS": {
        this.Log("LIST, READ, CD, COMMANDS, CLS<br><br>");
        break;
      }
      case "DRIVE": {
        if (args.length == 1) {
          this.Drive(args[0]);
          break;
        }
        this.Log("ERROR: ARGUMENT COUNT INCORRECT<br><br>");
        break;
      }
      case "CD": {
        if (args.length == 1) {
          this.filesystem.Move(args[0]);
          this.Log("<br>");
          break;
        }
        this.Log("ERROR: ARGUMENT COUNT INCORRECT<br><br>");
        break;
      }
      default: {
        this.Log(
          "ERROR: '" + command + "' IS NOT A RECOGNISED COMMAND<br><br>"
        );
        break;
      }
    }

    this.Log(this.filesystem.currentadress + ">");
    this.consoleTitle.innerHTML = this.filesystem.currentadress;
  }

  Read(adress) {
    console.log([...this.filesystem.currentLocation, ...adress.split("/")]);

    let file1 = this.filesystem.GetFromAdress([
      ...this.filesystem.currentLocation,
      ...adress.split("/"),
    ]);
    if (file1 == null) {
      console.log("null");
      return;
    }
    this.Log("<br>################<br><br>");
    this.Log(file1.data + "<br>");
    this.Log("<br>################<br><br>");
  }

  Drive(dest) {
    this.Log(this.filesystem.SwitchDrive(dest) + "<br><br>");
  }

  Log(string, toupper = false) {
    if (toupper) {
      this.consoleBacklogNode.innerHTML += string.toUpperCase();
      return;
    }
    this.consoleBacklogNode.innerHTML += string;
  }

  List(args) {
    let list = this.filesystem.GetList();
    this.Log(list + "<br>", true);
  }
}

async function CreateConsole() {
  let filesystem = await LoadFiles();

  let CMD = new Console(
    document.getElementById("consoleUserInput"),
    document.getElementById("consoleText"),
    document.getElementById("consoleheader"),
    filesystem
  );

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();

      CMD.Execute();
    }
  });
}

CreateConsole();
