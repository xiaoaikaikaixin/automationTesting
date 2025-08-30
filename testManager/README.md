# Playwright Test Manager

## Overview

This test manager provides a centralized way to execute multiple Playwright test files in sequence or in parallel. It simplifies test execution by allowing you to run all tests with a single command.

## Basic Test Manager

The basic test manager (`testRun.ts`) imports all test files and executes them according to the configuration in `playwright.config.ts`. The order of imports in `testRun.ts` determines the execution sequence when running tests sequentially.

### Usage

To run all tests through the basic test manager:

```bash
npx playwright test ./testManager/testRun.ts
```

To run with browser UI visible:

```bash
npx playwright test ./testManager/testRun.ts --headed
```

## Advanced Test Manager

The advanced test manager (`advancedTestRun.ts`) provides more control over test execution, including:

- Configurable test execution order
- Test dependencies
- Test filtering by tags and priority
- Test execution reporting

### Configuration

Tests are configured in `testConfig.json` with the following structure:

```json
{
  "tests": [
    {
      "name": "Test Name",
      "path": "../path/to/test/file",
      "enabled": true,
      "dependencies": ["Dependency Test Name"],
      "priority": 1,
      "tags": ["tag1", "tag2"]
    }
  ]
}
```

### Usage

To run tests with the advanced test manager:

```bash
npx playwright test ./testManager/advancedTestRun.ts
```

## Test Runner CLI

The Test Runner CLI (`runTests.js`) provides a command-line interface for running tests with specific filters and options.

### Usage

```bash
node ./testManager/runTests.js [options]
```

### Options

- `--tags tag1,tag2,...` - Filter tests by tags
- `--priority number` - Filter tests by priority
- `--headed` - Run tests with browser visible
- `--workers number` - Number of parallel workers
- `--grep pattern` - Filter tests by name pattern
- `--debug` - Run in debug mode
- `--config filename` - Specify config file (default: testConfig.json)
- `--help` - Show help message

## Adding New Tests

### Basic Test Manager

To add a new test to the basic test manager:

1. Create your test file following the Playwright test pattern
2. Import the file at the top of `testRun.ts`:

```typescript
import '../path/to/your/newTest';
```

### Advanced Test Manager

To add a new test to the advanced test manager:

1. Create your test file following the Playwright test pattern
2. Add the test configuration to `testConfig.json`
3. Add the import statement for the test file in `advancedTestRun.ts`

## Current Test Suite

The test manager currently executes the following tests:

1. Create Unsold Order workflow (`exampleAIPlaywrithScript.ts`)
2. Download Sales Division Report (`report.ts`)

## Troubleshooting

If tests are failing due to connection issues or timeouts:

- Check that the application under test is accessible
- Verify that test credentials and data are correct
- Increase timeouts in the test files or in `playwright.config.ts`
- Check network connectivity and firewall settings

## Utility Functions

The `testUtils.ts` file provides utility functions for test management:

- `loadTestConfig(configPath)` - Load test configuration from a JSON file
- `saveTestConfig(config, configPath)` - Save test configuration to a JSON file
- `filterTests(tests, options)` - Filter tests based on criteria
- `sortTests(tests)` - Sort tests by priority and dependencies
- `generateReport(tests, results, outputPath)` - Generate a test execution report