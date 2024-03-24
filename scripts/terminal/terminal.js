class Terminal {
  userInputNode;
  terminalBacklogNode;
  terminalTitle;
  commandHistory = [];
  historyIndex = -1;
  lastInput;
  filesystem;
  startMessage;

  constructor(userInput, terminalText, terminalTitle, filesystem) {
    this.userInputNode = userInput;
    this.terminalBacklogNode = terminalText;
    this.terminalTitle = terminalTitle;
    this.filesystem = filesystem;
    this.startMessage =
      "<br>ELIOTT.NL [" +
      version +
      ']<br><br>TYPE "COMMANDS" FOR A LIST OF COMMANDS<br><br>';
    this.terminalBacklogNode.innerHTML =
      this.startMessage + this.filesystem.currentadress + ">";
    this.terminalTitle.innerHTML = this.filesystem.currentadress;
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
        this.terminalBacklogNode.innerHTML = this.startMessage;
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
        this.Log("LIST<BR>READ<BR>CD<BR>COMMANDS<BR>CLS<br>MESH<br><br>");
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
          let result = this.filesystem.Move(args[0]);
          if (result == -1) {
            this.Log("ERROR: NO FOLDER AT '" + args.join("/") + "'<br>");
          }
          this.Log("<br>");
          break;
        }
        this.Log("ERROR: ARGUMENT COUNT INCORRECT<br><br>");
        break;
      }
      case "MESH": {
        try {
          voronoi = !voronoi;
        } catch (error) {
          this.Log("Error: NO MESH FOUND<br><br>");
        }
        break;
      }
      case "Q": {
        CloseTerminal();
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
    this.terminalTitle.innerHTML = this.filesystem.currentadress;
    let terminalBody = this.terminalBacklogNode.parentElement;
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  Read(adress) {
    let file1 = this.filesystem.GetFromAdress([
      ...this.filesystem.currentLocation,
      ...adress.split("/"),
    ]);
    if (file1 == null) {
      this.Log("ERROR: FILE '" + adress + "' NOT FOUND<br><br>");
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
      this.terminalBacklogNode.innerHTML += string.toUpperCase();
      return;
    }
    this.terminalBacklogNode.innerHTML += string;
  }

  List(args) {
    let list = this.filesystem.GetList();
    this.Log(list + "<br>", true);
  }
}

async function CreateTerminal() {
  let filesystem = await LoadFiles();

  let CMD = new Terminal(
    document.getElementById("terminalUserInput"),
    document.getElementById("terminalText"),
    document.getElementById("terminalheader"),
    filesystem
  );

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();

      CMD.Execute();
    }
  });
  return CMD;
}

CreateTerminal();
