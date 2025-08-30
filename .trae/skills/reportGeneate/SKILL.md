---
name: reportGeneate
description: Generate NCTS report Playwright spec from an uploaded report-page screenshot. Extract filter fields from the image, map to xpaths from md/reportxpath.md, then output a spec.ts similar to existing e2e/testCase/report specs (handles Search vs Export-Excel flows).
---

## What this skill does

Turn a report page screenshot into a Playwright test spec file that follows this project’s existing patterns (same imports and helper functions as existing report specs).

Inputs you should have (ask the user if missing):
- A screenshot/image of the report page (filters + buttons; results grid if visible).
- The report page URL path (e.g. `Report/Freight/RptFreightChargeListing.aspx`) and a test title.
- Extract the input values shown in the screenshot as the test data (preferred).
- If the screenshot does not show values, use reasonable placeholders and keep them easy to edit at the top of the spec.
- Whether the page has a **Search** button (detect from the screenshot).

## Field extraction checklist (important)

When reading the screenshot, extract and generate code for:
- Every visible filter field (including dropdowns with default values like “No” / “Active”)
- Multi-select chips/tokens (e.g. a selected country shown as a chip)
- Fields inside the “Search Records” collapsible area

Do not skip fields just because they already have a default value in the screenshot.

## Required references (read before generating)

- `c:\Users\aijuan.lin0022\Downloads\MidsceneTest\NCTS\md\reportxpath.md`
- Example spec style:
  - `c:\Users\aijuan.lin0022\Downloads\MidsceneTest\NCTS\e2e\testCase\report\freight\RE-05-RptFreightChargeListing.spec.ts`
- Shared helpers (to match usage and function names):
  - `c:\Users\aijuan.lin0022\Downloads\MidsceneTest\NCTS\e2e\utils\baseTest.ts`
  - `c:\Users\aijuan.lin0022\Downloads\MidsceneTest\NCTS\e2e\utils\report\reportBaseCase.ts`

## XPath mapping rules (from reportxpath.md)

`reportxpath.md` contains lines like:
`shippingTerm = //div[@id='jAutochecklist_wrapper_chkddShippingTerm_lb']`

When you extract a field from the image:
1. Normalize the label to a variable name (camelCase).
2. If a matching variable exists in `reportxpath.md`, use that xpath.
3. If it does not exist, try to reuse an existing selector by searching other report specs for the same field label or a similar variable name.
4. If still unknown, use your best stable guess (prefer `@id`-based xpaths), and list it under “needs confirmation” in the output.

## Selector sourcing strategy (use this order)

1. `md/reportxpath.md` mapping (preferred)
2. Reuse from existing specs by searching `e2e/testCase/report/**/**.spec.ts`
3. If the screenshot includes a recognizable selector hint (rare), use it
4. Otherwise, infer a stable selector:
   - Prefer `//input[@id='...']`, `//textarea[@id='...']`, `//span[@id='...']`, `//div[@id='...']`
   - Avoid brittle positional xpaths like `following::input[1]` unless there is no better option

## How to choose helper function per field

Use the same helpers as the existing specs:
- Text input: `await type(page, "<xpath>", value);`
- Autocomplete input (type + enter + tab): `await typeAndTab(page, "<cssOrXpath>", value);`
- Dropdown (select2-like): `await dropdown(page, "//span[@id='lstSomething']", value);`
- Dropdown checklist (autochecklist): `await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddSomething_lb']", value);`
- Popup selector: `await popupselection(page, "<popupInputXpath>", "<iframeXpath>", value);`

## Script skeleton to generate (must follow)

Generate a `*.spec.ts` that:
- Imports `test` from `../../../../fixture`
- Imports `login` from `../../../utils/baseCase`
- Imports needed helpers from `../../../utils/baseTest`
- Imports `{ reporturl, reportData }` from `../../../data/reportData` only if used
- Imports `{ exportExcelButton, searchButton, consoleLog }` from `../../../utils/report/reportBaseCase`
- Declares constants for the test data values at top (like the example spec)
- Uses `await login(page);`
- Navigates with `await page.goto(\`\${reporturl.url}<REPORT_PATH>\`);` and do not change the existing `reporturl.url` convention in this repo
- Fills every extracted field in the same top-to-bottom order as shown on the page

## Search vs Export flow (must follow)

### If the page HAS a "Search" button
After filling fields:
1. `await searchButton(page);`
2. `await expectResult(page, "<xpath>", expectedValue);`
   - Preferred: assert a result grid cell contains a value you searched for.
   - Fallback (if grid xpath is not available from image): assert one of the filled filter inputs contains the value you entered (extractValue supports inputValue).
3. `await exportExcelButton(page);`
4. `await downloadFile(page);`
5. `await consoleLog();`

### If the page DOES NOT have a "Search" button
After filling fields:
1. `await exportExcelButton(page);`
2. `await downloadFile(page);`
3. `await consoleLog();`

## Output requirements

Return:
- The full generated `*.spec.ts` content (ready to paste into `e2e/testCase/report/...`)
- A short list of any fields that could not be mapped to `reportxpath.md` and need a selector/value from the user
