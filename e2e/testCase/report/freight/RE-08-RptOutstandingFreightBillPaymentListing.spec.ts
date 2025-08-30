import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { expectResult, downloadFile, dropdown,popupselection, extractValue}  from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect} from '../../../utils/report/reportBaseCase';
import { log } from 'console';


// Timeout removed - using global configuration


const etdDateFrom = '01-Jan-2025';
const etdDateTo = '31-Dec-2025';
const receivedDateFrom = '01-Jan-2025';
const receivedDateTo = '31-Dec-2025';
const invoiceDateFrom = '01-Jan-2025';
const invoiceDateTo = '31-Dec-2025';
const shippingLine = 'Bertschi Global (Singapore) Pte Ltd';


test('Outstanding Freight Bill Payment Listing Report', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Outstanding Freight Bill Payment Listing Report';

    await login(page);
    await page.goto(`${reporturl.url}Report/Freight/RptOutstandingFreightBillPaymentListing.aspx`);


    await expectResult(page, "//input[@id='drBillDate_dFrom_ti']", invoiceDateFrom);
    await expectResult(page, "//input[@id='drBillDate_dTo_ti']", invoiceDateTo);

    await page.fill("//input[@id='drReceivedDate_dFrom_ti']", receivedDateFrom);
    await page.fill("//input[@id='drReceivedDate_dTo_ti']", receivedDateTo);
    await page.fill("//input[@id='drETDLoadingPort_dFrom_ti']", etdDateFrom);
    await page.fill("//input[@id='drETDLoadingPort_dTo_ti']", etdDateTo);
    await dropdown(page, "//span[@id='lstShippingLine']", shippingLine);
    await searchButton(page);
    await page.waitForTimeout(3000);

    await expectResult(page, "//table[@id='grdFreightListing_t']/tbody/tr[2]/td[4]/span", shippingLine)
    const receiveDate = await extractValue(page,"//table[@id='grdFreightListing_t']/tbody/tr[2]/td[6]/span");
    await aiAssert(`verify ${receiveDate} between ${reportData.receiveddateFrom} and ${reportData.receiveddateTo}`);

    const invoiceDate = await extractValue(page,"//table[@id='grdFreightListing_t']/tbody/tr[2]/td[2]/span");
    await aiAssert(`verify ${invoiceDate} between ${reportData.invoicedateFrom} and ${reportData.invoicedateTo}`);

    await exportExcelButton(page);
    await downloadFile(page);
    await consoleLog();  
 
});