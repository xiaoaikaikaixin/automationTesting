import { expect } from '@playwright/test';
import { test } from "../../../fixture";
import { testCredentials, tsMainTabData, tsShippingTabData, tsProductTabData, tsSpecialReqsTabData, tsBrokerTabData, statusData, tsSurveyorTabData, tsBudgetedFreightTabData, tsShippingTCPCData } from '../../data/tradingSlipTestData';
import { click, type, typeAndTab, dropdown, popupBrokerSelector ,popupbuttonselector,formatDateTo_dd_mmm_yyyy,extractValue,scrolldown, expectResult, uploadFile, editViewButton} from '../../utils/baseTest';
import { login } from '../../utils/baseCase';
import { Keyboard } from 'puppeteer';
import { addProduct, brokerTabVerification, emailHistoryTabVerificationForApproved, mainTabVerification, productDetailsTabVerification, shippingTabVerification, shippingTCPCTabVerification, specialReqsTabVerification, surveyorTabVerification } from '../../utils/tradingSlip/tradingSlipBaseCase';
import { scCreateNormalOrderWithBasisCD } from '../salesContract/SC-01-CreateNormalOrderWithBasisCD.spec';
import { ciTestData } from '../../data/contractInstructionTestData';
import { ciAttachmentTabVerification, ciDispatched, ciDocumentRequirementTabVerification, ciEmailTabVerification, ciMainTabVerification, ciProductDetailsTabVerification, ciShippingTabVerification, ciSpecialReqsTabVerification, ciSurveyorTabVerification } from '../../utils/contractInstruction/contractInstructionBaseCase';
import { scNo, subCICreateSubContractInstruction } from '../subContractInstruction/SubCI-01-CreateSubCI.spec';
import { freightBookingCreationAndBooked } from '../freightBooking/FB-01-CreateFreightBookingWithBasisCD.spec';
import { subCITestData } from '../../data/subContractInstructionTestData';
import { OpsysSendSupplierInvoice } from '../../utils/tool/toolSendSupplierInvoice';
import { OpsysSendMMSCtoNCTSforPO } from '../../utils/tool/toolSendMMSCNo';
import { poCreateNormalOrderWithBasisCD } from '../purchaseOrder/PO-01-CreateNormalOrderWithBasisCD.spec';
import { invoiceCreateNormalOrderWithBasisCD } from '../invoice/IN-01-createDropShipmentInv.spec';

// Timeout removed - using global configuration


test.describe.serial('Trading Slip Tests', () => {
    let sharedData: {
        tsNo?: string;
        scNo?: string;
        ciNo?: string;
        subciNo?: string;
        subciID?: string;
        poNo?: string;
        poID?: string;
        fbNo?: string;
        scUrl? : string;
        poUrl?: string;
        ciUrl? : string;
        subCIUrl? : string;
        invoiceUrl?: string;
        supplierInvoiceNo?: string;
        shippingDocumentDes?: string;
        issuedBy?: string;
        noOfOriginals?: string;

        // Add other fields as needed
    } = {};



    test("Invoice - Create Normal order with Basis is C&D", async ({ 
        ai, 
        aiInput, 
        aiQuery, 
        aiAssert, 
        aiTap, 
        page,
        context }) => {
            test.info().title = 'Invoice - Create Normal order with Basis is C&D';

            await page.goto("http://192.168.72.44/NCTS-SIT/Invoice/InvoiceEntryMain.aspx?Edit=1&ID=81859");
            sharedData.invoiceUrl = await page.url();

           
        }); 

        test("Payment - Create Normal order with Basis is C&D", async ({ 
            ai, 
            aiInput, 
            aiQuery, 
            aiAssert, 
            aiTap, 
            page,
            context }) => {
                test.info().title = 'Invoice - Create Normal order with Basis is C&D';

                await page.goto(`${sharedData.invoiceUrl}`);
                const [invNo] = await Promise.all([aiQuery("text content of 'Invoice No.' field")]);
                await editViewButton(page);
                await page.click("//input[@id='btnCreatePackingList']");
                await page.waitForTimeout(3000);
                try{
                    await expectResult(page,"//span[@id='lblPageTitle']","New Record")
                    console.log("Packaging list creation page display successfully!");
                }catch(error){
                    console.log("Error: " + error);
                }
                await dropdown(page, "//span[@id='lstBaseUom']", "2");
                await page.click("//input[@id='btnSave']");
                await page.waitForTimeout(3000);       

            });

/*
    test("Payment - Create Normal order with Basis is C&D", async ({ 
        ai, 
        aiInput, 
        aiQuery, 
        aiAssert, 
        aiTap, 
        page,
        context }) => {
            test.info().title = 'Invoice - Create Normal order with Basis is C&D';

            await page.goto(`${sharedData.invoiceUrl}`);
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
            
           
        }); 


    test("CI - Create Normal order with Basis is C&D", async ({ 
        ai, 
        aiInput, 
        aiQuery, 
        aiAssert, 
        aiTap, 
        page,
        context }) => {
            await login(page);

            await page.goto(`http://192.168.72.44/NCTS-WI8400_CSP/TradingSlip/TradingSlipEntryMain.aspx?Type=CONTRACT_INSTRUCTION&ID=63040`);
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

            console.log(test.info().title + " successfully.");
           
        }); 
*/
});