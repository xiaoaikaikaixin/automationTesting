import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, type }  from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect} from '../../../utils/report/reportBaseCase';


// Define test data constants based on the image
const etdDateFrom = '01-Jan-2025';
const etdDateTo = '31-Dec-2025';
const receivedDateFrom = '01-Jan-2025';
const receivedDateTo = '31-Dec-2025';
const invoiceDateFrom = '01-Jan-2025';
const invoiceDateTo = '31-Dec-2025';
const shippingLine = 'Bertschi Global (Singapore) Pte Ltd';


// Timeout removed - using global configuration


test('Freight Invoice Listing for Payment Report', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Freight Invoice Listing for Payment Report';

  await login(page);
  
  // Navigate to the Freight Invoice Listing for Payment Report page
  await page.goto(`${reporturl.url}Report/Freight/RptFreightInvoiceListing.aspx?Type=Payment`);
  
  await expectResult(page, "//input[@id='drETDPayment_dFrom_ti']", etdDateFrom);
  await expectResult(page, "//input[@id='drETDPayment_dTo_ti']", etdDateTo);
  
  // Set Received Date range
  await page.fill("//input[@id='drReceivedDate_dFrom_ti']", receivedDateFrom);
  await page.fill("//input[@id='drReceivedDate_dTo_ti']", receivedDateTo);
  
  // Set Invoice Date range
  await page.fill("//input[@id='drBillDate_dFrom_ti']", invoiceDateFrom);
  await page.fill("//input[@id='drBillDate_dTo_ti']", invoiceDateTo);
  
  // Select Shipping Line
  await dropdown(page, "//span[@id='lstShippingLine2']", shippingLine);
  
  
  // Click search button
  await searchButton(page);
  
  // Wait for results to load
  await page.waitForTimeout(3000);
  
  // Verify search results
  await expectResult(page, "//table[@id='grdFreightInvoiceListing_t_frozen']/tbody/tr[2]/td[1]/span", shippingLine);

  const etdDate = await extractValue(page,"//table[@id='grdFreightInvoiceListing_t']/tbody/tr[2]/td[7]/span");
  await aiAssert(`verify ${etdDate} between ${reportData.dateFrom} and ${reportData.dateTo}`);

  const invoiceDate = await extractValue(page,"//table[@id='grdFreightInvoiceListing_t']/tbody/tr[2]/td[17]/span");
  await aiAssert(`verify ${invoiceDate} between ${reportData.dateFrom} and ${reportData.dateTo}`);
  
  
  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});