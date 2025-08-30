import { expectResult, extractValue, type } from '../../utils/baseTest';
import { subCITestData } from '../../data/subContractInstructionTestData';
import { subCIAttachmentTabVerification, subCIDispatch, subCIDocumentRequirementTabVerification, subCIEmailTabVerification, subCIMainTabVerification, subCIPaymentTermDetailsTabVerification, subCIProductDetailsTabVerification, subCIShippingTabVerification, subCISpecialReqsTabVerification, subCISurveyorTabVerification } from '../../utils/subContractInstruction/subContractInstructionBaseCase';
import { fbBookingTabVerification, fbCreation, fbFillInShipmentInformation, fbLookupFreightCharges, fbMainTabVerification, fbNominatedVerifiedAppproved, fbRelatedSubCITabVerification, fbShipmentTabVerification } from '../../utils/freightBooking/freightBookingBaseCase';
    

export const freightBookingCreationAndBooked= async (        
    page,
    ai,
    aiQuery,
    aiAssert,
    subciNo
 ) => {

            await fbCreation(page, ai, aiQuery, aiAssert);        
            await fbLookupFreightCharges(page, ai, aiQuery, aiAssert);
            await fbFillInShipmentInformation(page, ai, aiQuery, aiAssert);
            await fbNominatedVerifiedAppproved(page, ai, aiQuery, aiAssert, subciNo);
            await fbMainTabVerification(page, ai, aiQuery, aiAssert);
            await fbBookingTabVerification(page, ai, aiQuery, aiAssert);
            await fbShipmentTabVerification(page, ai, aiQuery, aiAssert);
            await fbRelatedSubCITabVerification(page, ai, aiQuery, aiAssert);

 }