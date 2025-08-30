import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, typeAndTab } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, popupbuttonselector } from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect } from '../../../utils/report/reportBaseCase';

const specialOrderType = 'Normal';
const buyer = 'Foshan Sun Chemicals Trade Co., Ltd.2-Test';
const division = 'Fatty Acid';
const invoicefromDate = '01-Jan-2025';
const invoicetoDate = '31-Dec-2025';


// Timeout removed - using global configuration

test('Invoice Listing', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Invoice Listing';

  await login(page);
  await page.goto(`${reporturl.url}Report/Operation/RptInvoiceListing.aspx`);


  // await expectResult(page, "//input[@id='drInvoiceDate_dFrom_ti']", invoicefromDate);
  // await expectResult(page, "//input[@id='drInvoiceDate_dTo_ti']", invoicetoDate);
  await popupselection(page, "//input[@id='psacBuyer_pop']", "//iframe[@id='psacBuyer_pop_pop_fr1']", buyer);


  // Select Division
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialOrderTypes_lb']", specialOrderType);


  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});