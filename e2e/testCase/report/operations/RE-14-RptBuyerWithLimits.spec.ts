import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, typeAndTab } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, popupbuttonselector } from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect } from '../../../utils/report/reportBaseCase';

const buyerName = 'ICOF Europe GmbH';
const buyerSeletionName = 'ICOF Europe GmbH';
const productDivision = 'Fatty Alcohol';
const limitStatus = 'Active';
const buyerStatus = 'Active';


// Timeout removed - using global configuration


test('Buyer with Limits', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Buyer with Limits';

  await login(page);
  await page.goto(`${reporturl.url}Report/OperationAdmin/RptBuyerWithLimits.aspx`);

  await expectResult(page, "//span[@id='select2-lstLimitStatus-container']", limitStatus);
  await expectResult(page, "//span[@id='select2-lstBuyerStatus-container']", buyerStatus);


  // Fill in the search form based on the image
  // Enter Buyer Name
  await popupselection(page, "//input[@id='pstxtBPName_pop']", "//iframe[@id='pstxtBPName_pop_pop_fr1']", buyerName);
  await type(page, "//input[@id='txtBPSelectionName']", buyerSeletionName)

    // Select Division
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddProductDivision_lb']", productDivision);
  await page.click("//label[normalize-space()='Product Division']");

  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});