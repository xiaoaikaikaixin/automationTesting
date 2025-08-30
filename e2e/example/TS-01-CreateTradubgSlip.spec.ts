import { statusData, tsMainTabData } from "e2e/data/tradingSlipTestData";
import { login } from "e2e/utils/baseCase";
import { dropdown, dropdownWithIndex, popupselection, type } from "e2e/utils/baseTest";
import { addMain } from "e2e/utils/tradingSlip/tradingSlipBaseCase";
import { test } from "fixture";

test("TS - Create Normal Trading Slip", async ({ 
        ai, 
        aiInput, 
        aiQuery, 
        aiAssert, 
        aiTap,          
        page }) => {

            // Navigate to Contract menu and select New Trading Slip
            test.info().title = 'TS - Create Normal Trading Slip';
            await login(page);
            await page.click(`//a[normalize-space()="${tsMainTabData.menuName}"]`);
            await page.click(`//a[normalize-space()="${tsMainTabData.submenuName}"]`);
            await page.waitForLoadState("networkidle");
            await page.waitForTimeout(2000);

            // await addMain(page, ai, aiQuery, aiAssert);
            await dropdown(page, '//span[@id="lstDivision"]', tsMainTabData.division);
            await page.fill('//input[@id="txtSalesEnquiryNo"]', tsMainTabData.saleEnqualNumber);
            await page.waitForTimeout(2000);
            await dropdown(page, '//span[@id="lstSupplier"]', tsMainTabData.supplier);
            await page.waitForTimeout(2000);
            await dropdown(page, '//span[@id="lstSeller"]', tsMainTabData.seller);
            await popupselection(page, "//input[@id='psacBuyer_pop']", '//iframe[@id="psacBuyer_pop_pop_fr1"]', tsMainTabData.buyer);
            await page.waitForTimeout(2000);
            await type(page,"//input[@id='txtBuyerPONo']", tsMainTabData.buyerPONo);
            await page.waitForTimeout(3000);
            await dropdown(page, "//span[@id='lstPaymentTerm']", tsMainTabData.paymentTerm);
            await dropdown(page, "//span[@id='lstBasis']", tsMainTabData.basisforCD);           
            await dropdownWithIndex(page, "//span[@id='lstTrader']", 3);


            // Save the Trading Slip
            await page.click('//input[@id="btnSave"]');
            await page.waitForLoadState("networkidle");
            await page.waitForTimeout(3000);        
            // Extract and verify Trading Slip number and status   
            const [tradingSlipNumber, tsApprovalStatus] = await Promise.all([
                aiQuery("text content of 'Trading Slip No.' field"),
                aiQuery("text content of 'Approval Status' field")
            ]);
            console.log(`Trading Slip Number: ${tradingSlipNumber}`);
            console.log(`Approval Status: ${tsApprovalStatus}`); 
            await aiAssert(`verify that the Approval Status equals to ${statusData.tsDraftStatus}`);
            await aiAssert(`verify that the Trading Slip number is ${tradingSlipNumber}`);
            console.log("Create Trading Slip with Main tab is successfully!")  
})