
******************************One test scenario including multiple test cases***********************

test.describe.serial('DTC Debit Note Tests', () => {
    let sharedData: {
        asOfDate?: string;
        currency?: string;
        dtcRefNo?: string;
        seller?: string;
        scRefNo?: string;
        deliveryMode?: string;
        division?: string;
        dtcCommissionAmount?: string;
        nextUrl? : string;
    } = {};
    test("Test Case 1: Create new DTC Debit Note", async ({ 
        page,
        ai, 
        aiInput, 
        aiQuery, 
        aiAssert, 
        aiTap }) => {
        // Login is now handled in beforeEach hook
        test.info().title = 'Create new DTC Debit Note';
        ....
        sharedData.nextUrl = await page.url();
        console.log('Next URL:'+sharedData.nextUrl);
        }

        test("Test Case 2: DTC Debit Note Download Commission Details", async ({ 
        page,
         }) => {
        // This test continues from Test Case 1 without closing the browser
        // No login required as we're continuing from the previous test
        test.info().title = 'DTC Debit Note Download Commission Details';
        await page.goto(`${sharedData.nextUrl}`);   


******************************open page in new tab ***********************
const newPage = await context.newPage();


******************************query content from UI ***********************
--query content from page
        const [slipNumber, tsApprovalStatus] = await Promise.all([
            aiQuery("text content of 'Trading Slip No.' field"),
            aiQuery("text content of 'Approval Status' field")
        ]);
        console.log("SC Document Status: ", scDocumentStatus);                
        console.log("SC Approval Status: ", scApprovalStatus);

--pop up frame
        const frame = page.frameLocator(frameselector);
        await frame.locator('//input[@id="txtBPName"]').fill(value);

-- New page
        const originalPage = page;

        // Create a new tab
        const newPage = await context.newPage();
--Share/pass data to other test case
 let sharedData: {
        tsNo?: string;
        scNo?: string;
        ciNo?: string;
        subciNo?: string;
        subciID?: string;
 } = {};

Test case 1 get the data
sharedData.subciID = await aiQuery("text content of 'ID' field");

Test case 2 use the data
           if (sharedData.subciID) {
               await OpsysSendSupplierInvoice(page, context, sharedData.subciID);
           } else {
               console.log("Warning: subciNo is undefined. Cannot send supplier invoice.");
           }
function 
export const OpsysSendSupplierInvoice = async (
    page: any, 
    context: any,
    subciID: string
) => {
            await type(newPage,"//input[@id='txtSubCIs']", subciID);
}

-----get the field value in test case 1 and pass it the test case 2
test case 1
export let supplierInvoiceNo: string;
export let currentDay: string;

test case 2
import { supplierInvoiceNo, currentDay } from "../tool/toolSendSupplierInvoice";