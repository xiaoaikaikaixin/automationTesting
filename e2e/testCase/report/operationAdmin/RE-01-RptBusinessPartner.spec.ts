import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { downloadFile, dropdown, type, typeAndTab } from '../../../utils/baseTest';
import { reporturl } from '../../../data/reportData';
import { consoleLog, exportExcelButton } from '../../../utils/report/reportBaseCase';

const name = 'Chuo Kasei Co Ltd.11';
const selectionName = 'Chuo Kasei Co Ltd.11';
const role = 'Buyer';
const ownGroupForBuyer = 'No';
const bannedListForBuyer = 'No';
const countryOfIncorporation = 'Japan';


test('Business Partner List', async ({
  page,
  ai,
  aiAssert,
  aiQuery
}) => {
  test.info().title = 'Business Partner List';

  await login(page);

  await page.goto(`${reporturl.url}/Report/OperationAdmin/RptBusinessPartner.aspx`);

  await type(page, "//input[@id='pstxtBPName_ti']", name);
  await type(page, "//input[@id='txtBPSelectionName']", selectionName);
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddRoleTypes_lb']", role);
  await dropdown(page, "//span[@id='lstIsOwnGroup']", ownGroupForBuyer);
  await dropdown(page, "//span[@id='lstIsBlacklisted']", bannedListForBuyer);
  await typeAndTab(page, "//span[@id='acCountries']//input[@placeholder='<Type & tab for single value>']", countryOfIncorporation);

  await exportExcelButton(page);
  await downloadFile(page);
  await consoleLog();
});
