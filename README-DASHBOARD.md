# Test Automation Dashboard

## Overview

This is a real-time test automation dashboard that displays test execution results, trends, and statistics. The dashboard automatically updates with the latest test results and provides visual representations of test data through various charts and tables.

## Features

- **Summary Cards**: Display total tests, passed tests, failed tests, and pass rate
- **Distribution Chart**: Visual breakdown of test results (passed/failed/skipped)
- **Trend Chart**: Historical test execution results over time
- **Feature Coverage Chart**: Test coverage by feature
- **Retry Success Chart**: Success rate of test retries
- **Test Results Table**: Detailed list of individual test results
- **Auto-refresh**: Dashboard automatically refreshes every 30 seconds

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Install the required dependencies:

```bash
npm install express
```

Or use the provided package.json file:

```bash
npm install -g nodemon  # Optional, for development
npm install
```

### Running the Dashboard

1. Start the dashboard server:

```bash
node serve-dashboard.js
```

Or using npm script (if using the provided package.json):

```bash
npm run dashboard
```

2. Open your browser and navigate to:

```
http://localhost:3000
```

## Dashboard Components

### Summary Cards

The top section displays key metrics:
- Total number of tests
- Number of passed tests
- Number of failed tests
- Overall pass rate percentage

### Charts

1. **Distribution Chart**: Doughnut chart showing the distribution of test results (passed, failed, skipped)
2. **Trend Chart**: Line chart showing test execution trends over the past 7 days
3. **Feature Coverage Chart**: Horizontal bar chart showing test coverage percentage by feature
4. **Retry Success Chart**: Doughnut chart showing the success rate of test retries

### Test Results Table

Detailed table showing individual test results with the following columns:
- Test Name (with link to detailed report)
- Status (PASS/FAIL with color coding)
- Duration
- Flaky indicator
- Retry information

## API Endpoints

The dashboard server provides the following API endpoints:

- `/api/latest-report`: Returns the latest test report data
- `/api/reports`: Returns a list of all available test reports

## Customization

### Time Filters

The dashboard includes time filter buttons (Today, Last 7 Days, Last 30 Days) that can be used to filter the displayed data by time period.

### Auto-refresh

The dashboard automatically refreshes every 30 seconds. You can modify this interval by changing the `setInterval` value in the dashboard.html file.

## Troubleshooting

### Dashboard Not Showing Data

1. Check that test report JSON files exist in the `test-results` directory
2. Verify that the JSON files follow the expected format
3. Check the browser console for any error messages

### Charts Not Displaying

1. Ensure Chart.js is properly loaded
2. Check that the canvas elements exist in the HTML
3. Verify that the chart data is properly formatted

## Contributing

Contributions to improve the dashboard are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.