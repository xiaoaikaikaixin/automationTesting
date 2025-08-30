import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { expectResult, downloadFile, dropdown,popupselection, extractValue}  from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect} from '../../../utils/report/reportBaseCase';

const shippingLineSlectionname='Agility International, PT.'
const shippingLine= 'PT. Agility International'

// Timeout removed - using global configuration

test('Paid Shipping Line Invoices Report', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Paid Shipping Line Invoices Report';

    await login(page);
    await page.goto(`${reporturl.url}Report/Freight/RptPaidShippingLineInvoices.aspx`);
    await dateVerify(page,"//input[@id='drBillDate_dFrom_ti']","//input[@id='drBillDate_dTo_ti']");
    await page.fill("//input[@id='drReceivedDate_dFrom_ti']", reportData.receiveddateFrom);
    await page.fill("//input[@id='drReceivedDate_dTo_ti']", reportData.receiveddateTo);
    await page.fill("//input[@id='drPaymentDate_dFrom_ti']", reportData.paymentDateFrom);
    await page.fill("//input[@id='drPaymentDate_dTo_ti']", reportData.paymentDateTo);
    await page.fill("//input[@id='drBillDate_dFrom_ti']", reportData.paymentDateFrom);
    await dropdown(page, "//span[@id='lstShippingLine']", shippingLineSlectionname);
    await searchButton(page);
    await expectResult(page, "//table[@id='grdListing_t']/tbody/tr[2]/td[6]/span", shippingLine)
    const paymentDate = await extractValue(page,"//table[@id='grdListing_t']/tbody/tr[2]/td[11]/span");
    await aiAssert(`verify ${paymentDate} between ${reportData.paymentDateFrom} and ${reportData.paymentDateTo}`);
    await exportExcelButton(page);
    await downloadFile(page);
    await consoleLog();  
 
});