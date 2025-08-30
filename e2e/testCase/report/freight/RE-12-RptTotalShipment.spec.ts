import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, typeAndTab } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, popupbuttonselector } from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect } from '../../../utils/report/reportBaseCase';

// Test data constants based on the form fields visible in the image
const supplier = 'Musim Mas, PT';
const division = 'Fatty Acid';
const deliveryMode = '20FT FCL';
const loadingPort = 'Belawan';
const cargoNature = 'Non DG';
const dischargePort = 'Burlington, NC';
const buyer = 'Mikie Oleo Nabati Industri, PT';
const seller = 'Inter-Continental Oils & Fats Pte. Ltd.';
const subCIStatus = 'Shipped';
const shippingLine = 'American President Lines';
const blDateFrom = '01-Jan-2025';
const blDateTo = '31-Dec-2025';
const etdDateFrom = '01-Jan-2024';
const etdDateTo = '31-Dec-2024';

// Timeout removed - using global configuration


test('Total Shipment Report', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Total Shipment Report';

  await login(page);

  await page.goto(`${reporturl.url}Report/Freight/RptTotalShipment.aspx`);

    // Verify some key fields are populated correctly
  await expectResult(page, "//span[@id='select2-lstSubCIStatus-container']", subCIStatus);
  await expectResult(page, "//input[@id='drBLDate_dFrom_ti']", blDateFrom);
  await expectResult(page, "//input[@id='drBLDate_dTo_ti']", blDateTo);
  
  // Select Supplier
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSupplier_lb']", supplier);
  await page.click("//label[normalize-space()='Division']");
  
  // Select Division
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");
  
  // Select Delivery Mode
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDeliveryMode_lb']", deliveryMode);
  await page.click("//label[normalize-space()='Division']");

  await page.click("//div[@id='jAutochecklist_wrapper_chkddBuyer_lb']");
  await page.click(`//div[@id='jAutochecklist_wrapper_chkddBuyer_lb']//li[text()='${buyer}']`);
  await page.click("//label[normalize-space()='Division']");


  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSeller_lb']", seller);
  await page.click("//label[normalize-space()='Division']");

  
  // Select Loading Port
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddLoadingPort_lb']", loadingPort);
  await page.click("//label[normalize-space()='Division']");
  
  // Select Cargo Nature
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddCargoNature_lb']", cargoNature);
  await page.click("//label[normalize-space()='Division']");
  
  // Select Discharge Port
  await page.click("//div[@id='jAutochecklist_wrapper_chkddDischargePort_lb']");
  await page.click(`//div[@id='jAutochecklist_wrapper_chkddDischargePort_lb']//li[text()='${dischargePort}']`);
  await page.click("//label[normalize-space()='Division']");
  
  await type(page, "//input[@id='drBLDate_dFrom_ti']", etdDateFrom);
  await type(page, "//input[@id='drBLDate_dTo_ti']", etdDateTo);
  
  // Set ETD Date range
  await type(page, "//input[@id='drETDDate_dFrom_ti']", etdDateFrom);
  await type(page, "//input[@id='drETDDate_dTo_ti']", etdDateTo);
  await page.click("//label[normalize-space()='Division']");
  
  // Select Shipping Line
  await dropdown(page, "//span[@id='lstShippingLine']", shippingLine);
  
  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});