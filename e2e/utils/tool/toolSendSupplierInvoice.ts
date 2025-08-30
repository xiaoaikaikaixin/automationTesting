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
    scrolldown,
    okButton,
    dropdownWithIndex
} from '../baseTest';

import {
    testCredentials,
} from '../../data/tradingSlipTestData';
import { login } from '../baseCase';
import { supplierInvoiceData } from '../../data/testToolTestData';


// Export these variables so they can be imported in other files
export let supplierInvoiceNo: string;
export let currentDay: string;
export let blNo: string;
export let blDate: string;

export const OpsysSendSupplierInvoice = async (
    page: any, 
    ai: any,
    aiTap: any,
    context: any,
    subciID: string,

) => {

        // Create a new tab
        const newPage = await context.newPage();

        // Navigate to IT Utilities in the new tab
        await login(newPage);
        await newPage.goto(`${testCredentials.newpageurl}/ITUtilities/OpsysApiClientTest.aspx`);
        await dropdown(newPage,"//span[@id='select2-lstAction-container']","UpdateCommercialSupplierInvoice");
        await newPage.waitForTimeout(3000);
        supplierInvoiceNo= "MM/PP/KE-2025" + (Math.floor(Math.random() * 9000) + 1000);
        console.log("Supplier Invoice No is " + supplierInvoiceNo);
        await type(newPage,"//input[@id='txtMMInvoiceNo']",supplierInvoiceNo);
        // await newPage.click("//span[@id='lstInvoiceStatus']");
        // await newPage.waitForTimeout(3000);
        // await newPage.click("//li[contains(text(),'Final')]");
        await dropdown(newPage,"//span[@id='lstInvoiceStatus']","Final");

        currentDay = (formatDateTo_dd_mmm_yyyy(new Date())) as string;
        await type(newPage,"//input[@id='dpCInvoiceDate_ti']", currentDay);
        await newPage.click("//input[@id='txtBLNo']");

        blNo = "blno" + (Math.floor(Math.random() * 9000) + 1000);
        await type(newPage,"//input[@id='txtLcNo']", supplierInvoiceData.lcNo);
        await type(newPage,"//input[@id='txtBLNo']", blNo);
        await type(newPage,"//input[@id='txtVesselName']", supplierInvoiceData.vesselNmae);
        await type(newPage,"//input[@id='txtVoyageNo']", supplierInvoiceData.voyageNo);
        await type(newPage,"//input[@id='txtTotalNoOfUnits_ti']", supplierInvoiceData.totalNoOfUnit);
        blDate = currentDay;
        await type(newPage,"//input[@id='dpBLDate_ti']", blDate);
        await type(newPage,"//input[@id='txtSubCIs']", subciID);
        await newPage.click("//textarea[@id='txtRemarks']");
        await newPage.waitForTimeout(5000);
        await newPage.click("//input[@id='btnSubmitRequest']");
        await newPage.waitForTimeout(15000);
        await expectResult(newPage,"//textarea[@id='txtResponseContent']","Success");
        await newPage.waitForTimeout(3000);
        console.log("Opsys Posted Supplier Invoice successfully.");

        await page.goto(`${testCredentials.newpageurl}/Invoice/SupplierInvoiceBrowse.aspx`);
        await page.waitForTimeout(3000);
        await page.click("//table[@id='grdSupplierInvoice_t_frozen']/tbody/tr[2]/td[1]/span");
        await page.waitForTimeout(3000);
        await okButton(page);
        await page.click("//table[@id='grdSupplierInvoice_t']/tbody/tr[2]/td[15]//a");

        
        



}



