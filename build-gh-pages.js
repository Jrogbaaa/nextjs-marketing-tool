const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

// Get the current working directory
const workDir = process.cwd();
console.log(`Working directory: ${workDir}`);

console.log(`${colors.bright}${colors.blue}Building for GitHub Pages${colors.reset}`);

try {
  // Step 1: Ensure we have the temporary directory for building
  const tempDir = path.join(workDir, 'temp-build');
  
  if (fs.existsSync(tempDir)) {
    console.log(`${colors.yellow}Cleaning previous temp directory...${colors.reset}`);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  
  fs.mkdirSync(tempDir, { recursive: true });
  
  // Step 2: Copy only the necessary files for the build
  console.log(`${colors.blue}Copying source files to temp directory...${colors.reset}`);
  
  const srcDir = path.join(workDir, 'src');
  const publicDir = path.join(workDir, 'public');
  const tempSrcDir = path.join(tempDir, 'src');
  const tempPublicDir = path.join(tempDir, 'public');
  
  console.log(`Source directory: ${srcDir}`);
  console.log(`Temp source directory: ${tempSrcDir}`);
  
  fs.mkdirSync(tempSrcDir, { recursive: true });
  fs.mkdirSync(tempPublicDir, { recursive: true });
  
  // Copy src directory - use fs instead of execSync
  if (fs.existsSync(srcDir)) {
    const copyRecursiveSync = (src, dest) => {
      const exists = fs.existsSync(src);
      if (exists) {
        const stats = fs.statSync(src);
        if (stats.isDirectory()) {
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
          });
        } else {
          fs.copyFileSync(src, dest);
        }
      }
    };
    
    copyRecursiveSync(srcDir, tempSrcDir);
    console.log(`${colors.dim}Copied src directory${colors.reset}`);
    
    // Copy public directory
    if (fs.existsSync(publicDir)) {
      copyRecursiveSync(publicDir, tempPublicDir);
      console.log(`${colors.dim}Copied public directory${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}Source directory does not exist: ${srcDir}${colors.reset}`);
  }
  
  // Copy configuration files
  const configFiles = [
    'package.json',
    'tsconfig.json',
    'tailwind.config.js',
    'postcss.config.js',
    '.env.local',
    '.env'
  ];
  
  configFiles.forEach(file => {
    const srcFile = path.join(workDir, file);
    const destFile = path.join(tempDir, file);
    
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`${colors.dim}Copied ${file}${colors.reset}`);
    }
  });
  
  // Create a custom next.config.js for the build
  console.log(`${colors.blue}Creating optimized next.config.js for export${colors.reset}`);
  const nextConfigContent = `
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    output: 'export',
    basePath: process.env.NODE_ENV === 'production' ? '/NEW-MARKETING-TOOL' : '',
    images: {
      unoptimized: true,
    },
    trailingSlash: true,
  };
  
  module.exports = nextConfig;
  `;
  
  fs.writeFileSync(path.join(tempDir, 'next.config.js'), nextConfigContent);
  
  // Create TypeScript declarations for PhantomLaunchResult
  console.log(`${colors.blue}Creating TypeScript declaration files${colors.reset}`);
  const typesDir = path.join(tempDir, 'src', 'types');
  fs.mkdirSync(typesDir, { recursive: true });
  
  const phantomTypesContent = `
  export interface PhantomLaunchResult {
    data: any;
    status: string;
    error?: string;
  }
  `;
  
  fs.writeFileSync(path.join(typesDir, 'phantombuster.d.ts'), phantomTypesContent);
  
  // Step 3: Run the Next.js build in the temp directory
  console.log(`${colors.blue}Building Next.js project...${colors.reset}`);
  try {
    execSync('npm install && npx next build --no-lint', {
      cwd: tempDir,
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
  } catch (error) {
    console.error(`${colors.red}Build failed:${colors.reset}`, error);
    process.exit(1);
  }
  
  // Step 4: Copy the built output to the output directory  
  console.log(`${colors.blue}Step 4: Copying built output to the final destination${colors.reset}`);
  
  const outputDir = path.join(workDir, 'out');
  const nextjsOutputDir = path.join(tempDir, 'out');
  
  if (!fs.existsSync(nextjsOutputDir)) {
    console.error(`${colors.red}Build output directory not found at ${nextjsOutputDir}${colors.reset}`);
    process.exit(1);
  }
  
  // Clean the output directory
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });
  
  // Recursive copy function
  const copyRecursiveSync = (src, dest) => {
    const exists = fs.existsSync(src);
    if (exists) {
      const stats = fs.statSync(src);
      if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(childItemName => {
          copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
      } else {
        fs.copyFileSync(src, dest);
      }
    }
  };
  
  console.log(`${colors.dim}Copying built files from ${nextjsOutputDir} to ${outputDir}${colors.reset}`);
  copyRecursiveSync(nextjsOutputDir, outputDir);
  
  // Create .nojekyll file
  fs.writeFileSync(path.join(outputDir, '.nojekyll'), '');
  console.log(`${colors.dim}Created .nojekyll file${colors.reset}`);
  
  // Step 5: Clean up
  console.log(`${colors.blue}Step 5: Cleaning up${colors.reset}`);
  fs.rmSync(tempDir, { recursive: true, force: true });
  
  console.log(`${colors.green}Build completed successfully! Output is in ${outputDir}${colors.reset}`);
  process.exit(0);
  
} catch (error) {
  console.error(`${colors.red}Build failed:${colors.reset}`, error);
  process.exit(1);
}