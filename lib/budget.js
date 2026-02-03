import fs from "fs";
import path from "path";
import chalk from "chalk";

const CONFIG_FILE = "lean-stack.config.json";

export function loadConfig(projectPath = process.cwd()) {
  const configPath = path.join(projectPath, CONFIG_FILE);
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, "utf8"));
    } catch (e) {
      console.warn(chalk.yellow(`Warning: Failed to parse ${CONFIG_FILE}`));
      return null;
    }
  }
  return null;
}

function parseSize(sizeStr) {
  if (!sizeStr) return Infinity;
  const num = parseFloat(sizeStr);
  if (sizeStr.toLowerCase().endsWith("mb")) return num * 1024;
  return num; // assume KB
}

export function checkBudget(config, analysisResults, duplicates) {
  if (!config) return true;

  console.log(chalk.bold("\n👮 Budget Enforcer"));
  let passed = true;

  // 1. Check Max Bundle Size
  if (config.maxBundleSize) {
    const limit = parseSize(config.maxBundleSize);
    const current = analysisResults.totalSizeKB;
    if (current > limit) {
      console.log(chalk.red(`   ❌ Total Bundle Size: ${current.toFixed(1)}KB > ${config.maxBundleSize}`));
      passed = false;
    } else {
      console.log(chalk.green(`   ✅ Total Bundle Size: ${current.toFixed(1)}KB (Limit: ${config.maxBundleSize})`));
    }
  }

  // 2. Check Disallowed Packages
  if (config.disallowed && Array.isArray(config.disallowed)) {
    analysisResults.analyzedDeps.forEach(dep => {
      if (config.disallowed.includes(dep.name)) {
         console.log(chalk.red(`   ❌ Disallowed Package Found: ${dep.name}`));
         passed = false;
      }
    });
  }

  // 3. Check Duplicates
  if (config.allowDuplicates === false && duplicates.length > 0) {
    console.log(chalk.red(`   ❌ Duplicates Found: ${duplicates.length} (Not allowed)`));
    passed = false;
  }

  if (passed) {
    console.log(chalk.bold.green("\n   ✨ Budget Check Passed!"));
  } else {
    console.log(chalk.bold.red("\n   ⛔ Budget Check Failed!"));
  }

  return passed;
}
