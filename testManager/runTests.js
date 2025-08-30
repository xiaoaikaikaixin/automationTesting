#!/usr/bin/env node

/**
 * Test Runner CLI
 * 
 * This script provides a command-line interface for running tests with specific filters and options.
 * It uses the test configuration from testConfig.json and allows filtering by tags, priority, etc.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Parse command line arguments
const args = process.argv.slice(2);
let options = {
  tags: [],
  priority: null,
  headed: false,
  workers: null,
  grep: null,
  debug: false,
  config: 'testConfig.json'
};

// Parse arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--tags' && i + 1 < args.length) {
    options.tags = args[++i].split(',');
  } else if (arg === '--priority' && i + 1 < args.length) {
    options.priority = parseInt(args[++i], 10);
  } else if (arg === '--headed') {
    options.headed = true;
  } else if (arg === '--workers' && i + 1 < args.length) {
    options.workers = parseInt(args[++i], 10);
  } else if (arg === '--grep' && i + 1 < args.length) {
    options.grep = args[++i];
  } else if (arg === '--debug') {
    options.debug = true;
  } else if (arg === '--config' && i + 1 < args.length) {
    options.config = args[++i];
  } else if (arg === '--help') {
    printHelp();
    process.exit(0);
  }
}

// Load test configuration
function loadTestConfig() {
  const configPath = path.join(__dirname, options.config);
  try {
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error(`Error loading test configuration: ${error}`);
    return { tests: [] };
  }
}

// Filter tests based on options
function filterTests(tests) {
  return tests.filter(test => {
    // Filter by enabled status
    if (!test.enabled) {
      return false;
    }
    
    // Filter by tags
    if (options.tags.length > 0) {
      if (!test.tags || !options.tags.some(tag => test.tags.includes(tag))) {
        return false;
      }
    }
    
    // Filter by priority
    if (options.priority !== null) {
      if (test.priority !== options.priority) {
        return false;
      }
    }
    
    return true;
  });
}

// Print help information
function printHelp() {
  console.log(`
Test Runner CLI

Usage: node runTests.js [options]

Options:
  --tags tag1,tag2,...    Filter tests by tags
  --priority number       Filter tests by priority
  --headed                Run tests with browser visible
  --workers number        Number of parallel workers
  --grep pattern          Filter tests by name pattern
  --debug                 Run in debug mode
  --config filename       Specify config file (default: testConfig.json)
  --help                  Show this help message
`);
}

// Run tests
async function runTests() {
  const config = loadTestConfig();
  const filteredTests = filterTests(config.tests);
  
  if (filteredTests.length === 0) {
    console.log('No tests match the specified criteria.');
    return;
  }
  
  console.log('\nTests to be executed:');
  filteredTests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}`);
  });
  
  // Ask for confirmation
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('\nDo you want to proceed? (y/n) ', (answer) => {
    rl.close();
    
    if (answer.toLowerCase() === 'y') {
      // Build command
      let command = 'npx playwright test ./testManager/testRun.ts';
      
      if (options.headed) {
        command += ' --headed';
      }
      
      if (options.workers !== null) {
        command += ` --workers=${options.workers}`;
      }
      
      if (options.grep) {
        command += ` --grep="${options.grep}"`;
      }
      
      if (options.debug) {
        command += ' --debug';
      }
      
      console.log(`\nExecuting: ${command}\n`);
      
      try {
        execSync(command, { stdio: 'inherit' });
      } catch (error) {
        console.error('Test execution failed.');
        process.exit(1);
      }
    } else {
      console.log('Test execution cancelled.');
    }
  });
}

// Run the script
runTests();