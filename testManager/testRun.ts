import { test } from '../fixture.ts';
import { expect } from '@playwright/test';
import { loadTestConfig, sortTests, filterTests, TestCase, generateReport } from './testUtils.ts';
import path from 'path';
import fs from 'fs';

/**
 * Advanced Test Manager
 * 
 * This file provides a more advanced test manager with the ability to:
 * - Configure test execution order
 * - Define test dependencies
 * - Skip tests conditionally
 * - Generate test execution reports
 */

// Load test configuration from JSON file
const configPath = path.join(__dirname, 'testConfig.json');
const testConfig = loadTestConfig(configPath);

// Get enabled tests sorted by priority and dependencies
const enabledTests = sortTests(filterTests(testConfig.tests, { enabled: true }));

// Import test files based on configuration
// Note: Dynamic imports would be ideal here, but for simplicity we'll use static imports
// The actual imports need to be at the top level due to ES module requirements

// Freight Charge test cases
// import '../e2e/testCase/freightCharge/FC-01-freightChargewithPortToPort.spec.ts';
// import '../e2e/testCase/freightCharge/FC-02-freightChargewithDoorToDoor.spec.ts';
// import '../e2e/testCase/freightCharge/FC-03-freightChargeBulkDeliveryMode.spec.ts';

// Trading Slip test cases
// import '../e2e/testCase/tradingSlip/TS-01-CreateNormalOrderWithBasisCD.spec.ts';
import '../e2e/testCase/tradingSlip/TS-01-CreateTradingSlip.spec.ts'
// import '../e2e/testCase/tradingSlip/TS-02-CreateNormalOrderWihtoutFC.spec.ts';
// import '../e2e/testCase/tradingSlip/TS-03-CreateNormalOrderWithFBArrangedBySupplier.spec.ts';
// import '../e2e/testCase/tradingSlip/TS-04-CreateDirectTradingSlip.spec.ts';
// import '../e2e/testCase/tradingSlip/TS-05-CreateUnsoldOrder.spec.ts';
// import '../e2e/testCase/tradingSlip/TS-06-CreateSalesFromUnsold.spec.ts';
// import '../e2e/testCase/tradingSlip/TS-07-CreatePresoldOrder.spec.ts';
// import '../e2e/testCase/tradingSlip/TS-08-CreateBulkShipment.spec.ts';
// import '../e2e/testCase/tradingSlip/TS-09-CreateLocalTrade.spec.ts';

// Master data test cases
// import '../e2e/testCase/master/MD-01-BusinessPartnerForBuyer.spec.ts';

// Report test cases
// import '../e2e/testCase/report/RE-01-SalesDivisionReport.spec.ts';
// import '../e2e/testCase/report/account/RE-01-RptAccrualListingForBrokerage.spec.ts';
// import '../e2e/testCase/report/account/RE-02-RptSalesDetails.spec.ts';
// import '../e2e/testCase/report/freight/RE-03-FreightBookingCancellation.spec.ts';
// import '../e2e/testCase/report/freight/RE-04-RptFreightBudgetVerificationRemarks.spec.ts';
// import '../e2e/testCase/report/freight/RE-05-RptFreightChargeListing.spec.ts';
// import '../e2e/testCase/report/freight/RE-06-RptFreightInvoiceListingPayment.spec.ts';
// import '../e2e/testCase/report/freight/RE-07-RptFreightInvoiceListingAccrual.spec.ts';
// import '../e2e/testCase/report/freight/RE-08-RptOutstandingFreightBillPaymentListing.spec.ts';
// import '../e2e/testCase/report/freight/RE-09-RptPaidShippingLineInvoices.spec.ts';
// import '../e2e/testCase/report/freight/RE-10-RptShippingLineForwarderRegisteredList.spec.ts';
// import '../e2e/testCase/report/freight/RE-11-RptSubCIDispatchedListing.spec.ts';
// import '../e2e/testCase/report/freight/RE-12-RptTotalShipment.spec.ts';
// import '../e2e/testCase/report/freight/RE-13-RptTotalShipmentEAndF.spec.ts';
// import '../e2e/testCase/report/operations/RE-14-RptBuyerWithLimits.spec.ts';
// import '../e2e/testCase/report/operations/RE-15-RptDailyMonitoringShipmentLimit.spec.ts';
// import '../e2e/testCase/report/operations/RE-16-RptIcofSGARAPMatching.spec.ts';
// import '../e2e/testCase/report/operations/RE-17-RptInventoryActivityDetail.spec.ts';
// import '../e2e/testCase/report/operations/RE-18-RptInvoiceListing.spec.ts';
// import '../e2e/testCase/report/operations/RE-19-RptKpiLatePresentationOfExportDocument.spec.ts';
// import '../e2e/testCase/report/operations/RE-20-RptLateDeliveryOutstandingShipmentContract.spec.ts';
// import '../e2e/testCase/report/operations/RE-21-RptLCReportByCountry.spec.ts';
// import '../e2e/testCase/report/operations/RE-22-RptMonthlySalesTurnoverInsuranceByDivision.spec.ts';
// import '../e2e/testCase/report/operations/RE-23-RptMonthlySalesTurnoverInsuranceByDivisionDTC.spec.ts';
// import '../e2e/testCase/report/operations/RE-24-RptOutstandingContractsListing.spec.ts';
// import '../e2e/testCase/report/operations/RE-25-RptOutstandingPurchaseReport.spec.ts';


// Store test results
const testResults: Record<string, boolean> = {};

test.afterAll(async () => {
  enabledTests.forEach((testCase) => {
    let testFailed = false;
    const testResultsDir = path.join(process.cwd(), 'test-results');
    if (fs.existsSync(testResultsDir)) {
      const dirs = fs.readdirSync(testResultsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      const testDirPattern = new RegExp(`.*${testCase.name.replace(/[\s&]/g, '[-]')}.*-chromium$`);
      const matchingDirs = dirs.filter(dir => testDirPattern.test(dir));
      for (const dir of matchingDirs) {
        const errorPath = path.join(testResultsDir, dir, 'error-context.md');
        if (fs.existsSync(errorPath)) {
          testFailed = true;
          break;
        }
      }
    }
    testResults[testCase.name] = !testFailed;
  });
  let timestamp: string;
  if (process.env.TEST_RUN_TIMESTAMP) {
    timestamp = process.env.TEST_RUN_TIMESTAMP;
  } else {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const hour = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    timestamp = date + 'T_' + hour + '_' + minutes + '_' + seconds;
    process.env.TEST_RUN_TIMESTAMP = timestamp;
  }
  const reportDir = path.join(process.cwd(), 'test-results');
  const reportPath = path.join(reportDir, 'test-report-' + timestamp + '.html');
  (global as any).latestReportTimestamp = timestamp;
  await generateReport(enabledTests, testResults, reportPath);
});
 

/**
 * Usage:
 * 
 * 1. Configure your tests in testConfig.json
 * 2. Run the advanced test manager:
 *    npx playwright test ./testManager/advancedTestRun.ts
 * 
 * To add a new test:
 * 1. Add the test configuration to testConfig.json
 * 2. Add the import statement for the test file in this file
 * 
 * To run specific tests by tags:
 * 1. Filter tests using the filterTests function with tag options
 * 2. Only import the filtered test files
 * 
 * The test report will be generated in the test-results directory with the dashboard layout
 */
