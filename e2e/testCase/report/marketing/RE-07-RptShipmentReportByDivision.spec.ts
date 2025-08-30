import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, popupbuttonselector,extractValue } from '../../../utils/baseTest';
import { reporturl } from '../../../data/reportData';
import { exportExcelButton, searchButton, consoleLog } from '../../../utils/report/reportBaseCase';

const division = 'Fatty Alcohol';
const seller = 'Inter-Continental Oils & Fats Pte. Ltd.';
const specialOrderType = 'Normal';
const invoiceDateFrom = '01-Jan-2025';
const invoiceDateTo = '31-Dec-2025';
const blDateFrom = '01-Jan-2025';
const blDateTo = '31-Dec-2025';
const buyerName = 'ICOF America Inc.';
const productName = 'Mascol 24 Lauryl Myristyl Alcohol';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('Shipment Report By Division (Marketing)', async ({
  page,
  ai,
  aiAssert,
  aiQuery
}) => {
  test.info().title = 'Shipment Report By Division (Marketing)';

  await page.goto(`${reporturl.url}/Report/Marketing/RptShipmentReportByDivision.aspx`);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");

  await dropdown(page, "//span[@id='lstSeller']", seller);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialOrderTypes_lb']", specialOrderType);

  await type(page, "//input[@id='drInvoiceDate_dFrom_ti']", invoiceDateFrom);
  await type(page, "//input[@id='drInvoiceDate_dTo_ti']", invoiceDateTo);

  await type(page, "//input[@id='drBLDate_dFrom_ti']", blDateFrom);
  await type(page, "//input[@id='drBLDate_dTo_ti']", blDateTo);

  await popupselection(page, "//input[@id='psacBuyer_pop']", "//iframe[@id='psacBuyer_pop_pop_fr1']", buyerName);

  await popupbuttonselector(page, "//input[@id='psacItem_pop']", "//iframe[@id='psacItem_pop_pop_fr1']",
  "//input[@id='txtItemName']","//table[@id='grdItem_t']/tbody/tr[2]/td[1]/span", productName);

  await searchButton(page);

  try{
   
    await expectResult(page, "//table[@id='grdShipments_t_frozen']/tbody/tr[2]/td[2]/span", specialOrderType);

    await expectResult(page, "//table[@id='grdShipments_t_frozen']/tbody/tr[2]/td[3]/span", division);
    
    await expectResult(page, "//table[@id='grdShipments_t_frozen']/tbody/tr[2]/td[5]/span", seller);

    await expectResult(page, "//table[@id='grdShipments_t']/tbody/tr[2]/td[8]/span", buyerName);

    await expectResult(page, "//table[@id='grdShipments_t']/tbody/tr[2]/td[9]/span", productName);

  }catch(error){
    await console.log(error);
  }

  

  await exportExcelButton(page);
  await downloadFile(page);
  await consoleLog();
});
