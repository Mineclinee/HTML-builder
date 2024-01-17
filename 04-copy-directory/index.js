const fs = require('fs');
const path = require('path');
const { readdir, mkdir, copyFile, unlink } = require('fs/promises');

const pathToFolder = path.join(__dirname, 'files');
const pathToCopyFolder = path.join(__dirname, 'files-copy');

async function createFolder() {
  try {
    await mkdir(pathToCopyFolder, { recursive: true });
  } catch (err) {
    console.error(err);
  }
}

createFolder();

async function createCopyOfFolder() {
  try {
    const filesOrig = await readdir(pathToFolder);
    const filesCopy = await readdir(pathToCopyFolder);

    const filesExist = filesCopy.filter((file) => !filesOrig.includes(file));

    for (const file of filesExist) {
      await unlink(path.join(__dirname, 'files-copy', file));
    }

    for (const file of filesOrig) {
      const pathToFile = path.join(__dirname, 'files', file);
      const pathToNewFile = path.join(__dirname, 'files-copy', file);

      fs.stat(pathToFile, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }

        if (stats.isFile()) {
          copyFile(pathToFile, pathToNewFile);
          console.log(`${file} - was copied`);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
}

createCopyOfFolder();
