const fs = require('fs');
const path = require('path');

const walkSync = (dir, callback) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walkSync(p, callback);
    } else {
      callback(p);
    }
  }
};

const dirs = [
  'e:/MULTI-FAMILY-GENEALOGY/MULTI-FAMILY-GENEALOGY/FE/src/pages/clan-admin',
  'e:/MULTI-FAMILY-GENEALOGY/MULTI-FAMILY-GENEALOGY/FE/src/components/admin',
  'e:/MULTI-FAMILY-GENEALOGY/MULTI-FAMILY-GENEALOGY/FE/src/components/shared',
  'e:/MULTI-FAMILY-GENEALOGY/MULTI-FAMILY-GENEALOGY/FE/src/styles'
];

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkSync(dir, (p) => {
      if (p.endsWith('.tsx') || p.endsWith('.ts') || p.endsWith('.css')) {
        let content = fs.readFileSync(p, 'utf8');
        // Replace 'clan-' with 'admin-' when used as class prefix
        // For CSS files: .clan-
        // For TSX files: className="clan- or className='clan- or clan-
        
        let newContent = content;
        
        if (p.endsWith('.css')) {
          newContent = newContent.replace(/\.clan-/g, '.admin-');
        } else {
          // Replace in strings and jsx
          newContent = newContent.replace(/className="clan-/g, 'className="admin-');
          newContent = newContent.replace(/className='clan-/g, "className='admin-");
          newContent = newContent.replace(/className=\{`clan-/g, "className={`admin-");
          // Generic match for other uses like "clan-btn-primary" -> "admin-btn-primary"
          // Be careful not to replace "clan-admin" route paths.
          // Look for words starting with clan- that end with typical class suffixes
          const classKeywords = ['account', 'profile', 'members', 'approvals', 'links', 'settings', 'header', 'title', 'subtitle', 'controls', 'search', 'select', 'card', 'table', 'btn', 'modal', 'msg'];
          classKeywords.forEach(kw => {
             const regex = new RegExp(`clan-${kw}`, 'g');
             newContent = newContent.replace(regex, `admin-${kw}`);
          });
        }
        
        if (newContent !== content) {
          fs.writeFileSync(p, newContent);
          console.log('Updated classes in:', p);
        }
      }
    });
  }
});
