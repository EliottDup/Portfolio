class Console {
  userInputNode;
  consoleBacklogNode;
  commandHistory = [];
  historyIndex = -1;
  lastInput;
  filesystem;

  constructor(userInput, consoleText, filesystem) {
    this.userInputNode = userInput;
    this.consoleBacklogNode = consoleText;
    this.filesystem = filesystem;
  }

  Init() {
    this.userInputNode = document.getElementById("consoleUserInput");
    this.consoleBacklogNode = document.getElementById("consoleText");
  }

  Execute() {
    this.Read("aa");
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
      case "COMMANDS": {
        this.Log("LIST, READ, CD, COMMANDS, CLS<br><br>");
        break;
      }
      case "CD": {
        if (args.length == 1) {
          fs.Move(args[0]);
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

    this.Log(fs.currentadress + ">");
    console.log(fs.currentadress);
  }

  Read(adress) {
    let file1 = this.filesystem.GetFromAdress([...fs.currentLocation, adress]);
    if (file1 == null) {
      console.log("null");
      return;
    }
    this.Log(file1.data + "<br><br>");
  }

  Log(string, toupper = false) {
    if (toupper) {
      this.consoleBacklogNode.innerHTML += string.toUpperCase();
      return;
    }
    this.consoleBacklogNode.innerHTML += string;
  }

  List(args) {
    let list = fs.GetList();
    this.Log(list + "<br>", true);
  }
}

//test population

let file1 = new ConsoleFile(
  "file01.log",
  "2024-03-21",
  "07:18",
  "this is file01!! yay"
);

let file2 = new ConsoleFile(
  "FILE_3ETAS.log",
  "2024-03-21",
  "08:34",
  "Wow, I am reading this file now!!"
);

let file3 = new ConsoleFile(
  "FILE3.log",
  "2024-03-21",
  "15:19",
  "hallo daar, hoe is het?"
);

let folder1 = new ConsoleFolder("folder1", "2024-03-21", "20:30", [file2], []);
let folder2 = new ConsoleFolder("folder2", "2024-03-21", "07:29", [file3], []);
let rootFolder = new ConsoleFolder(
  "root",
  "2024-03-21",
  "07:20",
  [file1],
  [folder1, folder2]
);
let fs = new ConsoleFileSystem([rootFolder]);

//end test population

let CMD = new Console(
  document.getElementById("consoleUserInput"),
  document.getElementById("consoleText"),
  fs
);
// CMD.Init();

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();

    CMD.Execute();
  }
});
