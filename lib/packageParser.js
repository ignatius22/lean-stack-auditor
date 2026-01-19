import fs from 'fs';
import path from 'path';

export function parsePackageJson(projectPath = process.cwd()) {
  const packagePath = path.join(projectPath, 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    throw new Error('No package.json found in current directory');
  }
  
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  const packageData = JSON.parse(packageContent);
  
  return {
    name: packageData.name || 'Unknown Project',
    version: packageData.version || '0.0.0',
    dependencies: packageData.dependencies || {},
    devDependencies: packageData.devDependencies || {},
    allDependencies: {
      ...packageData.dependencies,
      ...packageData.devDependencies
    }
  };
}

export function getDependencyList(packageData) {
  const deps = [];
  
  for (const [name, version] of Object.entries(packageData.allDependencies)) {
    deps.push({
      name,
      version,
      isDev: packageData.devDependencies && packageData.devDependencies[name] !== undefined
    });
  }
  
  return deps.sort((a, b) => a.name.localeCompare(b.name));
}