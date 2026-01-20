cat > README.md << 'EOF'
# 🔍 Lean Stack Auditor

Find bundle bloat and replace it with vanilla JavaScript.

## Installation
```bash
npx lean-stack-auditor
```

## Usage

Navigate to your project and run:
```bash
cd your-project
npx lean-stack-auditor
```

## What It Does

- Analyzes your dependencies
- Detects bloated libraries (lodash, moment, jQuery, etc.)
- Shows vanilla JS alternatives with copy-paste code
- Calculates real cost savings

## Example Output
```
📦 Project Analysis:
Total dependencies: 8
Estimated bundle size: 527KB

⚠️  Found 8 Bloated Dependencies:

1. moment.js (288KB) - CRITICAL
   Alternative: Intl.DateTimeFormat (native)
   Savings: 288KB
   
💰 Total Savings: 527KB
💵 Annual Cost Savings: $72.37
```

## Options
```bash
# JSON output (for CI/CD)
lean-stack-audit --json

# Verbose mode
lean-stack-audit --verbose
```

## Detected Libraries

- moment.js → Intl.DateTimeFormat
- jQuery → Native DOM APIs
- lodash → Vanilla JS utilities
- axios → fetch API
- And 10+ more...

## License

MIT
EOF