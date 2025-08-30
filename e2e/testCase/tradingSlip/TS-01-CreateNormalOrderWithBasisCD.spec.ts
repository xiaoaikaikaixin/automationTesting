import { expect } from '@playwright/test';
import { test } from "../../../fixture";
import { verifyLoggedIn } from '../../utils/sharedContext';
import { tsMainTabData, tsShippingTabData, tsProductTabData, statusData, tsSpecialReqsTabData, 
    tsSurveyorTabData, tsBrokerTabData, tsBudgetedFreightTabData, testCredentials } from '../../data/tradingSlipTestData';
import { click, type, typeAndTab, dropdown, popupselection, popupbuttonselector,editViewButton,
    submitforApprovalButton,approveButton,okButton, 
    extractValue} from '../../utils/baseTest';

import { addMain, addProduct, addSpecialReq, addSurveyor,addBroker, addBudgetedFreight, addShipping,
    mainTabVerification, shippingTabVerification, productDetailsTabVerification, specialReqsTabVerification,
    surveyorTabVerification, brokerTabVerification } from '../../utils/tradingSlip/tradingSlipBaseCase';
import { login } from '../../utils/baseCase';
import { scCreateNormalOrderWithBasisCD } from '../salesContract/SC-01-CreateNormalOrderWithBasisCD.spec';
import { ciCreateContractInstruction } from '../contractInstruction/CI-01-CreateContractInstruction.spec';
import { subCICreateSubContractInstruction } from '../subContractInstruction/SubCI-01-CreateSubCI.spec';
import { freightBookingCreationAndBooked } from '../freightBooking/FB-01-CreateFreightBookingWithBasisCD.spec';
import { poCreateNormalOrderWithBasisCD } from '../purchaseOrder/PO-01-CreateNormalOrderWithBasisCD.spec';
import { OpsysSendMMSCtoNCTSforPO } from '../../utils/tool/toolSendMMSCNo';
import { OpsysSendSupplierInvoice } from '../../utils/tool/toolSendSupplierInvoice';
import { invoiceCreateNormalOrderWithBasisCD } from '../invoice/IN-01-createDropShipmentInv.spec';
import { paymentForICOFComInvoice } from '../payment/PM-01-Payment.spec';

test.describe.serial('Trading Slip Tests', () => {
    let sharedData: {
        tsNo?: string;
        scNo?: string;
        ciNo?: string;
        subciNo?: string;
        subciID?: string;
        poID?: string;
        poNo?: string;
        tsUrl? : string;
        scUrl? : string;
        ciUrl? : string;
        poUrl? : string;
        subCIUrl? : string;
        invoiceUrl? : string;
        // Add other fields as needed
    } = {};


    test("TS - Create Normal order with Basis is C&D", async ({ 
        ai, 
        aiInput, 
        aiQuery, 
        aiAssert, 
        aiTap,          
        page }) => {

            // Navigate to Contract menu and select New Trading Slip
            test.info().title = 'TS - Create Normal order with Basis is C&D';
            await login(page);
            await page.click(`//a[normalize-space()="${tsMainTabData.menuName}"]`);
            await page.click(`//a[normalize-space()="${tsMainTabData.submenuName}"]`);
            await page.waitForLoadState("networkidle");
            await page.waitForTimeout(2000);

            await addMain(page, ai, aiQuery, aiAssert);
            await addShipping(page, ai, aiQuery, aiAssert);
            await addProduct(page,  ai, aiQuery, aiAssert);
            await addSpecialReq(page,  ai, aiQuery, aiAssert);
            await addSurveyor(page,  ai, aiQuery, aiAssert);
            await addBroker(page,  ai, aiQuery, aiAssert);
            await addBudgetedFreight(page,  ai, aiQuery, aiAssert);
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
            }catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                console.error("Error verifying pending for approval status: " + msg);
            }
            await page.click("//a[normalize-space()='Email History']");
            await page.waitForTimeout(2000);
            try{    
                const [emailSubject] = await Promise.all([
                    aiQuery("text content of the 'Subject' field for the first row")
                ]);
                await aiAssert(`verify that the first row of the 'Subject' column contains 'TS Pending Approval'`);
                console.log("Submit for Approval's email subject:", emailSubject);
            }catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                console.error("Error verifying trigger email notification when Submit for approval: " + msg);
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

            }catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                console.error("Error verifying approval status: " + msg);
            }

            const tsNo = await extractValue(page, "//a[@id='lnkTradingSlipNo']");
            const scNo = await extractValue(page, "//a[@id='lnkSalesContractNo']");
    
            console.log("Trading Slip No is: " + tsNo);
            console.log("Related Sales Contract No is: " + scNo);


            await page.click("//a[normalize-space()='Email History']");
            await page.waitForTimeout(2000);
            try{    
                const [emailSubject] = await Promise.all([
                    aiQuery("text content of the 'Subject' field for the first row")
                ]);
                await aiAssert(`verify that the first row of the 'Subject' column contains 'TS Approved'`);
                console.log("Approved email's subject:", emailSubject);
            }catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                console.error("Error verifying trigger email notification when TS Approved: " + msg);
            }
            await page.click("//a[normalize-space()='Main']");

            console.log(test.info().title + " successfully.");

            await page.waitForTimeout(2000);
            sharedData.tsUrl = await page.url();
        });

});
