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
const buyerName = 'ICOF Europe GmbH';
const buyerSeletionName = 'ICOF Europe GmbH';
const contractNo = 'CT-2023-001';

// Timeout removed - using global configuration

test.beforeEach(async ({ page }) => {
  // Using the login function from baseCase.ts
  await login(page);
});

test('Trade Limit Checking (Sales Contract)', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Trade Limit Checking (Sales Contract)';

  await page.goto(`${reporturl.url}Report/Operation/RptTradeLimitCheckingSalesContract.aspx`);

  // Fill in the search form
  // Enter Contract Number
  await type(page, "//input[@id='txtContractNo']", contractNo);

  // Enter Date Range
  await type(page, "//input[@id='txtFromDate']", fromDate);
  await type(page, "//input[@id='txtToDate']", toDate);

  // Enter Buyer Name
  await popupselection(page, "//input[@id='pstxtBPName_pop']", "//iframe[@id='pstxtBPName_pop_pop_fr1']", buyerName);
  await type(page, "//input[@id='txtBPSelectionName']", buyerSeletionName);

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