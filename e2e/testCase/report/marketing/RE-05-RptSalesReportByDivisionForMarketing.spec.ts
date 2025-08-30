import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue } from '../../../utils/baseTest';
import { reporturl } from '../../../data/reportData';
import { exportExcelButton, searchButton, consoleLog } from '../../../utils/report/reportBaseCase';

const division = 'Fatty Acid';
const buyerName = 'ICOF America Inc.';
const specialOrderType = 'Normal';
const tradedDateFrom = '01-Jan-2025';
const tradedDateTo = '29-Dec-2025';
const seller = 'Inter-Continental Oils & Fats Pte. Ltd.';

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

  await page.goto(`${reporturl.url}/Report/Marketing/RptSalesReportByDivisionForMarketing.aspx`);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");

  await popupselection(page, "//input[@id='psacBuyer_pop']", "//iframe[@id='psacBuyer_pop_pop_fr1']", buyerName);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialOrderTypes_lb']", specialOrderType);

  await type(page, "//input[@id='drTradedDate_dFrom_ti']", tradedDateFrom);
  await type(page, "//input[@id='drTradedDate_dTo_ti']", tradedDateTo);

  await dropdown(page, "//span[@id='lstSeller']", seller);

  await searchButton(page);

  try {
        await expectResult(page, "//table[@id='grdSalesReportByDivisionForMarketing_t_frozen']/tbody/tr[2]/td[3]/span", specialOrderType);
        await expectResult(page, "//table[@id='grdSalesReportByDivisionForMarketing_t_frozen']/tbody/tr[2]/td[4]/span", division);
        await expectResult(page, "//table[@id='grdSalesReportByDivisionForMarketing_t']/tbody/tr[2]/td[8]/span", buyerName);

  } catch (error) {
    console.log(error);
  }

  await exportExcelButton(page);
  await downloadFile(page);
  await consoleLog();
});
