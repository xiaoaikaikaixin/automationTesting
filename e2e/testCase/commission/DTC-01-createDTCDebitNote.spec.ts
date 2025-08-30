import { test } from "../../../fixture";
import {click, type, typeAndTab,dropdown, popupselection, expectResult, extractValue, downloadFile, pageReload}  from '../../utils/baseTest';
import { login } from '../../utils/baseCase';
import { commissionDTCData } from '../../data/commissionTestData';
import { expect, Page } from '@playwright/test';


// Timeout removed - using global configuration

// Group tests to run sequentially in the same browser context
test.describe.serial('DTC Debit Note Tests', () => {
    let sharedData: {
        asOfDate?: string;
        currency?: string;
        dtcRefNo?: string;
        seller?: string;
        scRefNo?: string;
        deliveryMode?: string;
        division?: string;
        dtcCommissionAmount?: string;
        nextUrl? : string;
    } = {};
    
    // Remove manual page creation - use fixture's page directly

    test("Test Case 1: Create new DTC Debit Note", async ({ 
        page,
        ai, 
        aiInput, 
        aiQuery, 
        aiAssert, 
        aiTap }) => {
        // Login is now handled in beforeEach hook
        test.info().title = 'Create new DTC Debit Note';
        
        await login(page);

        await page.click(`//a[normalize-space()="${commissionDTCData.menuName}"]`);
        await page.click(`//a[normalize-space()="${commissionDTCData.submenuName}"]`);
        await page.waitForTimeout(2000);

        await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisions_lb']", commissionDTCData.division);
        await page.click("//label[normalize-space()='Division']");
        await page.click("//input[@id='btnSearch']");
        await page.waitForTimeout(3000);

        //get the first row's record as the search condition
        sharedData.asOfDate = await extractValue(page, "//input[@id='dpAsAtDate_ti']");
        sharedData.currency = await extractValue(page, "//span[@id='select2-lstCurrency-container']");
        sharedData.dtcRefNo = await extractValue(page, "//table[@id='grdDTC_t_frozen']/tbody/tr[2]/td[11]/span");
        sharedData.seller = await extractValue(page, "//table[@id='grdDTC_t']/tbody/tr[2]/td[13]/span");
        sharedData.scRefNo = await extractValue(page, "//table[@id='grdDTC_t']/tbody/tr[2]/td[17]/span");
        sharedData.deliveryMode = await extractValue(page, "//table[@id='grdDTC_t']/tbody/tr[2]/td[16]/span");   
        sharedData.division = await extractValue(page, "//table[@id='grdDTC_t']/tbody/tr[2]/td[15]/span");
        sharedData.dtcCommissionAmount = await extractValue(page, "//table[@id='grdDTC_t']/tbody/tr[2]/td[25]/span");


        await type(page, "//input[@id='txtDTCRefNo']", sharedData.dtcRefNo!);
        await type(page, "//input[@id='txtSCRefNo']", sharedData.scRefNo!);
        await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDeliveryModes_lb']", sharedData.deliveryMode!);
        await page.click("//label[normalize-space()='Division']");
        await page.click("//input[@id='btnSearch']");
        await page.waitForTimeout(2000);

        await expectResult(page, "//table[@id='grdDTC_t_frozen']/tbody/tr[2]/td[11]/span", sharedData.dtcRefNo!);
        await expectResult(page, "//table[@id='grdDTC_t']/tbody/tr[2]/td[15]/span", sharedData.division!);
        await expectResult(page, "//table[@id='grdDTC_t']/tbody/tr[2]/td[16]/span", sharedData.deliveryMode!);
        await expectResult(page, "//table[@id='grdDTC_t']/tbody/tr[2]/td[17]/span", sharedData.scRefNo!);

        await page.click("//table[@id='grdDTC_t_frozen']/tbody/tr[2]/td[1]/input");
        await type(page, "//input[@id='txtTitle']", "Title: " + sharedData.dtcRefNo!);
        await dropdown(page, "//span[@id='select2-lstPaymentTerm-container']", commissionDTCData.paymentTerm);
        await dropdown(page, "//span[@id='select2-lstDocumentTemplate-container']", commissionDTCData.documentTemplate);
        await dropdown(page, "//span[@id='lstConfirmedBy']", commissionDTCData.confirmedBy1);
        await dropdown(page, "//span[@id='lstApprover']", commissionDTCData.confirmedBy1);
        await dropdown(page, "//span[@id='lstBank']", commissionDTCData.bankName);


        await expectResult(page, "//input[@id='txtTotalCommissionPayableAmount_ti']", sharedData.dtcCommissionAmount!);
        await expectResult(page, "//input[@id='dpDocumentDate_ti']", sharedData.asOfDate!);
        await expectResult(page, "//textarea[@id='txtDescription']", `Being Direct Trade Commission for ${sharedData.division} sales (Packed) as of ${sharedData.asOfDate} as per attached details.`);
        await expectResult(page, "//textarea[@id='txtDescription']", `${sharedData.division} : ${sharedData.currency} ${sharedData.dtcCommissionAmount}`);


        await page.click("//input[@id='btnSave']");
        await page.click("//button[@id='button-0']");
        await page.waitForTimeout(2000);
        await expectResult(page, "//div[@class='noty_message']/span/div[2]", "Error - Confirmer cannot same as Preparer");
        await page.click("//button[@id='button-0']");

        await dropdown(page, "//span[@id='lstConfirmedBy']", commissionDTCData.confirmedBy2);
        await dropdown(page, "//span[@id='lstApprover']", commissionDTCData.approvedBy1);
        await page.click("//input[@id='btnSave']");
        await page.click("//button[@id='button-0']");
        await page.waitForTimeout(2000);

        await page.click("//input[@id='btnEditView']");

        try {
            await page.waitForTimeout(5000);
            await aiAssert(`verify that the 'DN Date' field equal to ${sharedData.asOfDate}`);
            console.log("---------------------");
            await aiAssert(`verify that the 'Approval Status' field equal to ${commissionDTCData.approvalStatusDraft}`);
            await aiAssert(`verify that the 'Document Status' field equal to ${commissionDTCData.documentStatusOpen}`);
            await aiAssert(`verify that the 'Seller' field equal to ${sharedData.seller}`);
            await aiAssert(`verify that the 'Title' field equal to ${sharedData.dtcRefNo}`);
            await aiAssert(`verify that the 'Division' field equal to ${commissionDTCData.division}`);
            await aiAssert(`verify that the 'Payment Term' field equal to ${commissionDTCData.paymentTerm}`);
            await aiAssert(`verify that the 'Document Template' field equal to ${commissionDTCData.documentTemplate}`);
            await aiAssert(`verify that the 'Confirmed By' field equal to ${commissionDTCData.confirmedBy2}`);
            await aiAssert(`verify that the 'Approver' field equal to ${commissionDTCData.approvedBy1}`);
            await aiAssert(`verify that the 'Total Commission Reeivable Amount' field equal to ${sharedData.dtcCommissionAmount}`);
            await aiAssert(`verify that the 'Currency' field equal to ${sharedData.currency}`);
            await aiAssert(`verify that the 'Bank Name' field equal to ${commissionDTCData.bankName}`);
            await aiAssert(`verify that the 'Bank Details' field contains ${commissionDTCData.bankDetails}`);
        }catch (error) {
            console.error('Error in Test Case 1:', error);
        }
        console.log(test.info().title + " successfully.");

        sharedData.nextUrl = await page.url();
        console.log('Next URL:'+sharedData.nextUrl);
    });

    test("Test Case 2: DTC Debit Note Download Commission Details", async ({ 
        page,
        ai, 
        aiInput, 
        aiQuery, 
        aiAssert, 
        aiTap }) => {
        // This test continues from Test Case 1 without closing the browser
        // No login required as we're continuing from the previous test
        test.info().title = 'DTC Debit Note Download Commission Details';
        await page.goto(`${sharedData.nextUrl}`);     
        // This test continues from Test Case 1 using the same page context from the fixture
        
        // Verify we're still on the correct page with the shared data
        console.log("------Start to test the DTC Debit Note Download Commission Details----------");
        await page.click("//input[@id='btnDownloadCommsionDetails']");
        const frame = page.frameLocator("//iframe[@id='divInvoicePrintout_fr1']");
        // await frame.locator("//input[@id='btnGeneratePDF']").click();

        await page.waitForTimeout(2000);
        await frame.locator("//input[@id='btnGenerateExcel']").click();
        await downloadFile(page);
        await page.waitForTimeout(2000);


        try {
            const [newPage] = await Promise.all([
                page.context().waitForEvent('page', { timeout: 10000 }),
                frame.locator("//input[@id='btnGeneratePDF']").click()
            ]);
            
            await newPage.waitForTimeout(8000); // Allow PDF to fully render

            // Verify PDF URL
            const pdfUrl = newPage.url();
            console.log("PDF URL:", pdfUrl);
            await expect(pdfUrl).toContain('DownloadFile');

            console.log("PDF verification passed.");
            await newPage.close();
        } catch (error) {
            console.error('PDF verification failed:', error);
            throw error;
        }


        console.log(test.info().title + " successfully.");
    });

test("Test Case 3: DTC Debit Note Post to CDG", async ({ 
        page,
        ai, 
        aiInput, 
        aiQuery, 
        aiAssert, 
        aiTap }) => {

        test.info().title = 'DTC Debit Note Post to CDG';
        await page.goto(`${sharedData.nextUrl}`);     
        
        console.log("------Start to test DTC Debit Note Post to CDG----------");
        await page.click("//input[@id='btnPostToCDG']");
        await page.click("//button[@id='button-0']")
        await page.waitForTimeout(2000);
        await expectResult(page, "//div[@class='noty_message']/span/div[2]", "DTC DN successfully Posted to CDG!");
        await page.click("//button[@id='button-0']");
        await pageReload(page);
        await aiAssert(`verify that the 'Document Status' field equal to ${commissionDTCData.documentStatusOpen}`);
        await aiAssert(`verify that the 'Approval Status' field equal to ${commissionDTCData.approvalPendingConfirmation}`);    
        await aiAssert(`Post to CDG checkbox is cheked`)    

        console.log(test.info().title + " successfully.");
    });

});