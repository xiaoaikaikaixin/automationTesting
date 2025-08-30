# JoinQuant 策略回测自动化说明

本文档说明 [test.spec.ts](file:///c:/Users/aijuan.lin0022/Downloads/MidsceneTest/NCTS/e2e/example/backtesting/test.spec.ts) 的执行流程与关键点，用于基于 `test.xlsx` 的参数组合批量运行聚宽策略回测，并将回测结果写回 Excel。

## 依赖与输入

- 测试框架：Playwright
- 自动化能力：Midscene（`fixture.ts` 提供的 `aiTap/aiQuery` 等能力）
- Excel：`e2e/example/backtesting/test.xlsx`
- 目标网站：`https://www.joinquant.com/user/login/index`
- 目标策略：`启四实验V4`

### Excel 输入列

脚本从 `test.xlsx` 的每一行读取以下参数：

- `换仓阈值 (Rank)` → `g.rank_threshold`
- `止盈涨幅（B）` → `g.tp_ratio`
- `回落比例 (A)` → `g.tp_rollback`
- `硬止损线 (SL)`（也兼容 `硬止损 线 (SL)`）→ `g.sl_ratio`

### Excel 输出列

每次回测完成后，脚本会采集并写回以下指标列：

- 策略收益
- 策略年化收益
- 最大回撤
- 阿尔法
- 贝塔
- 夏普比率
- 胜率
- 盈亏比
- 索提诺比率
- 日均超额收益
- 日胜率
- 信息比率
- 策略波动率
- 最大回撤区间

## 执行流程

### 1) 登录 JoinQuant

1. 打开登录页：`https://www.joinquant.com/user/login/index`
2. 选择“密码登录”
3. 输入手机号码与密码
4. 勾选“阅读并接受聚宽用户协议及隐私政策”
5. 点击“登录”

### 2) 进入策略页面

登录后进入“我的策略”列表，点击目标策略 `启四实验V4` 进入策略页面。

### 3) 循环处理 Excel 的每一行参数

对 `test.xlsx` 中每一行执行一次完整回测：

1. 点击 `编辑策略`（XPath：`//a[@id='algo-button']`），进入代码编辑区域
2. 可选弹窗处理（如果出现引导/提示类弹窗）
   - 脚本会尝试点击“跳过”和“确定”；若没有弹窗则忽略
3. 更新策略代码中的参数（只改这 4 个赋值，其他代码保持不变）
   - `g.rank_threshold = <Rank>`
   - `g.tp_ratio = <B>`
   - `g.tp_rollback = <A>`
   - `g.sl_ratio = <SL>`
4. 保存策略
   - 使用快捷键 `Ctrl+S` 触发保存
5. 运行回测
   - 点击 `运行回测`（XPath：`//div[@id='daily-new-backtest-button']`）
6. 等待回测完成提示
   - 等待 `//span[@id='backtest-complete']` 出现（最长 6 分钟）
7. 采集回测指标并写回 Excel
   - 使用 `agent.aiQuery(...)` 从页面提取指标字段
   - 将指标写回当前行对应列

## 异常与容错

- 弹窗可能并非每次都出现：相关点击被包裹在 `try/catch` 中，不出现时会自动跳过。
- 页面加载波动：脚本在关键步骤后包含 `waitForTimeout`，用于降低因异步渲染导致的元素不可点击问题。
- 回测时长波动：`backtest-complete` 的等待超时设置为 6 分钟，可按实际情况调整。

## 如何运行

在仓库根目录执行：

```bash
npx playwright test e2e/example/backtesting/test.spec.ts
```

如果需要先确认 Playwright 能识别到该用例：

```bash
npx playwright test e2e/example/backtesting/test.spec.ts --list
```

## 输出结果

执行完成后，`test.xlsx` 的对应行会被写入本次回测的指标值。重复运行会覆盖同一行的指标列。

