# NCTS Project Design Summary

## 1. 项目整体设计特点

这个项目的核心设计不是“纯 Playwright 项目”，而是一个 **Playwright + Midscene 混合型自动化测试框架**。

它的目标很明确：

- 用 **Playwright 原生代码** 处理稳定、结构清晰、可定位的页面操作与字段校验
- 用 **Midscene AI 可视化能力** 处理复杂界面理解、弱结构页面识别、跨区域文本提取、图片/PDF 等更偏视觉语义的校验
- 用 **Excel/测试数据文件** 驱动测试输入与结果比对
- 用 **testManager + dashboard + midscene report** 做批量执行与结果汇总

从当前项目结构来看，这套框架强调的是：

- 业务测试可复用
- 数据驱动
- 可同时支持代码式自动化和 AI 式自动化
- 报告可追踪
- 能兼顾传统字段校验与视觉语义校验

## 2. 框架分层

### 2.1 执行层

项目执行核心是 Playwright：

- 配置文件：`playwright.config.ts`
- 执行目录：`e2e/**/*.spec.ts`
- 浏览器项目：当前主要是 `chromium`

这里的 Playwright 负责：

- 打开页面
- 登录系统
- 点击、输入、选择下拉
- 等待页面加载
- 处理新窗口、下载、弹窗
- 输出 trace / test result

### 2.2 AI 扩展层

项目通过 `fixture.ts` 把 Midscene 挂载到 Playwright 的 `test` 上：

- `ai`
- `aiTap`
- `aiInput`
- `aiQuery`
- `aiAssert`

这意味着当前项目不是把 AI 当成独立工具，而是把它作为 Playwright 的增强能力。

这层设计的好处是：

- 同一个测试文件里可以混合使用 Playwright 和 AI
- 不需要完全切换测试风格
- 可以按页面复杂度决定是否启用 AI

### 2.3 业务封装层

项目中大量公共动作被封装在：

- `e2e/utils/baseTest.ts`
- `e2e/utils/baseCase.ts`
- `e2e/utils/*/*BaseCase.ts`

这层封装的特点是：

- 把高频动作标准化，例如 `click`、`type`、`dropdown`、`clear`
- 把登录、公共流程、模块流程沉淀为可复用函数
- 降低每个 spec 文件的重复代码

这也是这个项目后续降低 token 成本的关键基础，因为很多步骤已经可以复用，不需要每次都让 AI 重新理解页面。

### 2.4 数据驱动层

项目大量使用：

- `e2e/data/*.ts`
- Excel 文件
- `xlsx` 读取逻辑

典型用途包括：

- 测试输入数据
- UI 与 Excel 对账
- 报表结果写回 Excel
- 批量执行多行数据

这说明项目已经具备“半数据平台化”的特征，不是单条脚本，而是支持批量回归与对账验证。

### 2.5 执行管理与报告层

项目还有一层管理能力：

- `testManager/testRun.ts`
- `testManager/testUtils.ts`
- `testManager/testConfig.json`
- `dashboard.html`
- `midscene_run/`

这一层的作用是：

- 按配置启停测试
- 管理优先级和依赖
- 汇总 Playwright / Midscene 执行结果
- 生成可视化 dashboard

这说明该项目设计目标不是“单人临时脚本”，而是朝团队化、批量化执行方向发展的。

## 3. 当前项目最有价值的设计特点

### 3.1 混合式自动化

项目最明显的设计特点是：

- **结构化页面动作** 用 Playwright
- **视觉语义理解** 用 Midscene

这比“全 AI”或者“全 XPath”都更实用。

原因是：

- 纯 XPath 容易脆弱
- 纯 AI token 消耗大，且不适合高频重复动作
- 混合方式能平衡稳定性、可维护性、成本

### 3.2 适合业务系统表单型场景

NCTS 这类页面的典型特征是：

- 表单很多
- 标签和值分布复杂
- iframe / popup / 新窗口较多
- grid / report / attachment / PDF 下载较多

因此项目采用：

- `baseTest.ts` 统一输入和选择动作
- `baseCase.ts` 统一登录和通用流程
- AI 只在难识别部分介入

这是比较符合企业系统测试的设计。

### 3.3 数据与结果可落地

项目不是只做“页面通过/失败”，而是开始做：

- Excel 输入
- 逐行比对
- Passed / Failed worksheet
- 导出结果文件

这使它更接近业务对账测试，而不仅是冒烟测试。

## 4. AI 可视化检查点的设计建议

当前项目已经接入 Midscene，但如果从“架构最佳实践”来总结，建议把 AI 可视化检查点限定在以下场景。

### 4.1 适合用 Midscene 的检查点

#### A. 页面语义校验

例如：

- “页面右上角显示用户名”
- “状态区域显示 Pending Approval”
- “页面上出现 Freight Charge Number”
- “某个卡片区域展示了关键业务信息”

这些断言用 `aiAssert` / `aiQuery` 很自然，因为它更接近人工检查逻辑。

#### B. 难以稳定定位的复杂 UI

例如：

- 没有稳定 id 的复杂表单
- 动态渲染的 label/value 区域
- 文本跨多个节点
- 同一字段值可能在不同 DOM 层级

这类场景如果完全靠 XPath，维护成本高；Midscene 更适合做“语义定位”。

#### C. 图片内容检查

相对于普通字段值，图片内容更适合用 Midscene 可视化方式检查，例如：

- 页面上传后的图片缩略图是否正确显示
- 截图中的关键信息是否存在
- 图片上的文案、标记、图表趋势是否符合预期

因为这类内容并不总能通过 DOM 直接提取。

#### D. PDF 页面内容检查

如果目标不是检查“是否下载成功”，而是检查：

- PDF 页面中是否包含特定标题
- PDF 中是否出现某个合同号、发票号、客户名
- PDF 版式是否基本正确

这类场景更适合用 Midscene 可视化校验，而不是只判断 URL 或文件名。

也就是说：

- **文件存在 / 下载成功**：优先 Playwright
- **PDF 内容正确 / 版面正确**：优先 Midscene

#### E. 报表截图或导出内容的人工式验证

例如：

- 某报表页面展示的栏目是否齐全
- 图表标题、图例、时间范围是否正确
- 复杂报表页面在视觉上是否展示了目标信息

这类也更适合 Midscene。

## 5. 哪些步骤优先使用 Playwright Code，能减少 token 消耗

这是当前项目最值得固化的原则。

### 5.1 高频重复动作，一律优先 Playwright

例如：

- 登录
- 输入用户名密码
- 打开菜单
- 点按钮
- 选择 dropdown
- 清空输入框
- 点搜索
- 翻页
- 下载文件

原因：

- 这些动作结构固定
- DOM 选择器明确
- Playwright 成本低、速度快、稳定性高
- 没必要让 AI 每次重复理解页面

这正是减少 token 消耗最直接的方法。

### 5.2 可明确定位的字段取值，优先 Playwright

例如：

- `input.value`
- `textContent`
- 表格某列某行值
- checkbox 是否选中
- attachment 类型是否为 `pdf`

这些场景使用：

- `locator.textContent()`
- `inputValue()`
- `getAttribute()`
- `isChecked()`

比 `aiQuery` 更直接、更稳定，也更省 token。

### 5.3 可规则化比对的断言，优先代码断言

例如：

- 日期相等
- 金额相等
- 字段包含关系
- Excel 与 UI 一一对账
- 状态枚举值校验

这种场景应该先通过代码完成：

- `normalizeText`
- `normalizeDate`
- `expect`
- 自定义 compare rule

原因是：

- 结果确定性高
- 不依赖视觉推理
- 更容易记录 failed details

### 5.4 批量循环与结果写回，必须优先代码

例如：

- Excel row-by-row
- Passed / Failed worksheet 输出
- mismatch 聚合
- 失败原因结构化记录

这类逻辑必须由代码来做，因为 AI 不适合承担流程控制与结构化输出主逻辑。

## 6. 哪些场景更适合 Midscene，可减少维护成本

这里要注意，Midscene 不一定减少 token，但它能减少 **定位与维护成本**。

### 6.1 页面经常改 DOM，但业务语义不变

例如：

- 按钮位置变化
- 标签被套多层 span/div
- 某些字段从 text node 变成 span 或 link

如果继续用硬编码 XPath，维护会越来越重。  
这时可以让 Midscene 按“字段语义”去找内容。

### 6.2 报表、图表、图片、PDF 这种视觉载体

这类内容不一定有稳定 DOM，也不一定适合精确 XPath。

相比之下，Midscene 更像人工在看：

- 有没有这个信息
- 这个字段是不是出现在页面上
- 这个图表标题是否正确
- PDF 是否包含目标文本

### 6.3 一次性探索或未知页面

如果是新页面、新模块、缺少稳定定位器，先用 Midscene 做探索会更快。  
等页面稳定后，再把高频步骤沉淀回 Playwright 原生代码。

这也是比较经济的方式：

- 前期探索用 AI
- 后期稳定流程用代码

## 7. 推荐的项目使用原则

建议把当前项目的自动化策略总结成下面这套原则。

### 原则 1：流程控制一定由代码主导

包括：

- for loop
- 条件分支
- 错误处理
- 新窗口管理
- 下载管理
- Excel 读写
- Passed / Failed 输出

这些不要交给 AI。

### 原则 2：重复操作优先抽成基础函数

例如当前已有：

- `type`
- `clear`
- `dropdown`
- `checkboxisChecked`
- `extractValue`

后续建议继续沉淀：

- 通用 label-value 提取
- 新窗口打开并取值
- 报表导出并校验
- Excel mismatch 记录器

### 原则 3：AI 只放在“看图识义”的位置

AI 最适合做：

- 看页面是否显示某业务概念
- 看图表 / 图片 / PDF 是否包含目标内容
- 看复杂页面区域是否满足人工语义预期

而不是让它替代所有 click/type/search。

### 原则 4：先代码断言，后 AI 补强

推荐顺序：

1. 先尝试 DOM/属性/文本断言
2. 如果定位不稳，再考虑 Midscene
3. 如果是图片/PDF/视觉类内容，优先 Midscene

这样整体成本最低。

## 8. 对当前项目的落地建议

结合目前仓库现状，建议未来按下面方式继续演进。

### 8.1 Playwright 负责

- 登录
- 菜单导航
- 表单输入
- 下拉选择
- 搜索
- 新窗口切换
- 表格值提取
- Excel 对账
- 结果文件输出

### 8.2 Midscene 负责

- 页面关键业务状态的语义断言
- 页面复杂区域的文本提取
- 图片显示内容检查
- PDF 内容检查
- 报表截图 / 图表视觉检查

### 8.3 报表类场景的建议分工

对于报表测试，推荐拆成两层：

#### 第一层：Playwright 代码层

- 填筛选条件
- 点 Search
- 点 Export Excel
- 等下载完成
- 校验文件存在

#### 第二层：Midscene 视觉层

- 校验报表页面展示内容
- 校验截图中的字段
- 校验导出的 PDF/图像内容

这样能兼顾执行速度、成本和表达能力。

## 9. 一句话总结

这个项目最好的设计方向，不是把所有步骤都 AI 化，而是：

- **让 Playwright 管流程、管数据、管稳定动作**
- **让 Midscene 管视觉理解、语义断言、图片/PDF 检查**

这样既能减少 token 消耗，也能降低 XPath 维护成本，还能保留复杂页面检查能力。

## 10. 当前项目中的代表性文件

- 框架配置：`playwright.config.ts`
- AI 接入：`fixture.ts`
- 通用动作：`e2e/utils/baseTest.ts`
- 登录流程：`e2e/utils/baseCase.ts`
- 数据驱动示例：`e2e/example/invoiceWithVendorBill.spec.ts`
- Midscene 示例：`e2e/example/unsoldOrderCreationAI.spec.ts`
- AI + 业务流程示例：`e2e/testCase/freightCharge/freightChargeCreationAI.spec.ts`
- 回测与 AI 查询示例：`e2e/example/backtesting/test.spec.ts`
- 运行管理：`testManager/testRun.ts`
- 结果汇总：`testManager/testUtils.ts`

