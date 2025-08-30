import { expect } from '@playwright/test';
import { test } from "../../../fixture";
import { testCredentials, freightChargeData } from '../../data/freightChargeTestData';
import {click, type, typeAndTab,dropdown, popupselection}  from '../../utils/baseTest';
import { verifyLoggedIn } from '../../utils/sharedContext';
import { handleConfirmDialog } from '../../utils/dialogHandler';
import { login } from '../../utils/baseCase';
import { addfreightCharge, freightChargeVerifation } from '../../utils/freightCharge/freightChargeBaseCase';

// Timeout removed - using global configuration

test("Freight Charge creation with Bulk Delivery Mode", async ({ 
    ai, 
    aiInput, 
    aiQuery, 
    aiAssert, 
    aiTap, 
    page }) => {
        // Login is now handled in beforeEach hook
        test.info().title = 'Freight Charge creation test with Bulk Delivery Mode';
        
        await login(page);
        await addfreightCharge(page, ai, aiQuery, aiAssert);
        await freightChargeVerifation(page,  ai, aiQuery, aiAssert);
        console.log(test.info().title + " successfully.");
    }
     
);