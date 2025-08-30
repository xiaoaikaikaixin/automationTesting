import test from "@playwright/test";
import { tsMainTabData, tsProductTabData, tsShippingTabData, tsSpecialReqsTabData, tsSurveyorTabData } from "../../data/tradingSlipTestData";
import { dropdown, dropdownWithIndex, expectResult, extractValue, formatDateTo_dd_mmm_yyyy, scrolldown, type, uploadFile } from "../baseTest";
import { ciTestData } from "../../data/contractInstructionTestData";
import { AiAssert, AiQuery } from "../tool/aiTypes";

let shippingDocumentDes: string = '';
let issuedBy: string = '';
let noOfOriginals: string = '';

export const ciMainTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
  ) => {

        // Verify Main Tab fields
        await page.click("//a[normalize-space()='Main']");
        await page.click("//input[@id='btnEditView']");
        const [CINo] = await Promise.all([
            aiQuery("text content of the 'Document Status' field "),
        ]);
        console.log('CINo is: ' + CINo);
        await expectResult(page, "//span[@id='lblPageTitle']", "CI")

        await type(page, "//textarea[@id='txtBankerDetails']", ciTestData.bankDetails);
        await type(page, "//textarea[@id='txtInTrustDetail']", ciTestData.inTrustDetails);
        await dropdownWithIndex(page, "//span[@id='lstInTrustOption']", 2);
        await page.click("//input[@id='btnSave']");
        await page.click("//input[@id='btnEditView']");
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
            await expectResult(page, "(//tbody/tr[6]/td[1]/div[1][1])[1]", tsMainTabData.buyerAddress);
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


            await aiAssert(`verify that the 'Bank Details' field value equal to ${tsMainTabData.incotermsVersion}`);
            await aiAssert(`verify that the 'Special Instruction To Seller' field value contains ${tsProductTabData.productRemarkGMP}`);
            await aiAssert(`verify that the 'Special Instruction To Seller' field value contains ${tsProductTabData.productRemarkNDPE}`);

            await aiAssert(`verify that the 'In Trust Details' field value equal to ${ciTestData.inTrustDetails}`);
            await aiAssert(`verify that the 'In Trust Option' field value equal to ${ciTestData.inTrustOption}`);

            


            console.log("Verify all the fields in the Main tab shown the expected value!");

        } catch (error) {
            console.log("Error verifying Main tab fields: " + error.message);
        }
}



export const ciShippingTabVerification = async (
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
            await aiAssert(`verify that the 'Cargo Nature' field equal to ${tsShippingTabData.cargoNature}`);
            await aiAssert(`verify that the 'Special Instruction To Shipping Department' field contains ${tsShippingTabData.freightRemarks}`);
            await aiAssert(`verify that the 'Special Instruction To Shipping Department' field contains ${tsProductTabData.productRemarkGMP}`);
            await aiAssert(`verify that the 'Special Instruction To Shipping Department' field contains ${tsProductTabData.productRemarkNDPE}`);
            console.log("Verify the shipping tab fields show the correct results!");
        } catch (error) {
            console.log("Error verifying Shipping tab fields: " + error.message);
        }
}



export const ciProductDetailsTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Product tab and verify data
        await page.click("//a[normalize-space()='Product Details']");
        await page.click("//table[@id='grdTSItems_t_frozen']/tbody/tr[2]/td[1]/span");
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
            await aiAssert(`verify that the 'Quantity (UOM)' field equal to ${tsProductTabData.quantity}`);
            await aiAssert(`verify that the 'Quantity (MT)' field equal to ${tsProductTabData.quantity}`);            
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
            await aiAssert(`verify that the 'Insulation Type' field equal to ${tsProductTabData.insulationType}`);
            await aiAssert(`verify that the 'Product Remark' field contains ${tsProductTabData.productRemarkGMP}`);
            await aiAssert(`verify that the 'Product Remark' field contains ${tsProductTabData.productRemarkNDPE}`);
            await aiAssert(`verify that the 'Product Remark' field contains ${tsProductTabData.productRemarkISCC}`);
            console.log("Verify the Product Details tab show the correct values!");
        } catch (error) {
            console.log("Error verifying Product Details tab fields: " + error.message);
        }
        await page.click("//button[@title='Close']");
}


export const ciSpecialReqsTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Special Reqs tab and verify data
        await page.click("//a[normalize-space()='Special Reqs.']");
        await page.click("//input[@id='btnEditView']");      
        await type(page, "//textarea[@id='txtAAndPMaterialRemarks']",ciTestData.apMaterialRemarks);
        await type(page, "//textarea[@id='txtCSPProductionTerm']",ciTestData.cspProductionTerm);
        await page.click("//input[@id='btnSaveExisting']")
        await page.click("//input[@id='btnEditView']"); 

        try {
            await aiAssert(`verify that the 'Special Product Requirement' field equal to ${tsSpecialReqsTabData.specialProductRequirement}`);
            await aiAssert(`verify that the 'Flexi Bag Heating Pad Required' field equal to ${tsSpecialReqsTabData.flexiBagRequired}`);
            await aiAssert(`verify that the 'Prior Cargo Requirement' field equal to ${tsSpecialReqsTabData.priorCargoRequirement}`);
            await aiAssert(`verify that the 'Prior Cargo Requirement (Others)' field equal to ${tsSpecialReqsTabData.priorCargoRequirementOthers}`);
            await aiAssert(`verify that the 'Additional Heating Requirement' field equal to ${tsSpecialReqsTabData.additionalHeatingRequirement}`);
            await aiAssert(`verify that the 'A & P Material Remarks' field contains ${ciTestData.apMaterialRemarks}`);
            await aiAssert(`verify that the 'CSP Production Term' field contains ${ciTestData.cspProductionTerm}`);
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


export const ciSurveyorTabVerification = async (
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

export const ciDocumentRequirementTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Document Requirement tab and verify data
        await page.click("//a[normalize-space()='Document Requirement']");
        await page.click("//input[@id='btnEditView']");
        await dropdown(page, "//span[@id='lstBLDetail']", ciTestData.blDetails);
        await type(page, "//textarea[@id='txtConsignee']", ciTestData.consignee);
        await type(page, "//textarea[@id='txtNotifyParty']", ciTestData.notifyParty);
        await page.click("//input[@id='btnDocumentRequirementAddRow']");

        const frame = page.frameLocator("//iframe[@id='Edit_Add_pop_fr1']");
        shippingDocumentDes = await extractValue(frame,"//table[@id='grdBusinessPartnerShippingDocumentRequirement_t']/tbody/tr[2]/td[3]/span");
        issuedBy = await extractValue(frame,"//table[@id='grdBusinessPartnerShippingDocumentRequirement_t']/tbody/tr[2]/td[4]/span");
        noOfOriginals = await extractValue(frame,"//table[@id='grdBusinessPartnerShippingDocumentRequirement_t']/tbody/tr[2]/td[5]/span");
        const noOfCopies = await extractValue(frame,"//table[@id='grdBusinessPartnerShippingDocumentRequirement_t']/tbody/tr[2]/td[6]/span");

        await frame.locator("//input[@id='cb_grdBusinessPartnerShippingDocumentRequirement_t']").click();
        await frame.locator("//input[@id='btnSave']").click();
        await expectResult(frame,"//div[@class='noty_message']//div[2]", "You have selected 10 record(s).")
        await frame.locator("//button[@id='button-0']").click();
        await page.waitForTimeout(3000);

        await page.click("//input[@id='btnSaveExisting']");
        await page.click("//input[@id='btnEditView']");

        try {
            await aiAssert(`verify that the 'BL Detail' field contains ${ciTestData.blDetails}`);
            await aiAssert(`verify that the 'Consignee' field contains ${ciTestData.consignee}`);
            await aiAssert(`verify that the 'Notify Party' field equal to ${ciTestData.notifyParty}`);
            await expectResult(page,"//table[@id='grdCIDocumentRequirement_t']/tbody/tr[2]/td[9]/span",shippingDocumentDes);
            await expectResult(page,"//table[@id='grdCIDocumentRequirement_t']/tbody/tr[2]/td[10]/span",issuedBy);
            await expectResult(page,"//table[@id='grdCIDocumentRequirement_t']/tbody/tr[2]/td[12]/span",noOfOriginals);

            console.log("Verify the Document Requirement tab show the correct values!");
        } catch (error) {
            console.log("Error verifying Document Requirement tab fields: " + error.message);
        }
}



export const ciAttachmentTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Attachment tab and verify data
        await page.click("//a[normalize-space()='Attachment']");     
        await page.click("//input[@id='btnEditView']");
        await page.click("//input[@id='btnAddFile']");
        await uploadFile(page, "//input[@id='fileUploadFile']", ciTestData.attachment);
        await page.click("//input[@id='btnSave']");
        try {
            await expectResult(page, "//table[@id='grdCIAttachment_t']/tbody/tr[2]/td[6]/span", "pdf");
        } catch (error) {
            console.log("Error verifying Attachment tab fields: " + error.message);
        }

        console.log("Verify the Attachment tab show the correct values!");
}

export const ciEmailTabVerification = async (
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
            await aiAssert(`verify that the first row of the 'Subject' column contains 'CI Dispatched for'`);
            console.log("CI dispatch's email subject:", emailSubject);
        }catch (error) {
            console.log("Error verifying trigger email notification when CI Dispatch: " + error.message);
        }
        await page.click("//a[normalize-space()='Main']");
        console.log("Verify the Email History tab show the correct values!");
}

export const ciDispatched = async (
    page: any,
    ai: any,
    aiQuery: AiQuery,
    aiAssert: AiAssert
 ) => {
        await page.click("//a[normalize-space()='Main']");              
        await page.click("//input[@id='btnEditView']");
        await page.click("//input[@id='btnDispatch']");
        await page.click("//button[@id='button-0']");
        await page.waitForTimeout(3000);

        try{    
            const [documentStatus] = await Promise.all([
            aiQuery("text content of the 'Document Status' field ")
         ]);
            await aiAssert(`verify that the 'Document Status' field contains 'Dispatched'`);
            console.log("CI document status:", documentStatus);
        }catch (error) {
            console.log("Error verifying 'Document Status' field when CI Dispatch: " + error.message);
        }
        console.log("Verify able to dispatch the contract instruction!");
        await page.click("//a[normalize-space()='Main']");
}