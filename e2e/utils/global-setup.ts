import { chromium, FullConfig } from '@playwright/test';
import { testCredentials } from '../data/tradingSlipTestData';
import fs from 'fs';
import path from 'path';

/**
 * Global setup function that runs before all tests
 * Handles authentication once and saves the state for all tests
 */
async function globalSetup(config: FullConfig) {
  console.log('Starting global setup - performing login once for all tests');
  
  // Launch a browser
  const browser = await chromium.launch({
    args: ['--start-maximized']
  });
  
  // Create a new context
  const context = await browser.newContext({
    viewport: null,
    deviceScaleFactor: undefined
  });
  
  // Create a new page
  const page = await context.newPage();
  
  try {
    // Navigate to the login page
    await page.goto(testCredentials.url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Fill in login credentials
    await page.fill('input[name="txtUserID"]', testCredentials.userid);
    await page.fill('input[name="txtPassword"]', testCredentials.password);
    await page.click('input[name="btnLogin"]');
    await page.waitForTimeout(3000);
    
    // Verify successful login
    const usernameVisible = await page.isVisible('text=' + testCredentials.username) || 
                           await page.isVisible(`//span[contains(text(), '${testCredentials.username}')]`);
    
    if (!usernameVisible) {
      throw new Error('Global setup login failed: Username not visible after login');
    }
    
    console.log('Global setup login successful!');
    
    // Create the auth directory if it doesn't exist
    const authDir = path.join(process.cwd(), 'playwright/.auth');
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
    
    // Save the authentication state to a file
    await context.storageState({ path: path.join(authDir, 'user.json') });
    console.log('Authentication state saved successfully');
  } catch (error) {
    console.error('Global setup login failed:', error);
    throw error;
  } finally {
    // Close the browser
    await browser.close();
  }
}

export default globalSetup;