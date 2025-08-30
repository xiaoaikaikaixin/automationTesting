import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { downloadFile, dropdown, popupselection, type } from '../../../utils/baseTest';
import { reporturl } from '../../../data/reportData';
import { consoleLog, exportExcelButton } from '../../../utils/report/reportBaseCase';

const buyerName = 'Chuo Kasei Co Ltd.11';
const buyerSeletionName = 'Chuo Kasei Co Ltd.11';
const blDetailsName = 'Chuo Kasei Co. Ltd. - Chuo Kasei Co. Ltd';


test('Buyer with BL Details', async ({
  page,
  ai,
  aiAssert,
  aiQuery
}) => {
  test.info().title = 'Buyer with BL Details';

  await login(page);

  await page.goto(`${reporturl.url}/Report/OperationAdmin/RptBuyerWithBLDetails.aspx`);

  await popupselection(page, "//input[@id='pstxtBPName_pop']", "//iframe[@id='pstxtBPName_pop_pop_fr1']", buyerName);
  await type(page, "//input[@id='txtBPSelectionName']", buyerSeletionName);
  await type(page, "//input[@id='txtBLDetails']", blDetailsName);


  await exportExcelButton(page);
  await downloadFile(page);
  await consoleLog();
});
