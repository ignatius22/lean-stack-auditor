import { glob } from "glob";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import { transforms } from "./transforms/index.js";

export async function runFixer(bloatedDeps) {
  console.log(chalk.bold("\n🔧 Auto-Fix Mode\n"));

  // 1. Identify fixable dependencies
  const fixable = bloatedDeps.filter(dep => transforms[dep.name]);

  if (fixable.length === 0) {
    console.log(chalk.yellow("No fixable patterns found for the detected bloated dependencies."));
    return;
  }

  // 2. Scan project files
  console.log(chalk.gray("Scanning files for usages..."));
  // Ignore node_modules, dist, build, .git
  const files = await glob("**/*.{js,jsx,ts,tsx}", { 
    ignore: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.git/**"],
    cwd: process.cwd(),
    absolute: true
  });

  // 3. For each fixable dependency, check if it's used in files
  for (const dep of fixable) {
    const transform = transforms[dep.name];
    console.log(chalk.cyan(`\nChecking usages of ${dep.name}...`));
    
    const affectedFiles = [];
    
    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      // Check if file imports the package
      if (content.includes(`"${dep.name}"`) || content.includes(`'${dep.name}'`)) {
        affectedFiles.push(file);
      }
    }
    
    if (affectedFiles.length === 0) {
      console.log(chalk.gray(`   No usages found in source code (might be indirect or transitive).`));
      continue;
    }
    
    console.log(chalk.yellow(`   Found usage in ${affectedFiles.length} files.`));
    
    // 4. Prompt user
    const { shouldFix } = await inquirer.prompt([{
      type: "confirm",
      name: "shouldFix",
      message: `Apply fix for ${dep.name}? (Replaces with native alternative)`,
      default: false
    }]);
    
    if (shouldFix) {
      let fixedCount = 0;
      
      for (const file of affectedFiles) {
        const content = fs.readFileSync(file, "utf8");
        const newContent = transform.transform(content);
        
        if (newContent !== content) {
          fs.writeFileSync(file, newContent);
          fixedCount++;
          console.log(chalk.green(`   Fixed: ${path.relative(process.cwd(), file)}`));
        }
      }
      
      console.log(chalk.bold.green(`   ✅ Updated ${fixedCount} files.`));
      
      // Suggest uninstall
      console.log(chalk.dim(`   (You can now likely uninstall ${dep.name})`));
      console.log(chalk.dim(`   npm uninstall ${dep.name}`));
    } else {
      console.log(chalk.gray("   Skipped."));
    }
  }
}
