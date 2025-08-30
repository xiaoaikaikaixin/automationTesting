import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, type, typeAndTab }  from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect} from '../../../utils/report/reportBaseCase';

// Define test data constants
const freightChargeNo = '2025-00186'; // Leave empty to search all
const status = 'Released'; // Status from the dropdown in the image
const countryOfOrigin = 'Indonesia';
const countryOfDestination = 'United States of America';
const portOfLoading = 'Belawan';
const portOfDischarge = 'Chicago';
const placeOfLoading = '';
const shippingTerm = 'Port to Port';
const finalDestination = '';
const finalDestinationCountry = '';
const finalDestinationAddress = '';
const shippingTermType = 'Port to Port';
const shippingLine='American President Lines';
const freightRateValidityFrom='01-Jan-2025';
const freightRateValidityTo='01-Dec-2025';
const deliveryMode = '20FT FCL';
const cargoNature='N/A';

// Timeout removed - using global configuration

test('Freight Charge Listing Report', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Freight Charge Listing Report';

  await login(page);
  
  // Navigate to the Freight Charge Listing Report page
  await page.goto(`${reporturl.url}Report/Freight/RptFreightChargeListing.aspx`);
  
  // Fill in the search form based on the image
  await type(page, "//input[@id='txtFCRefNo']", freightChargeNo);
  
  // Select Status
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddStatus_lb']", status);
  
  // Select Country of Origin
  await typeAndTab(page, "span[id='acCountryOrigin'] input[placeholder='<Type & tab for single value>']", countryOfOrigin);
  
  // Select Country of Destination
  await typeAndTab(page, "//span[@id='acCountryDestination']//input[@placeholder='<Type & tab for single value>']", countryOfDestination);
  
  // Select Port of Loading
  await typeAndTab(page, "//span[@id='acLoadingPort']//input[@placeholder='<Type & tab for single value>']", portOfLoading);
  
  // Select Port of Discharge
  await typeAndTab(page, "//span[@id='acDischargePort']//input[@placeholder='<Type & tab for single value>']", portOfDischarge);
  
  // Select Shipping Term
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddShippingTerm_lb']", shippingTerm);
  
  await type(page, "//input[@id='txtShippingLineName']", shippingLine);
  await type(page, "//input[@id='drFreightRatesValidity_dFrom_ti']", freightRateValidityFrom);
  await type(page, "//input[@id='drFreightRatesValidity_dTo_ti']", freightRateValidityTo);
  await page.click("//label[normalize-space()='Delivery Mode']");

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDeliveryMode_lb']", deliveryMode);
  await page.click("//label[normalize-space()='Delivery Mode']");
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddCargoNature_lb']", cargoNature);
  await page.click("//label[normalize-space()='Delivery Mode']");

  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
 });