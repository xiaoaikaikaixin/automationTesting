import { addOneMonth, dropdown, editViewButton, elementIsExists, expectResult, extractValue, okButton, type, typeAndTab } from "../baseTest";
import { fbTestData } from "../../data/freightBookingTestData";
import { tsMainTabData, tsProductTabData, tsShippingTabData } from "../../data/tradingSlipTestData";
import { expect } from "@playwright/test";

let sharedFreightValidityTo: string = '';
let freightChargeNo: string = '';
let shippingLine: string = '';
let freightRate: string = '';
let fbRefNo: string = '';


export const fbCreation = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        await page.click("//input[@id='btnCreateFreightBooking']");
        await page.waitForTimeout(3000);
        await expectResult(page,"//span[@id='lblPageTitle']", "Freight Booking - New Record");
        sharedFreightValidityTo = await extractValue(page,"//input[@id='drFreightValidity_dTo_ti']");
        await page.click("//input[@id='btnSave']");
        await page.waitForTimeout(3000);

        try{    
            const [status] = await Promise.all([
            aiQuery("text content of the 'Status' field")
         ]);
            await aiAssert(`verify that the Freight Booking 'Status' field contains 'Not Nominated'`);
            console.log("Freight Booking created status: " + status);
        }catch (error) {
            console.log("Freight Booking created failed:  " + error.message);
        }
}

export const fbLookupFreightCharges = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        await page.click("//input[@id='btnLookupFreightCharges']");
        freightChargeNo = await extractValue(page, "//table[@id='grdFBFreightCharge_t_frozen']/tbody/tr[2]/td[3]/span");
        shippingLine = await extractValue(page, "//table[@id='grdFBFreightCharge_t']/tbody/tr[2]/td[4]/span");       
        freightRate = await extractValue(page, "//table[@id='grdFBFreightCharge_t']/tbody/tr[2]/td[5]/span/div[1]");      
        
        await page.click("//table[@id='grdFBFreightCharge_t_frozen']/tbody/tr[2]/td[1]/span/input");
        await page.click("//button[@id='button-0']");
        await page.click("//button[@id='button-0']");
        await page.waitForTimeout(3000);

        
        try{    
            await expectResult(page,"//a[@id='lnkFreightChargeNo']", freightChargeNo);
            await aiAssert(`verify that the 'Budgeted Freight Cost' field contains ${freightRate}`)
            console.log("Freight Booking attached freight charge number and cost: " + freightChargeNo + " - " + freightRate);
        }catch (error) {
            console.log("Freight Booking attached Freight Charge Number and Cost failed:  " + error.message);
        }
}


export const fbFillInShipmentInformation = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        await page.click("//a[normalize-space()='Shipment']");
        await editViewButton(page);
        const extraOneMonth = await addOneMonth(sharedFreightValidityTo);
        await type(page, "//input[@id='dpETDLoadingPort_ti']", sharedFreightValidityTo);
        await type(page, "//input[@id='dpClosingDate_ti']", sharedFreightValidityTo);
        await type(page, "//input[@id='dpETADischargePort_ti']", extraOneMonth);
        await page.click("//span[@id='lstCarrier']");
        await type(page, "//input[@id='dpETAFinalDestination_ti']", extraOneMonth);
        await page.click("//span[@id='lstCarrier']");
        
        await dropdown(page, "//span[@id='lstLoadingPortVesselAirline']", fbTestData.loadingPortVesselAirline);
        await type(page, "//input[@id='txtVoyageFreightNo']", fbTestData.voyageNoFlightNo);
        
        await type(page, "//input[@id='dpETDContPort1_ti']", sharedFreightValidityTo);      
        await page.click("//span[@id='lstCarrier']");
        await dropdown(page, "//span[@id='lstContPortVesselAirline1']", fbTestData.firstConnectingPortVesselAirline);
        await type(page, "//input[@id='txtContPortVoyageNo1']", fbTestData.firstConnectingVoyageNoFlightNo);
        
        // Fill in 2nd connecting port information
        await type(page, "//input[@id='dpETDContPort2_ti']", sharedFreightValidityTo);
        await page.click("//span[@id='lstCarrier']");        
        await dropdown(page, "//span[@id='lstContPortVesselAirline2']", fbTestData.secondConnectingPortVesselAirline);
        await type(page, "//input[@id='txtContPortVoyageNo2']", fbTestData.secondConnectingVoyageNoFlightNo);
        
        // Fill in 3rd connecting port information
        await type(page, "//input[@id='dpETDContPort3_ti']", sharedFreightValidityTo);
        await page.click("//span[@id='lstCarrier']");   
        await dropdown(page, "//span[@id='lstContPortVesselAirline3']", fbTestData.thirdConnectingPortVesselAirline);
        await type(page, "//input[@id='txtContPortVoyageNo3']", fbTestData.thirdConnectingVoyageNoFlightNo);
        
        // Fill in transhipment information
        await typeAndTab(page, "(//span[@id='acTranshipmentPortCountry1']//input)[1]", fbTestData.transhipmentPort1Country);
        await dropdown(page, "//span[@id='lstTranshipmentPort1']", fbTestData.transhipmentPort1);
        await typeAndTab(page, "(//span[@id='acTranshipmentPortCountry2']//input)[1]", fbTestData.transhipmentPort2Country);
        await dropdown(page, "//span[@id='lstTranshipmentPort2']", fbTestData.transhipmentPort2);
        await typeAndTab(page, "(//span[@id='acTranshipmentPortCountry3']//input)[1]", fbTestData.transhipmentPort3Country);
        await dropdown(page, "//span[@id='lstTranshipmentPort3']", fbTestData.transhipmentPort3);
        
        // Fill in carrier information
        await dropdown(page, "//span[@id='lstCarrier']", fbTestData.carrier);
        
        // Save the shipment information
        // await page.click("//input[@id='btnSave']");
        await page.waitForTimeout(3000);
        
        try {
            await aiAssert(`verify that the shipment information is filled successfully`);
            console.log("Freight Booking shipment information filled successfully");
        } catch (error) {
            console.log("Failed to fill in Freight Booking shipment information: " + error.message);
        }
}


export const fbNominatedVerifiedAppproved = async (
    page: any,
    ai,
    aiQuery,
    aiAssert,
    subciNo
 ) => {
        await page.click("//a[normalize-space()='Main']");
        await editViewButton(page);
        await page.click("//input[@id='btnNominate']");
        await page.waitForTimeout(3000);
        await okButton(page);
        if(await elementIsExists(page,"//iframe[@id='divReason_fr1']"))
        {
            const frame = page.frameLocator("//iframe[@id='divReason_fr1']");
            await frame.locator("//textarea[@id='txtReason']").fill(fbTestData.reason);
        }
        await page.reload();
        const [nominatedStatus] = await Promise.all([
            aiQuery("text content of 'Status' field")
        ]);
        console.log("Freight Booking Nominated Status: ", nominatedStatus);           
        try{    
            await aiAssert(`verify that the 'Status' field contains ${fbTestData.nominatedStatus}`);
            console.log("Freight Booking nominated successfully ");
        }catch (error) {
            console.log("Freight Booking nomination failed:  " + error.message);
        }
        await page.click("//input[@id='btnSaveAndSubmit']");
        await okButton(page);
        if(await elementIsExists(page,"//iframe[@id='divReason_fr1']"))
        {
            const frame = page.frameLocator("//iframe[@id='divReason_fr1']");
            await frame.locator("//textarea[@id='txtReason']").fill(fbTestData.reason);
        }      
        await page.reload();        
         try{    
            await aiAssert(`verify that the 'Status' field contains ${fbTestData.bookedStatus}`);
            console.log("Freight Booking booked successfully ");
        }catch (error) {
            console.log("Freight Booking booked failed:  " + error.message);
        }         

       const [fbRefNo] = await Promise.all([
            aiQuery("text content of 'Freight Booking - ' field")
        ]);
        console.log("Freight Booking Ref No: ", fbRefNo);   
        // await page.click("//a[@id='lnkSubContractInstructionNo']");
        // const page1 = await page.context().newPage();
        try{    
            await expectResult(page, "//a[@id='lnkSubContractInstructionNo']", subciNo);
            console.log("Freight Booking Ref No verification successful ");
        }catch (error) {
            console.log("Freight Booking Ref No verification failed:  " + error.message);
        } 
        
}


export const fbMainTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert,

 ) => {
        await page.click("//a[normalize-space()='Main']");
        
        try{    
            await aiAssert(`verify that the 'Division' field contains ${tsMainTabData.division}`);
            await aiAssert(`verify that the 'Seller' field contains ${tsMainTabData.seller}`);
            await aiAssert(`verify that the 'Factory Location' field contains ${tsMainTabData.factoryLocation}`);
            await aiAssert(`verify that the 'Net Weight (MT)' field contains ${tsProductTabData.quantity}`);
            await aiAssert(`verify that the 'Gross Weight (MT)' field contains ${tsProductTabData.quantity}`);
            await aiAssert(`verify that the 'Net Weight (CBM)' field equal to '0.000'`);
            await aiAssert(`verify that the 'GMinimum Net Weight (CBM)' field equal to '0.000'`);

            await aiAssert(`verify that the 'Shipping Term' field contains ${tsShippingTabData.shippingTermPtP}`);
            await aiAssert(`verify that the 'Country of Origin' field contains ${tsShippingTabData.loadingPortCountry}`);
            await aiAssert(`verify that the 'Loading Port' field contains ${tsShippingTabData.loadingPort}`);
            await aiAssert(`verify that the 'Discharge Port's Country' field contains ${tsShippingTabData.dischargePortCountry}`);
            await aiAssert(`verify that the 'Port of Discharge' field contains ${tsShippingTabData.portOfDischarge}`);
            await aiAssert(`verify that the 'Basis' field contains ${tsMainTabData.basisforCD}`);            
            await aiAssert(`verify that the 'Delivery Mode' field contains ${tsShippingTabData.deliveryMode}`);
            await aiAssert(`verify that the 'Cargo Nature' field contains ${tsShippingTabData.cargoNature}`);
            await aiAssert(`verify that the 'Budgeted Freight Cost' field contains ${tsShippingTabData.budgetedFreightCost}`);
            await aiAssert(`verify that the 'Freight Charge Ref. No.' field contains ${freightChargeNo}`);            

            console.log("Freight Booking Main tab verification successfully ");
        }catch (error) {
            console.log("Freight Booking Main tab verification failed:  " + error.message);
        }
}

export const fbBookingTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        await page.click("//a[normalize-space()='Booking']");
        
        try{    
            await aiAssert(`verify that the 'Status' field contains ${fbTestData.bookedStatus}`);
            await aiAssert(`verify that the 'FB Confirmation Ref No.' field equal to ${fbRefNo}`);
            await aiAssert(`verify that the 'No. of Units' field equal to ${tsShippingTabData.totalUnits}`);
            await aiAssert(`verify that the 'Booking Delivery Mode' field contains ${tsShippingTabData.deliveryMode}`);
            await aiAssert(`verify that the 'Currency' field contains ${tsMainTabData.currency}`);
            await aiAssert(`verify that the 'Freight Cost UOM' field contains ${tsShippingTabData.freightRateMT}`);
            await aiAssert(`verify that the 'Shipping Line' field contains ${shippingLine}`);                                  
            console.log("Freight Booking Booking tab verification successfully ");
        }catch (error) {
            console.log("Freight Booking Booking tab verification failed:  " + error.message);
        }
}

export const fbShipmentTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        await page.click("//a[normalize-space()='Shipment']");
        
        try{    
            // Freight rates and fee information
            await aiAssert(`verify that the 'Freight Rates' field contains '${freightRate}'`);
            await aiAssert(`verify that the 'Freight Rates Subjected To' field contains ${fbTestData.freightRateSubjectedTo}`);
            //        const extraOneMonth = await addOneMonth(sharedFreightValidityTo);
            // Date fields
            await aiAssert(`verify that the 'Cut-Off-Date' field equal to '${sharedFreightValidityTo}' - 10 days`);
            await aiAssert(`verify that the 'Closing Date' field equal to '${sharedFreightValidityTo}'`);
            await aiAssert(`verify that the 'ETD Port of Loading' field equal to '${sharedFreightValidityTo}'`);
            await aiAssert(`verify that the 'ETD 1st Cont. Port' field equal to '${sharedFreightValidityTo}'`);
            await aiAssert(`verify that the 'ETD 2nd Cont. Port' field equal to '${sharedFreightValidityTo}'`);
            await aiAssert(`verify that the 'ETD 3rd Cont. Port' field equal to '${sharedFreightValidityTo}'`);
            await aiAssert(`verify that the 'ETA Discharge Port' field equal to ${addOneMonth(sharedFreightValidityTo)}`);
            await aiAssert(`verify that the 'ETA Final Destination' field equal to ${addOneMonth(sharedFreightValidityTo)}`);
            
            // Vessel/Airline information and voyage/flight numbers
            await aiAssert(`verify that the 'Port of Loading Vessel/Airline' field contains '${fbTestData.loadingPortVesselAirline}'`);
            await aiAssert(`verify that the 'Voyage No./Flight No.' field contains '${fbTestData.voyageNoFlightNo}'`);
            await aiAssert(`verify that the '1st Connecting Port Vessel/Airline' field contains '${fbTestData.firstConnectingPortVesselAirline}'`);
            await aiAssert(`verify that the '1st Connecting Voyage No/Flight No.' field contains '${fbTestData.firstConnectingVoyageNoFlightNo}'`);
            await aiAssert(`verify that the '2nd Connecting Port Vessel/Airline' field contains '${fbTestData.secondConnectingPortVesselAirline}'`);
            await aiAssert(`verify that the '2nd Connecting Voyage No/Flight No.' field contains '${fbTestData.secondConnectingVoyageNoFlightNo}'`);
            await aiAssert(`verify that the '3rd Connecting Port Vessel/Airline' field contains '${fbTestData.thirdConnectingPortVesselAirline}'`);
            await aiAssert(`verify that the '3rd Connecting Voyage No/Flight No.' field contains '${fbTestData.thirdConnectingVoyageNoFlightNo}'`);
            
            // Transhipment port information
            await aiAssert(`verify that the 'Transhipment Port 1 Country' field contains '${fbTestData.transhipmentPort1Country}'`);
            await aiAssert(`verify that the 'Transhipment Port 1' field contains '${fbTestData.transhipmentPort1}'`);
            await aiAssert(`verify that the 'Transhipment Port 2 Country' field contains '${fbTestData.transhipmentPort2Country}'`);
            await aiAssert(`verify that the 'Transhipment Port 2' field contains '${fbTestData.transhipmentPort2}'`);
            await aiAssert(`verify that the 'Transhipment Port 3 Country' field contains '${fbTestData.transhipmentPort3Country}'`);
            await aiAssert(`verify that the 'Transhipment Port 3' field contains '${fbTestData.transhipmentPort3}'`);
            
            // Carrier information
            await aiAssert(`verify that the 'Carrier' field contains '${fbTestData.carrier}'`);
            
            console.log("Freight Booking Shipment tab verification successfully completed");
        }catch (error) {
            console.log("Freight Booking Shipment tab verification failed: " + error.message);
        }
}

export const fbRelatedSubCITabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        await page.click("//a[normalize-space()='Related Sub CI']");
        
        try{    
            await aiAssert(`verify that the first row of the 'Budgeted Freight Cost' column field contains ${freightRate}`);
                                
            console.log("Freight Booking Related Sub CI tab verification successfully ");
        }catch (error) {
            console.log("Freight Booking Related Sub CI tab verification failed:  " + error.message);
        }
        await page.click("//a[normalize-space()='Main']");  
}

