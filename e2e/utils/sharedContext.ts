import { Page } from '@playwright/test';
import { testCredentials } from '../data/tradingSlipTestData';

/**
 * Verifies if the user is logged in, and if not, navigates to the home page
 * This replaces the direct login call in beforeEach hooks
 * @param page - Playwright Page object
 */
export const verifyLoggedIn = async (page: Page): Promise<boolean> => {
  try {
    // First check if we're on the login page or a blank page
    const currentUrl = page.url();
    if (currentUrl.includes('Login.aspx') || currentUrl === 'about:blank') {
      console.log('On login page or blank page - navigating to home page');
      // Navigate to the home page to use the stored authentication
      await page.goto(testCredentials.url.replace('Login.aspx', 'Default.aspx'), {
        waitUntil: 'networkidle',
        timeout: 30000
      });
    }
    
    // Wait for the page to be stable
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check if the username is visible on the page
    const usernameVisible = await page.isVisible('text=' + testCredentials.username) || 
                           await page.isVisible(`//span[contains(text(), '${testCredentials.username}')]`);
    
    if (!usernameVisible) {
      console.warn('User is not logged in: Username not visible. Authentication may have been lost.');
      return false;
    }
    
    console.log('User is logged in successfully');
    return true;
  } catch (error) {
    console.error('Error verifying login status:', error);
    return false;
  }
};

/**
 * Navigates to a specific URL within the application
 * Uses the existing authenticated context
 * @param page - Playwright Page object
 * @param path - Path to navigate to (will be appended to base URL)
 */
export const navigateTo = async (page: Page, path: string): Promise<void> => {
  try {
    // Extract the base URL from the testCredentials.url
    const baseUrl = new URL(testCredentials.url).origin;
    const fullUrl = `${baseUrl}/${path}`;
    
    await page.goto(fullUrl, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
  } catch (error) {
    console.error(`Navigation to ${path} failed:`, error);
    throw error;
  }
};