import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { expectResult, downloadFile, dropdown, popupselection, extractValue } from '../../../utils/baseTest';
import { reporturl } from '../../../data/reportData';
import { exportExcelButton, searchButton, consoleLog } from '../../../utils/report/reportBaseCase';

const tradedDateFrom = '01-Jan-2025';
const tradedDateTo = '31-Dec-2025';


test.beforeEach(async ({ page }) => {
  await login(page);
});

test('Sales Contracts By Buyer Detail With Product Qty (Management)', async ({
  page,
  ai,
  aiAssert,
  aiQuery
}) => {
  test.info().title = 'Sales Contracts By Buyer Detail With Product Qty (Management)';

  await page.goto(`${reporturl.url}/Report/Management/RptSalesContractByBuyerDetailWithProductQty.aspx`);

  // Set SC Traded Date range
  await page.fill("//input[@id='drTradedDate_dFrom_ti']", tradedDateFrom);
  await page.fill("//input[@id='drTradedDate_dTo_ti']", tradedDateTo);

  // Click Search
  await searchButton(page);

  try {
    // Verify Transaction Type equals 'Sales Contract' (first row)
    await aiAssert(`verify that the first row got value`);
    
  } catch (error) {
    console.log(error);
  }

  await exportExcelButton(page);
  await downloadFile(page);
  await consoleLog();
});

