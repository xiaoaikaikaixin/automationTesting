import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, typeAndTab } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, popupbuttonselector } from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect } from '../../../utils/report/reportBaseCase';

const blfromDate = '01-Jan-2025';
const bltoDate = '31-Dec-2025';
const division = 'Fatty Alcohol';
const invoicefromDate = '01-Jan-2024';
const invoicetoDate = '31-Dec-2024';
const deliveryMode='20FT FCL';
const createdBy='ICOF admin ';
const specialOrderType='Normal'


// Timeout removed - using global configuration

test('KPI Report - Late Presentation of Export Documents', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'KPI Report - Late Presentation of Export Documents';

  await login(page);
  await page.goto(`${reporturl.url}Report/Operation/RptKpiLatePresentationOfExportDocument.aspx`);
  await expectResult(page, "//input[@id='drBLDate_dFrom_ti']", blfromDate);
  await expectResult(page, "//input[@id='drBLDate_dTo_ti']", bltoDate);
  // Fill in the search form
  // Enter Date Range
  await type(page, "//input[@id='drBLDate_dFrom_ti']", invoicefromDate);
  await page.click("//label[normalize-space()='Division']");
  await type(page, "//input[@id='drInvoicePeriod_dFrom_ti']", invoicefromDate);
  await type(page, "//input[@id='drInvoicePeriod_dTo_ti']", invoicetoDate);

  // Select Division
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDeliveryMode_lb']", deliveryMode);
  await page.click("//label[normalize-space()='Division']");
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddCreatedBy_lb']", createdBy);
  await page.click("//label[normalize-space()='Division']");
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialOrderTypes_lb']", specialOrderType);

  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});