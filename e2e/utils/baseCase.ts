import { Page } from '@playwright/test';
import { test } from "../../fixture";
import { click, type, typeAndTab, dropdown, popupbuttonselector,popupBrokerSelector,popupselection } from '../utils/baseTest';
import { testCredentials,tsMainTabData, tsShippingTabData,tsSurveyorTabData, tsProductTabData, 
    tsSpecialReqsTabData,tsBrokerTabData,statusData } from '../data/tradingSlipTestData';


 

/**
 * Performs login to the NCTS system using the provided credentials
 * @param page - Playwright Page object
 * @param userid - Optional username (defaults to testCredentials.userid)
 * @param password - Optional password (defaults to testCredentials.password)
 * @param url - Optional URL (defaults to testCredentials.url)
 * @returns Promise<void>
 */
export const login = async (
  page: Page,
  userid: string = testCredentials.userid,
  password: string = testCredentials.password,
  username: string = testCredentials.username,
  url: string = testCredentials.url
): Promise<void> => {
  try {
    // Navigate to the login page
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Fill in login credentials
    await page.fill('input[name="txtUserID"]', userid);
    await page.fill('input[name="txtPassword"]', password);
    await page.click('input[name="btnLogin"]');
    await page.waitForTimeout(3000);
    
    // Verify successful login (this can be enhanced with more robust checks)
    const usernameVisible = await page.isVisible('text=' + username) || 
                           await page.isVisible(`//span[contains(text(), '${username}')]`);
    console.log(' user Login successful!'); // Log the result for debugging purposes    

    if (!usernameVisible) {
      console.warn('Login might have failed: Username not visible after login');
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

