import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, typeAndTab } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue } from '../../../utils/baseTest';
import { reporturl } from '../../../data/reportData';
import { exportExcelButton, searchButton, consoleLog } from '../../../utils/report/reportBaseCase';

const invoiceDateFrom = '01-Jan-2025';
const invoiceDateTo = '31-Jan-2026';
const invoiceStatus = 'Open';
const destinationCountry = 'United States of America';
const division = 'Fatty Alcohol';
const buyerName = 'ICOF America Inc.';
const deliveryMode = '20FT FCL';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('ICOF SG Sales per Country per Customer', async ({
  page,
  ai,
  aiAssert,
  aiQuery
}) => {
  test.info().title = 'ICOF SG Sales per Country per Customer';

  await page.goto(`${reporturl.url}/Report/Management/RptSGSalesPerCountryPerCustomer.aspx`);

  await type(page, "//input[@id='drInvoiceDate_dFrom_ti']", invoiceDateFrom);
  await type(page, "//input[@id='drInvoiceDate_dTo_ti']", invoiceDateTo);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddStatus_lb']", invoiceStatus);
  await page.click("//label[normalize-space()='Invoice Status']");

  await typeAndTab(page, "//span[@id='acDestinationCountry']/span/div/input", destinationCountry);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivision_lb']", division);
  await page.click("//label[normalize-space()='Division']");

  await type(page, "//input[@id='txtBuyer']", buyerName);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDeliveryMode_lb']", deliveryMode);

  await exportExcelButton(page);
  await downloadFile(page);
  await consoleLog();
});
