# 🔍 Lean Stack Auditor

> Find bundle bloat and replace it with vanilla JavaScript

**Status:** 🚧 Building in public - Launching Jan 28, 2025

## What Problem Does This Solve?

Your Next.js app ships **527KB of JavaScript** for simple utilities that native APIs can handle in **0KB**.

Lean Stack Auditor:
- ✅ Analyzes your dependencies
- ✅ Detects bloated libraries (lodash, moment, jQuery, etc.)
- ✅ Shows vanilla JS alternatives with copy-paste code
- ✅ Calculates real cost savings

## Real Example
```bash
$ npx lean-stack-auditor

📦 Project Analysis:
Project: my-app
Total dependencies: 8
Estimated bundle size: 527KB

⚠️  Found 8 Bloated Dependencies:

1. moment.js (288KB) - CRITICAL
   Alternative: Intl.DateTimeFormat (native)
   Savings: 288KB

2. jQuery (87KB) - HIGH  
   Alternative: Native DOM APIs
   Savings: 87KB

3. lodash (72KB) - HIGH
   Alternative: Vanilla JS (15 lines)
   Savings: 72KB

💰 Total Savings: 527KB (100% reduction)
💵 Annual Cost Savings: $72.37
```

## Installation
```bash
# Coming soon
npx lean-stack-auditor
```

## Features

- 🔍 **Smart Detection** - Identifies 10+ common bloated libraries
- 💡 **Vanilla JS Alternatives** - Copy-paste ready code examples
- 💰 **Cost Calculator** - Shows real bandwidth savings
- 🎯 **Priority System** - Focus on critical items first
- 🎨 **Beautiful Output** - Clean, readable terminal UI

## Detected Libraries

Currently detects bloat in:
- moment.js → Intl.DateTimeFormat
- jQuery → Native DOM APIs  
- lodash → Vanilla JS utilities
- underscore → ES6+ methods
- axios → fetch API
- validator → Regex patterns
- uuid → crypto.randomUUID()
- classnames → Template literals
- request → Native fetch
- date-fns → Intl APIs

## Building in Public

Follow the 14-day build journey:
- [Twitter/X](https://twitter.com/your-handle)
- [GitHub](https://github.com/ignatius22/lean-stack-auditor)

## Roadmap

- [x] Day 0: CLI with beautiful output ✅
- [x] Day 0: Real package.json parsing ✅
- [x] Day 0: Bloat detection database ✅
- [ ] Day 3: AST analysis for actual usage
- [ ] Day 7: Web dashboard
- [ ] Day 14: Public launch 🚀

## Tech Stack

- Node.js + ES Modules
- Commander.js (CLI framework)
- Chalk (terminal styling)
- Ora (loading spinners)
- Babel Parser (upcoming: usage detection)

---

Built by [@ignatius22](https://github.com/ignatius22) | Building in public, shipping in 14 days