import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, typeAndTab } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, popupbuttonselector } from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect } from '../../../utils/report/reportBaseCase';

const buyerName = 'ICOF America Inc.';
const division = 'Fatty Alcohol';
const bldateFrom='01-Jan-2024';
const bldateTo='31-Dec-2024';
const specialOrderType='Sales from Unsold';

// Timeout removed - using global configuration

test('Daily Monitoring Shipment Limit', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Daily Monitoring Shipment Limit';

  await login(page);
  await page.goto(`${reporturl.url}Report/Operation/RptDailyMonitoringShipmentLimit.aspx`);

  // Select Division
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");
  await popupselection(page, "//input[@id='psacBuyerName_pop']", "//iframe[@id='psacBuyerName_pop_pop_fr1']", buyerName);
  await type(page, "//input[@id='drBLDate_dFrom_ti']", bldateFrom);
  await type(page, "//input[@id='drBLDate_dTo_ti']", bldateTo);
  await page.click("//label[normalize-space()='Division']");
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialOrderTypes_lb']", specialOrderType);
  await page.click("//label[normalize-space()='Division']");

  // Click search button
  await searchButton(page);

  await expectResult(page, "//table[@id='grdDaily_t']/tbody/tr[2]/td[3]/span", specialOrderType);
  await expectResult(page, "//table[@id='grdDaily_t']/tbody/tr[2]/td[4]/span", division);
  await expectResult(page, "//table[@id='grdDaily_t']/tbody/tr[2]/td[6]/span", buyerName);


  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});