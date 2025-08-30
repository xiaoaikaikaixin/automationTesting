import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown,popupselection, extractValue, popupbuttonselector}  from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, shippingLineSelect, dateVerify, factoryLocationSelect, 
  searchButton, consoleLog, 
  deliveryModeSelect,
  etdPortOfLoadingSelect} from '../../../utils/report/reportBaseCase';

const shippingLineSlectionname='ASFL-11'
const shippingLine= 'ASFL-11'
const role="Forwarder"
const isFreightLogistics="Yes"
const roleStatus="Active"

// Timeout removed - using global configuration


test('Shipping Line/Forwarder Registered List Report', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Shipping Line/Forwarder Registered List Report';

    await login(page);
    await page.goto(`${reporturl.url}Report/Freight/RptShippingLineForwarderRegisteredList.aspx`);
    await popupbuttonselector(page,"//input[@id='pstxtBPName_pop']","//iframe[@id='pstxtBPName_pop_pop_fr1']",
     "//input[@id='txtBPName']","//table[@id='grdBP_t']/tbody/tr[2]/td[1]/span",shippingLine)
    await type(page,"//input[@id='txtBPSelectionName']",shippingLineSlectionname);
    await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddRoleTypes_lb']", role);
    await dropdown(page, "//span[@id='lstIsFreightLogistics']", isFreightLogistics);
    await expectResult(page, "//span[@id='lstStatus']", roleStatus)
    await expectResult(page, "//span[@id='lstRoleStatus']", roleStatus)
    await exportExcelButton(page);
    await downloadFile(page);
    await consoleLog();  
 
});