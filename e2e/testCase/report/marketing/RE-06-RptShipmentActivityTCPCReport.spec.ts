import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue } from '../../../utils/baseTest';
import { reporturl } from '../../../data/reportData';
import { exportExcelButton, searchButton, consoleLog } from '../../../utils/report/reportBaseCase';

const division = 'Fatty Alcohol';
const brokername = 'Shanghai Continental Co., Ltd.';
const specialOrderType = 'Normal';
const blDateFrom = '01-Jan-2025';
const blDateTo = '29-Dec-2025';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('Sales Report By Division (Marketing)', async ({
  page,
  ai,
  aiAssert,
  aiQuery
}) => {
  test.info().title = 'Sales Report By Division (Marketing)';

  await page.goto(`${reporturl.url}/Report/Operation/RptShipmentActivityTCPCReport.aspx`);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");

  await popupselection(page, "//input[@id='psacBroker_pop']", "//iframe[@id='psacBroker_pop_pop_fr1']", brokername);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialOrderTypes_lb']", specialOrderType);

  await type(page, "//input[@id='drBLDate_dFrom_ti']", blDateFrom);
  await type(page, "//input[@id='drBLDate_dTo_ti']", blDateTo);

  await exportExcelButton(page);
  await downloadFile(page);
  await consoleLog();
});
