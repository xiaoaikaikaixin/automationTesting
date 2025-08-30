import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection,formatDateTo_dd_mmm_yyyy } from '../../../utils/baseTest';
import { reporturl } from '../../../data/reportData';
import { exportExcelButton, consoleLog } from '../../../utils/report/reportBaseCase';

const division = 'Fatty Alcohol';
const deliveryMode = '20FT FCL';
const buyerName = 'ICOF America Inc.';
const supplierName = 'PT Musim Mas';
const tradeType = 'Drop Shipment';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('Outstanding Sales Report (Management)', async ({
  page,
  ai,
  aiAssert,
  aiQuery
}) => {
  test.info().title = 'Outstanding Purchase Report (Management)';

  await page.goto(`${reporturl.url}/Report/Management/RptOutstandingSalesMgmt.aspx`);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDeliveryMode_lb']", deliveryMode);
  await page.click("//label[normalize-space()='Delivery Mode']");

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialOrderTypes_lb']", tradeType);
  await page.click("//label[normalize-space()='Trade Type']");

  await type(page, "//input[@id='txtBuyer']", buyerName);


  await type(page, "//input[@id='dpAsAtDate_ti']", `${formatDateTo_dd_mmm_yyyy(new Date())}`);

  await exportExcelButton(page);
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});
