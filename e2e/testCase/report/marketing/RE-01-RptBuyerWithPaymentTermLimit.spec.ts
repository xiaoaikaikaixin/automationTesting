import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type, typeAndTab } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue, popupbuttonselector } from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect, 
  buyerSelect} from '../../../utils/report/reportBaseCase';

const buyername= 'BASF Care Chemicals (Shanghai) Co., Ltd.';
const country = 'People\'s Republic of China';
const region = 'Asia';
const division = 'Fatty Alcohol';
const paymentterm = 'TT 100% of shipment value 45 days from end of month. Original shipping documents to be presented In Trust.';

// Timeout removed - using global configuration

test.beforeEach(async ({ page }) => {
  // Using the login function from baseCase.ts
  await login(page);
});

test('Buyer with Payment Term and Limit', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Buyer with Payment Term and Limit';

  await page.goto(`${reporturl.url}/Report/Marketing/RptBuyerWithPaymentTermLimit.aspx`);


  await popupselection(page, "//input[@id='psacBuyer_pop']", "//iframe[@id='psacBuyer_pop_pop_fr1']", buyername);
  
  await typeAndTab(page, "//span[@id='acCountryOfIncorporationID']//input[@placeholder='<Type & tab for single value>']", country);
  await dropdown(page, "//span[@id='lstRegion']", region);
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");
  await type(page, "//textarea[@id='txtPaymentTermCode']", paymentterm);


  // Export to Excel
  await exportExcelButton(page);
  
  // Download the file
  await downloadFile(page);
  
  // Log completion
  await consoleLog();
});