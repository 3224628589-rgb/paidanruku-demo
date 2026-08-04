# 文档中心

本目录采用 docs-as-code：每个文档有单一职责、明确读者和更新触发条件。根目录 [README](../README.md) 只用于项目入口；详细内容统一放在此处。

## 阅读路径

业务与交互的第一准则是仓库根目录最新稿 [《入库提效三期 拍单入库新》](../入库提效三期%20拍单入库新.docx)；[旧稿](../入库提效三期%20拍单入库.docx)仅用于版本对比。以下文档是实现说明、设计约束和验收材料；出现冲突时先登记到 [PRD 对齐交付说明](design/prd-alignment/README.md)，不得直接用派生文档覆盖最新稿。

| 读者 | 建议顺序 |
| --- | --- |
| 产品/设计 | [Word 最新稿](../入库提效三期%20拍单入库新.docx) -> [版本差异](design/prd-alignment/version-diff-2026-07-21.md) -> [PRD 对齐交付说明](design/prd-alignment/README.md) -> [工作流与状态](product/workflow-and-states.md) -> [拍单](product/pages/photo.md) / [验货](product/pages/inspection.md) / [核准](product/pages/approval.md) |
| 前端 | [架构概览](architecture/frontend-overview.md) -> [三份页面规格](product/pages/photo.md) -> [本地开发](runbooks/local-development.md) |
| 测试/验收 | [测试清单](qa/test-checklist.md) -> [当前 PC QA](qa/current-pc.md) |
| 生产化规划 | [PC PRD](product/prd.md) -> [参考资料](reference/README.md) -> [决策记录](adr/) |

## 目录职责

| 目录 | 内容 | 维护规则 |
| --- | --- | --- |
| `product/` | 产品目标、工作流、状态与 PRD | 业务或页面行为变化时先更新。 |
| `product/pages/` | [拍单](product/pages/photo.md)、[验货](product/pages/inspection.md)、[核准](product/pages/approval.md) 三份独立规格 | 每个页面只写本页目标、结构、状态、交互和验收。 |
| `design/` | 桌面布局、视觉组件、核准工作台取舍 | 视觉或布局变化时同步。 |
| `architecture/` | 当前代码结构、状态和渲染边界 | 代码目录或核心状态变化时同步。 |
| `adr/` | 已确认的重要决策及其后果 | 影响架构、流程或数据边界时新增，不覆盖旧决策。 |
| `qa/` | 手工测试清单与已完成验收证据 | 每轮交付后更新。 |
| `runbooks/` | 本地运行和现场演示步骤 | 启动方式或演示路径变化时更新。 |
| `reference/` | 外部接口、原始需求、业务样本 | 只引用，不作为 UI 规范。 |
| `archive/` | 已被当前规格替代的提示词和历史材料 | 不参与当前验收。 |

## 规范

- 任何页面改动都必须同时更新 `product/pages/` 中对应文件；跨页逻辑同步到 `product/workflow-and-states.md`。
- 文档使用小写英文目录和 kebab-case 文件名；标题使用中文业务名即可。
- 不能在多个文件重复维护同一套流程、状态或尺寸；其余文档只能链接到规范来源。
- 参考原始资料与当前规格必须分开，避免把旧需求或接口字段误当成现行 UI 要求。

详见 [文档审计](DOCUMENTATION_AUDIT.md)。
