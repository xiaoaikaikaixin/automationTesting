import { expect } from '@playwright/test';
import { test } from '../../fixture';
import { testCredentials, mainData } from '../data/testData';
import {formatDateTo_dd_mmm_yyyy} from '../utils/baseTest';
import { autoLogger, retryWithAutoLogging, AutoLogger } from "../utils/autoLogger";


// Timeout removed - using global configuration

test.beforeEach(async ({ page }) => {
  // Step 1: Open the URL
  autoLogger.startLogging(page);
  await page.goto(testCredentials.url);
  await page.waitForLoadState("networkidle");
});

test('Create Unsold Order workflow', async ({ 
    page,
    ai,
    aiWaitFor
 }) => {
  test.info().title = 'Creates a new unsold order trading slip and verifies all required fields';
  await retryWithAutoLogging(
    async () => {
      await page.fill('input[name="txtUserID"]', testCredentials.username);
      await page.fill('input[name="txtPassword"]', testCredentials.password);
      await page.click('input[name="btnLogin"]');

      // Step 3: Verify successful login
      await expect(page.locator('//span[@id="lblUserName"]')).toBeVisible();
    },
    "Login process"
  );

  await retryWithAutoLogging(
    async () => {
       // Step 4: Navigate to create new trading slip
      await page.click('//a[normalize-space()="Contract"]');
      await page.click('//a[normalize-space()="New Trading Slip"]');

      // Step 5: Select Special Order Type
      await page.check('//label[normalize-space()="Unsold Order"]');

      // Step 6: Select Division
      await page.click('//span[@id="lstDivision"]');
      await page.click(`//li[text()="${mainData.division}"]`);

      // Step 7: Fill in Sales Enquiry Number
      await page.fill('//input[@id="txtSalesEnquiryNo"]', mainData.salesEnquiryNumber);

      // Step 8: Verify Traded Date
      // Format today's date to match the expected format in the application
      const tradedDateInput = await page.locator('//input[@id="dpTradedDate_dv"]').inputValue();
      await expect(formatDateTo_dd_mmm_yyyy(tradedDateInput)).toContain(formatDateTo_dd_mmm_yyyy(new Date()));
      console.log("Traded Date: " + formatDateTo_dd_mmm_yyyy(tradedDateInput));

      await page.waitForTimeout(3000);

      // Step 9: Select Supplier

      await page.click('//span[@id="lstSupplier"]');
    
      await page.waitForTimeout(3000);
      await page.click(`//li[text()="${mainData.supplier}"]`);
      await page.waitForTimeout(3000);
      
      // Step 10: Verify Factory Location
      const factoryLocationDropdown = page.locator('//span[@id="select2-lstFactoryLocation-container"]');
      const factoryLocationText = await factoryLocationDropdown.textContent();
      console.log("Factory Location: " + factoryLocationText);
      expect(factoryLocationText).toContain(mainData.expectedFactoryLocation);
      
      // Step 11: Select Seller
      await page.click('//span[@id="lstSeller"]');
      await page.waitForTimeout(2000);
      await page.click(`//li[text()="${mainData.seller}"]`);

      // Step 13: Fill in Buyer PO Number
      await page.fill('//input[@id="txtBuyerPONo"]', mainData.buyerPONumber);

      // Step 14: Select Currency
      await page.click('//span[@id="lstCurrency"]');
      await page.waitForTimeout(2000);
      await page.click(`//li[text()="${mainData.currency}"]`);

      // Step 16: Select Basis
      await page.click('//span[@id="lstBasis"]');
      await page.waitForTimeout(2000);
      await page.click(`//li[text()="${mainData.basis}"]`);

      // Step 17: Select Traded By
      await page.click('//span[@id="lstTrader"]');
      await page.waitForTimeout(2000);
      await page.click(`//li[text()="${mainData.tradedBy}"]`);

      // Step 18: Save the trading slip
      await page.click('//input[@id="btnSave"]');
      await page.waitForTimeout(2000);

      // Step 19: Extract and verify Trading Slip Number and Approval Status
      const slipNumber = await page.innerText('//a[@id="lnkTradingSlipNo"]');
      const tsApprovalStatus = await page.innerText('//td[@id="tdApprovalStatus"]');

      // Step 20: Verify Approval Status is 'Draft'
      expect(tsApprovalStatus).toContain(mainData.expectedApprovalStatus);
      
      // Step 21: Verify Trading Slip Number is displayed
      await expect(page.locator('//span[@id="lblPageTitle"]')).toBeVisible();

      console.log(`Successfully created Unsold Order with Trading Slip Number: ${slipNumber}`);
    // Step 22: Navigate to Shipping Tab
      },
      "Create Unsold Order with Main tab information"
    );
    
    await retryWithAutoLogging(
      async () => {
        await page.click('//a[normalize-space()="ShippingDDDDDD"]');
        await page.waitForTimeout(3000);
      },
      "Navigate to Shipping Tab and fill in all the necessary information"
    );
    
    console.log("Test completed successfully");
});

test.afterAll(async () => {
  // Reset the AutoLogger instance to prevent issues with multiple test runs
  // @ts-ignore - Accessing private static member
  AutoLogger.resetInstance();
});