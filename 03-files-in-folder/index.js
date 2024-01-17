const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const pathToFolder = path.join(__dirname, 'secret-folder');

async function checkFiles() {
  try {
    const files = await readdir(pathToFolder);
    for (const file of files) {
      const pathToFile = path.join(__dirname, 'secret-folder', file);
      fs.stat(pathToFile, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }

        if (stats.isFile()) {
          const fileinfo = file.split('.');
          const fileName = fileinfo[0];
          const ext = fileinfo[1];
          const size = stats.size / 1024;
          console.log(`${fileName} - ${ext} - ${size.toFixed(3)}kb`);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
}

checkFiles();
