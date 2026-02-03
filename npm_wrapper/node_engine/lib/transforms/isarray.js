export const isArrayTransform = {
  name: "isarray",
  description: "Replaces isarray with Array.isArray",
  transform: (code) => {
    // 1. Remove require/import
    // const isArray = require('isarray');
    // import isArray from 'isarray';
    
    let newCode = code;
    
    // Simple regex replacements for now
    // NOTE: In a real tool, use AST. For v2.1, we use robust regex.
    
    // Replace usage: isArray(x) -> Array.isArray(x)
    // We assume the variable name matches the package name for simplicity in v1
    // or we find the variable name.
    
    // Let's assume standard usage: const isArray = require('isarray')
    const requireRegex = /const\s+(\w+)\s*=\s*require\(['"]isarray['"]\);?/g;
    const importRegex = /import\s+(\w+)\s+from\s+['"]isarray['"];?/g;
    
    let varName = null;
    
    newCode = newCode.replace(requireRegex, (match, name) => {
      varName = name;
      return ""; // Remove line
    });
    
    if (!varName) {
      newCode = newCode.replace(importRegex, (match, name) => {
        varName = name;
        return ""; // Remove line
      });
    }
    
    if (varName) {
      // Replace usages
      // varName(args) -> Array.isArray(args)
      const usageRegex = new RegExp(`\\b${varName}\\(`, 'g');
      newCode = newCode.replace(usageRegex, "Array.isArray(");
      return newCode;
    }
    
    return code; // No change
  }
};
