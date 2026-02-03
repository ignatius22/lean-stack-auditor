# 🔍 Lean Stack Auditor

[![npm version](https://img.shields.io/npm/v/lean-stack-auditor.svg)](https://www.npmjs.com/package/lean-stack-auditor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Find bundle bloat and replace it with vanilla JavaScript.**

Now powered by **esbuild** for accurate, real-world size analysis.

## Features

-   **🎯 Real-Time Analysis**: Uses `esbuild` to bundle your dependencies on-the-fly and calculate their *actual* minified + gzipped size. No more static guessing.
-   **👯 Duplicate Scanner**: Detects when you have multiple versions of the same library installed (e.g., `lodash` v3 and v4).
-   **🧹 Bloat Detection**: Automatically flags heavy libraries (Moment.js, Lodash, etc.) that can be replaced with native APIs.
-   **💡 Native Alternatives**: Provides copy-paste vanilla JS alternatives for common libraries.
-   **📊 Cost Calculator**: Estimates the bandwidth cost of your bundle bloat.
-   **🐢 Node.js Support**: Works for both frontend and backend projects (correctly handles `node:` builtins).

## Installation

```bash
npx lean-stack-auditor
```

Or install globally:

```bash
npm install -g lean-stack-auditor
```

## Usage

Navigate to your project root (where `package.json` is) and run:

```bash
npx lean-stack-auditor
```

### Options

```bash
# Verbose mode (See all dependencies, not just bloat)
lean-stack-auditor --verbose

# JSON output (Great for CI/CD)
# JSON output (Great for CI/CD)
lean-stack-auditor --json

# Auto-Fix Mode (Replace bloat with vanilla JS)
lean-stack-auditor --fix
```

## Example Output

```
🔍 LEAN STACK AUDITOR
Find bloat. Ship faster.

✔ Analysis complete!

📦 Project Analysis:
Project: my-app
Total dependencies: 12
Bundle size (minified+gzipped): 127KB

⚠ Found 3 Bloated Dependencies:

1. moment.js (72KB) - CRITICAL
   Reason: Deprecated and very heavy
   Common usage: Date formatting
   Alternative: Intl.DateTimeFormat (native)
   Potential savings: 72KB

   💡 Vanilla JS Alternative:
   const formatted = new Intl.DateTimeFormat('en-US').format(new Date());

2. lodash (25KB) - HIGH
   Reason: Most projects use only 3-5 functions
   Alternative: Vanilla JS implementations
   Potential savings: 25KB

💰 Total Potential Savings: 97KB (76%)
```

## Configuration (Budget Enforcer)

Create a `lean-stack.config.json` to enforce limits in CI:

```json
{
  "maxBundleSize": "150KB",
  "disallowed": ["moment", "lodash"],
  "allowDuplicates": false
}
```

Run with:
```bash
lean-stack-auditor --check-budget
```
(Exits with code 1 if failed)

## How It Works

1.  **Scans `package.json`**: Identifies your production dependencies.
2.  **Bundles with `esbuild`**: Creates a temporary, minified bundle for each dependency to inspect its true weight.
3.  **Matches Patterns**: Checks against a database of known "bloated" libraries to suggest native alternatives.
4.  **Reports**: Gives you a clear, actionable report.

## License

MIT