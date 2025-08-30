import { expect } from "@playwright/test";
import { test } from "../../fixture";
import * as fs from "fs";
import * as path from "path";
import * as xlsx from "xlsx";
import { type, checkboxisChecked, clear } from "e2e/utils/baseTest";
import { testCredentials } from "e2e/data/tradingSlipTestData";

test.setTimeout(3600000);

type ReportRow = Record<string, unknown>;

const BASE_URL = "http://192.168.72.44/NCTS-LiveClone";
const LOGIN_URL = `${BASE_URL}/Login.aspx`;
const INVOICE_BROWSE_URL = `${BASE_URL}/Invoice/InvoiceBrowse.aspx`;
const RESULT_PATH = path.resolve(__dirname, "invoiceWithVendorBill_result.xlsx");
const resolveExcelPath = () => {
  const preferred = [
    path.resolve(__dirname, "faq", "Invoice with Vendor Bill_DTC.xlsx"),
    path.resolve(__dirname, "faq", "Invoice with Vendor Bill_DTC.ods"),
  ];

  for (const file of preferred) {
    if (fs.existsSync(file)) return file;
  }

  throw new Error(
    `Excel file not found. Expected one of:\n- ${preferred.join("\n- ")}`
  );
};

const normalizeText = (value: unknown) => String(value ?? "").replace(/\s+/g, " ").trim();

const normalizeYesNo = (value: unknown) => {
  const raw = normalizeText(value).toLowerCase();
  if (!raw) return "";
  if (["yes", "y", "true", "1", "checked"].includes(raw)) return "Yes";
  if (["no", "n", "false", "0", "unchecked"].includes(raw)) return "No";
  return normalizeText(value);
};

const normalizeDate = (value: unknown) => {
  const raw = normalizeText(value);
  if (!raw) return "";
  if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(raw)) return raw;

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;

  const day = `${parsed.getDate()}`.padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day}-${months[parsed.getMonth()]}-${parsed.getFullYear()}`;
};

const isDateColumn = (column: string) => /\bdate\b/i.test(column);
const isYesNoValue = (value: unknown) => {
  const raw = normalizeText(value).toLowerCase();
  return ["yes", "no", "y", "n", "true", "false", "0", "1", "checked", "unchecked"].includes(raw);
};

const getInvoiceNoFromRow = (row: ReportRow) =>
  normalizeText(row["Invoice No."] ?? row["Invoice No"] ?? row["Invoice"] ?? row["Invoice number"]);



const loginToSystem = async (page: any) => {
  await page.goto(LOGIN_URL, { waitUntil: "domcontentloaded" });
  await type(page, "//input[@name='txtUserID']", testCredentials.userid);
  await type(page, "//input[@name='txtPassword']", testCredentials.password);
  await page.click("//input[@name='btnLogin']");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(2000);
};


const normalizeExpected = (column: string, value: unknown) => {
  if (column === "Override Due Date") return normalizeYesNo(value);
  if (isDateColumn(column)) return normalizeDate(value);
  if (isYesNoValue(value)) return normalizeYesNo(value);
  return normalizeText(value);
};

const getValueFromLabelCell = async (page: any, labelText: string) => {
  const locator = page.locator(`//label[normalize-space()='${labelText}']/ancestor::td[1]`).first();
  if (await locator.count() === 0) {
    console.log(`Value extracted for ${labelText}: label not found`);
    return "";
  }

  const value = await locator.evaluate((td, targetLabel) => {
    const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
    const clone = td.cloneNode(true) as HTMLElement;

    clone.querySelectorAll("label").forEach((label) => {
      if (normalize(label.textContent ?? "") === normalize(targetLabel)) {
        label.remove();
      }
    });

    clone.querySelectorAll("input, script, style").forEach((element) => element.remove());

    return normalize(clone.textContent ?? "");
  }, labelText);
  console.log(`Value extracted for ${labelText}: ${value}`);
  return value;
};

const buildFailedRow = (
  invoiceNo: string,
  mismatches: Array<{ column: string; excelValue: string; uiValue: string }>
) => {
  const failedRow: Record<string, string> = {
    "Invoice No.": invoiceNo,
    Status: "Fail",
    "Mismatch Count": String(mismatches.length),
  };

  mismatches.forEach((mismatch, index) => {
    const seq = index + 1;
    failedRow[`Mismatch ${seq} Column`] = mismatch.column;
    failedRow[`Mismatch ${seq} Excel Value`] = mismatch.excelValue;
    failedRow[`Mismatch ${seq} UI Value`] = mismatch.uiValue;
  });

  return failedRow;
};

test("Invoice with Vendor Bill - validate UI values against Excel", async ({ page }) => {
  const excelPath = resolveExcelPath();
  const wb = xlsx.readFile(excelPath, { cellDates: false });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: "", raw: false }) as ReportRow[];
  const passedRows: Array<Record<string, string>> = [];
  const failedRows: Array<Record<string, string>> = [];
  let totalRows = 0;

  try {
    await loginToSystem(page);

    for (const row of rows) {
      const invoiceNo = getInvoiceNoFromRow(row);
      if (!invoiceNo) continue;
      totalRows++;

      try {
        console.log(`Checking invoice: ${invoiceNo}`);
        await page.goto(INVOICE_BROWSE_URL, { waitUntil: "domcontentloaded" });
        await page.waitForSelector("//input[@id='txtInvRefNo']", { state: "visible", timeout: 15000 });

        const entityTypeSelector = page.locator("//span[@id='select2-lstInvoiceEntityType-container']").first();
        if ((await entityTypeSelector.count()) > 0) {
          try {
            await entityTypeSelector.click({ timeout: 5000 });
            await page.click("(//li[@role='treeitem'])[1]");
          } catch {
            console.log(`Invoice ${invoiceNo} - unable to switch invoice entity type, continue with current default`);
          }
        }

        await clear(page, "//input[@id='txtInvRefNo']");
        await type(page, "//input[@id='txtInvRefNo']", `${invoiceNo}`);
        await page.click("//input[@id='btnSearch']");

        const resultLink = page.locator("//table[@id='grdInvoice_t_frozen']/tbody/tr[2]/td[2]/span/a").first();
        await resultLink.waitFor({ state: "visible", timeout: 15000 });
        await resultLink.click();

        //field from Invoice Details
        const invoiceNoValue = await getValueFromLabelCell(page, "Invoice No.");
        const invoiceDateValue = await getValueFromLabelCell(page, "Invoice Date");
        const invoiceDueDateValue = await getValueFromLabelCell(page, "Due Date");
        const divisionValue = await getValueFromLabelCell(page, "Division");
        const blNoValue = await getValueFromLabelCell(page, "BL Number");
        const blDateValue = await getValueFromLabelCell(page, "BL Date");
        const overDueDateValue = await checkboxisChecked(page, "//input[@id='chkbxOverrideDueDate']");

        //field from SC
        const [page1] = await Promise.all([
          page.context().waitForEvent("page"),
          page.click("//a[@id='lnkSalesContractNo']"),
        ]);
        await page1.waitForLoadState("domcontentloaded");
        const tsDateValue = await getValueFromLabelCell(page1, "SC");
        console.log(`Value extracted from new page for SC: ${tsDateValue}`);
  

        const fieldChecks = [
          {
            column: "Invoice No.",
            actual: normalizeText(invoiceNoValue),
            expected: normalizeExpected("Invoice No.", row["Invoice No."]),
            compareMode: "contain",
          },
          {
            column: "Invoice Date",
            actual: normalizeDate(invoiceDateValue),
            expected: normalizeExpected("Invoice Date", row["Invoice Date"]),
            compareMode: "equal",
          },
          {
            column: "Invoice Due Date",
            actual: normalizeDate(invoiceDueDateValue),
            expected: normalizeExpected("Invoice Due Date", row["Invoice Due Date"]),
            compareMode: "equal",
          },
          {
            column: "Product Division",
            actual: normalizeText(divisionValue),
            expected: normalizeExpected("Product Division", row["Product Division"]),
            compareMode: "contain",
          },
          {
            column: "BL Date",
            actual: normalizeDate(blDateValue),
            expected: normalizeExpected("BL Date", row["BL Date"]),
            compareMode: "contain",
          },
          {
            column: "Override Due Date",
            actual: normalizeYesNo(overDueDateValue),
            expected: normalizeYesNo(row["Override Due Date"]),
            compareMode: "contain",
          },
        ];

        console.log(`Invoice ${invoiceNo} - Excel values:`);
        for (const field of fieldChecks) {
          console.log(`Excel ${field.column}: ${field.expected}`);
        }

        const rowMismatches: Array<{ column: string; excelValue: string; uiValue: string }> = [];

        for (const field of fieldChecks) {
          const matched =
            field.compareMode === "contain"
              ? field.actual.includes(field.expected)
              : field.actual === field.expected;

          if (!matched) {
            const message = `Invoice ${invoiceNo} - ${field.column} mismatch | expected: ${field.expected} | actual: ${field.actual}`;
            console.log(message);
            rowMismatches.push({
              column: field.column,
              excelValue: field.expected,
              uiValue: field.actual,
            });
            continue;
          }

          console.log(`Invoice ${invoiceNo} - ${field.column} matched | expected: ${field.expected} | actual: ${field.actual}`);
        }

        if (rowMismatches.length === 0) {
          passedRows.push({
            "Invoice No.": invoiceNo,
            Status: "Pass",
          });
          console.log(`Invoice ${invoiceNo}: validation passed`);
        } else {
          failedRows.push(buildFailedRow(invoiceNo, rowMismatches));
          console.log(`Invoice ${invoiceNo}: validation completed with ${rowMismatches.length} mismatch(es)`);
        }
      } catch (error: any) {
        const uiErrorMessage = error?.message ?? String(error);
        console.log(`Invoice ${invoiceNo} - row execution error | ${uiErrorMessage}`);
        failedRows.push(
          buildFailedRow(invoiceNo, [
            {
              column: "Row Execution Error",
              excelValue: invoiceNo,
              uiValue: uiErrorMessage,
            },
          ])
        );
        continue;
      }
    }

    expect(
      failedRows.length,
      `Completed all rows. Failed invoice count: ${failedRows.length}. Result workbook: ${RESULT_PATH}`
    ).toBe(0);
  } finally {
    // Always write the result Excel, even if the test crashes mid-way
    try {
      const resultWorkbook = xlsx.utils.book_new();

      const passedSheet =
        passedRows.length > 0
          ? xlsx.utils.json_to_sheet(passedRows)
          : xlsx.utils.json_to_sheet([{ "Invoice No.": "", Status: "" }]);
      const failedSheet =
        failedRows.length > 0
          ? xlsx.utils.json_to_sheet(failedRows)
          : xlsx.utils.json_to_sheet([{ "Invoice No.": "", Status: "", "Mismatch Count": "" }]);

      xlsx.utils.book_append_sheet(resultWorkbook, passedSheet, "Passed");
      xlsx.utils.book_append_sheet(resultWorkbook, failedSheet, "Failed");
      xlsx.writeFile(resultWorkbook, RESULT_PATH);

      console.log(`Result workbook generated: ${RESULT_PATH}`);
      console.log(`Total rows processed: ${totalRows}`);
      console.log(`Passed rows: ${passedRows.length}`);
      console.log(`Failed rows: ${failedRows.length}`);
    } catch (writeError: any) {
      console.error(`Failed to write result Excel: ${writeError?.message ?? writeError}`);
    }

    if (!page.isClosed()) {
      await page.close();
    }
  }
});
