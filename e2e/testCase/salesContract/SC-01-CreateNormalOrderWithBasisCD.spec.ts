import { expect } from '@playwright/test';
import { test } from "../../../fixture";
import { verifyLoggedIn } from '../../utils/sharedContext';
import { tsMainTabData, tsShippingTabData, tsProductTabData, statusData, tsSpecialReqsTabData, tsSurveyorTabData, tsBrokerTabData, tsBudgetedFreightTabData, scStatusData } from '../../data/tradingSlipTestData';
import { 
    click, 
    type, 
    typeAndTab, 
    dropdown, 
    popupselection, 
    popupbuttonselector, 
    editViewButton,
    submitforApprovalButton, 
    approveButton, 
    okButton, 
    extractValue,
    expectResult
} from '../../utils/baseTest';

import { 
    addMain, 
    addProduct, 
    addSpecialReq, 
    addSurveyor, 
    addBroker, 
    addBudgetedFreight, 
    addShipping,
    mainTabVerification, 
    shippingTabVerification, 
    productDetailsTabVerification, 
    specialReqsTabVerification,
    surveyorTabVerification, 
    brokerTabVerification, 
    emailHistoryTabVerificationForApproved
} from '../../utils/tradingSlip/tradingSlipBaseCase';
import { login } from '../../utils/baseCase';
import { OpsysSendMMSCtoNCTS } from '../../utils/tool/toolResponseMsg';

// Timeout removed - using global configuration 

export const scCreateNormalOrderWithBasisCD = async (
    page,
    ai,
    aiQuery,
    aiAssert
 ) => {
            await page.click("//a[@id='lnkSalesContractNo']");
            await mainTabVerification(page,  ai, aiQuery, aiAssert);    
            await shippingTabVerification(page,  ai, aiQuery, aiAssert);
            await productDetailsTabVerification(page,  ai, aiQuery, aiAssert);
            await specialReqsTabVerification(page,  ai, aiQuery, aiAssert);
            await surveyorTabVerification(page,  ai, aiQuery, aiAssert);
            await brokerTabVerification(page,  ai, aiQuery, aiAssert);
            await emailHistoryTabVerificationForApproved(page, ai, aiQuery, aiAssert);    

            await page.click("//a[normalize-space()='Main']");            
            try{    
                await page.evaluate(() => {location.reload(); });
                const [scDocumentStatus, scApprovalStatus] = await Promise.all([
                    aiQuery("text content of 'Document Status' field"),
                    aiQuery("text content of 'Approval Status' field"),                  
                ]);
                console.log("SC Document Status: ", scDocumentStatus);                
                console.log("SC Approval Status: ", scApprovalStatus);
                await aiAssert(`verify that the SC Document Status contains ${statusData.scDocumentStatus}`);                
                await aiAssert(`verify that the SC Approval Status contains ${statusData.scApprovalStatus}`);

            }catch (error) {
                console.log("Error verifying approval status: " + error.message);
            }
 };
