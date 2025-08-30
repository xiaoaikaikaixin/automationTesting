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
const tsNo = 'TS-2023-001';
const tcNo = 'TC-2023-001';

// Timeout removed - using global configuration

test.beforeEach(async ({ page }) => {
  // Using the login function from baseCase.ts
  await login(page);
});

test('TS With TC No. Listing', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'TS With TC No. Listing';

  await page.goto(`${reporturl.url}Report/Operation/RptTSWithTCNoListing.aspx`);

  // Fill in the search form
  // Enter TS Number
  await type(page, "//input[@id='txtTSNo']", tsNo);

  // Enter TC Number
  await type(page, "//input[@id='txtTCNo']", tcNo);

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