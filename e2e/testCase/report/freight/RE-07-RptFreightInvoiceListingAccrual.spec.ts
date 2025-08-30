import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { expectResult, downloadFile, dropdown, popupselection, extractValue }  from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { searchButton, exportExcelButton, consoleLog } from '../../../utils/report/reportBaseCase';


// Define test data constants based on the image
const etdDateFrom = '01-Jan-2025';
const etdDateTo = '31-Dec-2025';
const shippingLine = 'Cosco Shipping Lines';
const seller = 'Inter-Continental Oils & Fats Pte. Ltd.';
const deliveryMode = '20FT FCL'; // Can be filled if needed
const cargoNature = 'Non DG'; // Can be filled if needed



// Timeout removed - using global configuration

test('Freight Invoice Listing for Accrual Report', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Freight Invoice Listing for Accrual Report';

  await login(page);
  
  // Navigate to the Freight Invoice Listing for Accrual Report page
  await page.goto(`${reporturl.url}Report/Freight/RptFreightInvoiceListing.aspx?Type=Accrual`);
  
  // Fill in the search form based on the image
  // Set ETD Date range
  await expectResult(page, "//input[@id='drETD_dFrom_ti']", etdDateFrom);
  await expectResult(page, "//input[@id='drETD_dTo_ti']", etdDateTo);
  
  // Select Shipping Line
  await dropdown(page, "//span[@id='lstShippingLine']", shippingLine);
  
  // Select Seller
  await dropdown(page, "//span[@id='lstSeller']", seller);
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDeliveryMode_lb']", deliveryMode);
  await page.click("//label[normalize-space()='Delivery Mode']");
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddCargoNature_lb']", cargoNature);
  await page.click("//label[normalize-space()='Delivery Mode']");
  
  // Click search button
  await searchButton(page);
  
  // Wait for results to load
  await page.waitForTimeout(3000);
  
  // Verify search results
  await expectResult(page, "//table[@id='grdFreightInvoiceListing_t_frozen']/tbody/tr[2]/td[1]/span", shippingLine);
  
  const etdDate = await extractValue(page,"//table[@id='grdFreightInvoiceListing_t']/tbody/tr[2]/td[7]/span");
  await aiAssert(`verify ${etdDate} between ${reportData.dateFrom} and ${reportData.dateTo}`);
  
  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
 });