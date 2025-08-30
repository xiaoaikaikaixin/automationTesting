# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NCTS automation testing framework using **Playwright** (end-to-end browser testing) + **Midscene** (AI-driven assertions and queries). Tests an internal web application for trading/contract management (sales contracts, trading slips, freight, invoices, payments, etc.).

## Test Commands

```bash
# Run all tests
npm test

# Run a single spec file
npx playwright test e2e/testCase/tradingSlip/TS-01-CreateNormalOrderWithBasisCD.spec.ts

# Run with headed browser (visible)
npm run test:headed

# Debug mode (step-through)
npm run test:debug

# UI mode (Playwright inspector)
npm run test:ui

# View the last test report
npm run report
```

Tests are located under `./e2e` and match `**/*.spec.ts`. Default browser is Chromium only. Timeout is 10 minutes per test.

## Architecture

### Test Fixture (`fixture.ts`)
The root `fixture.ts` extends Playwright's `test` with Midscene's `PlaywrightAiFixture`, making AI functions available in every test:

```typescript
test("my test", async ({ ai, aiInput, aiQuery, aiAssert, aiTap, page }) => {
  // ai: natural-language action (scroll, click described targets)
  // aiQuery: extract text content from the page (returns string)
  // aiAssert: verify a condition using AI (returns void or throws)
  // aiInput: type text into a described target
  // aiTap: click a described target
});
```

All tests MUST import from `"../../fixture"` (or relative path) — NOT from `@playwright/test` directly.

### Global Setup & Auth
- **`e2e/utils/global-setup.ts`** — Runs once before all tests. Logs in with credentials and saves browser state to `playwright/.auth/user.json`. Playwright config references this via `projects[].use.storageState`.
- **`e2e/utils/sharedContext.ts`** — `verifyLoggedIn(page)` checks if user is authenticated; `navigateTo(page, path)` navigates within the app using the stored auth context.
- **`e2e/utils/baseCase.ts`** — Direct `login(page)` function (used when global setup state isn't available or the test needs explicit login).

### Test Data Layer (`e2e/data/`)
Each business module has a `<Module>TestData.ts` file exporting typed objects (credentials, form field values, expected statuses, etc.). The main one is `tradingSlipTestData.ts`, which holds `testCredentials` (URL, userid, password), and tab-level data (`tsMainTabData`, `tsShippingTabData`, `tsProductTabData`, etc.). Tests import data from here, not from `.env`.

### Utility Functions (`e2e/utils/baseTest.ts`)
Shared Playwright helpers: `click`, `type`, `typeAndTab`, `dropdown`, `popupselection`, `extractValue`, `expectResult`, `downloadFile`, `uploadFile`, `scrollToElement`, `scrollToTableColumn`, `formatDateTo_dd_mmm_yyyy`, `addOneMonth`, etc. All accept `page` as first argument and work with CSS selectors or XPath.

### Business Logic Layer (`e2e/utils/<module>/<module>BaseCase.ts`)
Each module has a "base case" file with exported async functions that encapsulate the step-by-step logic for filling a form tab or verifying a tab's data. Example from `tradingSlipBaseCase.ts`:

- `addMain(page, ai, aiQuery, aiAssert)` — fills the Main tab
- `addShipping(page, ...)`, `addProduct(page, ...)`, `addBroker(page, ...)` — fill other tabs
- `mainTabVerification(page, ...)`, `shippingTabVerification(page, ...)` — verify tab data

These functions condition on `test.info().title` to vary behavior (e.g., "Bulk" vs normal, "C&D" vs "E&F" basis).

### Test Cases (`e2e/testCase/<module>/*.spec.ts`)
Spec files are the actual test scenarios. They use `test.describe.serial` for sequential execution and pass a `sharedData` object between tests in the same suite. Tests call the base case functions and orchestrate the full workflow (create → submit for approval → approve → verify).

### Business Modules
- **tradingSlip** (TS-01 through TS-09) — Trading slip creation with various order types
- **salesContract** — Sales contract creation
- **contractInstruction** (CI-01) — Contract instructions
- **subContractInstruction** (SubCI-01) — Sub-contract instructions
- **freightBooking** — Freight booking creation
- **freightCharge** — Freight charge management
- **invoice** — Invoice creation
- **payment** — Payment processing
- **purchaseOrder** — Purchase order creation
- **report** — Report verification

### End-to-End Flow
A full scenario (e.g., TS-01) chains multiple sub-modules: Trading Slip → Sales Contract → Contract Instruction → Sub-Contract Instruction → Purchase Order → Freight Booking → Invoice → Payment. Each module's spec exports a function that the downstream module imports and calls.

### Excel Data Tools (`e2e/utils/tool/`)
- `readExcel.ts` — reads Excel files for data-driven testing
- `compareExcelDataAgainstUI.spec.ts` — compares Excel data against UI values
- `toolSendMMSCNo.ts`, `toolSendSupplierInvoice.ts` — external system integration helpers
- `aiTypes.ts` — TypeScript type aliases for `AiQuery` and `AiAssert`

### AI Interaction Pattern
The Midscene `ai` object is used for:
1. **Scrolling**: `await ai("scroll to the right to stop at the 'Buyer Goods Description' column")`
2. **Clicking**: `await ai("click the last row which 'SC No.' contains ...")`
3. **Querying**: `const [value] = await Promise.all([aiQuery("text content of 'Field Name' field")])`
4. **Asserting**: `await aiAssert("verify that the 'Division' field equal to FAT001")`

Use `aiQuery` wrapped in `Promise.all` with array destructuring (`const [val] = await Promise.all([aiQuery(...)])`) — this is the established pattern in this codebase, even for single values.

## Environment Configuration

API keys and model selection are in `.env` (currently configured for Alibaba DashScope qwen-vl-max-latest). Midscene uses these via `MIDSCENE_MODEL_NAME`, `OPENAI_API_KEY`, `OPENAI_BASE_URL`. The `.env` also contains NCTS-specific credentials (username, password, division, etc.) used by test data files.

## Key Conventions

- Selectors: Mix of XPath (`//span[@id='lstDivision']`) and CSS (`input[name="txtUserID"]`). XPath with `normalize-space()` for text matching.
- All utility functions take `page: any` (not the typed `Page`).
- Tab navigation uses `//a[normalize-space()='TabName']` pattern.
- Save buttons: `//input[@id='btnSave']` (full save), `//input[@id='btnSaveExisting']` (save within a tab).
- Date format used throughout: `dd-mmm-yyyy` (e.g., `21-Oct-2025`).
- Tests are serial within a describe block (`test.describe.serial`) — order matters.
