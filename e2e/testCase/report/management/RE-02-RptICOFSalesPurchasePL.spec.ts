import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, expectResult, downloadFile, dropdown, popupselection, popupbuttonselector, extractValue } from '../../../utils/baseTest';
import { reporturl } from '../../../data/reportData';
import { exportExcelButton, searchButton, consoleLog } from '../../../utils/report/reportBaseCase';

const reportDateFrom = '01-Jan-2025';
const reportDateTo = '31-Dec-2025';
const tradeType = 'Drop Shipment';
const productName = 'Mascol 24 Lauryl Myristyl Alcohol';
const division = 'Fatty Alcohol';
const buyerName = 'ICOF America Inc.';
const deliveryMode = '20FT FCL';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('ICOF SG Sales Purchase P&L Report', async ({
  page,
  ai,
  aiAssert,
  aiQuery
}) => {
  test.info().title = 'ICOF SG Sales Purchase P&L Report';

  await page.goto(`${reporturl.url}/Report/Management/RptICOFSalesPurchasePL.aspx`);

  await type(page, "//input[@id='drReportDate_dFrom_ti']", reportDateFrom);
  await type(page, "//input[@id='drReportDate_dTo_ti']", reportDateTo);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddTradeType_lb']", tradeType);
  await page.click("//label[normalize-space()='Division']");

  await popupbuttonselector(page, "//input[@id='psacItem_pop']", "//iframe[@id='psacItem_pop_pop_fr1']",
  "//input[@id='txtItemName']","//table[@id='grdItem_t']/tbody/tr[2]/td[1]/span", productName);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");

  await popupselection(page, "//input[@id='psacBuyer_pop']", "//iframe[@id='psacBuyer_pop_pop_fr1']", buyerName);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDeliveryMode_lb']", deliveryMode);

  await exportExcelButton(page);
  await downloadFile(page);
  await consoleLog();
});
