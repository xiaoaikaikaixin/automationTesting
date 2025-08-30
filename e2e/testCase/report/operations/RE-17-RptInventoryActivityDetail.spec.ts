import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, typeAndTab } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, popupbuttonselector } from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect } from '../../../utils/report/reportBaseCase';

const fromDate = '01-Jan-2025';
const toDate = '31-Dec-2025';
const storageLocation = 'Sinochem Orient Shanghai Petrochemical Terminal, Shanghai';
const tankNo = 'T303';

// Timeout removed - using global configuration

test('Inventory Activity Detail', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Inventory Activity Detail';

  await login(page);
  await page.goto(`${reporturl.url}Report/Operation/RptInventoryActivityDetail.aspx`);

  // Fill in the search form
  // Enter Date Range
  await expectResult(page, "//input[@id='drActivityPeriod_dFrom_ti']", fromDate);
  await expectResult(page, "//input[@id='drActivityPeriod_dTo_ti']", toDate);

  await dropdown(page, "//span[@id='select2-lstStorageLocation-container']", storageLocation);
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddStorageLocationTankNo_lb']", tankNo);
  await page.click("//label[normalize-space()='Tank No.']");

  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});