const fs = require('fs');
const path = require('path');

const pathToText = path.join(__dirname, 'text.txt');
const read = fs.createReadStream(pathToText, 'utf-8');

read.on('data', (chunk) => {
  console.log(chunk);
});
