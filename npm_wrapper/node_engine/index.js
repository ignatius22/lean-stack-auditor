#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import fs from "fs";
import path from "path";
import { parsePackageJson, getDependencyList } from "./lib/packageParser.js";
import { analyzeDependencies, formatSize } from "./lib/sizeAnalyzer.js";
import { detectBloat } from "./lib/bloatDetector.js";
import { runFixer } from "./lib/fixer.js";
import { checkDuplicates, displayDuplicates } from "./lib/deduper.js";


const program = new Command();

// ASCII Art Logo
function showLogo() {
  console.log(
    chalk.cyan(`
╔═══════════════════════════════════════════╗
║                                           ║
║     🔍 LEAN STACK AUDITOR                ║
║     Find bloat. Ship faster.              ║
║                                           ║
╚═══════════════════════════════════════════╝
  `)
  );
}

// Analyze project
async function analyzeProject() {
  const spinner = ora("Analyzing your project...").start();

  try {
    // Parse package.json
    spinner.text = "Reading package.json...";
    const packageData = parsePackageJson();

    // Get dependencies
    spinner.text = "Analyzing dependencies...";
    const dependencies = getDependencyList(packageData);

    // Analyze sizes (uses esbuild for real bundle size)
    spinner.text = "Bundling dependencies to check real size (this may take a moment)...";
    const analyzedDeps = await analyzeDependencies(dependencies);

    // Detect bloat
    spinner.text = "Detecting bloat patterns...";
    const bloat = detectBloat(analyzedDeps);

    // Calculate totals
    const totalSize = analyzedDeps.reduce((sum, dep) => sum + dep.sizeKB, 0);
    const totalBloat = bloat.reduce((sum, dep) => sum + dep.savings, 0);

    spinner.succeed(chalk.green("Analysis complete!"));

    return {
      projectName: packageData.name,
      totalDependencies: analyzedDeps.length,
      totalSizeKB: Math.round(totalSize * 10) / 10,
      totalSizeMB: (totalSize / 1024).toFixed(2),
      bloat,
      potentialSavingsKB: Math.round(totalBloat * 10) / 10,
      potentialSavingsMB: (totalBloat / 1024).toFixed(2),
      savingsPercent:
        totalSize > 0 ? ((totalBloat / totalSize) * 100).toFixed(1) : 0,
      analyzedDeps,
    };
  } catch (error) {
    spinner.fail(chalk.red("Analysis failed"));
    throw error;
  }
}

// Display results
function displayResults(results, verbose = false) {
  console.log(chalk.bold("\n📦 Project Analysis:\n"));
  console.log(chalk.gray("Project: ") + chalk.cyan(results.projectName));
  console.log(
    chalk.gray("Total dependencies: ") + chalk.yellow(results.totalDependencies)
  );
  console.log(
    chalk.gray("Bundle size (minified+gzipped): ") +
      chalk.yellow(formatSize(results.totalSizeKB))
  );

  if (verbose && results.analyzedDeps) {
    console.log(chalk.bold("\n📋 All Dependencies:\n"));

    // Sort by size for better visualization
    const deps = [...results.analyzedDeps].sort((a, b) => b.sizeKB - a.sizeKB);

    deps.forEach((dep) => {
      const sizeStr = formatSize(dep.sizeKB);

      let colorFn = chalk.gray;
      if (dep.sizeKB > 50) colorFn = chalk.red;
      else if (dep.sizeKB > 20) colorFn = chalk.yellow;
      else if (dep.sizeKB > 5) colorFn = chalk.white;

      console.log(`   ${colorFn(sizeStr.padEnd(10))} ${dep.name}`);
    });
    console.log("");
  }

  if (results.bloat.length === 0) {
    console.log(chalk.green("\n✨ Great! No common bloat patterns detected."));
    console.log(chalk.gray("Your dependencies look lean!\n"));
    return;
  }

  console.log(
    chalk.bold(
      `\n⚠️  Found ${results.bloat.length} Bloated ${
        results.bloat.length === 1 ? "Dependency" : "Dependencies"
      }:\n`
    )
  );

  results.bloat.forEach((item, index) => {
    const priorityColor =
      item.priority === "CRITICAL"
        ? chalk.red
        : item.priority === "HIGH"
        ? chalk.yellow
        : item.priority === "MEDIUM"
        ? chalk.blue
        : chalk.gray;

    console.log(
      priorityColor(
        `${index + 1}. ${item.name} (${formatSize(item.sizeKB)}) - ${item.priority}`
      )
    );
    console.log(chalk.gray(`   Reason: ${item.reason}`));
    console.log(chalk.gray(`   Common usage: ${item.commonUsage}`));
    console.log(chalk.green(`   Alternative: ${item.alternative}`));
    console.log(chalk.cyan(`   Potential savings: ${formatSize(item.savings)}`));

    // Show vanilla code example
    if (item.vanillaCode) {
      console.log(chalk.bold("\n   💡 Vanilla JS Alternative:"));
      console.log(chalk.dim(item.vanillaCode));
    }
    console.log("");
  });

  console.log(
    chalk.bold("💰 Total Potential Savings: ") +
      chalk.green(formatSize(results.potentialSavingsKB))
  );
  console.log(
    chalk.bold("📊 Bundle Reduction: ") +
      chalk.green(`${results.savingsPercent}%`)
  );

  if (results.potentialSavingsKB > 0) {
    console.log(chalk.bold("\n💵 Cost Impact (100K monthly users):"));
    const monthlyGB = (results.potentialSavingsKB * 100000) / 1024 / 1024;
    const monthlyCost = monthlyGB * 0.12; // Vercel pricing
    console.log(
      chalk.gray(`   Data transfer saved: `) +
        chalk.yellow(`${monthlyGB.toFixed(2)}GB/month`)
    );
    console.log(
      chalk.gray(`   Monthly savings (Vercel): `) +
        chalk.green(`$${monthlyCost.toFixed(2)}`)
    );
    console.log(
      chalk.gray(`   Annual savings: `) +
        chalk.green(`$${(monthlyCost * 12).toFixed(2)}`)
    );
  }

  console.log(chalk.bold("\n🚀 Next Steps:"));
  console.log(chalk.gray("   1. Review CRITICAL priority items first"));
  console.log(chalk.gray("   2. Copy the vanilla JS code above"));
  console.log(chalk.gray("   3. Test replacements in development"));
  console.log(chalk.gray("   4. Run this tool again after optimizations\n"));

  // Add a tip
  if (!verbose) {
    console.log(
      chalk.dim("💡 Tip: Run with --verbose for detailed size breakdown\n")
    );
  }
}

// Main command
program
  .name("lean-stack-audit")
  .description("Find bundle bloat and replace it with vanilla JavaScript")
  .version("0.2.0")
  .option("-v, --verbose", "Show detailed analysis including all dependencies")
  .option("-j, --json", "Output results as JSON for CI/CD integration")
  .option("-f, --fix", "Automatically replace bloated libraries with vanilla JS")

  .action(async (options) => {
    showLogo();

    const packagePath = path.join(process.cwd(), "package.json");
    if (!fs.existsSync(packagePath)) {
      console.log(
        chalk.red("❌ Error: No package.json found in current directory")
      );
      console.log(chalk.gray("   Run this command in your project root\n"));
      process.exit(1);
    }

    try {
      const results = await analyzeProject();

      // JSON output for CI/CD
      if (options.json) {
        // Remove analyzedDeps for cleaner JSON output unless verbose
        const jsonOutput = options.verbose
          ? results
          : { ...results, analyzedDeps: undefined };
        console.log(JSON.stringify(jsonOutput, null, 2));
        return;
      }

      // Pretty terminal output
      displayResults(results, options.verbose);

      // Check for duplicates
      const duplicates = await checkDuplicates();
      displayDuplicates(duplicates);



      // Run fixer if requested
      if (options.fix && results.bloat.length > 0) {
        await runFixer(results.bloat);
      }
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ error: error.message }, null, 2));
      } else {
        console.log(chalk.red(`\n❌ Error: ${error.message}\n`));
      }
      process.exit(1);
    }
  });

program.parse();
