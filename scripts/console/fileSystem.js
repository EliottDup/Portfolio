class File {
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

class Folder {
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
}

class FileSystem {
  drives = [];

  constructor(drives) {
    this.drives = drives;
  }
}
