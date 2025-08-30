import { ciTestData } from '../../data/contractInstructionTestData';
import { statusData} from '../../data/tradingSlipTestData';

import { ciAttachmentTabVerification, ciDispatched, ciDocumentRequirementTabVerification, ciEmailTabVerification, ciMainTabVerification, ciProductDetailsTabVerification, ciShippingTabVerification, ciSpecialReqsTabVerification, ciSurveyorTabVerification } from '../../utils/contractInstruction/contractInstructionBaseCase';


import { 
    mainTabVerification, 
    shippingTabVerification, 
    productDetailsTabVerification, 
    specialReqsTabVerification,
    surveyorTabVerification, 
    brokerTabVerification, 
    emailHistoryTabVerificationForApproved
} from '../../utils/tradingSlip/tradingSlipBaseCase';


export const ciCreateContractInstruction = async (
    page,
    ai,
    aiQuery,
    aiAssert
 ) => {

            await page.click("//input[@id='btnCreateCI']");
            await page.waitForTimeout(3000);
            await ciMainTabVerification(page,  ai, aiQuery, aiAssert); 
            await ciShippingTabVerification(page,  ai, aiQuery, aiAssert); 
            await ciProductDetailsTabVerification(page,  ai, aiQuery, aiAssert); 
            await ciSpecialReqsTabVerification(page,  ai, aiQuery, aiAssert); 
            await ciSurveyorTabVerification(page,  ai, aiQuery, aiAssert); 
            await ciDocumentRequirementTabVerification(page,  ai, aiQuery, aiAssert); 
            await ciAttachmentTabVerification(page,  ai, aiQuery, aiAssert); 
            await ciDispatched(page,  ai, aiQuery, aiAssert);
            await ciEmailTabVerification(page,  ai, aiQuery, aiAssert);
 };
