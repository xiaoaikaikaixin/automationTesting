import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, typeAndTab } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, popupbuttonselector } from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect } from '../../../utils/report/reportBaseCase';

const fromDate = '01/01/2023';
const toDate = '31/12/2023';
const productDivision = 'Fatty Alcohol';
const vesselName = 'SAMPLE VESSEL';
const voyageNo = 'VOY-2023-001';
const portOfLoading = 'Singapore';
const portOfDischarge = 'Rotterdam';

// Timeout removed - using global configuration

test.beforeEach(async ({ page }) => {
  // Using the login function from baseCase.ts
  await login(page);
});

test('Vessel Schedule', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Vessel Schedule';

  await page.goto(`${reporturl.url}Report/Operation/RptVesselSchedule.aspx`);

  // Fill in the search form
  // Enter Vessel Name
  await type(page, "//input[@id='txtVesselName']", vesselName);

  // Enter Voyage Number
  await type(page, "//input[@id='txtVoyageNo']", voyageNo);

  // Enter Port of Loading
  await type(page, "//input[@id='txtPortOfLoading']", portOfLoading);

  // Enter Port of Discharge
  await type(page, "//input[@id='txtPortOfDischarge']", portOfDischarge);

  // Enter Date Range
  await type(page, "//input[@id='txtFromDate']", fromDate);
  await type(page, "//input[@id='txtToDate']", toDate);

  // Select Division
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddProductDivision_lb']", productDivision);
  await page.click("//label[normalize-space()='Division']");

  // Click search button
  await searchButton(page);

  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});