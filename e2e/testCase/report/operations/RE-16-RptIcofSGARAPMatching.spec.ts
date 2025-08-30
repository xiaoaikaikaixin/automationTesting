import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, typeAndTab } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, popupbuttonselector } from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect } from '../../../utils/report/reportBaseCase';

// Test data constants
const specialOrderType = 'Normal';
const buyer = 'Foshan Sun Chemicals Trade Co., Ltd.2-Test';
const division = 'Fatty Acid';
const deliveryMode = '20FT FCL';
const scNo = 'SC/25/OLE/0004';
const scBasis = 'FCA Place of Loading';
const invoicedateFrom='01-Jan-2025';
const invoicedateTo='31-Dec-2025';
const bldateFrom='01-Jan-2025';
const bldateTo='31-Dec-2025';


// Timeout removed - using global configuration


test('ICOF SG AR AP Matching', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'ICOF SG AR AP Matching';


  await login(page);
  await page.goto(`${reporturl.url}Report/Operation/RptIcofSGARAPMatching.aspx`);

  // Fill in the search form
  // Select Special Order Type
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialOrderType_lb']", specialOrderType);
  await page.click("//label[normalize-space()='Special Order Type']");
  
  // Select Buyer
  await popupselection(page, "//input[@id='psacBuyer_pop']", "//iframe[@id='psacBuyer_pop_pop_fr1']", buyer);
  
  // Select Division
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivision_lb']", division);
  await page.click("//label[normalize-space()='Division']");
  
  // Select Delivery Mode
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDeliveryMode_lb']", deliveryMode);
  
  // Enter SC No.
  await type(page, "//input[@id='txtSCNO']", scNo);
  
  // Select SC Basis
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddBasis_lb']", scBasis);
  await page.click("//label[normalize-space()='SC Basis']");

  await type(page, "//input[@id='drInvoiceDate_dFrom_ti']", invoicedateFrom);
  await type(page, "//input[@id='drInvoiceDate_dTo_ti']", invoicedateTo);
  await type(page, "//input[@id='drBLDate_dFrom_ti']", bldateFrom);
  await type(page, "//input[@id='drBLDate_dTo_ti']", bldateTo);

  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});