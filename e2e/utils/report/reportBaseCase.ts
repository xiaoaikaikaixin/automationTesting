import { expect } from '@playwright/test';
import { test } from '../../../fixture';
import { reportData } from '../../data/reportData';
import { click, type, typeAndTab, dropdown, popupbuttonselector,popupBrokerSelector,popupselection,formatDateTo_dd_mmm_yyyy,
    expectResult,scrolldown } from '../baseTest';


export const tradedDate = async (
    page: any,
      ) => {
        await page.fill("//input[@id='drTradedDate_dFrom_ti']", reportData.tradedDateFrom);
        await page.fill("//input[@id='drTradedDate_dTo_ti']", reportData.tradedDateTo);
 }

export const blDate = async (
    page: any,
      ) => {
        await page.fill("//input[@id='drBLPeriod_dFrom_ti']", reportData.tradedDateFrom);
        await page.fill("//input[@id='drBLPeriod_dTo_ti']", reportData.tradedDateTo);
 }


export const invoiceDate = async (
    page: any,
      ) => {
        await page.fill("//input[@id='drBLPeriod_dFrom_ti']", reportData.tradedDateFrom);
        await page.fill("//input[@id='drBLPeriod_dTo_ti']", reportData.tradedDateTo);
 }

 export const divisionSelect = async (
    page: any,
      ) => {
        await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", reportData.division);
 }

 export const deliveryModeSelect = async (
    page: any,
      ) => {
        await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDeliveryMode_lb']", reportData.deliveryMode);
        await page.click("//label[normalize-space()='Delivery Mode']")
 }

 export const supplierSelect = async (
    page: any,
      ) => {
        await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSupplier_lb']", reportData.supplier);
 }


 export const buyerSelect = async (
    page: any,
      ) => {
        await popupselection(page, "//input[@id='psacBuyer_pop']", '//iframe[@id="psacBuyer_pop_pop_fr1"]', reportData.buyer);
 }

 export const sellerSelect = async (
    page: any,
      ) => {
        await dropdown(page, "//span[@id='lstSeller']", reportData.seller);
 }

 export const shippingLineSelect = async (
    page: any,
      ) => {
        await dropdown(page, "//span[@id='lstShippingLine']", reportData.shippingLine);
 }


 export const etdPortOfLoadingSelect = async (
    page: any,
      ) => {
        await page.fill("//input[@id='drETDPortOfLoadingFrom_dFrom_ti']", reportData.dateFrom);
        await page.fill("//input[@id='drETDPortOfLoadingFrom_dTo_ti']", reportData.dateTo);
 }

 export const portOfLoadingSelect = async (
    page: any,
      ) => {
        await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddPortOfLoading_lb']", reportData.portOfLoading);
        await page.click("//label[normalize-space()='Port of Loading']");
 }

 export const factoryLocationSelect = async (
    page: any,
      ) => {
        await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddFactory_lb']", reportData.factoryLocation);
        await page.click("//label[normalize-space()='Port of Loading']");
 }


 export const invoiceStatusSelect = async (
    page: any,
      ) => {
        await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddInvoiceStatus_lb']", reportData.invoiceOpenStatus);
        await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddInvoiceStatus_lb']", reportData.invoicePaidStatus);
 }


 export const invoiceTypeSelect = async (
    page: any,
      ) => {
        await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddInvoiceType_lb']", reportData.invoiceType);
 }


 export const invoiceDefaultDateVerify = async (
    page: any,
      ) => {
        await expectResult(page, "//input[@id='drInvoicePeriod_dFrom_ti']",reportData.bldateFrom);
        await expectResult(page, "//input[@id='drInvoicePeriod_dTo_ti']",reportData.bldateTo);
 }

 export const blDefaultDateVerify = async (
    page: any,
      ) => {
        await expectResult(page, "//input[@id='drBLDate_dFrom_ti']",reportData.bldateFrom);
        await expectResult(page, "//input[@id='drBLDate_dTo_ti']",reportData.bldateTo);
 }

  export const dateVerify = async (page: any,selectorFrom: string,selectorTo: string) => {

        await expectResult(page, selectorFrom,reportData.bldateFrom);
        await expectResult(page, selectorTo,reportData.bldateTo);
 }




 export const consoleLog = async (
      ) => {
        console.log("Able to search the results and download the report successfully  " + test.info().title);
 }


 export const searchButton = async (
    page: any,
      ) => {
        await click(page, "//input[@id='btnSearch']");
        await page.waitForTimeout(2000);
 }





 export const exportExcelButton = async (
    page: any
      ) => {
        await page.click("//input[@id='btnPrint']");
        console.log(`Click 'Export -  Excel' button to download the file!`);
 }