# 页面与实现映射

| 业务区域 | DOM / 渲染入口 | 共享数据或事件 | 边界 |
| --- | --- | --- | --- |
| 任务列表 | `#taskHomePage` / `renderTaskHome` | `inboundTasks`、`workflowSnapshots` | 日期只展示日；统计在业务成功后提交 |
| 拍单取景 | `#photoPage .camera-card` / `recognizeReceiptPhotos` | `state.photos` | PNG/JPG、10MB、OCR 锁页 |
| 票据列表 | `#photoGrid` / `renderPhotos` | `selectedPhotoIds` | 勾选、全选、二次确认、删后重匹配 |
| 验货取景 | `#mockScan` / `processMockScanBatch` | `scanEvents`、`currentScanCodes` | 0.5 秒分组等待、重复码和已入库码拦截 |
| 验货卡片 | `#receiveList` / `renderReceiveItems` | `receiveItems` | 按票据+商品批次聚合；三态颜色 |
| 验货批删 | `#deleteSelectedBatches` / `deleteSelectedReceiveItems` | `selectedBatchIds` | 确认后删除卡片及其追溯码/候选投影 |
| 追溯码编辑 | `openTraceEditor` / `.figma-trace-dialog` | `codes`、`expectedCodes` | Figma `363:90`；20 位自动校验、蓝黄标识、最后一码不可删 |
| 待核准队列 | `#approvalQueue` / `renderApprovalQueue` | `approveDecisions`、`confirmedPendingLineIds` | 新卡倒序；留待卡排尾 |
| 核准证据 | `renderApprovalEvidence` | `getApprovalReviewModel` | 蓝卡、黄卡、三方对比上下排列 |
| 系统单候选 | `openCandidatePicker("purchase")` / `.figma-purchase-dialog` | `purchaseCandidateIndex` | Figma `363:90`；Enter 后筛选，确定后重新核准 |
| 随货单候选 | `openCandidatePicker("receipt")` / `.figma-receipt-dialog` | `receiptCandidateIndex` | Figma `363:90`；当前任务票据候选，确定后重新核准 |
| 批次编辑 | `openBatchEditor` / `.figma-batch-dialog` | `approvalEdits` | Figma `363:90`；实物/随货单/采购单一键填入 + 三字段保存 |
| 共享进度 | `[data-progress-footer]` / `renderInboundProgress` | `getProgressGroups` | 三页同源；页面切换不改数据 |
| 待验货明细 | `renderUninspectedReceiptBucketListV2` | `getReceiptUninspectedGroups`、`removedReceiptLineIds` | 图片一级、OCR 行二级；筛选、勾选、批删 |
| 待核准明细 | `renderPendingVerificationBucketList` | `approveDecisions`、`bucketExceptionFilters` | 一卡一行；异常多选并集筛选、批量准入库 |
| 准入库明细 | `renderPurchaseStatusBucketList(..., "ready")` | `approvalEdits`、`inboundDrafts` | 采购单一级、商品二级；两级勾选、回退、勾选入库 |
| 已入库明细 | `renderPurchaseStatusBucketList(..., "inbound")` | `inboundCompletedLineIds`、`inboundDrafts` | 与准入库同字段；详情仅返回 |

## 共享状态迁移

```text
OCR 明细 ──首次实物命中──> 验货卡
  │                         ├─系统无异常────────> 准入库
  └────────未命中──────────> 待验货             ├─异常/未录全/破损─> 待核准
                                                   ├─人工通过────────> 准入库
                                                   ├─人工留待────────> 待核准队尾
                                                   └─提交入库────────> 已入库
```
