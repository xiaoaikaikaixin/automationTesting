/**
 * Test Utilities
 * 
 * This file provides utility functions for test management, reporting, and configuration.
 */

import fs from 'fs';
import path from 'path';

// Types for test configuration
export interface TestCase {
  name: string;
  path: string;
  enabled: boolean;
  dependencies: string[];
  priority: number;
  tags?: string[];
}

export interface TestConfig {
  tests: TestCase[];
}

/**
 * Load test configuration from a JSON file
 * @param configPath Path to the configuration file
 * @returns Test configuration object
 */
export function loadTestConfig(configPath: string): TestConfig {
  try {
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData) as TestConfig;
  } catch (error) {
    console.error(`Error loading test configuration: ${error}`);
    return { tests: [] };
  }
}

/**
 * Save test configuration to a JSON file
 * @param config Test configuration object
 * @param configPath Path to save the configuration file
 */
export function saveTestConfig(config: TestConfig, configPath: string): void {
  try {
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error saving test configuration: ${error}`);
  }
}

/**
 * Filter tests based on criteria
 * @param tests Array of test cases
 * @param options Filter options
 * @returns Filtered array of test cases
 */
export function filterTests(tests: TestCase[], options: {
  enabled?: boolean;
  tags?: string[];
  priorityRange?: [number, number];
}): TestCase[] {
  return tests.filter(test => {
    // Filter by enabled status
    if (options.enabled !== undefined && test.enabled !== options.enabled) {
      return false;
    }
    
    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      if (!test.tags || !options.tags.some(tag => test.tags?.includes(tag))) {
        return false;
      }
    }
    
    // Filter by priority range
    if (options.priorityRange) {
      const [min, max] = options.priorityRange;
      if (test.priority < min || test.priority > max) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Sort tests by priority and dependencies
 * @param tests Array of test cases
 * @returns Sorted array of test cases
 */
export function sortTests(tests: TestCase[]): TestCase[] {
  // First sort by priority
  const sortedByPriority = [...tests].sort((a, b) => a.priority - b.priority);
  
  // Then resolve dependencies
  const result: TestCase[] = [];
  const processed = new Set<string>();
  
  function processDependencies(test: TestCase) {
    // Skip if already processed
    if (processed.has(test.name)) {
      return;
    }
    
    // Process dependencies first
    for (const depName of test.dependencies) {
      const depTest = sortedByPriority.find(t => t.name === depName);
      if (depTest && !processed.has(depName)) {
        processDependencies(depTest);
      }
    }
    
    // Add test to result
    result.push(test);
    processed.add(test.name);
  }
  
  // Process all tests
  for (const test of sortedByPriority) {
    processDependencies(test);
  }
  
  return result;
}

/**
 * Generate a test execution report
 * @param tests Array of test cases that were executed
 * @param results Test results (pass/fail status)
 * @param outputPath Path to save the report
 */
export async function generateReport(tests: TestCase[], results: Record<string, boolean>, outputPath: string): Promise<void> {
  try {
    // Create report data object
    const reportData = {
      timestamp: new Date().toISOString(),
      totalTests: tests.length,
      passedTests: Object.values(results).filter(Boolean).length,
      failedTests: Object.values(results).filter(result => !result).length,
      testResults: tests.map(test => ({
        name: test.name,
        path: test.path,
        result: results[test.name] ? 'PASS' : 'FAIL'
      }))
    };
    
    // Log the test results for debugging
    console.log('Test Results Summary:');
    console.log(`Total Tests: ${reportData.totalTests}`);
    console.log(`Passed Tests: ${reportData.passedTests}`);
    console.log(`Failed Tests: ${reportData.failedTests}`);
    reportData.testResults.forEach(test => {
      console.log(`${test.name}: ${test.result}`);
    });
    
    // Ensure report directory exists
    const reportDir = path.dirname(outputPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    const baseName = path.basename(outputPath);
    const m = baseName.match(/test-report-(.+)\.html$/);
    const slug = m ? m[1] : undefined;
    if (slug) {
      const runJsonPath = path.join(process.cwd(), 'midscene_run', 'report', slug, 'test-results.json');
      // Wait up to ~5s for reporter to flush JSON
      let tries = 0;
      while (!fs.existsSync(runJsonPath) && tries < 20) {
        await new Promise(res => setTimeout(res, 250));
        tries++;
      }
      if (fs.existsSync(runJsonPath)) {
        try {
          const runData = JSON.parse(fs.readFileSync(runJsonPath, 'utf8'));
          const durationMapByTitle: Record<string, number> = {};
          const durationMapById: Record<string, number> = {};
          const collect = (node: any) => {
            if (!node) return;
            const specs = node.specs || [];
            for (const spec of specs) {
              let ms: number | null = null;
              const testsArr = spec.tests || [];
              for (const t of testsArr) {
                const resArr = t.results || [];
                for (const r of resArr) {
                  if (typeof r.duration === 'number') ms = r.duration;
                }
              }
              if (ms != null) {
                // Map by spec title
                durationMapByTitle[spec.title] = ms;
                // Map by file name (without .spec.ts)
                if (typeof spec.file === 'string') {
                  const parts = spec.file.split('/');
                  const fileName = parts[parts.length - 1] || '';
                  const id = fileName.replace('.spec.ts', '');
                  if (id) durationMapById[id] = ms;
                }
              }
            }
            const suites = node.suites || [];
            for (const s of suites) collect(s);
          };
          collect(runData);
          const format = (ms: number) => (ms / 1000).toFixed(1) + 's';
          const normalize = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
          const titleEntries = Object.entries(durationMapByTitle).map(([k, v]) => [normalize(k), v] as [string, number]);
          reportData.testResults = reportData.testResults.map(tr => {
            const pathParts = (tr.path || '').split('/');
            const fileName = pathParts[pathParts.length - 1] || '';
            const id = fileName.replace('.spec.ts', '');
            const nameNorm = normalize(tr.name);
            let ms: number | undefined = undefined;
            if (id && durationMapById[id] != null) {
              ms = durationMapById[id];
            } else {
              for (const [normTitle, dur] of titleEntries) {
                if (nameNorm && (nameNorm.includes(normTitle) || normTitle.includes(nameNorm))) {
                  ms = dur;
                  break;
                }
              }
            }
            return {
              ...tr,
              duration: typeof ms === 'number' ? format(ms) : 'N/A'
            };
          });
        } catch {}
      }
    }
    
    // Save JSON report
    const jsonOutputPath = outputPath.replace(/\.html$/, '.json');
    fs.writeFileSync(jsonOutputPath, JSON.stringify(reportData, null, 2), 'utf8');
    console.log(`Test report JSON generated at: ${jsonOutputPath}`);
    
    // Generate HTML report using dashboard template
    generateHtmlReport(reportData, outputPath);
    console.log(`Test report HTML generated at: ${outputPath}`);
  } catch (error) {
    console.error(`Error generating test report: ${error}`);
  }
}

/**
 * Generate an HTML report using the dashboard template
 * @param reportData Test report data
 * @param outputPath Path to save the HTML report
 */
function generateHtmlReport(reportData: any, outputPath: string): void {
  // Get the dashboard template
  const dashboardTemplatePath = path.join(process.cwd(), 'dashboard.html');
  let dashboardHtml = fs.readFileSync(dashboardTemplatePath, 'utf8');
  const baseNameOut = path.basename(outputPath);
  const matchOut = baseNameOut.match(/test-report-(.+)\.html$/);
  const slugOut = matchOut ? matchOut[1] : undefined;
  
  // Calculate pass rate
  const passRate = reportData.totalTests > 0 
    ? ((reportData.passedTests / reportData.totalTests) * 100).toFixed(1) 
    : '0.0';
  
  // Create test data object for the dashboard
  const testData = {
    summary: {
      total: reportData.totalTests,
      passed: reportData.passedTests,
      failed: reportData.failedTests,
      skipped: 0,
      passRate: passRate
    },
    trends: {
      dates: getLast7Days(),
      passed: [0, 0, 0, 0, 0, 0, reportData.passedTests],
      failed: [0, 0, 0, 0, 0, 0, reportData.failedTests],
      total: [0, 0, 0, 0, 0, 0, reportData.totalTests]
    },
    features: {
      names: getFeatureNames(reportData.testResults),
      coverage: getFeatureCoverage(reportData.testResults)
    },
    retryStats: {
      success: 80, // Default value, would be calculated from actual retry data
      failure: 20
    }
  };
  
  // Replace the sample data in the dashboard template with actual data
  const dataScript = `
    // Test data loaded from test results
    const testData = ${JSON.stringify(testData, null, 2)};
    
    // Test results for table view
    const testResults = ${JSON.stringify(reportData.testResults, null, 2)};
    
    // Report slug derived from output file name
    const reportSlug = ${JSON.stringify(slugOut || '')};
  `;
  
  // Replace the sample data script with our actual data
  dashboardHtml = dashboardHtml.replace(
    /\/\/ Sample data - in a real implementation[\s\S]*?\};/,
    dataScript
  );
  
  // Replace the sample data script with our actual data
  dashboardHtml = dashboardHtml.replace(
    /<!-- Sample data, will be replaced with actual data -->[\s\S]*?<\/tbody>/,
    generateTableRows(reportData.testResults, slugOut || process.env.TEST_RUN_TIMESTAMP || (global as any).latestReportTimestamp)
  );
  
  // Uncomment the loadTestData function call
  dashboardHtml = dashboardHtml.replace(
    /\/\/ loadTestData\(\);/,
    'document.addEventListener(\'DOMContentLoaded\', function() { updateDashboardWithTestData(); });'
  );
  
  // Add function to update the dashboard with test data
  const updateFunction = `
  function updateDashboardWithTestData() {
    // Update summary cards
    document.getElementById('total-tests').textContent = testData.summary.total;
    document.getElementById('passed-tests').textContent = testData.summary.passed;
    document.getElementById('failed-tests').textContent = testData.summary.failed;
    document.getElementById('pass-rate').textContent = testData.summary.passRate + '%';
    
    // Update table with test results
    const tbody = document.getElementById('test-results');
    tbody.innerHTML = '';
    
    // Use slug from filename to link to the correct report folder
    const reportTimestamp = (typeof reportSlug === 'string' && reportSlug.length > 0) ? reportSlug : (function() {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const hour = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      return date + 'T_' + hour + '_' + minutes;
    })();
    document.getElementById('report-timestamp').textContent = 'Report: ' + reportTimestamp;
    
    testResults.forEach(test => {
      const row = document.createElement('tr');
      
      // Extract the test name from the path to create a unique identifier
      const pathParts = test.path.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const testId = fileName.replace('.spec.ts', '');
      
      const nameCell = document.createElement('td');
      const nameLink = document.createElement('a');
      // Include the NCTS project name in the path
      const basePath = '../../NCTS/midscene_run/report/';
      const encodedPath = basePath + reportTimestamp + '/index.html#' + testId;
      nameLink.href = encodedPath;
      nameLink.className = 'test-link';
      nameLink.textContent = test.name;
      nameCell.appendChild(nameLink);
      row.appendChild(nameCell);
      
      const statusCell = document.createElement('td');
      statusCell.textContent = test.result;
      statusCell.className = test.result === 'PASS' ? 'status-passed' : 'status-failed';
      row.appendChild(statusCell);
      
      const durationCell = document.createElement('td');
      durationCell.textContent = test.duration || 'N/A';
      row.appendChild(durationCell);
      
      const flakyCell = document.createElement('td');
      row.appendChild(flakyCell);
      
      const retryCell = document.createElement('td');
      retryCell.textContent = 'No retries';
      row.appendChild(retryCell);
      
      tbody.appendChild(row);
    });
  }
  `;
  
  // Add the update function to the dashboard HTML
  dashboardHtml = dashboardHtml.replace(
    '</script>\n</body>',
    `${updateFunction}\n\n  document.addEventListener('DOMContentLoaded', function() { try { updateDashboardWithTestData(); } catch (e) { console.error(e); } });\n</script>\n</body>`
  );
  
  // Write the HTML report to the output path
  fs.writeFileSync(outputPath, dashboardHtml, 'utf8');
}

/**
 * Generate HTML table rows for test results
 * @param testResults Array of test results
 * @param slug Report folder slug (timestamp)
 * @returns HTML string for table rows
 */
function generateTableRows(testResults: any[], slug?: string): string {
  // Prefer the provided slug to avoid mismatches
  const timestamp = slug || process.env.TEST_RUN_TIMESTAMP || (global as any).latestReportTimestamp || (() => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const hour = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return date + 'T_' + hour + '_' + minutes;
  })();
  
  return testResults.map(test => {
    const statusClass = test.result === 'PASS' ? 'status-passed' : 'status-failed';
    // Extract the test name from the path to create a unique identifier
    const pathParts = test.path.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const testId = fileName.replace('.spec.ts', '');
    
    return '<tr>\n          <td><a href="../../NCTS/midscene_run/report/' + timestamp + '/index.html#' + testId + '" class="test-link">' + test.name + '</a></td>\n          <td class="' + statusClass + '">' + test.result + '</td>\n          <td>' + (test.duration || 'N/A') + '</td>\n          <td></td>\n          <td>No retries</td>\n        </tr>\n    ';
  }).join('') + '\n      </tbody>';
}

/**
 * Get the last 7 days as formatted strings
 * @returns Array of date strings
 */
function getLast7Days(): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    dates.push(`${month} ${day}`);
  }
  
  return dates;
}

/**
 * Extract feature names from test results
 * @param testResults Array of test results
 * @returns Array of feature names
 */
function getFeatureNames(testResults: any[]): string[] {
  // Extract feature names from test paths
  // This is a simple implementation that assumes the directory name is the feature name
  const features = new Set<string>();
  
  testResults.forEach(test => {
    const parts = test.path.split('/');
    if (parts.length > 1) {
      features.add(parts[parts.length - 2]);
    } else {
      features.add('Other');
    }
  });
  
  return Array.from(features);
}

/**
 * Calculate feature coverage percentages
 * @param testResults Array of test results
 * @returns Array of coverage percentages
 */
function getFeatureCoverage(testResults: any[]): number[] {
  const features = getFeatureNames(testResults);
  
  // This is a placeholder implementation
  // In a real implementation, you would calculate actual coverage percentages
  return features.map(() => Math.floor(Math.random() * 40) + 60); // Random values between 60-100%
}
