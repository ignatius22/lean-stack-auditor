export const promisePolyfillTransform = {
  name: "promise-polyfill",
  description: "Removes promise-polyfill import (assumes native Promise)",
  transform: (code) => {
    let newCode = code;
    
    // import 'promise-polyfill';
    // require('promise-polyfill');
    const patterns = [
      /import\s+['"]promise-polyfill['"];?/g,
      /require\(['"]promise-polyfill['"]\);?/g,
      /import\s+Promise\s+from\s+['"]promise-polyfill['"];?/g
    ];
    
    let changed = false;
    patterns.forEach(pattern => {
      if (pattern.test(newCode)) {
        newCode = newCode.replace(pattern, "");
        changed = true;
      }
    });

    return newCode;
  }
};
