import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { expectResult, downloadFile, dropdown,popupselection, extractValue}  from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, etdPortOfLoadingSelect, portOfLoadingSelect, factoryLocationSelect, 
  searchButton, consoleLog } from '../../../utils/report/reportBaseCase';


// Timeout removed - using global configuration

const acceptedDateFrom = '01-Jan-2021';
const acceptedDateTo = '31-Dec-2021';
const productCategory = 'Soap Noodles';

test('Freight Budget Verification Remarks Report', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Freight Budget Verification Remarks Report';

    await login(page);
    await page.goto(`${reporturl.url}Report/Freight/RptFreightBudgetVerificationRemarks.aspx`);
    await page.fill("//input[@id='drAcceptedDate_dFrom_ti']", acceptedDateFrom);
    await page.fill("//input[@id='drAcceptedDate_dTo_ti']", acceptedDateTo);
    await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", productCategory);
      await page.click("//label[normalize-space()='Product Category']");
    await searchButton(page);
    const acceptedDate = await extractValue(page,"//table[@id='grdFreightBudgetVerificationRemarks_t']/tbody/tr[2]/td[8]/span");
    await aiAssert(`verify ${acceptedDate} between ${acceptedDateFrom} and ${acceptedDateTo}`);
    await exportExcelButton(page);
    await downloadFile(page);
    await consoleLog();  
 });