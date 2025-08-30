import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type } from '../../../utils/baseTest';
import { downloadFile, dropdown } from '../../../utils/baseTest';
import { reporturl } from '../../../data/reportData';
import { exportExcelButton, consoleLog } from '../../../utils/report/reportBaseCase';

const reportDateFrom = '01-Jan-2025';
const reportDateTo = '31-Dec-2025';
const productSupplier = 'Musim Mas, PT';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('Purchase Fulfillment Report (Management)', async ({
  page,
  ai,
  aiAssert,
  aiQuery
}) => {
  test.info().title = 'Purchase Fulfillment Report (Management)';

  await page.goto(`${reporturl.url}/Report/Management/RptPurchaseFulfillment.aspx`);

  await type(page, "//input[@id='drBLDate_dFrom_ti']", reportDateFrom);

  await type(page, "//input[@id='drBLDate_dTo_ti']", reportDateTo);

  await page.click("//label[normalize-space()='Product Supplier']");
  await dropdown(page, "//span[@id='lstSupplier']", productSupplier);

  await exportExcelButton(page);
  await downloadFile(page);
  await consoleLog();
});
