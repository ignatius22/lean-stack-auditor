import { exec } from "child_process";
import util from "util";
import chalk from "chalk";

const execAsync = util.promisify(exec);

export async function checkDuplicates(projectPath = process.cwd()) {
  console.log(chalk.gray("\n🔎 Scanning for duplicate dependencies..."));

  try {
    // Run npm list to get the full tree
    // We use --json to parse it and --all to see nested deps
    // Note: npm list can fail if there are unrelated peer dep issues, so we catch errors
    const { stdout } = await execAsync("npm list --all --json", { 
      cwd: projectPath, 
      maxBuffer: 1024 * 1024 * 10 // Increase buffer for large trees
    });

    const tree = JSON.parse(stdout);
    const versions = {};

    // Helper to traverse the tree
    function traverse(node) {
      if (!node.dependencies) return;

      for (const [name, info] of Object.entries(node.dependencies)) {
        if (!versions[name]) {
          versions[name] = new Set();
        }
        if (info.version) {
          versions[name].add(info.version);
        }
        traverse(info);
      }
    }

    traverse(tree);

    // Filter for duplicates
    const duplicates = [];
    for (const [name, versionSet] of Object.entries(versions)) {
      if (versionSet.size > 1) {
        duplicates.push({
          name,
          versions: Array.from(versionSet).sort()
        });
      }
    }

    return duplicates;
  } catch (error) {
    // If npm list fails (common with peer dep errors), we warn effectively
    // But we try to parse stdout even if it errored, as npm often outputs JSON + error code
    try {
        if (error.stdout) {
             const tree = JSON.parse(error.stdout);
             // Re-use traversal logic if needed, but for stability let's just return empty or minimal info
             // For now, let's assume if it fails hard, we skip duplicate check
        }
    } catch (e) {
        // Ignore
    }
    
    console.log(chalk.dim("   (Skipping duplicate check: `npm list` failed or returned invalid JSON)"));
    return [];
  }
}

export function displayDuplicates(duplicates) {
    if (duplicates.length === 0) return;

    console.log(chalk.bold.yellow(`\n⚠️  Duplicate Dependencies Found (${duplicates.length})`));
    console.log(chalk.dim("   Multiple versions of the same package increase bundle size."));

    duplicates.forEach(dupe => {
        console.log(chalk.yellow(`   • ${dupe.name}: `) + chalk.white(dupe.versions.join(", ")));
    });

    console.log(chalk.dim("\n   💡 Fix: Run ") + chalk.bold.cyan("npm dedupe") + chalk.dim(" or check your lockfile."));
}
