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
const supplier = 'PT Musim Mas';
const division = 'CSP';
const deliveryMode = 'Bulk';
const loadingPort = 'Belawan';
const cargoNature = 'Non DG';
const buyer = 'Createx B.V.';
const seller = 'Inter-Continental Oils & Fats Pte. Ltd.';
const blDateFrom = '01-Jan-2025';
const blDateTo = '31-Dec-2025';


// Timeout removed - using global configuration


test('Total Shipment Report (E & F)', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Total Shipment Report (E & F)';


  await login(page);
  await page.goto(`${reporturl.url}Report/Freight/RptTotalShipmentEAndF.aspx`);

    // Verify some key fields are populated correctly
  await expectResult(page, "//input[@id='drBLDate_dFrom_ti']", blDateFrom);
  await expectResult(page, "//input[@id='drBLDate_dTo_ti']", blDateTo);
  
  // Select Supplier
  await type(page, "//input[@id='txtSupplier']", supplier);
  await type(page, "//input[@id='txtBuyer']", buyer);
  await type(page, "//input[@id='txtSeller']", seller);

  
  // Select Division
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");
  
  // Select Delivery Mode
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDeliveryMode_lb']", deliveryMode);
  await page.click("//label[normalize-space()='Division']");

  // Select Loading Port
  await typeAndTab(page, "//input[@placeholder='<Type & tab for single value>']", loadingPort);
  await page.click("//label[normalize-space()='Division']");
  
  // Select Cargo Nature
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddCargoNature_lb']", cargoNature);
  await page.click("//label[normalize-space()='Division']");
  
  // Click Search button
  await searchButton(page);

  await expectResult(page, "//table[@id='grdTotalShipmentEAndF_t']/tbody/tr[2]/td[4]/span", seller);
  await expectResult(page, "//table[@id='grdTotalShipmentEAndF_t']/tbody/tr[2]/td[5]/span", buyer);
  await expectResult(page, "//table[@id='grdTotalShipmentEAndF_t']/tbody/tr[2]/td[6]/span", deliveryMode);


  const blDate = await extractValue(page,"//table[@id='grdTotalShipmentEAndF_t']/tbody/tr[2]/td[9]/span");
  await aiAssert(`verify ${blDate} between ${blDateFrom} and ${blDateTo}`);

  await expectResult(page, "//table[@id='grdTotalShipmentEAndF_t']/tbody/tr[2]/td[12]/span", loadingPort);
  await expectResult(page, "//table[@id='grdTotalShipmentEAndF_t']/tbody/tr[2]/td[19]/span", cargoNature);
  
  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});