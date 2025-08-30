import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { expectResult, downloadFile, dropdown,popupselection, extractValue}  from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, sellerSelect, etdPortOfLoadingSelect, portOfLoadingSelect, factoryLocationSelect, searchButton, consoleLog } from '../../../utils/report/reportBaseCase';
import { expect } from 'playwright/test';


// Timeout removed - using global configuration


test('Freight Booking Cancel/Revised/On Hold Report', async ({ 
    page,
    ai,
    aiAssert,
    aiQuery
 }) => {
  test.info().title = 'Freight Booking Cancel/Revised/On Hold Report';

    await login(page);
    await page.goto(`${reporturl.url}FreightBooking/FreightBookingCancellation.aspx`);
    await sellerSelect(page); 
    await etdPortOfLoadingSelect(page);
    await factoryLocationSelect(page);
    await portOfLoadingSelect(page);
    await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddStatus_lb']", "Cancelled");
    await page.click("//label[normalize-space()='Port of Loading']");
    await searchButton(page);
    await page.waitForTimeout(2000);
    const portOfLoadingValue = await extractValue(page,"//table[@id='grdFB_t']/tbody/tr[2]/td[8]/span");
    await aiAssert(`verify ${portOfLoadingValue} between ${reportData.dateFrom} and ${reportData.dateTo}`);
    await expectResult(page, "//table[@id='grdFB_t']/tbody/tr[2]/td[12]/span",  reportData.portOfLoading);
    await expectResult(page, "//table[@id='grdFB_t']/tbody/tr[2]/td[19]/span",  reportData.factoryLocation);
    await expectResult(page, "//table[@id='grdFB_t']/tbody/tr[2]/td[20]/span",  'Cancelled');
    await exportExcelButton(page);
    await downloadFile(page);
    await consoleLog();  
 });