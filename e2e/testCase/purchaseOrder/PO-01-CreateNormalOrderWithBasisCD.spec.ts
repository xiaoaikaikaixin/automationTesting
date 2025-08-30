
import { statusData} from '../../data/tradingSlipTestData';
import { poApproval, poEmailTabVerification, poMainTabVerification, poProductDetailsTabVerification, 
    poShippingTabVerification, 
    poSubmitForApproval} from '../../utils/purchaseOrder/purchaseOrderBaseCase';

// Timeout removed - using global configuration 

export const poCreateNormalOrderWithBasisCD = async (
    page,
    ai,
    aiQuery,
    aiAssert
 ) => {
            await poMainTabVerification(page,  ai, aiQuery, aiAssert);    
            await poShippingTabVerification(page,  ai, aiQuery, aiAssert);
            await poProductDetailsTabVerification(page,  ai, aiQuery, aiAssert);
            await poSubmitForApproval(page,  ai, aiQuery, aiAssert);
            await poEmailTabVerification(page,  ai, aiQuery, aiAssert);
            await poApproval(page,  ai, aiQuery, aiAssert);
             await poEmailTabVerification(page,  ai, aiQuery, aiAssert);           
 };
