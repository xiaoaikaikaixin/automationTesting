import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { downloadFile, dropdown, expectResult, popupbuttonselector, popupselection, type } from '../../../utils/baseTest';
import { reporturl } from '../../../data/reportData';
import { consoleLog, exportExcelButton } from '../../../utils/report/reportBaseCase';

const buyerName = 'ICOF America Inc';
const buyerSeletionName = 'ICOF America Inc';
const paymentTerm = 'TT30_3daysSignContract;LC70_30daysBLDate';
const paymentMode = 'TT';
const creditCondition = 'Upon Trade Confirmation';
const creditTermFrom = '1';
const creditTermTo = '30';
const productDivision = 'Fatty Alcohol';
const paymentTermStatus = 'Active';
const buyerStatus = 'Active';

test('Buyer with Payment Term', async ({
  page,
  ai,
  aiAssert,
  aiQuery
}) => {
  test.info().title = 'Buyer with Payment Term';

  await login(page);

  await page.goto(`${reporturl.url}/Report/OperationAdmin/RptBuyerWithPaymentTerm.aspx`);

  await popupselection(page, "//input[@id='pstxtBPName_pop']", "//iframe[@id='pstxtBPName_pop_pop_fr1']", buyerName);
  await type(page, "//input[@id='txtBPSelectionName']", buyerSeletionName);
  await popupbuttonselector(page, "//input[@id='psacPaymentTermCode_pop']", "//iframe[@id='psacPaymentTermCode_pop_pop_fr1']","//input[@id='txtName']", "//table[@id='grdPaymentTerm_t']/tbody/tr[2]/td[1]/span", paymentTerm);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddPaymentMode_lb']", paymentMode);
  await page.click("//label[normalize-space()='Payment Mode']");

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddCreditCondition_lb']", creditCondition);
  await page.click("//label[normalize-space()='Credit Condition']");

  await type(page, "//input[@id='txtCreditTermFrom']", creditTermFrom);
  await type(page, "//input[@id='txtCreditTermTo']", creditTermTo);

  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddProductDivision_lb']", productDivision);
  await page.click("//label[normalize-space()='Product Division']");

  await expectResult(page, "//span[@id='lstPaymentTermStatus']", paymentTermStatus);
  await expectResult(page, "//span[@id='lstBuyerStatus']", buyerStatus);

  await exportExcelButton(page);
  await downloadFile(page);
  await consoleLog();
});
