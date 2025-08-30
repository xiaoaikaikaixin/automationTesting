import { expect } from '@playwright/test';
import { test } from 'fixture';
import { login } from 'e2e/utils/baseCase';
import { dropdown, type, expectResult } from 'e2e/utils/baseTest';
import { tsMainTabData, statusData } from 'e2e/data/tradingSlipTestData';
import { addMain } from 'e2e/utils/tradingSlip/tradingSlipBaseCase';

test('TS - Create Normal order with Basis is C&D', async ({ 
  ai, 
  aiInput, 
  aiQuery, 
  aiAssert, 
  aiTap, 
  page 
}) => {
  test.info().title = 'TS - Create Normal order with Basis is C&D';

  await login(page);
  await page.click(`//a[normalize-space()="${tsMainTabData.menuName}"]`);
  await page.click(`//a[normalize-space()="${tsMainTabData.submenuName}"]`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  await dropdown(page, '//span[@id="lstDivision"]', tsMainTabData.division);
  await type(page, '//input[@id="txtSalesEnquiryNo"]', tsMainTabData.saleEnqualNumber);

  await page.click('//span[@id="lstSupplier"]');
  await page.waitForTimeout(2000);
  await page.getByRole('treeitem', { name: tsMainTabData.supplier }).click();
  await expectResult(page, "//span[@id='select2-lstFactoryLocation-container']", tsMainTabData.factoryLocation);

  await page.click('//span[@id="lstSeller"]');
  await page.waitForTimeout(2000);
  await page.getByRole('treeitem', { name: tsMainTabData.seller }).click();

  await page.click("//input[@id='psacBuyer_pop']");
  const buyerFrame = page.frameLocator("//iframe[@id='psacBuyer_pop_pop_fr1']");
  await buyerFrame.locator("//input[@id='txtBPName']").fill(tsMainTabData.buyer);
  await buyerFrame.locator("//input[@id='btnSearch']").click();
  await page.waitForTimeout(3000);
  await buyerFrame.locator("//table[@id='grdBP_t']//tbody/tr[2]/td[1]").click();
  await page.waitForTimeout(1000);

  await type(page, "//input[@id='txtBuyerPONo']", tsMainTabData.buyerPONo);
  await dropdown(page, "//span[@id='lstPaymentTerm']", tsMainTabData.paymentTerm);
  await dropdown(page, "//span[@id='lstCurrency']", tsMainTabData.currency);
  await dropdown(page, "//span[@id='lstBasis']", tsMainTabData.basisforCD);

  await page.click("//span[@id='lstTrader']");
  await page.waitForTimeout(2000);
  const traderOptions = await page.locator('xpath=//li[contains(@class, "select2-results__option")]').all();
  if (traderOptions.length > 3) {
    await traderOptions[3].click();
  }

  await page.click('//input[@id="btnSave"]');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  const [tradingSlipNumber, tsApprovalStatus] = await Promise.all([
    aiQuery("text content of 'Trading Slip No.' field"),
    aiQuery("text content of 'Approval Status' field"),
  ]);
  await aiAssert(`Trading Slip ${tradingSlipNumber} is displayed`);
  await aiAssert(`${tsApprovalStatus} equal to ${statusData.draftStatus}`);
});
