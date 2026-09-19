const fs = require('fs');
const path = require('path');

const dir = 'e:/MULTI-FAMILY-GENEALOGY/FE/src/pages/clan-admin';
const targetString = "import DataTable, { Column } from '../../../components/shared/DataTable/DataTable';";
const replacementString = "import DataTable, { type Column } from '../../../components/shared/DataTable/DataTable';";

function replaceInDir(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(targetString)) {
        content = content.replace(targetString, replacementString);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed', fullPath);
      }
    }
  }
}

replaceInDir(dir);
