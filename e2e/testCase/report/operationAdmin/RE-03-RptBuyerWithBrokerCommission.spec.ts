import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { downloadFile, dropdown, expectResult, popupselection, type } from '../../../utils/baseTest';
import { reporturl } from '../../../data/reportData';
import { consoleLog, exportExcelButton } from '../../../utils/report/reportBaseCase';

const buyerName = 'ICOF America Inc';
const buyerSeletionName = 'ICOF America Inc';
const brokerName = 'Shanghai Continental Co., Ltd.';
const productDivision = 'Fatty Alcohol';
// const commissionStatus = 'Active';
// const brokerStatus = 'Active';
// const buyerStatus = 'Active';

test('Buyer with Broker Commission', async ({
  page,
  ai,
  aiAssert,
  aiQuery
}) => {
  test.info().title = 'Buyer with Broker Commission';

  await login(page);

  await page.goto(`${reporturl.url}/Report/OperationAdmin/RptBuyerWithBrokerCommission.aspx`);

  await popupselection(page, "//input[@id='pstxtBuyerName_pop']", "//iframe[@id='pstxtBuyerName_pop_pop_fr1']", buyerName);
  await type(page, "//input[@id='txtBuyerSelectionName']", buyerSeletionName);

  await popupselection(page, "//input[@id='pstxtBrokerCommissionName_pop']", "//iframe[@id='pstxtBrokerCommissionName_pop_pop_fr1']", brokerName);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddProductDivision_lb']", productDivision);
  await page.click("//label[normalize-space()='Product Division']");

  await exportExcelButton(page);
  await downloadFile(page);
  await consoleLog();
});
