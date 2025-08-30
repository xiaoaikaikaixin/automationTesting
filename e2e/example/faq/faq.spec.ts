import { expect } from "@playwright/test";
import { test } from "../../../fixture";
import * as xlsx from "xlsx";
import * as path from "path";
import { type } from "e2e/utils/baseTest";

test.setTimeout(3600000);

type FaqRow = {
  ID?: string | number;
  Question?: string;
  Aliases?: string;
  Category?: string;
  Tags?: string;
  Content?: string;
};

const normalizeCellText = (value: unknown) => String(value ?? "").trim();

const normalizeAliases = (value: unknown) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (raw.includes("\n")) return raw;
  if (raw.includes(",")) {
    return raw
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .join("\n");
  }
  return raw;
};

const normalizeTags = (value: unknown) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  return raw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .join(", ");
};

const getFirstRowCellByHeader = async (page: any, headerText: string) => {
  const result = await page.evaluate(({ headerText }: { headerText: string }) => {
    const normalize = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
    const desired = normalize(headerText);
    const tables = Array.from(document.querySelectorAll("table"));

    for (const table of tables) {
      const headerCells = Array.from(table.querySelectorAll("thead th")).map((th) =>
        normalize(th.textContent ?? "")
      );
      const index = headerCells.findIndex((t) => t === desired || t.includes(desired));
      if (index < 0) continue;

      const firstRow = table.querySelector("tbody tr");
      if (!firstRow) continue;

      const cells = Array.from(firstRow.querySelectorAll("td"));
      const cell = cells[index];
      return cell ? (cell.textContent ?? "").replace(/\s+/g, " ").trim() : null;
    }
    return null;
  }, { headerText });

  return result as string | null;
};


test("FAQ - Batch create entries from Excel", async ({ page }) => {
  const excelPath = path.resolve(__dirname, "faq_export.xlsx");
  const wb = xlsx.readFile(excelPath);
  const sheet = wb.Sheets["FAQ"] ?? wb.Sheets[wb.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { defval: "" }) as FaqRow[];

  await page.goto("http://192.168.41.6:3000/login", { waitUntil: "domcontentloaded" });

  await type(page, "//input[@id='username']", "icof-441");
  await type(page, "//input[@id='password']", "Yiyue003!!!");
  await page.click("//button[normalize-space()='Sign In']");
  await page.click("//button[normalize-space()='I Understand & Agree']");

  await page.waitForLoadState("networkidle");
  await page.click("//button[normalize-space()='Admin']");
  await page.click("//button[normalize-space()='FAQ Manager']");

  await page.waitForTimeout(5000);


  for (let i = 76; i < data.length; i++) {
    const row = data[i];

    const id = normalizeCellText(row.ID);
    const question = normalizeCellText(row.Question);
    const aliases = normalizeAliases(row.Aliases);
    const category = normalizeCellText(row.Category);
    const tags = normalizeTags(row.Tags);
    const content = String(row.Content ?? "");

    if (!question) continue;

    await page.click("//button[normalize-space()='+ New FAQ Entry']");

    if (id) await type(page, "//input[@placeholder='faq_category_001']", id);
    await type(page, "//input[@placeholder='Why is my contract stuck in Open status?']", question);
    if (aliases) await type(page, "//body[1]/div[2]/div[1]/div[3]/textarea[1]", aliases);
    if (category) await type(page, "//input[@placeholder='troubleshooting / definitions / how_to']", category);
    if (tags) await type(page, "//input[@placeholder='contract, status']", tags);
    if (content) await type(page, "//body[1]/div[2]/div[1]/div[5]/textarea[1]", content);

    await page.click("//button[normalize-space()='Preview']");
    await page.waitForTimeout(3000);
    await page.click("//button[normalize-space()='Save']");
    await page.waitForTimeout(3000);
    await page.waitForLoadState("networkidle");


    // const firstQuestion = await getFirstRowCellByHeader(page, "Question");
    // expect(firstQuestion).toBe(question);
    console.log( `row number: ${i}`, `Created entry: ${question}`);
  }
});
