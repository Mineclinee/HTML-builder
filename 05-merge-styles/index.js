const fs = require('fs').promises;
const path = require('path');

const srcPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist', 'bundle.css');

async function getStyles() {
  try {
    const sheets = await fs.readdir(srcPath);
    let bundle = '';

    for (const sheet of sheets) {
      const pathToSheet = path.join(srcPath, sheet);

      const stats = await fs.stat(pathToSheet);
      if (stats.isFile() && path.extname(sheet) === '.css') {
        const content = await fs.readFile(pathToSheet, 'utf-8');
        bundle += content + '\n';
      }
    }

    await fs.writeFile(distPath, bundle);
  } catch (err) {
    console.error(err);
  }
}

getStyles();
