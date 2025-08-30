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
const tradedDateFrom = '01-Jan-2025';
const tradedDateTo = '31-Dec-2025';
const buyer = 'ICOF America Inc.';
const seller = 'Inter-Continental Oils & Fats Pte. Ltd.';
const deliveryMode = '20FT FCL';
const specialOrderType = 'Normal';
const shippingPeriodFrom = '01-Jan-2025';
const shippingPeriodTo = '31-Dec-2025';

// Timeout removed - using global configuration


test('Outstanding Contracts Listing', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Outstanding Contracts Listing';

  await login(page);
  await page.goto(`${reporturl.url}Report/Operation/RptOutstandingContractsListing.aspx`);

  // Select Division
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");

   // Enter Buyer
  await popupselection(page, "//input[@id='psacBuyer_pop']", "//iframe[@id='psacBuyer_pop_pop_fr1']", buyer);
  
  // Enter Traded Date Range
  await type(page, "//input[@id='drTradedDate_dFrom_ti']", tradedDateFrom);
  await type(page, "//input[@id='drTradedDate_dTo_ti']", tradedDateTo);
  await page.click("//label[normalize-space()='Division']");
  
 
  
  // Enter Seller
  await dropdown(page,"//span[@id='lstSeller']", seller);
  
  // Select Delivery Mode
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDeliveryMode_lb']", deliveryMode);
  await page.click("//label[normalize-space()='Delivery Mode']");
  
  // Select Special Order Type
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialOrderTypes_lb']", specialOrderType);
  
  // Enter Shipping Period Range
  await type(page, "//input[@id='drShippingPeriod_dFrom_ti']", shippingPeriodFrom);
  await type(page, "//input[@id='drShippingPeriod_dTo_ti']", shippingPeriodTo);

  // Click search button
  await searchButton(page);
  await page.waitForTimeout(2000);

  await expectResult(page, "//table[@id='grdOutstandingContractsListing_t_frozen']/tbody/tr[2]/td[3]/span", specialOrderType)
  const tradedDate = await extractValue(page,"//table[@id='grdOutstandingContractsListing_t_frozen']/tbody/tr[2]/td[5]/span");
  await aiAssert(`verify ${tradedDate} between ${tradedDateFrom} and ${tradedDateTo}`);
  await expectResult(page, "//table[@id='grdOutstandingContractsListing_t']/tbody/tr[2]/td[9]/span", buyer)


  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});
