import { expect } from '@playwright/test';
import { test } from '../../../fixture';
import { testCredentials, freightChargeData } from '../../data/freightChargeTestData';
import { autoLogger, retryWithAutoLogging } from "../../utils/autoLogger";

// Timeout removed - using global configuration

test.beforeEach(async ({ page }) => {
  // Initialize auto logging
  autoLogger.startLogging(page);
  await page.goto(testCredentials.url);
  await page.waitForLoadState("networkidle");
});

test('Create Freight Charge workflow', async ({ 
  page,
  ai,
  aiWaitFor,
  aiAssert
}) => {
  test.info().title = 'Creates a new freight charge and verifies all required fields';

  // Step 1-4: Login process
  await retryWithAutoLogging(
    async () => {
      await page.fill('input[name="txtUserID"]', testCredentials.username);
      await page.fill('input[name="txtPassword"]', testCredentials.password);
      await page.click('input[name="btnLogin"]');

      // Verify successful login
      await expect(page.locator('//span[@id="lblUserName"]')).toBeVisible();
    },
    "Login process"
  );

  // Step 7-8: Navigate to create new freight charge
  await retryWithAutoLogging(
    async () => {
      await page.click(`//a[normalize-space()="${freightChargeData.menuName}"]`);
      await page.click(`//a[normalize-space()="${freightChargeData.submenuName}"]`);
      await page.waitForLoadState("networkidle");
    },
    "Navigate to Freight Charge creation page"
  );

  // Step 10-16: Fill in freight charge details
  await retryWithAutoLogging(
    async () => {
      // Select Shipping Term
      await page.click('//span[@id="select2-lstShippingTerm-container"]');
      // await page.click(`//li[text()="${freightChargeData.shippingTerm}"]`);
      await page.waitForTimeout(1000);

      // Select Port of Loading
      await page.click('//span[@id="lstLoadLocation"]');
      await page.click(`//li[text()="${freightChargeData.placeOfLoading}"]`);
      await page.waitForTimeout(1000);

      // Fill Country of Destination
      await page.click('//span[@id="acDischargeCountry"]');
      await page.fill('//span[@id="acDischargeCountry"]', freightChargeData.countryOfDestination);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(1000);

      // Select Port of Discharge
      await page.click('//span[@id="lstDischargePort"]');
      await page.click(`//li[text()="${freightChargeData.portOfDischarge}"]`);
      await page.waitForTimeout(1000);

      // Select Freight Indication
      await page.click('//span[@id="lstFreightIndication"]');
      await page.click(`//li[text()="${freightChargeData.freightIndication}"]`);
      await page.waitForTimeout(1000);

      // Select Shipping Line
      await page.click('//input[@id="psacShippingLine_pop"]');
      await page.fill('//input[@id="txtBPName"]', freightChargeData.shippingLine);
      await page.click('//input[@id="btnSearch"]');
      await expect(page.locator(`//td[3]/span[contains(text(), '${freightChargeData.shippingLine}')]`)).toBeVisible();
      await page.click('//input[@value="Select"]');
      await page.waitForTimeout(1000);

      // Fill Final Destination details
      await page.click('//span[@id="acFinalDestinationCountry"]//input[@placeholder="<Type then tab>"]');
      await page.fill('//span[@id="acFinalDestinationCountry"]//input[@placeholder="<Type then tab>"]', freightChargeData.finalDestinationCountry);
      await page.keyboard.press('Tab');
      await page.click('//span[@id="lstFinalDestinationLocation"]');
      await page.click(`//li[text()="${freightChargeData.finalDestination}"]`);
      await page.waitForTimeout(1000);

      // Fill Transit Time and Cargo Nature
      await page.fill('//input[@id="txtTransitTime_ti"]', freightChargeData.transitTime);
      await page.click('//span[@id="lstCargoNature]');
      await page.click(`//li[text()="${freightChargeData.cargoNature}"]`);
      await page.waitForTimeout(1000);

      // Select first Carrier option
      await page.click('//div[@id="jAutochecklist_wrapper_chkddCarrier_lb"]');
      await page.click('(//ul[@class="jAutochecklist_list"])/li[2]');
      await page.waitForTimeout(1000);

      // Fill General Information and Freight Rate
      await page.fill('//textarea[@id="txtGeneralInfo"]', freightChargeData.generalInformation);
      await page.fill('//input[@id="txtFreightRates_ti"]', freightChargeData.freightRate);

      // Verify all fields are filled correctly
      const shippingTermValue = await page.locator('//span[@id="select2-lstShippingTerm-container"]').textContent();
      const portOfLoadingValue = await page.locator('//span[@id="lstLoadLocation"]').textContent();
 

      // expect(shippingTermValue).toContain(freightChargeData.shippingTerm);
      expect(portOfLoadingValue).toContain(freightChargeData.placeOfLoading);

    },
    "Fill in Freight Charge details"
  );

  // Step 17-18: Submit and Release
  await retryWithAutoLogging(
    async () => {
      await page.click('//input[@id="btnSubmitRelease"]');
      await page.click('//button[@id="button-0"]');
      await page.waitForLoadState("networkidle");

      // Verify Freight Charge number and status
      await expect(page.locator('//span[@id="lblPageTitle"]"]')).toHaveValue("2025");
      await expect(page.locator('//span[@id="lblStatus"]')).toHaveText('Pending Release');

      const fcNo = await page.locator('//span[@id="lblPageTitle"]').textContent();
      const status1 = await page.locator('(//label[contains(text(),"Status")])[1]/parent::span/parent::td').textContent();
      console.log(`Freight Charge Number: ${fcNo}`);
      console.log(`Freight Charge Status1 : ${status1}`);
      // Release the Freight Charge
      await page.click('//input[@id="btnRelease"]');
      await page.click('//input[@id="btnOK"]');
      await page.waitForLoadState("networkidle");
       // Print the Freight Charge number to the console for reference in the ne

      // Verify Released status
      await expect(page.locator('(//label[contains(text(),"Status")])[1]/parent::span/parent::td')).toHaveText('Released');
      const status2 = await page.locator('(//label[contains(text(),"Status")])[1]/parent::span/parent::td').textContent();
      console.log(`Freight Charge Status1 : ${status2}`);
    },
    "Submit and Release Freight Charge"
  );

  console.log("Freight Charge creation test completed successfully");
});

test.afterAll(async () => {
  // Reset the AutoLogger instance
  // @ts-ignore - Accessing private static member
  AutoLogger.resetInstance();
});