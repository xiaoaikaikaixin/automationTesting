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
    expectResult,
    scrolldown,
    extractValue,
    dropdownWithIndex
} from '../../utils/baseTest';


    test("ChatGPT - Testing", async ({ 
        ai, 
        aiInput, 
        aiQuery, 
        aiAssert, 
        aiTap, 
        page }) => {

            test.info().title = 'ChatGPT - Testing';          
            await page.goto(`https://chatai.musimmas.com/`);
            await page.waitForTimeout(3000);
            await type(page, "//input[@placeholder='Enter Your Email']", "aijuan.lin@icofgroup.com");
            await type(page, "//input[@placeholder='Enter Your Password']", "Yiyue003^^");
            await page.click("//button[normalize-space()='Sign in']");
            await page.waitForTimeout(3000);
            await expectResult(page, "//div[@class='self-center font-medium']", "Ai Juan");
            await type(page, "//div[@id='chat-input']", "tell me the joke");
            await page.click("//button[@id='send-message-button']//*[name()='svg']");
            await page.waitForTimeout(3000);
            await extractValue(page, "//div[@id='response-content-container']");
            // await expectResult(page, "//div[@id='response-content-container']", "");
        });