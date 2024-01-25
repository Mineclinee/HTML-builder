const fs = require('fs');
const path = require('path');
const { stdin, exit } = process;

const pathToText = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathToText);

console.log('Hey! Please, enter a text:');

stdin.on('data', (chunk) => {
  if (chunk.toString().includes('exit')) exit();
  output.write(chunk);
});

process.on('SIGINT', () => {
  exit();
});

process.on('exit', () => {
  console.log('File saved. Thank you!');
});
