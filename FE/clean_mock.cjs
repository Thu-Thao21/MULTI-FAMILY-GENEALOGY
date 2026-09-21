const fs = require('fs');
const path = require('path');
const dir = 'e:/MULTI-FAMILY-GENEALOGY/MULTI-FAMILY-GENEALOGY/FE/src/components';
const clean = (p) => {
  const files = fs.readdirSync(p);
  for(const f of files) {
    const fp = path.join(p, f);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) {
      clean(fp);
    } else if (fp.endsWith('.tsx') || fp.endsWith('.ts')) {
      let content = fs.readFileSync(fp, 'utf8');
      let changed = false;
      let newContent = content.replace(/const (INITIAL_[A-Z_0-9]+)\s*:\s*([A-Za-z0-9_\[\]<>]+)\s*=\s*\[([\s\S]*?)\];/g, (match, p1, p2) => {
        changed = true;
        return `const ${p1}: ${p2} = [];`;
      });
      if (changed) {
        fs.writeFileSync(fp, newContent);
        console.log('Cleaned:', fp);
      }
    }
  }
};
clean(dir);
