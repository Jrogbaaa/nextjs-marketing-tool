const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== LinkedIn Lead Analysis System Setup ===');

// Check if package.json exists and is valid
function checkPackageJson() {
  console.log('🔍 Checking package.json...');
  
  try {
    if (fs.existsSync('./package.json')) {
      const packageJson = require('./package.json');
      if (packageJson.name && packageJson.dependencies) {
        console.log('✅ Valid package.json found.');
        return true;
      } else {
        console.log('⚠️ package.json is missing required fields.');
        return false;
      }
    } else {
      console.log('⚠️ package.json not found.');
      return false;
    }
  } catch (error) {
    console.error('❌ Error reading package.json:', error.message);
    return false;
  }
}

// Create or update package.json
function createPackageJson() {
  console.log('📝 Creating package.json...');
  
  const packageJson = {
    "name": "linkedin-lead-analysis",
    "version": "0.1.0",
    "private": true,
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      "test": "node test.js",
      "setup-db": "node setup-database.js"
    },
    "dependencies": {
      "@supabase/auth-helpers-nextjs": "^0.7.0",
      "@supabase/supabase-js": "^2.21.0",
      "axios": "^1.4.0",
      "chart.js": "^4.3.0",
      "dotenv": "^16.0.3",
      "next": "^13.4.1",
      "openai": "^4.0.0",
      "react": "^18.2.0",
      "react-chartjs-2": "^5.2.0",
      "react-dom": "^18.2.0"
    },
    "devDependencies": {
      "@types/node": "^18.16.3",
      "@types/react": "^18.2.0",
      "autoprefixer": "^10.4.14",
      "eslint": "^8.39.0",
      "eslint-config-next": "^13.4.1",
      "postcss": "^8.4.23",
      "tailwindcss": "^3.3.2",
      "typescript": "^5.0.4"
    }
  };
  
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json created successfully.');
}

// Check if .env file exists
function checkEnvFile() {
  console.log('🔍 Checking .env file...');
  
  if (fs.existsSync('./.env')) {
    console.log('✅ .env file found.');
    return true;
  } else if (fs.existsSync('./.env.local')) {
    console.log('✅ .env.local file found.');
    return true;
  } else {
    console.log('⚠️ No .env file found.');
    return false;
  }
}

// Create .env file from template
function createEnvFile() {
  console.log('📝 Creating .env file from template...');
  
  if (fs.existsSync('./.env.template')) {
    fs.copyFileSync('./.env.template', './.env');
    console.log('✅ .env file created from template.');
    console.log('⚠️ Remember to update your .env file with your actual API keys and credentials.');
  } else {
    console.error('❌ .env.template not found. Cannot create .env file.');
  }
}

// Install dependencies
function installDependencies() {
  console.log('📦 Installing dependencies...');
  
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully.');
  } catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
    process.exit(1);
  }
}

// Create required directories
function createDirectories() {
  console.log('📁 Creating project directories...');
  
  const directories = [
    './src',
    './src/app',
    './src/app/api',
    './src/components',
    './src/lib',
    './src/types',
    './public'
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  Created ${dir}`);
    }
  });
  
  console.log('✅ Project directories created successfully.');
}

// Main setup function
async function setup() {
  // Check and create package.json if needed
  const hasValidPackageJson = checkPackageJson();
  if (!hasValidPackageJson) {
    createPackageJson();
  }
  
  // Create directories
  createDirectories();
  
  // Install dependencies
  installDependencies();
  
  // Check and create .env file if needed
  const hasEnvFile = checkEnvFile();
  if (!hasEnvFile) {
    createEnvFile();
  }
  
  console.log('\n✅ Setup completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Update your .env file with your API keys');
  console.log('2. Run "npm run setup-db" to set up the database schema');
  console.log('3. Run "npm run dev" to start the development server');
  
  rl.close();
}

// Run the setup
setup(); 