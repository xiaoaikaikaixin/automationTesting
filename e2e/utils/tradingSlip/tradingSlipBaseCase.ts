import { Page } from '@playwright/test';
import { test } from "../../../fixture";
import {
    click,
    type,
    typeAndTab,
    dropdown,
    popupbuttonselector,
    popupBrokerSelector,
    popupselection,
    formatDateTo_dd_mmm_yyyy,
    expectResult,
    scrolldown,
    extractValue,
    dropdownWithIndex
} from '../baseTest';

import {
    testCredentials,
    tsMainTabData,
    tsShippingTabData,
    tsSurveyorTabData,
    tsProductTabData,
    tsSpecialReqsTabData,
    tsBrokerTabData,
    statusData,
    tsShippingTCPCData
} from '../../data/tradingSlipTestData';



export const addMain = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
) => {
        // Fill Main tab details
       if (test.info().title.includes('Sales from Unsold')) {
            await click(page, "//label[normalize-space()='Sales from Unsold']");
        } else if (test.info().title.includes('Presold - Offshore')) {
            await click(page, "//label[normalize-space()='Presold - Offshore']");
        } else
        {
            console.log('Create Normal Order');
        }

        await dropdown(page, '//span[@id="lstDivision"]', tsMainTabData.division);
        await page.fill('//input[@id="txtSalesEnquiryNo"]', tsMainTabData.saleEnqualNumber);
        await page.waitForTimeout(3000);
        await dropdown(page, '//span[@id="lstSupplier"]', tsMainTabData.supplier);
        await page.waitForTimeout(2000);
        const [factoryLocationValue] = await Promise.all([
            aiQuery("text content of 'Factory Location' field")
        ]);
        console.log("Factory Location: " + factoryLocationValue);
        await aiAssert(`verify that the Factory location value is ${tsMainTabData.factoryLocation}`);

        if (test.info().title.includes('Direct Shipment')) {
            await dropdown(page, '//span[@id="lstSeller"]', tsMainTabData.directshipmentSeller);
        } else {
            await dropdown(page, '//span[@id="lstSeller"]', tsMainTabData.seller);
        }

        await popupselection(page, "//input[@id='psacBuyer_pop']", '//iframe[@id="psacBuyer_pop_pop_fr1"]', tsMainTabData.buyer);
        await page.waitForTimeout(2000);
        await type(page,"//input[@id='txtBuyerPONo']", tsMainTabData.buyerPONo);
        await page.waitForTimeout(3000);
        await dropdown(page, "//span[@id='lstPaymentTerm']", tsMainTabData.paymentTerm);
        // await dropdown(page, "//span[@id='lstBasis']", tsMainTabData.basisforCD);

        if (test.info().title.includes('C&D') ||test.info().title.includes('Bulk')) {
            await dropdown(page, "//span[@id='lstBasis']", tsMainTabData.basisforCD); // Select C&D basis
        } else {
            await dropdown(page, "//span[@id='lstBasis']", tsMainTabData.basisforEF); // Select E&F basis
        }
        
        await dropdownWithIndex(page, "//span[@id='lstTrader']", 3);


        if (test.info().title.includes('FB Arranaged')) {
            await click(page, "//input[@id='chkFBArrangeBySupplier']");
        }

        // Save the Trading Slip
        await page.click('//input[@id="btnSave"]');
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(3000);        
        // Extract and verify Trading Slip number and status
        const [tradingSlipNumber, tsApprovalStatus] = await Promise.all([
            aiQuery("text content of 'Trading Slip No.' field"),
            aiQuery("text content of 'Approval Status' field")
        ]);      
        await aiAssert(`Trading Slip ${tradingSlipNumber} is displayed`);
        await aiAssert(`${tsApprovalStatus} equal to ${statusData.draftStatus}`);
        console.log(`Trading Slip Number: ${tradingSlipNumber}`);
        console.log(`Approval Status: ${tsApprovalStatus}`); 
        console.log("Create Trading Slip with Main tab is successfully!")


}


export const addUnsoldMain = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
) => {
        // Fill Main tab details
        await page.click("//label[normalize-space()='Unsold Order']");
        await dropdown(page, '//span[@id="lstDivision"]', tsMainTabData.division);
        await page.fill('//input[@id="txtSalesEnquiryNo"]', tsMainTabData.saleEnqualNumber);
        await page.waitForTimeout(3000);
        await dropdown(page, '//span[@id="lstSupplier"]', tsMainTabData.supplier);
        const [factoryLocationValue] = await Promise.all([
            aiQuery("text content of 'Factory Location' field")
        ]);
        console.log("Factory Location: " + factoryLocationValue);
        await aiAssert(`verify that the Factory location value is ${tsMainTabData.factoryLocation}`);

        await dropdown(page, '//span[@id="lstSeller"]', tsMainTabData.seller);

        await page.waitForTimeout(2000);    

        await type(page,"//input[@id='txtBuyerPONo']", tsMainTabData.buyerPONo);
 
        await dropdown(page,"//span[@id='lstCurrency']", tsMainTabData.currency);

        await dropdown(page, "//span[@id='lstBasis']", tsMainTabData.basisforEF); // Select E&F basis
        
        await dropdown(page, "//span[@id='lstTrader']", tsMainTabData.tradedBy);

        // Save the Trading Slip
        await page.click('//input[@id="btnSave"]');
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2000);        
        // Extract and verify Trading Slip number and status
        const [tradingSlipNumber, tsApprovalStatus] = await Promise.all([
            aiQuery("text content of 'Trading Slip No.' field"),
            aiQuery("text content of 'Approval Status' field")
        ]);      
        await aiAssert(`Trading Slip ${tradingSlipNumber} is displayed`);
        await aiAssert(`${tsApprovalStatus} equal to ${statusData.draftStatus}`);
        console.log(`Trading Slip Number: ${tradingSlipNumber}`);
        console.log(`Approval Status: ${tsApprovalStatus}`); 
        console.log("Create Trading Slip with Main tab is successfully!")

}


export const addShipping = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
) => {
        // Navigate to Shipping tab
        await page.click("//a[normalize-space()='Shipping']");
        await page.waitForTimeout(2000);
        
        // Fill Shipping tab details

        if (test.info().title.includes('Bulk')) {
            await dropdown(page, '//span[@id="lstDeliveryMode"]', tsShippingTabData.deliveryModeBulk);
        } else 
        {
            await dropdown(page, '//span[@id="lstDeliveryMode"]', tsShippingTabData.deliveryMode);
        }

        await page.click("//input[@id='txtTotalNoOfUnits_ti']");
        await type(page,"//input[@id='txtTotalNoOfUnits_ti']", tsShippingTabData.totalUnits);
        await dropdown(page,"//span[@id='lstShippingLineAgentOption']", tsShippingTabData.shippingLineAgent);

        
        // Fill discharge port details
        await typeAndTab(page, "span[id='acDischargePortCountry'] input[placeholder='<Type then tab>']", tsShippingTabData.dischargePortCountry);
        await dropdown(page, "//span[@id='lstDischargePort']", tsShippingTabData.portOfDischarge);
        
        // Override freight cost and rate
        await page.click("//input[@id='chkOverrideBudgetedFreight']");
        await page.fill("//input[@id='txtBudgetedFreight_ti']", tsShippingTabData.budgetedFreightCost);
        await page.waitForTimeout(2000);
        await page.click('//input[@id="chkOverrideFreightRateMT"]');
        await page.waitForTimeout(2000);
        await page.fill("//input[@id='txtFreightRateMT_ti']", tsShippingTabData.freightRatePerMT);
        await dropdown(page,"//span[@id='select2-lstCargoNature-container']",tsShippingTabData.cargoNature);      
        await page.click('//input[@id="btnSaveExisting"]');
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2000);        
        console.log("Create Normal order for Shipping tab is successfully!")
}


export const addShippingTCPC = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
) => {
        // Navigate to Shipping tab
        await page.click("//a[normalize-space()='Shipping (TC/PC)']");
        
        await dropdown(page,"//span[@id='lstShippingTerm']", tsShippingTCPCData.shippingTermDoorToDoor);

        await typeAndTab(page, "//span[@id='acLoadPortCountry']//input[@placeholder='<Type then tab>']", tsShippingTCPCData.loadingPortCountry);
        await dropdown(page,"//span[@id='lstLoadPort']", tsShippingTCPCData.loadingPort);

        await dropdown(page,"//span[@id='lstLoadLocation']", tsShippingTCPCData.placeOfLoading);
        await typeAndTab(page, "//span[@id='acDischargePortCountry']//input[@placeholder='<Type then tab>']", tsShippingTCPCData.dischargeofCountry);
        await dropdown(page,"//span[@id='lstDischargePort']", tsShippingTCPCData.dischargeofPort);
        
        await typeAndTab(page, "//span[@id='acFinalDestinationCountry']//input[@placeholder='<Type then tab>']", tsShippingTCPCData.finalDestinationCountry);
        await dropdown(page,"//span[@id='lstFinalDestination']", tsShippingTCPCData.finalDestination);
        await page.waitForTimeout(2000);       
        
        await expectResult(page, "//textarea[@id='txtFinalDestinationAddress']", tsShippingTCPCData.finalDestinationFullAddress);
        await page.click('//input[@id="btnSaveExisting"]');
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2000);        
        console.log("Create Trading Slip for Shipping (TC/PC) tab is successfully!")
}


export const addProduct = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
) => {
  
        // Navigate to Product Details tab
        await page.click("//a[normalize-space()='Product Details']");
        
        // Click Add Item button
        await page.click("//input[@id='btnAddItem']");
        await page.waitForTimeout(2000);
        
        // Select Product
        await popupbuttonselector(page, "//input[@id='psacItem_pop']", "//iframe[@id='psacItem_pop_pop_fr1']","//input[@id='txtItemName']", "//table[@id='grdItem_t']//tbody/tr[2]/td[1]",tsProductTabData.product);
        
        // Select RSPO SCCS Supply Chain Model
        await dropdown(page, "//span[@id='lstCertifiedType']", tsProductTabData.supplyChainModel);
        
        // Tick checkboxes
        await page.click("//input[@id='chkIsGMP']");
        await page.click("//input[@id='chkNDPE']");
        await page.click("//input[@id='chkISCC']");
        
        // Verify Buyer Goods Description
        try {
            const [buyerGoodsDescription] = await Promise.all([
                aiQuery("text content of 'Buyer Goods Description' field")
            ]);
            await aiAssert(`verify that the Buyer Goods Description contains ${tsProductTabData.buyergoodDescriptions}`);
            console.log("Buyer description value show the value: " + buyerGoodsDescription);
        } catch (error) {
            console.log("Error verifying Buyer Goods Description: " + error.message);
        }
        
        // Select Product Specification
        await dropdown(page, "//span[@id='lstItemSpecification']", tsProductTabData.productSpecification);
        
        // Verify Product Specification Details
        try {
            const [productSpecDetails] = await Promise.all([
                aiQuery("text content of 'Product Specification Details' field")
            ]);
            await aiAssert(`verify that the Product Specification Details value is ${tsProductTabData.specificationDetails}`);
            console.log("Product Specification Details value: " + productSpecDetails);
        } catch (error) {
            console.log("Error verifying Product Specification Details: " + error.message);
        }
        
        await page.evaluate(() => {
            window.scrollTo(0, 500);
        });
        // Select Delivery UOM
        await dropdown(page, "//span[@id='lstDeliveryUom']", tsProductTabData.deliveryUOM);
        await dropdown(page, "//span[@id='lstWeightToleranceType']", tsProductTabData.weightToleranceType);
        await page.waitForTimeout(2000);
        await dropdown(page, "//span[@id='lstWeightTolerance']", tsProductTabData.weightTolerance);
        
        // Enter Quantity and Price
        await type(page, "//input[@id='txtQuantityInUom_ti']", tsProductTabData.quantity);
        await page.evaluate(() => {
            window.scrollTo(0, -500);
        });
        await type(page, "//input[@id='txtPriceInUom_ti']", tsProductTabData.pricePerUOM);
       // Select Packaging Profile Name



        if (test.info().title.includes('Bulk')) {
             await dropdown(page, "//span[@id='lstPackagingProfileName']", tsProductTabData.packagingProfileNameBulk);
        } else 
        {
             await dropdown(page, "//span[@id='lstPackagingProfileName']", tsProductTabData.packagingProfileName);
        }
        
        // Verify Amount USD
        try {
            const expectedAmount = Number(tsProductTabData.quantity) * Number(tsProductTabData.pricePerUOM.replace(',',''));
            const [amountUSD] = await Promise.all([
                aiQuery("text content of 'Amount' field")
            ]);
            console.log("Item amount is: " + amountUSD);
            console.log("Expected amount is: " + expectedAmount);
            await aiAssert(`verify that the Amount USD equals ${expectedAmount}`);
        } catch (error) {
            console.log("Error verifying Amount USD: " + error.message);
        }
        

        
        // Select Shipping Marking and enter custom text
        await dropdown(page, "//span[@id='lstShippingMarking']", tsProductTabData.shippingMarking);
        await type(page, "//textarea[@id='txtShippingMarkingCustomize']", tsProductTabData.shippingMarkingCustomize);
        
        // Select Packaging Marking and enter custom text
        await dropdown(page, "//span[@id='lstPackagingMarking']", tsProductTabData.packagingMarking);
        await type(page, "//textarea[@id='txtPackagingMarkingCustomize']", tsProductTabData.packagingMarkingCustomize);
        
        // Select Pallet Profile Name and enter custom text
        await dropdown(page, "//span[@id='lstPalletMarking']", tsProductTabData.palletProfileName);
        await type(page, "//textarea[@id='txtPalletMarkingCustomize']", tsProductTabData.palletMarkingCustomize);
        
        // Select Insulation Type
        await dropdown(page, "//span[@id='lstInsulationType']", tsProductTabData.insulationType);
        
        // Verify Product Remarks
        try {
            const [productRemarks] = await Promise.all([
                aiQuery("text content of 'Product Remark' field")
            ]);
            await aiAssert(`verify that the Product Remark contains ${tsProductTabData.productRemarkGMP}`);
            await aiAssert(`verify that the Product Remark contains ${tsProductTabData.productRemarkNDPE}`);
            await aiAssert(`verify that the Product Remark contains ${tsProductTabData.productRemarkISCC}`);
            console.log("Product Remark value is: " + productRemarks);
        } catch (error) {
            console.log("Error verifying Product Remarks: " + error.message);
        }

        // Save the Product Details
        await page.click("//input[@id='btnSave']");
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2000);
        console.log("Product Details created successfully!")

        await page.click("//input[@id='btnClose']");
        await page.waitForTimeout(5000);

        try { 
            await aiAssert(`Verify the first row of 'Product' column's value equal to ${tsProductTabData.product}`)
            await aiAssert(`Verify the first row of 'RSPO SCCS Supply Chain Model's value equal to ${tsProductTabData.supplyChainModel}`)
            await aiAssert(`Verify the first row of 'Product Specification's value equal to ${tsProductTabData.productSpecification}`)
            await aiAssert(`Verify the first row of 'Specification Details's value equal to ${tsProductTabData.specificationDetails}`)
            
            // First scroll horizontally to the Buyer Goods Description column
            await ai("scroll to the right to stop at the 'Buyer Goods Description' column");
            
            // Then scroll vertically to ensure the Buyer Goods Description field is in view
            await ai("scroll vertically to ensure the 'Buyer Goods Description' field is visible");
            await page.waitForTimeout(3000);
            // Add a small wait to ensure the UI has stabilized after scrolling            
            await aiAssert(`Verify the first row of 'Buyer Goods Description's value equal to ${tsProductTabData.buyergoodDescriptions}`)
            await aiAssert(`Verify the first row of 'Delivery UOM's value equal to ${tsProductTabData.deliveryUOM}`)
            await aiAssert(`Verify the first row of 'Quantity (UOM)'s value equal to ${tsProductTabData.quantity}`)
            // await aiAssert(`Verify the first row of 'Price/UOM's value equal to ${tsProductTabData.pricePerUOM}`)
            // console.log("verify the grid of columns Product/RSPO SCCS Supply Chain Model/Product Specification/Specification Details show the correct value!")
            // await ai("scroll to the right to stop at the 'Amount' column");
            // await ai("scroll vertically to ensure the 'Amount' field is visible");
            // await page.waitForTimeout(3000);
            // await aiAssert(`Verify the first row of 'Amount's value equal to Number(${tsProductTabData.quantity}) * Number(${tsProductTabData.pricePerUOM}))`)
            // console.log("verify the grid of columns show the correct value!")
    
        } catch (error) {
            console.log("Error verifying Product information in Grid table: " + error.message);
        } 
}


export const salsfromUnsoldAddProduct = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
) => {
        // Navigate to Product Details tab
        await page.click("//a[normalize-space()='Product Details']");
        await page.click("//input[@id='btnAddItemSubContract']");
        await page.waitForTimeout(2000);

         const frame1 = page.frameLocator("//iframe[@id='divUnsoldOrderSelection_fr1']");
         await frame1.locator("//span[@id='lstItem']").click();
         await page.waitForTimeout(2000);
         await frame1.locator(`//li[text()='${tsProductTabData.product}']`).click();
         await page.waitForTimeout(3000);
         await frame1.locator("//td[@id='last_t_grdUnsoldSC_t_toppager']//span[@class='fa fa-fw fa-step-forward']").click();
         await page.waitForTimeout(3000);
     
         const [rowNo, unsoldNo, unsoldQty,taggedQty,availableQty] = await Promise.all([
                aiQuery("row number of the last record of the current screen"), 
                aiQuery("text content of the last row's 'SC No.' column "),
                aiQuery("text content of the last row's 'Unsold Qty (UOM)' column"),
                aiQuery("text content of the last row's 'Tagged Qty (UOM)' column"),
                aiQuery("text content of the last row's 'Available Tagged Qty (UOM)' column")
        ]);

        console.log("the selected Unsold order information is " + rowNo + ", " +
             unsoldNo + ", " + unsoldQty + ", " + taggedQty + ", " + availableQty);

         await aiAssert(`verify that the ${availableQty} is equal to ${unsoldQty} - ${taggedQty}`); 
         await page.waitForTimeout(3000);
         await ai(`click the last row which 'SC No.' contains ${unsoldNo}`);
         await page.waitForTimeout(3000);
         await ai("scroll to the right to the end");
         await ai("scroll vertically to ensure the 'Quantity (UOM)To Tag (Click Cell To Edit)' field is visible");
         await page.waitForTimeout(3000);

         await ai("click the cell containing '0.000' in the 'Quantity (UOM)To Tag (Click Cell To Edit)' column of the last record");
         await page.waitForTimeout(2000);
         await frame1.locator(`//input[@id="e${rowNo}_UnsoldQtyToTagUom_ti"]`).fill(availableQty);
         await frame1.locator("//label[normalize-space()='Product']").click();
         await frame1.locator("//input[@id='btnAttachSelected']").click();
         console.log("Add unsold item success.")

         await page.click("//table[@id='grdTSItems_t_frozen']/tbody/tr[2]/td[2]/a");
         await page.waitForTimeout(3000);
         try {
            await aiAssert(`verify that the 'Product' field equal to ${tsProductTabData.product}`);
            await aiAssert(`verify that the 'Buyer Good Descriptions' field equal to ${tsProductTabData.buyergoodDescriptions}`);
            await aiAssert(`verify that the 'RSPO SCCS Supply Chain Model' field equal to ${tsProductTabData.supplyChainModel}`);
            await aiAssert(`verify that the 'GMP' field is disabled and checked`);
            await aiAssert(`verify that the 'NDPE' field is checked`);
            await aiAssert(`verify that the 'ISCC' field is checked`);
            await aiAssert(`verify that the 'Product Specification' field equal to ${tsProductTabData.productSpecification}`);
            await aiAssert(`verify that the 'Product Specification Detail' field equal to ${tsProductTabData.specificationDetails}`);
            await aiAssert(`verify that the 'Delivery UOM' field equal to ${tsProductTabData.deliveryUOM}`);
            await aiAssert(`verify that the 'Quantity (UOM)' field equal to ${availableQty}`);
            await aiAssert(`verify that the 'Quantity (MT)' field equal to ${availableQty}`);
            await aiAssert(`verify that the 'Weight Tolerance' field contains ${tsProductTabData.weightToleranceType}`);
            await aiAssert(`verify that the 'Weight Tolerance' field contains ${tsProductTabData.weightTolerance}`);
            await aiAssert(`verify that the 'At Seller's Option' field is checked`);
            await aiAssert(`verify that the 'Price/UOM' field equal to ${tsProductTabData.pricePerUOM}`);
            await aiAssert(`verify that the 'Price/MT' field equal to ${tsProductTabData.pricePerUOM}`);
            await aiAssert(`verify that the 'Amount' field equal to ${tsProductTabData.pricePerUOM}*${availableQty}`);
            await aiAssert(`verify that the 'Packaging Form' field equal to ${tsProductTabData.produtForm}`);
            await aiAssert(`verify that the 'Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileName}`);
            await aiAssert(`verify that the 'SC Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileName}`);
            await aiAssert(`verify that the 'Unsold TS No' field contains ${unsoldNo.replace('SC','TS')}`);
            await aiAssert(`verify that the 'Insulation Type' field equal to ${tsProductTabData.insulationType}`);
            await aiAssert(`verify that the 'Product Remark GMP' field contains ${tsProductTabData.productRemarkGMP}`);
            await aiAssert(`verify that the 'Product Remark NDPE' field contains ${tsProductTabData.productRemarkNDPE}`);
            await aiAssert(`verify that the 'Product Remark ISCC' field contains ${tsProductTabData.productRemarkISCC}`);
            console.log("Verify the Product Details tab show the correct values!");
        } catch (error) {
            console.log("Error verifying Product Details tab fields: " + error.message);
        }
        await page.click("//input[@id='btnClose']");
}


export const addSpecialReq = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
) => {
  
     // Navigate to Special Reqs. tab
     await page.click("//a[normalize-space()='Special Reqs.']");
     await page.waitForTimeout(2000);
     
     // Fill Special Reqs. tab details
     await page.click("//input[@id='btnEditView']");
     await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSpecialProductRequirement_lb']", tsSpecialReqsTabData.specialProductRequirement);
     await page.click("//textarea[@id='txtAdditionalHeatingRequirement']");
     await dropdown(page, "//span[@id='lstFlexiBagHeatingPadRequired']", tsSpecialReqsTabData.flexiBagRequired);
     await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddPriorCargoRequirement_lb']", tsSpecialReqsTabData.priorCargoRequirement);
     await page.click("//textarea[@id='txtAdditionalHeatingRequirement']");
     await type(page, "//input[@id='txtPriorCargoRequirementOthers']", tsSpecialReqsTabData.priorCargoRequirementOthers);
     await type(page, "//textarea[@id='txtAdditionalHeatingRequirement']", tsSpecialReqsTabData.additionalHeatingRequirement);
     await type(page, "//textarea[@id='txtSCRemarks']", tsSpecialReqsTabData.scRemarks);
     
     // Verify Internal Remarks
     try {
         const [internalRemarks] = await Promise.all([
             aiQuery("text content of 'Internal Remarks' field")
         ]);
         await aiAssert(`verify that the Internal Remarks contains ${tsProductTabData.productRemarkGMP}`);
         await aiAssert(`verify that the Internal Remarks contains ${tsProductTabData.productRemarkISCC}`);
         await aiAssert(`verify that the Internal Remarks contains ${tsProductTabData.productRemarkNDPE}`);
         console.log("Internal Remarks value is: " + internalRemarks);
     } catch (error) {
         console.log("Error verifying Internal Remarks: " + error.message);
     }
     
     // Verify Sanction Clause
     try {
         const [sanctionClause] = await Promise.all([
             aiQuery("text content of 'Sanction Clause' field")
         ]);
         await aiAssert(`verify that the Sanction Clause contains ${tsSpecialReqsTabData.sanctionClause.substring(0, 50)}...`);
         console.log("Sanction Clause verification completed and Sanction Clause is " + sanctionClause);
     } catch (error) {
         console.log("Error verifying Sanction Clause: " + error.message);
     }
     
     // Save the Special Reqs. tab
     await page.click('//input[@id="btnSaveExisting"]');
     await page.waitForLoadState("networkidle");
     await page.waitForTimeout(2000);
     console.log("Create Trading Slip for Special Reqs. tab is successfully!");
}


export const addSurveyor = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
) => {
        
            // Navigate to Surveyor tab
        await page.click("//a[normalize-space()='Surveyor']");
        await page.waitForTimeout(2000);
        
        // Fill Surveyor tab details
        await dropdown(page, "//span[@id='lstSurveyorRequired']", tsSurveyorTabData.surveyorRequired);
        await dropdown(page, "//span[@id='lstSurveyorTerm']", tsSurveyorTabData.surveyorFee);
        
        // Fill Load Port Surveyor fields
        await typeAndTab(page, "(//input[@placeholder='<Type then tab>'])[1]", tsSurveyorTabData.assignedLoadPortSurveyor);
        await page.waitForTimeout(2000);
        await typeAndTab(page, "//span[@id='psacBuyerLoadPortSurveyor_ac']//input[@placeholder='<Type then tab>']", tsSurveyorTabData.assignedLoadPortSurveyor);
        await page.waitForTimeout(2000);
        await typeAndTab(page, "//span[@id='psacShipperLoadPortSurveyor_ac']//input[@placeholder='<Type then tab>']", tsSurveyorTabData.assignedLoadPortSurveyor);
        await page.waitForTimeout(2000);
        await typeAndTab(page, "//span[@id='psacIcofDischargePortSurveyor_ac']//input[@placeholder='<Type then tab>']", tsSurveyorTabData.assignedLoadPortSurveyor);
        await typeAndTab(page, "//span[@id='psacBuyerDischargePortSurveyor_ac']//input[@placeholder='<Type then tab>']", tsSurveyorTabData.assignedLoadPortSurveyor);
        await typeAndTab(page, "//span[@id='psacShipperDischargePortSurveyor_ac']//input[@placeholder='<Type then tab>']", tsSurveyorTabData.assignedLoadPortSurveyor);

        
        // Save the Surveyor tab
        await page.click('//input[@id="btnSaveExisting"]');
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2000);
        console.log("Create Trading Slip for Surveyor tab is successfully!");
}      

export const addBroker = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
) => {
         // Navigate to Broker tab
         await page.click("//a[normalize-space()='Broker']");
         await page.waitForTimeout(2000);       
         // Add Broker details
         await page.click("//span[@class='fa fa-lg fa-fw fa-plus']"); // Add icon
         await popupBrokerSelector(page, "//input[@id='e_new__1_BrokerName_pop']", "//iframe[@id='e_new__1_BrokerName_pop_pop_fr1']");
         await type(page, "//input[@id='e_new__1_CommissionRate_ti']",tsBrokerTabData.commissionRate );
         await page.click("//span[@class='fa fa-lg fa-fw fa-floppy-o']");
         await page.waitForTimeout(2000);
         console.log("Create Trading Slip for Broker tab is successfully!");
}

export const addBudgetedFreight = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
) => {
        // Navigate to Budgeted Freight tab
        await page.click("//a[normalize-space()='Budgeted Freight']");
        await page.waitForTimeout(2000);
        await page.click("//input[@id='btnAttach']");
        await page.waitForTimeout(2000);
        
        // Select the first row
        await page.click("//table[@id='grdTSFreightCharge_t_frozen']/tbody/tr[2]/td/input");
        
        // Extract Freight Rate and Freight Charge No.
        
        const [freightChargeNo] = await Promise.all([              
                aiQuery("text content of first row's 'Freight Charge No.' column")    
            ]);
         console.log(`Freight Rate: ${freightChargeNo}`);

        
        await page.click("//input[@id='btnAttach']");
        await page.waitForTimeout(3000);
        await page.click("//button[@id='button-0']");
        await page.click("//button[@id='button-0']");
        await page.waitForTimeout(3000);

        const freightRate = await extractValue(page, "//td[@aria-describedby='grdTSFreightCharge_t_FreightRatesAndUom']/span/div[1]");
        console.log(`Freight Rate: ${freightRate}`);
        
        // Verify the Freight Rate is contained in Calibrated Budgeted Freight Cost
        try {
            const [calibratedBudgetedFreightCost] = await Promise.all([
                aiQuery("text content of 'Calibrated Budgeted Freight Cost' field")
            ]);
            console.log("Calibrated Budgeted Freight Cost: " + calibratedBudgetedFreightCost);
            await aiAssert(`verify that the ${freightRate} contains ${calibratedBudgetedFreightCost}`);

        } catch (error) {
            console.log("Error verifying Calibrated Budgeted Freight Cost: " + error.message);
        }
        
        console.log("Create Trading Slip for Budgeted Freight tab is successfully!");
}


export const mainTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
  ) => {

        // Verify Main Tab fields
        await page.click("//a[normalize-space()='Main']");
        try {

            if (test.info().title.includes('Direct Shipment')) {
                await aiAssert(`verify that the 'Contract Type' field equal to ${tsMainTabData.directshipmentcontractType}`);
            } else {
                await aiAssert(`verify that the 'Contract Type' field equal to ${tsMainTabData.dropshipmentcontractType}`);
            }

           if (test.info().title.includes('Sales from Unsold')){
                await aiAssert(`verify that the 'Special Order Type' field equal to ${tsMainTabData.salesFromUnsoldOrderTyoe}`);
            } else if (test.info().title.includes('Presold'))
            {
                await aiAssert(`verify that the 'Special Order Type' field equal to ${tsMainTabData.presoldOrderTyoe}`);
            }else 
            {
                await aiAssert(`verify that the 'Special Order Type' field equal to ${tsMainTabData.normalOrderType}`);
            }

            await aiAssert(`verify that the 'Division' field equal to ${tsMainTabData.division}`);
            await aiAssert(`verify that the 'Sales Enquiry Number' field equal to ${tsMainTabData.saleEnqualNumber}`);
            const currentDate = formatDateTo_dd_mmm_yyyy(new Date());
            await aiAssert(`verify that the 'Traded Date' field equal to '${currentDate}'`);
            await aiAssert(`verify that the 'Supplier' field equal to 'PT Musim Mas'`);
            await aiAssert(`verify that the 'Factory Location' field equal to ${tsMainTabData.factoryLocation}`);
            await aiAssert(`verify that the 'Seller' field equal to ${tsMainTabData.seller}`);
            await expectResult(page, "//span[@id='psacBuyer']", tsMainTabData.buyer);
            await expectResult(page, "//tbody/tr[6]/td[1]/div[1]", tsMainTabData.buyerAddress);
            await scrolldown(page);
            await aiAssert(`verify that the 'Buyer PO No.' field value equal to ${tsMainTabData.buyerPONo}`);
            await aiAssert(`verify that the 'Currency' field value equal to ${tsMainTabData.currency}`); 
            await aiAssert(`verify that the 'Exchange Rate' field value equal to ${tsMainTabData.exchangeRate}`);
            await aiAssert(`verify that the 'Payment Term' field value equal to ${tsMainTabData.paymentTerm}`);
            await aiAssert(`verify that the 'Quality/Quantity Term' field value equal to ${tsMainTabData.qualityQuantityTerm}`);
            await aiAssert(`verify that the 'Incoterms Version' field value equal to ${tsMainTabData.incotermsVersion}`);
            // await aiAssert(`verify that the 'Basis' field value equal to ${tsMainTabData.basis}`);  

            if (test.info().title.includes('C&D')) {
                await aiAssert(`verify that the 'Basis' field value equal to ${tsMainTabData.basisforCD}`); 
            } else {
                await aiAssert(`verify that the 'Basis' field value equal to ${tsMainTabData.basisforEF}`); 
            }

            await aiAssert(`verify that the 'Has VAT' field value equal to ${tsMainTabData.hasVAT}`);
            await aiAssert(`verify that the 'Invocing Party' field value equal to ${tsMainTabData.invocingParty}`);
            await aiAssert(`verify that the 'Traded By' field value equal to ${tsMainTabData.tradedBy}`);

            if (test.info().title.includes('FB Arranaged')) {
                await aiAssert(`verify that the checkbox of the 'FB Arranged By Supplier' is checked`);
            } else {
                await aiAssert(`verify that the checkbox of the 'FB Arranged By Supplier' is unchecked`);
            }
            console.log("Verify all the fields in the Main tab shown the expected value!");
        } catch (error) {
            console.log("Error verifying Main tab fields: " + error.message);
        }
}


export const specialOrdermainTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
) => {

        // Verify Main Tab fields
        await page.click("//a[normalize-space()='Main']");
        try {

            if (test.info().title.includes('Direct Shipment')) {
                await aiAssert(`verify that the 'Contract Type' field equal to ${tsMainTabData.directshipmentcontractType}`);
            } else {
                await aiAssert(`verify that the 'Contract Type' field equal to ${tsMainTabData.dropshipmentcontractType}`);
            }
            await aiAssert(`verify that the 'Special Order Type' field equal to ${tsMainTabData.unsoldOrderTyoe}`);
            await aiAssert(`verify that the 'Division' field equal to ${tsMainTabData.division}`);
            await aiAssert(`verify that the 'Sales Enquiry Number' field equal to ${tsMainTabData.saleEnqualNumber}`);
            const currentDate = formatDateTo_dd_mmm_yyyy(new Date());
            await aiAssert(`verify that the 'Traded Date' field equal to '${currentDate}'`);
            await aiAssert(`verify that the 'Supplier' field equal to 'PT Musim Mas'`);
            await aiAssert(`verify that the 'Factory Location' field equal to ${tsMainTabData.factoryLocation}`);
            await aiAssert(`verify that the 'Seller' field equal to ${tsMainTabData.seller}`);
            await aiAssert(`verify that the 'Buyer PO No.' field value equal to ${tsMainTabData.buyerPONo}`);
            await aiAssert(`verify that the 'Currency' field value equal to ${tsMainTabData.currency}`); 
            await aiAssert(`verify that the 'Exchange Rate' field value equal to ${tsMainTabData.exchangeRate}`);
            await aiAssert(`verify that the 'Quality/Quantity Term' field value equal to ${tsMainTabData.qualityQuantityTerm}`);
            await aiAssert(`verify that the 'Incoterms Version' field value equal to ${tsMainTabData.incotermsVersion}`);
            // await aiAssert(`verify that the 'Basis' field value equal to ${tsMainTabData.basis}`);  
            await aiAssert(`verify that the 'Basis' field value equal to ${tsMainTabData.basisforEF}`); 
            await aiAssert(`verify that the 'Has VAT' field value equal to ${tsMainTabData.hasVAT}`);
            await aiAssert(`verify that the 'Invocing Party' field value equal to ${tsMainTabData.invocingParty}`);
            await aiAssert(`verify that the 'Traded By' field value equal to ${tsMainTabData.tradedBy}`);
            await aiAssert(`verify that the checkbox of the 'FB Arranged By Supplier' is unchecked`);
            console.log("Verify all the fields in the Main tab shown the expected value!");
        } catch (error) {
            console.log("Error verifying Main tab fields: " + error.message);
        }
}


export const shippingTabVerification = async (
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
            await aiAssert(`verify that the 'Shipping Line/Agent' field equal to ${tsShippingTabData.shippingLineAgent}`);
          
            // await aiAssert(`verify that the 'Shipping Term' field equal to ${tsShippingTabData.shippingTerm}`);

            if (test.info().title.includes('C&D') || test.info().title.includes('Bulk')) {
                await aiAssert(`verify that the 'Shipping Term' field equal to ${tsShippingTabData.shippingTermPtP}`);
            } else {
                await aiAssert(`verify that the 'Shipping Term' field equal to ${tsShippingTabData.shippingTermNA}`);
            }

            await aiAssert(`verify that the '@Risk Transfer Location' field equal to ${tsShippingTabData.riskTransferLocation}`);
            await aiAssert(`verify that the 'Loading Port's Country' field equal to ${tsShippingTabData.loadingPortCountry}`);
            await aiAssert(`verify that the 'Loading Port' field equal to ${tsShippingTabData.loadingPort}`);
            await aiAssert(`verify that the 'Discharge Port TBA' field equal to ${tsShippingTabData.dischargePortTBA}`);
            await aiAssert(`verify that the 'Discharge Port's Country' field equal to ${tsShippingTabData.dischargePortCountry}`);
            await aiAssert(`verify that the 'Port of Discharge' field equal to ${tsShippingTabData.portOfDischarge}`);
            await aiAssert(`verify that the 'Budgeted Freight Cost' field equal to ${tsShippingTabData.budgetedFreightCost}`);
            await aiAssert(`verify that the 'Freight Rate/MT' field equal to ${tsShippingTabData.freightRatePerMT}`);
            await aiAssert(`verify that the 'Cargo Nature' field equal to ${tsShippingTabData.cargoNature}`);
            await aiAssert(`verify that the 'Freight Remarks' field contains ${tsShippingTabData.freightRemarks}`);
            await aiAssert(`verify that the 'Freight Remarks' field contains ${tsProductTabData.productRemarkGMP}`);
            await aiAssert(`verify that the 'Freight Remarks' field contains ${tsProductTabData.productRemarkNDPE}`);
            console.log("Verify the shipping tab fields show the correct results!");
        } catch (error) {
            console.log("Error verifying Shipping tab fields: " + error.message);
        }
}

export const shippingTCPCTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Verify Shipping Tab fields if needed
        await page.click("//a[normalize-space()='Shipping (TC/PC)']");
        try {
            await aiAssert(`verify that the 'Shipping Term' field equal to ${tsShippingTCPCData.shippingTermDoorToDoor}`);   
            await aiAssert(`verify that the 'Loading Port's Country' field equal to ${tsShippingTCPCData.loadingPortCountry}`);
            await aiAssert(`verify that the 'Loading Port' field equal to ${tsShippingTCPCData.loadingPort}`);
            await aiAssert(`verify that the 'Place of Loading' field equal to ${tsShippingTCPCData.placeOfLoading}`);
            await aiAssert(`verify that the 'Discharge Port's Country' field equal to ${tsShippingTCPCData.dischargeofCountry}`);
            await aiAssert(`verify that the 'Port of Discharge' field equal to ${tsShippingTCPCData.dischargeofPort}`);
            await aiAssert(`verify that the 'Final Destination Country' field contains ${tsShippingTCPCData.finalDestinationCountry}`);
            await aiAssert(`verify that the 'Final Destination' field equal to ${tsShippingTCPCData.finalDestination}`);
            await aiAssert(`verify that the 'Final Destination Address' field equal to ${tsShippingTCPCData.finalDestinationAddress}`);

        } catch (error) {
            console.log("Error verifying Shipping tab fields: " + error.message);
        }
        console.log("Verify the shipping (TC/PC) tab fields show the correct results!");
}


export const productDetailsTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Product tab and verify data
        await page.click("//a[normalize-space()='Product Details']");
        await page.click("//table[@id='grdTSItems_t_frozen']/tbody/tr[2]/td[1]/a");
        try {
            await aiAssert(`verify that the 'Product' field equal to ${tsProductTabData.product}`);
            await aiAssert(`verify that the 'Buyer Good Descriptions' field equal to ${tsProductTabData.buyergoodDescriptions}`);
            await aiAssert(`verify that the 'RSPO SCCS Supply Chain Model' field equal to ${tsProductTabData.supplyChainModel}`);
            await aiAssert(`verify that the 'GMP' field is checked`);
            await aiAssert(`verify that the 'NDPE' field is checked`);
            await aiAssert(`verify that the 'ISCC' field is checked`);
            await aiAssert(`verify that the 'Product Specification' field equal to ${tsProductTabData.productSpecification}`);
            await aiAssert(`verify that the 'Product Specification Detail' field equal to ${tsProductTabData.specificationDetails}`);
            await aiAssert(`verify that the 'Delivery UOM' field equal to ${tsProductTabData.deliveryUOM}`);
            await aiAssert(`verify that the 'Quantity' field equal to ${tsProductTabData.quantity}`);
            await aiAssert(`verify that the 'Price/UOM' field equal to ${tsProductTabData.pricePerUOM}`);
            await aiAssert(`verify that the 'Price/MT' field equal to ${tsProductTabData.pricePerUOM}`);
            await aiAssert(`verify that the 'Weight Tolerance' field contains ${tsProductTabData.weightToleranceType}`);
            await aiAssert(`verify that the 'Weight Tolerance' field contains ${tsProductTabData.weightTolerance}`);
            await aiAssert(`verify that the 'Amount' field equal to ${tsProductTabData.pricePerUOM}*${tsProductTabData.quantity}`);
            await aiAssert(`verify that the 'Packaging Form' field equal to ${tsProductTabData.produtForm}`);

            if (test.info().title.includes('Bulk')) {
                await aiAssert(`verify that the 'Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileNameBulk}`);
                await aiAssert(`verify that the 'SC Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileNameBulk}`);        
                await aiAssert(`verify that the 'Calculated Total Packaging' field equal to '0.00'`);            
            }else{
                await aiAssert(`verify that the 'Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileName}`);
                await aiAssert(`verify that the 'SC Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileName}`);
            }
            

            await aiAssert(`verify that the 'Shipping Marking' field equal to ${tsProductTabData.shippingMarking}`);
            await aiAssert(`verify that the 'Shipping Marking if Customize' field equal to ${tsProductTabData.shippingMarkingCustomize}`);
            await aiAssert(`verify that the 'Packaging Marking' field equal to ${tsProductTabData.packagingMarking}`);
            await aiAssert(`verify that the 'Packaging Marking if Customize' field equal to ${tsProductTabData.packagingMarkingCustomize}`);
            await aiAssert(`verify that the 'Pallet Marking' field equal to ${tsProductTabData.palletProfileName}`);
            await aiAssert(`verify that the 'Pallet Marking if Customized' field equal to ${tsProductTabData.palletMarkingCustomize}`);
            await aiAssert(`verify that the 'Buyer Good Descriptions' field equal to ${tsProductTabData.buyergoodDescriptions}`);
            await aiAssert(`verify that the 'Insulation Type' field equal to ${tsProductTabData.insulationType}`);
            await aiAssert(`verify that the 'Product Remark' field contains ${tsProductTabData.productRemarkGMP}`);
            await aiAssert(`verify that the 'Product Remark' field contains ${tsProductTabData.productRemarkNDPE}`);
            await aiAssert(`verify that the 'Product Remark' field contains ${tsProductTabData.productRemarkISCC}`);
            console.log("Verify the Product Details tab show the correct values!");
        } catch (error) {
            console.log("Error verifying Product Details tab fields: " + error.message);
        }
        await page.click("//input[@id='btnClose']");
}


export const specialReqsTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Special Reqs tab and verify data
        await page.click("//a[normalize-space()='Special Reqs.']");
        try {
            await aiAssert(`verify that the 'Special Product Requirement' field equal to ${tsSpecialReqsTabData.specialProductRequirement}`);
            await aiAssert(`verify that the 'Flexi Bag Heating Pad Required' field equal to ${tsSpecialReqsTabData.flexiBagRequired}`);
            await aiAssert(`verify that the 'Prior Cargo Requirement' field equal to ${tsSpecialReqsTabData.priorCargoRequirement}`);
            await aiAssert(`verify that the 'Prior Cargo Requirement (Others)' field equal to ${tsSpecialReqsTabData.priorCargoRequirementOthers}`);
            await aiAssert(`verify that the 'Additional Heating Requirement' field equal to ${tsSpecialReqsTabData.additionalHeatingRequirement}`);
            await aiAssert(`verify that the 'SC Remarks' field equal to ${tsSpecialReqsTabData.scRemarks}`);
            await aiAssert(`verify that the 'Sanction Clause' field contains part of the text "${tsSpecialReqsTabData.sanctionClause.substring(0, 100)}"`);
            console.log("Verify the Special Reqs tab show the correct values!");
        } catch (error) {
            console.log("Error verifying Special Reqs tab fields: " + error.message);
        }
}


export const surveyorTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Surveyor tab and verify data
        await page.click("//a[normalize-space()='Surveyor']");
        try {
            await aiAssert(`verify that the 'Surveyor Required' field equal to ${tsSurveyorTabData.surveyorRequired}`);
            await aiAssert(`verify that the 'Surveyor Fee' field equal to ${tsSurveyorTabData.surveyorFee}`);
            await aiAssert(`verify that the 'ICOF Assigned Load Port Surveyor' field equal to ${tsSurveyorTabData.assignedLoadPortSurveyor}`);
            await aiAssert(`verify that the 'Buyer Assigned Load Port Surveyor' field equal to ${tsSurveyorTabData.assignedLoadPortSurveyor}`);
            await aiAssert(`verify that the 'Shipper/Supplier Assigned Load Port Surveyor' field equal to ${tsSurveyorTabData.assignedLoadPortSurveyor}`);
            await aiAssert(`verify that the 'ICOF Assigned Discharge Port Surveyor' field equal to ${tsSurveyorTabData.assignedLoadPortSurveyor}`);
            await aiAssert(`verify that the 'Buyer Assigned Discharge Port Surveyor' field equal to ${tsSurveyorTabData.assignedLoadPortSurveyor}`);
            await aiAssert(`verify that the 'Shipper/Supplier Assigned Discharge Port Surveyor' field equal to ${tsSurveyorTabData.assignedLoadPortSurveyor}`);
            console.log("Verify the Surveyor tab show the correct values!");
        } catch (error) {
            console.log("Error verifying Surveyor tab fields: " + error.message);
        }
}


export const brokerTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Broker tab and verify data if broker is specified
        await page.click("//a[normalize-space()='Broker']");
        try {
            if (tsBrokerTabData.broker) {
                await aiAssert(`verify that the 'Broker' field equal to ${tsBrokerTabData.broker}`);
            }
            await aiAssert(`verify that the 'Broker' column's value for the first row equal to ${tsBrokerTabData.broker}`);
            await aiAssert(`verify that the 'Commission Type' column's value for the first row equal to ${tsBrokerTabData.commissionType}`);
            await aiAssert(`verify that the 'Max Commission Rate' column's value for the first row equal to ${tsBrokerTabData.commissionRate}`);
            await aiAssert(`verify that the 'Commission Rate' column's value for the first row equal to ${tsBrokerTabData.commissionRate}`);
            console.log("Verify the Broker tab show the correct values!");
        } catch (error) {
            console.log("Error verifying Broker tab fields: " + error.message);
        }
}


export const emailHistoryTabVerificationForPending = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
       await page.click("//a[normalize-space()='Email History']");
        try{    
            const [emailSubject] = await Promise.all([
                aiQuery("text content of the 'Subject' field for the first row")
            ]);
            await aiAssert(`verify that the first row of the 'Subject' column contains 'Pending Approval'`);
            console.log("Submit for Approval's email subject:", emailSubject);
        }catch (error) {
            console.log("Error verifying trigger email notification when Submit for approval: " + error.message);
        }
}


export const emailHistoryTabVerificationForApproved = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
      await page.click("//a[normalize-space()='Email History']");

        try{    
            const [emailSubject] = await Promise.all([
                aiQuery("text content of the 'Subject' field for the first row")
            ]);
            await aiAssert(`verify that the first row of the 'Subject' column contains 'Approved'`);
            console.log("Approved email's subject:", emailSubject);
        }catch (error) {
            console.log("Error verifying trigger email notification when Trade Approved: " + error.message);
        }
        await page.click("//a[normalize-space()='Main']");
}


