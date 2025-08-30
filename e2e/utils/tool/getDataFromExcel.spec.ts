import { expect } from '@playwright/test';
import { test } from "../../../fixture";
import { readAndPrintExcel, readDNRelatedDTC } from './readExcel';
import * as path from 'path';

// Example test to demonstrate Excel data reading
test("Read DN with Related DTC Excel file and print data", async ({ page }) => {
    
    // Example 1: Using the specific DN Related DTC function
    console.log('=== Example 1: Using readDNRelatedDTC function ===');
    
    // Path to your DN with Related DTC.xlsx file
    // Update this path to match your actual file location
    const dnRelatedDTCFilePath = 'C:/Users/aijuan.lin/Downloads/Download/DNwithRelatedDTC.xlsx';
    
    try {
        // Read and print DN Related DTC data
        readDNRelatedDTC(dnRelatedDTCFilePath);
    } catch (error) {
        console.log('Note: Update the file path to your actual DN with Related DTC.xlsx location');
        console.log('Current path attempted:', dnRelatedDTCFilePath);
    }
    
    // Example 2: Using the general Excel reader function
    console.log('\n=== Example 2: Using readAndPrintExcel function ===');
    
    try {
        // Read and print all data from the Excel file
        readAndPrintExcel(dnRelatedDTCFilePath);
    } catch (error) {
        console.log('Note: Update the file path to your actual Excel file location');
    }
    
   
});


