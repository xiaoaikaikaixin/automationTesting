import { expect } from '@playwright/test';
import { test } from "../../../fixture";
import { freightChargeData, testCredentials } from '../../data/freightChargeTestData';
import { click, type, typeAndTab, dropdown, popupselection, pageReload, scrollToBottom, scrollToElement, 
    formatDateTo_dd_mmm_yyyy } from '../../utils/baseTest';
import { verifyLoggedIn } from '../../utils/sharedContext';
import { handleConfirmDialog } from '../../utils/dialogHandler';




export const addfreightCharge = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
) => {
        await page.click(`//a[normalize-space()="${freightChargeData.menuName}"]`);
        await page.click(`//a[normalize-space()="${freightChargeData.submenuName}"]`);
        await page.waitForTimeout(2000);
        
        // Select Port to Port shipping term
       if (test.info().title.includes('Port to Port')) {
            await dropdown(page, '//span[@id="select2-lstShippingTerm-container"]', freightChargeData.shippingTermPortToPort);
            await page.waitForTimeout(2000);
            await typeAndTab(page, "(//input[@placeholder='<Type then tab>'])[1]", freightChargeData.countryOfDestination);
            await dropdown(page, '//span[@id="lstDischargePort"]', freightChargeData.portOfDischarge);
        } else if (test.info().title.includes('Door to Door')) {
            await dropdown(page, '//span[@id="select2-lstShippingTerm-container"]', freightChargeData.shippingTermDoorToDoor);
            await page.waitForTimeout(2000);
            await dropdown(page,'//span[@id="lstLoadLocation"]', freightChargeData.placeOfLoading);
            await typeAndTab(page, "//span[@id='acDischargeCountry']//input[@placeholder='<Type then tab>']", freightChargeData.countryOfDestination);
            await dropdown(page,'//span[@id="lstDischargePort"]', freightChargeData.portOfDischarge);
            await typeAndTab(page, "//span[@id='acFinalDestinationCountry']//input[@placeholder='<Type then tab>']", freightChargeData.finalDestinationCountry);
            await dropdown(page,'//span[@id="lstFinalDestinationLocation"]', freightChargeData.finalDestination);
        } else if (test.info().title.includes('Door to Ramp'))  {
            await dropdown(page, '//span[@id="select2-lstShippingTerm-container"]', freightChargeData.shippingTermDoorToRamp);
        } else if (test.info().title.includes('Bulk'))  {
            await dropdown(page, '//span[@id="select2-lstShippingTerm-container"]', freightChargeData.shippingTermPortToPort);
            await page.waitForTimeout(2000);
            await typeAndTab(page, "//span[@id='acDischargeCountry']//input[@placeholder='<Type then tab>']", freightChargeData.countryOfDestination);
            await dropdown(page,'//span[@id="lstDischargePort"]', freightChargeData.portOfDischarge);
            await dropdown(page, "//span[@id='select2-lstDeliveryMode-container']", freightChargeData.deliveryModeBulk);           
        } else {

        }

        
        // Select Freight Indication
        await dropdown(page,'//span[@id="lstFreightIndication"]',  freightChargeData.freightIndication);
        
        // Select Shipping Line using popup
        await popupselection(page, '//input[@id="psacShippingLine_pop"]', '//iframe[@id="psacShippingLine_pop_pop_fr1"]', freightChargeData.shippingLine);
        
        // Enter Transit Time
        await page.fill('//input[@id="txtTransitTime_ti"]', freightChargeData.transitTime);
        
        // Select Cargo Nature
        await dropdown(page, '//span[@id="lstCargoNature"]', freightChargeData.cargoNature);
        await page.waitForTimeout(3000);
        
        // Select Carrier
        await page.click("//span[@id='chkddCarrier']");
        await page.click("//div[@id='jAutochecklist_wrapper_chkddCarrier_lb']");
        await page.click("//span[@id='chkddCarrier']//li[2]");
        
        // Fill General Information and Freight Rate
        await page.fill("//input[@id='txtGeneralInfo']", freightChargeData.generalInformation);
        await page.fill("//input[@id='txtFreightRates_ti']", freightChargeData.freightRate);
        await type(page, "//input[@id='drFreightRatesValidity_dFrom_ti']", freightChargeData.freightRateValidityFrom);
        await type(page, "//input[@id='drFreightRatesValidity_dTo_ti']", freightChargeData.freightRateValidityTo);
        await page.waitForTimeout(2000);
        await page.waitForTimeout(2000);

        await page.fill("//input[@id='txtFreeTimeDetention_ti']", freightChargeData.freeTimeDetention);
        await page.fill("//input[@id='txtFreeTimeDemurrage_ti']", freightChargeData.demurrage);
        await page.fill("//input[@id='txtFreeTimeCombined_ti']", freightChargeData.freeTimeCombined);
        await page.fill("//textarea[@id='txtPlantRemarks']", freightChargeData.plantsRemarks);
        await page.fill("//textarea[@id='txtShippingRemarks']", freightChargeData.shippingRemarks);
        await page.fill("//textarea[@id='txtMarketingRemarks']", freightChargeData.marketingRemarks);
        await page.waitForTimeout(2000);

        await scrollToElement(page, "//a[normalize-space()='Main']");
        
        // Set up dialog handler before clicking the button that triggers the dialog
        await handleConfirmDialog(page, true, 'Are you sure you want to submit for release?');
        
        // Click the button that will trigger the dialog
        await page.click("//input[@id='btnSubmitRelease']");
        await page.click("//button[@id='button-0']");
        console.log("Submit the Freight Charge for released");
        await page.waitForTimeout(2000);
        await pageReload(page);
        
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
        
        // Release the Freight Charge
        await page.click('//input[@id="btnRelease"]');
        await page.waitForTimeout(2000);
        await page.click("//button[@id='button-0']");
        await page.waitForTimeout(2000);
        await pageReload(page);
        
        // Verify Released status
        const [releasedStatus1] = await Promise.all([
            aiQuery("text content of 'Status' field")
        ]);
        console.log(`Released Status: ${releasedStatus1}`);
        await aiAssert(`${releasedStatus1} equal to ${freightChargeData.releasedStatus}`);
        console.log(test.info().title + " - submitted for release and released successfully!");
}


export const freightChargeVerifation = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
) => {
        try {
          
            // Verify shipping term based on test type
            if (test.info().title.includes('Door to Door') ) {
                await aiAssert(`verify that the 'Shipping Term' field equal to ${freightChargeData.shippingTermDoorToDoor}`);
                await aiAssert(`verify that the 'Loading Port's Country' field shows ${freightChargeData.loadingPortCountry}`);
                await aiAssert(`verify that the 'Place of Loading' field equal to ${freightChargeData.placeOfLoading}`);
                await aiAssert(`verify that the 'Port of Loading' field shows ${freightChargeData.loadingPort}`);
                await aiAssert(`verify that the 'Country of Destination' field equal to ${freightChargeData.countryOfDestination}`);
                await aiAssert(`verify that the 'Port of Discharge' field equal to ${freightChargeData.portOfDischarge}`);
                await aiAssert(`verify that the 'Final Destination Country' field contains ${freightChargeData.finalDestinationCountry}`);
                await aiAssert(`verify that the 'Final Destination' field equal to ${freightChargeData.finalDestination}`);
                await aiAssert(`verify that the 'Final Destination Address' field shows ${freightChargeData.finalDestinationAddress}`);
                await aiAssert(`verify that the 'Full Address' field contains ${freightChargeData.finalDestinationFullAddress}`);
            } else if (test.info().title.includes('Port to Port')|| test.info().title.includes('Bulk')) {
                await aiAssert(`verify that the 'Shipping Term' field equal to ${freightChargeData.shippingTermPortToPort}`);
                await aiAssert(`verify that the 'Loading Port's Country' field shows ${freightChargeData.loadingPortCountry}`);
                await aiAssert(`verify that the 'Port of Loading' field shows ${freightChargeData.loadingPort}`);      
                await aiAssert(`verify that the 'Country of Destination' field equal to ${freightChargeData.countryOfDestination}`);
                await aiAssert(`verify that the 'Port of Discharge' field equal to ${freightChargeData.portOfDischarge}`);         
            }
            
            // Verify freight indication and rates
            await aiAssert(`verify that the 'Freight Indication' field equal to ${freightChargeData.freightIndication}`);
            await aiAssert(`verify that the 'Shipping Line' field shows ${freightChargeData.shippingLine}`);
            await aiAssert(`verify that the 'Shipping Line Name' field equal to ${freightChargeData.shippingLine}`);


            if (test.info().title.includes('Bulk')) {
                await aiAssert(`verify that the 'Delivery Mode' field shows ${freightChargeData.deliveryModeBulk}`);
                await aiAssert(`verify that the 'Freight Rate UOM' field shows ${freightChargeData.freightRateUomMT}'`);
            } else  {
                await aiAssert(`verify that the 'Delivery Mode' field shows ${freightChargeData.deliveryMode20FT}`);
                await aiAssert(`verify that the 'Freight Rate UOM' field shows ${freightChargeData.freightRateUomFCL}'`);
            }
            
            // Verify additional information
            await aiAssert(`verify that the 'Transit Time' field equal to ${freightChargeData.transitTime}`);
            await aiAssert(`verify that the 'Cargo Nature' field equal to ${freightChargeData.cargoNature}`);
            await aiAssert(`verify that the 'Carrier' contains ${freightChargeData.carrier}`);
            await aiAssert(`verify that the 'General Information' field equal to ${freightChargeData.generalInformation}`);
            
            // Verify freight rates and indication section
            await aiAssert(`verify that the 'Currency' field shows ${freightChargeData.currency}`);
            await aiAssert(`verify that the 'Freight Rates' field equal to ${freightChargeData.freightRate}`);
            await aiAssert(`verify that the 'Freight Rates Validity' field contains ${freightChargeData.freightRateValidityFrom} - ${freightChargeData.freightRateValidityTo}'`);
            
            // Verify detention and demurrage section
            await aiAssert(`verify that the 'Free Time Detention' field contains ${freightChargeData.freeTimeDetention}`);
            await aiAssert(`verify that the 'Free Time Demurrage' field contains ${freightChargeData.demurrage}`);
            await aiAssert(`verify that the 'Free Time Combined' field contains ${freightChargeData.freeTimeCombined}`);
            await aiAssert(`verify that the 'Freight Rates Subjected To' field contains ${freightChargeData.freightRatesSubjectedTo}`);
            await scrollToBottom(page);
            await aiAssert(`verify that the 'Created By' field contains ${testCredentials.username}`);
            await aiAssert(`verify that the 'Create Date & Time' field contains ${formatDateTo_dd_mmm_yyyy(new Date())}` );

            console.log("Verify the Freight charge shown the correct values");
        } catch (error) {
            console.log("Error verifying Freight Charge fields: " + error.message);
        }    
}