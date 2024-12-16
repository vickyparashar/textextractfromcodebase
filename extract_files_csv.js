const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function readDirRecursive(dirPath, outputFile) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);

    // Skip .git folder
    if (file === '.git') return;

    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // Recursively call for directories
      readDirRecursive(fullPath, outputFile);
    } else {
      // Process the file
      extractFileContent(fullPath, outputFile);
    }
  });
}

function extractFileContent(filePath, outputFile) {
  const fileContent = fs.readFileSync(filePath, 'utf8'); // Read the entire content of the file

  const outputData = `File Path: ${filePath}\nContent:\n${fileContent}\n\n`;
  fs.appendFileSync(outputFile, outputData);
  console.log(`Processed: ${filePath}`);
}

function extractProjectFiles(projectPath, outputFile) {
  if (!fs.existsSync(outputFile)) {
    fs.writeFileSync(outputFile, ''); // Create the output file if it doesn't exist
  }

  readDirRecursive(projectPath, outputFile);
}

rl.question('Please enter the project root directory path: ', (projectPath) => {
  const projectName = path.basename(projectPath); // Extract project name from the path
  const outputFile = `${projectName}_complete_code.txt`; // Use project name as the output file

  if (!projectPath) {
    console.log('Project path is required.');
    rl.close();
    process.exit(1);
  }

  extractProjectFiles(projectPath, outputFile);
  console.log(`All project files have been extracted to ${outputFile}`);
  rl.close();
});
