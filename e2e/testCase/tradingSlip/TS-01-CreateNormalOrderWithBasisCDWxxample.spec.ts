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

            await mainTabVerification(page,  ai, aiQuery, aiAssert);    
            await shippingTabVerification(page,  ai, aiQuery, aiAssert);
            await productDetailsTabVerification(page,  ai, aiQuery, aiAssert);
            await specialReqsTabVerification(page,  ai, aiQuery, aiAssert);
            await surveyorTabVerification(page,  ai, aiQuery, aiAssert);
            await brokerTabVerification(page,  ai, aiQuery, aiAssert);
            console.log(test.info().title + " successfully.");

            await page.click("//a[normalize-space()='Main']");
            await page.waitForTimeout(2000);
            sharedData.tsUrl = await page.url();
        });

     test("SC - Create Normal order with Basis is C&D", async ({ 
        ai, 
        aiInput, 
        aiQuery, 
        aiAssert, 
        aiTap, 
        page,
        context }) => {
            test.info().title = 'SC - Create Normal order with Basis is C&D';

            console.log("navigate to SC page: " + sharedData.tsUrl);
            await page.goto(`${sharedData.tsUrl}`);
            await scCreateNormalOrderWithBasisCD(page, ai, aiQuery, aiAssert);
            console.log(test.info().title + " successfully.");
            
            await page.click("//a[normalize-space()='Main']");
            sharedData.scUrl = await page.url();
        });   


         
     test("PO - Create Normal order with Basis is C&D", async ({ 
        ai, 
        aiInput, 
        aiQuery, 
        aiAssert, 
        aiTap, 
        page,
        context }) => {
            test.info().title = 'PO - Create Normal order with Basis is C&D';

            console.log("navigate to SC page: " + sharedData.scUrl);
            await page.goto(`${sharedData.scUrl}`);
            await page.click("//a[normalize-space()='Related Records']");   
            await page.click("//table[@id='grdPO_t']/tbody/tr[2]/td[2]/a");
            await poCreateNormalOrderWithBasisCD(page, ai, aiQuery, aiAssert);
            console.log(test.info().title + " successfully.");
            
            await page.click("//a[normalize-space()='Main']");

            sharedData.poUrl = await page.url();
            const [poID, poNo] = await Promise.all([
                aiQuery("text content of 'Purchase Order ID.' field"),
                aiQuery("text content of 'Purchase Order No.' field")
            ]);
            console.log("Purchase Order No and ID : " + poNo + " and " + poID);
            sharedData.poID = poID;
            sharedData.poNo = poNo;
            
        });   

     test("MM Send MMSC No - Create Normal order with Basis is C&D", async ({ 
        ai, 
        aiInput, 
        aiQuery, 
        aiAssert,   
        aiTap, 
        page,
        context }) => {
            test.info().title = 'M Send MMSC No - Create Normal order with Basis is C&D';
            console.log("navigate to PO page: " + sharedData.poUrl);
            await page.goto(`${sharedData.poUrl}`);
           if (sharedData.poID && sharedData.poNo && sharedData.poUrl) {
                await OpsysSendMMSCtoNCTSforPO(page, aiAssert, sharedData.poID, sharedData.poUrl, sharedData.poNo, context);
           } else {
               console.log("Warning: poID or poNo is undefined. Cannot send MMSC.");
           }
            console.log(test.info().title + " successfully.");           
        });       

     test("CI - Create Normal order with Basis is C&D", async ({ 
        ai, 
        aiInput, 
        aiQuery, 
        aiAssert, 
        aiTap, 
        page,
        context }) => {
            test.info().title = 'CI - Create Normal order with Basis is C&D';

            console.log("navigate to SC page: " + sharedData.scUrl);
            await page.goto(`${sharedData.scUrl}`);
            await ciCreateContractInstruction(page, ai, aiQuery, aiAssert);
            console.log(test.info().title + " successfully.");

            sharedData.ciUrl = await page.url();
            
        });  

     test("SubCI - Create Normal order with Basis is C&D", async ({ 
        ai, 
        aiQuery, 
        aiAssert, 
        page,
        context }) => {
            test.info().title = 'SubCI - Create Normal order with Basis is C&D';

            console.log("navigate to CI page: " + sharedData.ciUrl);
            await page.goto(`${sharedData.ciUrl}`);
            await subCICreateSubContractInstruction(
                page, 
                ai, 
                aiQuery, 
                aiAssert, 
            )
            const [tsNo, scNo,ciNo,subciNo] = await Promise.all([
                aiQuery("text content of 'Trading Slip No.' field"),
                aiQuery("text content of 'Sales Contract No.' field"),
                aiQuery("text content of 'Contract Instruction' field"),
                aiQuery("text content of 'Shipment Ref No.' field")
            ]);
            console.log("TS , SC and CI No is : " + tsNo + "------" + scNo + "------" + ciNo + "------" + subciNo);   
            sharedData.subCIUrl = await page.url();
            sharedData.subciNo = subciNo;
            sharedData.subciID = await aiQuery("text content of 'ID.' field");
            sharedData.scNo = await aiQuery("text content of 'Sales Contract No.' field");              

        });  


     test("Freight Booking - Create Normal order with Basis is C&D", async ({ 
        ai, 
        aiQuery, 
        aiAssert, 
        page,
        context }) => {

            test.info().title = 'Freight Booking - Create Normal order with Basis is C&D';
            console.log("navigate to SubCI page: " + sharedData.subCIUrl);
            await page.goto(`${sharedData.subCIUrl}`);
            await freightBookingCreationAndBooked(page, ai, aiQuery, aiAssert, sharedData.subciNo);
        });  

     test("MM Send Supplier Invoice No - Create Normal order with Basis is C&D", async ({ 
        ai, 
        aiInput, 
        aiQuery, 
        aiAssert,   
        aiTap, 
        page,
        context }) => {
            test.info().title = 'MM Send Supplier Invoice No - Create Normal order with Basis is C&D';
            console.log("navigate to Sub CI page: " + sharedData.subCIUrl);
            await page.goto(`${sharedData.subCIUrl}`);

           if (sharedData.subciID) {
               await OpsysSendSupplierInvoice(page, ai, aiTap, context, sharedData.subciID);
           } else {
               console.log("Warning: subciNo is undefined. Cannot send supplier invoice.");
           }
            console.log(test.info().title + " successfully.");           
        });  

     test("Invoice - Create Normal order with Basis is C&D", async ({ 
        ai, 
        aiInput, 
        aiQuery, 
        aiAssert, 
        aiTap, 
        page,
        context }) => {
            test.info().title = 'Invoice - Create Normal order with Basis is C&D';

            await page.goto(`${testCredentials.newpageurl}/Invoice/InvoiceBrowse.aspx`);
            
           if (sharedData.scNo) {
                await type(page,"//input[@id='txtSCNo']",sharedData.scNo);
           } else {
               console.log("Warning: scNo is undefined. Cannot search for the Invoice.");
           }
            await page.click("//input[@id='btnSearch']");
            await page.waitForTimeout(3000);
            await page.click("//table[@id='grdInvoice_t_frozen']/tbody/tr[2]/td[2]/span/a");

            await invoiceCreateNormalOrderWithBasisCD(page, ai, aiQuery, aiAssert,sharedData.subciNo, sharedData.scNo);
            await page.click("//a[normalize-space()='Main']");
            console.log(test.info().title + " successfully.");
            sharedData.invoiceUrl = await page.url();
        }); 

     test("Payment - Create Normal order with Basis is C&D", async ({ 
        ai, 
        aiQuery, 
        aiAssert, 
        page,
        context }) => {

            test.info().title = 'Payment - Create Normal order with Basis is C&D';
            console.log("navigate to Invoice page: " + sharedData.invoiceUrl);
            await page.goto(`${sharedData.invoiceUrl}`);
            await paymentForICOFComInvoice(page, ai, aiQuery, aiAssert);
        });  


});
