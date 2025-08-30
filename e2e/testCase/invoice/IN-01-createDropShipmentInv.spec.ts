import { invoiceCollectionInformationTabVerification, invoiceExportDocumentDispatchTabVerification, invoiceMainTabVerification, invoiceProductDetailsTabVerification, invoiceShippingTabVerification, invoiceSurveyorTabVerification } from "../../utils/invoice/invoiceBaseCase";



export const invoiceCreateNormalOrderWithBasisCD = async (
    page,
    ai,
    aiQuery,
    aiAssert,
    subciNo,
    scNo,
  
 ) => {
        await invoiceMainTabVerification(page, ai, aiQuery, aiAssert,subciNo, scNo);
        await invoiceShippingTabVerification(page, ai, aiQuery, aiAssert);
        await invoiceCollectionInformationTabVerification(page, ai, aiQuery, aiAssert,subciNo);
        await invoiceExportDocumentDispatchTabVerification(page, ai, aiQuery, aiAssert);
        await invoiceProductDetailsTabVerification(page, ai, aiQuery, aiAssert,subciNo);
        await invoiceSurveyorTabVerification(page, ai, aiQuery, aiAssert);
 }
