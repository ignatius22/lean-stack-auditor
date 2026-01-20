import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Known library sizes (we'll expand this database)
const KNOWN_SIZES = {
  lodash: 72,
  moment: 288,
  axios: 14,
  jquery: 87,
  underscore: 16,
  request: 184,
  "date-fns": 76,
  classnames: 1,
  uuid: 4,
  validator: 45,
  react: 6,
  "react-dom": 130,
  vue: 34,
  next: 450,
  "@emotion/react": 23,
  "styled-components": 52,
  express: 208,
  cheerio: 246,
  "body-parser": 56,
  cors: 2,
  dotenv: 3,
  bcrypt: 89,
  jsonwebtoken: 23,
  mongoose: 890,
  "socket.io": 187,
  nodemon: 73,
  webpack: 1200,
  "babel-core": 890,
  eslint: 456,
  prettier: 234,
  "styled-components": 52,
  "@emotion/react": 23,
  "react-icons": 156,
  "chart.js": 250,
  "prop-types": 3,
  'node-fetch': 18,
  '@babel/polyfill': 89,
  'left-pad': 1,
  'isarray': 1,
  'object-assign': 2,
  'is-promise': 1,
  'qs': 16,
  'query-string': 6,
  'promise-polyfill': 3,
  'deepmerge': 2,
};

export function estimateDependencySize(depName) {
  // Check known sizes first
  if (KNOWN_SIZES[depName]) {
    return KNOWN_SIZES[depName];
  }

  // Try to get actual size from node_modules
  try {
    const depPath = path.join(process.cwd(), "node_modules", depName);
    if (fs.existsSync(depPath)) {
      const size = getDirSize(depPath);
      return Math.round(size / 1024); // Convert to KB
    }
  } catch (error) {
    // Silent fail
  }

  // Default estimate based on common patterns
  if (depName.startsWith("@types/")) return 5;
  if (depName.includes("eslint")) return 50;
  if (depName.includes("babel")) return 100;
  if (depName.includes("webpack")) return 200;

  return 10; // Default fallback
}

function getDirSize(dirPath) {
  let size = 0;

  try {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        size += getDirSize(filePath);
      } else {
        size += stats.size;
      }
    }
  } catch (error) {
    // Silent fail
  }

  return size;
}

export function analyzeDependencies(dependencies) {
  return dependencies
    .map((dep) => {
      const size = estimateDependencySize(dep.name);

      return {
        ...dep,
        sizeKB: size,
        sizeMB: (size / 1024).toFixed(2),
      };
    })
    .sort((a, b) => b.sizeKB - a.sizeKB); // Sort by size descending
}
