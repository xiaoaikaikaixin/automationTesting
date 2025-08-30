# Excel Data Extraction Utility

A comprehensive TypeScript utility for extracting data from Excel files (.xlsx, .xls, .csv) with advanced features and flexible options.

## Features

- ✅ **Multiple File Formats**: Support for .xlsx, .xls, and .csv files
- ✅ **Flexible Data Extraction**: Extract entire sheets, specific ranges, rows, columns, or individual cells
- ✅ **JSON Conversion**: Convert Excel data to JSON format with headers
- ✅ **Search Functionality**: Find specific values across sheets
- ✅ **Data Validation**: File format validation and error handling
- ✅ **Metadata Information**: Get file and sheet metadata
- ✅ **Advanced Options**: Custom date formatting, raw values, empty row handling

## Installation

First, install the required dependencies:

```bash
npm install xlsx fs-extra
npm install --save-dev @types/node @types/fs-extra
```

## Quick Start

### Basic Usage

```typescript
import { ExcelUtils, ExcelReader } from './readExcel';

// Quick read entire Excel file
const data = ExcelUtils.readExcel('path/to/your/file.xlsx');
console.log('Data:', data.data);
console.log('Headers:', data.headers);
console.log('Sheet Names:', data.sheetNames);

// Convert to JSON
const jsonData = ExcelUtils.excelToJSON('path/to/your/file.xlsx');
console.log('JSON Data:', jsonData);
```

### Advanced Usage

```typescript
import { ExcelReader, ExcelReadOptions } from './readExcel';

const reader = new ExcelReader();
reader.loadFile('path/to/your/file.xlsx');

// Extract specific sheet and range
const options: ExcelReadOptions = {
    sheetName: 'Sheet1',
    range: 'A1:E10',
    header: 0,
    skipEmptyRows: true,
    raw: false
};

const data = reader.extractData(options);
console.log('Extracted Data:', data);

// Get specific cell value
const cellValue = reader.getCellValue('Sheet1', 'A1');
console.log('Cell A1:', cellValue);

// Get entire row
const rowData = reader.getRowData('Sheet1', 1);
console.log('Row 1:', rowData);

// Get entire column
const columnData = reader.getColumnData('Sheet1', 'A');
console.log('Column A:', columnData);

// Search for values
const searchResults = reader.findValue('search_term');
console.log('Found at:', searchResults);
```

## API Reference

### ExcelReader Class

#### Methods

##### `loadFile(filePath: string): void`
Load an Excel file for processing.

**Parameters:**
- `filePath`: Path to the Excel file

**Throws:**
- Error if file doesn't exist or has unsupported format

##### `extractData(options?: ExcelReadOptions): ExcelData`
Extract data from the loaded Excel file.

**Parameters:**
- `options`: Optional extraction configuration

**Returns:**
- `ExcelData` object containing data, headers, sheet names, and metadata

##### `getSheetNames(): string[]`
Get all sheet names in the workbook.

##### `getCellValue(sheetName: string, cellAddress: string): any`
Get value from a specific cell.

**Parameters:**
- `sheetName`: Name of the sheet
- `cellAddress`: Cell address (e.g., 'A1', 'B5')

##### `getRowData(sheetName: string, rowIndex: number): any[]`
Get all values from a specific row.

**Parameters:**
- `sheetName`: Name of the sheet
- `rowIndex`: Row index (1-based)

##### `getColumnData(sheetName: string, columnIndex: number | string): any[]`
Get all values from a specific column.

**Parameters:**
- `sheetName`: Name of the sheet
- `columnIndex`: Column index (0-based) or column letter (e.g., 'A', 'B')

##### `toJSON(options?: ExcelReadOptions): any[]`
Convert Excel data to JSON format.

##### `findValue(searchValue: any, sheetName?: string): string[]`
Search for specific values in the Excel file.

**Parameters:**
- `searchValue`: Value to search for
- `sheetName`: Optional sheet name to limit search scope

### ExcelUtils Class (Static Methods)

##### `readExcel(filePath: string, options?: ExcelReadOptions): ExcelData`
Quick method to read Excel file and return data.

##### `excelToJSON(filePath: string, options?: ExcelReadOptions): any[]`
Quick method to convert Excel file to JSON.

##### `isValidExcelFile(filePath: string): boolean`
Validate if file is a supported Excel format.

##### `getFileInfo(filePath: string): any`
Get file information including metadata.

## Interfaces

### ExcelReadOptions

```typescript
interface ExcelReadOptions {
    sheetName?: string;           // Specific sheet name to read
    sheetIndex?: number;          // Sheet index (0-based)
    range?: string;               // Cell range (e.g., 'A1:D10')
    header?: number;              // Header row index (0-based)
    skipEmptyRows?: boolean;      // Skip empty rows
    dateNF?: string;              // Date number format
    raw?: boolean;                // Return raw values without formatting
}
```

### ExcelData

```typescript
interface ExcelData {
    data: any[][];                // Raw data as 2D array
    headers?: string[];           // Column headers
    sheetNames: string[];         // All sheet names in workbook
    metadata: {
        fileName: string;
        sheetName: string;
        rowCount: number;
        columnCount: number;
        lastModified?: Date;
    };
}
```

## Examples

### Example 1: Reading Test Data

```typescript
import { ExcelUtils } from './readExcel';

// Read test data from Excel file
const testData = ExcelUtils.excelToJSON('testData/users.xlsx', {
    sheetName: 'Users',
    header: 0,
    skipEmptyRows: true
});

// Use in Playwright test
for (const user of testData) {
    await test(`Login test for ${user.username}`, async ({ page }) => {
        await page.fill('#username', user.username);
        await page.fill('#password', user.password);
        await page.click('#login');
        // ... rest of test
    });
}
```

### Example 2: Data Validation

```typescript
import { ExcelReader } from './readExcel';

const reader = new ExcelReader();
reader.loadFile('data/validation.xlsx');

// Extract expected results
const expectedData = reader.extractData({
    sheetName: 'Expected',
    range: 'A2:C100',
    skipEmptyRows: true
});

// Compare with actual results
for (let i = 0; i < expectedData.data.length; i++) {
    const [id, expectedValue, description] = expectedData.data[i];
    // Perform validation logic
}
```

### Example 3: Configuration Management

```typescript
import { ExcelUtils } from './readExcel';

// Read configuration from Excel
const config = ExcelUtils.excelToJSON('config/testConfig.xlsx', {
    sheetName: 'Environment',
    header: 0
});

// Convert to configuration object
const envConfig = config.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
}, {});

console.log('Base URL:', envConfig.baseUrl);
console.log('API Key:', envConfig.apiKey);
```

## Error Handling

The utility includes comprehensive error handling:

```typescript
try {
    const data = ExcelUtils.readExcel('nonexistent.xlsx');
} catch (error) {
    if (error.message.includes('not found')) {
        console.error('File does not exist');
    } else if (error.message.includes('Unsupported file format')) {
        console.error('Invalid file format');
    } else {
        console.error('Unknown error:', error.message);
    }
}
```

## Best Practices

1. **File Validation**: Always validate files before processing
2. **Error Handling**: Wrap Excel operations in try-catch blocks
3. **Memory Management**: For large files, consider processing in chunks
4. **Path Handling**: Use absolute paths or path.join() for cross-platform compatibility
5. **Data Validation**: Validate extracted data before using in tests

## Troubleshooting

### Common Issues

1. **"File not found" Error**
   - Check file path is correct
   - Ensure file exists and is accessible
   - Use absolute paths when possible

2. **"Unsupported file format" Error**
   - Ensure file has .xlsx, .xls, or .csv extension
   - Check file is not corrupted

3. **"Sheet not found" Error**
   - Verify sheet name exists in workbook
   - Check for case sensitivity
   - Use `getSheetNames()` to list available sheets

4. **Empty Data Returned**
   - Check if range is correct
   - Verify sheet contains data
   - Try with `skipEmptyRows: false`

### Performance Tips

- Use specific ranges instead of reading entire sheets for large files
- Set `raw: true` if you don't need formatted values
- Use `skipEmptyRows: true` to reduce memory usage
- Cache ExcelReader instances for multiple operations on the same file

## DN Related DTC Specific Functions

For the specific use case of reading 'DN with Related DTC.xlsx' files, we provide a specialized class:

### DNRelatedDTCReader Class

```typescript
import { DNRelatedDTCReader, DNRelatedDTCData } from './readExcel';

// Read all DN Related DTC data
const dnData = DNRelatedDTCReader.readDNRelatedDTC('path/to/DN with Related DTC.xlsx');
console.log('Total records:', dnData.length);

// Search by DTCID
const dtcidResults = DNRelatedDTCReader.findByDTCID('path/to/file.xlsx', '14039');

// Search by DTCNo
const dtcnoResults = DNRelatedDTCReader.findByDTCNo('path/to/file.xlsx', 'EST/DTC/20191003-01');

// Search by DNNO
const dnnoResults = DNRelatedDTCReader.findByDNNO('path/to/file.xlsx', 'DN-2012-082');

// Get unique values
const uniqueDTCIDs = DNRelatedDTCReader.getUniqueDTCIDs('path/to/file.xlsx');
const uniqueDNNOs = DNRelatedDTCReader.getUniqueDNNOs('path/to/file.xlsx');

// Export to JSON
const jsonData = DNRelatedDTCReader.exportToJSON('path/to/file.xlsx', 'output.json');
```

#### DNRelatedDTCData Interface

```typescript
interface DNRelatedDTCData {
    DTCID: string;    // Column A - DTC ID
    DTCNo: string;    // Column B - DTC Number
    DNNO: string;     // Column C - DN Number
}
```

#### Available Methods

- `readDNRelatedDTC(filePath, options?)`: Read all DN Related DTC data
- `findByDTCID(filePath, dtcid)`: Find records by DTCID
- `findByDTCNo(filePath, dtcno)`: Find records by DTCNo
- `findByDNNO(filePath, dnno)`: Find records by DNNO
- `getUniqueDTCIDs(filePath)`: Get unique DTCID values
- `getUniqueDNNOs(filePath)`: Get unique DNNO values
- `exportToJSON(filePath, outputPath?)`: Export data to JSON format

### Usage in Playwright Tests

```typescript
import { test, expect } from '@playwright/test';
import { DNRelatedDTCReader } from './utils/tool/readExcel';

test.describe('DN Related DTC Tests', () => {
  const testData = DNRelatedDTCReader.readDNRelatedDTC('testData/DN with Related DTC.xlsx');
  
  testData.forEach((record, index) => {
    test(`Verify DN ${record.DNNO} with DTC ${record.DTCNo}`, async ({ page }) => {
      // Navigate to application
      await page.goto('your-app-url');
      
      // Search for DTCID
      await page.fill('#dtcid-search', record.DTCID);
      await page.click('#search-button');
      
      // Verify DTCNo and DNNO are displayed
      await expect(page.locator(`text=${record.DTCNo}`)).toBeVisible();
      await expect(page.locator(`text=${record.DNNO}`)).toBeVisible();
    });
  });
});
```

### Data Analysis Example

```typescript
// Analyze DN Related DTC data
const allData = DNRelatedDTCReader.readDNRelatedDTC('path/to/file.xlsx');

// Get statistics
console.log('Total records:', allData.length);
console.log('Unique DTCIDs:', DNRelatedDTCReader.getUniqueDTCIDs('path/to/file.xlsx').length);
console.log('Unique DNNOs:', DNRelatedDTCReader.getUniqueDNNOs('path/to/file.xlsx').length);

// Find records with specific patterns
const estRecords = allData.filter(record => record.DTCNo.includes('EST'));
const sopRecords = allData.filter(record => record.DTCNo.includes('SOP'));

console.log('EST records:', estRecords.length);
console.log('SOP records:', sopRecords.length);
```

## License

MIT License - see LICENSE file for details.