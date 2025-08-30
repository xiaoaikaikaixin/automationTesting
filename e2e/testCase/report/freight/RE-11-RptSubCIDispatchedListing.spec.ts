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
const tradingSlipNo = 'TS/25/OLE/0068';
const salesContractNo = 'SC/25/OLE/0068';
const contractInstructionNo = 'CI/25/OLE/0068';
const subContractInstructionNo = 'SC/25/OLE/0068-(1)';
const basis = 'CIP';
const deliveryMode = 'By Air / Courier';
const documentStatus = 'Dispatched';
const shippingStatus = 'Picked';
const tsApprovalStatus = 'No Approval Required';
const tradedDateFrom = '01-Jan-2025';
const tradedDateTo = '31-Dec-2025';
const shippingPeriodFrom = '01-Jan-2025';
const shippingPeriodTo = '31-Dec-2025';
const requestedScheduleFrom = '01-Jan-2025';
const requestedScheduleTo = '31-Dec-2025';
const division = 'Fatty Acid';
const buyer = 'AAK SG Pte. Ltd.';
const seller = 'Inter-Continental Oils & Fats Pte. Ltd.';
const portOfLoading = 'Belawan';
const portOfDischarge = 'Chicago';

// Timeout removed - using global configuration


test('Sub CI Dispatched Listing Report', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Sub CI Dispatched Listing Report';


  await login(page);
  await page.goto(`${reporturl.url}Report/Freight/RptSubCIDispatchedListing.aspx`);
  
  // Fill in Trading Slip No.
  await type(page, "//input[@id='txtTSNo']", tradingSlipNo);
  
  // Fill in Sales Contract No.
  await type(page, "//input[@id='txtSCNo']", salesContractNo);
  
  // Fill in Contract Instruction No.
  await type(page, "//input[@id='txtCINo']", contractInstructionNo);
  
  // Fill in Sub Contract Instruction No.
  await type(page, "//input[@id='txtSubCINo']", subContractInstructionNo);
  
  // Select Basis
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddBasis_lb']", basis);
  await page.click("//label[normalize-space()='Document Status']");
  
  // Select Delivery Mode
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDeliveryMode_lb']", deliveryMode);
  await page.click("//label[normalize-space()='Document Status']");

  // Select Shipping Status
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSubCIShippingStatus_lb']", shippingStatus);
  await page.click("//label[normalize-space()='Document Status']");
  
  // Select Approval Status
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSubCIApprovalStatus_lb']", tsApprovalStatus);
  await page.click("//label[normalize-space()='Document Status']");
  
  // Set Traded Date range
  await type(page, "//input[@id='drTradedDate_dFrom_ti']", tradedDateFrom);
  await type(page, "//input[@id='drTradedDate_dTo_ti']", tradedDateTo);
  
  // Set Shipping Period range
  await type(page, "//input[@id='drShippingPeriod_dFrom_ti']", shippingPeriodFrom);
  await type(page, "//input[@id='drShippingPeriod_dTo_ti']", shippingPeriodTo);
  
  // Set Requested Schedule range
  await type(page, "//input[@id='drRequestedSchedule_dFrom_ti']", requestedScheduleFrom);
  await type(page, "//input[@id='drRequestedSchedule_dTo_ti']", requestedScheduleTo);
  
  // Select Division
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Document Status']");
  
  // Select Buyer using popup
  await type(page, "//input[@id='txtBuyer']", buyer);
  
  // Select Seller using popup
  await type(page, "//input[@id='txtSeller']", seller);
  
  // Select Port of Loading
  await typeAndTab(page, "//span[@id='acLoadPort']//input[@placeholder='<Type & tab for single value>']", portOfLoading);
  
  // Select Port of Discharge
  await typeAndTab(page, "//span[@id='acDischargePort']//input[@placeholder='<Type & tab for single value>']", portOfDischarge);
  
  // Verify some key fields are populated correctly
  await expectResult(page, "//span[@id='chkddSubCIDocumentStatus']", documentStatus);
  
  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});