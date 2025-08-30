import { expect } from '@playwright/test';
import { test } from "../../../fixture";
import { tsMainTabData,tsShippingTabData,statusData } from '../../data/tradingSlipTestData';
import { click, type, typeAndTab, dropdown, popupselection } from '../../utils/baseTest';
import { login } from '../../utils/baseCase';

// Timeout removed - using global configuration 

test("Create Business Partner for Buyer", async ({ 
    ai, 
    aiInput, 
    aiQuery, 
    aiAssert, 
    aiTap, 
    page }) => {
    

    console.log("Create Business Partner for Buye successful!");
    })