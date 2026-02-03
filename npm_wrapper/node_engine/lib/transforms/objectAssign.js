export const objectAssignTransform = {
  name: "object-assign",
  description: "Replaces object-assign with Object.assign",
  transform: (code) => {
    let newCode = code;
    
    // const assign = require('object-assign');
    const requireRegex = /const\s+(\w+)\s*=\s*require\(['"]object-assign['"]\);?/g;
    const importRegex = /import\s+(\w+)\s+from\s+['"]object-assign['"];?/g;
    
    let varName = null;
    
    newCode = newCode.replace(requireRegex, (match, name) => {
      varName = name;
      return ""; 
    });
    
    if (!varName) {
      newCode = newCode.replace(importRegex, (match, name) => {
        varName = name;
        return ""; 
      });
    }
    
    if (varName) {
      const usageRegex = new RegExp(`\\b${varName}\\(`, 'g');
      newCode = newCode.replace(usageRegex, "Object.assign(");
      return newCode;
    }
    
    return code;
  }
};
