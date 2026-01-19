#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import fs from "fs";
import path from "path";
import { parsePackageJson, getDependencyList } from "./lib/packageParser.js";
import { analyzeDependencies } from "./lib/sizeAnalyzer.js";
import { detectBloat } from "./lib/bloatDetector.js";

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

    // Analyze sizes
    spinner.text = "Calculating bundle sizes...";
    const analyzedDeps = analyzeDependencies(dependencies);

    // Detect bloat
    spinner.text = "Detecting bloat patterns...";
    const bloat = detectBloat(analyzedDeps);

    // Calculate totals
    const totalSize = analyzedDeps.reduce((sum, dep) => sum + dep.sizeKB, 0);
    const totalBloat = bloat.reduce((sum, dep) => sum + dep.savings, 0);

    spinner.succeed(chalk.green("Analysis complete!"));

    return {
      projectName: packageData.name,
      totalDependencies: dependencies.length,
      totalSizeKB: totalSize,
      totalSizeMB: (totalSize / 1024).toFixed(2),
      bloat,
      potentialSavingsKB: totalBloat,
      potentialSavingsMB: (totalBloat / 1024).toFixed(2),
      savingsPercent:
        totalSize > 0 ? ((totalBloat / totalSize) * 100).toFixed(1) : 0,
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
    chalk.gray("Estimated bundle size: ") +
      chalk.yellow(`${results.totalSizeMB}MB (${results.totalSizeKB}KB)`)
  );

  if (verbose) {
    console.log(chalk.bold('\n📋 All Dependencies:\n'));
    // Show all deps with sizes
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
        : chalk.blue;

    console.log(priorityColor(`${index + 1}. ${item.name} (${item.sizeKB}KB)`));
    console.log(chalk.gray(`   Reason: ${item.reason}`));
    console.log(chalk.gray(`   Common usage: ${item.commonUsage}`));
    console.log(chalk.green(`   Alternative: ${item.alternative}`));
    console.log(chalk.cyan(`   Potential savings: ${item.savings}KB`));
    console.log(priorityColor(`   Priority: ${item.priority}`));

    // Show vanilla code example
    if (item.vanillaCode) {
      console.log(chalk.bold("\n   💡 Vanilla JS Alternative:"));
      console.log(chalk.dim(item.vanillaCode));
    }
    console.log("");
  });

  console.log(
    chalk.bold("💰 Total Potential Savings: ") +
      chalk.green(
        `${results.potentialSavingsMB}MB (${results.potentialSavingsKB}KB)`
      )
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
  console.log(chalk.dim("💡 Tip: Run with --verbose for detailed analysis\n"));
}

// Main command
program
  .name("lean-stack-audit")
  .description("Find bundle bloat and replace it with vanilla JavaScript")
  .version("0.1.0")
  .option('-v, --verbose', 'Show detailed analysis including all dependencies')
  .action(async (options) => {
    showLogo();

    // Check if package.json exists
    const packagePath = path.join(process.cwd(), "package.json");
    if (!fs.existsSync(packagePath)) {
      console.log(
        chalk.red("❌ Error: No package.json found in current directory")
      );
      console.log(chalk.gray("   Run this command in your project root\n"));
      process.exit(1);
    }

    try {
      // Run analysis
      const results = await analyzeProject();
      displayResults(results, options.verbose);
    } catch (error) {
      console.log(chalk.red(`\n❌ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

program.parse();
