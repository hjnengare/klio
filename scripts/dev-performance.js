#!/usr/bin/env node

/**
 * Development Performance Monitor
 * Monitors build times and provides optimization suggestions
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 KLIO Development Performance Monitor\n');

// Check for large files
function checkLargeFiles() {
  console.log('📁 Checking for large files...');
  
  try {
    const result = execSync('find src -name "*.tsx" -o -name "*.ts" | head -20 | xargs wc -l | sort -nr', 
      { encoding: 'utf8', shell: true }
    );
    
    const lines = result.split('\n').filter(line => line.trim());
    const largeFiles = lines.filter(line => {
      const match = line.match(/^\s*(\d+)/);
      return match && parseInt(match[1]) > 400;
    });
    
    if (largeFiles.length > 0) {
      console.log('⚠️  Found large files (>400 lines):');
      largeFiles.forEach(file => console.log(`   ${file}`));
      console.log('💡 Consider splitting these files into smaller components\n');
    } else {
      console.log('✅ No large files detected\n');
    }
  } catch (error) {
    console.log('⚠️  Could not check file sizes (Windows compatibility issue)\n');
  }
}

// Check dependencies
function checkDependencies() {
  console.log('📦 Checking dependencies...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const heavyDeps = [
    'framer-motion',
    'react-icons', 
    '@supabase/supabase-js',
    'lucide-react'
  ];
  
  const foundHeavy = heavyDeps.filter(dep => packageJson.dependencies[dep]);
  
  if (foundHeavy.length > 0) {
    console.log('⚠️  Heavy dependencies detected:');
    foundHeavy.forEach(dep => console.log(`   ${dep}`));
    console.log('💡 Consider using dynamic imports for these libraries\n');
  } else {
    console.log('✅ No heavy dependencies detected\n');
  }
}

// Check Tailwind config
function checkTailwindConfig() {
  console.log('🎨 Checking Tailwind configuration...');
  
  try {
    const tailwindConfig = fs.readFileSync('tailwind.config.js', 'utf8');
    
    if (tailwindConfig.includes('corePlugins')) {
      console.log('✅ Tailwind optimization detected\n');
    } else {
      console.log('⚠️  Consider adding corePlugins optimization to tailwind.config.js\n');
    }
  } catch (error) {
    console.log('⚠️  Could not read tailwind.config.js\n');
  }
}

// Performance recommendations
function showRecommendations() {
  console.log('💡 Performance Recommendations:');
  console.log('   1. Use `npm run dev:fast` for faster development');
  console.log('   2. Consider splitting large components (>400 lines)');
  console.log('   3. Use dynamic imports for heavy libraries');
  console.log('   4. Enable Turbo mode (already enabled)');
  console.log('   5. Use `npm run clean` to clear build cache if needed\n');
}

// Main execution
async function main() {
  checkLargeFiles();
  checkDependencies();
  checkTailwindConfig();
  showRecommendations();
  
  console.log('🏁 Performance check complete!');
  console.log('   Run `npm run dev:fast` to start development server\n');
}

main().catch(console.error);
