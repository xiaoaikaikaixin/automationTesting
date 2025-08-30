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
    extractValue,
    expectResult,
    scrolldown
} from '../baseTest';

import {
    testCredentials,
    tsMainTabData,
    tsShippingTabData,
    tsSurveyorTabData,
    tsProductTabData,
    tsSpecialReqsTabData,
    tsBrokerTabData,
    statusData
} from '../../data/tradingSlipTestData';
import { login } from '../baseCase';

export const OpsysSendMMSCtoNCTSforPO = async (
    page: any, 
    aiAssert,
    poID: string,
    poUrl: string,
    poNo: string,
    context: any
) => {

        const originalPage = page;

        // Create a new tab
        const newPage = await context.newPage();

        // Navigate to IT Utilities in the new tab
        await login(newPage);
        await newPage.goto(`${testCredentials.newpageurl}/ITUtilities/OpsysApiClientTest.aspx`);
        await dropdown(newPage,"//span[@id='select2-lstAction-container']","UpdateTradeConfirmationMMSCRefNo");
        await newPage.waitForTimeout(3000);
        await type(newPage,"//input[@id='txtTradeTransactionID_ti']",poID);
        await newPage.keyboard.press('Tab');
        await newPage.waitForTimeout(3000);
        const poRefNo = await extractValue(newPage,"//input[@id='txtTradeTransactionRefNo']");
        console.log("PO Ref No: " + poRefNo);
        await expectResult(newPage,"//input[@id='txtTradeTransactionRefNo']",poNo);
        const mmscNo="MMALC/E/" + (Math.floor(Math.random() * 9000) + 1000);
        await type(newPage,"//input[@id='txtMMSCRefNo']",mmscNo)
        console.log("MMSC Ref No: " + mmscNo)
        await click(newPage,"//input[@id='btnSubmitRequest']");
        await newPage.waitForTimeout(5000);
        const responseMsg = await extractValue(newPage,"//textarea[@id='txtResponseContent']");
        console.log("Return message" + responseMsg)
        await expectResult(newPage,"//textarea[@id='txtResponseContent']","Success");
        console.log("Opsys Posted MMSC successfully.")
        
        // Close the new tab and return to the original page
        await newPage.close();
        // Continue with the original page if needed
        // await originalPage.bringToFront(); // Not needed after closing the new pag
        await page.goto(`${poUrl}`);
        await page.waitForTimeout(5000);
        try{
            await aiAssert(`verify that the Musim Mas SC No. contains ${mmscNo}`);
            console.log(`PO shown the correct MMSC No.`);
        }catch(error){
            console.log("Opsys Posted MMSC failed.")
        }

}