const state = {
  currentView: "home",
  currentTaskId: null,
  workflowSnapshots: new Map(),
  currentStep: "photo",
  photos: [],
  selectedPhotoIds: new Set(),
  orderKeyword: "",
  taskFilters: {
    taskId: "",
    purchaseOrder: "",
    supplier: "",
    product: "",
    createdFrom: "",
    createdTo: "",
    updatedFrom: "",
    updatedTo: ""
  },
  scanKeyword: "",
  approveKeyword: "",
  approveSearchOpen: false,
  scanReview: null,
  inboundOrderIds: [],
  detailOrderId: null,
  approveTimer: null,
  scanCount: 0,
  scanCursor: 0,
  hitBatchId: null,
  hitTraceCode: null,
  hitTimer: null,
  hitCodeTimer: null,
  expandedBatchIds: new Set(),
  selectedBatchIds: new Set(),
  currentScanCodes: [],
  damagedBatchIds: new Set(),
  approvalNormalExpanded: false,
  approveReady: false,
  approveView: "workbench",
  activeBucket: "selected",
  expandedProgressOrderIds: new Set(),
  progressImpactKey: null,
  progressImpactKeys: new Set(),
  progressImpactTimer: null,
  touchedApprovalLineIds: new Set(),
  bucketDetailLineId: null,
  bucketKeyword: "",
  bucketSelectedLineIds: new Set(),
  bucketPageFilter: "",
  bucketProductFilter: "",
  bucketApprovalFilter: "",
  bucketOnlyUninspected: true,
  bucketExceptionFilters: new Set(),
  currentApproveLineId: null,
  approveDecisions: {},
  confirmedPendingLineIds: new Set(),
  inboundCompletedLineIds: new Set(),
  purchasePickerLineId: null,
  purchaseCandidateIndex: {},
  receiptPickerLineId: null,
  receiptCandidateIndex: {},
  purchaseMatchConfirmedLineIds: new Set(),
  receiptMatchConfirmedLineIds: new Set(),
  approvalEdits: {},
  removedReceiptLineIds: new Set(),
  inboundDrafts: {},
  operationBusy: false,
  operationTimer: null,
  nextScanSequence: 1,
  codes: [
    "81260024051600000123", "81260024051600000124", "81260024051600000125",
    "81260024051600000126", "81260024051600000127", "81260024051600000128",
    "81260024051600000129", "81260024051600000130", "81260024051600000131",
    "81260024051600000132", "81260025010800000201", "81260025010800000202",
    "81260025010800000203", "81260025010800000204", "81260025010800000205",
    "81260025010800000206", "81260025030100000301", "81260025030100000302"
  ]
};

const orders = [
  {
    id: "CG260601141",
    supplier: "广东壹号药业有限公司",
    amount: "872.05",
    date: "2026-06-03",
    source: "随货同行单 OCR 命中",
    codes: "81260024051600000123 81260025010800000201",
    items: "阿莫西林胶囊、连花清瘟颗粒",
    smart: true,
    lines: [
      { name: "阿莫西林胶囊", spec: "0.25g*24粒", batch: "A240516", qty: 12, price: "18.60", status: "票据一致" },
      { name: "连花清瘟颗粒", spec: "6g*10袋", batch: "L250108", qty: 4, price: "32.50", status: "待扫码" }
    ]
  },
  {
    id: "CG260601138",
    supplier: "广东壹号药业有限公司",
    amount: "751.24",
    date: "2026-06-03",
    source: "供应商 + 商品组合命中",
    codes: "81260025010800000203 81260025010800000204",
    items: "连花清瘟颗粒、布洛芬缓释胶囊",
    smart: true,
    lines: [
      { name: "连花清瘟颗粒", spec: "6g*10袋", batch: "L250108", qty: 4, price: "32.50", status: "组合匹配" },
      { name: "布洛芬缓释胶囊", spec: "0.3g*20粒", batch: "B250301", qty: 8, price: "28.90", status: "待验货" }
    ]
  },
  {
    id: "CG260601117",
    supplier: "广东壹号药业有限公司",
    amount: "316.70",
    date: "2026-06-02",
    source: "同供应商待确认",
    codes: "81260025030100000301",
    items: "布洛芬缓释胶囊",
    smart: false,
    lines: [
      { name: "布洛芬缓释胶囊", spec: "0.3g*20粒", batch: "B250301", qty: 8, price: "28.90", status: "少货风险" }
    ]
  },
  {
    id: "CG260601174",
    supplier: "药九九-河南药九九医药科技有限公司",
    amount: "35.01",
    date: "2026-06-01",
    source: "追溯码弱匹配",
    codes: "81310024051600000710",
    items: "维生素 C 片",
    smart: false,
    lines: [
      { name: "维生素 C 片", spec: "0.1g*100片", batch: "C250401", qty: 3, price: "11.67", status: "追溯码弱匹配" }
    ]
  },
  {
    id: "CG260601086",
    supplier: "辛选健康药业（广州）有限公司",
    amount: "55.00",
    date: "2026-06-02",
    source: "供应商名称搜索结果",
    codes: "81190025010800000621",
    items: "盐酸左西替利嗪片",
    smart: false,
    lines: [
      { name: "盐酸左西替利嗪片", spec: "5mg*12片", batch: "Z250210", qty: 5, price: "11.00", status: "供应商搜索" }
    ]
  }
];

const inboundTasks = [
  {
    id: "RK20260708003",
    title: "广东壹号药业有限公司随货入库",
    supplier: "广东壹号药业有限公司",
    status: "待核准",
    statusKey: "pending",
    step: "approve",
    createdAt: "2026-07-08 18:36",
    updatedAt: "2026-07-08 18:52",
    receiptCount: 2,
    traceCount: 18,
    lineCount: 13,
    abnormalCount: 2,
    uninspectedCount: 6,
    pendingCount: 10,
    readyCount: 8,
    inboundCount: 0,
    purchaseOrder: "CG10000002",
    products: ["布洛芬缓释胶囊", "盐酸左西替利嗪片"]
  },
  {
    id: "RK20260708002",
    title: "药九九-河南药九九医药科技有限公司入库",
    supplier: "药九九-河南药九九医药科技有限公司",
    status: "验货中",
    statusKey: "active",
    step: "scan",
    createdAt: "2026-07-08 17:18",
    updatedAt: "2026-07-08 17:46",
    receiptCount: 1,
    traceCount: 6,
    lineCount: 5,
    abnormalCount: 1,
    uninspectedCount: 3,
    pendingCount: 3,
    readyCount: 3,
    inboundCount: 0,
    purchaseOrder: "CG10000003",
    products: ["阿莫西林胶囊", "布洛芬缓释胶囊", "连花清瘟颗粒", "盐酸左西替利嗪片"]
  },
  {
    id: "RK20260708001",
    title: "辛选健康药业（广州）有限公司入库",
    supplier: "辛选健康药业（广州）有限公司",
    status: "待拍单",
    statusKey: "new",
    step: "photo",
    createdAt: "2026-07-08 15:42",
    updatedAt: "2026-07-08 15:42",
    receiptCount: 0,
    traceCount: 0,
    lineCount: 0,
    abnormalCount: 0,
    uninspectedCount: 0,
    pendingCount: 0,
    readyCount: 0,
    inboundCount: 0,
    purchaseOrder: "待识别",
    products: []
  },
  {
    id: "RK20260707018",
    title: "广东壹号药业有限公司随货入库",
    supplier: "广东壹号药业有限公司",
    status: "已入库",
    statusKey: "done",
    step: "approve",
    createdAt: "2026-07-07 16:20",
    updatedAt: "2026-07-07 17:08",
    receiptCount: 3,
    traceCount: 45,
    lineCount: 31,
    abnormalCount: 0,
    uninspectedCount: 0,
    pendingCount: 0,
    readyCount: 0,
    inboundCount: 45,
    purchaseOrder: "CG10000001",
    products: ["阿莫西林胶囊", "连花清瘟颗粒", "布洛芬缓释胶囊"]
  },
  {
    id: "RK20260707011",
    title: "广东壹号药业有限公司随货入库",
    supplier: "广东壹号药业有限公司",
    status: "已入库",
    statusKey: "done",
    step: "approve",
    createdAt: "2026-07-07 10:12",
    updatedAt: "2026-07-07 10:56",
    receiptCount: 2,
    traceCount: 28,
    lineCount: 19,
    abnormalCount: 1,
    uninspectedCount: 0,
    pendingCount: 0,
    readyCount: 0,
    inboundCount: 28,
    purchaseOrder: "CG10000004",
    products: ["布洛芬缓释胶囊", "盐酸左西替利嗪片"]
  }
];

const receiveItems = [];

const scanEvents = [
  {
    id: "batch-amox-a240516",
    name: "阿莫西林胶囊",
    spec: "0.25g*24粒",
    approval: "国药准字H44021987",
    batch: "A240516",
    expiry: "2027-09-28",
    source: "随货单VS实物",
    status: "ok",
    code: "81260024051600000125"
  },
  {
    id: "batch-ibuprofen-b250301",
    name: "布洛芬缓释胶囊",
    spec: "0.3g*20粒",
    approval: "国药准字H20013062",
    batch: "B250301",
    expiry: "2027-03-30",
    source: "系统单据VS实物",
    status: "warn",
    code: "81260025030100000301"
  },
  {
    id: "batch-lhqwg-l250108",
    name: "连花清瘟颗粒",
    spec: "6g*10袋",
    approval: "国药准字Z20040063",
    batch: "L250108",
    expiry: "2027-11-30",
    source: "随货单VS实物",
    status: "ok",
    code: "81260025010800000202"
  },
  {
    id: "batch-cetirizine-z250210",
    name: "盐酸左西替利嗪片",
    spec: "5mg*12片",
    approval: "国药准字H20040249",
    batch: "Z250210",
    expiry: "2027-02-10",
    source: "系统单据VS实物",
    status: "warn",
    systemMatchSucceeded: false,
    code: "81260025021000000401"
  },
  {
    id: "batch-ibuprofen-b250301",
    name: "布洛芬缓释胶囊",
    spec: "0.3g*20粒",
    approval: "国药准字H20013062",
    batch: "B250301",
    expiry: "2027-03-30",
    source: "系统单据VS实物",
    status: "warn",
    code: "81260025030100000302"
  }
];

const productDomainMeta = {
  "国药准字H44021987": {
    drugId: "D44021987",
    manufacturer: "广州白云山医药集团股份有限公司",
    dosageForm: "胶囊剂",
    produceDate: "2026-01-12"
  },
  "国药准字Z20040063": {
    drugId: "D20040063",
    manufacturer: "石家庄以岭药业股份有限公司",
    dosageForm: "颗粒剂",
    produceDate: "2026-01-08"
  },
  "国药准字H20013062": {
    drugId: "D20013062",
    manufacturer: "中美天津史克制药有限公司",
    dosageForm: "胶囊剂",
    produceDate: "2026-03-01"
  },
  "国药准字H20040249": {
    drugId: "D20040249",
    manufacturer: "重庆华邦制药有限公司",
    dosageForm: "片剂",
    produceDate: "2026-02-10"
  },
  "国药准字H41022321": {
    drugId: "D41022321",
    manufacturer: "东北制药集团沈阳第一制药有限公司",
    dosageForm: "片剂",
    produceDate: "2026-04-01"
  },
  "-": {
    drugId: "UNRESOLVED",
    manufacturer: "待核准",
    dosageForm: "待识别",
    produceDate: "-"
  }
};

const approveOrders = [
  {
    id: "CG10000001",
    mxfxBillCode: "MXF202606030018",
    supplier: "广东壹号药业有限公司",
    date: "2026-06-03",
    status: "待收货",
    lines: [
      {
        id: "ap-amox-a240516",
        status: "ok",
        issue: "",
        name: "阿莫西林胶囊",
        spec: "0.25g*24粒",
        approval: "国药准字H44021987",
        batch: "A240516",
        expiry: "2027-09-28",
        qty: 12,
        receiptPhoto: "拍摄票据 1",
        receiptHit: { left: 19, top: 46, width: 62, height: 9 },
        receipt: { name: "阿莫西林胶囊", spec: "0.25g*24粒", approval: "国药准字H44021987", batch: "A240516", expiry: "2027-09-28", qty: 12 },
        trace: { name: "阿莫西林胶囊", spec: "0.25g*24粒", approval: "国药准字H44021987", batch: "A240516", expiry: "2027-09-28", qty: 12 },
        system: { name: "阿莫西林胶囊", spec: "0.25g*24粒", approval: "国药准字H44021987", batch: "A240516", expiry: "2027-09-28", qty: 12 },
        abnormalFields: []
      },
      {
        id: "ap-lhqwg-l250108",
        status: "ok",
        issue: "",
        name: "连花清瘟颗粒",
        spec: "6g*10袋",
        approval: "国药准字Z20040063",
        batch: "L250108",
        expiry: "2027-11-30",
        qty: 4,
        receiptPhoto: "拍摄票据 1",
        receiptHit: { left: 18, top: 57, width: 64, height: 9 },
        receipt: { name: "连花清瘟颗粒", spec: "6g*10袋", approval: "国药准字Z20040063", batch: "L250108", expiry: "2027-11-30", qty: 4 },
        trace: { name: "连花清瘟颗粒", spec: "6g*10袋", approval: "国药准字Z20040063", batch: "L250108", expiry: "2027-11-30", qty: 4 },
        system: { name: "连花清瘟颗粒", spec: "6g*10袋", approval: "国药准字Z20040063", batch: "L250108", expiry: "2027-11-30", qty: 4 },
        abnormalFields: []
      }
    ]
  },
  {
    id: "CG10000002",
    mxfxBillCode: "MXF202606030021",
    supplier: "广东壹号药业有限公司",
    date: "2026-06-03",
    status: "部分入库",
    lines: [
      {
        id: "ap-ibuprofen-b250301",
        status: "warn",
        issue: "系统单据数量 8，随货同行单与实物追溯码识别数量为 6，少 2 盒",
        name: "布洛芬缓释胶囊",
        spec: "0.3g*20粒",
        approval: "国药准字H20013062",
        batch: "B250301",
        expiry: "2027-03-30",
        qty: 6,
        receiptPhoto: "拍摄票据 1",
        receiptHit: { left: 18, top: 68, width: 64, height: 9 },
        receipt: { name: "布洛芬缓释胶囊", spec: "0.3g*20粒", approval: "国药准字H20013062", batch: "B250301", expiry: "2027-03-30", qty: 6 },
        trace: { name: "布洛芬缓释胶囊", spec: "0.3g*20粒", approval: "国药准字H20013062", batch: "B250301", expiry: "2027-03-30", qty: 6 },
        system: { name: "布洛芬缓释胶囊", spec: "0.3g*20粒", approval: "国药准字H20013062", batch: "B250301", expiry: "2027-03-30", qty: 8 },
        figma: {
          productCode: "80000320",
          sourceSupplier: "重庆祥耀医药有限公司",
          traceActual: 12,
          traceExpected: 12,
          compareQty: { purchase: 1, receipt: 2, physical: 1 },
          inboundRows: [
            { orderId: "CG2026001121", status: "待入库", platformOrder: "2126062414963136", waybill: "YT2549528116550", qtyPrice: "10/12.2", purchasedAt: "2026-07-08 16:23" },
            { orderId: "CG2026001122", status: "待入库", platformOrder: "2126062414963136", waybill: "YT2549528116550", qtyPrice: "2/12.3", purchasedAt: "2026-07-08 16:23" }
          ],
          meituan: {
            brand: "济川药业",
            saleName: "蒲地蓝消炎口服液10ml*6支/盒",
            barcode: "6952764600016",
            discountPrice: "35.6",
            manufacturer: "重庆祥耀医药有限公司",
            approval: "国药准字HJ20260102",
            prescription: "OTC"
          }
        },
        abnormalFields: ["qty"]
      },
      {
        id: "ap-cetirizine-z250210",
        status: "warn",
        issue: "追溯码识别批号 Z250210，系统单据批号 Z250201，批号不一致",
        name: "盐酸左西替利嗪片",
        spec: "5mg*12片",
        approval: "国药准字H20040249",
        batch: "Z250210",
        expiry: "2027-02-10",
        qty: 5,
        receiptPhoto: "拍摄票据 1",
        receiptHit: { left: 18, top: 79, width: 64, height: 9 },
        receipt: { name: "盐酸左西替利嗪片", spec: "5mg*12片", approval: "国药准字H20040249", batch: "Z250210", expiry: "2027-02-10", qty: 5 },
        trace: { name: "盐酸左西替利嗪片", spec: "5mg*12片", approval: "国药准字H20040249", batch: "Z250210", expiry: "2027-02-10", qty: 5 },
        system: { name: "盐酸左西替利嗪片", spec: "5mg*12片", approval: "国药准字H20040249", batch: "Z250201", expiry: "2027-02-10", qty: 5 },
        abnormalFields: ["batch"]
      }
    ]
  },
  {
    id: "CG10000003",
    mxfxBillCode: "MXF202606010006",
    supplier: "药九九-河南药九九医药科技有限公司",
    date: "2026-06-01",
    status: "未入库",
    lines: [
      {
        id: "ap-vitc-c250401",
        status: "warn",
        issue: "系统单据商品为维生素 C 片，实物追溯码识别为维生素 C 咀嚼片",
        name: "维生素 C 片",
        spec: "0.1g*100片",
        approval: "国药准字H41022321",
        batch: "C250401",
        expiry: "2027-04-01",
        qty: 3,
        receiptPhoto: "拍摄票据 1",
        receiptHit: { left: 18, top: 35, width: 64, height: 9 },
        receipt: { name: "维生素 C 片", spec: "0.1g*100片", approval: "国药准字H41022321", batch: "C250401", expiry: "2027-04-01", qty: 3 },
        trace: { name: "维生素 C 咀嚼片", spec: "0.1g*100片", approval: "国药准字H41022321", batch: "C250401", expiry: "2027-04-01", qty: 3 },
        system: { name: "维生素 C 片", spec: "0.1g*100片", approval: "国药准字H41022321", batch: "C250401", expiry: "2027-04-01", qty: 3 },
        abnormalFields: ["name"]
      }
    ]
  }
];

const approveDemoPendingItems = [
  ["999 感冒灵颗粒", "10g*9袋", 10],
  ["藿香正气口服液", "10ml*10支", 8],
  ["复方氨酚烷胺胶囊", "12粒", 6],
  ["小柴胡颗粒", "10g*10袋", 12],
  ["板蓝根颗粒", "10g*20袋", 15],
  ["蒲地蓝消炎片", "0.31g*48片", 7],
  ["双黄连口服液", "10ml*10支", 9],
  ["感冒清热颗粒", "12g*10袋", 11],
  ["维 C 银翘片", "24片", 5],
  ["阿奇霉素片", "0.25g*6片", 4],
  ["头孢克肟胶囊", "0.1g*12粒", 6],
  ["罗红霉素胶囊", "0.15g*12粒", 5],
  ["蒙脱石散", "3g*10袋", 8],
  ["奥美拉唑肠溶胶囊", "20mg*14粒", 6],
  ["氯雷他定片", "10mg*6片", 4],
  ["对乙酰氨基酚片", "0.5g*12片", 10],
  ["开塞露", "20ml*20支", 3]
];

const stepOrder = ["photo", "scan", "approve"];
const pageByStep = {
  photo: "photoPage",
  scan: "scanPage",
  approve: "approvePage"
};

function getCurrentTask() {
  return inboundTasks.find((task) => task.id === state.currentTaskId) || null;
}

function getTaskStepLabel(step) {
  return {
    photo: "拍单",
    scan: "验货",
    approve: "核准"
  }[step] || "拍单";
}

function getTaskStatusLabel(step) {
  if (step === "approve") return { status: "待核准", statusKey: "pending" };
  if (step === "scan") return { status: "验货中", statusKey: "active" };
  return { status: "待拍单", statusKey: "new" };
}

function getTraceCount() {
  return receiveItems.reduce((sum, item) => sum + item.codes.length, 0);
}

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function getNowParts() {
  const now = new Date();
  const dateKey = `${now.getFullYear()}${padNumber(now.getMonth() + 1)}${padNumber(now.getDate())}`;
  const dateText = `${now.getFullYear()}-${padNumber(now.getMonth() + 1)}-${padNumber(now.getDate())}`;
  const timeText = `${padNumber(now.getHours())}:${padNumber(now.getMinutes())}`;
  return {
    dateKey,
    dateText,
    timeText,
    timestamp: `${dateText} ${timeText}`
  };
}

function buildNewTaskId() {
  const { dateKey } = getNowParts();
  let next = inboundTasks.filter((task) => task.id.startsWith(`RK${dateKey}`)).length + 1;
  let id = `RK${dateKey}${String(next).padStart(3, "0")}`;
  while (inboundTasks.some((task) => task.id === id)) {
    next += 1;
    id = `RK${dateKey}${String(next).padStart(3, "0")}`;
  }
  return id;
}

function touchCurrentTask(task = getCurrentTask()) {
  if (!task || task.statusKey === "done") return;
  const nextStatus = getTaskStatusLabel(state.currentStep);
  task.step = state.currentStep;
  task.status = nextStatus.status;
  task.statusKey = nextStatus.statusKey;
  task.updatedAt = getNowParts().timestamp;
  captureWorkflowSnapshot(task.id);
}

function syncCurrentTaskProgress({ touch = false } = {}) {
  const task = getCurrentTask();
  if (!task || state.currentView !== "workflow" || task.statusKey === "done") return;
  const progressCounts = getProgressCountsSnapshot();
  // Counts are a rebuildable projection and may refresh during rendering without
  // changing the task's business timestamp. Only a successful mutation calls touchCurrentTask().
  task.uninspectedCount = progressCounts.uninspected;
  task.pendingCount = progressCounts.pending;
  task.readyCount = progressCounts.ready;
  task.inboundCount = progressCounts.inbound;
  if (!touch) return;
  task.receiptCount = state.photos.length;
  task.traceCount = getTraceCount();
  task.lineCount = Math.max(task.lineCount, receiveItems.length);
  task.abnormalCount = Math.max(task.abnormalCount, getLinesByDecision("deferred").length);
  const scannedProducts = receiveItems.map((item) => `${item.name} ${item.spec}`.trim());
  if (scannedProducts.length) task.products = [...new Set(scannedProducts)];
  touchCurrentTask(task);
}

function isCurrentTaskReadOnly() {
  return getCurrentTask()?.statusKey === "done";
}

function guardTaskMutation() {
  if (!isCurrentTaskReadOnly()) return false;
  showToast("已入库任务仅支持查看");
  return true;
}

function captureWorkflowSnapshot(taskId = state.currentTaskId) {
  if (!taskId) return;
  state.workflowSnapshots.set(taskId, {
    photos: state.photos.map((photo) => ({ ...photo })),
    receiveItems: receiveItems.map((item) => ({
      ...item,
      codes: [...item.codes],
      expectedCodes: [...(item.expectedCodes || [])]
    })),
    scanCount: state.scanCount,
    scanCursor: state.scanCursor,
    currentScanCodes: [...state.currentScanCodes],
    damagedBatchIds: [...state.damagedBatchIds],
    touchedApprovalLineIds: [...state.touchedApprovalLineIds],
    approveDecisions: { ...state.approveDecisions },
    confirmedPendingLineIds: [...state.confirmedPendingLineIds],
    inboundCompletedLineIds: [...state.inboundCompletedLineIds],
    purchaseCandidateIndex: { ...state.purchaseCandidateIndex },
    receiptCandidateIndex: { ...state.receiptCandidateIndex },
    purchaseMatchConfirmedLineIds: [...state.purchaseMatchConfirmedLineIds],
    receiptMatchConfirmedLineIds: [...state.receiptMatchConfirmedLineIds],
    approvalEdits: Object.fromEntries(
      Object.entries(state.approvalEdits).map(([lineId, edit]) => [lineId, { ...edit }])
    ),
    removedReceiptLineIds: [...state.removedReceiptLineIds],
    inboundDrafts: Object.fromEntries(
      Object.entries(state.inboundDrafts).map(([lineId, draft]) => [lineId, { ...draft }])
    ),
    nextScanSequence: state.nextScanSequence
  });
}

function restoreWorkflowSnapshot(taskId) {
  const snapshot = state.workflowSnapshots.get(taskId);
  if (!snapshot) return false;
  resetWorkflowState();
  state.photos = snapshot.photos.map((photo) => ({ ...photo }));
  receiveItems.push(...snapshot.receiveItems.map((item) => ({
    ...item,
    codes: [...item.codes],
    expectedCodes: [...(item.expectedCodes || [])]
  })));
  state.scanCount = snapshot.scanCount;
  state.scanCursor = snapshot.scanCursor;
  state.currentScanCodes = [...snapshot.currentScanCodes];
  state.damagedBatchIds = new Set(snapshot.damagedBatchIds);
  state.touchedApprovalLineIds = new Set(snapshot.touchedApprovalLineIds);
  state.approveDecisions = { ...snapshot.approveDecisions };
  state.confirmedPendingLineIds = new Set(snapshot.confirmedPendingLineIds);
  state.inboundCompletedLineIds = new Set(snapshot.inboundCompletedLineIds);
  state.purchaseCandidateIndex = { ...snapshot.purchaseCandidateIndex };
  state.receiptCandidateIndex = { ...snapshot.receiptCandidateIndex };
  state.purchaseMatchConfirmedLineIds = new Set(snapshot.purchaseMatchConfirmedLineIds || []);
  state.receiptMatchConfirmedLineIds = new Set(snapshot.receiptMatchConfirmedLineIds || []);
  state.approvalEdits = Object.fromEntries(
    Object.entries(snapshot.approvalEdits || {}).map(([lineId, edit]) => [lineId, { ...edit }])
  );
  state.removedReceiptLineIds = new Set(snapshot.removedReceiptLineIds || []);
  state.inboundDrafts = Object.fromEntries(
    Object.entries(snapshot.inboundDrafts || {}).map(([lineId, draft]) => [lineId, { ...draft }])
  );
  state.nextScanSequence = snapshot.nextScanSequence || 1;
  return true;
}

function applyWorkflowReadOnlyState() {
  const readOnly = isCurrentTaskReadOnly();
  const locked = readOnly || state.operationBusy;
  const shell = document.getElementById("workflowShell");
  shell?.classList.toggle("is-readonly", readOnly);
  shell?.classList.toggle("is-busy", state.operationBusy);
  const mutationSelector = [
    "#takePhoto", "#uploadPhoto", "#deleteSelectedPhotos", "#selectAllPhotos", "[data-photo-select]", "#mockScan",
    "#deleteSelectedBatches", "#selectAllBatches", "[data-batch-select]",
    "[data-damage-toggle]", "[data-remove-code]", "[data-queue-decision]",
    "#deferCurrentLine", "#selectCurrentLine", "#approveBtn",
    "[data-purchase-pick-index]", "[data-receipt-pick-index]",
    "[data-modal-save]", "[data-approval-report]", "[data-progress-report]", "[data-submit-ready-inbound]",
    "[data-bucket-line-select]", "[data-bucket-select-all]", "[data-bucket-delete]",
    "[data-bucket-submit-ready]", "[data-bucket-revert-pending]", "[data-bucket-submit-inbound]"
  ].join(",");
  document.querySelectorAll(mutationSelector).forEach((control) => {
    if (locked) {
      if (!control.disabled) control.dataset.readonlyLocked = "true";
      control.disabled = true;
    } else if (control.dataset.readonlyLocked === "true") {
      control.disabled = false;
      delete control.dataset.readonlyLocked;
    }
  });
  document.querySelectorAll(".step, #backToTaskHome").forEach((control) => {
    if (state.operationBusy) {
      if (!control.disabled) control.dataset.busyLocked = "true";
      control.disabled = true;
    } else if (control.dataset.busyLocked === "true") {
      control.disabled = false;
      delete control.dataset.busyLocked;
    }
  });
}

function updateWorkflowTaskMeta() {
  const task = getCurrentTask();
  const title = document.getElementById("currentTaskTitle");
  const meta = document.getElementById("currentTaskMeta");
  if (!title || !meta) return;
  title.textContent = task ? `${task.id} ${task.title}` : "入库任务";
  meta.textContent = task
    ? `${task.status}${task.statusKey === "done" ? " · 只读查看" : ""} · 当前步骤：${getTaskStepLabel(state.currentStep)} · ${task.supplier}`
    : "拍单 · 验货 · 核准";
}

function taskMatchesHomeFilters(task) {
  const filters = state.taskFilters;
  const includes = (source, keyword) => !keyword.trim()
    || String(source || "").toLowerCase().includes(keyword.trim().toLowerCase());
  const inDateRange = (timestamp, from, to) => {
    if (!from && !to) return true;
    const date = String(timestamp || "").slice(0, 10);
    if (!date || (from && to && from > to)) return false;
    return (!from || date >= from) && (!to || date <= to);
  };
  return includes(task.id, filters.taskId)
    && includes(task.purchaseOrder, filters.purchaseOrder)
    && includes(task.supplier, filters.supplier)
    && includes((task.products || []).join(" "), filters.product)
    && inDateRange(task.createdAt, filters.createdFrom, filters.createdTo)
    && inDateRange(task.updatedAt, filters.updatedFrom, filters.updatedTo);
}

function renderTaskTime(timestamp) {
  const [date = "-"] = String(timestamp || "").split(" ");
  return `<time datetime="${date}"><span>${date}</span></time>`;
}

function renderTaskHome() {
  const list = document.getElementById("taskList");
  const summary = document.getElementById("taskListSummary");
  if (!list || !summary) return;

  const activeCount = inboundTasks.filter((task) => task.statusKey !== "done").length;
  const filteredTasks = inboundTasks.filter(taskMatchesHomeFilters);
  const hasFilters = Object.values(state.taskFilters).some((value) => value.trim());
  summary.textContent = hasFilters
    ? `显示 ${filteredTasks.length} / 共 ${inboundTasks.length} 个任务`
    : `${inboundTasks.length} 个任务 · ${activeCount} 个进行中`;
  list.innerHTML = filteredTasks.length ? filteredTasks.map((task) => `
    <article class="inbound-task-row status-${task.statusKey}" data-open-task="${task.id}" tabindex="0" role="button">
      <div class="task-id-cell">
        <strong>${task.id}</strong>
      </div>
      <div class="task-time-cell created">
        ${renderTaskTime(task.createdAt)}
      </div>
      <div class="task-time-cell updated">
        ${renderTaskTime(task.updatedAt)}
      </div>
      <div class="task-count-cell uninspected">
        <b>${task.uninspectedCount || 0}</b>
        <span>待验货</span>
      </div>
      <div class="task-count-cell pending">
        <b>${task.pendingCount || 0}</b>
        <span>待核准</span>
      </div>
      <div class="task-count-cell ready">
        <b>${task.readyCount || 0}</b>
        <span>准入库</span>
      </div>
      <div class="task-count-cell inbound">
        <b>${task.inboundCount || 0}</b>
        <span>已入库</span>
      </div>
      <div class="task-source-cell">
        <strong>${task.purchaseOrder || "待识别"}</strong>
        <span>${task.supplier}</span>
      </div>
      <div class="task-updated-cell">
        <button class="open-task-btn" data-open-task="${task.id}">进入</button>
      </div>
    </article>
  `).join("") : `<div class="task-list-empty">没有符合筛选条件的入库任务</div>`;

  list.querySelectorAll("[data-open-task]").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.stopPropagation();
      openInboundTask(item.dataset.openTask);
    });
    item.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openInboundTask(item.dataset.openTask);
    });
  });
}

function resetWorkflowState() {
  window.clearTimeout(state.approveTimer);
  window.clearTimeout(state.hitTimer);
  window.clearTimeout(state.hitCodeTimer);
  state.currentStep = "photo";
  state.photos = [];
  state.selectedPhotoIds.clear();
  state.orderKeyword = "";
  state.scanKeyword = "";
  state.approveKeyword = "";
  state.approveSearchOpen = false;
  state.scanReview = null;
  state.inboundOrderIds = [];
  state.detailOrderId = null;
  state.scanCount = 0;
  state.scanCursor = 0;
  state.hitBatchId = null;
  state.hitTraceCode = null;
  state.expandedBatchIds.clear();
  state.selectedBatchIds.clear();
  state.currentScanCodes = [];
  state.damagedBatchIds.clear();
  state.approvalNormalExpanded = false;
  state.approveReady = false;
  state.approveView = "workbench";
  state.activeBucket = "selected";
  state.expandedProgressOrderIds.clear();
  state.progressImpactKey = null;
  state.progressImpactKeys.clear();
  state.touchedApprovalLineIds.clear();
  state.bucketDetailLineId = null;
  state.bucketKeyword = "";
  state.bucketSelectedLineIds.clear();
  state.bucketPageFilter = "";
  state.bucketProductFilter = "";
  state.bucketApprovalFilter = "";
  state.bucketOnlyUninspected = true;
  state.bucketExceptionFilters.clear();
  state.currentApproveLineId = null;
  state.approveDecisions = {};
  state.confirmedPendingLineIds.clear();
  state.inboundCompletedLineIds.clear();
  state.purchasePickerLineId = null;
  state.purchaseCandidateIndex = {};
  state.receiptPickerLineId = null;
  state.receiptCandidateIndex = {};
  state.purchaseMatchConfirmedLineIds.clear();
  state.receiptMatchConfirmedLineIds.clear();
  state.approvalEdits = {};
  state.removedReceiptLineIds.clear();
  state.inboundDrafts = {};
  state.operationBusy = false;
  state.nextScanSequence = 1;
  receiveItems.splice(0, receiveItems.length);
  document.getElementById("scanPulse")?.classList.add("hidden");
}

function seedWorkflowFromTask(task) {
  resetWorkflowState();
  for (let index = 0; index < task.receiptCount; index += 1) {
    state.photos.push({
      id: Number(`${Date.now()}${index}`),
      title: `拍摄票据 ${index + 1}`,
      image: "assets/img/随货同行单.png",
      pageSeq: index + 1,
      uploadedAt: `${task.createdAt}:${String(index).padStart(2, "0")}`
    });
  }

  for (let index = 0; index < task.traceCount; index += 1) {
    const event = scopeScanEventToReceipt(
      scanEvents[index % scanEvents.length],
      Math.floor(index / scanEvents.length) % Math.max(task.receiptCount, 1)
    );
    const suffix = String((index % 90) + 10).padStart(2, "0");
    upsertScannedEvent({
      ...event,
      code: event.code.replace(/\d{2}$/, suffix)
    });
  }
  syncSmartApprovalDecisions();
  if (task.statusKey === "done") {
    getApproveLineEntries().forEach(({ line }) => state.inboundCompletedLineIds.add(line.id));
  }
  state.currentScanCodes = receiveItems.flatMap((item) => item.codes).slice(-3);
}

function openInboundTask(taskId) {
  const task = inboundTasks.find((item) => item.id === taskId);
  if (!task) return;
  const targetStep = task.step || "photo";
  state.currentView = "workflow";
  state.currentTaskId = task.id;
  if (!restoreWorkflowSnapshot(task.id)) seedWorkflowFromTask(task);
  syncSmartApprovalDecisions();
  state.currentStep = targetStep;
  document.getElementById("taskHomePage")?.classList.add("hidden");
  document.getElementById("workflowShell")?.classList.remove("hidden");
  updateWorkflowTaskMeta();
  renderPhotos();
  renderReceiveItems();
  setStep(targetStep);
  captureWorkflowSnapshot(task.id);
  applyWorkflowReadOnlyState();
}

function showTaskHome() {
  captureWorkflowSnapshot();
  window.clearTimeout(state.approveTimer);
  state.currentView = "home";
  document.getElementById("workflowShell")?.classList.add("hidden");
  document.getElementById("taskHomePage")?.classList.remove("hidden");
  renderTaskHome();
}

function createInboundTask() {
  const { timestamp } = getNowParts();
  const id = buildNewTaskId();
  inboundTasks.unshift({
    id,
    title: "新建入库任务",
    supplier: "厦门药栈前置仓",
    status: "待拍单",
    statusKey: "new",
    step: "photo",
    createdAt: timestamp,
    updatedAt: timestamp,
    receiptCount: 0,
    traceCount: 0,
    lineCount: 0,
    abnormalCount: 0,
    uninspectedCount: 0,
    pendingCount: 0,
    readyCount: 0,
    inboundCount: 0,
    purchaseOrder: "待识别",
    products: []
  });
  openInboundTask(id);
  showToast("已新建入库任务");
}

function showLightbox(src) {
  let lb = document.getElementById("image-lightbox");
  if (!lb) {
    lb = document.createElement("div");
    lb.id = "image-lightbox";
    lb.className = "image-lightbox";
    lb.innerHTML = '<div class="image-lightbox-backdrop" onclick="closeLightbox()"></div><img src="" alt="preview" /><button class="image-lightbox-close" onclick="closeLightbox()">×</button>';
    document.body.appendChild(lb);
  }
  lb.querySelector("img").src = src;
  lb.classList.add("active");
}

function closeLightbox() {
  var lb = document.getElementById("image-lightbox");
  if (lb) lb.classList.remove("active");
}

function setStep(step) {
  state.currentStep = step;
  document.getElementById("demoGuidePage")?.classList.add("hidden");
  Object.entries(pageByStep).forEach(([key, id]) => {
    document.getElementById(id).classList.toggle("hidden", key !== step);
  });

  const activeIndex = stepOrder.indexOf(step);
  document.querySelectorAll(".step").forEach((button) => {
    const index = stepOrder.indexOf(button.dataset.step);
    button.classList.toggle("active", button.dataset.step === step);
    button.classList.toggle("done", index < activeIndex);
  });

  if (step === "scan") {
    renderReceiveItems();
  }
  if (step === "approve") {
    startApproveMatching();
  }
  syncCurrentTaskProgress();
  updateWorkflowTaskMeta();
  renderInboundProgress();
}

function addPhoto(source) {
  if (guardTaskMutation() || state.operationBusy) return;
  const nextIndex = state.photos.length + 1;
  recognizeReceiptPhotos([{
    title: source === "camera" ? `拍摄票据 ${nextIndex}` : `相册票据 ${nextIndex}`,
    image: "assets/img/随货同行单.png"
  }]);
}

function sortReceiptPhotos() {
  state.photos.sort((left, right) => {
    const leftPage = Number.isFinite(left.pageSeq) ? left.pageSeq : Number.POSITIVE_INFINITY;
    const rightPage = Number.isFinite(right.pageSeq) ? right.pageSeq : Number.POSITIVE_INFINITY;
    if (leftPage !== rightPage) return leftPage - rightPage;
    return String(left.uploadedAt || "").localeCompare(String(right.uploadedAt || ""));
  });
}

function reconcileReceiptAssociations() {
  const livePhotoIds = new Set(state.photos.map((photo) => photo.id));
  receiveItems.forEach((item) => {
    if (item.receiptPhotoId && livePhotoIds.has(item.receiptPhotoId)) {
      item.receiptMatched = true;
      return;
    }
    const replacement = state.photos[0] || null;
    item.receiptPhotoId = replacement?.id || null;
    item.receiptMatched = Boolean(replacement);
  });
  syncSmartApprovalDecisions();
}

function recognizeReceiptPhotos(photoDrafts) {
  if (!photoDrafts.length || state.operationBusy) return;
  const beforeCounts = getProgressCountsSnapshot();
  setOperationBusy(true, "正在识别随货单", "正在重新匹配随货单并智能核准");
  window.clearTimeout(state.operationTimer);
  state.operationTimer = window.setTimeout(() => {
    const basePage = state.photos.reduce((max, photo) => Math.max(max, Number(photo.pageSeq) || 0), 0);
    photoDrafts.forEach((draft, index) => {
      const nextIndex = state.photos.length + 1;
      state.photos.push({
        id: Date.now() + index + nextIndex,
        title: draft.title || `拍摄票据 ${nextIndex}`,
        image: draft.image || "assets/img/随货同行单.png",
        pageSeq: basePage + index + 1,
        uploadedAt: `${Date.now()}-${String(index).padStart(3, "0")}`
      });
    });
    sortReceiptPhotos();
    reconcileReceiptAssociations();
    syncCurrentTaskProgress({ touch: true });
    markProgressIncreases(beforeCounts, ["uninspected", "pending", "ready"]);
    setOperationBusy(false);
    renderPhotos();
    renderReceiveItems();
    showToast("识别成功！");
  }, 720);
}

function renderPhotos() {
  const grid = document.getElementById("photoGrid");
  const count = state.photos.length;
  const livePhotoIds = new Set(state.photos.map((photo) => photo.id));
  Array.from(state.selectedPhotoIds).forEach((id) => {
    if (!livePhotoIds.has(id)) state.selectedPhotoIds.delete(id);
  });
  document.getElementById("photoCount").textContent = `已拍票据：${count}张`;
  const photoDone = document.getElementById("photoDone");
  if (photoDone) photoDone.disabled = count === 0;
  syncCurrentTaskProgress();
  updateWorkflowTaskMeta();
  renderInboundProgress();

  if (!count) {
    grid.innerHTML = `<div class="empty-thumb">票据照片会显示在这里</div>`;
    syncPhotoSelectionControls();
    return;
  }

  grid.innerHTML = state.photos.map((photo) => `
    <article class="thumb ${state.selectedPhotoIds.has(photo.id) ? "selected" : ""}" title="${photo.title}">
      <button class="thumb-preview" data-photo-preview="${photo.id}" aria-label="查看${photo.title}">
        <img src="${photo.image}" alt="${photo.title}" />
      </button>
      <em>${Number.isFinite(photo.pageSeq) ? photo.pageSeq : "无页码"}</em>
      <span class="thumb-status">已拍票据</span>
      <label class="thumb-select" title="选择${photo.title}">
        <input type="checkbox" data-photo-select="${photo.id}" aria-label="选择${photo.title}" ${state.selectedPhotoIds.has(photo.id) ? "checked" : ""} />
      </label>
    </article>
  `).join("");

  document.querySelectorAll("[data-photo-select]").forEach((input) => {
    input.addEventListener("change", () => {
      const id = Number(input.dataset.photoSelect);
      if (input.checked) {
        state.selectedPhotoIds.add(id);
      } else {
        state.selectedPhotoIds.delete(id);
      }
      input.closest(".thumb")?.classList.toggle("selected", input.checked);
      syncPhotoSelectionControls();
    });
  });
  document.querySelectorAll("[data-photo-preview]").forEach((button) => {
    button.addEventListener("click", () => {
      const photo = state.photos.find((item) => item.id === Number(button.dataset.photoPreview));
      if (photo) showLightbox(photo.image);
    });
  });
  syncPhotoSelectionControls();
}

function syncPhotoSelectionControls() {
  const selectAll = document.getElementById("selectAllPhotos");
  const deleteSelected = document.getElementById("deleteSelectedPhotos");
  const selectedCount = state.selectedPhotoIds.size;
  const photoCount = state.photos.length;
  const allSelected = photoCount > 0 && selectedCount === photoCount;
  const locked = isCurrentTaskReadOnly() || state.operationBusy;
  if (selectAll) {
    selectAll.checked = allSelected;
    selectAll.indeterminate = selectedCount > 0 && !allSelected;
    selectAll.disabled = photoCount === 0 || locked;
  }
  if (deleteSelected) {
    deleteSelected.disabled = selectedCount === 0 || locked;
    deleteSelected.textContent = selectedCount ? `删除所选（${selectedCount}）` : "删除所选";
  }
  document.querySelectorAll("[data-photo-select]").forEach((input) => {
    input.disabled = locked;
  });
}

function renderCodes() {
  renderReceiveItems();
}

function itemMatchesKeyword(item, keyword) {
  if (!keyword) return true;
  const source = [
    item.name,
    item.approval,
    item.batch,
    ...(item.codes || [])
  ].join(" ").toLowerCase();
  return source.includes(keyword.trim().toLowerCase());
}

function renderReceiveItems() {
  const scanCount = receiveItems.reduce((sum, item) => sum + item.codes.length, 0);
  state.scanCount = scanCount;
  const scanCountEl = document.getElementById("scanCount");
  const receiveList = document.getElementById("receiveList");
  if (!scanCountEl || !receiveList) return;

  const scanPage = document.getElementById("scanPage");
  scanPage?.classList.toggle("has-expanded-batch", state.expandedBatchIds.size > 0);

  const liveBatchIds = new Set(receiveItems.map((item) => item.id));
  Array.from(state.selectedBatchIds).forEach((id) => {
    if (!liveBatchIds.has(id)) state.selectedBatchIds.delete(id);
  });

  scanCountEl.textContent = `已录入 ${scanCount} 码`;
  const visibleItems = receiveItems.filter((item) => itemMatchesKeyword(item, state.scanKeyword));
  receiveList.innerHTML = visibleItems.map((item) => {
    const currentCodes = item.codes.filter((code) => state.currentScanCodes.includes(code));
    const isDamaged = state.damagedBatchIds.has(item.id);
    const approvalState = getScanSystemApprovalState(item);
    return `
    <article class="batch-row ${item.status} ${approvalState.className} ${state.selectedBatchIds.has(item.id) ? "selected" : ""} ${currentCodes.length ? "has-current-code" : ""} ${isDamaged ? "damaged" : ""} ${item.id === state.hitBatchId ? "just-hit batch-rush-top" : ""}" data-batch-id="${item.id}" data-system-approval-result="${approvalState.systemApprovalResult}" data-detail-approval-status="${approvalState.detailApprovalStatus}" data-inbound-status="${approvalState.inboundStatus}" style="view-transition-name: ${item.id};">
      <div>
        <div class="batch-title">
          <label class="batch-select" aria-label="选择${item.name}${item.batch}品批">
            <input type="checkbox" data-batch-select="${item.id}" ${state.selectedBatchIds.has(item.id) ? "checked" : ""} />
            <span aria-hidden="true"></span>
          </label>
          <strong>${item.name}</strong>
          <span>${item.spec}</span>
          <mark class="batch-approval-mark">${approvalState.label}</mark>
        </div>
        <div class="batch-meta">
          <span>${item.approval}</span>
          <span>批号 ${item.batch}</span>
          <span>效期 ${item.expiry}</span>
        </div>
        ${currentCodes.length ? `
        <div class="trace-current">
          <span>本次录入</span>
          <div>
            ${currentCodes.map((code) => `
              <strong class="${code === state.hitTraceCode ? "trace-code-hit" : ""}">
                <em>${code}</em>
                ${item.codes.length > 1 ? `<button data-remove-code="${code}" data-batch-id="${item.id}" aria-label="删除追溯码${code}">×</button>` : ""}
              </strong>
            `).join("")}
          </div>
        </div>
        ` : ""}
        <div class="trace-codes">
          ${item.codes.slice(-3).map((code) => `
            <span class="${code === state.hitTraceCode ? "trace-code-hit" : ""}">
              <em>${code}</em>
              ${item.codes.length > 1 ? `<button data-remove-code="${code}" data-batch-id="${item.id}" aria-label="删除追溯码${code}">×</button>` : ""}
            </span>
          `).join("")}
        </div>
      </div>
      <div class="batch-actions">
        <label class="damage-toggle ${isDamaged ? "on" : ""}">
          <input type="checkbox" data-damage-toggle="${item.id}" ${isDamaged ? "checked" : ""} />
          <span></span>
          <em>破损待采退</em>
        </label>
      <button class="batch-count" data-id="${item.id}" aria-label="查看${item.name}全部追溯码">
        <span>追溯码</span>
        <b>${item.codes.length}</b>
      </button>
      </div>
    </article>
  `;
  }).join("");

  document.querySelectorAll(".batch-count").forEach((button) => {
    button.addEventListener("click", () => {
      openScanTraceModal(button.dataset.id);
    });
  });
  document.querySelectorAll("[data-batch-select]").forEach((input) => {
    input.addEventListener("change", () => {
      const id = input.dataset.batchSelect;
      if (input.checked) {
        state.selectedBatchIds.add(id);
      } else {
        state.selectedBatchIds.delete(id);
      }
      input.closest(".batch-row")?.classList.toggle("selected", input.checked);
      syncBatchSelectionControls();
    });
  });
  document.querySelectorAll("[data-damage-toggle]").forEach((input) => {
    input.addEventListener("change", () => {
      if (guardTaskMutation()) {
        input.checked = state.damagedBatchIds.has(input.dataset.damageToggle);
        return;
      }
      const beforeCounts = getProgressCountsSnapshot();
      const id = input.dataset.damageToggle;
      if (input.checked) {
        state.damagedBatchIds.add(id);
      } else {
        state.damagedBatchIds.delete(id);
      }
      syncSmartApprovalDecisions();
      syncCurrentTaskProgress({ touch: true });
      markProgressIncreases(beforeCounts, ["pending", "ready"]);
      renderReceiveItems();
    });
  });
  document.querySelectorAll("[data-remove-code]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      removeTraceCode(button.dataset.batchId, button.dataset.removeCode);
    });
  });
  syncCurrentTaskProgress();
  updateWorkflowTaskMeta();
  renderScanReviewPanel();
  renderInboundProgress();
  syncBatchSelectionControls();
}

function getVisibleReceiveItems() {
  return receiveItems.filter((item) => itemMatchesKeyword(item, state.scanKeyword));
}

function syncBatchSelectionControls() {
  const selectAll = document.getElementById("selectAllBatches");
  const deleteSelected = document.getElementById("deleteSelectedBatches");
  const visibleItems = getVisibleReceiveItems();
  const visibleSelectedCount = visibleItems.filter((item) => state.selectedBatchIds.has(item.id)).length;
  const selectedCount = state.selectedBatchIds.size;
  const locked = isCurrentTaskReadOnly() || state.operationBusy;

  if (selectAll) {
    selectAll.checked = visibleItems.length > 0 && visibleSelectedCount === visibleItems.length;
    selectAll.indeterminate = visibleSelectedCount > 0 && visibleSelectedCount < visibleItems.length;
    selectAll.disabled = locked || visibleItems.length === 0;
  }
  if (deleteSelected) {
    deleteSelected.disabled = locked || selectedCount === 0;
    deleteSelected.textContent = selectedCount ? `删除所选（${selectedCount}）` : "删除所选";
  }
  document.querySelectorAll("[data-batch-select]").forEach((input) => {
    input.disabled = locked;
  });
}

function deleteSelectedReceiveItems() {
  if (guardTaskMutation() || state.operationBusy) return;
  const selectedIds = new Set(
    Array.from(state.selectedBatchIds).filter((id) => receiveItems.some((item) => item.id === id))
  );
  const selectedCount = selectedIds.size;
  if (!selectedCount) {
    syncBatchSelectionControls();
    return;
  }

  openConfirmDialog({
    title: "删除验货卡片",
    message: "确定删除？",
    onConfirm: () => {
      const beforeCounts = getProgressCountsSnapshot();
      const removedCodes = new Set(
        receiveItems.filter((item) => selectedIds.has(item.id)).flatMap((item) => item.codes)
      );
      for (let index = receiveItems.length - 1; index >= 0; index -= 1) {
        const item = receiveItems[index];
        if (!selectedIds.has(item.id)) continue;
        receiveItems.splice(index, 1);
        state.expandedBatchIds.delete(item.id);
        state.damagedBatchIds.delete(item.id);
      }
      state.currentScanCodes = state.currentScanCodes.filter((code) => !removedCodes.has(code));
      if (selectedIds.has(state.hitBatchId)) state.hitBatchId = null;
      if (removedCodes.has(state.hitTraceCode)) state.hitTraceCode = null;
      state.selectedBatchIds.clear();
      syncSmartApprovalDecisions();
      syncCurrentTaskProgress({ touch: true });
      markProgressIncreases(beforeCounts, ["uninspected", "pending", "ready", "inbound"]);
      renderReceiveItems();
      showToast(`已删除 ${selectedCount} 个验货卡片`);
    }
  });
}

function removeTraceCode(batchId, code) {
  if (guardTaskMutation()) return;
  const item = receiveItems.find((batch) => batch.id === batchId);
  if (!item) return;
  if (item.codes.length <= 1) {
    showToast("至少保留1个追溯码");
    return;
  }
  const beforeCounts = getProgressCountsSnapshot();
  item.codes = item.codes.filter((current) => current !== code);
  state.currentScanCodes = state.currentScanCodes.filter((current) => current !== code);
  syncSmartApprovalDecisions();
  syncCurrentTaskProgress({ touch: true });
  markProgressIncreases(beforeCounts, ["uninspected", "pending", "ready", "inbound"]);
  renderReceiveItems();
  showToast("已删除追溯码");
}

function renderScanReviewPanel() {
  const panel = document.getElementById("scanReviewPanel");
  if (!panel) return;
  panel.classList.add("hidden");
  panel.innerHTML = "";
}

function openScanTraceModal(batchId) {
  const item = receiveItems.find((batch) => batch.id === batchId);
  if (!item) return;
  openTraceEditor(item);
}

function findReceiveItemForApprovalLine(line) {
  return receiveItems.find((item) => item.codes.includes(line.traceCode))
    || receiveItems.find((item) => item.name === line.name && item.batch === line.batch)
    || null;
}

function openTraceEditor(item) {
  if (!item) return;
  const modal = ensureApprovalModal();
  const expectedCodes = new Set(item.expectedCodes || []);
  let draftCodes = [...item.codes];
  let draftInput = "";

  const renderEditor = ({ focusInput = false } = {}) => {
    modal.innerHTML = `
      <div class="approval-modal-backdrop" data-modal-close></div>
      <section class="approval-modal-sheet figma-dialog figma-trace-dialog trace-editor-sheet" role="dialog" aria-modal="true" aria-labelledby="traceEditorTitle">
        <button class="modal-close" data-modal-close aria-label="关闭">×</button>
        <header class="modal-head">
          <strong id="traceEditorTitle">编辑追溯码</strong>
        </header>
        <label class="trace-editor-input-row figma-trace-input">
          <input data-trace-editor-input inputmode="numeric" autocomplete="off" value="${draftInput}" placeholder="扫描或输入20位追溯码，录满后自动校验" />
          <button type="button" data-trace-input-clear>清空</button>
        </label>
        <div class="figma-trace-summary">
          <strong>实录追溯码（${draftCodes.length}/${expectedCodes.size || draftCodes.length}）</strong>
          <span>蓝色为应录码，黄色为非应录码</span>
        </div>
        <div class="modal-code-list trace-edit-list">
          ${draftCodes.map((code) => `
            <div class="trace-edit-code ${expectedCodes.has(code) ? "expected" : "unexpected"}">
              <span>${code}</span>
              ${draftCodes.length > 1 ? `<button type="button" data-trace-draft-remove="${code}" aria-label="删除追溯码${code}">×</button>` : ""}
            </div>
          `).join("")}
        </div>
        <div class="trace-editor-actions">
          <button class="modal-primary" type="button" data-trace-editor-save>保存</button>
        </div>
      </section>
    `;
    modal.classList.remove("hidden");
    modal.querySelectorAll("[data-modal-close]").forEach((button) => {
      button.addEventListener("click", closeApprovalModal);
    });
    const input = modal.querySelector("[data-trace-editor-input]");
    input?.addEventListener("input", () => {
      let digits = input.value.replace(/\D/g, "");
      let codeListChanged = false;
      while (digits.length >= 20) {
        const code = digits.slice(0, 20);
        digits = digits.slice(20);
        const existsElsewhere = receiveItems.some((candidate) => (
          candidate.id !== item.id && candidate.codes.includes(code)
        ));
        if (draftCodes.includes(code) || existsElsewhere) {
          showToast("追溯码重复");
          continue;
        }
        if (isInboundTraceCode(code)) {
          showToast("无法录入已入库追溯码");
          continue;
        }
        draftCodes.push(code);
        codeListChanged = true;
      }
      draftInput = digits;
      if (input.value !== digits || codeListChanged) {
        renderEditor({ focusInput: true });
      }
    });
    modal.querySelector("[data-trace-input-clear]")?.addEventListener("click", () => {
      draftInput = "";
      if (input) input.value = "";
      input?.focus();
    });
    modal.querySelectorAll("[data-trace-draft-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        if (draftCodes.length <= 1) return;
        draftCodes = draftCodes.filter((code) => code !== button.dataset.traceDraftRemove);
        renderEditor();
      });
    });
    modal.querySelector("[data-trace-editor-save]")?.addEventListener("click", () => {
      if (guardTaskMutation()) return;
      const beforeCounts = getProgressCountsSnapshot();
      item.codes = [...draftCodes];
      state.currentScanCodes = state.currentScanCodes.filter((code) => item.codes.includes(code));
      syncSmartApprovalDecisions();
      syncCurrentTaskProgress({ touch: true });
      markProgressIncreases(beforeCounts, ["pending", "ready", "inbound", "uninspected"]);
      closeApprovalModal();
      renderReceiveItems();
      if (state.currentStep === "approve") renderApproveWorkbench();
      showToast("追溯码已保存");
    });
    if (focusInput) window.requestAnimationFrame(() => modal.querySelector("[data-trace-editor-input]")?.focus());
    applyWorkflowReadOnlyState();
  };

  renderEditor();
}

function buildScanReview(event) {
  const system = getScanSystemReference(event);
  const meituan = {
    name: event.name,
    spec: event.spec,
    approval: event.approval,
    batch: event.batch,
    expiry: event.expiry
  };
  const rows = [
    ["name", "名称", event.name, system.name, meituan.name],
    ["spec", "规格", event.spec, system.spec, meituan.spec],
    ["approval", "准字", event.approval, system.approval, meituan.approval],
    ["batch", "批号", event.batch, system.batch, meituan.batch],
    ["expiry", "效期", event.expiry, system.expiry, meituan.expiry]
  ]
    .filter(([key, , physical, purchase]) => key !== "qty" && String(physical) !== String(purchase))
    .map(([, label, physical, purchase, meituanValue]) => ({ label, physical, purchase, meituan: meituanValue }));

  return rows.length ? { name: `${event.name} ${event.spec}`, rows } : null;
}

function getScanSystemReference(event) {
  if (event.status !== "warn") {
    return {
      name: event.name,
      spec: event.spec,
      approval: event.approval,
      batch: event.batch,
      expiry: event.expiry
    };
  }
  if ((event.baseId || event.id) === "batch-cetirizine-z250210") {
    return { ...event, batch: "Z250201" };
  }
  return { ...event, spec: event.spec.replace("0.3g", "0.25g") };
}

function scrollBatchCodesIntoView(batchId) {
  window.requestAnimationFrame(() => {
    const list = document.getElementById("receiveList");
    const row = document.querySelector(`[data-batch-id="${batchId}"]`);
    if (!list || !row) return;

    const rows = Array.from(list.children);
    const rowIndex = rows.indexOf(row);
    const targetTop = rowIndex <= 0
      ? 0
      : Math.max(0, rows.slice(0, rowIndex).reduce((sum, item) => sum + item.offsetHeight + 10, 0) - 8);
    list.scrollTo({ top: targetTop, behavior: "smooth" });
  });
}

function getBatchRowRects() {
  return new Map(Array.from(document.querySelectorAll("#receiveList .batch-row")).map((row) => [
    row.dataset.batchId,
    row.getBoundingClientRect()
  ]));
}

function renderReceiveItemsWithTransition(previousRects = null) {
  renderReceiveItems();
  if (!previousRects?.size) return;

  const animatedRows = Array.from(document.querySelectorAll("#receiveList .batch-row"))
    .map((row) => {
      const previousRect = previousRects.get(row.dataset.batchId);
      if (!previousRect) return null;
      const currentRect = row.getBoundingClientRect();
      const deltaY = previousRect.top - currentRect.top;
      if (Math.abs(deltaY) < 2) return null;
      return { row, deltaY };
    })
    .filter(Boolean);

  animatedRows.forEach(({ row, deltaY }) => {
    row.style.setProperty("--move-y", `${deltaY}px`);
    row.classList.add("batch-moving");
  });

  window.setTimeout(() => {
    animatedRows.forEach(({ row }) => {
      row.classList.remove("batch-moving");
      row.style.removeProperty("--move-y");
    });
  }, 460);
}

function getBaseApproveLineEntries() {
  const realEntries = approveOrders.flatMap((order) => order.lines.map((line) => ({ order, line })));
  return realEntries;
}

function getProductDomainMeta(line) {
  const fallbackId = String(line.approval || line.name || "UNRESOLVED")
    .replace(/[^0-9A-Za-z]/g, "")
    .slice(-10) || "UNRESOLVED";
  return productDomainMeta[line.approval] || {
    drugId: `D${fallbackId}`,
    manufacturer: "待核准",
    dosageForm: "待识别",
    produceDate: "-"
  };
}

function buildStableLineToken(value) {
  const hash = Array.from(String(value)).reduce(
    (current, char) => ((current * 33) ^ char.charCodeAt(0)) >>> 0,
    5381
  );
  return hash.toString(36).toUpperCase().padStart(7, "0").slice(-7);
}

function getApproveLineEntries() {
  const realEntries = getBaseApproveLineEntries();
  const groupedLines = new Map();

  receiveItems.filter((item) => item.codes.length).forEach((item) => {
    const template = realEntries.find(({ line }) => line.name === item.name && line.batch === item.batch)
      || realEntries.find(({ line }) => line.status !== "ok")
      || realEntries[0];
    if (!template) return;
    const meta = getProductDomainMeta(item);
    const billCode = template.order.mxfxBillCode || `MXF-${template.order.id}`;
    const businessKey = `${billCode}|${meta.drugId}|${item.batch}`;
    if (!groupedLines.has(businessKey)) {
      groupedLines.set(businessKey, {
        template,
        meta,
        billCode,
        businessKey,
        items: [],
        codes: []
      });
    }
    const grouped = groupedLines.get(businessKey);
    grouped.items.push(item);
    item.codes.forEach((code) => {
      if (!grouped.codes.includes(code)) grouped.codes.push(code);
    });
  });

  const scannedEntries = Array.from(groupedLines.values()).flatMap((grouped) => {
    const { template, meta, billCode, businessKey, items, codes } = grouped;
    const order = { ...template.order };
    const receiptMatchSucceeded = items.every((item) => item.receiptMatched !== false && item.receiptPhotoId);
    const systemMatchSucceeded = items.every((item) => item.systemMatchSucceeded !== false);
    const expectedTraceComplete = items.every((item) => {
      const expected = item.expectedCodes || [];
      return expected.length === item.codes.length && item.codes.every((code) => expected.includes(code));
    });
    const isConsistent = items.every((item) => item.status === "ok")
      && receiptMatchSucceeded
      && expectedTraceComplete;
    const abnormalFields = isConsistent
      ? []
      : (!receiptMatchSucceeded
            ? ["receipt"]
            : !expectedTraceComplete
              ? ["qty"]
              : (template.line.abnormalFields?.length ? template.line.abnormalFields : ["qty"]));
    const actualQty = 1;
    const templateExpectedQty = Number(template.line.system?.qty || template.line.qty || actualQty);
    const expectedQty = isConsistent
      ? actualQty
      : Math.max(templateExpectedQty, actualQty + (abnormalFields.includes("qty") ? 1 : 0));
    const systemApprovalResult = isConsistent
      ? 0
      : (systemMatchSucceeded && receiptMatchSucceeded && abnormalFields.length === 1 && abnormalFields.includes("qty")
          ? 1
          : 2);
    const issue = isConsistent
      ? ""
      : !receiptMatchSucceeded
          ? "未匹配到随货单商品，需人工核准"
        : !expectedTraceComplete
          ? `应录追溯码 ${items.reduce((sum, item) => sum + (item.expectedCodes || []).length, 0)}，当前实录 ${codes.length}，需人工核准`
        : abnormalFields.includes("qty")
          ? `码上放心应录 ${expectedQty}，当前实录 ${actualQty}，数量不一致`
          : template.line.issue || [...new Set(items.map((item) => item.source).filter(Boolean))].join("；");
    const purchaseLineIndex = Math.max(0, template.order.lines.findIndex((line) => (
      line.name === template.line.name && line.batch === template.line.batch
    )));
    const systemScore = isConsistent ? 98 : abnormalFields.includes("batch") ? 81 : abnormalFields.includes("name") ? 74 : 82;
    const receiptScore = isConsistent ? 97 : 88;
    const associatedPhoto = state.photos.find((photo) => photo.id === items[0].receiptPhotoId) || null;
    return codes.slice().reverse().map((code, codeIndex) => {
      const verificationBusinessKey = `${businessKey}|${code}`;
      const line = {
        ...template.line,
        id: `vl-${buildStableLineToken(verificationBusinessKey)}`,
        verificationId: `VL-${buildStableLineToken(verificationBusinessKey)}`,
        verificationBusinessKey,
        verificationGroupKey: businessKey,
        billCode,
        drugId: meta.drugId,
        manufacturer: meta.manufacturer,
        dosageForm: meta.dosageForm,
        produceDate: meta.produceDate,
        supplierName: order.supplier,
        systemMatchMethod: "一一对应",
        systemLineIds: [`${order.id}-${String(purchaseLineIndex + 1).padStart(2, "0")}`],
        systemScore,
        receiptScore,
        matchRunNo: 3,
        createdSequence: Math.max(...items.map((item) => item.lastScannedSequence || item.createdSequence || 0)) - codeIndex / 1000,
        systemMatchSucceeded,
        receiptMatchSucceeded,
        systemApprovalResult,
        name: items[0].name,
        spec: items[0].spec,
        approval: items[0].approval,
        batch: items[0].batch,
        expiry: items[0].expiry,
        qty: actualQty,
        actualQty,
        expectedQty,
        status: isConsistent ? "ok" : "warn",
        issue,
        receiptPhoto: associatedPhoto?.title || "未匹配到随货单",
        traceCode: code,
        traceCodes: [code],
        expectedTraceCodes: [...new Set(items.flatMap((item) => item.expectedCodes || []))],
        figma: template.line.figma && items[0].name === template.line.name && items[0].batch === template.line.batch
          ? { ...template.line.figma }
          : { traceActual: actualQty, traceExpected: expectedQty },
        receipt: {
          ...template.line.receipt,
          name: items[0].name,
          spec: items[0].spec,
          approval: items[0].approval,
          batch: items[0].batch,
          expiry: items[0].expiry,
          qty: actualQty
        },
        trace: {
          ...template.line.trace,
          name: items[0].name,
          spec: items[0].spec,
          approval: items[0].approval,
          batch: items[0].batch,
          expiry: items[0].expiry,
          qty: actualQty
        },
        system: {
          ...template.line.system,
          name: items[0].name,
          spec: items[0].spec,
          approval: items[0].approval,
          batch: items[0].batch,
          expiry: items[0].expiry,
          qty: expectedQty
        },
        abnormalFields
      };
      return { order, line };
    });
  });
  if (scannedEntries.length) return scannedEntries;

  const templates = realEntries.filter(({ line }) => line.status !== "ok");
  const demoEntries = approveDemoPendingItems.map(([name, spec, qty], index) => {
    const template = templates[index % templates.length];
    const order = {
      ...template.order,
      id: `CG1001${String(index + 1).padStart(4, "0")}`
    };
    const line = {
      ...template.line,
      id: `ap-demo-${index + 1}`,
      name,
      spec,
      qty,
      issue: `系统单据与实物/随货同行单存在差异，需核准 ${name} 数量 ${qty}`,
      receipt: { ...template.line.receipt, name, spec, qty },
      trace: { ...template.line.trace, name, spec, qty },
      system: { ...template.line.system, name, spec, qty: qty + 1 },
      abnormalFields: ["qty"]
    };
    return { order, line };
  });
  return [...realEntries, ...demoEntries];
}

function ensureApproveWorkflowState() {
  const pending = getActivePendingApprovalEntries();
  if (!pending.some(({ line }) => line.id === state.currentApproveLineId)) {
    state.currentApproveLineId = pending[0]?.line.id || null;
  }
}

function isLineDamaged(line) {
  return receiveItems.some((item) => (
    state.damagedBatchIds.has(item.id) &&
    item.name === line.name &&
    item.batch === line.batch
  ));
}

function isSmartConsistentLine(line) {
  return line.status === "ok" && !line.issue && !line.abnormalFields.length;
}

function syncSmartApprovalDecisions() {
  getApproveLineEntries().forEach(({ line }) => {
    if (!hasReceivedLine(line) || state.touchedApprovalLineIds.has(line.id)) return;
    state.approveDecisions[line.id] = isSmartConsistentLine(line) && !isLineDamaged(line)
      ? "selected"
      : "pending";
  });
}

function getApproveLinesForReceiveItem(item) {
  const traceCodes = new Set(item.codes);
  return getApproveLineEntries()
    .map(({ line }) => line)
    .filter((line) => traceCodes.has(line.traceCode));
}

function findApproveLineForReceiveItem(item) {
  return getApproveLinesForReceiveItem(item)[0] || null;
}

function isInboundTraceCode(traceCode) {
  return getApproveLineEntries().some(({ line }) => (
    line.traceCode === traceCode && state.inboundCompletedLineIds.has(line.id)
  ));
}

function getScanSystemApprovalState(item) {
  const lines = getApproveLinesForReceiveItem(item);
  const activeLines = lines.filter((line) => !state.inboundCompletedLineIds.has(line.id));
  const allInbound = lines.length > 0 && activeLines.length === 0;
  if (allInbound) {
    return {
      className: "approval-inbound",
      label: "已入库",
      detailApprovalStatus: "",
      inboundStatus: 1,
      systemApprovalResult: ""
    };
  }
  const hasPending = activeLines.some((line) => state.approveDecisions[line.id] !== "selected");
  const noNeedApproval = activeLines.length > 0 && !hasPending;
  return noNeedApproval
    ? {
        className: "approval-ok",
        label: "无需核准",
        detailApprovalStatus: 1,
        inboundStatus: 0,
        systemApprovalResult: activeLines[0]?.systemApprovalResult ?? 0
      }
    : {
        className: "approval-pending",
        label: "待核准",
        detailApprovalStatus: 0,
        inboundStatus: 0,
        systemApprovalResult: activeLines[0]?.systemApprovalResult ?? 2
      };
}

function hasReceivedLine(line) {
  return receiveItems.some((item) => (
    item.codes.length &&
    item.name === line.name &&
    item.batch === line.batch
  ));
}

function getReceiptUninspectedGroups() {
  if (!state.photos.length || getCurrentTask()?.statusKey === "done") return [];
  const matchedCounts = new Map();
  receiveItems
    .filter((item) => item.codes.length)
    .forEach((item) => {
      const key = `${item.receiptPhotoId || "unmatched"}__${item.name}__${item.batch}`;
      matchedCounts.set(key, (matchedCounts.get(key) || 0) + item.codes.length);
    });

  const baseLines = orders
    .flatMap((order) => order.lines.map((line, lineIndex) => ({
      order,
      line,
      lineIndex
    })))
    .map((entry, imageRowIndex) => ({ ...entry, imageRowIndex }));

  return state.photos.map((photo, photoIndex) => {
    const lines = baseLines.map(({ order, line, lineIndex, imageRowIndex }) => {
      const key = `${photo.id}__${line.name}__${line.batch}`;
      const expectedQty = Math.max(0, Number(line.qty) || 0);
      const availableMatches = matchedCounts.get(key) || 0;
      const matchedQty = Math.min(expectedQty, availableMatches);
      const remainingQty = expectedQty - matchedQty;
      const approvalTemplate = getBaseApproveLineEntries().find(({ line: approveLine }) => (
        approveLine.name === line.name && approveLine.batch === line.batch
      ))?.line;
      const meta = getProductDomainMeta(approvalTemplate || line);
      matchedCounts.set(key, availableMatches - matchedQty);
      return {
        id: `receipt-${photo.id}-${order.id}-${lineIndex}`,
        receiptLineId: `RL-${String(photoIndex + 1).padStart(2, "0")}-${String(imageRowIndex + 1).padStart(2, "0")}`,
        orderId: order.id,
        receiptId: `receipt-photo-${photoIndex + 1}`,
        imageSeq: photoIndex + 1,
        pageSeq: photoIndex + 1,
        rowSeq: imageRowIndex + 1,
        lineNo: imageRowIndex + 1,
        businessBillNo: order.id,
        salesDate: order.date,
        deliveryDate: order.date,
        supplier: order.supplier,
        name: line.name,
        spec: line.spec,
        approval: approvalTemplate?.approval || "-",
        maker: meta.manufacturer,
        dosageForm: meta.dosageForm,
        produceDate: meta.produceDate,
        qty: expectedQty,
        matchedQty,
        remainingQty,
        batch: line.batch,
        expiry: approvalTemplate?.expiry || "-",
        price: line.price,
        amount: (expectedQty * Number(line.price || 0)).toFixed(2),
        ocrConfidence: Math.max(0.82, 0.98 - (imageRowIndex % 5) * 0.025),
        rowCrop: "assets/img/拍单识别后框选识别行.png",
        status: "UNINSPECTED"
      };
    }).filter((line) => line.matchedQty === 0 && !state.removedReceiptLineIds.has(line.id));

    return {
      id: `receipt-photo-${photoIndex + 1}`,
      title: photo.title || `随货同行单 ${photoIndex + 1}`,
      image: photo.image || "assets/img/随货同行单.png",
      supplier: lines[0]?.supplier || "广东壹号药业有限公司",
      businessBillNo: lines[0]?.businessBillNo || "-",
      salesDate: lines[0]?.salesDate || lines[0]?.produceDate || "-",
      deliveryDate: lines[0]?.deliveryDate || lines[0]?.produceDate || "-",
      lineCount: lines.length,
      lines
    };
  }).filter((receipt) => receipt.lines.length);
}

function getUninspectedLineEntries(receipts) {
  return receipts.flatMap((receipt) => receipt.lines.map((line) => ({ receipt, line })));
}

function getProgressGroupQuantity(group) {
  if (!group) return 0;
  return group.items.length;
}

function getProgressCountsSnapshot() {
  const groups = getProgressGroups();
  return Object.fromEntries(
    ["uninspected", "pending", "ready", "inbound"].map((key) => [key, getProgressGroupQuantity(groups[key])])
  );
}

function markProgressIncreases(beforeCounts, keys) {
  const afterCounts = getProgressCountsSnapshot();
  keys.forEach((key) => {
    if ((afterCounts[key] || 0) > (beforeCounts[key] || 0)) {
      state.progressImpactKeys.add(key);
    }
  });
}

function getProgressGroups() {
  const groups = {
    inbound: {
      key: "inbound",
      label: "已入库",
      bubble: "个商品已入库",
      description: "已提交入库的清单",
      icon: "assets/icons/figma-progress-inbound.svg",
      items: []
    },
    ready: {
      key: "ready",
      label: "准入库",
      bubble: "个商品待入库",
      description: "核准后准备入库",
      icon: "assets/icons/figma-progress-ready.svg",
      items: []
    },
    pending: {
      key: "pending",
      label: "待核准",
      bubble: "个商品待核准",
      description: "核准后发现异常",
      icon: "assets/icons/figma-progress-pending.svg",
      items: []
    },
    uninspected: {
      key: "uninspected",
      label: "待验货",
      bubble: "个商品未验货",
      description: "只有随货单无实物",
      icon: "assets/icons/figma-progress-uninspected.svg",
      items: [],
      receipts: []
    }
  };

  const scannedEntries = receiveItems.some((item) => item.codes.length)
    ? getApproveLineEntries()
    : [];

  scannedEntries.forEach(({ order, line }) => {
    const entry = { order, line };
    const decision = state.approveDecisions[line.id]
      || (isSmartConsistentLine(line) ? "selected" : "pending");
    if (state.inboundCompletedLineIds.has(line.id)) {
      groups.inbound.items.push(entry);
    } else if (decision === "selected") {
      groups.ready.items.push(entry);
    } else if (decision === "pending" || decision === "deferred") {
      groups.pending.items.push({
        order: entry.order,
        line: state.confirmedPendingLineIds.has(line.id)
          ? { ...entry.line, issue: entry.line.issue || "已明确留在待核准栏" }
          : entry.line
      });
    }
  });

  groups.uninspected.receipts = getReceiptUninspectedGroups();
  groups.uninspected.items = getUninspectedLineEntries(groups.uninspected.receipts);

  const pendingOrder = new Map(
    getActivePendingApprovalEntries().map(({ line }, index) => [line.id, index])
  );
  groups.pending.items.sort((left, right) => (
    (pendingOrder.get(left.line.id) ?? Number.MAX_SAFE_INTEGER)
      - (pendingOrder.get(right.line.id) ?? Number.MAX_SAFE_INTEGER)
  ));

  return groups;
}

function renderInboundProgress() {
  const footers = document.querySelectorAll("[data-progress-footer]");
  if (!footers.length) return;
  const groups = getProgressGroups();
  const orderedGroups = [groups.inbound, groups.ready, groups.pending, groups.uninspected];
  const counts = Object.fromEntries(orderedGroups.map((group) => [group.key, getProgressGroupQuantity(group)]));
  const impactKeys = new Set(state.progressImpactKeys);
  const buildCardHtml = (displayCounts) => orderedGroups.map((group) => {
    const isImpact = impactKeys.has(group.key);
    const count = displayCounts[group.key];
    return `
    <button class="progress-bubble ${group.key} ${isImpact ? "bucket-impact" : ""}" data-progress-open="${group.key}" aria-label="查看${group.label}商品，${count}个">
      <span class="progress-icon-shell" aria-hidden="true">
        <img class="progress-icon" src="${group.icon}" alt="" />
      </span>
      <span class="progress-copy">
        <span class="progress-status-label">${group.description}</span>
        <b>${group.label} ${count}</b>
        <em>查看全部</em>
      </span>
    </button>
  `;
  }).join("");
  const buildTrackHtml = (displayCounts, displayTotal) => orderedGroups.map((group) => {
    const chargeClass = group.key === "ready" || group.key === "inbound" ? "charge-left" : "charge-right";
    const count = displayCounts[group.key];
    const share = displayTotal ? (count / displayTotal) * 100 : 0;
    const ariaLabel = `查看${group.label}商品，${count}个，占${share.toFixed(1)}%`;
    return `<button class="progress-segment ${group.key} ${chargeClass} ${count ? "has-progress" : "is-empty"} ${impactKeys.has(group.key) ? "charging" : ""}" style="--progress-share:${share.toFixed(4)}%;--progress-weight:${count}" data-progress-open="${group.key}" aria-label="${ariaLabel}"><span class="progress-fill" aria-hidden="true"></span></button>`;
  }).join("");

  footers.forEach((footer) => {
    const displayCounts = counts;
    const displayTotal = Object.values(displayCounts).reduce((sum, count) => sum + count, 0);
    const cardHtml = buildCardHtml(displayCounts);
    const trackHtml = buildTrackHtml(displayCounts, displayTotal);
    const reportHtml = `<button class="progress-report-card" data-progress-report="提报异常">提报异常</button>`;
    footer.innerHTML = `
      <div class="progress-card">
        <div class="progress-heading">入库进度查询</div>
        <div class="progress-visuals">
          <div class="progress-bubbles">${reportHtml}${cardHtml}</div>
          <div class="progress-rail" aria-label="入库进度分段，共${displayTotal}个商品">
            <div class="progress-track ${displayTotal ? "has-total" : "is-empty"}">${trackHtml}</div>
          </div>
        </div>
        <div class="progress-bottom-spacer" aria-hidden="true"></div>
      </div>
    `;
  });
  if (impactKeys.size) {
    window.clearTimeout(state.progressImpactTimer);
    state.progressImpactTimer = window.setTimeout(() => {
      document.querySelectorAll(".progress-bubble.bucket-impact, .progress-segment.charging").forEach((item) => {
        item.classList.remove("bucket-impact", "charging");
      });
      state.progressImpactKey = null;
      state.progressImpactKeys.clear();
    }, 1050);
  }

  document.querySelectorAll("[data-progress-open]").forEach((button) => {
    button.addEventListener("click", () => openProgressDetail(button.dataset.progressOpen));
  });
  document.querySelectorAll("[data-progress-report]").forEach((button) => {
    button.addEventListener("click", () => {
      if (guardTaskMutation()) return;
      showToast(`已标记：${button.dataset.progressReport}`);
    });
  });
  applyWorkflowReadOnlyState();
}

function openProgressDetail(key) {
  if (!getProgressGroups()[key]) return;
  state.activeBucket = key;
  state.bucketDetailLineId = null;
  state.bucketKeyword = "";
  state.bucketSelectedLineIds.clear();
  state.bucketPageFilter = "";
  state.bucketProductFilter = "";
  state.bucketApprovalFilter = "";
  state.bucketOnlyUninspected = true;
  state.bucketExceptionFilters.clear();
  initializeProgressPageExpansion(key);
  state.approveReady = true;
  setStep("approve");
  showApproveView("bucketList");
  renderApprovalBucketList();
  renderInboundProgress();
}

function playApprovalBubbleBurst(button) {
  const prompts = button.closest(".approval-drop-prompts");
  prompts?.classList.add("bursting");
  prompts?.querySelectorAll(".approve-drop-cta").forEach((item) => {
    item.classList.add("burst-target");
    item.classList.toggle("burst-away", item !== button);
  });
}

function initializeProgressPageExpansion(key) {
  state.expandedProgressOrderIds = new Set();
  if (key === "uninspected") {
    getReceiptUninspectedGroups().forEach((receipt) => state.expandedProgressOrderIds.add(receipt.id));
    return;
  }
  getGroupedOrdersByDecision(key).forEach((order) => state.expandedProgressOrderIds.add(order.id));
}

function getLinesByDecision(decision) {
  return getApproveLineEntries().filter(({ line }) => state.approveDecisions[line.id] === decision);
}

function getActivePendingApprovalEntries() {
  const pending = getLinesByDecision("pending").sort(
    (left, right) => (right.line.createdSequence || 0) - (left.line.createdSequence || 0)
  );
  const entryByLineId = new Map(pending.map((entry) => [entry.line.id, entry]));
  const confirmed = Array.from(state.confirmedPendingLineIds)
    .map((lineId) => entryByLineId.get(lineId))
    .filter(Boolean);
  return [
    ...pending.filter(({ line }) => !state.confirmedPendingLineIds.has(line.id)),
    ...confirmed
  ];
}

function approvalQueueMatchesKeyword(line, keyword) {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return true;
  return [line.name, ...buildTraceCodes(line)]
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}

function getCurrentApproveEntry() {
  const pending = getActivePendingApprovalEntries();
  return pending.find(({ line }) => line.id === state.currentApproveLineId) || pending[0] || null;
}

function startApproveMatching() {
  const loading = document.getElementById("approveLoading");
  const workbench = document.getElementById("approveWorkbench");
  if (!loading || !workbench) return;

  window.clearTimeout(state.approveTimer);
  if (state.approveReady) {
    loading.classList.add("hidden");
    workbench.classList.remove("hidden");
    showApproveView("workbench");
    renderApproveWorkbench();
    return;
  }

  loading.classList.remove("hidden");
  workbench.classList.add("hidden");
  state.approveTimer = window.setTimeout(() => {
    state.approveReady = true;
    loading.classList.add("hidden");
    workbench.classList.remove("hidden");
    showApproveView("workbench");
    renderApproveWorkbench();
  }, 900);
}

function renderApproveWorkbench() {
  ensureApproveWorkflowState();
  renderDecisionCounts();
  renderApprovalQueue();
  renderCurrentApprovalCard();
}

function renderDecisionCounts() {
  const counts = {
    pending: getLinesByDecision("pending").length,
    deferred: getLinesByDecision("deferred").length,
    selected: getLinesByDecision("selected").length
  };
  const deferredText = document.getElementById("deferredBucketText");
  const selectedText = document.getElementById("selectedBucketText");
  if (deferredText) deferredText.textContent = `${counts.deferred}个商品先不入库，点击查看`;
  if (selectedText) selectedText.textContent = `${counts.selected}个商品选择入库，点击查看`;
  renderInboundProgress();
}

function renderApprovalQueue() {
  const queue = document.getElementById("approvalQueue");
  if (!queue) return;

  const lines = getActivePendingApprovalEntries();
  const pendingQuantity = getProgressCountsSnapshot().pending;
  const visibleLines = lines.filter(({ line }) => approvalQueueMatchesKeyword(line, state.approveKeyword));
  queue.innerHTML = `
    <div class="queue-title ${state.approveSearchOpen ? "search-open" : ""}">
      <span>待核准：${pendingQuantity}</span>
      <button class="queue-search-toggle ${state.approveSearchOpen ? "open" : ""}" data-queue-search-toggle aria-label="${state.approveSearchOpen ? "收起搜索" : "展开搜索"}"></button>
      <input class="queue-search-input ${state.approveSearchOpen ? "" : "hidden"}" value="${state.approveKeyword}" placeholder="搜索通用名或追溯码" />
    </div>
    ${visibleLines.length ? visibleLines.map(({ line }) => `
    <article class="queue-item ${line.id === state.currentApproveLineId ? "current" : ""}" data-queue-item-id="${line.id}" aria-current="${line.id === state.currentApproveLineId ? "true" : "false"}">
      <button class="queue-select" data-queue-line-id="${line.id}" title="${line.name}X${line.qty}">
        <strong>${line.name}X${line.qty}</strong>
      </button>
      ${line.id === state.currentApproveLineId ? `<span class="queue-item-actions" aria-label="核准操作">
        <button class="queue-decision ready" data-queue-decision="selected" data-line-id="${line.id}" aria-label="放入准入库">
          <span class="queue-decision-icon"><img src="assets/icons/approval-bubble-ready.svg?v=figma-150-4006-v1" alt="" /></span>
          <span class="queue-decision-label">放入准入库</span>
        </button>
        <button class="queue-decision pending" data-queue-decision="pending" data-line-id="${line.id}" aria-label="留在待核准">
          <span class="queue-decision-icon"><img src="assets/icons/approval-bubble-pending-gloss.svg?v=figma-150-4006-v1" alt="" /></span>
          <span class="queue-decision-label">留在待核准</span>
        </button>
      </span>` : ""}
    </article>
  `).join("") : `<div class="queue-empty">待核准为空</div>`}
  `;

  queue.querySelector("[data-queue-search-toggle]")?.addEventListener("click", () => {
    state.approveSearchOpen = !state.approveSearchOpen;
    if (!state.approveSearchOpen) state.approveKeyword = "";
    renderApprovalQueue();
  });
  queue.querySelector(".queue-search-input")?.addEventListener("input", (event) => {
    state.approveKeyword = event.target.value;
    renderApprovalQueue();
  });
  document.querySelectorAll("[data-queue-line-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentApproveLineId = button.dataset.queueLineId;
      state.purchasePickerLineId = null;
      state.receiptPickerLineId = null;
      renderApproveWorkbench();
    });
  });
  queue.querySelectorAll("[data-queue-decision]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      decideCurrentApproveLine(button.dataset.queueDecision, button.dataset.lineId, button.closest(".queue-item"));
    });
  });
}

function getApprovalQueueItemRects() {
  return new Map(Array.from(document.querySelectorAll("#approvalQueue .queue-item")).map((item) => [
    item.dataset.queueItemId,
    item.getBoundingClientRect()
  ]));
}

function animateApprovalQueueShift(previousRects, movedLineId = null) {
  if (!previousRects?.size) return;
  document.querySelectorAll("#approvalQueue .queue-item").forEach((item) => {
    const previous = previousRects.get(item.dataset.queueItemId);
    if (!previous) return;
    const next = item.getBoundingClientRect();
    const deltaX = previous.left - next.left;
    const deltaY = previous.top - next.top;
    if (item.dataset.queueItemId === movedLineId) {
      item.animate([
        {
          transform: `translate3d(${deltaX}px, ${deltaY || -18}px, 0) scale(1.03)`,
          opacity: 1,
          boxShadow: "0 12px 24px rgba(219,150,21,.22)"
        },
        {
          transform: `translate3d(${deltaX * .28}px, ${deltaY * .32 - 12}px, 0) scale(.96)`,
          opacity: .82,
          offset: .62
        },
        {
          transform: "translate3d(0, 7px, 0) scale(.98)",
          opacity: .96,
          offset: .86
        },
        {
          transform: "translate3d(0, 0, 0) scale(1)",
          opacity: 1,
          boxShadow: "0 3px 4px rgba(44,67,104,.04)"
        }
      ], {
        duration: 560,
        easing: "cubic-bezier(.2,.74,.18,1)"
      });
      return;
    }
    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;
    item.animate([
      { transform: `translate3d(${deltaX}px, ${deltaY}px, 0)` },
      { transform: "translate3d(0, 0, 0)" }
    ], {
      duration: 280,
      easing: "cubic-bezier(.2,.8,.2,1)"
    });
  });
}

function renderCurrentApprovalCard() {
  const body = document.getElementById("approvalCurrentBody");
  const deferButton = document.getElementById("deferCurrentLine");
  const selectButton = document.getElementById("selectCurrentLine");
  if (!body) return;

  const entry = getCurrentApproveEntry();
  if (!entry) {
    body.innerHTML = `<div class="approval-empty-card">没有待核准明细</div>`;
    if (deferButton) deferButton.disabled = true;
    if (selectButton) selectButton.disabled = true;
    return;
  }

  const { order, line } = entry;
  const decision = state.approveDecisions[line.id];
  const canDecide = decision === "pending";
  if (deferButton) deferButton.disabled = !canDecide;
  if (selectButton) selectButton.disabled = !canDecide;

  body.innerHTML = renderApprovalEvidence(order, line);
  bindApprovalEvidenceActions();
}

function renderApprovalEvidence(order, line, options = {}) {
  const review = getApprovalReviewModel(order, line);
  const readOnly = options.readOnly === true;
  const purchasePickerOpen = state.purchasePickerLineId === line.id;
  const receiptPickerOpen = state.receiptPickerLineId === line.id;

  return `
    <div class="approval-rebuild ${state.approvalNormalExpanded || readOnly ? "has-expanded-compare" : ""} ${readOnly ? "approval-evidence-readonly" : ""}">
      ${review.exceptionMessage ? `<div class="approval-match-exception">${review.exceptionMessage}</div>` : ""}
      <section class="inbound-card">
        <div class="inbound-card-copy">
          <div class="inbound-order-head">
            <b>[${review.productCode}] ${review.physical.name} ${review.physical.spec}</b>
            <strong>采自${review.sourceSupplier}</strong>
          </div>
          <div class="inbound-entry-grid">
            <div>
              <span>入库批次 / 效期</span>
              <strong>${review.batchFinal} / ${review.physical.expiry}</strong>
              ${readOnly ? "" : `<button data-approval-modal="batch" data-line-id="${line.id}">编辑批次</button>`}
            </div>
            <div>
              <span>追溯码 实录/应录</span>
              <strong>${review.traceActual}/${review.traceExpected}</strong>
              ${readOnly ? "" : `<button data-approval-modal="trace" data-line-id="${line.id}">编辑追溯码</button>`}
            </div>
          </div>
          <div class="inbound-order-list">
            ${review.systemMatchSucceeded ? review.inboundRows.map((row) => `
              <div class="inbound-order-strip">
                <span>${row.orderId}-${row.status}</span>
                <span>平台单号：${row.platformOrder}</span>
                <span>运单号：${row.waybill}</span>
                <span>数量/单价：${row.qtyPrice}</span>
                <span>采购时间：${row.purchasedAt}</span>
              </div>
            `).join("") : `<div class="approval-source-empty">没有匹配到系统单商品</div>`}
          </div>
          ${renderReceiptHitPreview(review, line, { readOnly })}
        </div>
      </section>

      <section class="meituan-bottom-card">
        ${renderMeituanApprovalBlock(review.meituan, line, { readOnly })}
      </section>

      <section class="approval-compare-table-card ${state.approvalNormalExpanded || readOnly ? "is-expanded" : ""}">
        <div class="approval-table-toolbar">
          <div>
            <b>三方数据对比</b>
          </div>
          ${readOnly ? "" : `<div class="approval-table-tools">
            <button data-approval-modal="purchase" data-line-id="${line.id}">采购单商品匹配错了，换一个</button>
            <button data-approval-modal="receipt" data-line-id="${line.id}">随货单商品匹配错了，换一个</button>
          </div>`}
        </div>
        ${renderApprovalCompareTable(review, line, { readOnly, forceExpanded: readOnly })}
      </section>
    </div>
  `;
}

function renderReceiptHitPreview(review, line, options = {}) {
  if (!review.receiptMatchSucceeded) {
    return `<section class="receipt-hit-card receipt-unmatched"><strong>没有匹配到随货单商品</strong><span>请在三方数据对比中更换随货单商品</span></section>`;
  }
  if (options.readOnly) {
    return `<section class="receipt-hit-card"><img class="receipt-hit-static" src="${review.receiptImage}" alt="随货单命中行" /></section>`;
  }
  return `
    <section class="receipt-hit-card">
      <button class="receipt-hit-zoom" data-approval-modal="receiptImage" data-line-id="${line.id}" aria-label="查看随货单命中行">
        <img src="${review.receiptImage}" alt="随货单命中行" />
      </button>
    </section>
  `;
}

function renderApprovalCompareTable(review, line, options = {}) {
  const rows = getApprovalCompareRows(review, line, options.forceExpanded === true);
  return `
    <div class="approval-compare-table ${options.purchasePickerOpen ? "purchase-picking" : ""} ${options.receiptPickerOpen ? "receipt-picking" : ""}">
      <div class="compare-cell compare-corner"></div>
      <div class="compare-cell compare-head">采购单商品资料</div>
      <div class="compare-cell compare-head">随货单商品资料</div>
      <div class="compare-cell compare-head">实物商品资料</div>
      ${rows.map((row, index) => `
        ${row.toggle ? `
          <button class="compare-normal-toggle" data-normal-toggle aria-expanded="${state.approvalNormalExpanded ? "true" : "false"}">
            ${state.approvalNormalExpanded ? "收起全部字段" : "展开全部字段"}
          </button>
        ` : `
        <div class="compare-cell compare-field ${row.abnormal ? "abnormal" : ""}">
          <span>${row.label}</span>
        </div>
        ${options.purchasePickerOpen ? (index === 0 ? renderCompareCandidateColumn("purchase", review.purchaseCandidates, line, rows.length) : "") : renderCompareValueCell(row, "purchase", review.purchase)}
        ${options.receiptPickerOpen ? (index === 0 ? renderCompareCandidateColumn("receipt", review.receiptCandidates, line, rows.length) : "") : renderCompareValueCell(row, "receipt", review.receipt)}
        ${renderCompareValueCell(row, "physical", review.physical)}
        `}
      `).join("")}
    </div>
  `;
}

function getApprovalCompareRows(review, line, forceExpanded = false) {
  const physical = buildApprovalCompareSource(review.physical, line, "physical", review);
  const purchase = buildApprovalCompareSource(review.purchase, line, "purchase", review);
  const receipt = buildApprovalCompareSource(review.receipt, line, "receipt", review);
  const rows = [
    ["name", "通用名称"],
    ["spec", "规格"],
    ["approval", "批准文号"],
    ["barcode", "条码"],
    ["manufacturer", "生产厂家"],
    ["prescription", "处方类别"],
    ["batch", "批号"],
    ["productionDate", "生产日期"],
    ["expiry", "有效期"],
    ["qty", "数量"],
    ["supplier", "供应商"]
  ].map(([key, label]) => ({
    key,
    label,
    physical: physical[key],
    purchase: purchase[key],
    receipt: receipt[key],
    abnormal: line.abnormalFields.includes(key)
  }));

  const sortedRows = rows.sort((a, b) => Number(b.abnormal) - Number(a.abnormal));
  const abnormalRows = sortedRows.filter((row) => row.abnormal);
  if (state.approvalNormalExpanded || forceExpanded) {
    const normalRows = sortedRows.filter((row) => !row.abnormal);
    return forceExpanded ? abnormalRows.concat(normalRows) : abnormalRows.concat({ toggle: true }, normalRows);
  }
  return abnormalRows.length
    ? abnormalRows.concat({ toggle: true })
    : [{ toggle: true }];
}

function buildApprovalCompareSource(data, line, type, review) {
  if ((type === "purchase" && !review.systemMatchSucceeded)
    || (type === "receipt" && !review.receiptMatchSucceeded)) {
    return Object.fromEntries([
      "name", "spec", "approval", "barcode", "manufacturer", "prescription",
      "batch", "productionDate", "expiry", "qty", "supplier"
    ].map((key) => [key, "未匹配"]));
  }
  const manufacturerMap = {
    "阿莫西林胶囊": "广州白云山医药集团股份有限公司",
    "连花清瘟颗粒": "石家庄以岭药业股份有限公司",
    "布洛芬缓释胶囊": "中美天津史克制药有限公司",
    "盐酸左西替利嗪片": "重庆华邦制药有限公司",
    "维生素 C 片": "东北制药集团沈阳第一制药有限公司"
  };
  const name = data.name || line.name;
  const spec = data.spec || line.spec;
  const batch = data.batch || line.batch;
  return {
    name,
    spec,
    approval: data.approval || line.approval,
    barcode: `69${String(data.approval || line.approval).replace(/\D/g, "").padEnd(10, "0").slice(0, 10)}`,
    manufacturer: manufacturerMap[name] || review.purchase.supplier,
    prescription: name.includes("布洛芬") || name.includes("阿莫西林") ? "非处方药" : "处方药",
    batch,
    productionDate: batch?.startsWith("B") ? "2026-02-10" : batch?.startsWith("A") ? "2026-01-12" : "2026-03-01",
    expiry: data.expiry || line.expiry,
    qty: data.qty || line.qty,
    supplier: type === "physical" ? (line.supplierName || review.sourceSupplier) : review.purchase.supplier
  };
}

function renderCompareValueCell(row, source, sourceData) {
  const value = row[source] ?? sourceData?.[row.key] ?? "";
  return `
    <div class="compare-cell compare-value compare-value-${source} ${row.abnormal ? "abnormal" : "consistent"}">
      <strong>${value}</strong>
    </div>
  `;
}

function renderCompareCandidateColumn(type, candidates, line, rowSpan) {
  const selectedIndex = type === "purchase"
    ? state.purchaseCandidateIndex[line.id] ?? 0
    : state.receiptCandidateIndex[line.id] ?? 0;
  const attr = type === "purchase" ? "data-purchase-pick-index" : "data-receipt-pick-index";
  const className = type === "purchase" ? "purchase-candidate-card" : "receipt-candidate-card";
  const defaultImg = "assets/img/追溯码扫描.jpg";
  return `
    <div class="compare-cell compare-candidates compare-candidates-${type}" style="grid-row: span ${rowSpan};">
      ${candidates.map((item, index) => `
        <button class="match-candidate-card ${className} ${index === selectedIndex ? "selected" : ""}" ${attr}="${index}" data-line-id="${line.id}">
          <img class="candidate-thumb-img" src="${type === "purchase" ? (item.image || defaultImg) : (item.image || defaultImg)}" alt="" onclick="event.stopPropagation(); showLightbox(this.src)" />
          <div class="candidate-text">
            <span>${type === "purchase" ? item.orderId : item.receiptPhoto}</span>
            <strong>${type === "purchase" ? item.supplier : `${item.name}${item.spec}`}</strong>
            <em>${type === "purchase" ? `${item.name}${item.spec}` : `批号 ${item.batch}`}</em>
          </div>
          <b>${item.score}</b>

        </button>
      `).join("")}
    </div>
  `;
}

function renderMeituanApprovalBlock(meituan, line, options = {}) {
  if (!meituan.available) {
    return `
      <div class="figma-meituan-block meituan-unavailable">
        <div>
          <b>未关联到O2O商品资料</b>
          <span>当前商品缺少可用于关联的码上放心商品资料</span>
        </div>
      </div>
    `;
  }
  return `
    <div class="figma-meituan-block">
      <header class="figma-meituan-header">
        <b>[${meituan.brand}]${meituan.saleName}</b>
        <div class="figma-meituan-meta">
          <span>条码：${meituan.barcode}</span>
          <span>折后价：${meituan.discountPrice}</span>
          <span>厂家：${meituan.manufacturer}</span>
          <span>准字：${meituan.approval}</span>
          <span>处方分类：${meituan.prescription}</span>
        </div>
      </header>
      <div class="figma-meituan-gallery">
        ${meituan.images.slice(0, 6).map((image, index) => options.readOnly ? `
          <span class="figma-meituan-gallery-item readonly"><img src="${image.src}" alt="美团商品图${index + 1}" /></span>
        ` : `
          <button class="figma-meituan-gallery-item" data-approval-modal="gallery" data-line-id="${line.id}" data-gallery-index="${index}" aria-label="查看美团商品图${index + 1}">
            <img src="${image.src}" alt="美团商品图${index + 1}" />
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function getApprovalReviewModel(order, line) {
  const edit = state.approvalEdits[line.id] || {};
  const systemMatchSucceeded = isSystemMatchResolved(line);
  const receiptMatchSucceeded = line.receiptMatchSucceeded !== false
    || state.receiptMatchConfirmedLineIds.has(line.id);
  const meituanName = line.abnormalFields.includes("name") ? line.trace.name : line.name;
  const purchaseCandidates = buildPurchaseCandidates(order, line);
  const selectedPurchaseIndex = state.purchaseCandidateIndex[line.id] ?? 0;
  const selectedPurchase = purchaseCandidates[selectedPurchaseIndex] || purchaseCandidates[0];
  const receiptCandidates = buildReceiptCandidates(line);
  const selectedReceiptIndex = state.receiptCandidateIndex[line.id] ?? 0;
  const selectedReceipt = receiptCandidates[selectedReceiptIndex] || receiptCandidates[0];
  const figma = line.figma || {};
  const figmaMeituan = figma.meituan || {};
  const fallbackBarcode = `69${String(line.approval).replace(/\D/g, "").padEnd(10, "0").slice(0, 10)}`;
  const fallbackTraceTotal = Number(line.trace.qty) || Number(line.qty) || buildTraceCodes(line).length;
  const hasMeituanLink = line.approval && line.approval !== "-" && line.drugId !== "UNRESOLVED";
  return {
    physical: {
      ...line.trace,
      batch: edit.batch || line.trace.batch,
      expiry: edit.expiry || line.trace.expiry,
      productionDate: edit.productionDate || line.produceDate,
      qty: figma.compareQty?.physical ?? line.trace.qty
    },
    physicalImage: "assets/img/追溯码扫描.jpg",
    productCode: figma.productCode || order.id,
    sourceSupplier: figma.sourceSupplier || order.supplier,
    traceActual: figma.traceActual ?? fallbackTraceTotal,
    traceExpected: figma.traceExpected ?? fallbackTraceTotal,
    inboundRows: figma.inboundRows || [{
      orderId: order.id,
      status: order.status,
      platformOrder: order.id,
      waybill: "-",
      qtyPrice: `${line.qty}/28.9`,
      purchasedAt: `${order.date} 16:23`
    }],
    purchase: {
      name: selectedPurchase.name,
      spec: selectedPurchase.spec,
      approval: selectedPurchase.approval,
      batch: selectedPurchase.batch,
      expiry: selectedPurchase.expiry,
      qty: figma.compareQty?.purchase ?? selectedPurchase.qty,
      orderId: selectedPurchase.orderId,
      supplier: selectedPurchase.supplier,
      status: selectedPurchase.status
    },
    meituan: {
      available: hasMeituanLink,
      name: meituanName,
      spec: line.spec,
      brand: figmaMeituan.brand || "美团",
      approval: figmaMeituan.approval || line.approval,
      saleName: figmaMeituan.saleName || `${meituanName}${line.spec}`,
      barcode: figmaMeituan.barcode || fallbackBarcode,
      manufacturer: figmaMeituan.manufacturer || line.manufacturer || "待识别",
      discountPrice: figmaMeituan.discountPrice || "15.56",
      originalPrice: "20.44",
      prescription: figmaMeituan.prescription || "OTC",
      images: hasMeituanLink ? Array.from({ length: 6 }, (_, index) => ({
        label: `${index + 1}/6`,
        src: "assets/img/美团商品图片.png"
      })) : []
    },
    receipt: {
      ...selectedReceipt.receipt,
      qty: figma.compareQty?.receipt ?? selectedReceipt.receipt.qty
    },
    receiptPhoto: selectedReceipt.receiptPhoto,
    receiptImage: selectedReceipt.image,
    traceCodes: buildTraceCodes(line),
    batchFinal: edit.batch || line.trace.batch || line.receipt.batch || line.system.batch,
    batchExpiryFinal: edit.expiry || line.trace.expiry || line.receipt.expiry || line.system.expiry,
    productionDateFinal: edit.productionDate || line.produceDate || "-",
    systemMatchSucceeded,
    receiptMatchSucceeded,
    exceptionMessage: !systemMatchSucceeded && !receiptMatchSucceeded
      ? "系统单与随货单均未匹配，需人工选择候选商品"
      : !systemMatchSucceeded
        ? "系统单商品未匹配，需人工选择候选商品"
        : !receiptMatchSucceeded
          ? "随货单商品未匹配，需人工选择候选商品"
          : "",
    purchaseCandidates,
    receiptCandidates
  };
}

function isSystemMatchResolved(line) {
  return line.systemMatchSucceeded !== false
    || state.purchaseMatchConfirmedLineIds.has(line.id);
}

function getInboundBatchValues(line) {
  const edit = state.approvalEdits[line.id] || {};
  return {
    batch: edit.batch || line.batch || line.trace?.batch || "-",
    expiry: edit.expiry || line.expiry || line.trace?.expiry || "-",
    productionDate: edit.productionDate || line.produceDate || line.trace?.productionDate || "-"
  };
}

function buildTraceCodes(line) {
  if (line.traceCodes?.length) return line.traceCodes;
  const seed = line.batch.replace(/\D/g, "").padEnd(6, "0").slice(0, 6);
  return [
    `812600${seed}000001`,
    `812600${seed}000002`,
    `812600${seed}000003`
  ];
}

function buildPurchaseCandidates(order, line) {
  return [
    {
      orderId: order.id,
      supplier: order.supplier,
      status: order.status,
      name: line.system.name,
      spec: line.system.spec,
      approval: line.system.approval,
      batch: line.system.batch,
      expiry: line.system.expiry,
      qty: line.system.qty,
      score: "92%",
      image: "assets/img/追溯码扫描.jpg"
    },
    {
      orderId: "CG10000008",
      supplier: order.supplier,
      status: "待收货",
      name: line.trace.name,
      spec: line.trace.spec,
      approval: line.trace.approval,
      batch: line.trace.batch,
      expiry: line.trace.expiry,
      qty: line.trace.qty,
      score: "81%",
      image: "assets/img/追溯码扫描.jpg"
    },
    {
      orderId: "CG10000012",
      supplier: "药九九-河南药九九医药科技有限公司",
      status: "未入库",
      name: line.name,
      spec: line.spec,
      approval: line.approval,
      batch: line.system.batch,
      expiry: line.system.expiry,
      qty: Math.max(1, line.qty - 1),
      score: "74%",
      image: "assets/img/追溯码扫描.jpg"
    }
  ];
}

function buildReceiptCandidates(line) {
  const localReceiptImage = "assets/img/发大局部随货单.png";
  return [
    {
      receiptPhoto: `${line.receiptPhoto} · 当前命中`,
      name: line.receipt.name,
      spec: line.receipt.spec,
      batch: line.receipt.batch,
      score: "96%",
      image: localReceiptImage,
      receipt: { ...line.receipt }
    },
    {
      receiptPhoto: "拍摄票据 1 · 第 4 行",
      name: line.trace.name,
      spec: line.trace.spec,
      batch: line.trace.batch,
      score: "82%",
      image: localReceiptImage,
      receipt: { ...line.receipt, name: line.trace.name, spec: line.trace.spec, batch: line.trace.batch, qty: line.trace.qty }
    },
    {
      receiptPhoto: "拍摄票据 2 · 第 1 行",
      name: line.name,
      spec: line.spec,
      batch: line.system.batch,
      score: "69%",
      image: "assets/img/随货同行单.png",
      receipt: { ...line.receipt, name: line.name, spec: line.spec, batch: line.system.batch, qty: line.system.qty }
    }
  ];
}

function renderCardFacts(data, line, abnormalKeys = []) {
  const rows = [
    ["name", "商品", data.name],
    ["spec", "规格", data.spec],
    ["approval", "准字", data.approval],
    ["batch", "批号", data.batch],
    ["expiry", "效期", data.expiry],
    ["qty", "数量", data.qty]
  ].filter(([, , value]) => value !== undefined && value !== "");

  return rows.map(([key, label, value]) => `
    <div class="stack-fact ${abnormalKeys.includes(key) && line.abnormalFields.includes(key) ? "abnormal" : ""}">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");
}

function renderMeituanFacts(meituan, line) {
  return [
    ["name", "商品", meituan.saleName],
    ["spec", "规格", meituan.spec],
    ["approval", "准字", meituan.approval]
  ].map(([key, label, value]) => `
    <div class="stack-fact ${line.abnormalFields.includes(key) ? "abnormal" : ""}">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");
}

function hasAnyAbnormal(line, keys) {
  return keys.some((key) => line.abnormalFields.includes(key));
}

function renderPurchaseCandidates(candidates, line) {
  const selectedIndex = state.purchaseCandidateIndex[line.id] ?? 0;
  return `
    <div class="match-candidate-list purchase-candidate-list">
      ${candidates.map((item, index) => `
        <button class="match-candidate-card purchase-candidate-card ${index === selectedIndex ? "selected" : ""}" data-purchase-pick-index="${index}" data-line-id="${line.id}">
          <span>${item.orderId}</span>
          <strong>${item.supplier}</strong>
          <em>${item.name}${item.spec}</em>
          <b>${item.score}</b>
        </button>
      `).join("")}
    </div>
  `;
}

function renderReceiptCandidates(candidates, line) {
  const selectedIndex = state.receiptCandidateIndex[line.id] ?? 0;
  return `
    <div class="match-candidate-list receipt-candidate-list">
      ${candidates.map((item, index) => `
        <button class="match-candidate-card receipt-candidate-card ${index === selectedIndex ? "selected" : ""}" data-receipt-pick-index="${index}" data-line-id="${line.id}">
          <span>${item.receiptPhoto}</span>
          <strong>${item.name}${item.spec}</strong>
          <em>批号 ${item.batch}</em>
          <b>${item.score}</b>
        </button>
      `).join("")}
    </div>
  `;
}

function renderEvidencePanel(title, data, line, abnormalKeys) {
  const rows = [
    ["name", "商品", data.name],
    ["spec", "规格", data.spec],
    ["approval", "准字", data.approval],
    ["batch", "批号", data.batch],
    ["qty", "数量", data.qty]
  ];
  return `
    <article class="evidence-panel">
      <div class="evidence-title">
        <b>${title}</b>
        ${data.orderId ? `<span>${data.orderId}</span>` : ""}
      </div>
      ${rows.map(([key, label, value]) => `
        <div class="evidence-row ${abnormalKeys.includes(key) && line.abnormalFields.includes(key) ? "abnormal" : ""}">
          <span>${label}</span><strong>${value}</strong>
        </div>
      `).join("")}
    </article>
  `;
}

function renderMeituanPanel(meituan, line) {
  return `
    <article class="evidence-panel meituan-panel">
      <div class="evidence-title">
        <b>美团挂网</b>
        <span>6 张图</span>
      </div>
      <div class="meituan-gallery">
        ${meituan.images.map((image, index) => `
          <button data-approval-modal="gallery" data-line-id="${line.id}" data-gallery-index="${index}" aria-label="查看美团商品图${index + 1}">
            <img src="${image.src}" alt="美团商品图${index + 1}" />
            <em>${image.label}</em>
          </button>
        `).join("")}
      </div>
      <div class="evidence-row ${line.abnormalFields.includes("name") ? "abnormal" : ""}">
        <span>商品</span><strong>${meituan.saleName}</strong>
      </div>
      <div class="evidence-row">
        <span>规格</span><strong>${meituan.spec}</strong>
      </div>
    </article>
  `;
}

function renderCompareRow(label, receiptValue, traceValue, abnormal) {
  return `
    <div class="compact-label">${label}</div>
    <div class="${abnormal ? "abnormal" : ""}">${receiptValue}</div>
    <div class="${abnormal ? "abnormal" : ""}">${traceValue}</div>
  `;
}

function bindApprovalEvidenceActions() {
  document.querySelectorAll("[data-normal-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      state.approvalNormalExpanded = !state.approvalNormalExpanded;
      renderCurrentApprovalCardSmooth();
    });
  });
  document.querySelectorAll("[data-purchase-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      if (guardTaskMutation()) return;
      const lineId = button.dataset.lineId;
      state.purchasePickerLineId = state.purchasePickerLineId === lineId ? null : lineId;
      state.receiptPickerLineId = null;
      renderCurrentApprovalCardSmooth();
    });
  });
  document.querySelectorAll("[data-purchase-pick-index]").forEach((button) => {
    button.addEventListener("click", () => {
      if (guardTaskMutation()) return;
      const lineId = button.dataset.lineId;
      const nextIndex = Number(button.dataset.purchasePickIndex) || 0;
      const previousIndex = state.purchaseCandidateIndex[lineId] ?? 0;
      state.purchaseCandidateIndex[lineId] = nextIndex;
      state.purchasePickerLineId = null;
      state.receiptPickerLineId = null;
      if (nextIndex !== previousIndex) touchCurrentTask();
      renderCurrentApprovalCardSmooth();
      showToast("已替换采购单匹配");
    });
  });
  document.querySelectorAll("[data-receipt-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const lineId = button.dataset.lineId;
      state.receiptPickerLineId = state.receiptPickerLineId === lineId ? null : lineId;
      state.purchasePickerLineId = null;
      renderCurrentApprovalCardSmooth();
    });
  });
  document.querySelectorAll("[data-receipt-pick-index]").forEach((button) => {
    button.addEventListener("click", () => {
      if (guardTaskMutation()) return;
      const lineId = button.dataset.lineId;
      const nextIndex = Number(button.dataset.receiptPickIndex) || 0;
      const previousIndex = state.receiptCandidateIndex[lineId] ?? 0;
      state.receiptCandidateIndex[lineId] = nextIndex;
      state.receiptPickerLineId = null;
      state.purchasePickerLineId = null;
      if (nextIndex !== previousIndex) touchCurrentTask();
      renderCurrentApprovalCardSmooth();
      showToast("已替换随货单匹配");
    });
  });
  document.querySelectorAll("[data-approval-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      openApprovalModal(button.dataset.approvalModal, button.dataset.lineId, button.dataset.galleryIndex);
    });
  });
}

function renderCurrentApprovalCardSmooth() {
  if (document.startViewTransition) {
    document.startViewTransition(() => renderCurrentApprovalCard());
    return;
  }
  renderCurrentApprovalCard();
}

function ensureApprovalModal() {
  let modal = document.getElementById("approvalModal");
  if (!modal) {
    document.body.insertAdjacentHTML("beforeend", `<div id="approvalModal" class="approval-modal hidden"></div>`);
    modal = document.getElementById("approvalModal");
  }
  return modal;
}

function ensureOperationOverlay() {
  let overlay = document.getElementById("operationOverlay");
  if (!overlay) {
    document.body.insertAdjacentHTML("beforeend", `
      <div id="operationOverlay" class="operation-overlay hidden" role="status" aria-live="polite" aria-busy="true">
        <div class="operation-overlay-card">
          <span class="operation-spinner" aria-hidden="true"></span>
          <strong data-operation-title>正在处理</strong>
          <small data-operation-detail>请稍候</small>
        </div>
      </div>
    `);
    overlay = document.getElementById("operationOverlay");
  }
  return overlay;
}

function setOperationBusy(busy, title = "正在处理", detail = "请稍候") {
  state.operationBusy = busy;
  const overlay = ensureOperationOverlay();
  overlay.querySelector("[data-operation-title]").textContent = title;
  overlay.querySelector("[data-operation-detail]").textContent = detail;
  overlay.classList.toggle("hidden", !busy);
  applyWorkflowReadOnlyState();
  syncPhotoSelectionControls();
  syncBatchSelectionControls();
}

function openConfirmDialog({ title = "请确认", message, confirmText = "确定", cancelText = "取消", onConfirm }) {
  const modal = ensureApprovalModal();
  modal.innerHTML = `
    <div class="approval-modal-backdrop" data-modal-close></div>
    <section class="approval-modal-sheet confirm-modal-sheet" role="dialog" aria-modal="true" aria-labelledby="confirmDialogTitle">
      <header class="modal-head">
        <strong id="confirmDialogTitle">${title}</strong>
      </header>
      <p class="confirm-modal-message">${message}</p>
      <div class="confirm-modal-actions">
        <button class="modal-secondary" data-modal-close>${cancelText}</button>
        <button class="modal-primary danger" data-confirm-submit>${confirmText}</button>
      </div>
    </section>
  `;
  modal.classList.remove("hidden");
  modal.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", closeApprovalModal);
  });
  modal.querySelector("[data-confirm-submit]")?.addEventListener("click", () => {
    closeApprovalModal();
    onConfirm?.();
  });
}

function openInfoDialog({ title = "提示", message, confirmText = "我知道了" }) {
  const modal = ensureApprovalModal();
  modal.innerHTML = `
    <div class="approval-modal-backdrop" data-modal-close></div>
    <section class="approval-modal-sheet confirm-modal-sheet info-modal-sheet" role="alertdialog" aria-modal="true" aria-labelledby="infoDialogTitle">
      <header class="modal-head">
        <strong id="infoDialogTitle">${title}</strong>
      </header>
      <p class="confirm-modal-message">${message}</p>
      <div class="confirm-modal-actions single">
        <button class="modal-primary" data-modal-close>${confirmText}</button>
      </div>
    </section>
  `;
  modal.classList.remove("hidden");
  modal.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", closeApprovalModal);
  });
}

function openCandidatePicker(type, entry) {
  const { order, line } = entry;
  const modal = ensureApprovalModal();
  let billKeyword = "";
  let productKeyword = "";
  const originalMatched = type === "purchase"
    ? line.systemMatchSucceeded !== false || state.purchaseMatchConfirmedLineIds.has(line.id)
    : line.receiptMatchSucceeded !== false || state.receiptMatchConfirmedLineIds.has(line.id);
  const savedIndex = type === "purchase"
    ? state.purchaseCandidateIndex[line.id]
    : state.receiptCandidateIndex[line.id];
  let draftIndex = savedIndex ?? (originalMatched ? 0 : -1);

  const renderPicker = () => {
    const review = getApprovalReviewModel(order, line);
    const candidates = type === "purchase" ? review.purchaseCandidates : review.receiptCandidates;
    const filtered = candidates.map((candidate, index) => ({ candidate, index })).filter(({ candidate }) => {
      const billSource = type === "purchase"
        ? `${candidate.orderId} ${candidate.supplier} ${candidate.status}`
        : `${candidate.receiptPhoto}`;
      const detail = type === "purchase" ? candidate : candidate.receipt;
      const productSource = `${candidate.name} ${candidate.spec} ${candidate.batch} ${detail?.approval || ""}`;
      return billSource.toLowerCase().includes(billKeyword.trim().toLowerCase())
        && productSource.toLowerCase().includes(productKeyword.trim().toLowerCase());
    });
    const title = type === "purchase" ? "采购单商品匹配错了，换一个" : "随货单商品匹配错了，换一个";
    const billLabel = type === "purchase" ? "采购单信息" : "随货单信息";
    const billPlaceholder = type === "purchase" ? "请输入采购单号/供应商" : "请输入票据页/行号";
    modal.innerHTML = `
      <div class="approval-modal-backdrop" data-modal-close></div>
      <section class="approval-modal-sheet figma-dialog figma-candidate-dialog ${type === "purchase" ? "figma-purchase-dialog" : "figma-receipt-dialog"} candidate-picker-sheet" role="dialog" aria-modal="true" aria-labelledby="candidatePickerTitle">
        <button class="modal-close" data-modal-close aria-label="关闭">×</button>
        <header class="modal-head"><strong id="candidatePickerTitle">${title}</strong></header>
        <form class="candidate-filter-form" data-candidate-filter-form>
          <label><span>${billLabel}</span><input name="billKeyword" value="${billKeyword}" placeholder="${billPlaceholder}" /></label>
          <label><span>商品信息</span><input name="productKeyword" value="${productKeyword}" placeholder="请输入商品名称/规格/批准文号" /></label>
          <button class="candidate-filter-submit" type="submit" tabindex="-1" aria-label="查询候选">查询</button>
        </form>
        <div class="candidate-list candidate-picker-list">
          ${filtered.length ? filtered.map(({ candidate, index }) => `
            <button type="button" class="candidate-picker-item ${index === draftIndex ? "selected" : ""}" data-candidate-draft-index="${index}">
              ${type === "receipt" ? `<img src="${candidate.image}" alt="${candidate.receiptPhoto}" />` : ""}
              <div class="candidate-picker-copy">
                <strong>${type === "purchase" ? `${candidate.orderId} ${candidate.supplier}` : candidate.receiptPhoto}</strong>
                <span>${candidate.name}${candidate.spec}</span>
                <em>${type === "purchase" ? `${candidate.status} · 批号 ${candidate.batch}` : `批号 ${candidate.batch}`}</em>
              </div>
              <b>得分：${candidate.score}</b>
              ${index === savedIndex || (savedIndex === undefined && originalMatched && index === 0) ? `<i>当前关联</i>` : ""}
            </button>
          `).join("") : `<div class="candidate-picker-empty">没有符合条件的候选商品</div>`}
        </div>
        <div class="candidate-picker-actions">
          <button class="modal-primary" type="button" data-candidate-confirm ${draftIndex < 0 ? "disabled" : ""}>确定</button>
        </div>
      </section>
    `;
    modal.classList.remove("hidden");
    modal.querySelectorAll("[data-modal-close]").forEach((button) => button.addEventListener("click", closeApprovalModal));
    const filterForm = modal.querySelector("[data-candidate-filter-form]");
    const applyFilters = () => {
      billKeyword = String(filterForm?.querySelector('[name="billKeyword"]')?.value || "");
      productKeyword = String(filterForm?.querySelector('[name="productKeyword"]')?.value || "");
      renderPicker();
    };
    filterForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      applyFilters();
    });
    filterForm?.querySelectorAll("input").forEach((input) => {
      input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        applyFilters();
      });
    });
    modal.querySelectorAll("[data-candidate-draft-index]").forEach((button) => {
      button.addEventListener("click", () => {
        draftIndex = Number(button.dataset.candidateDraftIndex);
        renderPicker();
      });
    });
    modal.querySelector("[data-candidate-confirm]")?.addEventListener("click", () => {
      if (guardTaskMutation() || draftIndex < 0) return;
      if (type === "purchase") {
        state.purchaseCandidateIndex[line.id] = draftIndex;
        state.purchaseMatchConfirmedLineIds.add(line.id);
      } else {
        state.receiptCandidateIndex[line.id] = draftIndex;
        state.receiptMatchConfirmedLineIds.add(line.id);
      }
      if (!state.inboundCompletedLineIds.has(line.id)) {
        state.approveDecisions[line.id] = "pending";
        state.confirmedPendingLineIds.delete(line.id);
        state.currentApproveLineId = line.id;
      }
      touchCurrentTask();
      closeApprovalModal();
      renderApproveWorkbench();
      showToast(type === "purchase" ? "已更换系统单商品并重新核准" : "已更换随货单商品并重新核准");
    });
    applyWorkflowReadOnlyState();
  };

  renderPicker();
}

function openBatchEditor(entry) {
  const { line } = entry;
  const modal = ensureApprovalModal();
  const saved = state.approvalEdits[line.id] || {};
  let draft = {
    batch: saved.batch || line.trace.batch || "",
    expiry: saved.expiry || line.trace.expiry || "",
    productionDate: saved.productionDate || line.produceDate || ""
  };
  const sources = [
    { label: "实物批次", batch: line.trace.batch, expiry: line.trace.expiry, productionDate: line.produceDate },
    { label: "随货单批次", batch: line.receipt.batch, expiry: line.receipt.expiry, productionDate: line.receipt.productionDate || line.produceDate },
    { label: "原始采购单批次", batch: line.system.batch, expiry: line.system.expiry, productionDate: line.system.productionDate || line.produceDate }
  ];

  const renderEditor = () => {
    modal.innerHTML = `
      <div class="approval-modal-backdrop" data-modal-close></div>
      <section class="approval-modal-sheet figma-dialog figma-batch-dialog batch-editor-sheet" role="dialog" aria-modal="true" aria-labelledby="batchEditorTitle">
        <button class="modal-close" data-modal-close aria-label="关闭">×</button>
        <header class="modal-head"><strong id="batchEditorTitle">编辑批次</strong></header>
        <div class="batch-choice-list">
          ${sources.map((source, index) => `
            <button type="button" data-batch-source="${index}">
              <span>${source.label}一键填入</span><strong>${source.batch || "-"}/${source.expiry || "-"}</strong>
            </button>
          `).join("")}
        </div>
        <div class="batch-editor-fields">
          <label><span>批号：</span><input data-batch-field="batch" value="${draft.batch}" /></label>
          <label><span>有效期至：</span><input type="date" data-batch-field="expiry" value="${draft.expiry}" /></label>
          <label><span>生产日期：</span><input type="date" data-batch-field="productionDate" value="${draft.productionDate}" /></label>
        </div>
        <div class="batch-editor-actions">
          <button class="modal-primary" type="button" data-batch-save>保存</button>
        </div>
      </section>
    `;
    modal.classList.remove("hidden");
    modal.querySelectorAll("[data-modal-close]").forEach((button) => button.addEventListener("click", closeApprovalModal));
    modal.querySelectorAll("[data-batch-field]").forEach((input) => {
      input.addEventListener("input", () => {
        draft[input.dataset.batchField] = input.value;
      });
    });
    modal.querySelectorAll("[data-batch-source]").forEach((button) => {
      button.addEventListener("click", () => {
        draft = { ...sources[Number(button.dataset.batchSource)] };
        delete draft.label;
        renderEditor();
      });
    });
    modal.querySelector("[data-batch-save]")?.addEventListener("click", () => {
      if (guardTaskMutation()) return;
      state.approvalEdits[line.id] = { ...draft };
      touchCurrentTask();
      closeApprovalModal();
      renderApproveWorkbench();
      showToast("入库批次已更新");
    });
    applyWorkflowReadOnlyState();
  };

  renderEditor();
}

function openApprovalModal(type, lineId, galleryIndex = "0") {
  const entry = getApproveLineEntries().find(({ line }) => line.id === lineId) || getCurrentApproveEntry();
  if (!entry) return;
  if (type === "trace") {
    const item = findReceiveItemForApprovalLine(entry.line);
    if (!item) {
      showToast("未找到可编辑的实录追溯码");
      return;
    }
    openTraceEditor(item);
    return;
  }
  if (type === "purchase" || type === "receipt") {
    openCandidatePicker(type, entry);
    return;
  }
  if (type === "batch") {
    openBatchEditor(entry);
    return;
  }
  const review = getApprovalReviewModel(entry.order, entry.line);
  const modal = ensureApprovalModal();
  modal.innerHTML = `
    <div class="approval-modal-backdrop" data-modal-close></div>
    <section class="approval-modal-sheet">
      <button class="modal-close" data-modal-close aria-label="关闭">×</button>
      ${renderApprovalModalContent(type, entry.order, entry.line, review, Number(galleryIndex || 0))}
    </section>
  `;
  modal.classList.remove("hidden");
  modal.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", closeApprovalModal);
  });
  modal.querySelectorAll("[data-modal-save]").forEach((button) => {
    button.addEventListener("click", () => {
      if (guardTaskMutation()) return;
      closeApprovalModal();
      showToast(button.dataset.modalSave || "已保存");
    });
  });
  modal.querySelectorAll("[data-purchase-pick-index]").forEach((button) => {
    button.addEventListener("click", () => {
      if (guardTaskMutation()) return;
      const lineId = button.dataset.lineId;
      const nextIndex = Number(button.dataset.purchasePickIndex) || 0;
      const previousIndex = state.purchaseCandidateIndex[lineId] ?? 0;
      state.purchaseCandidateIndex[lineId] = nextIndex;
      if (nextIndex !== previousIndex) touchCurrentTask();
      closeApprovalModal();
      renderCurrentApprovalCardSmooth();
      showToast("已替换采购单匹配");
    });
  });
  modal.querySelectorAll("[data-receipt-pick-index]").forEach((button) => {
    button.addEventListener("click", () => {
      if (guardTaskMutation()) return;
      const lineId = button.dataset.lineId;
      const nextIndex = Number(button.dataset.receiptPickIndex) || 0;
      const previousIndex = state.receiptCandidateIndex[lineId] ?? 0;
      state.receiptCandidateIndex[lineId] = nextIndex;
      if (nextIndex !== previousIndex) touchCurrentTask();
      closeApprovalModal();
      renderCurrentApprovalCardSmooth();
      showToast("已替换随货单匹配");
    });
  });
  applyWorkflowReadOnlyState();
}

function closeApprovalModal() {
  document.getElementById("approvalModal")?.classList.add("hidden");
}

function renderApprovalModalContent(type, order, line, review, galleryIndex) {
  if (type === "trace") {
    return `
      <header class="modal-head"><strong>追溯码</strong><span>${line.name}</span></header>
      <div class="modal-code-list">
        ${review.traceCodes.map((code) => `<label><input value="${code}" /><button data-modal-save="追溯码已保存">保存</button></label>`).join("")}
      </div>
      <button class="modal-primary" data-modal-save="追溯码已保存">保存追溯码</button>
    `;
  }

  if (type === "purchase") {
    return `
      <header class="modal-head"><strong>采购单商品匹配错了，换一个</strong><span>${line.name}</span></header>
      <div class="candidate-list">
        ${review.purchaseCandidates.map((item, index) => `
          <button class="${index === (state.purchaseCandidateIndex[line.id] ?? 0) ? "selected" : ""}" data-purchase-pick-index="${index}" data-line-id="${line.id}">
            <b>${item.orderId} · ${item.name}</b>
            <span>${item.supplier} · ${item.spec} · 数量 ${item.qty}</span>
            <em>${item.score}</em>
          </button>
        `).join("")}
      </div>
    `;
  }

  if (type === "receipt") {
    return `
      <header class="modal-head"><strong>随货单商品匹配错了，换一个</strong><span>${line.receiptPhoto}</span></header>
      <div class="candidate-list receipt-candidates">
        ${review.receiptCandidates.map((item, index) => `
          <button class="${index === (state.receiptCandidateIndex[line.id] ?? 0) ? "selected" : ""}" data-receipt-pick-index="${index}" data-line-id="${line.id}">
            <img src="${item.image}" alt="${item.receiptPhoto}" />
            <b>${item.receiptPhoto}</b>
            <span>${item.name} · 批号 ${item.batch}</span>
            <em>${item.score}</em>
          </button>
        `).join("")}
      </div>
    `;
  }

  if (type === "receiptImage") {
    return `
      <header class="modal-head"><strong>随货单命中</strong><span>${review.receiptPhoto}</span></header>
      <div class="modal-image-view receipt">
        <img src="${review.receiptImage}" alt="随货单识别行框选结果" />
      </div>
    `;
  }

  if (type === "batch") {
    const options = [
      ["实物批次一键填入", line.trace.batch],
      ["随货单批次一键填入", line.receipt.batch],
      ["原始采购单批次一键填入", line.system.batch]
    ];
    return `
      <header class="modal-head"><strong>编辑批次</strong><span>${line.name}</span></header>
      <div class="batch-choice-list">
        ${options.map(([label, value], index) => `
          <button class="${index === 0 ? "selected" : ""}" data-modal-save="入库批次已更新">
            <span>${label}</span><strong>${value}</strong>
          </button>
        `).join("")}
      </div>
      <label class="modal-input-row">
        <span>入库批次</span>
        <input value="${review.batchFinal}" />
      </label>
      <button class="modal-primary" data-modal-save="入库批次已更新">保存批次</button>
    `;
  }

  const image = review.meituan.images[galleryIndex] || review.meituan.images[0];
  return `
    <header class="modal-head"><strong>美团商品图</strong><span>${galleryIndex + 1}/6 · ${review.meituan.saleName}</span></header>
    <div class="modal-image-view">
      <img src="${image.src}" alt="美团商品图${galleryIndex + 1}" />
    </div>
  `;
}

function decideCurrentApproveLine(decision, lineId = state.currentApproveLineId, sourceElement = null) {
  if (guardTaskMutation()) return;
  const current = getActivePendingApprovalEntries().find(({ line }) => line.id === lineId) || getCurrentApproveEntry();
  if (!current || state.approveDecisions[current.line.id] !== "pending") return;
  if (decision === "selected" && !isSystemMatchResolved(current.line)) {
    openInfoDialog({
      title: "无法放入准入库",
      message: "未匹配系统单据，无法入库"
    });
    return;
  }

  const oldId = current.line.id;
  const previousQueueRects = getApprovalQueueItemRects();
  let decisionApplied = false;
  const applyDecision = () => {
    if (decisionApplied) return;
    decisionApplied = true;
    state.confirmedPendingLineIds.delete(oldId);
    if (decision === "pending") state.confirmedPendingLineIds.add(oldId);
    state.approveDecisions[oldId] = decision;
    state.touchedApprovalLineIds.add(oldId);
    state.purchasePickerLineId = null;
    state.receiptPickerLineId = null;
    const nextPending = getActivePendingApprovalEntries().find(({ line }) => line.id !== oldId);
    state.currentApproveLineId = nextPending?.line.id || null;
    syncCurrentTaskProgress({ touch: true });

    const workbench = document.getElementById("approveWorkbench");
    workbench?.classList.remove("swipe-next");
    if (decision === "selected") {
      void workbench?.offsetWidth;
      workbench?.classList.add("swipe-next");
    }
    renderApproveWorkbench();
    animateApprovalQueueShift(previousQueueRects, decision === "pending" ? oldId : null);
  };

  if (decision === "pending") {
    applyDecision();
    showToast("已移至待核准队尾");
    return;
  }

  animateDecisionDrop(decision, () => {
    applyDecision();
    showToast("已放入准入库栏，自动切到下一条");
    triggerProgressBucketImpact("ready");
  }, applyDecision, sourceElement);
}

function getApprovalDropTarget(decision) {
  const progressKey = decision === "selected" ? "ready" : "pending";
  return document.querySelector(`#approvePage [data-progress-open="${progressKey}"].progress-bubble`)
    || document.querySelector(`#approvePage .progress-bubble.${progressKey}`)
    || document.getElementById(decision === "selected" ? "selectCurrentLine" : "deferCurrentLine");
}

function triggerProgressBucketImpact(progressKey) {
  state.progressImpactKey = progressKey;
  state.progressImpactKeys.add(progressKey);
  const targets = document.querySelectorAll(`.progress-bubble.${progressKey}, .progress-segment.${progressKey}`);
  targets.forEach((target) => {
    target.classList.remove("bucket-impact", "charging");
    void target.offsetWidth;
    target.classList.add(target.classList.contains("progress-segment") ? "charging" : "bucket-impact");
  });
  window.clearTimeout(state.progressImpactTimer);
  state.progressImpactTimer = window.setTimeout(() => {
    targets.forEach((target) => target.classList.remove("bucket-impact", "charging"));
    if (state.progressImpactKey === progressKey) state.progressImpactKey = null;
    state.progressImpactKeys.delete(progressKey);
  }, 1000);
}

function animateDecisionDrop(decision, onDone, onLift, sourceOverride = null) {
  const currentButton = sourceOverride || document.querySelector(".queue-item.current");
  const sourceElement = currentButton || document.querySelector("#approvePage .inbound-card");
  const from = sourceElement?.getBoundingClientRect();
  const targetButton = getApprovalDropTarget(decision);
  const to = targetButton?.getBoundingClientRect();
  const targetLane = targetButton?.closest(".decision-lane") || targetButton;
  const ghost = document.getElementById("decisionFlyGhost");
  if (!from || !to || !ghost || !targetButton) {
    onLift?.();
    onDone();
    return;
  }

  ghost.textContent = currentButton?.querySelector("strong")?.textContent
    || document.querySelector("#approvePage .inbound-order-head b")?.textContent
    || "商品";
  const flyX = to.left + to.width / 2 - (from.left + from.width / 2);
  const flyY = to.top + to.height / 2 - (from.top + from.height / 2);
  ghost.style.left = `${from.left}px`;
  ghost.style.top = `${from.top}px`;
  ghost.style.width = `${from.width}px`;
  ghost.style.height = `${from.height}px`;
  ghost.style.borderRadius = window.getComputedStyle(sourceElement).borderRadius;
  ghost.style.setProperty("--fly-x", `${flyX}px`);
  ghost.style.setProperty("--fly-y", `${flyY}px`);
  ghost.style.setProperty("--fly-1x", `${flyX * 0.18}px`);
  ghost.style.setProperty("--fly-1y", `${Math.min(flyY * 0.08, 10) - 28}px`);
  ghost.style.setProperty("--fly-2x", `${flyX * 0.58}px`);
  ghost.style.setProperty("--fly-2y", `${flyY * 0.42 - 8}px`);
  ghost.style.setProperty("--fly-3x", `${flyX * 0.86}px`);
  ghost.style.setProperty("--fly-3y", `${flyY * 0.78}px`);
  ghost.style.setProperty("--fly-impact-y", `${flyY + 6}px`);
  ghost.classList.remove("hidden", "flying", "select", "defer", "from-queue");
  ghost.classList.add(decision === "selected" ? "select" : "defer");
  if (currentButton) ghost.classList.add("from-queue");
  targetButton.classList.remove("jelly", "liquid-impact", "bucket-impact");
  targetLane?.classList.remove("splashing", "bucket-impact");
  sourceElement?.classList.add("deciding");
  void ghost.offsetWidth;
  ghost.classList.add("flying");

  window.requestAnimationFrame(() => {
    onLift?.();
  });

  window.setTimeout(() => {
    const latestTarget = getApprovalDropTarget(decision);
    const latestLane = latestTarget?.closest(".decision-lane") || latestTarget;
    latestTarget?.classList.add("jelly", "liquid-impact", "bucket-impact");
    latestLane?.classList.add("splashing");
  }, 300);

  window.setTimeout(() => {
    ghost.classList.add("hidden");
    sourceElement?.classList.remove("deciding");
    state.progressImpactKey = decision === "selected" ? "ready" : "pending";
    onDone();
  }, 460);

  window.setTimeout(() => {
    const latestTarget = getApprovalDropTarget(decision);
    const latestLane = latestTarget?.closest(".decision-lane") || latestTarget;
    latestTarget?.classList.remove("jelly", "liquid-impact", "bucket-impact");
    latestLane?.classList.remove("splashing", "bucket-impact");
  }, 1000);
}

function showApproveView(view) {
  state.approveView = view;
  document.getElementById("approveWorkbench")?.classList.toggle("hidden", view !== "workbench");
  document.getElementById("approveBucketList")?.classList.toggle("hidden", view !== "bucketList");
  document.getElementById("approveBucketDetail")?.classList.toggle("hidden", view !== "bucketDetail");
}

function returnToApproveWorkbench() {
  state.approveReady = true;
  showApproveView("workbench");
  renderApproveWorkbench();
}

function openDecisionBucket(decision) {
  state.activeBucket = decision;
  state.bucketKeyword = "";
  state.bucketSelectedLineIds.clear();
  state.bucketPageFilter = "";
  state.bucketProductFilter = "";
  state.bucketApprovalFilter = "";
  state.bucketOnlyUninspected = true;
  state.bucketExceptionFilters.clear();
  initializeProgressPageExpansion(decision);
  showApproveView("bucketList");
  renderApprovalBucketList();
  renderInboundProgress();
}

function renderApprovalBucketList() {
  const bucket = document.getElementById("approveBucketList");
  if (!bucket) return;
  const key = state.activeBucket;
  if (key === "uninspected") {
    renderUninspectedReceiptBucketListV2(bucket);
    return;
  }
  if (key === "pending") {
    renderPendingVerificationBucketList(bucket);
    return;
  }
  if (key === "ready" || key === "inbound") {
    renderPurchaseStatusBucketList(bucket, key);
    return;
  }

  const title = getDecisionLabel(key);
  const filteredOrders = getGroupedOrdersByDecision(key);
  if (filteredOrders.length && !filteredOrders.some((order) => state.expandedProgressOrderIds.has(order.id))) {
    state.expandedProgressOrderIds.add(filteredOrders[0].id);
  }

  bucket.innerHTML = `
    <div class="bucket-head">
      <button class="detail-back" data-bucket-back="workbench">返回</button>
      <div>
        <h1>${title}</h1>
        <p>${filteredOrders.reduce((sum, order) => sum + order.lines.length, 0)}个商品 · 按采购单汇总</p>
      </div>
      ${key === "ready" ? `
        <button class="bucket-submit-inbound" data-submit-ready-inbound ${filteredOrders.length ? "" : "disabled"}>
          提交入库
        </button>
      ` : ""}
    </div>
    <div class="bucket-order-list progress-bucket-list">
      ${filteredOrders.length ? filteredOrders.map((order) => `
        <article class="bucket-order-card ${state.expandedProgressOrderIds.has(order.id) ? "expanded" : ""}">
          <button class="bucket-order-row" data-progress-order-toggle="${order.id}" aria-expanded="${state.expandedProgressOrderIds.has(order.id) ? "true" : "false"}">
            <div>
              <strong>${order.id}</strong>
              <span>${order.supplier}</span>
            </div>
            <time>${order.date}</time>
            <em>${order.lines.length}行</em>
          </button>
          <div class="bucket-lines ${state.expandedProgressOrderIds.has(order.id) ? "expanded" : ""}">
            ${order.lines.map((line) => `
              <article class="bucket-line-row ${line.status}">
                <div class="line-copy">
                  <strong>${line.name}</strong>
                  <span>${line.spec}</span>
                </div>
                <div class="line-tags">
                  <span>${line.approval}</span>
                  <span>批号 ${line.batch}</span>
                  <span>效期 ${line.expiry}</span>
                  <span>数量 ${line.qty}</span>
                </div>
                ${line.issue ? `<p>${line.issue}</p>` : `<p>随货同行单、追溯码实物、系统单据完全一致</p>`}
                <button class="line-detail-link" data-bucket-detail="${line.id}">查看核对详情</button>
              </article>
            `).join("")}
          </div>
        </article>
      `).join("") : `<div class="approval-empty-card">${title}为空</div>`}
    </div>
  `;

  bucket.querySelector("[data-bucket-back]")?.addEventListener("click", returnToApproveWorkbench);
  bucket.querySelector("[data-submit-ready-inbound]")?.addEventListener("click", submitReadyBucketToInbound);
  bucket.querySelectorAll("[data-progress-order-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.progressOrderToggle;
      if (state.expandedProgressOrderIds.has(id)) {
        state.expandedProgressOrderIds.delete(id);
      } else {
        state.expandedProgressOrderIds.add(id);
      }
      renderApprovalBucketList();
    });
  });
  bucket.querySelectorAll("[data-bucket-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      state.bucketDetailLineId = button.dataset.bucketDetail;
      showApproveView("bucketDetail");
      renderApprovalBucketDetail();
    });
  });
}

function escapeBucketAttribute(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getVerificationSearchText(order, line) {
  return [
    line.verificationId,
    line.billCode,
    line.drugId,
    line.name,
    line.spec,
    line.approval,
    line.manufacturer,
    line.batch,
    line.expiry,
    line.issue,
    order.id,
    order.supplier,
    ...(line.traceCodes || [])
  ].filter(Boolean).join(" ").toLowerCase();
}

function bindBucketSearch(bucket) {
  const input = bucket.querySelector("[data-bucket-search]");
  const clear = bucket.querySelector("[data-bucket-search-clear]");
  const count = bucket.querySelector("[data-bucket-visible-count]");
  const empty = bucket.querySelector("[data-bucket-filter-empty]");
  if (!input) return;

  const apply = () => {
    const keyword = input.value.trim().toLowerCase();
    state.bucketKeyword = input.value;
    let visibleCount = 0;
    const rows = Array.from(bucket.querySelectorAll("[data-bucket-search-row]"));
    rows.forEach((row) => {
      const matched = !keyword || row.dataset.search.includes(keyword);
      row.hidden = !matched;
      if (matched) visibleCount += 1;
    });
    if (count) count.textContent = `显示 ${visibleCount} / ${rows.length} 行`;
    if (empty) empty.hidden = visibleCount > 0 || rows.length === 0;
    if (clear) clear.disabled = !input.value;
  };

  input.addEventListener("input", apply);
  clear?.addEventListener("click", () => {
    input.value = "";
    apply();
    input.focus();
  });
  apply();
}

function renderVerificationBucketList(bucket, key) {
  const title = getDecisionLabel(key);
  const entries = getProgressGroups()[key].items;
  const isReady = key === "ready";

  bucket.innerHTML = `
    <div class="bucket-head line-grain-head">
      <button class="detail-back" data-bucket-back="workbench">返回</button>
      <div>
        <h1>${title}</h1>
        <p>${entries.length} 条 · 每行 1 条对码核准明细 · 唯一键：码上放心单号 + 药品 ID + 批号</p>
      </div>
      ${isReady ? `
        <button class="bucket-submit-inbound" data-submit-ready-inbound ${entries.length ? "" : "disabled"}>
          提交全部准入库
        </button>
      ` : ""}
    </div>
    <section class="bucket-table-shell ${key}" aria-label="${title}明细列表">
      <div class="bucket-table-toolbar">
        <label class="bucket-search-field">
          <span>搜索明细</span>
          <input data-bucket-search value="${escapeBucketAttribute(state.bucketKeyword)}" placeholder="商品、批号、单据号、供应商或明细 ID" />
        </label>
        <button data-bucket-search-clear type="button">清空</button>
        <span class="bucket-visible-count" data-bucket-visible-count></span>
      </div>
      <div class="bucket-data-scroll">
        <table class="bucket-data-table verification-line-table ${key}">
          <colgroup>
            <col class="col-line-id" />
            <col class="col-product" />
            <col class="col-source" />
            <col class="col-batch" />
            <col class="col-qty" />
            <col class="col-result" />
            <col class="col-action" />
          </colgroup>
          <thead>
            <tr>
              <th>核准明细 ID</th>
              <th>商品 / 规格</th>
              <th>来源单据 / 供应商</th>
              <th>批号 / 效期</th>
              <th>实录 / 应录</th>
              <th>对码与核准结果</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${entries.map(({ order, line }) => `
              <tr class="verification-line-row ${key} ${line.status}" data-bucket-search-row data-search="${escapeBucketAttribute(getVerificationSearchText(order, line))}">
                <td class="bucket-line-id-cell">
                  <strong>${line.verificationId || line.id}</strong>
                  <span>药品 ID ${line.drugId || "-"}</span>
                </td>
                <td class="bucket-product-cell">
                  <strong title="${escapeBucketAttribute(line.name)}">${line.name}</strong>
                  <span>${line.spec} · ${line.approval}</span>
                  <small title="${escapeBucketAttribute(line.manufacturer || "")}">${line.manufacturer || "厂家待补充"}</small>
                </td>
                <td class="bucket-source-cell">
                  <strong>${line.billCode || "-"}</strong>
                  <span title="${escapeBucketAttribute(order.supplier)}">${order.supplier}</span>
                  <small>采购单 ${order.id}</small>
                </td>
                <td class="bucket-batch-cell">
                  <strong>${line.batch}</strong>
                  <span>效期 ${line.expiry}</span>
                  <small>产期 ${line.produceDate || "-"}</small>
                </td>
                <td class="bucket-qty-cell">
                  <div><b>${line.actualQty ?? line.qty}</b><i>/</i><strong>${line.expectedQty ?? line.system?.qty ?? line.qty}</strong></div>
                  <span>实录 / 应录</span>
                </td>
                <td class="bucket-result-cell">
                  <span class="bucket-state-chip ${key}">${isReady ? "全量核准通过" : "待人工核准"}</span>
                  <p title="${escapeBucketAttribute(line.issue || "全量核准项一致")}">${line.issue || "账、票、实一致，可提交入库"}</p>
                  <small>${line.systemMatchMethod || "一一对应"} · 系统 ${line.systemScore ?? "-"}% · 随货 ${line.receiptScore ?? "-"}%</small>
                </td>
                <td class="bucket-action-cell">
                  <button class="line-detail-link compact" data-bucket-detail="${line.id}">核对详情</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        ${entries.length ? "" : `<div class="approval-empty-card compact">${title}暂无明细</div>`}
        <div class="bucket-filter-empty" data-bucket-filter-empty hidden>没有匹配的明细行</div>
      </div>
    </section>
  `;

  bucket.querySelector("[data-bucket-back]")?.addEventListener("click", returnToApproveWorkbench);
  bucket.querySelector("[data-submit-ready-inbound]")?.addEventListener("click", submitReadyBucketToInbound);
  bucket.querySelectorAll("[data-bucket-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      state.bucketDetailLineId = button.dataset.bucketDetail;
      showApproveView("bucketDetail");
      renderApprovalBucketDetail();
    });
  });
  bindBucketSearch(bucket);
  applyWorkflowReadOnlyState();
}

function submitReadyBucketToInbound() {
  if (guardTaskMutation()) return;
  const readyEntries = getProgressGroups().ready.items;
  if (!readyEntries.length) {
    showToast("准入库暂无可提交明细");
    return;
  }
  const beforeCounts = getProgressCountsSnapshot();
  readyEntries.forEach(({ line }) => state.inboundCompletedLineIds.add(line.id));
  syncCurrentTaskProgress({ touch: true });
  markProgressIncreases(beforeCounts, ["inbound"]);
  initializeProgressPageExpansion("ready");
  renderApprovalBucketList();
  renderInboundProgress();
  showToast(`已提交 ${readyEntries.length} 条准入库明细`);
}

function renderUninspectedReceiptBucketList(bucket) {
  const entries = getProgressGroups().uninspected.items;

  bucket.innerHTML = `
    <div class="bucket-head line-grain-head">
      <button class="detail-back" data-bucket-back="workbench">返回</button>
      <div>
        <h1>待验货</h1>
        <p>${entries.length} 条 · 每行 1 条 OCR 随货单明细 · 唯一键：任务 + 图片序号 + 行序号</p>
      </div>
    </div>
    <section class="bucket-table-shell uninspected" aria-label="待验货 OCR 明细列表">
      <div class="bucket-table-toolbar">
        <label class="bucket-search-field">
          <span>搜索明细</span>
          <input data-bucket-search value="${escapeBucketAttribute(state.bucketKeyword)}" placeholder="商品、批号、票据号、供应商或 OCR 行 ID" />
        </label>
        <button data-bucket-search-clear type="button">清空</button>
        <span class="bucket-visible-count" data-bucket-visible-count></span>
      </div>
      <div class="bucket-data-scroll">
        <table class="bucket-data-table receipt-line-table">
          <colgroup>
            <col class="col-ocr-id" />
            <col class="col-product" />
            <col class="col-receipt-source" />
            <col class="col-batch" />
            <col class="col-amount" />
            <col class="col-status" />
            <col class="col-action" />
          </colgroup>
          <thead>
            <tr>
              <th>OCR 明细行</th>
              <th>商品 / 规格</th>
              <th>随货单 / 供应商</th>
              <th>批号 / 效期</th>
              <th>数量 / 金额</th>
              <th>验货状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${entries.map(({ receipt, line }) => {
              const searchText = [
                line.receiptLineId,
                line.name,
                line.spec,
                line.approval,
                line.batch,
                line.businessBillNo,
                line.supplier,
                line.maker,
                receipt.title
              ].filter(Boolean).join(" ").toLowerCase();
              return `
                <tr class="receipt-line-row" data-bucket-search-row data-search="${escapeBucketAttribute(searchText)}">
                  <td class="bucket-ocr-id-cell">
                    <img src="${line.rowCrop}" alt="第${line.rowSeq}行 OCR 局部图" />
                    <div>
                      <strong>${line.receiptLineId}</strong>
                      <span>图片 ${line.imageSeq} · 第 ${line.rowSeq} 行</span>
                    </div>
                  </td>
                  <td class="bucket-product-cell">
                    <strong title="${escapeBucketAttribute(line.name)}">${line.name}</strong>
                    <span>${line.spec} · ${line.approval}</span>
                    <small>${line.dosageForm}</small>
                  </td>
                  <td class="bucket-source-cell">
                    <strong>${line.businessBillNo}</strong>
                    <span title="${escapeBucketAttribute(line.supplier)}">${line.supplier}</span>
                    <small>${receipt.title}</small>
                  </td>
                  <td class="bucket-batch-cell">
                    <strong>${line.batch}</strong>
                    <span>效期 ${line.expiry}</span>
                    <small title="${escapeBucketAttribute(line.maker)}">${line.maker}</small>
                  </td>
                  <td class="bucket-amount-cell">
                    <strong>${line.qty}</strong>
                    <span>￥${line.amount}</span>
                    <small>单价 ￥${line.price}</small>
                  </td>
                  <td class="bucket-status-cell">
                    <span class="bucket-state-chip uninspected">待验货</span>
                    <strong>未对码 ${line.remainingQty}</strong>
                    <small>OCR ${(line.ocrConfidence * 100).toFixed(0)}%</small>
                  </td>
                  <td class="bucket-action-cell">
                    <button class="line-detail-link compact" data-receipt-image="${receipt.image}">查看票据</button>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
        ${entries.length ? "" : `<div class="approval-empty-card compact">没有待验货的 OCR 明细行</div>`}
        <div class="bucket-filter-empty" data-bucket-filter-empty hidden>没有匹配的 OCR 明细行</div>
      </div>
    </section>
  `;

  bucket.querySelector("[data-bucket-back]")?.addEventListener("click", returnToApproveWorkbench);
  bucket.querySelectorAll("[data-receipt-image]").forEach((button) => {
    button.addEventListener("click", () => showLightbox(button.dataset.receiptImage));
  });
  bindBucketSearch(bucket);
}

function getLineExceptionItems(line) {
  const labels = [];
  const expectedCodes = new Set(line.expectedTraceCodes || []);
  const actualCodes = new Set(line.traceCodes || []);
  const traceMismatch = expectedCodes.size !== actualCodes.size
    || [...expectedCodes].some((code) => !actualCodes.has(code));
  const fieldLabels = {
    name: "通用名",
    spec: "规格",
    approval: "批准文号",
    batch: "批号",
    productionDate: "生产日期",
    expiry: "有效期",
    qty: "数量"
  };
  const abnormalNames = (line.abnormalFields || []).map((field) => fieldLabels[field]).filter(Boolean);

  if (traceMismatch) labels.push({ key: "trace", label: "追溯码实录应录不匹配" });
  if (abnormalNames.length) {
    labels.push({ key: "system", label: `实物VS系统单账实不符：${abnormalNames.join("、")}` });
    if (line.receiptMatchSucceeded !== false) {
      labels.push({ key: "receipt", label: `实物VS随货单账实不符：${abnormalNames.join("、")}` });
    }
  }
  if (isLineDamaged(line)) labels.push({ key: "damage", label: "商品有破损，记得去采退" });
  if (!isSystemMatchResolved(line)) labels.push({ key: "no-system", label: "未匹配系统单" });
  if (line.receiptMatchSucceeded === false && !state.receiptMatchConfirmedLineIds.has(line.id)) {
    labels.push({ key: "no-receipt", label: "未匹配随货单" });
  }
  return labels.length ? labels : [{ key: "none", label: "无异常" }];
}

function bindBucketSelectionState(bucket) {
  const validIds = new Set(
    Array.from(bucket.querySelectorAll("[data-bucket-line-select]"))
      .map((input) => input.value)
  );
  Array.from(state.bucketSelectedLineIds).forEach((lineId) => {
    if (!validIds.has(lineId)) state.bucketSelectedLineIds.delete(lineId);
  });

  const refresh = () => {
    const rowInputs = Array.from(bucket.querySelectorAll("[data-bucket-line-select]"));
    rowInputs.forEach((input) => {
      input.checked = state.bucketSelectedLineIds.has(input.value);
      input.closest("[data-bucket-search-row]")?.classList.toggle("is-selected", input.checked);
    });

    const visibleInputs = rowInputs.filter((input) => !input.closest("[data-bucket-search-row]")?.hidden);
    bucket.querySelectorAll("[data-bucket-select-all]").forEach((input) => {
      const selectedVisible = visibleInputs.filter((item) => state.bucketSelectedLineIds.has(item.value)).length;
      input.checked = visibleInputs.length > 0 && selectedVisible === visibleInputs.length;
      input.indeterminate = selectedVisible > 0 && selectedVisible < visibleInputs.length;
    });

    bucket.querySelectorAll("[data-bucket-group-select]").forEach((input) => {
      const groupInputs = rowInputs.filter((item) => item.dataset.bucketGroupId === input.value);
      const selected = groupInputs.filter((item) => state.bucketSelectedLineIds.has(item.value)).length;
      input.checked = groupInputs.length > 0 && selected === groupInputs.length;
      input.indeterminate = selected > 0 && selected < groupInputs.length;
    });

    bucket.querySelectorAll("[data-requires-selection]").forEach((button) => {
      button.disabled = state.bucketSelectedLineIds.size === 0;
      const label = button.dataset.actionLabel;
      if (label) button.textContent = state.bucketSelectedLineIds.size
        ? `${label}（${state.bucketSelectedLineIds.size}）`
        : label;
    });
  };

  bucket.querySelectorAll("[data-bucket-line-select]").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) state.bucketSelectedLineIds.add(input.value);
      else state.bucketSelectedLineIds.delete(input.value);
      refresh();
    });
  });
  bucket.querySelectorAll("[data-bucket-select-all]").forEach((input) => {
    input.addEventListener("change", () => {
      bucket.querySelectorAll("[data-bucket-line-select]").forEach((item) => {
        if (item.closest("[data-bucket-search-row]")?.hidden) return;
        if (input.checked) state.bucketSelectedLineIds.add(item.value);
        else state.bucketSelectedLineIds.delete(item.value);
      });
      refresh();
    });
  });
  bucket.querySelectorAll("[data-bucket-group-select]").forEach((input) => {
    input.addEventListener("change", () => {
      bucket.querySelectorAll("[data-bucket-line-select]").forEach((item) => {
        if (item.dataset.bucketGroupId !== input.value) return;
        if (input.checked) state.bucketSelectedLineIds.add(item.value);
        else state.bucketSelectedLineIds.delete(item.value);
      });
      refresh();
    });
  });
  refresh();
  return refresh;
}

function openBucketLineDetail(lineId) {
  state.bucketDetailLineId = lineId;
  showApproveView("bucketDetail");
  renderApprovalBucketDetail();
}

function submitPendingEntriesToReady(lineIds, options = {}) {
  if (guardTaskMutation()) return;
  const selectedIds = new Set(lineIds);
  const entries = getProgressGroups().pending.items.filter(({ line }) => selectedIds.has(line.id));
  if (!entries.length) return;
  if (entries.some(({ line }) => !isSystemMatchResolved(line))) {
    openInfoDialog({
      title: "无法放入准入库",
      message: "未匹配系统单据，无法入库"
    });
    return;
  }
  const beforeCounts = getProgressCountsSnapshot();
  entries.forEach(({ line }) => {
    state.approveDecisions[line.id] = "selected";
    state.touchedApprovalLineIds.add(line.id);
    state.confirmedPendingLineIds.delete(line.id);
  });
  state.bucketSelectedLineIds.clear();
  syncCurrentTaskProgress({ touch: true });
  markProgressIncreases(beforeCounts, ["ready"]);
  if (options.returnToList !== false) {
    showApproveView("bucketList");
    renderApprovalBucketList();
  } else {
    renderApprovalBucketDetail();
  }
  renderInboundProgress();
  showToast(`已提交 ${entries.length} 条明细至准入库`);
}

function revertReadyEntriesToPending(lineIds, options = {}) {
  if (guardTaskMutation()) return;
  const selectedIds = new Set(lineIds);
  const entries = getProgressGroups().ready.items.filter(({ line }) => selectedIds.has(line.id));
  if (!entries.length) return;
  const beforeCounts = getProgressCountsSnapshot();
  entries.forEach(({ line }) => {
    state.approveDecisions[line.id] = "pending";
    state.touchedApprovalLineIds.add(line.id);
    state.confirmedPendingLineIds.delete(line.id);
    state.confirmedPendingLineIds.add(line.id);
    state.inboundCompletedLineIds.delete(line.id);
  });
  state.bucketSelectedLineIds.clear();
  syncCurrentTaskProgress({ touch: true });
  markProgressIncreases(beforeCounts, ["pending"]);
  if (options.returnToList !== false) {
    showApproveView("bucketList");
    renderApprovalBucketList();
  } else {
    renderApprovalBucketDetail();
  }
  renderInboundProgress();
  showToast(`已回退 ${entries.length} 条明细至待核准`);
}

function distributeTraceCodesAcrossSystemLines(traceCodes, systemLineIds, seed) {
  const lineIds = systemLineIds?.length ? systemLineIds : ["UNMATCHED"];
  const offset = parseInt(buildStableLineToken(seed).slice(-2), 36) % lineIds.length;
  return Object.fromEntries(lineIds.map((lineId, index) => [
    lineId,
    traceCodes.filter((_, codeIndex) => (codeIndex + offset) % lineIds.length === index)
  ]));
}

function openInboundResultDialog({ purchaseLineCount, totalQuantity, invalidLineCount }) {
  openInfoDialog({
    title: "入库成功！",
    message: `本次共入库采购单明细行${purchaseLineCount}行，数量共${totalQuantity}个<br>发现无效采购单明细行${invalidLineCount}行，已经重新对码核准`,
    confirmText: "完成"
  });
}

function submitReadyEntriesToInbound(lineIds) {
  if (guardTaskMutation()) return;
  const selectedIds = new Set(lineIds);
  const entries = getProgressGroups().ready.items.filter(({ line }) => selectedIds.has(line.id));
  if (!entries.length) return;
  openConfirmDialog({
    title: "提交勾选项入库",
    message: "入库后库存将流入仓店可上架，是否继续？",
    confirmText: "继续",
    onConfirm: () => {
      const beforeCounts = getProgressCountsSnapshot();
      setOperationBusy(true, "正在提交入库", "正在校验系统单明细并生成入库草稿");
      window.clearTimeout(state.operationTimer);
      state.operationTimer = window.setTimeout(() => {
        let totalQuantity = 0;
        let invalidLineCount = 0;
        const validSystemLineIds = new Set();
        entries.forEach(({ line }) => {
          const valid = line.systemLineValid !== false && isSystemMatchResolved(line);
          if (!valid) {
            invalidLineCount += (line.systemLineIds || []).length || 1;
            state.approveDecisions[line.id] = "pending";
            state.touchedApprovalLineIds.add(line.id);
            state.confirmedPendingLineIds.delete(line.id);
            state.confirmedPendingLineIds.add(line.id);
            return;
          }
          const traceCodes = buildTraceCodes(line);
          const systemLineIds = line.systemLineIds?.length ? line.systemLineIds : [`${line.billCode || "SYSTEM"}-01`];
          systemLineIds.forEach((id) => validSystemLineIds.add(id));
          totalQuantity += traceCodes.length;
          state.inboundDrafts[line.id] = {
            quantity: traceCodes.length,
            traceCodes: [...traceCodes],
            traceDistribution: distributeTraceCodesAcrossSystemLines(traceCodes, systemLineIds, line.id),
            systemLineIds: [...systemLineIds],
            ...getInboundBatchValues(line)
          };
          state.inboundCompletedLineIds.add(line.id);
        });
        state.bucketSelectedLineIds.clear();
        setOperationBusy(false);
        syncCurrentTaskProgress({ touch: true });
        markProgressIncreases(beforeCounts, ["inbound", "pending"]);
        renderApprovalBucketList();
        renderInboundProgress();
        openInboundResultDialog({
          purchaseLineCount: validSystemLineIds.size,
          totalQuantity,
          invalidLineCount
        });
      }, 720);
    }
  });
}

function renderUninspectedReceiptBucketListV2(bucket) {
  const receipts = getReceiptUninspectedGroups();
  const entries = getUninspectedLineEntries(receipts);
  bucket.innerHTML = `
    <div class="bucket-head line-grain-head">
      <button class="detail-back" data-bucket-back="workbench">返回</button>
      <div><h1>待验货</h1><p>${entries.length} 条随货单明细 · 一级按图片，二级按 OCR 行</p></div>
    </div>
    <section class="bucket-table-shell prd-bucket-shell uninspected" aria-label="待验货列表">
      <div class="bucket-prd-toolbar">
        <label><span>页码数</span><input data-page-filter inputmode="numeric" value="${escapeBucketAttribute(state.bucketPageFilter)}" placeholder="精准搜索" /></label>
        <label><span>通用名</span><input data-product-filter value="${escapeBucketAttribute(state.bucketProductFilter)}" placeholder="模糊搜索" /></label>
        <label><span>批准文号</span><input data-approval-filter value="${escapeBucketAttribute(state.bucketApprovalFilter)}" placeholder="精准搜索" /></label>
        <label class="bucket-switch"><input type="checkbox" data-only-uninspected ${state.bucketOnlyUninspected ? "checked" : ""} /><span>只看未验货行</span></label>
        <label class="bucket-select-all"><input type="checkbox" data-bucket-select-all /><span>全选当前结果</span></label>
        <button class="bucket-danger-action" data-bucket-delete data-requires-selection data-action-label="删除所选">删除所选</button>
        <span class="bucket-visible-count" data-bucket-visible-count></span>
      </div>
      <div class="bucket-data-scroll">
        <table class="bucket-data-table receipt-prd-table">
          <thead><tr><th class="bucket-select-cell"></th><th>行序号 / 商品</th><th>规格 / 批准文号</th><th>剂型 / 生产厂家</th><th>批号 / 生产日期 / 效期</th><th>包装数量 / 批次单价</th><th>验货标识</th><th>操作</th></tr></thead>
          ${receipts.map((receipt) => `
            <tbody data-bucket-group="${receipt.id}">
              <tr class="bucket-parent-row" data-bucket-parent-row="${receipt.id}">
                <td><input type="checkbox" data-bucket-group-select value="${receipt.id}" aria-label="勾选该图片全部明细" /></td>
                <td colspan="7">
                  <div class="bucket-parent-summary">
                    <img src="${receipt.image}" alt="${receipt.title}" />
                    <strong>第 ${receipt.lines[0]?.pageSeq || "-"} 页</strong>
                    <span>${receipt.supplier}</span><span>业务单据号 ${receipt.businessBillNo}</span>
                    <span>销售日期 ${receipt.salesDate}</span><span>发货日期 ${receipt.deliveryDate}</span>
                  </div>
                </td>
              </tr>
              ${receipt.lines.map((line) => `
                <tr class="receipt-line-row" data-bucket-search-row data-bucket-line-id="${line.id}" data-page="${line.pageSeq}" data-product="${escapeBucketAttribute(line.name.toLowerCase())}" data-approval="${escapeBucketAttribute(line.approval.toLowerCase())}" data-uninspected="true">
                  <td class="bucket-select-cell"><input type="checkbox" data-bucket-line-select data-bucket-group-id="${receipt.id}" value="${line.id}" aria-label="勾选${line.name}" /></td>
                  <td class="bucket-product-cell"><strong>第 ${line.rowSeq} 行 · ${line.name}</strong><small>${line.receiptLineId}</small></td>
                  <td><strong>${line.spec}</strong><small>${line.approval}</small></td>
                  <td><strong>${line.dosageForm}</strong><small>${line.maker}</small></td>
                  <td><strong>${line.batch}</strong><span>生产 ${line.produceDate}</span><small>有效期 ${line.expiry}</small></td>
                  <td><strong>${line.qty}</strong><small>￥${line.price}</small></td>
                  <td><span class="bucket-state-chip uninspected">未验货</span></td>
                  <td><button class="line-detail-link compact" data-receipt-image="${receipt.image}">查看图片</button></td>
                </tr>
              `).join("")}
            </tbody>
          `).join("")}
        </table>
        ${entries.length ? "" : `<div class="approval-empty-card compact">没有待验货的随货单明细行</div>`}
        <div class="bucket-filter-empty" data-bucket-filter-empty hidden>没有匹配的随货单明细行</div>
      </div>
    </section>
  `;
  bucket.querySelector("[data-bucket-back]")?.addEventListener("click", returnToApproveWorkbench);
  bucket.querySelectorAll("[data-receipt-image]").forEach((button) => button.addEventListener("click", () => showLightbox(button.dataset.receiptImage)));
  const refreshSelection = bindBucketSelectionState(bucket);
  const applyFilters = () => {
    const page = String(bucket.querySelector("[data-page-filter]")?.value || "").trim();
    const product = String(bucket.querySelector("[data-product-filter]")?.value || "").trim().toLowerCase();
    const approval = String(bucket.querySelector("[data-approval-filter]")?.value || "").trim().toLowerCase();
    const onlyUninspected = bucket.querySelector("[data-only-uninspected]")?.checked ?? true;
    state.bucketPageFilter = page;
    state.bucketProductFilter = product;
    state.bucketApprovalFilter = approval;
    state.bucketOnlyUninspected = onlyUninspected;
    let visible = 0;
    bucket.querySelectorAll("[data-bucket-search-row]").forEach((row) => {
      const matched = (!page || row.dataset.page === page)
        && (!product || row.dataset.product.includes(product))
        && (!approval || row.dataset.approval === approval)
        && (!onlyUninspected || row.dataset.uninspected === "true");
      row.hidden = !matched;
      if (matched) visible += 1;
    });
    bucket.querySelectorAll("[data-bucket-group]").forEach((group) => {
      const anyVisible = Array.from(group.querySelectorAll("[data-bucket-search-row]")).some((row) => !row.hidden);
      group.querySelector("[data-bucket-parent-row]").hidden = !anyVisible;
    });
    bucket.querySelector("[data-bucket-visible-count]").textContent = `显示 ${visible} / ${entries.length} 行`;
    bucket.querySelector("[data-bucket-filter-empty]").hidden = visible > 0 || entries.length === 0;
    refreshSelection();
  };
  bucket.querySelectorAll("[data-page-filter], [data-product-filter], [data-approval-filter]").forEach((input) => input.addEventListener("input", applyFilters));
  bucket.querySelector("[data-only-uninspected]")?.addEventListener("change", applyFilters);
  bucket.querySelector("[data-bucket-delete]")?.addEventListener("click", () => {
    if (!state.bucketSelectedLineIds.size) return;
    openConfirmDialog({
      title: "删除待验货明细",
      message: "确定删除？",
      confirmText: "确定",
      onConfirm: () => {
        const count = state.bucketSelectedLineIds.size;
        state.bucketSelectedLineIds.forEach((lineId) => state.removedReceiptLineIds.add(lineId));
        state.bucketSelectedLineIds.clear();
        syncCurrentTaskProgress({ touch: true });
        renderApprovalBucketList();
        renderInboundProgress();
        showToast(`已删除 ${count} 条随货单明细`);
      }
    });
  });
  applyFilters();
  applyWorkflowReadOnlyState();
}

function renderPendingVerificationBucketList(bucket) {
  const entries = getProgressGroups().pending.items;
  const exceptionOptions = [
    ["trace", "追溯码实录应录不匹配"],
    ["system", "实物VS系统单账实不符"],
    ["receipt", "实物VS随货单账实不符"],
    ["damage", "商品有破损"],
    ["no-system", "未匹配系统单"],
    ["no-receipt", "未匹配随货单"],
    ["none", "无异常"]
  ];
  bucket.innerHTML = `
    <div class="bucket-head line-grain-head">
      <button class="detail-back" data-bucket-back="workbench">返回</button>
      <div><h1>待核准</h1><p>${entries.length} 条验货明细 · 一张商品卡片计为一条</p></div>
    </div>
    <section class="bucket-table-shell prd-bucket-shell pending" aria-label="待核准列表">
      <div class="bucket-prd-toolbar">
        <label><span>药品名称</span><input data-product-filter value="${escapeBucketAttribute(state.bucketProductFilter)}" placeholder="模糊搜索" /></label>
        <label><span>批准文号</span><input data-approval-filter value="${escapeBucketAttribute(state.bucketApprovalFilter)}" placeholder="精准搜索" /></label>
        <details class="bucket-exception-filter"><summary>当前异常项${state.bucketExceptionFilters.size ? `（${state.bucketExceptionFilters.size}）` : ""}</summary><div>${exceptionOptions.map(([key, label]) => `<label><input type="checkbox" data-exception-filter value="${key}" ${state.bucketExceptionFilters.has(key) ? "checked" : ""} />${label}</label>`).join("")}</div></details>
        <label class="bucket-select-all"><input type="checkbox" data-bucket-select-all /><span>全选当前结果</span></label>
        <button class="bucket-primary-action" data-bucket-submit-ready data-requires-selection data-action-label="提交勾选项至准入库">提交勾选项至准入库</button>
        <span class="bucket-visible-count" data-bucket-visible-count></span>
      </div>
      <div class="bucket-data-scroll">
        <table class="bucket-data-table pending-prd-table">
          <thead><tr><th class="bucket-select-cell"></th><th>供应商 / 药品名称</th><th>包装规格 / 制剂规格</th><th>批准文号 / 剂型 / 厂家</th><th>批号 / 生产日期 / 效期</th><th>应录 / 实录追溯码</th><th>当前异常项</th><th>操作</th></tr></thead>
          <tbody>${entries.map(({ order, line }) => {
            const exceptions = getLineExceptionItems(line);
            return `<tr data-bucket-search-row data-bucket-line-id="${line.id}" data-product="${escapeBucketAttribute(line.name.toLowerCase())}" data-approval="${escapeBucketAttribute(line.approval.toLowerCase())}" data-exceptions="${exceptions.map((item) => item.key).join(" ")}">
              <td class="bucket-select-cell"><input type="checkbox" data-bucket-line-select value="${line.id}" aria-label="勾选${line.name}" /></td>
              <td class="bucket-product-cell"><small>${order.supplier}</small><strong>${line.name}</strong></td>
              <td><strong>${line.spec}</strong><small>${line.dosageForm || "-"}</small></td>
              <td><strong>${line.approval}</strong><span>${line.dosageForm || "-"}</span><small>${line.manufacturer || "-"}</small></td>
              <td><strong>${line.batch}</strong><span>生产 ${line.produceDate || "-"}</span><small>有效期 ${line.expiry}</small></td>
              <td class="bucket-trace-pair"><span>应录 ${(line.expectedTraceCodes || []).join("、") || "-"}</span><strong>实录 ${(line.traceCodes || []).join("、") || "-"}</strong></td>
              <td><div class="bucket-exception-chips">${exceptions.map((item) => `<span class="${item.key}">${item.label}</span>`).join("")}</div></td>
              <td><button class="line-detail-link compact" data-bucket-detail="${line.id}">查看核准详情</button></td>
            </tr>`;
          }).join("")}</tbody>
        </table>
        ${entries.length ? "" : `<div class="approval-empty-card compact">没有待核准明细</div>`}
        <div class="bucket-filter-empty" data-bucket-filter-empty hidden>没有匹配的待核准明细</div>
      </div>
    </section>
  `;
  bucket.querySelector("[data-bucket-back]")?.addEventListener("click", returnToApproveWorkbench);
  bucket.querySelectorAll("[data-bucket-detail]").forEach((button) => button.addEventListener("click", () => openBucketLineDetail(button.dataset.bucketDetail)));
  const refreshSelection = bindBucketSelectionState(bucket);
  const applyFilters = () => {
    const product = String(bucket.querySelector("[data-product-filter]")?.value || "").trim().toLowerCase();
    const approval = String(bucket.querySelector("[data-approval-filter]")?.value || "").trim().toLowerCase();
    state.bucketProductFilter = product;
    state.bucketApprovalFilter = approval;
    let visible = 0;
    bucket.querySelectorAll("[data-bucket-search-row]").forEach((row) => {
      const rowExceptions = new Set(row.dataset.exceptions.split(" "));
      const exceptionMatched = !state.bucketExceptionFilters.size
        || [...state.bucketExceptionFilters].some((key) => rowExceptions.has(key));
      const matched = (!product || row.dataset.product.includes(product))
        && (!approval || row.dataset.approval === approval)
        && exceptionMatched;
      row.hidden = !matched;
      if (matched) visible += 1;
    });
    bucket.querySelector("[data-bucket-visible-count]").textContent = `显示 ${visible} / ${entries.length} 行`;
    bucket.querySelector("[data-bucket-filter-empty]").hidden = visible > 0 || entries.length === 0;
    refreshSelection();
  };
  bucket.querySelectorAll("[data-product-filter], [data-approval-filter]").forEach((input) => input.addEventListener("input", applyFilters));
  bucket.querySelectorAll("[data-exception-filter]").forEach((input) => input.addEventListener("change", () => {
    if (input.checked) state.bucketExceptionFilters.add(input.value);
    else state.bucketExceptionFilters.delete(input.value);
    applyFilters();
  }));
  bucket.querySelector("[data-bucket-submit-ready]")?.addEventListener("click", () => submitPendingEntriesToReady(state.bucketSelectedLineIds));
  applyFilters();
  applyWorkflowReadOnlyState();
}

function getPurchaseStatusMeta(order, line) {
  const batchValues = getInboundBatchValues(line);
  const systemLine = order.lines?.find((item) => item.name === line.name) || order.lines?.[0] || {};
  const digits = String(line.approval || "").replace(/\D/g, "").padEnd(11, "0").slice(0, 11);
  return {
    platform: "掌店易",
    status: "待入库",
    platformOrder: line.system?.platformOrder || `PT${String(order.id).replace(/\D/g, "")}`,
    waybill: line.system?.waybill || `YT${String(order.id).replace(/\D/g, "")}6550`,
    barcode: `69${digits}`,
    purchaseQty: Number(line.system?.qty || systemLine.qty || line.expectedQty || 0),
    inboundQty: buildTraceCodes(line).length,
    price: systemLine.price || "-",
    ...batchValues
  };
}

function renderPurchaseStatusBucketList(bucket, key) {
  const entries = getProgressGroups()[key].items;
  const isReady = key === "ready";
  const grouped = new Map();
  entries.forEach((entry) => {
    if (!grouped.has(entry.order.id)) grouped.set(entry.order.id, { order: entry.order, entries: [] });
    grouped.get(entry.order.id).entries.push(entry);
  });
  bucket.innerHTML = `
    <div class="bucket-head line-grain-head">
      <button class="detail-back" data-bucket-back="workbench">返回</button>
      <div><h1>${isReady ? "准入库" : "已入库"}</h1><p>${entries.length} 条验货明细 · 一级按采购单，二级按商品</p></div>
    </div>
    <section class="bucket-table-shell prd-bucket-shell ${key}" aria-label="${isReady ? "准入库" : "已入库"}列表">
      <div class="bucket-prd-toolbar">
        <label><span>采购单号</span><input data-order-filter value="${escapeBucketAttribute(state.bucketPageFilter)}" placeholder="精准搜索" /></label>
        <label><span>商品名称</span><input data-product-filter value="${escapeBucketAttribute(state.bucketProductFilter)}" placeholder="模糊搜索" /></label>
        <label><span>批准文号</span><input data-approval-filter value="${escapeBucketAttribute(state.bucketApprovalFilter)}" placeholder="精准搜索" /></label>
        ${isReady ? `<label class="bucket-select-all"><input type="checkbox" data-bucket-select-all /><span>全选当前结果</span></label>
          <button class="bucket-secondary-action" data-bucket-revert-pending data-requires-selection data-action-label="回退勾选项至待核准">回退勾选项至待核准</button>
          <button class="bucket-primary-action" data-bucket-submit-inbound data-requires-selection data-action-label="提交勾选项入库">提交勾选项入库</button>` : ""}
        <span class="bucket-visible-count" data-bucket-visible-count></span>
      </div>
      <div class="bucket-data-scroll">
        <table class="bucket-data-table purchase-prd-table">
          <thead><tr>${isReady ? `<th class="bucket-select-cell"></th>` : ""}<th>商品 / 规格</th><th>批准文号 / 条码 / 厂家</th><th>入库批号 / 生产日期 / 效期</th><th>采购数量 / 入库数量 / 单价</th><th>操作</th></tr></thead>
          ${Array.from(grouped.values()).map(({ order, entries: orderEntries }) => `
            <tbody data-bucket-group="${order.id}">
              <tr class="bucket-parent-row" data-bucket-parent-row="${order.id}">
                ${isReady ? `<td><input type="checkbox" data-bucket-group-select value="${order.id}" aria-label="勾选采购单${order.id}全部商品" /></td>` : ""}
                <td colspan="5"><div class="bucket-parent-summary purchase"><strong>${order.id}</strong><span>采购平台 掌店易</span><span>单据状态 待入库</span><span>${order.supplier}</span><span>平台单号 PT${String(order.id).replace(/\D/g, "")}</span><span>运单号 YT${String(order.id).replace(/\D/g, "")}6550</span></div></td>
              </tr>
              ${orderEntries.map(({ line }) => {
                const meta = getPurchaseStatusMeta(order, line);
                return `<tr data-bucket-search-row data-bucket-line-id="${line.id}" data-order="${escapeBucketAttribute(order.id.toLowerCase())}" data-product="${escapeBucketAttribute(line.name.toLowerCase())}" data-approval="${escapeBucketAttribute(line.approval.toLowerCase())}">
                  ${isReady ? `<td class="bucket-select-cell"><input type="checkbox" data-bucket-line-select data-bucket-group-id="${order.id}" value="${line.id}" aria-label="勾选${line.name}" /></td>` : ""}
                  <td class="bucket-product-cell"><strong>${line.name}</strong><small>${line.spec}</small></td>
                  <td><strong>${line.approval}</strong><span>${meta.barcode}</span><small>${line.manufacturer || "-"}</small></td>
                  <td><strong>${meta.batch}</strong><span>生产 ${meta.productionDate}</span><small>有效期 ${meta.expiry}</small></td>
                  <td><strong>${meta.purchaseQty} / ${meta.inboundQty}</strong><small>￥${meta.price}</small></td>
                  <td><button class="line-detail-link compact" data-bucket-detail="${line.id}">查看核准详情</button></td>
                </tr>`;
              }).join("")}
            </tbody>
          `).join("")}
        </table>
        ${entries.length ? "" : `<div class="approval-empty-card compact">${isReady ? "准入库" : "已入库"}暂无明细</div>`}
        <div class="bucket-filter-empty" data-bucket-filter-empty hidden>没有匹配的明细</div>
      </div>
    </section>
  `;
  bucket.querySelector("[data-bucket-back]")?.addEventListener("click", returnToApproveWorkbench);
  bucket.querySelectorAll("[data-bucket-detail]").forEach((button) => button.addEventListener("click", () => openBucketLineDetail(button.dataset.bucketDetail)));
  const refreshSelection = isReady ? bindBucketSelectionState(bucket) : () => {};
  const applyFilters = () => {
    const orderFilter = String(bucket.querySelector("[data-order-filter]")?.value || "").trim().toLowerCase();
    const product = String(bucket.querySelector("[data-product-filter]")?.value || "").trim().toLowerCase();
    const approval = String(bucket.querySelector("[data-approval-filter]")?.value || "").trim().toLowerCase();
    state.bucketPageFilter = orderFilter;
    state.bucketProductFilter = product;
    state.bucketApprovalFilter = approval;
    let visible = 0;
    bucket.querySelectorAll("[data-bucket-search-row]").forEach((row) => {
      const matched = (!orderFilter || row.dataset.order === orderFilter)
        && (!product || row.dataset.product.includes(product))
        && (!approval || row.dataset.approval === approval);
      row.hidden = !matched;
      if (matched) visible += 1;
    });
    bucket.querySelectorAll("[data-bucket-group]").forEach((group) => {
      const anyVisible = Array.from(group.querySelectorAll("[data-bucket-search-row]")).some((row) => !row.hidden);
      group.querySelector("[data-bucket-parent-row]").hidden = !anyVisible;
    });
    bucket.querySelector("[data-bucket-visible-count]").textContent = `显示 ${visible} / ${entries.length} 行`;
    bucket.querySelector("[data-bucket-filter-empty]").hidden = visible > 0 || entries.length === 0;
    refreshSelection();
  };
  bucket.querySelectorAll("[data-order-filter], [data-product-filter], [data-approval-filter]").forEach((input) => input.addEventListener("input", applyFilters));
  bucket.querySelector("[data-bucket-revert-pending]")?.addEventListener("click", () => revertReadyEntriesToPending(state.bucketSelectedLineIds));
  bucket.querySelector("[data-bucket-submit-inbound]")?.addEventListener("click", () => submitReadyEntriesToInbound(state.bucketSelectedLineIds));
  applyFilters();
  applyWorkflowReadOnlyState();
}

function getGroupedOrdersByDecision(decision) {
  const progressKey = {
    inbound: "inbound",
    ready: "ready",
    pending: "pending",
    selected: "ready"
  }[decision];
  const grouped = new Map();
  const entries = progressKey
    ? getProgressGroups()[progressKey].items
    : getApproveLineEntries().filter(({ line }) => state.approveDecisions[line.id] === decision);
  entries.forEach(({ order, line }) => {
    if (!grouped.has(order.id)) {
      grouped.set(order.id, { ...order, lines: [] });
    }
    grouped.get(order.id).lines.push(line);
  });
  return Array.from(grouped.values());
}

function renderApprovalBucketDetail() {
  const detail = document.getElementById("approveBucketDetail");
  if (!detail) return;
  const readOnly = state.activeBucket === "inbound";
  const groups = getProgressGroups();
  const entry = (groups[state.activeBucket]?.items || []).find(({ line }) => line.id === state.bucketDetailLineId)
    || getApproveLineEntries().find(({ line }) => line.id === state.bucketDetailLineId);
  if (!entry || !entry.line.system) {
    detail.innerHTML = `
      <div class="bucket-head">
        <button class="detail-back" data-bucket-list-back>返回</button>
        <div>
          <h1>核对详情</h1>
          <p>该条暂无三方核对快照</p>
        </div>
      </div>
      <div class="approval-empty-card">没有可追溯的核准详情</div>
    `;
    detail.querySelector("[data-bucket-list-back]")?.addEventListener("click", () => {
      showApproveView("bucketList");
      renderApprovalBucketList();
    });
    return;
  }
  detail.innerHTML = `
    <div class="bucket-head">
      <button class="detail-back" data-bucket-list-back>返回</button>
      <div>
        <h1>${entry.line.name}核对详情</h1>
        <p>${getDecisionLabel(state.activeBucket)}快照 · ${entry.order.id} · ${entry.order.supplier}</p>
      </div>
      ${state.activeBucket === "pending" ? `<button class="bucket-primary-action" data-detail-submit-ready>提交至准入库</button>` : ""}
      ${state.activeBucket === "ready" ? `<button class="bucket-secondary-action" data-detail-revert-pending>回退至待核准</button>` : ""}
    </div>
    <div class="bucket-detail-body">
      ${renderApprovalEvidence(entry.order, entry.line, { readOnly })}
    </div>
  `;
  if (!readOnly) bindApprovalEvidenceActions();
  detail.querySelector("[data-detail-submit-ready]")?.addEventListener("click", () => {
    submitPendingEntriesToReady([entry.line.id], { returnToList: true });
  });
  detail.querySelector("[data-detail-revert-pending]")?.addEventListener("click", () => {
    revertReadyEntriesToPending([entry.line.id], { returnToList: true });
  });
  detail.querySelector("[data-bucket-list-back]")?.addEventListener("click", () => {
    showApproveView("bucketList");
    renderApprovalBucketList();
  });
  applyWorkflowReadOnlyState();
}

function getDecisionLabel(decision) {
  return {
    inbound: "已入库",
    ready: "准入库",
    uninspected: "待验货",
    pending: "待核准",
    deferred: "暂不入库",
    selected: "准入库"
  }[decision] || "待核准";
}

function getFilteredOrders() {
  const keyword = state.orderKeyword.trim().toLowerCase();
  if (!keyword) return orders;
  return orders.filter((order) => {
    const haystack = `${order.id} ${order.supplier} ${order.codes} ${order.items}`.toLowerCase();
    return haystack.includes(keyword);
  });
}

function renderOrders() {
  const orderList = document.getElementById("orderList");
  const inboundList = document.getElementById("inboundList");
  const inboundSummary = document.getElementById("inboundSummary");
  if (!orderList || !inboundList || !inboundSummary) return;

  const filtered = getFilteredOrders();
  orderList.innerHTML = filtered.length ? filtered.map((order) => {
    const joined = state.inboundOrderIds.includes(order.id);
    return `
      <article class="order-card ${joined ? "joined" : ""}" data-order-id="${order.id}">
        <div class="order-main">
          <div>
            <button class="order-link" data-id="${order.id}">${order.id}</button>
            <span>${order.supplier}</span>
          </div>
          <em>${order.amount}</em>
        </div>
        <div class="order-meta">
          <span>${order.date}</span>
          <span>${order.items}</span>
          <span>${order.source}</span>
        </div>
        <button class="join-btn" data-id="${order.id}" ${joined ? "disabled" : ""}>
          ${joined ? "已加入" : "加入入库栏"}
        </button>
      </article>
    `;
  }).join("") : `<div class="empty-result">未找到相关采购单，请更换订单号、追溯码或供应商名称</div>`;

  const inboundOrders = orders.filter((order) => state.inboundOrderIds.includes(order.id));
  inboundSummary.textContent = `已加入 ${inboundOrders.length} 张采购单`;
  inboundList.innerHTML = inboundOrders.length ? inboundOrders.map((order) => `
    <article class="inbound-card ${order.smart ? "smart" : ""}" data-order-id="${order.id}">
      <div>
        <button class="order-link" data-id="${order.id}">${order.id}</button>
        <span>${order.supplier}</span>
      </div>
      <em>${order.amount}</em>
      <button class="remove-order" data-id="${order.id}">移除入库栏</button>
    </article>
  `).join("") : `<div class="empty-inbound">暂无订单，请从上方列表加入入库栏</div>`;

  document.querySelectorAll(".join-btn").forEach((button) => {
    button.addEventListener("click", () => addOrderToInbound(button.dataset.id, button));
  });
  document.querySelectorAll(".remove-order").forEach((button) => {
    button.addEventListener("click", () => {
      state.inboundOrderIds = state.inboundOrderIds.filter((id) => id !== button.dataset.id);
      renderOrders();
    });
  });
  document.querySelectorAll(".order-link").forEach((button) => {
    button.addEventListener("click", () => openOrderDetail(button.dataset.id));
  });

  document.getElementById("matchDone").disabled = state.inboundOrderIds.length === 0;
}

function openOrderDetail(orderId) {
  state.detailOrderId = orderId;
  setStep("detail");
}

function renderOrderDetail() {
  const order = orders.find((item) => item.id === state.detailOrderId) || orders[0];
  if (!order) return;
  document.getElementById("detailOrderId").textContent = order.id;
  document.getElementById("detailSupplier").textContent = order.supplier;
  document.getElementById("detailAmount").textContent = order.amount;
  document.getElementById("detailDate").textContent = order.date;
  document.getElementById("detailSource").textContent = order.source;
  document.getElementById("detailLines").innerHTML = order.lines.map((line, index) => `
    <article class="line-card">
      <div class="line-index">${index + 1}</div>
      <div class="line-goods">
        <strong>${line.name}</strong>
        <span>${line.spec} · 批号 ${line.batch}</span>
      </div>
      <div class="line-metric">
        <b>${line.qty}</b>
        <span>数量</span>
      </div>
      <div class="line-metric">
        <b>${line.price}</b>
        <span>单价</span>
      </div>
      <em>${line.status}</em>
    </article>
  `).join("");
}

function addOrderToInbound(orderId, button) {
  if (state.inboundOrderIds.includes(orderId)) return;
  animateDrop(button, orders.find((order) => order.id === orderId)?.id || orderId);
  window.setTimeout(() => {
    state.inboundOrderIds.push(orderId);
    renderOrders();
  }, 420);
}

function animateDrop(button, label) {
  const ghost = document.getElementById("dropGhost");
  const zone = document.getElementById("inboundDropZone");
  if (!ghost || !zone) return;

  const from = button.getBoundingClientRect();
  const to = zone.getBoundingClientRect();
  ghost.querySelector("span").textContent = label;
  ghost.style.left = `${from.left + from.width / 2 - 82}px`;
  ghost.style.top = `${from.top - 4}px`;
  ghost.style.setProperty("--drop-x", `${to.left + to.width / 2 - (from.left + from.width / 2)}px`);
  ghost.style.setProperty("--drop-y", `${to.top + 28 - from.top}px`);
  ghost.classList.remove("hidden", "dropping");
  void ghost.offsetWidth;
  ghost.classList.add("dropping");
  window.setTimeout(() => ghost.classList.add("hidden"), 430);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  window.setTimeout(() => toast.classList.add("hidden"), 2600);
}

document.getElementById("newInboundTask")?.addEventListener("click", createInboundTask);
document.getElementById("backToTaskHome")?.addEventListener("click", showTaskHome);
document.getElementById("taskFilters")?.addEventListener("submit", (event) => event.preventDefault());
document.querySelectorAll("[data-task-filter]").forEach((input) => {
  input.addEventListener("input", () => {
    state.taskFilters[input.dataset.taskFilter] = input.value;
    renderTaskHome();
  });
});
document.getElementById("clearTaskFilters")?.addEventListener("click", () => {
  Object.keys(state.taskFilters).forEach((key) => {
    state.taskFilters[key] = "";
  });
  document.querySelectorAll("[data-task-filter]").forEach((input) => {
    input.value = "";
  });
  renderTaskHome();
});

document.getElementById("takePhoto").addEventListener("click", () => addPhoto("camera"));
document.getElementById("uploadPhoto").addEventListener("click", () => {
  if (guardTaskMutation() || state.operationBusy) return;
  document.getElementById("receiptUploadInput")?.click();
});
function canDecodeReceiptImage(file) {
  return new Promise((resolve, reject) => {
    const previewUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(previewUrl);
      resolve(true);
    };
    image.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error("IMAGE_DECODE_FAILED"));
    };
    image.src = previewUrl;
  });
}

document.getElementById("receiptUploadInput")?.addEventListener("change", async (event) => {
  const files = Array.from(event.target.files || []);
  event.target.value = "";
  if (!files.length) return;
  const invalidType = files.find((file) => !["image/png", "image/jpeg"].includes(file.type));
  if (invalidType) {
    showToast("仅支持 PNG/JPG 图片");
    return;
  }
  const oversized = files.find((file) => file.size > 10 * 1024 * 1024);
  if (oversized) {
    showToast("图片大小不能超过10MB");
    return;
  }
  try {
    await Promise.all(files.map(canDecodeReceiptImage));
  } catch {
    showToast("识别失败，请重新拍照或上传");
    return;
  }
  recognizeReceiptPhotos(files.map((file, index) => ({
    title: `相册票据 ${state.photos.length + index + 1}`,
    image: URL.createObjectURL(file)
  })));
});

document.getElementById("selectAllPhotos")?.addEventListener("change", (event) => {
  if (isCurrentTaskReadOnly()) return;
  if (event.target.checked) {
    state.photos.forEach((photo) => state.selectedPhotoIds.add(photo.id));
  } else {
    state.selectedPhotoIds.clear();
  }
  document.querySelectorAll("[data-photo-select]").forEach((input) => {
    input.checked = event.target.checked;
    input.closest(".thumb")?.classList.toggle("selected", event.target.checked);
  });
  syncPhotoSelectionControls();
});

document.getElementById("deleteSelectedPhotos")?.addEventListener("click", () => {
  if (guardTaskMutation() || state.operationBusy) return;
  const selectedCount = state.selectedPhotoIds.size;
  if (!selectedCount) return;
  openConfirmDialog({
    title: "删除随货单图片",
    message: "删除随货单图片后将重新匹配随货单并智能核准，请注意待核准数量的变化。",
    confirmText: "确认删除",
    onConfirm: () => {
      const beforeCounts = getProgressCountsSnapshot();
      setOperationBusy(true, "正在删除随货单图片", "正在重新匹配随货单并智能核准");
      window.clearTimeout(state.operationTimer);
      state.operationTimer = window.setTimeout(() => {
        state.photos = state.photos.filter((photo) => !state.selectedPhotoIds.has(photo.id));
        state.selectedPhotoIds.clear();
        sortReceiptPhotos();
        reconcileReceiptAssociations();
        syncCurrentTaskProgress({ touch: true });
        markProgressIncreases(beforeCounts, ["uninspected", "pending", "ready"]);
        setOperationBusy(false);
        renderPhotos();
        renderReceiveItems();
        renderApproveWorkbench();
        showToast(`已删除 ${selectedCount} 张票据`);
      }, 760);
    }
  });
});

document.getElementById("photoDone")?.addEventListener("click", () => {
  if (!state.photos.length) return;
  setStep("scan");
});

document.getElementById("orderSearch")?.addEventListener("input", (event) => {
  state.orderKeyword = event.target.value;
  renderOrders();
});

document.getElementById("searchClear")?.addEventListener("click", () => {
  state.orderKeyword = "";
  document.getElementById("orderSearch").value = "";
  renderOrders();
});

document.getElementById("scanSearch")?.addEventListener("input", (event) => {
  state.scanKeyword = event.target.value;
  renderReceiveItems();
});

document.getElementById("selectAllBatches")?.addEventListener("change", (event) => {
  if (guardTaskMutation()) return;
  const visibleItems = getVisibleReceiveItems();
  if (event.target.checked) {
    visibleItems.forEach((item) => state.selectedBatchIds.add(item.id));
  } else {
    visibleItems.forEach((item) => state.selectedBatchIds.delete(item.id));
  }
  renderReceiveItems();
});

document.getElementById("deleteSelectedBatches")?.addEventListener("click", deleteSelectedReceiveItems);

document.getElementById("backToMatch")?.addEventListener("click", () => setStep("match"));

document.querySelectorAll("[data-bucket-open]").forEach((button) => {
  button.addEventListener("click", () => {
    openDecisionBucket(button.dataset.bucketOpen);
  });
});

document.getElementById("deferCurrentLine")?.addEventListener("click", () => decideCurrentApproveLine("deferred"));
document.getElementById("selectCurrentLine")?.addEventListener("click", () => decideCurrentApproveLine("selected"));
document.getElementById("approveBackBtn")?.addEventListener("click", () => {
  if (state.currentStep === "approve" && state.approveView === "bucketDetail") {
    showApproveView("bucketList");
    renderApprovalBucketList();
    return;
  }
  if (state.currentStep === "approve" && state.approveView === "bucketList") {
    returnToApproveWorkbench();
    return;
  }
  setStep("scan");
});

document.getElementById("demoGuideBtn")?.addEventListener("click", () => {
  document.querySelectorAll(".page").forEach((page) => page.classList.add("hidden"));
  document.getElementById("demoGuidePage")?.classList.remove("hidden");
});

document.getElementById("demoGuideBack")?.addEventListener("click", () => {
  document.getElementById("demoGuidePage")?.classList.add("hidden");
  document.getElementById("approvePage")?.classList.remove("hidden");
});

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => setStep(button.dataset.next));
});

document.querySelectorAll("[data-prev]").forEach((button) => {
  button.addEventListener("click", () => setStep(button.dataset.prev));
});

document.querySelectorAll(".step").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.step;
    if ((target === "scan" || target === "approve") && !state.photos.length) {
      showToast("请先拍摄或上传随货同行单");
      return;
    }
    if (target === "approve" && !receiveItems.some((item) => item.codes.length)) {
      showToast("请先完成验货扫码");
      setStep("scan");
      return;
    }
    setStep(target);
  });
});

function buildMockScanBatch() {
  const groups = [
    [0, 1],
    [2, 4],
    [3, 1],
    [0, 2, 4],
    [1, 3]
  ];
  const group = groups[state.scanCursor % groups.length];
  const round = Math.floor(state.scanCursor / groups.length);
  state.scanCursor += 1;
  return group.map((eventIndex, index) => {
    const receiptIndex = round % Math.max(state.photos.length, 1);
    const event = scopeScanEventToReceipt(scanEvents[eventIndex], receiptIndex);
    const suffix = String(round * 10 + index + 3).padStart(2, "0");
    return {
      ...event,
      code: event.code.replace(/\d{2}$/, suffix)
    };
  });
}

function scopeScanEventToReceipt(event, receiptIndex) {
  const receiptNumber = receiptIndex + 1;
  return {
    ...event,
    baseId: event.id,
    id: `${event.id}-receipt-${receiptNumber}`,
    receiptPhotoId: state.photos[receiptIndex]?.id || null,
    receiptMatched: Boolean(state.photos[receiptIndex])
  };
}

function upsertScannedEvent(event) {
  let item = receiveItems.find((batch) => batch.id === event.id);
  if (!item) {
    item = {
      id: event.id,
      baseId: event.baseId || event.id,
      name: event.name,
      spec: event.spec,
      approval: event.approval,
      batch: event.batch,
      expiry: event.expiry,
      source: event.source,
      status: event.status,
      receiptPhotoId: event.receiptPhotoId || null,
      receiptMatched: Boolean(event.receiptMatched),
      systemMatchSucceeded: event.systemMatchSucceeded !== false,
      createdSequence: state.nextScanSequence++,
      codes: [],
      expectedCodes: []
    };
    receiveItems.push(item);
  }
  if (event.systemMatchSucceeded === false) item.systemMatchSucceeded = false;
  item.expectedCodes ||= [];
  if (!item.codes.includes(event.code)) {
    item.codes.push(event.code);
    if (event.expected !== false && !item.expectedCodes.includes(event.code)) {
      item.expectedCodes.push(event.code);
    }
    item.lastScannedSequence = state.nextScanSequence++;
  }
  return item;
}

function prioritizeScannedItems(scannedItems) {
  const uniqueItems = [];
  scannedItems.forEach((item) => {
    if (!uniqueItems.some((current) => current.id === item.id)) uniqueItems.push(item);
  });
  uniqueItems.forEach((item) => {
    const index = receiveItems.findIndex((batch) => batch.id === item.id);
    if (index >= 0) receiveItems.splice(index, 1);
  });
  // The newest recognition is the visual lead: it reaches the top first while prior rows are pushed down.
  receiveItems.unshift(...uniqueItems.slice().reverse());
}

function processMockScanBatch(events) {
  const beforeCounts = getProgressCountsSnapshot();
  const inboundEvents = events.filter((event) => isInboundTraceCode(event.code));
  const existingCodes = new Set(receiveItems.flatMap((item) => item.codes));
  const uniqueBatchCodes = new Set();
  const duplicateEvents = events.filter((event) => {
    if (existingCodes.has(event.code) || uniqueBatchCodes.has(event.code)) return true;
    uniqueBatchCodes.add(event.code);
    return false;
  });
  const validEvents = events.filter((event) => (
    !isInboundTraceCode(event.code)
    && !duplicateEvents.includes(event)
  ));
  const scannableEvents = validEvents;
  if (inboundEvents.length) {
    showToast("无法录入已入库追溯码");
  } else if (duplicateEvents.length) {
    showToast("追溯码重复");
  }
  if (!scannableEvents.length) {
    state.hitBatchId = null;
    state.hitTraceCode = null;
    state.currentScanCodes = [];
    document.getElementById("scanPulse")?.classList.add("hidden");
    renderReceiveItems();
    return;
  }
  const previousRects = getBatchRowRects();
  const scannedItems = scannableEvents.map(upsertScannedEvent);
  prioritizeScannedItems(scannedItems);
  syncSmartApprovalDecisions();
  syncCurrentTaskProgress({ touch: true });
  markProgressIncreases(beforeCounts, ["pending", "ready"]);
  const lastEvent = scannableEvents[scannableEvents.length - 1];
  const lastItem = scannedItems[scannedItems.length - 1];

  state.hitBatchId = lastItem.id;
  state.hitTraceCode = lastEvent.code;
  state.currentScanCodes = scannableEvents.map((event) => event.code);
  state.scanReview = null;
  state.expandedBatchIds.clear();
  window.clearTimeout(state.hitTimer);
  window.clearTimeout(state.hitCodeTimer);
  document.getElementById("lastTraceCode").textContent = state.currentScanCodes.join("、");
  const pulse = document.getElementById("scanPulse");
  pulse.classList.remove("hidden", "pulse-on");
  void pulse.offsetWidth;
  pulse.classList.add("pulse-on");
  renderReceiveItemsWithTransition(previousRects);

  const list = document.getElementById("receiveList");
  list?.scrollTo({ top: 0, behavior: "smooth" });
  state.hitCodeTimer = window.setTimeout(() => {
    state.hitTraceCode = null;
    document.querySelectorAll(".trace-code-hit").forEach((code) => {
      code.classList.remove("trace-code-hit");
    });
  }, 1000);
  state.hitTimer = window.setTimeout(() => {
    state.hitBatchId = null;
    pulse.classList.add("hidden");
    document.querySelectorAll(".batch-row.just-hit").forEach((row) => {
      row.classList.remove("just-hit", "batch-rush-top");
    });
  }, 2000);
}

document.getElementById("mockScan").addEventListener("click", () => {
  if (guardTaskMutation() || state.operationBusy) return;
  const events = buildMockScanBatch();
  setOperationBusy(true, "正在识别追溯码", "正在完成匹配与智能核准");
  window.clearTimeout(state.operationTimer);
  state.operationTimer = window.setTimeout(() => {
    setOperationBusy(false);
    processMockScanBatch(events);
  }, 560);
});

document.getElementById("approveBtn")?.addEventListener("click", () => {
  if (guardTaskMutation()) return;
  const selectedCount = getLinesByDecision("selected").length;
  if (!selectedCount) return;
  const beforeCounts = getProgressCountsSnapshot();
  getLinesByDecision("selected").forEach(({ line }) => state.inboundCompletedLineIds.add(line.id));
  syncCurrentTaskProgress({ touch: true });
  markProgressIncreases(beforeCounts, ["inbound"]);
  renderInboundProgress();
  showToast(`已提交 ${selectedCount} 条选择入库明细`);
});

renderPhotos();
renderOrders();
renderCodes();
setStep("photo");
renderTaskHome();
showTaskHome();
