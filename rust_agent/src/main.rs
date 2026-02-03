use clap::Parser;
use colored::*;
use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::{fs, path::Path, process};
use walkdir::WalkDir;

// --- Configuration Structs ---

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Path to project root
    #[arg(default_value = ".")]
    path: String,

    /// Run detailed analysis (node engine)
    #[arg(long, short = 'a')]
    analyze: bool,

    /// Auto-fix issues (node engine)
    #[arg(long, short = 'f')]
    fix: bool,
}

#[derive(Debug, Deserialize, Serialize)]
struct Config {
    #[serde(rename = "licenseKey")]
    license_key: String,
    #[serde(rename = "maxBundleSize")]
    max_bundle_size: Option<String>,
    #[serde(rename = "disallowed", default)]
    banned: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct PackageJson {
    dependencies: Option<std::collections::HashMap<String, String>>,
    #[serde(rename = "devDependencies")]
    dev_dependencies: Option<std::collections::HashMap<String, String>>,
}

// --- API Structs ---

#[derive(Debug, Serialize)]
struct Payload {
    #[serde(rename = "licenseKey")]
    license_key: String,
    violations: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct ApiResponse {
    status: String,
    // message: Option<String>,
}

// --- Main ---

#[tokio::main]
async fn main() {
    let args = Args::parse();
    println!("{}", "🔍 Lean Stack Auditor (Rust Agent)".bold().blue());

    // 1. Load Configuration
    let config = load_config(&args.path).unwrap_or_else(|err| {
        eprintln!("❌ Config Error: {}", err);
        process::exit(1);
    });

    // --- NODE BRIDGE START ---
    if args.analyze || args.fix {
        println!("{}", "   🚀 Handing off to Node Engine...".cyan());
        run_node_engine(&args.path, args.fix);
        process::exit(0);
    }
    // --- NODE BRIDGE END ---
    
    // 2. Scan for Bloat
    println!("{}", "   Scanning dependencies...".dimmed());
    let violations = scan_project(&args.path, &config.banned);

    if !violations.is_empty() {
        println!("{}", format!("⚠️  Found {} violations", violations.len()).yellow());
        for v in &violations {
            println!("   - {}", v.red());
        }
    } else {
        println!("{}", "   ✨ dependencies look clean.".green());
    }

    // 3. Enforce (Phone Home)
    println!("{}", "   Verifying license & policy...".dimmed());
    match verify_license(&config.license_key, violations).await {
        Ok(true) => {
            println!("{}", "✅ Build Approved".bold().green());
            process::exit(0);
        }
        Ok(false) => {
            println!("{}", "⛔ Build Rejected by Policy API".bold().red());
            process::exit(1);
        }
        Err(e) => {
            eprintln!("❌ API Error: {}", e);
            process::exit(1);
        }
    }
}

// --- Helpers ---

fn load_config(root: &str) -> anyhow::Result<Config> {
    let path = Path::new(root).join("lean-stack.config.json");
    if !path.exists() {
        // Fallback or Error? For this specific, let's error if missing
        anyhow::bail!("lean-stack.config.json not found");
    }
    let content = fs::read_to_string(path)?;
    let config: Config = serde_json::from_str(&content)?;
    Ok(config)
}

fn scan_project(root: &str, banned: &[String]) -> Vec<String> {
    // Collect all package.json files
    let entries: Vec<_> = WalkDir::new(root)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_name() == "package.json")
        .filter(|e| !e.path().to_string_lossy().contains("node_modules"))
        .collect();

    println!("Debug: Found {} package.json files in {}", entries.len(), root);

    // Parallel scan
    let violations: Vec<String> = entries
        .par_iter() // Rayon parallelism
        .flat_map(|entry| {
            let mut local_violations = Vec::new();
            if let Ok(content) = fs::read_to_string(entry.path()) {
                if let Ok(pkg) = serde_json::from_str::<PackageJson>(&content) {
                    println!("Debug: Parsed {:?}", entry.path());
                    let mut deps = HashSet::new();
                    if let Some(d) = pkg.dependencies { deps.extend(d.keys().cloned()); }
                    if let Some(d) = pkg.dev_dependencies { deps.extend(d.keys().cloned()); }

                    println!("Debug: Deps found: {:?}", deps);

                    for dep in deps {
                        if banned.contains(&dep) {
                            println!("Debug: VIOLATION Found: {}", dep);
                            local_violations.push(format!("Banned package '{}' found in {:?}", dep, entry.path()));
                        }
                    }
                } else {
                    println!("Debug: Failed to parse {:?}", entry.path());
                }
            }
            local_violations
        })
        .collect();

    violations
}

async fn verify_license(key: &str, violations: Vec<String>) -> anyhow::Result<bool> {
    let client = reqwest::Client::new();
    let payload = Payload {
        license_key: key.to_string(),
        violations,
    };

    let res = client.post("http://localhost:3000/api/v1/verify")
        .json(&payload)
        .send()
        .await?;

    if res.status().is_success() {
        let body: ApiResponse = res.json().await?;
        return Ok(body.status == "approved");
    }

    Ok(false)
}

fn run_node_engine(path: &str, fix: bool) {
    // 1. Resolve absolute path to node_engine/index.js relative to this executable
    // Structure:
    //   /path/to/node_modules/lean-stack-auditor/bin/lean-stack-auditor (wrapper script) -> spawns binary
    //   /path/to/node_modules/lean-stack-auditor/bin/lean-stack-auditor-binary (actual binary)
    //   /path/to/node_modules/lean-stack-auditor/node_engine/index.js (target)
    
    let exe_path = std::env::current_exe().expect("Failed to get current executable path");
    let bin_dir = exe_path.parent().expect("Failed to get binary directory");
    // Go up one level from 'bin' to package root, then into 'node_engine'
    let package_root = bin_dir.parent(); 
    
    // Check if we are in dev (target/debug/...) or prod
    // In dev: rust_agent/target/debug/agent. parent is debug. parent is target. parent is rust_agent. 
    // And node_engine is sibling of rust_agent.
    
    let mut script_path = std::path::PathBuf::new();
    
    // Simple heuristic: check relative to bin first (Prod), then dev fallback
    let prod_path = bin_dir.join("../node_engine/index.js");
    let dev_path = bin_dir.join("../../../node_engine/index.js"); // target/debug/deps -> ../../../
    
    if prod_path.exists() {
        script_path = prod_path;
    } else if dev_path.exists() {
         script_path = dev_path;
    } else {
        // Fallback for local cargo run
        script_path = std::path::PathBuf::from("node_engine/index.js");
    }

    let script_path = script_path.canonicalize().unwrap_or(script_path);

    let mut cmd = process::Command::new("node");
    cmd.arg(script_path); 
    
    if fix {
        cmd.arg("--fix");
    }

    cmd.current_dir(path); // Run Node in the project root

    // Pass through stdio
    cmd.stdout(process::Stdio::inherit())
       .stderr(process::Stdio::inherit())
       .stdin(process::Stdio::inherit());

    let status = cmd.status().expect("Failed to execute Node engine");
    
    if !status.success() {
        process::exit(status.code().unwrap_or(1));
    }
}
