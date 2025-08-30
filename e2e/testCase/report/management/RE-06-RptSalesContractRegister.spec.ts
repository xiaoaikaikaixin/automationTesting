import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue } from '../../../utils/baseTest';
import { reporturl } from '../../../data/reportData';
import { exportExcelButton, searchButton, consoleLog } from '../../../utils/report/reportBaseCase';

const division = 'Fatty Alcohol';
const tradeType = 'Normal';
const tradedDateFrom = '01-Jan-2025';
const tradedDateTo = '31-Dec-2025';
const buyerName = 'ICOF America Inc.';
const seller = 'Inter-Continental Oils & Fats Pte. Ltd.';
const deliveryMode = '20FT FCL';
const basis = 'CIP';
const documentStatus = 'Open';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('Sales Contract Register Report (Management)', async ({
  page,
  ai,
  aiAssert,
  aiQuery
}) => {
  test.info().title = 'Sales Contract Register Report (Management)';

  await page.goto(`${reporturl.url}/Report/Management/RptSalesContractRegister.aspx`);

  // Set filters per attachment
  await type(page, "//input[@id='drTradedDate_dFrom_ti']", tradedDateFrom);
  await type(page, "//input[@id='drTradedDate_dTo_ti']", tradedDateTo);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialOrderTypes_lb']", tradeType);
  await page.click("//label[normalize-space()='Trade Type']");

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Product Division']");

  await popupselection(page, "//input[@id='pstxtBuyer_pop']", "//iframe[@id='pstxtBuyer_pop_pop_fr1']", buyerName);

  await dropdown(page, "//span[@id='lstSeller']", seller);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDeliveryMode_lb']", deliveryMode);
  await page.click("//label[normalize-space()='Delivery Mode']");

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddBasis_lb']", basis);
  await page.click("//label[normalize-space()='Basis']");

  
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDocumentStatus_lb']", documentStatus);


  // Report has no Search button → export directly
  await exportExcelButton(page);
  await downloadFile(page);
  await consoleLog();
});
