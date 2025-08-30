import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, typeAndTab } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, popupbuttonselector } from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, 
  searchButton, consoleLog, 
 } from '../../../utils/report/reportBaseCase';


const specialOrder = 'Normal';
const division = 'Fatty Alcohol';

// Timeout removed - using global configuration

test.beforeEach(async ({ page }) => {
  // Using the login function from baseCase.ts
  await login(page);
});

test('Credit/Shipment Limit Monitoring for Marketing', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Credit/Shipment Limit Monitoring for Marketing';

  await page.goto(`${reporturl.url}/Report/Marketing/RptRolloverOutstandingShipment.aspx`);


  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialOrderTypes_lb']", specialOrder);

  await searchButton(page);

  await expectResult(page, "//table[@id='grdShipments_t_frozen']/tbody/tr[2]/td[5]/span", specialOrder);

  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});