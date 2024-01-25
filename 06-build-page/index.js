const fs = require('fs').promises;
const path = require('path');

const distPath = path.join(__dirname, 'project-dist');
const styleSrcPath = path.join(__dirname, 'styles');
const stylesDistPath = path.join(distPath, 'style.css');

async function createDistFolder() {
  try {
    await fs.mkdir(distPath, { recursive: true });
  } catch (err) {
    console.error(err);
  }
}

createDistFolder();

async function getStyles() {
  try {
    const sheets = await fs.readdir(styleSrcPath);
    let bundle = '';

    for (const sheet of sheets) {
      const pathToSheet = path.join(styleSrcPath, sheet);

      const stats = await fs.stat(pathToSheet);
      if (stats.isFile() && path.extname(sheet) === '.css') {
        const content = await fs.readFile(pathToSheet, 'utf-8');
        bundle += content + '\n';
      }
    }

    await fs.writeFile(stylesDistPath, bundle);
  } catch (err) {
    console.error(err);
  }
}

getStyles();

async function copyAssets(srcPath, destPath) {
  try {
    const items = await fs.readdir(srcPath);

    for (const item of items) {
      const srcItemPath = path.join(srcPath, item);
      const destItemPath = path.join(destPath, item);

      const stats = await fs.stat(srcItemPath);

      if (stats.isDirectory()) {
        await fs.mkdir(destItemPath, { recursive: true });
        await copyAssets(srcItemPath, destItemPath);
      } else {
        await fs.copyFile(srcItemPath, destItemPath);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function assetsCopy() {
  try {
    const assetsSrcPath = path.join(__dirname, 'assets');
    const foldersCopy = path.join(distPath, 'assets');

    await copyAssets(assetsSrcPath, foldersCopy);
  } catch (err) {
    console.error(err);
  }
}

assetsCopy();

async function renderTemplate() {
  try {
    const componentsPath = path.join(__dirname, 'components');
    const templatePath = path.join(__dirname, 'template.html');
    const indexPath = path.join(distPath, 'index.html');

    let templateContent = await fs.readFile(templatePath, 'utf-8');

    const componentFiles = await fs.readdir(componentsPath);

    for (const file of componentFiles) {
      if (path.extname(file) === '.html') {
        const componentContent = await fs.readFile(
          path.join(componentsPath, file),
          'utf-8',
        );

        const placeholder = `{{${path.basename(file, '.html')}}}`;
        if (templateContent.includes(placeholder)) {
          templateContent = templateContent.replaceAll(
            placeholder,
            componentContent,
          );
        }
      }
    }

    await fs.writeFile(indexPath, templateContent);
  } catch (err) {
    console.error(err);
  }
}

renderTemplate();
