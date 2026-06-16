const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const srcDir = path.resolve('c:/Users/opg21/OneDrive/Desktop/Work 🍃/exam 01/src');

walkDir(srcDir, function(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('console.log')) {
      // Replace console.log(...) with empty string or void 0
      // This simple regex handles basic cases. It matches console.log followed by anything up to the balancing parenthesis.
      // For a truly safe removal, it's better to just comment out the line if it's the only thing on the line
      let lines = content.split('\n');
      let changed = false;
      for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('console.log')) {
              // If the line only contains console.log(...) and maybe some spaces and semicolons
              if (/^\s*console\.log\(.*\);?\s*$/.test(lines[i])) {
                  lines[i] = lines[i].replace(/console\.log\(.*\);?/, '/* log removed */');
                  changed = true;
              } else if (/=>\s*console\.log/.test(lines[i])) {
                  lines[i] = lines[i].replace(/console\.log\(.*\)/, 'undefined');
                  changed = true;
              } else {
                  lines[i] = lines[i].replace(/console\.log/g, '/* log removed */');
                  changed = true;
              }
          }
      }
      if (changed) {
          fs.writeFileSync(filePath, lines.join('\n'));
          console.log(`Updated ${filePath}`);
      }
    }
  }
});
