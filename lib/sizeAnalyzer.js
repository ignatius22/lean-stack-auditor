import { build } from "esbuild";
import { gzip } from "zlib";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const gzipAsync = promisify(gzip);

// Core node modules to skip
const BUILTINS = [
  "assert", "buffer", "child_process", "cluster", "console", "constants",
  "crypto", "dgram", "dns", "domain", "events", "fs", "http", "https",
  "module", "net", "os", "path", "process", "punycode", "querystring",
  "readline", "repl", "stream", "string_decoder", "sys", "timers", "tls",
  "tty", "url", "util", "vm", "zlib"
];

// Add node: prefixed builtins
const NODE_BUILTINS = BUILTINS.map(b => `node:${b}`);
const ALL_BUILTINS = [...BUILTINS, ...NODE_BUILTINS];

// Dev dependencies that don't affect bundle size
const DEV_DEPENDENCIES = [
  "eslint", "prettier", "webpack", "babel", "jest", "mocha", "chai",
  "sinon", "cypress", "playwright", "typescript", "ts-node", "@types/",
  "nodemon", "concurrently", "husky", "lint-staged", "commitlint",
  "rollup", "vite", "esbuild", "parcel", "turbo", "lean-stack-auditor"
];

/**
 * Check if a dependency is a dev-only tool (doesn't add to bundle)
 */
function isDevDependency(depName) {
  return DEV_DEPENDENCIES.some(
    (dev) => depName === dev || depName.startsWith(dev) || depName.includes(dev)
  );
}

/**
 * Get the real minified + gzipped size of a dependency
 */
export async function getRealSize(depName, projectPath = process.cwd()) {
  // 1. Skip dev dependencies and builtins
  if (isDevDependency(depName) || ALL_BUILTINS.includes(depName)) {
    return { sizeKB: 0, sizeMB: "0.00", error: null };
  }

  // 2. Create a temporary entry file
  const tempEntry = path.join(projectPath, `_temp_${depName.replace(/\//g, '_')}.js`);
  
  try {
    // Write a simple import/require
    fs.writeFileSync(tempEntry, `import * as lib from '${depName}'; console.log(lib);`);

    // 3. Bundle with esbuild
    const result = await build({
      entryPoints: [tempEntry],
      bundle: true,
      minify: true,
      write: false, // Don't write to disk, keep in memory
      platform: "browser", // Assume browser (most critical for bloat)
      target: "esnext",
      external: ALL_BUILTINS, // Don't bundle node builtins
      logLevel: "silent",
    });

    // 4. Calculate size
    const buffer = result.outputFiles[0].contents;
    const gzipped = await gzipAsync(buffer);
    
    const sizeBytes = gzipped.length;
    const sizeKB = sizeBytes / 1024;

    return {
      sizeKB,
      sizeMB: (sizeKB / 1024).toFixed(2),
      error: null
    };

  } catch (error) {
    // Fallback if bundling fails
    return {
      sizeKB: 0,
      sizeMB: "0.00",
      error: error.message
    };
  } finally {
    // Cleanup
    if (fs.existsSync(tempEntry)) {
      fs.unlinkSync(tempEntry);
    }
  }
}

/**
 * Analyze all dependencies and add size information
 */
export async function analyzeDependencies(dependencies) {
  const results = [];
  
  // Process in parallel with concurrency limit? 
  // For now parallel is fine for ~20 deps, typical projects don't have hundreds of direct deps
  const promises = dependencies.map(async (dep) => {
    const sizeInfo = await getRealSize(dep.name);
    
    return {
      ...dep,
      ...sizeInfo
    };
  });

  const analyzed = await Promise.all(promises);
  
  return analyzed
    .filter((dep) => dep.sizeKB > 0)
    .sort((a, b) => b.sizeKB - a.sizeKB);
}

/**
 * Format size for display
 */
export function formatSize(sizeKB) {
  if (sizeKB >= 1000) {
    return `${(sizeKB / 1024).toFixed(1)}MB`;
  }
  if (sizeKB >= 10) {
    return `${Math.round(sizeKB)}KB`;
  }
  return `${sizeKB.toFixed(1)}KB`;
}
