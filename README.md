# 🔍 Lean Stack Auditor


[![Build Status](https://github.com/ignatius22/lean-stack-auditor/actions/workflows/release.yml/badge.svg)](https://github.com/ignatius22/lean-stack-auditor/actions)
[![npm version](https://img.shields.io/npm/v/lean-stack-auditor.svg)](https://www.npmjs.com/package/lean-stack-auditor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Find bundle bloat. Enforce policies. Ship faster.**

Now powered by a **Rust Agent** 🦀 and a **SaaS Policy Engine** 🧠.

## Features

## Architecture (v3.0)

This tool is a hybrid **CLI Agent + SaaS Platform**:

1.  **The Agent (Rust)**:
    -   Runs in your CI/CD pipeline (GitHub Actions, etc.).
    -   Scans `package.json` files in parallel using `rayon`.
    -   Detects disallowed packages and enforcing bundle size limits.
    -   "Phones home" to the API to authorize the build.

2.  **The Backend (Node.js/Fastify)**:
    -   Verifies license keys.
    -   Enforces policies (e.g., Free Tier cannot have violations).
    -   Ready for self-hosting with Docker.

## Features

-   **🚀 High Performance**: Rust-based scanner parses giant monorepos in milliseconds.
-   **🛡️ Policy Enforcement**: Define a `lean-stack.config.json` to ban specific packages (e.g., "no moment.js").
-   **🔑 License Management**: SaaS-ready architecture with Free/Paid tiers.
-   **🐳 Production Ready**: Dockerized backend with a `/health` check for easy deployment to Railway/Render.
-   **📦 Cross-Platform**: Pre-compiled binaries for Linux, macOS (Intel/Silicon), and Windows.

## Quick Start

### 1. Install the CLI
The npm package automatically downloads the correct Rust binary for your OS:

```bash
npm install -g lean-stack-auditor@latest
```

### 2. Configure Your Project
Create a `lean-stack.config.json` in your root:

```json
{
  "maxBundleSize": "200KB",
  "disallowed": ["moment", "lodash"],
  "licenseKey": "sk_free_12345"
}
```

### 3. Run the Audit
```bash
lean-stack-auditor
```
(Exit Code 0 if clean, 1 if policies violated)


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

## Self-Hosting the Backend

You can run your own Policy Engine using the provided Docker image.

### 1. Build & Run
```bash
cd saas_backend
docker build -t lean-stack-backend .
docker run -p 3000:3000 -e PORT=3000 -e NODE_ENV=production lean-stack-backend
```

### 2. Configure Environment
Set these variables in your hosting provider (Railway, Render, etc.):
- `PORT`: Port to listen on (default 3000).
- `NODE_ENV`: Set to `production`.
- `STRIPE_SECRET_KEY`: Your Stripe secret for paid tiers.

### 3. Point the Agent (Optional)
*Currently hardcoded to localhost for dev, update `main.rs` to point to your production URL.*

## License

MIT