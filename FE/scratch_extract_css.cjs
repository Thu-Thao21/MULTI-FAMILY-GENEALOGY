const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = dir + '/' + file;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.tsx')) {
      files.push(name);
    }
  }
  return files;
}

const rootDir = 'e:/MULTI-FAMILY-GENEALOGY/FE/src/components/clan-admin';
const tsxFiles = getFiles(rootDir);
let processedCount = 0;

tsxFiles.forEach(tsxPath => {
  if (
    tsxPath.includes('AncestorsPage') || 
    tsxPath.includes('WorshipSpacePage') || 
    tsxPath.includes('ClanAccountMgmt') || 
    tsxPath.includes('ClanApprovalsMgmt') || 
    tsxPath.includes('Library3DPage')
  ) {
      return;
  }

  let tsxContent = fs.readFileSync(tsxPath, 'utf-8');
  const cssPath = tsxPath.replace(/\.tsx$/, '.css');
  let cssContent = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf-8') : '';

  const baseName = path.basename(tsxPath, '.tsx').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  let counter = 1;
  let newCssAppends = '';

  let newTsxContent = tsxContent.replace(/className="([^"]+)"/g, (fullMatch, classStr) => {
      classStr = classStr.trim();
      if (!classStr.includes(' ') || classStr.split(' ').length < 2) {
          return fullMatch;
      }
      const newClassName = baseName + '-el-' + counter++;
      newCssAppends += '\n.' + newClassName + ' {\n  @apply ' + classStr + ';\n}\n';
      return 'className="' + newClassName + '"';
  });

  if (newCssAppends) {
      fs.writeFileSync(cssPath, cssContent + newCssAppends, 'utf-8');
      fs.writeFileSync(tsxPath, newTsxContent, 'utf-8');
      processedCount++;
      console.log('Processed ' + baseName);
  }
});
console.log('Finished processing ' + processedCount + ' files.');
