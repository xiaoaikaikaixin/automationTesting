import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { type } from '../../../utils/baseTest';
import { expectResult, downloadFile, dropdown, popupselection, extractValue } from '../../../utils/baseTest';
import { reporturl } from '../../../data/reportData';
import { exportExcelButton, searchButton, consoleLog } from '../../../utils/report/reportBaseCase';

const buyerName = 'ICOF Europe GmbH';
const division = 'Fatty Acid';
const specialOrderType = 'Normal';
const tradedDateFrom = '01-Jan-2025';
const tradedDateTo = '31-Dec-2025';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('Sales Contract With GMP', async ({
  page,
  ai,
  aiAssert,
  aiQuery
}) => {
  test.info().title = 'Sales Contract With GMP';

  await page.goto(`${reporturl.url}/Report/Marketing/RptSalesContractWithGMP.aspx`);

  await popupselection(page, "//input[@id='psacBuyer_pop']", "//iframe[@id='psacBuyer_pop_pop_fr1']", buyerName);


  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialOrderTypes_lb']", specialOrderType);

  await searchButton(page);

  try {
        await expectResult(page, "//table[@id='grdReport_t']/tbody/tr[2]/td[7]/span", buyerName);

        await expectResult(page, "//table[@id='grdReport_t']/tbody/tr[2]/td[10]/span", division);

        const tradedDateFrom = await extractValue(page, "//input[@id='drTradedDate_dFrom_ti']");
        const tradedDateTo = await extractValue(page, "//input[@id='drTradedDate_dTo_ti']");
        const gridTradedDateFrom = await extractValue(page, "//table[@id='grdReport_t']/tbody/tr[2]/td[16]/span");
        const gridTradedDateTo = await extractValue(page, "//table[@id='grdReport_t']/tbody/tr[2]/td[17]/span");
        await aiAssert(`verify ${gridTradedDateFrom}  between ${tradedDateFrom} and ${tradedDateTo}`);    
        await aiAssert(`verify ${gridTradedDateTo}  between ${tradedDateFrom} and ${tradedDateTo}`);   
  } catch (error) {
    console.log(error);
  }
 
 

  await exportExcelButton(page);
  await downloadFile(page);
  await consoleLog();
});
