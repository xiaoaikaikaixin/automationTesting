import { expect } from '@playwright/test';
import { test } from "../../../fixture";
import { freightChargeData } from '../../data/freightChargeTestData';
import {click, type, typeAndTab,dropdown, popupselection}  from '../../utils/baseTest';
import { login } from '../../utils/baseCase';
import { handleConfirmDialog } from '../../utils/dialogHandler';

// Timeout removed - using global configuration

test.beforeEach(async ({ page }) => {
  // Using the login function from baseCase.ts
  await login(page);
});

test("Freight Charge creation with Shipping term Door to Door", async ({ 
    ai, 
    aiInput, 
    aiQuery, 
    aiAssert, 
    aiTap, 
    page }) => {
        // Login is now handled in beforeEach hook
        await page.click(`//a[normalize-space()="${freightChargeData.menuName}"]`);
        await page.click(`//a[normalize-space()="${freightChargeData.submenuName}"]`);
        await page.waitForTimeout(2000);
        await dropdown(page,'//span[@id="select2-lstShippingTerm-container"]', freightChargeData.shippingTermDoorToDoor);
        await page.waitForTimeout(2000);
        await dropdown(page,'//span[@id="lstLoadLocation"]', freightChargeData.placeOfLoading);
        await typeAndTab(page, "(//input[@placeholder='<Type then tab>'])[1]", freightChargeData.countryOfDestination);
        await dropdown(page,'//span[@id="lstDischargePort"]', freightChargeData.portOfDischarge);
        await dropdown(page,'//span[@id="lstFreightIndication"]',  freightChargeData.freightIndication);
        await popupselection(page,'//input[@id="psacShippingLine_pop"]', '//iframe[@id="psacShippingLine_pop_pop_fr1"]',freightChargeData.shippingLine);
      
        await typeAndTab(page, "(//input[@placeholder='<Type then tab>'])[1]", freightChargeData.finalDestinationCountry);
        await dropdown(page,'//span[@id="lstFinalDestinationLocation"]', freightChargeData.finalDestination);

        await page.fill('//input[@id="txtTransitTime_ti"]', freightChargeData.transitTime);
        await dropdown(page,'//span[@id="lstCargoNature"]', freightChargeData.cargoNature);
        await page.waitForTimeout(3000);
        await page.click("//span[@id='chkddCarrier']");
        await page.click("//div[@id='jAutochecklist_wrapper_chkddCarrier_lb']");
        await page.click("//span[@id='chkddCarrier']//li[2]");
     

        // Fill General Information and Freight Rate
        await page.fill("//input[@id='txtGeneralInfo']", freightChargeData.generalInformation);
        await page.fill("//input[@id='txtFreightRates_ti']", freightChargeData.freightRate);
        await page.fill("//input[@id='txtFreeTimeDetention_ti']", freightChargeData.freeTimeDetention);
        await page.fill("//input[@id='txtFreeTimeDemurrage_ti']", freightChargeData.demurrage);
        await page.fill("//input[@id='txtFreeTimeCombined_ti']", freightChargeData.freeTimeCombined);
        await page.fill("//textarea[@id='txtPlantRemarks']", freightChargeData.plantsRemarks);
        await page.fill("//textarea[@id='txtShippingRemarks']", freightChargeData.shippingRemarks);
        await page.fill("//textarea[@id='txtMarketingRemarks']", freightChargeData.marketingRemarks);
        await page.waitForTimeout(2000);
        
        // Set up dialog handler before clicking the button that triggers the dialog
        await handleConfirmDialog(page, true, 'Are you sure you want to submit for release?');
        
        // Click the button that will trigger the dialog
        await page.click("//input[@id='btnSubmitRelease']");
        await page.click("//button[@id='button-0']");
        console.log("Submit the Freight Charge for released");
        await page.waitForTimeout(2000);
        
        // Verify Freight Charge number and status
        const [fcNumber, pendingStatus1] = await Promise.all([
            aiQuery("text content of 'Freight Charge No' field"),
            aiQuery("text content of 'Status' field")
        ]);
        
        await aiAssert(`Freight Charge ${fcNumber} is displayed`);
        await aiAssert(`${pendingStatus1} equal to ${freightChargeData.pendingStatus}`);
        console.log(`Freight Charge Number: ${fcNumber}`);
        console.log(`Freight Charge Status: ${pendingStatus1}`);

        await aiAssert(`Freight Charge Number is visible`);
        await aiAssert(`Freight Charge Status is 'Pending Release'`);
        await page.waitForTimeout(3000);
        
        // Set up dialog handler before clicking the Release button
        // await handleConfirmDialog(page, true, 'Are you sure you want to release this freight charge?');        
        // Release the Freight Charge
        await page.click('//input[@id="btnRelease"]');
        await page.waitForTimeout(2000);
        await page.click("//button[@id='button-0']");
        await page.waitForTimeout(2000);
        // Print the Freight Charge number to the console for reference in the ne

        // Verify Released status
        const [releasedStatus1] = await Promise.all([
            aiQuery("text content of 'Status' field")
        ]);
        console.log(`Released Status: ${releasedStatus1}`);
        await aiAssert(`${releasedStatus1} equal to ${freightChargeData.releasedStatus}`);
        console.log("Freight Charge created, submit for release and released successfully!");
}
);