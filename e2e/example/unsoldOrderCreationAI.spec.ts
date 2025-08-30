import { test } from "../../fixture";
import { testCredentials, mainData } from '../data/testData';

// Timeout removed - using global configuration

test.beforeEach(async ({ page }) => {
  try {
    await page.goto(testCredentials.url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
  } catch (error) {
    console.error('Navigation failed:', error);
    throw error;
  }
});

test("NCTS Login and Trading Slip Creation", async ({ ai, aiInput, aiQuery, aiAssert, aiTap,page }) => {
  // Step 1-3: Login to the system
  await aiInput(testCredentials.username,'User ID field');
  await aiInput(testCredentials.password,'Password field');
  await aiTap('Login button');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Reduced wait time but added network idle check

  // Step 5-6: Verify successful login
  await aiAssert('username "Lin Ai Juan" is visible in the top-right corner');

  // Step 7: Navigate to Contract menu
  await aiTap('Contrat menu');

  // Step 8: Select Trading Slip - New record
  await ai('click Trading Slip - New record link');

  // Step 9-10: Check Unsold Order box
  await aiTap('Unsold Order checkbox under Special Order Type');

  // Step 11-12: Select Division as Fatty Alcohol
  await aiTap('Division dropdown menu');
  await ai(`click '${mainData.division}' in dropdown list`);

  // Step 13: Wait for 10 seconds
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Reduced wait time but added network idle check
  await page.fill('//input[@id="txtSalesEnquiryNo"]', mainData.salesEnquiryNumber);
  await page.waitForSelector('//span[@id="lstSupplier"]', { state: 'visible', timeout: 10000 });
  await page.click('//span[@id="lstSupplier"]');
  await page.waitForLoadState('networkidle');
  await page.click(`//li[text()="${mainData.supplier}"]`);
  await aiAssert(`Factory Location displays ${mainData.expectedFactoryLocation}`);


  await ai('click "Seller" dropdown');
  await ai(`click '${mainData.seller}' in seller list`);
  await ai('Scroll to the bottom of page');
  await ai(`Input '${mainData.buyerPONumber}' in Buyer PO Number field`);
  await ai('click "Currency" dropdown');
  await ai(`click '${mainData.currency}' in currency list`);
  await ai('click "Basis" dropdown');
  await ai(`click '${mainData.basis}' in basis list`);
  await ai('Scroll to the top of page');
  await ai('click Traded By dropdown');
  await ai(`click '${mainData.tradedBy}' in trader list`);
  await ai('Click Save button');

    // Post-creation verification
  const [slipNumber, tsApprovalStatus] = await Promise.all([
    aiQuery("text content of 'Trading Slip No.' field"),
    aiQuery("text content of 'Approval Status' field")
  ]);

  await aiAssert(`Trading Slip ${slipNumber} is displayed with status ${tsApprovalStatus}`);
  await aiAssert('Trading Slip Number is displayed');
  

});
