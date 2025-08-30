import test from "@playwright/test";
import { tsMainTabData, tsProductTabData, tsShippingTabData, tsSpecialReqsTabData, tsSurveyorTabData } from "../../data/tradingSlipTestData";
import { dropdown, expectResult, extractValue, formatDateTo_dd_mmm_yyyy, scrolldown, type, uploadFile } from "../../utils/baseTest";
import { subCITestData } from "../../data/subContractInstructionTestData";
import { ciTestData } from "../../data/contractInstructionTestData";


export const subCIMainTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
  ) => {

        // Verify Main Tab fields
        await page.click("//a[normalize-space()='Main']");
        await page.click("//input[@id='btnEditView']");
        try {

            if (test.info().title.includes('Direct Shipment')) {
                await aiAssert(`verify that the 'Contract Type' field equal to ${tsMainTabData.directshipmentcontractType}`);
            } else {
                await aiAssert(`verify that the 'Contract Type' field equal to ${tsMainTabData.dropshipmentcontractType}`);
            }

            await aiAssert(`verify that the 'Division' field equal to ${tsMainTabData.division}`);
            await aiAssert(`verify that the 'Sales Enquiry Number' field equal to ${tsMainTabData.saleEnqualNumber}`);
            const currentDate = formatDateTo_dd_mmm_yyyy(new Date());
            await aiAssert(`verify that the 'Traded Date' field equal to '${currentDate}'`);
            await aiAssert(`verify that the 'Supplier' field equal to 'PT Musim Mas'`);
            await aiAssert(`verify that the 'Factory Location' field equal to ${tsMainTabData.factoryLocation}`);
            await aiAssert(`verify that the 'Seller' field equal to ${tsMainTabData.seller}`);
            await expectResult(page, "//span[@id='psacBuyer']", tsMainTabData.buyer);
            await expectResult(page, "(//tbody/tr[6]/td[1]/div[1])[1]", tsMainTabData.buyerAddress);
            await scrolldown(page);
            await aiAssert(`verify that the 'Buyer PO No.' field value equal to ${tsMainTabData.buyerPONo}`);
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

            await aiAssert(`verify that the 'Bank Details' field value equal to ${subCITestData.bankDetails}`);
            await aiAssert(`verify that the 'Special Instruction To Seller' field value contains ${tsProductTabData.productRemarkGMP}`);
            await aiAssert(`verify that the 'Special Instruction To Seller' field value contains ${tsProductTabData.productRemarkNDPE}`);

            await aiAssert(`verify that the 'In Trust Details' field value equal to ${subCITestData.inTrustDetails}`);
            await aiAssert(`verify that the 'In Trust Option' field value equal to ${subCITestData.inTrustOption}`);

            console.log("Verify all the fields in the Main tab shown the expected value!");

        } catch (error) {
            console.log("Error verifying Main tab fields: " + error.message);
        }
}

export const subCIShippingTabVerification = async (
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
            await aiAssert(`verify that the 'Cargo Nature' field equal to ${tsShippingTabData.cargoNature}`);
            await aiAssert(`verify that the 'Special Instruction To Shipping Department' field contains ${tsShippingTabData.freightRemarks}`);
            await aiAssert(`verify that the 'Special Instruction To Shipping Department' field contains ${tsProductTabData.productRemarkGMP}`);
            await aiAssert(`verify that the 'Special Instruction To Shipping Department' field contains ${tsProductTabData.productRemarkNDPE}`);
            console.log("Verify the shipping tab fields show the correct results!");
        } catch (error) {
            console.log("Error verifying Shipping tab fields: " + error.message);
        }
}

export const subCIProductDetailsTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert,
    remainingQtyUom: string
 ) => {
        // Navigate to Product tab and verify data
        await page.click("//a[normalize-space()='Product Details']");
        await page.click("//table[@id='grdSubCIItems_t_frozen']/tbody/tr[2]/td[2]/a");
        try {
            await aiAssert(`verify that the 'Product' field equal to ${tsProductTabData.product}`);
            await aiAssert(`verify that the 'Buyer Good Descriptions' field equal to ${tsProductTabData.buyergoodDescriptions}`);
            await aiAssert(`verify that the 'RSPO SCCS Supply Chain Model' field equal to ${tsProductTabData.supplyChainModel}`);
            await aiAssert(`verify that the '@GMP' field is checked`);
            await aiAssert(`verify that the 'NDPE' field is checked`);
            await aiAssert(`verify that the 'ISCC' field is checked`);
            await aiAssert(`verify that the 'Product Specification' field equal to ${tsProductTabData.productSpecification}`);
            await aiAssert(`verify that the 'Product Specification Detail' field equal to ${tsProductTabData.specificationDetails}`);
            await aiAssert(`verify that the 'Delivery UOM' field equal to ${tsProductTabData.deliveryUOM}`);
            await aiAssert(`verify that the 'Weight Tolerance' field contains ${tsProductTabData.weightToleranceType}`);
            await aiAssert(`verify that the 'Weight Tolerance' field contains ${tsProductTabData.weightTolerance}`);
            await aiAssert(`verify that the 'At Seller's Option' field is chekced`);
            await aiAssert(`verify that the 'Packaging Form' field equal to ${tsProductTabData.produtForm}`);

            if (test.info().title.includes('Bulk')) {
                await aiAssert(`verify that the 'Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileNameBulk}`);
                await aiAssert(`verify that the 'SC Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileNameBulk}`);        
                // await aiAssert(`verify that the 'Calculated Total Packaging' field equal to '0.00'`);            
            }else{
                await aiAssert(`verify that the 'Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileName}`);
                await aiAssert(`verify that the 'SC Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileName}`);
            }

            await aiAssert(`verify that the 'Remaining Quantity in UOM' field equal to ${tsProductTabData.quantity} - ${remainingQtyUom}    `);
            await aiAssert(`verify that the 'Planned Quantity in UOM' field equal to ${remainingQtyUom}`);            
            await aiAssert(`verify that the 'Planned Quantity in MT' field equal to ${remainingQtyUom}`);  
            await aiAssert(`verify that the 'Loaded Quantity in UOM' field equal to '0.000'`);  
            await aiAssert(`verify that the 'Loaded Quantity in MT' field equal to '0.000'`);  

            await aiAssert(`verify that the 'Shipping Marking' field equal to ${tsProductTabData.shippingMarking}`);
            await aiAssert(`verify that the 'Shipping Marking if Customize' field equal to ${tsProductTabData.shippingMarkingCustomize}`);
            await aiAssert(`verify that the 'Packaging Marking' field equal to ${tsProductTabData.packagingMarking}`);
            await aiAssert(`verify that the 'Packaging Marking if Customize' field equal to ${tsProductTabData.shippingMarkingCustomize}`);
            await aiAssert(`verify that the 'Pallet Marking' field equal to ${tsProductTabData.palletProfileName}`);
            await aiAssert(`verify that the 'Pallet Marking if Customize' field equal to ${tsProductTabData.packagingMarkingCustomize}`);

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

export const subCISpecialReqsTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Special Reqs tab and verify data
        await page.click("//a[normalize-space()='Special Reqs.']");
        await page.click("//input[@id='btnEditView']");      
        await type(page, "//textarea[@id='txtAAndPMaterialRemarks']",subCITestData.apMaterialRemarks);
        await type(page, "//textarea[@id='txtCSPProductionTerm']",subCITestData.cspProductionTerm);
        await page.click("//input[@id='btnEditView']"); 

        try {
            await aiAssert(`verify that the 'Special Product Requirement' field equal to ${tsSpecialReqsTabData.specialProductRequirement}`);
            await aiAssert(`verify that the 'Flexi Bag Heating Pad Required' field equal to ${tsSpecialReqsTabData.flexiBagRequired}`);
            await aiAssert(`verify that the 'Prior Cargo Requirement' field equal to ${tsSpecialReqsTabData.priorCargoRequirement}`);
            await aiAssert(`verify that the 'Prior Cargo Requirement (Others)' field equal to ${tsSpecialReqsTabData.priorCargoRequirementOthers}`);
            await aiAssert(`verify that the 'Additional Heating Requirement' field equal to ${tsSpecialReqsTabData.additionalHeatingRequirement}`);
            await aiAssert(`verify that the 'A & P Material Remarks' field contains ${subCITestData.apMaterialRemarks}`);
            await aiAssert(`verify that the 'CSP Production Term' field contains ${subCITestData.cspProductionTerm}`);
            await aiAssert(`verify that the 'Internal Remarks' field contains ${tsProductTabData.productRemarkGMP}`);
            await aiAssert(`verify that the 'Internal Remarks' field contains ${tsProductTabData.productRemarkNDPE}`);
            await aiAssert(`verify that the 'Internal Remarks' field contains ${tsProductTabData.productRemarkISCC}`);
            await aiAssert(`verify that the 'Special Instructions to Production' field contains ${tsProductTabData.productRemarkGMP}`);
            await aiAssert(`verify that the 'Special Instructions to Production' field contains ${tsProductTabData.productRemarkNDPE}`);
            await aiAssert(`verify that the 'Special Instructions to Production' field contains ${tsProductTabData.productRemarkISCC}`);
            console.log("Verify the Special Reqs tab show the correct values!");
        } catch (error) {
            console.log("Error verifying Special Reqs tab fields: " + error.message);
        }
}

export const subCISurveyorTabVerification = async (
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

export const subCIDocumentRequirementTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert,
    shippingDocumentDes?: string,
    issuedBy?: string,
    noOfOriginals?: string
 ) => {
        // Navigate to Document Requirement tab and verify data
        await page.click("//a[normalize-space()='Document Requirement']");

        try {
            await aiAssert(`verify that the 'BL Detail' field contains ${ciTestData.blDetails}`);
            await aiAssert(`verify that the 'Consignee' field contains ${ciTestData.consignee}`);
            await aiAssert(`verify that the 'Notify Party' field equal to ${ciTestData.notifyParty}`);
            await expectResult(page,"//table[@id='grdSubCIDocumentRequirement_t']/tbody/tr[2]/td[8]/span",shippingDocumentDes || "");
            await expectResult(page,"//table[@id='grdSubCIDocumentRequirement_t']/tbody/tr[2]/td[9]/span",issuedBy || "");
            await expectResult(page,"//table[@id='grdSubCIDocumentRequirement_t']/tbody/tr[2]/td[12]/span",noOfOriginals || "");
            console.log("Verify the SubCI Document Requirement tab show the correct values!");
        } catch (error) {
            console.log("Error verifying SubCI Document Requirement tab fields: " + error.message);
        } 
}

export const subCIAttachmentTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Attachment tab and verify data
        await page.click("//a[normalize-space()='Attachment']");              
        await expectResult(page, "//table[@id='grdSubCIAttachment_t']/tbody/tr[2]/td[6]/span", "pdf");
        console.log("Verify the SubCI Attachment tab show the correct values!");
}


export const subCIPaymentTermDetailsTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Email tab and verify data
        await page.click("//a[normalize-space()='Payment Term Details']");              

        try{    
            await expectResult(page, "//table[@id='grdPaymentTermDetails_t']/tbody/tr[2]/td[1]/span", subCITestData.paymentTermDetails);
        }catch (error) {
            console.log("Error verifying SubCI Payment Term Details tab fields: " + error.message);
        }
        await page.click("//a[normalize-space()='Main']");
        console.log("Verify the SubCI Payment Term Details tab show the correct values!");
}

export const subCIEmailTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Email tab and verify data
        await page.click("//a[normalize-space()='Email History']");              

        try{    
            const [emailSubject] = await Promise.all([
            aiQuery("text content of the 'Subject' field for the first row")
         ]);
            await aiAssert(`verify that the first row of the 'Subject' column contains 'Sub Contract Instruction Dispatched'`);
            console.log("SubCI dispatch's email subject:", emailSubject);
        }catch (error) {
            console.log("Error verifying trigger email notification when SubCI Dispatch: " + error.message);
        }
        await page.click("//a[normalize-space()='Main']");
        console.log("Verify the SubCI Email History tab show the correct values!");
        await page.click("//a[normalize-space()='Main']");
}

export const subCIDispatch = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        await page.click("//a[normalize-space()='Main']");           
        await page.click("//input[@id='btnDispatch']");   
        await page.click("//button[@id='button-0']");
        await page.reload();

        try{    
            const [documentStatus] = await Promise.all([
            aiQuery("text content of the 'Document Status' field")
         ]);
            await aiAssert(`verify that the SubCI 'Document Status' field contains 'Dispatched'`);
            console.log("SubCI Dispatched success! status: " + documentStatus);
        }catch (error) {
            console.log("SubCI unalbe to dispatch:  " + error.message);
        }
}