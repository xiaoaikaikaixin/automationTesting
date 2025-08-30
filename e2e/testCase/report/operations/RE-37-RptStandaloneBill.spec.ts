import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, typeAndTab } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, popupbuttonselector } from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect } from '../../../utils/report/reportBaseCase';

const fromDate = '01/01/2023';
const toDate = '31/12/2023';
const productDivision = 'Fatty Alcohol';
const billNo = 'BILL-2023-001';
const billStatus = 'Active';

// Timeout removed - using global configuration

test.beforeEach(async ({ page }) => {
  // Using the login function from baseCase.ts
  await login(page);
});

test('Standalone Bill Listing', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Standalone Bill Listing';

  await page.goto(`${reporturl.url}Report/Operation/RptStandaloneBill.aspx`);

  // Verify default status
  await expectResult(page, "//span[@id='select2-lstBillStatus-container']", billStatus);

  // Fill in the search form
  // Enter Bill Number
  await type(page, "//input[@id='txtBillNo']", billNo);

  // Enter Date Range
  await type(page, "//input[@id='txtFromDate']", fromDate);
  await type(page, "//input[@id='txtToDate']", toDate);

  // Select Division
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddProductDivision_lb']", productDivision);
  await page.click("//label[normalize-space()='Division']");

  // Click search button
  await searchButton(page);

  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});