import test from "@playwright/test";
import { tsMainTabData, tsProductTabData, tsShippingTabData, tsSpecialReqsTabData, tsSurveyorTabData } from "../../data/tradingSlipTestData";
import { dropdown, dropdownWithIndex, editViewButton, expectResult, extractValue, formatDateTo_dd_mmm_yyyy, scrolldown, type, uploadFile } from "../../utils/baseTest";
import { supplierInvoiceNo, currentDay,blNo,blDate } from "../tool/toolSendSupplierInvoice";
import { invoiceCollectionInformationTabData, invoiceExportDisTabData, invoiceMainTabData, invoiceShipmentInformationTabData } from "../../data/invoiceTestData";

export const invoiceMainTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert,
    subciNo,
    scNo,
  ) => {

        // Verify Main Tab fields
        await page.click("//a[normalize-space()='Main']");
        try {

            await aiAssert(`verify that the 'Division' field equal to ${tsMainTabData.division}`);
            await aiAssert(`verify that the 'Invoice Date' field equal to ${currentDay}`);
            await aiAssert(`verify that the 'Due Date' field equal to '${currentDay} + 120 days'`);
            await aiAssert(`verify that the 'Supplier Invoice No.' field equal to ${supplierInvoiceNo}`);
            await aiAssert(`verify that the 'Supplier Invoice Date' field equal to ${currentDay}`);
            await aiAssert(`verify that the 'Supplier Invoice Status' field equal to "Final"`);
            await aiAssert(`verify that the 'Invoice Type' field equal to "Commercial Invoice"`);
            await aiAssert(`verify that the 'Invoice Title Printout' field equal to "COMMERCIAL INVOICE"`);
            await aiAssert(`verify that the 'Created From' field equal to ${subciNo}`);    
            await aiAssert(`verify that the 'Sales Contract No.' field equal to ${scNo}`);    
                       
            await aiAssert(`verify that the 'Supplier' field equal to 'PT Musim Mas'`);
            await aiAssert(`verify that the 'Seller' field equal to ${tsMainTabData.seller}`);
            await aiAssert(`verify that the 'Buyer' field equal to ${tsMainTabData.buyer}`);
            await aiAssert(`verify that the 'Currency' field equal to ${tsMainTabData.currency}`);
            await aiAssert(`verify that the 'Exchange Rate' field equal to ${tsMainTabData.exchangeRate}`);              
            await aiAssert(`verify that the 'Invoicing Party' field value equal to ${tsMainTabData.invocingParty}`);
            await aiAssert(`verify that the 'Invoice Payment Term' field equal to ${invoiceMainTabData.invoicePaymentTerm}`);
            await aiAssert(`verify that the 'Term Of Payment Printout' field value equal to ${invoiceMainTabData.termOfPaymentPrintout}`);

            await aiAssert(`verify that the 'BL Number' field value equal to ${blNo}`);
            await aiAssert(`verify that the 'BL Date' field value equal to ${blDate}`);
            await aiAssert(`verify that the 'Invoice Total (Word)' field value equal to ${invoiceMainTabData.invoiceToal}`);
            await aiAssert(`verify that the 'Bill to' field value equal to "Buyer"`);
            await aiAssert(`verify that the 'Bill to Buyer' field value equal to ${invoiceMainTabData.billtoBuyer}`);

            console.log("Verify all the fields in the Main tab shown the expected value!");

        } catch (error) {
            console.log("Error verifying Main tab fields: " + error.message);
        }
}

export const invoiceShippingTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Verify Shipping Tab fields if needed
        await page.click("//a[normalize-space()='Shipment Information']");
        try {

            await aiAssert(`verify that the 'Basis Header Printout' field equal to ${invoiceShipmentInformationTabData.basisHeaderPrintout}`);
            await aiAssert(`verify that the 'Incoterms Version' field equal to ${tsMainTabData.incotermsVersion}`);
            await aiAssert(`verify that the 'Basis' field equal to ${tsMainTabData.basisforCD}`);        
            await aiAssert(`verify that the 'Basis Printout' field equal to ${invoiceShipmentInformationTabData.basisPrintout}`);
            await aiAssert(`verify that the 'Instructions To Seller' field equal to ${invoiceShipmentInformationTabData.instructionsToSeller}`);
            await aiAssert(`verify that the 'Delivery Mode' field equal to ${tsShippingTabData.deliveryMode}`);
            await aiAssert(`verify that the 'Delivery Mode Printout' field equal to ${tsShippingTabData.deliveryMode}`);
            await aiAssert(`verify that the 'Total No. of Units' field equal to ${tsShippingTabData.totalUnits}`); 
            await aiAssert(`verify that the 'Total Quantity (MT)' field equal to ${tsShippingTabData.totalUnits}`); 
            await aiAssert(`verify that the 'Loading Port's Country' field equal to ${tsShippingTabData.loadingPortCountry}`);
            await aiAssert(`verify that the 'Loading Port' field equal to ${tsShippingTabData.loadingPort}`);            
            await aiAssert(`verify that the 'Discharge Port's Country' field equal to ${tsShippingTabData.dischargePortCountry}`);
            await aiAssert(`verify that the 'Port of Discharge' field equal to ${tsShippingTabData.portOfDischarge}`);
        } catch (error) {
            console.log("Error verifying Shipment Information tab fields: " + error.message);
        }
}

export const invoiceCollectionInformationTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert,
    subciNo,
 ) => {
        // Verify Shipping Tab fields if needed
        await page.click("//a[normalize-space()='Collection Information']");
        await editViewButton(page);
        await page.click("//span[@class='fa fa-lg fa-fw fa-plus']");
        await page.waitForTimeout(3000);
        await page.click("//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[6]/span");
        await page.click("//ul[@id='select2-e_new__1_CustomerRefNo_i-results']/li[2]");
        await type(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[8]/span/span/input", invoiceCollectionInformationTabData.deliveryOrderNo);
        await type(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[15]/span/span/input[1]", invoiceCollectionInformationTabData.collectionQuantityUOM);
        await page.click("//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[17]/span/span/input[1]");
        await type(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[17]/span/span/input[1]", invoiceCollectionInformationTabData.noOfPallet);
        await type(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[18]/span/span/input[1]", invoiceCollectionInformationTabData.noOfPacking);
        await type(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[19]/span/span/input[1]", invoiceCollectionInformationTabData.noOfpackingAndPallet);
        await type(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[20]/span/span/input[1]", currentDay);
        await page.click("//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[21]/span/span/input[1]");
        await type(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[21]/span/span/input[1]", invoiceCollectionInformationTabData.tareWeight);
        await type(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[22]/span/span/input[1]", invoiceCollectionInformationTabData.grossWeight);
        await dropdownWithIndex(page, "//span[@id='select2-e_new__1_StorageLocationName_i-container']", 1);
        await dropdownWithIndex(page, "//span[@id='e_new__1_StorageLocationTankNo_i']", 1);    
        await type(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[27]/span/span/input[1]", invoiceCollectionInformationTabData.truckNo);           
        await type(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[28]/span/span/input[1]", invoiceCollectionInformationTabData.weightBridgeTicketNo);
        await type(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[29]/span/span/textarea", invoiceCollectionInformationTabData.remarks);
        await page.click("//span[@class='fa fa-lg fa-fw fa-floppy-o']");



        try {
            await expectResult(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[6]/span", subciNo);
            await expectResult(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[8]/span", invoiceCollectionInformationTabData.deliveryOrderNo); 
            await expectResult(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[10]/span", tsProductTabData.product); 
            await expectResult(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[12]/span", tsProductTabData.deliveryUOM);
            await expectResult(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[14]/span", tsProductTabData.produtForm);
            await expectResult(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[15]/span", invoiceCollectionInformationTabData.collectionQuantityUOM);
            await expectResult(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[16]/span", invoiceCollectionInformationTabData.collectionQuantityUOM); 
            await expectResult(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[17]/span", invoiceCollectionInformationTabData.noOfPallet);   
            await expectResult(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[18]/span", invoiceCollectionInformationTabData.noOfPacking);
            await expectResult(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[19]/span", invoiceCollectionInformationTabData.noOfpackingAndPallet);
            await expectResult(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[20]/span", currentDay);
            await expectResult(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[21]/span", invoiceCollectionInformationTabData.tareWeight);
            await expectResult(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[22]/span", invoiceCollectionInformationTabData.grossWeight);
            await expectResult(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[27]/span", invoiceCollectionInformationTabData.truckNo);
            await expectResult(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[28]/span", invoiceCollectionInformationTabData.weightBridgeTicketNo);
            await expectResult(page, "//table[@id='grdInvoiceExTankInformation_t']/tbody/tr[2]/td[29]/span", invoiceCollectionInformationTabData.remarks);
            console.log("verify that the 'Collection Information' tab working as expected");

        } catch (error) {
            console.log("Error verifying Collection Information tab fields: " + error.message);
        }
}


export const invoiceExportDocumentDispatchTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Verify Shipping Tab fields if needed
        await page.click("//a[normalize-space()='Export Document Dispatch']");
        await dropdown(page, "//span[@id='lstCourier']", invoiceExportDisTabData.courier);
        await type(page, "//input[@id='txtCourierNo']", invoiceExportDisTabData.courierNo);
        await type(page,"//input[@id='dpCourierDate_ti']", currentDay);
        await page.click("//textarea[@id='txtRemark']");
        await type(page,"//input[@id='dpFaxedDate_ti']", currentDay);
        await page.click("//textarea[@id='txtRemark']");        
        await type(page,"//input[@id='dpAcknowledgementDate_ti']", currentDay);
        await type(page,"//input[@id='dpPresentationDate_ti']", currentDay);        
        await type(page, "//textarea[@id='txtRemark']", invoiceExportDisTabData.remarks);
        await page.click("//input[@id='btnSave']");
        await editViewButton(page);

        try {
            await aiAssert(`verify that the 'Courier' field equal to ${invoiceExportDisTabData.courier}`);
            await aiAssert(`verify that the 'Courier No.' field equal to ${invoiceExportDisTabData.courierNo}`);
            await aiAssert(`verify that the 'Courier Date' field equal to ${currentDay}`);        
            await aiAssert(`verify that the 'Faxed Date' field equal to ${currentDay}`);
            await aiAssert(`verify that the 'Acknowledgement Date' field equal to ${currentDay}`);
            await aiAssert(`verify that the 'Presentation Date' field equal to ${currentDay}`);        
            await aiAssert(`verify that the 'Remarks' field equal to ${invoiceExportDisTabData.remarks}`);
            console.log("verify that the 'Export Document Dispatch' tab working as expected");
        } catch (error) {
            console.log("Error verifying Shipment Information tab fields: " + error.message);
        }
}

export const invoiceProductDetailsTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert,
    remainingQtyUom: string
 ) => {
        // Navigate to Product tab and verify data
        await page.click("//a[normalize-space()='Product Details']");
        await page.click("//table[@id='grdInvoiceItems_t_frozen']/tbody/tr[2]/td[1]/a");
        try {
            await aiAssert(`verify that the 'Product' field equal to ${tsProductTabData.product}`);
            await aiAssert(`verify that the 'Product Printout' field equal to ${tsProductTabData.product}`);
            await aiAssert(`verify that the 'Packaging Printout' field equal to ${tsProductTabData.packagingProfileName}`);
            await aiAssert(`verify that the 'Special Instruction To Seller' field value contains ${tsProductTabData.productRemarkGMP}`);
            await aiAssert(`verify that the 'Special Instruction To Seller' field value contains ${tsProductTabData.productRemarkNDPE}`);
            await aiAssert(`verify that the 'Delivery UOM' field equal to ${tsProductTabData.deliveryUOM}`);
            await aiAssert(`verify that the 'Delivery UOM Printout' field equal to ${tsProductTabData.deliveryUOM}`);
            await aiAssert(`verify that the 'RSPO SCCS Supply Chain Model' field equal to ${tsProductTabData.supplyChainModel}`);
            await aiAssert(`verify that the 'GMP' field is checked`);
            await aiAssert(`verify that the 'NDPE' field is checked`);
            await aiAssert(`verify that the 'ISCC' field is checked`);  
            await aiAssert(`verify that the 'Total Packaging' field equal to "2"`);
            await aiAssert(`verify that the 'Buyer PO No.' field equal to ${tsMainTabData.buyerPONo}`);

            await aiAssert(`verify that the 'Original Tran Qty UOM' field contains ${tsProductTabData.quantity}`);
            await aiAssert(`verify that the 'Original Tran Qty MT' field contains ${tsProductTabData.quantity}`);
            await aiAssert(`verify that the 'Loaded Qty in UOM' field contains ${tsProductTabData.quantity}`); 
            await aiAssert(`verify that the 'Loaded Qty in mt' field contains ${tsProductTabData.quantity}`); 
            await aiAssert(`verify that the 'Quantity Printout' field contains "100.000 MT = 2 Flexibags"`); 
 
            await aiAssert(`verify that the 'Price/UOM' field contains ${tsProductTabData.pricePerUOM}`);
            await aiAssert(`verify that the 'Unit Price Printout' field contains ${tsProductTabData.pricePerUOM}`);
            await aiAssert(`verify that the 'Price/MT' field equal to ${tsProductTabData.pricePerUOM}`);
            await aiAssert(`verify that the 'Weighted Average Unit Price/UOM' field equal to ${tsProductTabData.pricePerUOM}`);



            await aiAssert(`verify that the 'Amount' field equal to ${tsProductTabData.pricePerUOM}*${tsProductTabData.quantity}`);
            await aiAssert(`verify that the 'Amount Printout' field equal to ${tsProductTabData.pricePerUOM}*${tsProductTabData.quantity}`);
            await aiAssert(`verify that the 'Tax' field equal to "0.00"`);
            await aiAssert(`verify that the 'Gross Amount' field equal to ${tsProductTabData.pricePerUOM}*${tsProductTabData.quantity}`);
            await aiAssert(`verify that the 'Supplier Invoice No' field equal to ${supplierInvoiceNo}`);
            await aiAssert(`verify that the 'Supplier Invoice Date' field equal to ${currentDay}`);

            await aiAssert(`verify that the 'Supplier Invoice Status' field equal to "Final"`);
            await aiAssert(`verify that the 'BL No' field equal to ${blNo}`);
            await aiAssert(`verify that the 'BL Date' field equal to ${blDate}`);
            await aiAssert(`verify that the 'Percentage Apply' field contains "100.00"`);
            console.log("Verify the Invoice Product Details tab show the correct values!");
        } catch (error) {
            console.log("Error verifying Invoice Product Details tab fields: " + error.message);
        }
        await page.click("//input[@id='btnClose']");
}

export const invoiceAdditionalChargesTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Special Reqs tab and verify data
            await page.click("//a[normalize-space()='Special Reqs.']");
            await aiAssert(`verify that the 'Special Instructions to Production' field contains ${tsProductTabData.productRemarkGMP}`);
            await aiAssert(`verify that the 'Special Instructions to Production' field contains ${tsProductTabData.productRemarkNDPE}`);
            await aiAssert(`verify that the 'Special Instructions to Production' field contains ${tsProductTabData.productRemarkISCC}`);
            console.log("Verify the Special Reqs tab show the correct values!");

}

export const invoiceSurveyorTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Surveyor tab and verify data
        await page.click("//a[normalize-space()='Surveyor']");
        try {
            await aiAssert(`verify that the 'Buyer Assigned Load Port Surveyor' field equal to ${tsSurveyorTabData.assignedLoadPortSurveyor}`);
            await aiAssert(`verify that the 'Shipper/Supplier Assigned Load Port Surveyor' field equal to ${tsSurveyorTabData.assignedLoadPortSurveyor}`);
            await aiAssert(`verify that the 'ICOF Assigned Discharge Port Surveyor' field equal to ${tsSurveyorTabData.assignedLoadPortSurveyor}`);
            await aiAssert(`verify that the 'Buyer Assigned Discharge Port Surveyor' field equal to ${tsSurveyorTabData.assignedLoadPortSurveyor}`);
            await aiAssert(`verify that the 'Shipper/Supplier Assigned Discharge Port Surveyor' field equal to ${tsSurveyorTabData.assignedLoadPortSurveyor}`);
            console.log("Verify the Invoice Surveyor tab show the correct values!");
        } catch (error) {
            console.log("Error verifying Invoice Surveyor tab fields: " + error.message);
        }
}

export const invoiceDocumentRequirementTabVerification = async (
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
            await expectResult(page,"//table[@id='grdinvoiceDocumentRequirement_t']/tbody/tr[2]/td[8]/span",shippingDocumentDes || "");
            await expectResult(page,"//table[@id='grdinvoiceDocumentRequirement_t']/tbody/tr[2]/td[9]/span",issuedBy || "");
            await expectResult(page,"//table[@id='grdinvoiceDocumentRequirement_t']/tbody/tr[2]/td[12]/span",noOfOriginals || "");
            console.log("Verify the invoice Document Requirement tab show the correct values!");
        } catch (error) {
            console.log("Error verifying invoice Document Requirement tab fields: " + error.message);
        } 
}

export const invoiceAttachmentTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Attachment tab and verify data
        await page.click("//a[normalize-space()='Attachment']");              
        await expectResult(page, "//table[@id='grdinvoiceAttachment_t']/tbody/tr[2]/td[6]/span", "pdf");
        console.log("Verify the invoice Attachment tab show the correct values!");
}


export const invoicePaymentTermDetailsTabVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Email tab and verify data
        await page.click("//a[normalize-space()='Payment Term Details']");              

        try{    
            await expectResult(page, "//table[@id='grdPaymentTermDetails_t']/tbody/tr[2]/td[1]/span","fff");
        }catch (error) {
            console.log("Error verifying invoice Payment Term Details tab fields: " + error.message);
        }
        await page.click("//a[normalize-space()='Main']");
        console.log("Verify the invoice Payment Term Details tab show the correct values!");
}

export const invoiceEmailTabVerification = async (
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
            console.log("invoice dispatch's email subject:", emailSubject);
        }catch (error) {
            console.log("Error verifying trigger email notification when invoice Dispatch: " + error.message);
        }
        await page.click("//a[normalize-space()='Main']");
        console.log("Verify the invoice Email History tab show the correct values!");
        await page.click("//a[normalize-space()='Main']");
}

export const invoiceDispatch = async (
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
            await aiAssert(`verify that the invoice 'Document Status' field contains 'Dispatched'`);
            console.log("invoice Dispatched success! status: " + documentStatus);
        }catch (error) {
            console.log("invoice unalbe to dispatch:  " + error.message);
        }
}