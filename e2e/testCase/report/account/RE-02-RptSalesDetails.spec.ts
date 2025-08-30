import { expect } from '@playwright/test';
import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { expectResult, downloadFile, dropdown,popupselection}  from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, tradedDate, blDate, invoiceDate, invoiceStatusSelect, invoiceTypeSelect,divisionSelect,supplierSelect,
    deliveryModeSelect, buyerSelect, invoiceDefaultDateVerify, consoleLog } from '../../../utils/report/reportBaseCase';


// test.setTimeout(60000); // Set timeout to 2 minutes

test('Sales Details Report', async ({ 
    page
 }) => {
  test.info().title = 'Sales Details Report';

    await login(page);
    await page.goto(`${reporturl.url}Report/Account/RptSalesDetails.aspx`);
    await divisionSelect(page); 
    await supplierSelect(page);
    // await deliveryModeSelect(page);
    // await buyerSelect(page);
    await invoiceStatusSelect(page);
    await invoiceTypeSelect(page);
    await blDate(page);
    await invoiceDefaultDateVerify(page);
    await exportExcelButton(page);
    await downloadFile(page);
    await consoleLog();
 });