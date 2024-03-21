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

    this.consoleBacklogNode.innerHTML += userInput;
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
        this.Read(args[0]);
        break;
      }
      default: {
        this.Log("ERROR: '" + command + "' IS NOT A RECOGNISED COMMAND");
        break;
      }
    }

    this.consoleBacklogNode.innerHTML += "$ " + fs.currentLocation + " > ";
  }

  Read(adress) {
    let file1 = this.filesystem.GetFromAdress(fs.currentLocation + adress);
    if (file1 == null) {
      console.log("null");
      return;
    }
    this.Log(file1.data);
  }

  Log(string) {
    this.consoleBacklogNode.innerHTML += "<br>" + string + "<br><br>";
  }
}

let file1 = new ConsoleFile(
  "file01.log",
  "2024-03-21",
  "7:18",
  "testing lets hope this works"
);

let folder1 = new ConsoleFolder("folder1", "2024-03-21", "7:18", [file1], []);
let folder2 = new ConsoleFolder("folder2", "2024-03-21", "7:29", [], []);
let rootFolder = new ConsoleFolder(
  "root",
  "2024-03-21",
  "7:20",
  [],
  [folder1, folder2]
);
let fs = new ConsoleFileSystem([rootFolder]);

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
