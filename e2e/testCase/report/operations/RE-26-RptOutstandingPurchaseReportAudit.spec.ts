import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, typeAndTab } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, popupbuttonselector } from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect } from '../../../utils/report/reportBaseCase';

const contractNo = 'CT-2023-001';
const sellerName = 'ABC Supplier';
const sellerSelectionName = 'ABC Supplier';
const productDivision = 'Fatty Alcohol';
const contractStatus = 'Active';

// Timeout removed - using global configuration

test.beforeEach(async ({ page }) => {
  // Using the login function from baseCase.ts
  await login(page);
});

test('Outstanding Purchase Report (Audit)', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Outstanding Purchase Report (Audit)';

  await page.goto(`${reporturl.url}Report/Operation/RptOutstandingPurchaseReportAudit.aspx`);

  // Verify default status
  await expectResult(page, "//span[@id='select2-lstContractStatus-container']", contractStatus);

  // Fill in the search form
  // Enter Contract Number
  await type(page, "//input[@id='txtContractNo']", contractNo);

  // Enter Seller Name
  // await sellerSelect(page, sellerName, sellerSelectionName);

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