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
    expectResult,
    scrolldown,
    extractValue
} from '../baseTest';

import {
    testCredentials,
    tsMainTabData,
    tsShippingTabData,
    tsSurveyorTabData,
    tsProductTabData,
    tsSpecialReqsTabData,
    tsBrokerTabData,
    statusData,
    tsShippingTCPCData
} from '../../data/tradingSlipTestData';



export const productGridVerification = async (
    page: any,
    ai,
    aiQuery,
    aiAssert
 ) => {
        // Navigate to Product tab and verify data
        await page.click("//a[normalize-space()='Product Details']");
        await page.click("//table[@id='grdTSItems_t_frozen']/tbody/tr[2]/td[1]/a");
        try {
            await expectResult(page, "//table[@id='grdTSItems_t_frozen']/tbody/tr[2]/td[4]/span",tsProductTabData.product);
            await expectResult(page, "//table[@id='grdTSItems_t']/tbody/tr[2]/td[5]/span",tsProductTabData.productCategory);
            await expectResult(page, "//table[@id='grdTSItems_t']/tbody/tr[2]/td[6]/span","");
            await expectResult(page, "//table[@id='grdTSItems_t']/tbody/tr[2]/td[5]/span",tsProductTabData.productCategory);
            await expectResult(page, "//table[@id='grdTSItems_t']/tbody/tr[2]/td[5]/span",tsProductTabData.productCategory);
            await expectResult(page, "//table[@id='grdTSItems_t']/tbody/tr[2]/td[5]/span",tsProductTabData.productCategory);
            await expectResult(page, "//table[@id='grdTSItems_t']/tbody/tr[2]/td[5]/span",tsProductTabData.productCategory);
            await expectResult(page, "//table[@id='grdTSItems_t']/tbody/tr[2]/td[5]/span",tsProductTabData.productCategory);



            await aiAssert(`verify that the 'RSPO SCCS Supply Chain Model' field equal to ${tsProductTabData.supplyChainModel}`);

            await aiAssert(`verify that the 'Buyer Good Descriptions' field equal to ${tsProductTabData.buyergoodDescriptions}`);
            await aiAssert(`verify that the 'RSPO SCCS Supply Chain Model' field equal to ${tsProductTabData.supplyChainModel}`);
            await aiAssert(`verify that the 'GMP' field is disabled and checked`);
            await aiAssert(`verify that the 'NDPE' field is checked`);
            await aiAssert(`verify that the 'ISCC' field is checked`);
            await aiAssert(`verify that the 'Product Specification' field equal to ${tsProductTabData.productSpecification}`);
            await aiAssert(`verify that the 'Product Specification Detail' field equal to ${tsProductTabData.specificationDetails}`);
            await aiAssert(`verify that the 'Delivery UOM' field equal to ${tsProductTabData.deliveryUOM}`);
            await aiAssert(`verify that the 'Quantity' field equal to ${tsProductTabData.quantity}`);
            await aiAssert(`verify that the 'Price/UOM' field equal to ${tsProductTabData.pricePerUOM}`);
            await aiAssert(`verify that the 'Price/MT' field equal to ${tsProductTabData.pricePerUOM}`);
            await aiAssert(`verify that the 'Weight Tolerance' field contains ${tsProductTabData.weightToleranceType}`);
            await aiAssert(`verify that the 'Weight Tolerance' field contains ${tsProductTabData.weightTolerance}`);
            await aiAssert(`verify that the 'Amount' field equal to ${tsProductTabData.pricePerUOM}*${tsProductTabData.quantity}`);
            await aiAssert(`verify that the 'Packaging Form' field equal to ${tsProductTabData.produtForm}`);

            if (test.info().title.includes('Bulk')) {
                await aiAssert(`verify that the 'Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileNameBulk}`);
                await aiAssert(`verify that the 'SC Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileNameBulk}`);        
                await aiAssert(`verify that the 'Calculated Total Packaging' field equal to '0.00'`);            
            }else{
                await aiAssert(`verify that the 'Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileName}`);
                await aiAssert(`verify that the 'SC Packaging Profile Name' field equal to ${tsProductTabData.packagingProfileName}`);
            }
            

            await aiAssert(`verify that the 'Shipping Marking' field equal to ${tsProductTabData.shippingMarking}`);
            await aiAssert(`verify that the 'Shipping Marking if Customize' field equal to ${tsProductTabData.shippingMarkingCustomize}`);
            await aiAssert(`verify that the 'Packaging Marking' field equal to ${tsProductTabData.packagingMarking}`);
            await aiAssert(`verify that the 'Packaging Marking if Customize' field equal to ${tsProductTabData.packagingMarkingCustomize}`);
            await aiAssert(`verify that the 'Pallet Marking' field equal to ${tsProductTabData.palletProfileName}`);
            await aiAssert(`verify that the 'Pallet Marking if Customized' field equal to ${tsProductTabData.palletMarkingCustomize}`);
            await aiAssert(`verify that the 'Buyer Good Descriptions' field equal to ${tsProductTabData.buyergoodDescriptions}`);
            await aiAssert(`verify that the 'Insulation Type' field equal to ${tsProductTabData.insulationType}`);
            await aiAssert(`verify that the 'Product Remark GMP' field contains ${tsProductTabData.productRemarkGMP}`);
            await aiAssert(`verify that the 'Product Remark NDPE' field contains ${tsProductTabData.productRemarkNDPE}`);
            await aiAssert(`verify that the 'Product Remark ISCC' field contains ${tsProductTabData.productRemarkISCC}`);
            console.log("Verify the Product Details tab show the correct values!");
        } catch (error) {
            console.log("Error verifying Product Details tab fields: " + error.message);
        }
        await page.click("//input[@id='btnClose']");
}