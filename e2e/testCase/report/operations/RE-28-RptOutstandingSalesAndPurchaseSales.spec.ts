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
const buyerName = 'ICOF Europe GmbH';
const buyerSeletionName = 'ICOF Europe GmbH';
const productDivision = 'Fatty Alcohol';
const contractStatus = 'Active';

// Timeout removed - using global configuration

test.beforeEach(async ({ page }) => {
  // Using the login function from baseCase.ts
  await login(page);
});

test('Outstanding Sales Report', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Outstanding Sales Report';

  await page.goto(`${reporturl.url}Report/Operation/RptOutstandingSalesAndPurchase.aspx?ReportType=Sales`);

  // Verify default status
  await expectResult(page, "//span[@id='select2-lstContractStatus-container']", contractStatus);

  // Fill in the search form
  // Enter Contract Number
  await type(page, "//input[@id='txtContractNo']", contractNo);

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