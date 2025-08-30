import * as XLSX from 'xlsx';
import * as fs from 'fs';

/**
 * Simple function to read Excel file and print data
 * @param filePath - Path to Excel file
 * @param sheetName - Optional sheet name (uses first sheet if not provided)
 */
export function readAndPrintExcel(filePath: string, sheetName?: string): void {
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found: ${filePath}`);
            return;
        }

        // Read the Excel file
        const workbook = XLSX.readFile(filePath);
        
        // Get sheet name to use
        const targetSheet = sheetName || workbook.SheetNames[0];
        
        if (!workbook.Sheets[targetSheet]) {
            console.error(`❌ Sheet '${targetSheet}' not found. Available sheets: ${workbook.SheetNames.join(', ')}`);
            return;
        }

        // Convert sheet to JSON array
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[targetSheet], { header: 1 });
        
        console.log(`📊 Reading Excel file: ${filePath}`);
        console.log(`📋 Sheet: ${targetSheet}`);
        console.log(`📈 Total rows: ${data.length}`);
        console.log('\n--- Excel Data ---');
        
        // Print each row
        data.forEach((row: any, index: number) => {
            console.log(`Row ${index + 1}:`, row);
        });
        
        console.log('--- End of Data ---\n');
        
    } catch (error) {
        console.error('❌ Error reading Excel file:', error);
    }
}

/**
 * Simple function to read specific data from DN Related DTC Excel file
 * @param filePath - Path to 'DN with Related DTC.xlsx' file
 */
export function readDNRelatedDTC(filePath: string): void {
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found: ${filePath}`);
            return;
        }

        // Read the Excel file
        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Convert to array format
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        console.log(`📊 Reading DN Related DTC file: ${filePath}`);
        console.log(`📈 Total rows: ${data.length}`);
        console.log('\n--- DN Related DTC Data ---');
        
        // Print header
        if (data.length > 0) {
            console.log('Headers:', data[0]);
            console.log('\nData:');
        }
        
        // Print data rows (skip header)
        for (let i = 1; i < data.length; i++) {
            const row: any = data[i];
            if (row && row.length >= 3) {
                console.log(`${i}. DTCID: ${row[0]}, DTCNo: ${row[1]}, DNNO: ${row[2]}`);
            }
        }
        
        console.log('--- End of Data ---\n');
        
    } catch (error) {
        console.error('❌ Error reading DN Related DTC file:', error);
    }
}

