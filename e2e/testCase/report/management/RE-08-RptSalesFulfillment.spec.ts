import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type } from '../../../utils/baseTest';
import { downloadFile, dropdown } from '../../../utils/baseTest';
import { reporturl } from '../../../data/reportData';
import { exportExcelButton, consoleLog } from '../../../utils/report/reportBaseCase';

const blDateFrom = '01-Jan-2025';
const blDateTo = '31-Dec-2025';
const seller = 'Inter-Continental Oils & Fats Pte. Ltd.';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('Summary Sales Fulfillment Report (Management)', async ({
  page,
  ai,
  aiAssert,
  aiQuery
}) => {
  test.info().title = 'Summary Sales Fulfillment Report (Management)';

  await page.goto(`${reporturl.url}/Report/Management/RptSalesFulfillment.aspx`);

  await type(page, "//input[@id='drBLDate_dFrom_ti']", blDateFrom);
  await type(page, "//input[@id='drBLDate_dTo_ti']", blDateTo);
  await dropdown(page, "//span[@id='lstSeller']", seller);

  await exportExcelButton(page);
  await downloadFile(page);
  await consoleLog();
});
