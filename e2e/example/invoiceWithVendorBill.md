# Invoice With Vendor Bill Test Flow

This document explains what the automation script in `invoiceWithVendorBill.spec.ts` does in simple human language.

## Purpose

The script checks whether the invoice information shown in the NCTS UI is the same as the data stored in the Excel report:

- `e2e/example/faq/Invoice with Vendor Bill_DTC.xlsx`
- or fallback file `e2e/example/faq/Invoice with Vendor Bill_DTC.ods`

The main key used for validation is:

- `Invoice No.`

For each invoice in the Excel file, the script opens the matching invoice in the system and compares UI values against the report values.

## High-Level Flow

The automation does these main actions:

1. Open the Excel report.
2. Read every row from the first sheet.
3. Take the `Invoice No.` from each row.
4. Log in to `NCTS-LiveClone`.
5. Go to the invoice browse page.
6. Search the invoice by invoice number.
7. Open the invoice details page.
8. Compare UI values with the values from the Excel row.
9. Stop the test if any required value is missing or does not match.

## Step-By-Step Description

## 1. Find the Excel File

The script first looks for the report file in this order:

1. `e2e/example/faq/Invoice with Vendor Bill_DTC.xlsx`
2. `e2e/example/faq/Invoice with Vendor Bill_DTC.ods`

If neither file exists, the test fails immediately and shows an error message.

Manual meaning:

- Before running the script, make sure one of these two files is available.
- The `.xlsx` file is preferred.

## 2. Read the Report Data

The script opens the first sheet in the Excel file and reads all rows.

Each row is treated as one invoice record.

Manual meaning:

- One row in the report represents one invoice to be checked.
- The script does not hardcode invoice numbers.
- It reads all invoice numbers directly from the report.

## 3. Use Invoice Number as the Primary Key

For each row, the script tries to get the invoice number from one of these column names:

- `Invoice No.`
- `Invoice No`
- `Invoice`
- `Invoice number`

If a row has no invoice number, the script skips that row.

Manual meaning:

- The invoice number is the main search key.
- If the invoice number is blank, that row cannot be validated.

## 4. Open the Login Page

The script opens:

- `http://192.168.72.44/NCTS-LiveClone/Login.aspx`

Then it enters:

- User ID from `testCredentials.userid`
- Password from `testCredentials.password`

Then it clicks the login button.

Manual meaning:

- The script logs in exactly like a user.
- Credentials are not hardcoded in this spec file. They are reused from the project test data file.

## 5. Go to the Invoice Browse Page

After login, the script opens:

- `http://192.168.72.44/NCTS-LiveClone/Invoice/InvoiceBrowse.aspx`

Manual meaning:

- This is the invoice list page where invoices can be searched.

## 6. Search for the Invoice

For each invoice number from the report:

1. The script types the invoice number into the invoice search field.
2. It clicks the `Search` button.
3. It waits for the result grid to load.

Then it tries to open the invoice details:

- first choice: click the exact invoice link that matches the invoice number
- fallback: click the first result row if exact link is not found

Manual meaning:

- The script searches by invoice number.
- It tries to be practical and still continue even if the grid structure is slightly different.

## 7. Open the Invoice Details Page

Once the result is clicked, the script waits for the details page to open.

Manual meaning:

- This page is the actual invoice record page where invoice fields are displayed.
- The rest of the validation happens here.

## 8. Normalize the Values Before Comparing

Before comparing values, the script cleans the data so minor formatting differences do not cause false failures.

### Text normalization

The script:

- converts values to text
- trims extra spaces
- replaces multiple spaces/new lines with a single space

Manual meaning:

- `Palm Wax`
- ` Palm   Wax `
- multiline text with extra spaces

will be treated more consistently.

### Date normalization

For date columns, the script converts the value to:

- `dd-MMM-yyyy`

Example:

- `10-Mar-2026`

Manual meaning:

- If Excel and UI show the same date in slightly different raw formats, the script tries to compare them in one consistent format.

### Yes/No normalization

For boolean-like values, the script treats these as equivalent:

- `Yes`, `Y`, `True`, `1`, `checked` -> `Yes`
- `No`, `N`, `False`, `0`, `unchecked` -> `No`

Manual meaning:

- This is useful for fields like `Override Due Date`.

## 9. Match Excel Columns to UI Labels

Some report column names are not exactly the same as UI field labels.

The script uses a small mapping for common fields.

Examples:

- `Product Division` -> UI label `Division`
- `Invoice Due Date` -> UI label `Due Date`
- `BL No.` -> UI label `BL Number`
- `PO Supplier Invoice No./DTC DN No.` -> UI label `Supplier Invoice No.`
- `PO Supplier Invoice Date/DTC DN Date` -> UI label `Supplier Invoice Date`
- `PO Supplier Invoice Status/DTC DN Status` -> UI label `Supplier Invoice Status`

Manual meaning:

- The report wording and UI wording may differ.
- The script already handles several common naming differences.

## 10. Find Values on the UI

The script does not rely only on fixed XPath for every field.

Instead, it tries to:

1. find a label on the page
2. locate the nearest visible value beside or below that label
3. read that value

Manual meaning:

- This makes the script more flexible when the page layout is not a simple table.
- It is especially useful for invoice detail screens that show labels and values in sections.

## 11. Special Handling for Override Due Date

`Override Due Date` is not read as normal text.

The script:

1. finds labels like `Due Date`, `Override`, or `Override Due Date`
2. looks for the nearest checkbox
3. checks whether the checkbox is checked or not
4. converts that to `Yes` or `No`
5. compares it with the Excel value

Manual meaning:

- This field is treated as a checkbox status, not as plain text.

## 12. Required Columns

The script treats these columns as required:

- `Invoice No.`
- `Product Division`
- `Invoice Date`
- `BL Date`
- `Invoice Due Date`
- `Override Due Date`

If any of these required values cannot be found on the UI, the script fails the invoice validation.

Manual meaning:

- These are the core fields that must be present and must match.

## 13. Non-Required Columns

For other non-empty Excel columns:

- the script still tries to find and compare them
- if the UI field is not found, the script records them as skipped
- skipped non-required fields do not fail the test by themselves

Manual meaning:

- This helps the script stay usable even when the report contains many columns that are not visible on the invoice details page.

## 14. When the Script Fails

The script fails for an invoice when:

- a required field is missing on the UI
- a value found on the UI does not match the Excel value

The error message includes:

- which invoice failed
- which required columns were missing
- which fields had different values
- which non-required fields were skipped because they were not found on the UI

Manual meaning:

- The failure message is intended to help you quickly know whether the problem is:
  - missing field
  - wrong UI value
  - field not available on the page

## 15. What a Successful Run Means

If an invoice passes, it means:

- the invoice could be found in the system
- the invoice details page opened successfully
- all required values matched the Excel report
- any additional matched fields also matched

The console prints:

- `Invoice <invoiceNo>: validation passed`

## Main Functions Explained

## `resolveExcelPath()`

Purpose:

- Find the correct Excel file before the test starts.

## `normalizeText()`

Purpose:

- Clean up text so spacing differences do not affect comparison.

## `normalizeDate()`

Purpose:

- Convert date-like values into a standard `dd-MMM-yyyy` format.

## `normalizeYesNo()`

Purpose:

- Standardize values such as `true/false`, `1/0`, `checked/unchecked` into `Yes/No`.

## `getInvoiceNoFromRow()`

Purpose:

- Extract the invoice number from the report row.

## `loginToSystem()`

Purpose:

- Open the login page and sign in with project credentials.

## `searchInvoiceAndOpenDetails()`

Purpose:

- Go to invoice browse page, search by invoice number, and open invoice details.

## `getFieldValueByAnyLabel()`

Purpose:

- Find a field on the UI by label name and return the nearest visible value.

## `getNearestCheckboxStateByLabel()`

Purpose:

- Find the nearest checkbox near a label and return checked or unchecked.

## `normalizeExpected()`

Purpose:

- Decide how each Excel value should be normalized before comparison.

## Practical Notes

- The current script is designed to follow the simple style used in `faq.spec.ts`, but it includes extra helper logic because invoice details are more complex than FAQ form fields.
- The invoice details page may not show every report column directly on the first screen.
- If you want stricter validation, the script can be changed so every non-empty Excel column must exist on the UI.
- If you want safer validation, the script can also be changed to compare only a fixed approved field list.

## Suggested Manual Understanding

If you explain this script to a tester in one sentence:

- "Open the invoice report, take each invoice number, find the same invoice in NCTS, open the details page, and confirm the important UI values are exactly the same as the Excel report."

## Related Files

- Spec file: `e2e/example/invoiceWithVendorBill.spec.ts`
- Excel file: `e2e/example/faq/Invoice with Vendor Bill_DTC.xlsx`
- Fallback Excel file: `e2e/example/faq/Invoice with Vendor Bill_DTC.ods`
- Reference style file: `e2e/example/faq/faq.spec.ts`
