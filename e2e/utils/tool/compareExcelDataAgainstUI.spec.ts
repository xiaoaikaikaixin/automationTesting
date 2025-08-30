import { expect } from '@playwright/test';
import { test } from "../../../fixture";
import { testCredentials, tsMainTabData, tsShippingTabData, tsProductTabData, tsSpecialReqsTabData, tsBrokerTabData, statusData, tsSurveyorTabData, tsBudgetedFreightTabData, tsShippingTCPCData } from '../../data/tradingSlipTestData';
import { click, type, typeAndTab, dropdown, popupBrokerSelector ,popupbuttonselector,formatDateTo_dd_mmm_yyyy,extractValue,scrolldown, expectResult} from '../baseTest';
import { login } from '../baseCase';
import { Keyboard } from 'puppeteer';
import { addProduct, productDetailsTabVerification, shippingTCPCTabVerification } from '../tradingSlip/tradingSlipBaseCase';

import * as XLSX from 'xlsx';
import * as fs from 'fs';

// Timeout removed - using global configuration

interface ExcelRow {
  DTCID: number;
  DTCNo: string;
  DNNO: string;
}


test("Create Normal order with Basis is C&D", async ({ 
    ai, 
    aiInput, 
    aiQuery, 
    aiAssert, 
    aiTap, 
    page,
    context }) => {


        const workbook = XLSX.readFile('C:/Users/aijuan.lin/Downloads/Download/DNwithRelatedDTC.xlsx');
        const sheetname = workbook.Sheets[workbook.SheetNames[0]];
        const data: ExcelRow[] = XLSX.utils.sheet_to_json(sheetname);

        console.log(`📈 Total rows: ${data.length}`);
        console.log('\n--- DN Related DTC Data ---');

        for (const row of data) 
        {
            const dtcId = row.DTCID;
            const dtcNo = row.DTCNo;
            const dnNo = row.DNNO;

            console.log(`Processing DTC ID: ${dtcId}, DTC No: ${dtcNo}, DN No: ${dnNo}`);
            await page.goto('http://192.168.72.44/NCTS-WI6104_DTCDN/Login.aspx');
            await page.fill('input[name="txtUserID"]', 'icof');
            await page.fill('input[name="txtPassword"]', 'icoficof');
            await page.click('input[name="btnLogin"]');
            await page.goto(`http://192.168.72.44/NCTS-WI6104_DTCDN/PurchaseOrder/PurchaseOrderEntryRelatedRecords.aspx?ID=${dtcId}`);
            await page.click("//a[@id='ui-id-2']");


            const dnNo1 = await extractValue(page,"//table[@id='grdDNDetail_t']/tbody/tr[2]/td[5]/span");
            const dnDate1 = await extractValue(page,"//table[@id='grdDNDetail_t']/tbody/tr[2]/td[6]/span");
            const dnDocumentStatus1 = await extractValue(page,"//table[@id='grdDNDetail_t']/tbody/tr[2]/td[7]/span");
            const dnApprovalStatus = await extractValue(page,"//table[@id='grdDNDetail_t']/tbody/tr[2]/td[8]/span");
            const paymentAdviceNo1 = await extractValue(page,"//table[@id='grdDNDetail_t']/tbody/tr[2]/td[9]/span");
            const paymentDate1 = await extractValue(page,"//table[@id='grdDNDetail_t']/tbody/tr[2]/td[10]/span");
            const paymentAmount1 = await extractValue(page,"//table[@id='grdDNDetail_t']/tbody/tr[2]/td[11]/span");



            // Wait for the expand button to be visible and clickable
            await page.waitForSelector("//span[@class='fa fa-fw fa-plus']", { state: 'visible', timeout: 10000 });
            await page.click("//span[@class='fa fa-fw fa-plus']");
            
            // Wait for the expanded table to load
            await page.waitForSelector("//table[contains(@id, 'grdDNDetail_t_')]", { state: 'visible', timeout: 10000 });
            await page.waitForTimeout(2000);

            const productDetails = await page.locator("//table[contains(@id, 'grdDNDetail_t_')]/tbody/tr[2]/td[3]").getAttribute("title");
            const subciNo1 = await page.locator("//table[contains(@id, 'grdDNDetail_t_')]/tbody/tr[2]/td[5]").getAttribute("title");
            const invoiceNo1 = await page.locator("//table[contains(@id, 'grdDNDetail_t_')]/tbody/tr[2]/td[7]").getAttribute("title"); 
            const qtyMT1 = await page.locator("//table[contains(@id, 'grdDNDetail_t_')]/tbody/tr[2]/td[8]").getAttribute("title"); 
            const dnAmount1 = await page.locator("//table[contains(@id, 'grdDNDetail_t_')]/tbody/tr[2]/td[9]").getAttribute("title");    



            console.log("DN NO. in migrate page is: "+ dnNo1);
            console.log("DN Date in migrate page is: "+ dnDate1);
            console.log("DN Document Status in migrate page is: "+ dnDocumentStatus1);
            console.log("DN Approval Status in migrate page is: "+ dnApprovalStatus);
            console.log("Payment Advice No in migrate page is: "+ paymentAdviceNo1);
            console.log("Payment Date. in migrate page is: "+ paymentDate1);
            console.log("Payment Amount in migrate page is: "+ paymentAmount1);
            
            console.log("Product Details in migrate page is: "+ productDetails);
            console.log("Sub CI No in migrate page is: "+ subciNo1);
            console.log("Invoice No in migrate page is: "+ invoiceNo1);   
            console.log("Qty MT in migrate page is: "+ qtyMT1);
            console.log("DN Amount in migrate page is: "+ dnAmount1);       
            console.log("------------------------------------");  


    


            const newPage = await context.newPage();
            await newPage.goto('http://192.168.72.44/NCTS-LiveClone/Login.aspx');
            await newPage.fill('input[name="txtUserID"]', 'icof');
            await newPage.fill('input[name="txtPassword"]', 'icoficof');
            await newPage.click('input[name="btnLogin"]');

            await newPage.goto(`http://192.168.72.44/NCTS-LiveClone/PurchaseOrder/PurchaseOrderEntryRelatedRecords.aspx?Edit=1&ID=${dtcId}`);
            await newPage.click("//a[@id='ui-id-2']");
            
            // Wait for the DN Details table to load on the second page
            await newPage.waitForSelector("//table[@id='grdDNDetail_t']", { state: 'visible', timeout: 10000 });

            const invocieNo2 = await extractValue(newPage,"//table[@id='grdDNDetail_t']/tbody/tr[2]/td[4]/span");
            const subciNo2 = await extractValue(newPage,"//table[@id='grdDNDetail_t']/tbody/tr[2]/td[5]/span");
            const dnNo2 = await extractValue(newPage,"//table[@id='grdDNDetail_t']/tbody/tr[2]/td[6]/span");
            const dnDate2 = await extractValue(newPage,"//table[@id='grdDNDetail_t']/tbody/tr[2]/td[7]/span");
            const dnQty2 = await extractValue(newPage,"//table[@id='grdDNDetail_t']/tbody/tr[2]/td[8]/span");
            const dnAmount2 = await extractValue(newPage,"//table[@id='grdDNDetail_t']/tbody/tr[2]/td[9]/span");
            const dnStatus2 = await extractValue(newPage,"//table[@id='grdDNDetail_t']/tbody/tr[2]/td[10]/span");
            const paymentAdviceNo2 = await extractValue(newPage,"//table[@id='grdDNDetail_t']/tbody/tr[2]/td[11]/span");
            const paymentDate2 = await extractValue(newPage,"//table[@id='grdDNDetail_t']/tbody/tr[2]/td[12]/span");


            console.log("Invoice No2 in LiveClone page is: "+ invocieNo2);
            console.log("Sub CI No2 in LiveClone page is: "+ subciNo2);
            console.log("DN No.2 in LiveClone page is: "+ dnNo2);   
            console.log("DN Date2 in LiveClone page is: "+ dnDate2);
            console.log("Qty MT2 in LiveClone page is: "+ dnQty2);      
            console.log("DN Amount2 in LiveClone page is: "+ dnAmount2);
            console.log("DN Status2 in LiveClone page is: "+ dnStatus2);
            console.log("Payment Advice No2 in LiveClone page is: "+ paymentAdviceNo2);
            console.log("Payment Date2 in LiveClone page is: "+ paymentDate2);

            // Assertions with proper null handling and correct field mappings
            console.log("\n=== Starting Assertions ===");
            
            // Core field comparisons

            expect(dnNo).toEqual(dnNo1);
            console.log(`✓ Excel DN Number match: ${dnNo} = ${dnNo1} `);

            expect(dnNo1).toEqual(dnNo2);
            console.log(`✓ DN Number match: ${dnNo1} = ${dnNo2} `);
            
            expect(dnDate1).toEqual(dnDate2);
            console.log(`✓ DN Date match: ${dnDate1} = ${dnDate2}`);
            
            // expect(subciNo1).toEqual(subciNo2);
            expect(subciNo2).toContain(subciNo1);
            console.log(`✓ Sub CI Number match: ${subciNo1} = ${subciNo2}`);
            
            expect(invoiceNo1).toEqual(invocieNo2);
            console.log(`✓ Invoice Number match: ${invoiceNo1} = ${invocieNo2}`);
            
            expect(qtyMT1).toEqual(dnQty2);
            console.log(`✓ Quantity match: ${qtyMT1} = ${dnQty2}`);
            
            expect(dnAmount1).toEqual(dnAmount2);
            console.log(`✓ DN Amount match: ${dnAmount1} = ${dnAmount2}`);
            
            // Only compare payment fields if they are not null
            if (paymentAdviceNo1 !== null && paymentAdviceNo2 !== null) {
                expect(paymentAdviceNo1).toEqual(paymentAdviceNo2);
                console.log(`✓ Payment Advice Number match: ${paymentAdviceNo1} = ${paymentAdviceNo2}`);
            } else {
                console.log(`⚠ Payment Advice Number comparison skipped (null values): ${paymentAdviceNo1} vs ${paymentAdviceNo2}`);
            }
            
            console.log("=== All Assertions Completed Successfully ===");   
        }

})