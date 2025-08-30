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
const seller = 'Musim Mas, PT';
const bllDateFrom = '01-Jan-2024';
const bllDateTo = '31-Dec-2024';

// Timeout removed - using global configuration


test('Monthly Sales Turnover (Insurance) By Division(DTC)', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Monthly Sales Turnover (Insurance) By Division(DTC)';

  await login(page);
  await page.goto(`${reporturl.url}Report/Operation/RptMonthlySalesTurnoverInsuranceByDivisionDTC.aspx`);

  await type(page, "//input[@id='drBLDate_dFrom_ti']", bllDateFrom);
  await type(page, "//input[@id='drBLDate_dTo_ti']", bllDateTo);
  
   // Select Division
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");


  await dropdown(page, "//span[@id='lstSeller']", seller);

  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});