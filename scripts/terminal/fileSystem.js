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

class TerminalFile extends FileData {
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

class TerminalFolder extends FileData {
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
    }
    if (adress.length == 1 && adress[0].includes(".")) {
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

class TerminalFileSystem {
  drives = [];

  currentLocation;

  constructor(drives) {
    this.drives = drives;
    this.currentLocation = [drives[0].name];
  }

  GetFromAdress(adress) {
    let splitAdress = adress;
    splitAdress = this.RemoveParentLinks(splitAdress);
    for (let i = 0; i < this.drives.length; i++) {
      if (this.drives[i].name == splitAdress[0]) {
        return this.drives[i].Find(splitAdress.slice(1));
      }
    }
    return splitAdress[0];
  }

  RemoveParentLinks(adress) {
    let changedadress = [...adress];
    const hasParentLinks = (element) => element == "..";
    let i = changedadress.findIndex(hasParentLinks);
    while (i > 1) {
      changedadress.splice(i - 1, 2);
      i = changedadress.findIndex(hasParentLinks);
    }
    return changedadress;
  }

  GetList() {
    return this.GetFromAdress(this.currentLocation).List();
  }

  Move(input) {
    let destination = input.split("/");
    destination = destination.filter(String);

    mainloop: for (let i = 0; i < destination.length; i++) {
      if (destination[i] == ".." && this.currentLocation.length != 1) {
        this.currentLocation = this.currentLocation.slice(0, -1);
        continue mainloop;
      }

      let currentFolder = this.GetFromAdress(this.currentLocation);

      for (let j = 0; j < currentFolder.folders.length; j++) {
        if (
          currentFolder.folders[j].name.toUpperCase() ==
          destination[i].toUpperCase()
        ) {
          this.currentLocation.push(currentFolder.folders[j].name);
          continue mainloop;
        }
      }
      return -1;
    }
    return 0;
  }

  SwitchDrive(dest) {
    for (let i = 0; i < this.drives.length; i++) {
      if (this.drives[i].name.toUpperCase() == dest.toUpperCase()) {
        this.currentLocation = [this.drives[i].name];
        return (
          'SUCCESSFULLY SWITCHED TO "' +
          this.drives[i].name.toUpperCase() +
          '" DRIVE'
        );
      }
      return 'ERROR: NO DRIVE NAMED "' + dest.toUpperCase() + '"';
    }
  }

  get currentadress() {
    return this.currentLocation.join("/");
  }
}
