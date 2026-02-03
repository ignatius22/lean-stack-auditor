const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const REPO = 'ignatius22/lean-stack-auditor';
const VERSION = 'v3.0.0'; // Ideally fetched dynamically or matched to package.json version
const BIN_DIR = path.join(__dirname, 'bin');
const BIN_NAME = process.platform === 'win32' ? 'lean-stack-auditor.exe' : 'lean-stack-auditor';

// Map Node OS/Arch to Rust Targets
const PLATFORM_MAP = {
  'darwin': 'apple-darwin',
  'linux': 'unknown-linux-gnu',
  'win32': 'pc-windows-msvc'
};

const ARCH_MAP = {
  'x64': 'x86_64',
  'arm64': 'aarch64'
};

async function install() {
  const platform = PLATFORM_MAP[process.platform];
  const arch = ARCH_MAP[process.arch];

  if (!platform || !arch) {
    console.error(`❌ Unsupported platform: ${process.platform}-${process.arch}`);
    process.exit(1);
  }

  const target = `${arch}-${platform}`;
  // Release asset name format from workflow: lean-stack-auditor-{target}(.exe)
  const assetName = process.platform === 'win32' 
    ? `lean-stack-auditor-${target}.exe`
    : `lean-stack-auditor-${target}`;

  const downloadUrl = `https://github.com/${REPO}/releases/download/${VERSION}/${assetName}`;

  console.log(`⬇️  Downloading Lean Stack Auditor (${target})...`);
  console.log(`   URL: ${downloadUrl}`);

  if (!fs.existsSync(BIN_DIR)) {
    fs.mkdirSync(BIN_DIR);
  }

  const destPath = path.join(BIN_DIR, BIN_NAME);

  try {
    const response = await axios({
      method: 'get',
      url: downloadUrl,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(destPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        if (process.platform !== 'win32') {
          fs.chmodSync(destPath, 0o755); // Make executable
        }
        
        // --- HYBRID INSTALL ---
        console.log('📦 Installing Node Engine dependencies...');
        const nodeEnginePath = path.resolve(__dirname, '../node_engine');
        // Warning: in dev, this might be ../node_engine. In prod, slightly different.
        // Let's assume repo structure is preserved on install or handled by npm pack.
        // Actually, npm publish will include node_engine if not ignored.
        
        try {
            if (fs.existsSync(nodeEnginePath)) {
                execSync('npm install --production --no-audit', { cwd: nodeEnginePath, stdio: 'inherit' });
            } else {
                 console.warn('⚠️ Node Engine not found at ' + nodeEnginePath);
            }
        } catch (e) {
            console.error('⚠️ Failed to install Node Engine deps:', e.message);
        }
        // --- END HYBRID INSTALL ---

        console.log('✅ Installed successfully!');
        resolve();
      });
      writer.on('error', reject);
    });

  } catch (error) {
    console.error(`❌ Download failed: ${error.message}`);
    if (error.response && error.response.status === 404) {
      console.error('   Binary not found for this platform in release assets.');
    }
    process.exit(1);
  }
}

install();
