class ConsoleFile {
  name;
  date;
  time;

  data;

  constructor(name, date, time, data) {
    this.name = name;
    this.date = date;
    this.time = time;
    this.data = data;
  }
}

class ConsoleFolder {
  name;
  date;
  time;

  folders;
  files;

  constructor(name, date, time, files, folders) {
    this.name = name;
    this.date = date;
    this.time = time;
    this.files = files;
    this.folders = folders;
  }

  List() {
    return this.folders.concat(files);
  }

  Find(adress) {
    if (adress.length == 0) {
      return this;
    } else if (adress.length == 1 && adress[0].includes(".")) {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].name == adress[0]) {
          return this.files[i];
        }
      }
    }
    for (let i = 0; i < this.folders.length; i++) {
      if (this.folders[i].name == adress[0]) {
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
    this.currentLocation = drives[0].name;
  }

  GetFromAdress(adress) {
    let splitAdress = adress.split("/").filter(function (el) {
      return el != "";
    });
    for (let i = 0; i < this.drives.length; i++) {
      if (this.drives[i].name == splitAdress[0]) {
        return this.drives[i].Find(splitAdress.slice(1));
      }
    }
    return null;
  }

  List() {}
}
