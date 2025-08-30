import { expect } from "@playwright/test";
import { test } from "../../../fixture";
import * as xlsx from "xlsx";
import * as path from "path";
import { type } from "e2e/utils/baseTest";

test.setTimeout(3600000); // 1 hour timeout

test("JoinQuant Backtesting", async ({ page, ai, aiInput, aiTap, aiQuery }) => {
  const excelPath = path.resolve(__dirname, "test.xlsx");
  const wb = xlsx.readFile(excelPath);
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet) as any[];

  // 1. go to `https://www.joinquant.com/user/login/index`
  await page.goto("https://www.joinquant.com/user/login/index", { waitUntil: "domcontentloaded" });
  
  // 2. select 密码登录, key in 手机号码 18059750300 和密码：Yiyue11@
  await page.click("//li[contains(text(),'密码登录')]");
  await type(page, "//input[@name='username']",'18059750300');
  await type(page, "//input[@name='pwd']",'*****');
  
  // 点击checkbox for ‘阅读并接受聚宽用户协议及隐私政策’
  await page.click("//input[@id='agreementBox']");
  
  // click ‘登录’ button
  await page.click("//button[@class='login-submit btnPwdSubmit']");
  await page.waitForTimeout(5000);

  console.log("user Login successful!!!");
  
  // 选择我的策略 -> 启四实验V4, 进入策略编译页面
  await page.click("//a[@class='name'][contains(text(),'启四实验V4')]");
  await page.waitForTimeout(3000);


  
  console.log("Strategy page 启四实验V4' open successful!!!");
  
  const { PlaywrightAgent } = require("@midscene/web/playwright");
  const agent = new PlaywrightAgent(page);

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    console.log("total rows:", data.length);
    console.log("current row index:", i+1);
    console.log("current execute row:", row);

    //click '编辑策略' button
    await page.click("//a[@id='algo-button']");
    await page.waitForTimeout(2000);

    // try {
    //     if(await aiQuery("跳过")){
    //         await ai("click '跳过' 按钮");
    //     }
    //     if(await aiQuery("不再提示")){
    //         await ai("click '不再提示' 按钮");
    //     }

    //     // await page.click("//a[@class='introjs-button introjs-skipbutton']");
    //     // await page.click("//button[text()='不再提示']");
    // } catch {
    //     console.log("click '跳过' 按钮 or '不再提示' 按钮 failed");
    //     continue;
    // }
    
    const rankThreshold = row["换仓阈值 (Rank)"];
    const tpRatio = row["止盈涨幅（B）"];
    const tpRollback = row["回落比例 (A)"];
    const slRatio = row["硬止损线 (SL)"] || row["硬止损 线 (SL)"]; // account for typo
    // const min_revenue_value = row["营收门槛"];

    // 3. update script’s related value
    await page.evaluate((params) => {
      let codeUpdated = false;
      const updateCode = (code: string) => {
        let newCode = code;
        // newCode = newCode.replace(/g\.min_revenue_value\s*=\s*[\-\d\.]+/, `g.min_revenue_value = ${params.min_revenue_value}`);
        newCode = newCode.replace(/g\.rank_threshold\s*=\s*[\-\d\.]+/, `g.rank_threshold = ${params.rankThreshold}`);
        newCode = newCode.replace(/g\.tp_ratio\s*=\s*[\-\d\.]+/, `g.tp_ratio = ${params.tpRatio}`);
        newCode = newCode.replace(/g\.tp_rollback\s*=\s*[\-\d\.]+/, `g.tp_rollback = ${params.tpRollback}`);
        newCode = newCode.replace(/g\.sl_ratio\s*=\s*[\-\d\.]+/, `g.sl_ratio = ${params.slRatio}`);
        return newCode;
      };

      // Try Ace
      const aceEditors = document.querySelectorAll(".ace_editor");
      if (aceEditors.length > 0 && (window as any).ace) {
        const editor = (window as any).ace.edit(aceEditors[0].id);
        const code = editor.getValue();
        editor.setValue(updateCode(code), -1);
        codeUpdated = true;
      }
      
      // Try Monaco
      if (!codeUpdated && (window as any).monaco) {
         const models = (window as any).monaco.editor.getModels();
         if (models.length > 0) {
           const code = models[0].getValue();
           models[0].setValue(updateCode(code));
           codeUpdated = true;
         }
      }

      // Try CodeMirror
      if (!codeUpdated) {
        const cmEditors = document.querySelectorAll(".CodeMirror");
        if (cmEditors.length > 0) {
          const cm = (cmEditors[0] as any).CodeMirror;
          const code = cm.getValue();
          cm.setValue(updateCode(code));
          codeUpdated = true;
        }
      }
    }, { rankThreshold, tpRatio, tpRollback, slRatio });

    await page.waitForTimeout(1000);
    
    await page.keyboard.press("Control+S");
    console.log("Code saved by keyboard shortcut: Ctrl+S");

    await page.waitForTimeout(3000);
    
    // 4. select date from ‘2026-01-01’ to ‘2026-02-04’, money value =500000
    // Fill the date inputs and money value
    // JoinQuant uses standard inputs for these.
    // await agent.aiInput("2016-01-01", "开始日期 (Start Date)");
    // await agent.aiInput("2026-02-04", "结束日期 (End Date)");
    // await agent.aiInput("500000", "初始资金 (Initial Capital)");


    console.log("Date inputs update successfully!!!");
    
    // 5. click ‘运行回测‘ button
    await page.click("//div[@id='daily-new-backtest-button']");
    console.log("Backtest start !!!");
    
    // 6. wait 3 minutes
    const backtestComplete = page.locator("//span[@id='backtest-complete']");
    await backtestComplete.waitFor({ state: "visible", timeout: 6 * 60 * 1000 });
    const backtestCompleteMessage = (await backtestComplete.textContent())?.trim();
    console.log("Backtest complete message:", backtestCompleteMessage);
    // 7. get the following field’s value and input back to the excel
    const result: any = await agent.aiQuery(
      `{
        strategyReturn: string, // 策略收益
        annualReturn: string, // 策略年化收益
        maxDrawdown: string, // 最大回撤
        alpha: string, // 阿尔法
        beta: string, // 贝塔
        sharpeRatio: string, // 夏普比率
        winRate: string, // 胜率
        plRatio: string, // 盈亏比
        sortinoRatio: string, // 索提诺比率
        dailyExcessReturn: string, // 日均超额收益
        dailyWinRate: string, // 日胜率
        infoRatio: string, // 信息比率
        volatility: string, // 策略波动率
        maxDrawdownPeriod: string // 最大回撤区间
      }, the backtest result metrics on the page`
    );

    row["策略收益"] = result.strategyReturn;
    row["策略年化收益"] = result.annualReturn;
    row["最大回撤"] = result.maxDrawdown;
    row["阿尔法"] = result.alpha;
    row["贝塔"] = result.beta;
    row["夏普比率"] = result.sharpeRatio;
    row["胜率"] = result.winRate;
    row["盈亏比"] = result.plRatio;
    row["索提诺比率"] = result.sortinoRatio;
    row["日均超额收益"] = result.dailyExcessReturn;
    row["日胜率"] = result.dailyWinRate;
    row["信息比率"] = result.infoRatio;
    row["策略波动率"] = result.volatility;
    row["最大回撤区间"] = result.maxDrawdownPeriod;

    const newWb = xlsx.utils.book_new();
    const newWs = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(newWb, newWs, sheetName);
    xlsx.writeFile(newWb, excelPath);

    console.log("Backtest result metrics query and input back to excel successfully!!!");

  }
});
