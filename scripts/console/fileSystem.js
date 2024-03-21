class FileData {
  name;
  date;
  time;
  isDir;
  size;

  constructor(name, date, time, isDir = false, size = 0) {
    this.name = name;
    this.date = date;
    this.time = time;
    this.isDir = isDir;
    this.size = size;
  }

  GetStringData(dist) {
    let string = this.date + "  " + this.time + "  ";
    let info = "";
    if (this.isDir) string += "&lt;DIR&gt;" + " ".repeat(dist - 5) + this.name;
    else
      string +=
        this.size +
        "b" +
        " ".repeat(dist - (this.size + "b").length) +
        this.name;
    return string;
  }

  GetDataSize() {
    return Math.max((this.size + "b").length, 5);
  }
}

class ConsoleFile extends FileData {
  name;
  date;
  time;

  data;

  constructor(name, date, time, data) {
    super(name, date, time, false, data.length * 8);
    this.name = name;
    this.date = date;
    this.time = time;
    this.data = data;
  }
}

class ConsoleFolder extends FileData {
  name;
  date;
  time;

  folders;
  files;

  constructor(name, date, time, files, folders) {
    super(name, date, time, true);
    this.name = name;
    this.date = date;
    this.time = time;
    this.files = files;
    this.folders = folders;
  }

  List() {
    let combined = this.folders.concat(this.files);
    combined.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      return 1;
    });
    let string = "";
    let space = 0;
    for (let i = 0; i < combined.length; i++) {
      space = Math.max(combined[i].GetDataSize(), space);
    }
    for (let i = 0; i < combined.length; i++) {
      string += combined[i].GetStringData(space + 2) + "<br>";
    }
    return string;
  }

  Find(adress) {
    if (adress.length == 0) {
      return this;
    } else if (adress.length == 1 && adress[0].includes(".")) {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].name.toUpperCase() == adress[0].toUpperCase()) {
          return this.files[i];
        }
      }
    }
    for (let i = 0; i < this.folders.length; i++) {
      if (this.folders[i].name.toUpperCase() == adress[0].toUpperCase()) {
        return this.folders[i].Find(adress.slice(1));
      }
    }
    return null;
  }
}

class ConsoleFileSystem {
  drives = [];

  currentLocation;

  constructor(drives) {
    this.drives = drives;
    this.currentLocation = [drives[0].name];
  }

  GetFromAdress(adress) {
    let splitAdress = adress;
    for (let i = 0; i < this.drives.length; i++) {
      if (this.drives[i].name == splitAdress[0]) {
        return this.drives[i].Find(splitAdress.slice(1));
      }
    }
    return splitAdress[0];
  }

  GetList() {
    return this.GetFromAdress(this.currentLocation).List();
  }

  Move(input) {
    let destination = input.split("/");
    for (let i = 0; i < input.length; i++) {
      if (destination[i] == ".." && this.currentLocation.length != 1) {
        this.currentLocation = this.currentLocation.slice(0, -1);
        continue;
      }

      let currentFolder = this.GetFromAdress(this.currentLocation);

      for (let j = 0; j < currentFolder.folders.length; j++) {
        if (currentFolder.folders[j].name == destination[i]) {
          this.currentLocation.push(destination[i]);
          break;
        }
      }
    }
  }

  get currentadress() {
    return this.currentLocation.join("/");
  }
}
