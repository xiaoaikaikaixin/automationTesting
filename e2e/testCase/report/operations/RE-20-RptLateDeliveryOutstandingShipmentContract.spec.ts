import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, typeAndTab } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, popupbuttonselector } from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect } from '../../../utils/report/reportBaseCase';

const asofDate = '31-Dec-2025';
const division = 'Fatty Alcohol';
const shipmentType='Drop Shipment';
const specialOrderType='Normal'

// Timeout removed - using global configuration


test('Late Delivery Outstanding Shipment Contract', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Late Delivery Outstanding Shipment Contract';

  await login(page);
  await page.goto(`${reporturl.url}Report/Operation/RptLateDeliveryOutstandingShipmentContract.aspx`);

  // Select Division
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");
  await type(page, "//input[@id='dpAsOfDate_ti']", asofDate);
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddContractType_lb']", shipmentType);
  await page.click("//label[normalize-space()='Shipment Type']");
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialOrderTypes_lb']", specialOrderType);
  await page.click("//label[normalize-space()='Special Order Type']");

  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});