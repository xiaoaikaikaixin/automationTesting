import { expect } from '@playwright/test';
import { test } from '../../../fixture';
import { login } from '../../utils/baseCase';
import { reporturl,reportData } from '../../data/reportData';

// Timeout removed - using global configuration

test.beforeEach(async ({ page }) => {
  // Using the login function from baseCase.ts
  await login(page);
});

test('Download Sales Division Report', async ({ 
    page,
    ai,
    aiQuery,
    aiWaitFor,
    aiAssert
 }) => {
  test.info().title = 'Downloads a sales report by division for marketing';

  await page.goto(`${reporturl.url}/Marketing/RptSalesReportByDivisionForMarketing.aspx`);


  // Step 6: Click the Division dropdown and select the 'Fatty Acid' option
  await page.click("//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']//span");
  await page.waitForTimeout(1000);
  await page.click(`//li[text()="${reportData.division}"]`);
  
  // Step 7: Type '01-Jan-2025' in Traded Date from
  await page.fill("//input[@id='drTradedDate_dFrom_ti']", reportData.tradedDateFrom);
  
  // Step 8: Type '30-May-2025' in Traded Date to
  await page.fill("//input[@id='drTradedDate_dTo_ti']", reportData.tradedDateTo);
  
  // Step 9: Click 'Search' button
  await page.click("//input[@id='btnSearch']");
  await page.waitForLoadState("networkidle");

  const [division, tradedDate] = await Promise.all([
    aiQuery("text content of the first row of 'Division' field"),
    aiQuery("text content of the first row of 'Traded Date' field"), 
   ]);

    console.log(`Division: ${division}`);
    console.log(`Traded Date: ${tradedDate}`);

  await aiAssert(`${division} is equal to the ${reportData.division}`);
  await aiAssert(`${tradedDate} is between the ${reportData.tradedDateFrom} and ${reportData.tradedDateTo} inclusively`);
  
  console.log("the filter shown the corret records");
 
  
  // Step 10: Click 'Export - Excel' button
  await page.click("//input[@id='btnPrint']");
  
  // Wait for download to start
  const downloadPromise = page.waitForEvent('download');
  const download = await downloadPromise;
  
  console.log(`Successfully downloaded report: ${download.suggestedFilename()}`);
});