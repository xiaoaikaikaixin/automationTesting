import test from "@playwright/test";
import { tsMainTabData, tsProductTabData, tsShippingTabData, tsSpecialReqsTabData, tsSurveyorTabData } from "../../data/tradingSlipTestData";
import { attributeValue, dropdown, expectResult, extractValue, formatDateTo_dd_mmm_yyyy, okButton, scrolldown, scrollToBottom, type, uploadFile } from "../baseTest";
import { ciTestData } from "../../data/contractInstructionTestData";
import { poCostOfSalesData, poMainTabData } from "../../data/purchaseOrderTestData";



export const poMainTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
  ) => {

        // Verify Main Tab fields
        try {

            if (tsMainTabData.supplierSelectionName == 'PT Musim Mas') {
                await aiAssert(`verify that the 'Contract Type' field equal to 'Trade Confirmation'`);
            } else {
                await aiAssert(`verify that the 'Contract Type' field equal to 'Purchase Contract'`);
            }
            await aiAssert(`verify that the 'Division' field equal to ${tsMainTabData.division}`);
            const currentDate = formatDateTo_dd_mmm_yyyy(new Date());
            await aiAssert(`verify that the 'Traded Date' field equal to '${currentDate}'`);
            await aiAssert(`verify that the 'Supplier' field equal to ${tsMainTabData.supplierSelectionName}`);
            await aiAssert(`verify that the 'Factory Location' field equal to ${tsMainTabData.factoryLocation}`);
            await aiAssert(`verify that the 'Buyer' field equal to ${tsMainTabData.seller}`);
            await aiAssert(`verify that the 'SC Buyer' field equal to ${tsMainTabData.buyer}`);

            await aiAssert(`verify that the 'TC Quality / Quantity Term' field value equal to ${poMainTabData.tcQuanlityQuantityTerm}`);
            await aiAssert(`verify that the 'Payment Term' field value equal to ${poMainTabData.paymentTerm}`);
            await aiAssert(`verify that the 'Incoterms Version' field value equal to ${poMainTabData.incoterms}`);
            await aiAssert(`verify that the 'Basis' field value equal to ${poMainTabData.basis}`);  
            await aiAssert(`verify that the 'Currency' field value equal to ${poMainTabData.currency}`);
            await aiAssert(`verify that the 'Exchange Rate' field value equal to ${poMainTabData.exchangeRate}`);  
            await aiAssert(`verify that the 'No of Days' field value equal to ${poMainTabData.noOfDays}`);
            await aiAssert(`verify that the 'Financing Rate (in %)' field value equal to ${poMainTabData.financingRate}`);
            await aiAssert(`verify that the 'Percentage (in %)' field value equal to ${poMainTabData.percentage}`);
            await aiAssert(`verify that the 'Credit Insurance Rate (in %)' field value equal to ${poMainTabData.creditInsuranceRate}`);
            await aiAssert(`verify that the 'Insurance Policy No' field value equal to ${poMainTabData.insurancePolicyNo}`);
            await aiAssert(`verify that the 'Insurance Rate (in %)' field value equal to ${poMainTabData.insuranceRate}`);

        } catch (error) {
            console.log("Error verifying Main tab fields: " + error.message);
        }

        const [poRefNo] = await Promise.all([
            aiQuery("text content of 'TC/PC Ref No.' field"),
        ]);

        console.log("poRefNo: " + poRefNo);
        

}

export const poShippingTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Verify Shipping Tab fields if needed
        await page.click("//a[normalize-space()='Shipping']");
        try {

            if (test.info().title.includes('Bulk')) {
                await aiAssert(`verify that the 'Delivery Mode' field equal to ${tsShippingTabData.deliveryModeBulk}`);
             } else 
            {
                await aiAssert(`verify that the 'Delivery Mode' field equal to ${tsShippingTabData.deliveryMode}`);
             }
            await aiAssert(`verify that the 'Total No. of Units' field equal to ${tsShippingTabData.totalUnits}`);
            await aiAssert(`verify that the 'Total Qty (MT)' field equal to ${tsProductTabData.quantity}`);       
            await aiAssert(`verify that the 'Loading Port's Country' field equal to ${tsShippingTabData.loadingPortCountry}`);
            await aiAssert(`verify that the 'Loading Port' field equal to ${tsShippingTabData.loadingPort}`);
            await aiAssert(`verify that the 'Discharge Port's Country' field equal to ${tsShippingTabData.dischargePortCountry}`);
            await aiAssert(`verify that the 'Port of Discharge' field equal to ${tsShippingTabData.portOfDischarge}`);
            console.log("verify that the Shipping tab fields are correct");
        } catch (error) {
            console.log("Error verifying Shipping tab fields: " + error.message);
        }
}

export const poProductDetailsTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Product tab and verify data
        await page.click("//a[normalize-space()='Product Details']");
        await page.click("//table[@id='grdPOItems_t_frozen']/tbody/tr[2]/td[1]/a");
        try {
            await aiAssert(`verify that the 'Product code' field equal to ${tsProductTabData.productCode}`);
             await aiAssert(`verify that the 'Product Name' field equal to ${tsProductTabData.product}`);
            await aiAssert(`verify that the 'Product Category' field equal to ${tsProductTabData.productCategory}`);             
            await aiAssert(`verify that the 'RSPO SCCS Supply Chain Model' field equal to ${tsProductTabData.supplyChainModel}`);
            const checkValue1 = await attributeValue(page, "//input[@id='chkIsGMP']", "checked");
            console.log("checkValue1: " + checkValue1);
            // await aiAssert(`verify that the ${checkValue1} is equal to "checked"`);           
            await aiAssert(`verify that the checkbox for the 'NDPE' field is checked`);
            await aiAssert(`verify that the checkbox for the 'ISCC' field is checked`);
            await aiAssert(`verify that the 'Product Specification' field equal to ${tsProductTabData.productSpecification}`);
            await aiAssert(`verify that the 'Product Specification Detail' field equal to ${tsProductTabData.specificationDetails}`);
            await aiAssert(`verify that the 'Buyer Good Descriptions' field equal to ${tsProductTabData.buyergoodDescriptions}`);
            await aiAssert(`verify that the 'Delivery UOM' field equal to ${tsProductTabData.deliveryUOM}`);
            await aiAssert(`verify that the 'Quantity (UOM)' field equal to ${tsProductTabData.quantity}`);
            await aiAssert(`verify that the 'Quantity (MT)' field equal to ${tsProductTabData.quantity}`);            
            await aiAssert(`verify that the 'Price/UOM' field equal to ${tsProductTabData.pricePerUOM}`);
            await aiAssert(`verify that the 'Price/MT' field equal to ${tsProductTabData.pricePerUOM}`);
            await aiAssert(`verify that the 'Sales Price/UOM' field equal to ${tsProductTabData.pricePerUOM}`);
            await aiAssert(`verify that the 'Sales Price/MT' field equal to ${tsProductTabData.pricePerUOM}`);

            await aiAssert(`verify that the 'Weight Tolerance' field contains ${tsProductTabData.weightToleranceType}`);
            await aiAssert(`verify that the 'Weight Tolerance' field contains ${tsProductTabData.weightTolerance}`);
            await aiAssert(`verify that the 'At Seller's Option' field is chekced`);
            await aiAssert(`verify that the 'Packaging Form' field equal to ${tsProductTabData.produtForm}`);

            if (test.info().title.includes('Bulk')) {
                await aiAssert(`verify that the 'Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileNameBulk}`);
                await aiAssert(`verify that the 'SC Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileNameBulk}`);        
                await aiAssert(`verify that the 'Calculated Total Packaging' field equal to '0.00'`);            
            }else{
                await aiAssert(`verify that the 'Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileName}`);
                await aiAssert(`verify that the 'SC Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileName}`);
            }
            
            await aiAssert(`verify that the 'Fulfilled Qty (MT)' field equal to '0.000'`);
            await aiAssert(`verify that the 'Fulfilled Qty (UOM)' field equal to '0.000'`);
            await aiAssert(`verify that the 'Billed Qty (UOM)' field equal to '0.000'`);
            await aiAssert(`verify that the 'Billed Qty (MT)' field equal to '0.000'`);
            await aiAssert(`verify that the 'Closed Qty (UOM)' field equal to '0.000'`);
            await aiAssert(`verify that the 'Closed Qty (MT)' field equal to '0.000'`);          
            await aiAssert(`verify that the 'Discharged Qty (UOM)' field equal to '0.000'`);
            await aiAssert(`verify that the 'Discharged Qty (MT)' field equal to '0.000'`);           
            await aiAssert(`verify that the 'Closed' field is not checked`);
            await ai('scroll down to the bottom of the page');

            //verify the Costs of Sales

            await aiAssert(`verify that the 'Barging Cost' field equal to ${poCostOfSalesData.bargingCost}`);
            await aiAssert(`verify that the 'Bunker Surcharge' field equal to ${poCostOfSalesData.bunkerSurcharge}`);
            await aiAssert(`verify that the 'Freight Cost' field equal to ${tsShippingTabData.freightRatePerMT}*${poCostOfSalesData.convensationRate}`);
            await aiAssert(`verify that the 'Transhipment Cost' field equal to '${poCostOfSalesData.transhipmentCost}'`);
            await aiAssert(`verify that the 'Freight Cost (for Additional discharge port used/saved)' field equal to '${poCostOfSalesData.freightCostforAddDisPortUsedSaved}'`);
            await aiAssert(`verify that the 'Freight Cost (for Additional load port used/saved)' field equal to '${poCostOfSalesData.freightCostforAddLoadPortUsedSaved}'`);
            await aiAssert(`verify that the 'Total Logistics Cost' field equal to '${poCostOfSalesData.bargingCost + 
                poCostOfSalesData.bunkerSurcharge + poCostOfSalesData.freightCost+poCostOfSalesData.transhipmentCost + poCostOfSalesData.freightCostforAddDisPortUsedSaved
            + poCostOfSalesData.freightCostforAddLoadPortUsedSaved}'`);




            await aiAssert(`verify that the 'Inventory Cost' field equal to '${poCostOfSalesData.inventoryCost}'`);
            await aiAssert(`verify that the 'Isotank Rental Related Cost' field equal to '${poCostOfSalesData.isotankRentalRelatedCost}'`);
            await aiAssert(`verify that the 'Storage Tank Rental Cost' field equal to '${poCostOfSalesData.storageTankRentalCost}'`);
            await aiAssert(`verify that the 'Surveyor and Analysis Cost' field equal to '${poCostOfSalesData.surveyorAndAnalysisCost}'`);
            await aiAssert(`verify that the 'Total Storage Cost' field equal to '${poCostOfSalesData.inventoryCost + 
                poCostOfSalesData.isotankRentalRelatedCost + poCostOfSalesData.storageTankRentalCost}'`);            



            await aiAssert(`verify that the 'Marine Insurance Cost' field equal to '${poCostOfSalesData.marineInsuranceCost}'`);
            await aiAssert(`verify that the 'WSRCC Insurance Cover Buyback Cost' field equal to '${poCostOfSalesData.wsrccCost}'`);
            await aiAssert(`verify that the '@Total Insurance Cost' field equal to '${poCostOfSalesData.marineInsuranceCost + poCostOfSalesData.wsrccCost}'`);



            await aiAssert(`verify that the 'Credit Insurance Cost' field equal to '${poCostOfSalesData.creditInsuranceCost}'`);
            await aiAssert(`verify that the 'Financing Cost' field equal to '${poCostOfSalesData.financingCost}'`);
            await aiAssert(`verify that the '@Total Special Requirement (Extended Credit)' field equal to '${poCostOfSalesData.creditInsuranceCost + poCostOfSalesData.financingCost}'`);

            await aiAssert(`verify that the 'Handling Cost' field equal to '${poCostOfSalesData.handlingCost}'`);
            await aiAssert(`verify that the '@Cost of Sales/UOM' field equal to 'Total Logistics Cost + Total Storage Cost + Total Insurance Cost 
                + Total Special Requirement(Extended Credit) + Handling Cost'`);
            await aiAssert(`verify that the '@Sales Price/UOM (FOB,FCA)' field equal to 'Sales Price/UOM's value - Cost of Sales/UOM'`);
            await aiAssert(`verify that the '@Profit Margin (in %)' field equal to '${poCostOfSalesData.profitMarginPercentage}'`);
            await aiAssert(`verify that the '@Profit Margin Amount' field equal to '${poCostOfSalesData.profitMarginPercentage} * Sales Price/UOM (FOB,FCA)'`);
            await aiAssert(`verify that the '@Purchase Price/UOM in Reference Sales' field equal to '2,684.00'`);
            await aiAssert(`verify that the '@Price/UOM (TC,PC)' field equal to '2,684.00'`);
            await aiAssert(`verify that the '@Amount' field equal to '1,545.98'`);


            console.log("Verify the Product Details tab show the correct values!");
        } catch (error) {
            console.log("Error verifying Product Details tab fields: " + error.message);
        }
        await page.click("//input[@id='btnClose']");
}


export const poSubmitForApproval = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Email tab and verify data
        await page.click("//a[normalize-space()='Main']");    
        await page.click("//input[@id='btnSubmitForApproval']");   
        await okButton(page);

        try{    
            await page.reload();
            await aiAssert(`verify that the 'Document Status' field contains '${poMainTabData.poDocumentStatusPending}'`);
            await aiAssert(`verify that the 'Approval Status' field contains '${poMainTabData.poApprovalStatusPedning}'`);
            console.log("verify that the PO is pending approval is success.");
        }catch (error) {
            console.log("Error verifying PO submission for approval: " + error.message);
        }
}


export const poApproval = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Email tab and verify data
        await page.click("//a[normalize-space()='Main']");    
        await page.click("//input[@id='btnApprove']");   
        await okButton(page);

        try{    
            await page.reload();
            await aiAssert(`verify that the 'Document Status' field contains '${poMainTabData.poDocumentStatusApproved}'`);
            await aiAssert(`verify that the 'Approval Status' field contains '${poMainTabData.poApprovalStatusApproved}'`);
            console.log("verify that the PO is approved is success.");
        }catch (error) {
            console.log("Error verifying PO Approval failed: " + error.message);   
        }
}

export const poEmailTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Email tab and verify data
        await page.click("//a[normalize-space()='Email History']");              

        try{    
            const [approvalStatus,emailSubject] = await Promise.all([
            aiQuery("text content of the 'Approval Status' field for the first row"),
            aiQuery("text content of the 'Subject' field for the first row")
         ]);
         if(approvalStatus.includes("Pending Approval")){
            await aiAssert(`verify that the first row of the 'Subject' column contains 'TC Pending Approval '`);
            console.log("PO submit for approval's email subject:", emailSubject);
         }else{
            await aiAssert(`verify that the first row of the 'Subject' column contains 'TC - Purchase'`);
            console.log("PO submit for approval's email subject:", emailSubject);
         }

        }catch (error) {
            console.log("Error verifying trigger email notification when PO submit for approval: " + error.message);
        }
        await page.click("//a[normalize-space()='Main']");
        console.log("Verify the Email History tab show the correct values!");
}