# 协作与文档更新指南

## 变更原则

- 先阅读根目录 [README](README.md) 和 [文档中心](docs/README.md)。
- 页面行为变化：更新对应 `docs/product/pages/` 文件；跨页流程或状态变化：更新 `docs/product/workflow-and-states.md`。
- 布局、Figma 组件、尺寸或动效变化：更新 `docs/design/`。
- 验证过的结果才写入 `docs/qa/`；未验证内容标注为待确认。
- 不把原始需求、接口参考或历史提示词当作当前 UI 规范。

## 提交前检查

```bash
node --check app.js
git diff --check
```

然后按 [PC Demo 手工回归清单](docs/qa/test-checklist.md) 走一遍受影响流程。

## 文档写法

- 一个文件只承担一种职责；避免复制整段流程或同一组尺寸。
- 使用明确的标题、表格和可验证的描述；当前事实、历史记录和待确认项分开写。
- 新的重要技术/产品决策写入 `docs/adr/`，说明背景、决策与后果。
