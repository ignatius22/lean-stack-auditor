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
Total dependencies: 3
Bundle size (minified+gzipped): 127KB

⚠️  Found 3 Bloated Dependencies:

1. moment.js (72KB) - CRITICAL
   Alternative: Intl.DateTimeFormat (native)
   Savings: 72KB
   
💰 Total Savings: 127KB
💵 Annual Cost Savings: $17.44
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