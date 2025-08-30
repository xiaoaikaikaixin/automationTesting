import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { downloadFile, dropdown, expectResult } from '../../../utils/baseTest';
import { reporturl } from '../../../data/reportData';
import { consoleLog, exportExcelButton } from '../../../utils/report/reportBaseCase';

const businessPartnerRole = 'Buyer';
const division = 'Fatty Alcohol';
const buyerStatus = '-- All --';

test('Buyer with First & Last TS Per Division', async ({
  page,
  ai,
  aiAssert,
  aiQuery
}) => {
  test.info().title = 'Buyer with First & Last TS Per Division';

  await login(page);

  await page.goto(`${reporturl.url}/Report/OperationAdmin/RptBuyerWithFirstLastTSByDivision.aspx`);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);
  await page.click("//label[normalize-space()='Division']");

  await exportExcelButton(page);
  await downloadFile(page);
  await consoleLog();
});
