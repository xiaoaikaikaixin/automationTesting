import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, typeAndTab } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, popupbuttonselector } from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect } from '../../../utils/report/reportBaseCase';

// Test data constants based on the image
const division = 'Fatty Acid';
const deliveryMode = '20FT FCL';
const buyer = 'ICOF America Inc.';
const asAtDate = '31-Dec-2025';
const specialOrderType = 'Normal';


// Timeout removed - using global configuration

// No beforeEach needed as we'll include login in the test

test('Outstanding Purchase Report', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Outstanding Purchase Report';

  // Login first
  await login(page);

  // Navigate to the Outstanding Purchase Report page
  await page.goto(`${reporturl.url}Report/Operation/RptOutstandingPurchaseReport.aspx`);
  
  // Select Division - Fatty Acid
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");

  await popupselection(page, "//input[@id='psacBuyer_pop']", "//iframe[@id='psacBuyer_pop_pop_fr1']", buyer);

  // Select Delivery Mode - 20FT FCL
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDeliveryMode_lb']", deliveryMode);
  await page.click("//label[normalize-space()='Delivery Mode']");
  
  // Set As At Date - 31-Dec-2025
  await type(page, "//input[@id='dpAsAtDate_ti']", asAtDate);
  
  // Select Special Order Type
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialOrderTypes_lb']", specialOrderType);

  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});
