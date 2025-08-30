import { expect } from '@playwright/test';
import { test } from "../../../fixture";
import { testCredentials, freightChargeData } from '../../data/freightChargeTestData';
import { click, type, typeAndTab, dropdown, popupselection } from '../../utils/baseTest';
import { login } from '../../utils/baseCase';

// Timeout removed - using global configuration

test.beforeEach(async ({ page }) => {
  // Using the login function from baseCase.ts
  await login(page);
});

test("Freight Charge Creation and Release", async ({ ai, aiInput, aiQuery, aiAssert, aiTap, page }) => {
  // Login is now handled in beforeEach hook
  
  // Verify successful login
  await aiAssert('username is visible in the top-right corner');

  // Section 1: Freight Info
  // Navigate to Freight menu
  await aiTap(freightChargeData.menuName + ' menu');

  // Select New link under Freight Charge menu
  await ai(`click '${freightChargeData.submenuName}' link under Freight Charge menu`);

  // Wait for the page to fully load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Select Shipping Term
  await ai('click Shipping Term dropdown menu');
  // await ai(`select '${freightChargeData.shippingTerm}' option`);

  // Select Port of Loading
  await ai('click Port of Loading dropdown menu');
  await ai(`select '${freightChargeData.placeOfLoading}' option`);

  // Enter Country of Destination
  await ai(`enter '${freightChargeData.countryOfDestination}' in Country of Destination field and press Tab key`);

  // Select Port of Discharge
  await ai('click Port of Discharge dropdown menu');
  await ai(`select '${freightChargeData.portOfDischarge}' option`);

  // Select Freight Indication
  await ai('click Freight Indication dropdown menu');
  await ai(`select '${freightChargeData.freightIndication}' option`);

  // Select Shipping Line using popup
  await ai('click Shipping Line popup icon');
  await ai(`enter '${freightChargeData.shippingLine}' in Name field`);
  await ai('click Search button');
  await ai(`verify '${freightChargeData.shippingLine}' appears in results`);
  await ai('click Select button');

  // Enter Final Destination Country
  await ai(`enter '${freightChargeData.finalDestinationCountry}' in Final Destination Country field and press Tab key`);

  // Select Final Destination
  await ai('click Final Destination dropdown menu');
  await ai(`select '${freightChargeData.finalDestination}' option`);

  // Enter Transit Time
  await ai(`enter '${freightChargeData.transitTime}' in Transit Time field`);

  // Select Cargo Nature
  await ai('click Cargo Nature dropdown menu');
  await ai(`select '${freightChargeData.cargoNature}' option`);

  // Select Carrier
  await ai('click Carrier button');
  await ai('select first option from dropdown');

  // Fill General Information and Freight Rate
  await ai(`enter '${freightChargeData.generalInformation}' in General Information field`);
  await ai(`enter '${freightChargeData.freightRate}' in Freight Rate field`);
  await ai(`enter '${freightChargeData.freeTimeDetention}' in Free Time Detention field`);
  await ai(`enter '${freightChargeData.demurrage}' in Demurrage field`);
  await ai(`enter '${freightChargeData.freeTimeCombined}' in Free Time Combined field`);
  await ai(`enter '${freightChargeData.plantsRemarks}' in Plants Remarks field`);
  await ai(`enter '${freightChargeData.shippingRemarks}' in Shipping Remarks field`);
  await ai(`enter '${freightChargeData.marketingRemarks}' in Marketing Remarks field`);

  // Section 2: Submission and Release
  // Submit for Release
  await ai('click Save & Submit for Release button');
  await ai('click OK in prompt window');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Verify Freight Charge number and status
  const [fcNumber, pendingStatus] = await Promise.all([
    aiQuery("text content of 'Freight Charge No' field"),
    aiQuery("text content of 'Status' field")
  ]);

  await aiAssert(`Freight Charge ${fcNumber} is displayed`);
  await aiAssert(`Status shows '${freightChargeData.pendingStatus}'`);
  console.log(`Freight Charge Number: ${fcNumber}`);
  console.log(`Freight Charge Status: ${pendingStatus}`);

  // Release the Freight Charge
  await ai('click Release button');
  await ai('click OK in prompt window');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Verify Released status
  const [releasedStatus] = await Promise.all([
    aiQuery("text content of 'Status' field")
  ]);
  console.log(`Released Status: ${releasedStatus}`);
  await aiAssert(`Status shows '${freightChargeData.releasedStatus}'`);
});