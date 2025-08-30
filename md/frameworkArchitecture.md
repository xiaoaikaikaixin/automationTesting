# NCTS Test Framework Architecture

## Architecture Diagram

```
                   ┌─────────────────────┐
                   │   Test Controller   │  ← CLI / CI Trigger (Jenkins, GitHub Actions)
                   └─────────────────────┘
                             │
         ┌──────────────────┼──────────────────┐
         ▼                                      ▼
 ┌─────────────┐                        ┌────────────────┐
 │ Test Manager│ ───── Load/Filter ──► │ Test Scheduler  │
 └─────────────┘                        └────────────────┘
         │                                      │
         ▼                                      ▼
 ┌────────────────┐                    ┌─────────────────┐
 │ Test Executor  │ ◄── Retry Failed ─ │ Result Analyzer  │
 └────────────────┘                    └─────────────────┘
         │                                      │
         ▼                                      ▼
 ┌────────────────┐                    ┌──────────────────────────────┐
 │ Browser Driver │                    │ Reporting & Dashboard System │
 └────────────────┘                    └──────────────────────────────┘
         ▼
 ┌──────────────────────┐
 │ Target Web / API App │
 └──────────────────────┘
```

## Component Descriptions

### Test Controller
- **Implementation**: Command-line interface via `npx playwright test` or CI/CD pipeline
- **Purpose**: Entry point for test execution, handles global configuration and environment setup
- **Files**: `playwright.config.ts`, CI configuration files

### Test Manager
- **Implementation**: Test configuration and management system
- **Purpose**: Loads test configurations, filters tests based on criteria (tags, priority)
- **Files**: `testManager/testRun.ts`, `testManager/testUtils.ts`, `testManager/testConfig.json`

### Test Scheduler
- **Implementation**: Test ordering and dependency management
- **Purpose**: Determines execution order based on priority and dependencies
- **Files**: `testManager/testUtils.ts` (sortTests function)

### Test Executor
- **Implementation**: Test execution engine
- **Purpose**: Runs tests, handles test context and state
- **Files**: `fixture.ts`, test case files in `e2e/testCase/`

### Result Analyzer
- **Implementation**: Test result processing
- **Purpose**: Analyzes test results, determines retry logic
- **Files**: `testManager/testUtils.ts` (result processing functions)

### Browser Driver
- **Implementation**: Playwright browser automation
- **Purpose**: Controls browser interaction, provides browser context
- **Files**: Playwright library, `fixture.ts` (PlaywrightAiFixture)

### Reporting & Dashboard System
- **Implementation**: HTML reports and dashboard visualization
- **Purpose**: Generates test reports, visualizes test results
- **Files**: `dashboard.html`, report generation in `testManager/testUtils.ts`

### Target Web / API App
- **Implementation**: Application under test
- **Purpose**: The system being tested
- **Files**: External to the framework

## Data Flow

1. **Test Initiation**: Tests are triggered via CLI or CI/CD pipeline
2. **Test Configuration**: Test Manager loads and filters tests based on configuration
3. **Test Scheduling**: Tests are ordered based on priority and dependencies
4. **Test Execution**: Tests are executed against the target application
5. **Result Analysis**: Test results are analyzed for pass/fail status
6. **Reporting**: Test results are reported and visualized

## Key Features

- **Configurable Test Execution**: Tests can be filtered and ordered based on configuration
- **Test Dependencies**: Tests can depend on other tests
- **Retry Logic**: Failed tests can be retried
- **Reporting**: Comprehensive HTML reports and dashboard visualization
- **Playwright AI Integration**: Enhanced test automation with AI capabilities

## Extension Points

- **Custom Test Utilities**: Add new utilities in `e2e/utils/`
- **Test Data Management**: Extend test data in `e2e/data/`
- **Reporting Customization**: Customize reports in `testManager/testUtils.ts`
- **Test Configuration**: Modify test configuration in `testManager/testConfig.json`
