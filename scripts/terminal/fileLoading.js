async function LoadFiles() {
  let fileSystem;
  await fetch("scripts/terminal/files.json")
    .then((response) => response.json())
    .then((data) => {
      let drives = [];
      data.drives.forEach((drive) => {
        drives.push(MakeFolder(drive));
      });
      fileSystem = new TerminalFileSystem(drives);
    });
  return fileSystem;
}

function MakeFolder(data) {
  let name = data.name;
  let date = data.date;
  let time = data.time;
  let folders = [];
  let files = [];
  if (data.folders != undefined) {
    data.folders.forEach((folder) => {
      folders.push(MakeFolder(folder));
    });
  }
  data.files.forEach((file) => {
    files.push(MakeFile(file));
  });

  return new TerminalFolder(name, date, time, files, folders);
}

function MakeFile(file) {
  let name = file.name;
  let date = file.date;
  let time = file.time;
  let data = file.data;
  return new TerminalFile(name, date, time, data);
}
