# NCTS Automation Framework

## Project Structure

```
NCTS/
│
├── e2e/                             # End-to-end test files
|   ├──md/    
|   |   ├──testCase.md            # Test case documentation                            
│   ├── data/                     # Test data files
│   │   ├── freightChargeTestData.ts
│   │   ├── testData.ts
│   │   └── tradingSlipTestData.ts
│   │
│   ├── testCase/                 # Organized test suites
│   │   ├── freightCharge/        # Freight charge related tests
│   │   │   ├── freightChargeCreationAI.spec.ts
│   │   │   ├── freightChargeCreationAIScipt.spec.ts
│   │   │   └── freightChargeCreationScript.spec.ts
│   │   │
│   │   ├── report/              # Report related tests
│   │   │   ├── reportData.ts
│   │   │   └── salesDivisionReport.spec.ts
│   │   │
│   │   └── tradingSlip/         # Trading slip related tests
│   │       ├── TS-01-CreateNormalOrderWithBasisCD.spec.ts
│   │       ├── TS-02-CreateNormalOrderWihtoutFC.spec.ts
│   │       └── ... (other trading slip test cases)
│   │
│   └── utils/                   # Test utilities
│       ├── autoLogger.ts        # Automated logging
│       ├── baseCase.ts          # Base test cases (login, etc.)
│       ├── baseTest.ts          # Common test functions
│       ├── dialogHandler.ts     # Dialog handling utilities
│       └── logger.ts            # Logging utilities
│
├── testManager/                 # Test execution management
│   ├── README.md                # Documentation for test manager
│   ├── runTests.js              # Script to run tests
│   ├── testConfig.json          # Test configuration
│   ├── testRun.ts               # Basic test runner
│   └── testUtils.ts             # Test utilities for reporting and configuration
│
├── midscene_run/                # Test execution artifacts
│   ├── cache/                   # Test cache files
│   ├── log/                     # Log files
│   ├── output/                  # Test output files
│   └── report/                  # Test reports with timestamps
│       └── YYYY-MM-DDT_HH_MM/   # Report directories with timestamp
│
├── test-results/                # Playwright test results
│   └── .playwright-artifacts-0/ # Playwright artifacts (traces, videos)
│
       
│
├── .env                         # Environment variables
├── .gitignore                   # Git ignore file
├── dashboard.html               # Test dashboard UI
├── fixture.ts                   # Playwright AI fixture setup
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json                # TypeScript configuration
└── yaml/                        # YAML configuration files
```

## Key Components

### Test Structure

- **Test Cases**: Located in `e2e/testCase/` organized by feature area
- **Test Data**: Located in `e2e/data/` with separate files for different test scenarios
- **Utilities**: Common functions in `e2e/utils/` for test operations

### Test Execution

- **Test Manager**: Centralized test execution through `testManager/testRun.ts`
- **Configuration**: Test settings in `testConfig.json` and `playwright.config.ts`
- **Reporting**: HTML reports generated in `midscene_run/report/` with timestamp-based directories

### Fixtures

- **Playwright AI Fixture**: Extended test fixture in `fixture.ts` using `@midscene/web/playwright`

### Utilities

- **Base Test Functions**: Common operations like click, type, dropdown in `baseTest.ts`
- **Base Case Functions**: Common workflows like login in `baseCase.ts`
- **Dialog Handler**: Utilities for handling confirmation dialogs in `dialogHandler.ts`
- **Logging**: Automated logging utilities in `autoLogger.ts` and `logger.ts`

## Running Tests

### Basic Test Execution

```bash
npx playwright test ./testManager/testRun.ts
```

### With Browser UI Visible

```bash
npx playwright test ./testManager/testRun.ts --headed
```

### Running Specific Tests

Tests can be filtered by tags and priority in `testConfig.json`.

## Reporting

- **HTML Reports**: Generated in `midscene_run/report/YYYY-MM-DDT_HH_MM/`
- **Dashboard**: Interactive dashboard in `dashboard.html` for test results visualization
- **Artifacts**: Test videos and traces stored in `test-results/.playwright-artifacts-0/`

## Test Configuration

Tests are configured in `testManager/testConfig.json` with the following structure:

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
