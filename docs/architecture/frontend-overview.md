# 前端架构概览

## 运行模型

当前项目是无需构建的静态前端 Demo：`index.html` 加载 `styles.css` 与 `app.js`，通过浏览器内状态模拟任务、拍照、扫码、核准和入库。

```text
index.html
  -> app.js        状态、业务规则、渲染和事件
  -> styles.css    PC grid、Figma 进度组件与动效
  -> assets/       步骤图标、进度 SVG、票据/商品/扫码图片
```

## 主要页面

| DOM 区域 | 业务页面 | 核心渲染/交互 |
| --- | --- | --- |
| `#taskHomePage` | 任务入口 | `renderTaskHome()`、`createInboundTask()`、`openInboundTask()` |
| `#photoPage` | 拍单 | `renderPhotos()`、`addPhoto()` |
| `#scanPage` | 验货 | `renderReceiveItems()`、`buildMockScanBatch()`、`upsertScannedEvent()` |
| `#approvePage` | 核准 | `startApproveMatching()`、核准队列/详情渲染 |
| `[data-progress-footer]` | 右侧进度 | `renderInboundProgress()`、状态明细入口 |

## 状态边界

`app.js` 的 `state` 管理当前视图、步骤、任务、票据、扫码命中、核准队列与进度动效。`receiveItems` 是验货品批的运行时集合。

关键约束：

- `scopeScanEventToReceipt()` 为扫描事件加入票据归属，避免多张票据共享同一品批 id。
- `prioritizeScannedItems()` 把本轮最新命中移动到列表顶部；`renderReceiveItemsWithTransition()` 对旧行执行 FLIP 位移动画。
- `markProgressIncreases()` 只在真实计数增长时写入 `progressImpactKeys`；`renderInboundProgress()` 才会添加 `charging` 和 `bucket-impact`。
- 静态展示的 Figma 数字与真实状态明细分离：前者保持视觉还原，后者由 `getProgressGroups()` 计算。

## 样式边界

`styles.css` 的末尾 Figma override 负责当前 PC 布局和进度组件。修改时要先确认不会被更早的历史样式覆盖；页面级规则优先采用 grid/flex 的稳定尺寸，不通过绝对定位堆叠主内容。

## 后续演进

接入真实后端时，将浏览器内状态替换为 task、receipt、trace、approval 和 inbound-submission API；页面组件保持，服务层负责持久化、去重、幂等、审计和异常恢复。
