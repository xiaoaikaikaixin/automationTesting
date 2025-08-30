import { expect } from '@playwright/test';
import { test } from "../../../fixture";
import { tsMainTabData,tsShippingTabData,statusData } from '../../data/tradingSlipTestData';
import { click, type, typeAndTab, dropdown, popupselection, editViewButton, submitforApprovalButton, approveButton } from '../../utils/baseTest';
import { login } from '../../utils/baseCase';
import { addBudgetedFreight, addProduct, addShipping, addShippingTCPC, addSpecialReq, addSurveyor, addUnsoldMain, brokerTabVerification, mainTabVerification, productDetailsTabVerification, shippingTabVerification, shippingTCPCTabVerification, specialOrdermainTabVerification, specialReqsTabVerification, surveyorTabVerification } from '../../utils/tradingSlip/tradingSlipBaseCase';

// Timeout removed - using global configuration 

test("Create Unsold Order", async ({ 
    ai, 
    aiInput, 
    aiQuery, 
    aiAssert, 
    aiTap, 
    page }) => {
    test.info().title = 'Create Unsold Order';
    await login(page);
    await page.click(`//a[normalize-space()="${tsMainTabData.menuName}"]`);
    await page.click(`//a[normalize-space()="${tsMainTabData.submenuName}"]`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);   
    await addUnsoldMain(page, ai, aiQuery, aiAssert);        
    await addShipping(page, ai, aiQuery, aiAssert);
    await addShippingTCPC(page, ai, aiQuery, aiAssert);
    await addProduct(page, ai, aiQuery, aiAssert);
    await addSpecialReq(page, ai, aiQuery, aiAssert);
    await addSurveyor(page, ai, aiQuery, aiAssert);
    await addBudgetedFreight(page, ai, aiQuery, aiAssert);

    await page.click("//a[normalize-space()='Main']");
    await editViewButton(page);
    await submitforApprovalButton(page);
    await page.evaluate(() => {location.reload(); });
        try{    
            const [tsPendingApprovalStatus] = await Promise.all([
                aiQuery("text content of 'Approval Status' field")
            ]);
            await aiAssert(`verify that the Approval Status contains ${statusData.tsPendingApprovalStatus}`);
            console.log("Pending Approval Status:", tsPendingApprovalStatus);
        }catch (error) {
            console.log("Error verifying pending for approval status: " + error.message);
        }
        await page.click("//a[normalize-space()='Email History']");
        try{    
            const [emailSubject] = await Promise.all([
                aiQuery("text content of the 'Subject' field for the first row")
            ]);
            await aiAssert(`verify that the first row of the 'Subject' column contains 'TS Pending Approval'`);
            console.log("Submit for Approval's email subject:", emailSubject);
        }catch (error) {
            console.log("Error verifying trigger email notification when Submit for approval: " + error.message);
        }
    await page.click("//a[normalize-space()='Main']");

    await approveButton(page);
    await page.evaluate(() => {location.reload(); });
    await page.waitForTimeout(2000);

    try{    
            await page.evaluate(() => {location.reload(); });
            const [tsApprovalStatus] = await Promise.all([
                aiQuery("text content of 'Approval Status' field")
            ]);
            console.log("Approval Status:", tsApprovalStatus);
            await aiAssert(`verify that the Approval Status contains ${statusData.tsApprovalStatus}`);

        }catch (error) {
            console.log("Error verifying approval status: " + error.message);
        }
        await page.click("//a[normalize-space()='Email History']");

        try{    
            const [emailSubject] = await Promise.all([
                aiQuery("text content of the 'Subject' field for the first row")
            ]);
            await aiAssert(`verify that the first row of the 'Subject' column contains 'TS Approved'`);
            console.log("Approved email's subject:", emailSubject);
        }catch (error) {
            console.log("Error verifying trigger email notification when TS Approved: " + error.message);
        }
    await page.click("//a[normalize-space()='Main']");


    await specialOrdermainTabVerification(page,  ai, aiQuery, aiAssert);    
    await shippingTabVerification(page,  ai, aiQuery, aiAssert);
    await shippingTCPCTabVerification(page, ai, aiQuery, aiAssert);
    await productDetailsTabVerification(page,  ai, aiQuery, aiAssert);
    await specialReqsTabVerification(page,  ai, aiQuery, aiAssert);
    await surveyorTabVerification(page,  ai, aiQuery, aiAssert);
    console.log(test.info().title + " successfully.");

})

test("Quick: Login and select Division (Unsold)", async ({
    page
}) => {
    test.info().title = 'Quick Unsold Initiation';
    await login(page);
    await page.click(`//a[normalize-space()="${tsMainTabData.menuName}"]`);
    await page.click(`//a[normalize-space()="${tsMainTabData.submenuName}"]`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    await dropdown(page, '//span[@id="lstDivision"]', tsMainTabData.division);
})
