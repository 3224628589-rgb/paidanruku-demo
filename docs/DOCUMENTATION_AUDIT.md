# 文档审计与维护计划

## 本次治理结论

本项目此前的主要问题不是缺少内容，而是**同一规则散落在根目录、docs、QA 和提示词中**：移动端/设备屏历史描述与当前 PC 逻辑并存，页面规格没有按页面拆分，原始需求和接口资料与现行规范混放。

本次按“入口、规范、证据、参考、归档”分层，建立单一事实来源。

## 文件去向

| 原文件/材料 | 现位置 | 当前定位 |
| --- | --- | --- |
| `三步入库业务逻辑与交互说明.md` | `product/workflow-and-states.md` | 当前跨页业务与交互规范。 |
| `docs/智能入库PRD.md` | `product/prd.md` | 生产化需求、数据、边界和验收。 |
| `docs/ui-design-system.md` | `design/pc-ui-spec.md` | 当前 PC 视觉与动效规范。 |
| `docs/approval-page-design-notes.md` | `design/approval-workbench.md` | 核准页设计取舍。 |
| `design-qa.md` | `qa/current-pc.md` | 当前 PC 验收证据。 |
| `demo说明.md` | `runbooks/demo-walkthrough.md` | 现场演示路径。 |
| `需求提示词.md` | `archive/pc-rebuild-brief.md` | 已完成重构的历史基线。 |
| `码上放心平台接口文档.md` | `reference/ma-shang-fang-xin-api.md` | 外部接口资料。 |
| `需求文档/*.docx` | `reference/original-requirements/` | 原始业务材料，只读参考。 |

## 已补齐的重要文档

| 文档 | 补齐的缺口 |
| --- | --- |
| `docs/README.md` | 明确文档入口、职责、阅读路径和维护规则。 |
| `product/pages/photo.md` | 拍单页独立交互与业务逻辑。 |
| `product/pages/inspection.md` | 验货页独立交互与业务逻辑。 |
| `product/pages/approval.md` | 核准页独立交互与业务逻辑。 |
| `architecture/frontend-overview.md` | 静态 Demo 的文件、状态、渲染和交互边界。 |
| `qa/test-checklist.md` | 可重复执行的手工回归清单。 |
| `runbooks/local-development.md` | 本地启动、缓存刷新和浏览器验证步骤。 |
| `adr/0001-pc-task-workbench.md` | 从设备屏迁移为 PC 任务工作台的决策与约束。 |
| `CONTRIBUTING.md` | 文档与代码变更的最小协作规则。 |

## 已识别的冗余与处理方式

| 冗余来源 | 风险 | 处理 |
| --- | --- | --- |
| 根目录提示词与当前业务规格重复 | 旧约束被误用 | 归档为历史重构基线，不再作为当前需求来源。 |
| 演示说明与 README 重复 | 使用者不知道看哪份 | README 只保留入口，完整演示移至 runbook。 |
| QA 中的移动端/设备屏记录 | 会误导后续视觉验收 | QA 明确标为历史，当前只验收 PC。 |
| PRD、业务说明、UI 规范同时写布局 | 维护后不一致 | 工作流写行为，UI 写尺寸/布局，PRD 写生产规则。 |
| 外部接口与页面规格同层 | 接口字段被错误翻译成 UI 要求 | 移至 `reference/` 并增加定位说明。 |

## 仍缺失但暂不虚构的文档

| 优先级 | 缺失文档 | 缺失原因 | 补齐条件 |
| --- | --- | --- | --- |
| P0 | 真实 API Contract | 当前 Demo 没有后端接口、鉴权或错误码 | 接口 owner 确认服务边界后，以 OpenAPI/字段字典补齐。 |
| P0 | 数据持久化与幂等设计 | 当前状态仅在浏览器内模拟 | 确认数据库、任务恢复和重复扫码策略后补齐。 |
| P1 | 部署与 GitHub Pages Runbook | 仓库未提供部署配置与目标环境 | 明确托管平台、域名、构建步骤后补齐。 |
| P1 | 权限与审计方案 | 店员/主管边界尚未定稿 | 业务确认核准、编辑、撤回权限后补齐。 |
| P1 | 自动化 E2E 测试方案 | 当前仅有浏览器手工验收 | 选定 Playwright/Cypress 与 CI 后补齐。 |
| P2 | 设计 token 与资产导出清单 | Figma 只提供单个进度组件真值 | 完整设计系统交付后补齐。 |

## 维护检查

提交前至少完成：

1. 页面行为是否同步到对应 `product/pages/` 文件。
2. 跨页面流程或状态是否同步到 `product/workflow-and-states.md`。
3. 视觉尺寸、动效或 Figma 组件是否同步到 `design/`。
4. 已验证内容是否同步到 `qa/`；未验证内容不写成“已通过”。
5. 原始资料、当前规格和历史材料是否处于正确目录。

## 方法参考

- GitHub Docs 的内容模型强调按读者任务组织内容、保持可扫描结构，并将贡献规范显式放在仓库中。
- ADR 采用“背景、决策、后果”的轻量模板记录对长期结构有影响的选择。
- 本项目据此采用 docs-as-code：当前规范、验收证据、原始参考和历史材料分层存放，避免重复维护。
