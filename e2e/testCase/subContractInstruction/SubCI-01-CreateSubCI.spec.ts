import { extractValue, type } from '../../utils/baseTest';
import { subCITestData } from '../../data/subContractInstructionTestData';
import { subCIAttachmentTabVerification, subCIDispatch, subCIDocumentRequirementTabVerification, 
    subCIEmailTabVerification, subCIMainTabVerification, subCIPaymentTermDetailsTabVerification, 
    subCIProductDetailsTabVerification, subCIShippingTabVerification, subCISpecialReqsTabVerification, 
    subCISurveyorTabVerification } from '../../utils/subContractInstruction/subContractInstructionBaseCase';

export let subciNo: string;
export let subciID: string;
export let scNo: string;

export const subCICreateSubContractInstruction = async (        
    page,
    ai,
    aiQuery,
    aiAssert,
 ) => {
            // await page.click("//input[@id='btnEditView']");
            await page.click("//input[@id='btnCreateSubCI']");
            await page.click("//td[@aria-describedby='grdSCItems_t_SelectedSalesContractItem']/span//input");
            const remainingQtyUom = await extractValue(page,"//td[@aria-describedby='grdSCItems_t_RemainingQty']/span");
            await type(page,"//td[@aria-describedby='grdSCItems_t_PlannedQuantityInUOM']//input[1]",remainingQtyUom);
            await page.click("//input[@id='btnAdd']");  
            await aiAssert(`verify that the pop up message contain 'Sub Contract Instruction successfully created'`);
            await page.click("//button[@id='button-0']");
            await page.waitForTimeout(3000);

            const [subContractInstructionNumber, subciDocumentStatus,subciApprovalStatus,subciShippingStatus,subciID1,scNo1] = await Promise.all([
                aiQuery("text content of 'Shipment Ref No.' field"), 
                aiQuery("text content of 'Document Status' field"),
                aiQuery("text content of 'Approval Status' field"),
                aiQuery("text content of 'Shipping Status' field"),
                aiQuery("text content of 'ID' field"),
                aiQuery("text content of 'Sales Contract No.' field")
        ]);
            console.log("subCI ref No : " + subContractInstructionNumber + ", Document Status: " + subciDocumentStatus
                 + ", Approval Status: " + subciApprovalStatus + ", Shipping Status: "+ subciShippingStatus );                
          
                subciNo = subContractInstructionNumber;
                subciID = subciID1;
                scNo = scNo1;

            try{
                await aiAssert(`verify that the 'Document Status' field value contains ${subCITestData.draftDocumentStatus}`);
                await aiAssert(`verify that the 'Approval Status' field value contains ${subCITestData.noApprovalStatus}`);
                await aiAssert(`verify that the 'Shipping Status' field value contains ${subCITestData.pickedShippingStatus}`); 
            }catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                console.error("Error verifying subCI document status: " + msg);
            }

            await page.click("//a[normalize-space()='Shipping']");
            const shippingPeriodFrom = await extractValue(page,"//input[@id='drShippingPeriod_dFrom_ti']");
            const shippingPeriodTo = await extractValue(page,"//input[@id='drShippingPeriod_dTo_ti']");

            await type(page,"//input[@id='drRequestedSchedule_dFrom_ti']",shippingPeriodFrom);
            await type(page,"//input[@id='drRequestedSchedule_dTo_ti']",shippingPeriodTo);
            await page.click("//input[@id='btnSaveExisting']");

            await subCIMainTabVerification(page,  ai, aiQuery, aiAssert);    
            await subCIShippingTabVerification(page,  ai, aiQuery, aiAssert);
            await subCIProductDetailsTabVerification(page,  ai, aiQuery, aiAssert, remainingQtyUom);
            await subCISpecialReqsTabVerification(page,  ai, aiQuery, aiAssert);
            await subCISurveyorTabVerification(page,  ai, aiQuery, aiAssert);
            await subCIDocumentRequirementTabVerification(page,  ai, aiQuery, aiAssert);
            await subCIPaymentTermDetailsTabVerification(page,  ai, aiQuery, aiAssert);
            await subCIAttachmentTabVerification(page,  ai, aiQuery, aiAssert);
            await subCIDispatch(page,  ai, aiQuery, aiAssert);
            await subCIEmailTabVerification(page, ai, aiQuery, aiAssert);      
 };
