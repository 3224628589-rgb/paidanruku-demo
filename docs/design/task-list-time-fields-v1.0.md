# 入库任务列表时间字段 V1.0 实现对齐

## 交付信息

- 输出模式：`project-native-preview`（直接更新现有 Demo 页面，不新增独立路由）。
- 原始需求基线：<https://yaoshibang.feishu.cn/wiki/W36fwhKlviWngQkpP0Pcu0nvn1e>
- AI 补充需求：<https://yaoshibang.feishu.cn/wiki/Mzxpw1WzSiyGYqkfdXgcAUvRnIc>
- 目标视口：`1920 x 1080`、`1280 x 800`。
- 结构状态：`structure-confirmed`，只调整任务列表首页。

## Discovered UI Constraints

- 复用 `#taskFilters`、`[data-task-filter]`、`#taskListSummary` 的实时筛选与清空机制。
- 表头 `.task-list-columns` 与数据行 `.inbound-task-row` 必须共享同一套 grid 列定义。
- 任务页保持 24px 外边距、紧凑工作台密度和现有状态色，不新增卡片分区。
- 时间原始值统一为 `YYYY-MM-DD HH:mm`，显示时拆为日期、时分两行。
- 1280px 下不引入横向滚动；供应商列保持省略，时间列固定为紧凑宽度。
- 最近操作时间与业务写操作绑定，不能在渲染、查看或切换步骤时修改。

## Screen Inventory / State Model

| 页面/状态 | 触发 | 主要变化 | 下一状态 |
| --- | --- | --- | --- |
| 任务列表默认态 | 进入模块 | 展示 9 个列表字段、6 组筛选条件 | 筛选或进入任务 |
| 时间筛选态 | 输入创建/最近操作日期区间 | 与任务号、采购单、供应商、商品条件按 AND 组合 | 清空或继续筛选 |
| 无结果态 | 无任务满足全部条件 | 展示现有无结果文案 | 清空筛选 |
| 新建任务 | 新建成功 | 创建时间与最近操作时间相同 | 拍单页 |
| 业务操作完成 | 实际改变任务业务数据且成功 | 仅最近操作时间更新 | 当前工作台 |
| 只读查看 | 打开、返回、切步骤、搜索、展开 | 两个时间均不变化 | 当前页面 |
| 重新打开任务 | 返回列表后再次进入 | 恢复该任务上次流程快照，不回写聚合数量 | 对应工作台 |
| 已入库只读 | 点击“查看” | 可浏览步骤与明细，写操作禁用 | 当前页面 |

## ASCII Layout

```text
┌ 入库任务首页 ──────────────────────────────────────────────────────────┐
│ 任务号 │ 采购单号 │ 供应商 │ 商品信息                               │
│ 创建时间 [开始—结束] │ 最近操作时间 [开始—结束] │ 清空筛选          │
├任务号┬创建时间┬最近操作┬待验货┬待核准┬准入库┬已入库┬采购单/供应商┬操作┤
│ ...                                                                  │
└──────────────────────────────────────────────────────────────────────┘
```

## Screen Contract

| 要求 | 数据/交互口径 | 实现位置 |
| --- | --- | --- |
| 任务创建时间筛选 | 起止日期，包含边界日 | `index.html`、`taskMatchesHomeFilters()` |
| 最近操作时间筛选 | 起止日期，包含边界日 | `index.html`、`taskMatchesHomeFilters()` |
| 时间列表字段 | 两个独立列，完整绝对时间 | `renderTaskHome()` |
| 最近操作定义 | 最近一次成功且实际改变业务数据或处理状态的时间 | `touchCurrentTask()` |
| 非操作排除 | 查看、导航、筛选、展开、自动刷新、失败或幂等无变化不更新时间 | `syncCurrentTaskProgress()` 默认不 touch |
| 重开不回写 | 按任务恢复流程快照；渲染只读，不覆盖列表聚合 | `captureWorkflowSnapshot()`、`restoreWorkflowSnapshot()` |
| 已入库只读 | 已完成任务的业务写控件禁用，业务写入口同时设保护 | `applyWorkflowReadOnlyState()`、`guardTaskMutation()` |

## Component Map

| UI 元素 | 复用/修改 | 文件 |
| --- | --- | --- |
| 文本筛选 | 复用现有 label/input | `index.html`、`styles.css` |
| 时间区间筛选 | 新增 `.task-date-filter/.task-date-range` | `index.html`、`styles.css` |
| 任务列表 grid | 修改为 9 列 | `styles.css` |
| 时间单元格 | 新增 `.task-time-cell`，复用任务行样式 | `app.js`、`styles.css` |
| 业务时间更新 | 新增 `touchCurrentTask()`，拆离渲染同步 | `app.js` |

## Implementation Notes / Verification

- 时间筛选字段间为 AND；开始日期晚于结束日期时返回 0 条，不自动交换用户输入。
- Demo 使用前端内存时间；生产实现应改用服务端成功提交时间，并与操作日志最后一条有效业务事件一致。
- 已验证：创建时间单日筛选、最近操作时间单日筛选、与供应商组合筛选、清空恢复。
- 已验证：打开/返回任务不更新时间；拍照后只更新最近操作时间；新任务两个时间相同。
- 已验证：返回后重开任务保留流程数据；纯重开不会覆盖四卡数量或最近操作时间；已入库任务只能查看。
- 已验证：`1920 x 1080` 与 `1280 x 800` 无页面横向溢出，表头与数据列对齐；浏览器控制台无错误。
- 静态检查：`node --check app.js`、`git diff --check -- index.html app.js styles.css` 均通过。
