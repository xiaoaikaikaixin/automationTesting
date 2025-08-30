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
const deliveryMode = '20FT FCL';
const specialOrderType = 'Normal';
const issuingBankCountry = 'Republic of Korea';
const lcDateFrom = '01-Jan-2020';
const lcDateTo = '31-Dec-2020';
const lcExpiryDateFrom = '01-Jan-2020';
const lcExpiryDateTo = '31-Dec-2020';

// Timeout removed - using global configuration



test('LC Report by Country', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'LC Report by Country';

  await login(page);
  await page.goto(`${reporturl.url}Report/Operation/RptLCReportByCountry.aspx`);

  // Select Division
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivision_lb']", division);
  await page.click("//label[normalize-space()='Division']");

  // Select Special Order Type
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialOrderType_lb']", specialOrderType);
  await page.click("//label[normalize-space()='Special Order Type']");
  
  // Select Delivery Mode
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDeliveryMode_lb']", deliveryMode);
  await page.click("//label[normalize-space()='Delivery Mode']");
  

  await typeAndTab(page, "//span[@id='acIssuingBankCountry']//span[2]/div/input", issuingBankCountry);
  await page.click("//label[normalize-space()='Special Order Type']");
  
  // Enter LC Expiry Date Range
  await type(page, "//input[@id='drLCExpiryDate_dFrom_ti']", lcExpiryDateFrom);
  await type(page, "//input[@id='drLCExpiryDate_dTo_ti']", lcExpiryDateTo);

  await type(page, "//input[@id='drLCDate_dFrom_ti']", lcDateFrom);
  await type(page, "//input[@id='drLCDate_dTo_ti']", lcDateTo);
  
  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});