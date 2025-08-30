import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, typeAndTab } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, popupbuttonselector } from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect } from '../../../utils/report/reportBaseCase';

const division = 'Fatty Alcohol';
const specialOrderType = 'Normal';
const seller = 'Inter-Continental Oils & Fats Pte. Ltd.';
const invoiceDateFrom = '01-Jan-2024';
const invoiceDateTo = '31-Dec-2024';
const bllDateFrom = '01-Jan-2024';
const bllDateTo = '31-Dec-2024';

// Timeout removed - using global configuration


test('Monthly Sales Turnover (Insurance) By Division', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Monthly Sales Turnover (Insurance) By Division';

  await login(page);
  await page.goto(`${reporturl.url}Report/Operation/RptMonthlySalesTurnoverInsuranceByDivision.aspx`);


  // Enter LC Expiry Date Range
  await type(page, "//input[@id='drInvoiceDate_dFrom_ti']", invoiceDateFrom);
  await type(page, "//input[@id='drInvoiceDate_dTo_ti']", invoiceDateTo);
  await page.click("//label[normalize-space()='Division']");

   // Select Division
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");


  await dropdown(page, "//span[@id='lstSeller']", seller);


  // Select Special Order Type
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialOrderTypes_lb']", specialOrderType);
  await page.click("//label[normalize-space()='Special Order Type']");
  

  await type(page, "//input[@id='drBLDate_dFrom_ti']", bllDateFrom);
  await type(page, "//input[@id='drBLDate_dTo_ti']", bllDateTo);
  
  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});