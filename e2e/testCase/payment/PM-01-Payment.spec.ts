import { editViewButton, expectResult, extractValue } from "e2e/utils/baseTest";
import { test } from "fixture";


export const paymentForICOFComInvoice = async (        
    page,
    ai,
    aiQuery,
    aiAssert,
 ) => {

            test.info().title = 'Invoice - Create Normal order with Basis is C&D';

            // await page.goto(`${sharedData.invoiceUrl}`);
            await editViewButton(page);
            const amountRemaining = await extractValue(page, "//td[normalize-space()='Amount Remaining']/following-sibling::td");
            console.log("Amount Remaining is : " + amountRemaining);
            await page.click("//input[@id='btnAcceptPayment']");
            await page.waitForTimeout(3000);
            await expectResult(page, "//table[@id='grdInvoice_t']/tbody/tr[2]/td[13]/span", amountRemaining);
            await page.click("//input[@id='btnSave']");
            await page.waitForTimeout(3000);
            try{
                    await aiAssert(`verify 'Status' field is 'Fully Allocated'`);
                    console.log("verify 'Status' field is 'Fully Allocated'");
            }catch(error){
                    console.log("Error: " + error);
            }
            const paymentNo = await extractValue(page, "//span[@id='lblPageTitle']");
            console.log("Payment No is : " + paymentNo);
            await page.click("//table[@id='grdInvoice_t']/tbody/tr[2]/td[3]/a");
            try{
                    await aiAssert(`verify 'Status' is 'Paid In Full'`);
                    console.log("verify 'Status' is 'Paid In Full'");
            }catch(error){
                console.log("Error: " + error);
            }

            await page.click("//a[normalize-space()='Related Records']")
            try{
                    await expectResult(page, "//label[normalize-space()='Total Payment Received Amount']/parent::span/parent::td", amountRemaining);
                    await expectResult(page, "//table[@id='grdPaymentDetail_t']/tbody/tr[2]/td[3]/a", paymentNo);
                    console.log("verify payment no and amount remaining is correct");
            }catch(error){
                    console.log("Error: " + error);      
            }            
            console.log("verify able to make payment successfully");
     
}
 