const state = {
  currentStep: "photo",
  photos: [],
  orderKeyword: "",
  scanKeyword: "",
  approveKeyword: "",
  approveSearchOpen: false,
  scanReview: null,
  inboundOrderIds: ["CG260601141", "CG260601138"],
  detailOrderId: null,
  approveTimer: null,
  scanCount: 18,
  scanCursor: 0,
  hitBatchId: null,
  hitTraceCode: null,
  hitTimer: null,
  hitCodeTimer: null,
  expandedBatchIds: new Set(),
  approveReady: false,
  approveView: "workbench",
  activeBucket: "selected",
  bucketDetailLineId: null,
  currentApproveLineId: null,
  approveDecisions: {},
  purchasePickerLineId: null,
  purchaseCandidateIndex: {},
  receiptPickerLineId: null,
  receiptCandidateIndex: {},
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

const receiveItems = [
  {
    id: "batch-amox-a240516",
    name: "阿莫西林胶囊",
    spec: "0.25g*24粒",
    approval: "国药准字H44021987",
    batch: "A240516",
    expiry: "2027-09-28",
    source: "随货单VS实物",
    status: "ok",
    codes: ["81260024051600000123", "81260024051600000124"]
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
    codes: ["81260025010800000201"]
  }
];

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

const approveOrders = [
  {
    id: "CG10000001",
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
}

function addPhoto(source) {
  const nextIndex = state.photos.length + 1;
  state.photos.push({
    id: Date.now() + nextIndex,
    title: source === "camera" ? `拍摄票据 ${nextIndex}` : `相册票据 ${nextIndex}`,
    image: "assets/img/随货同行单.png"
  });
  renderPhotos();
  showToast(source === "camera" ? "拍摄成功" : "上传成功");
}

function renderPhotos() {
  const grid = document.getElementById("photoGrid");
  const count = state.photos.length;
  document.getElementById("photoCount").textContent = `已拍票据：${count}张`;
  document.getElementById("photoDone").disabled = count === 0;

  if (!count) {
    grid.innerHTML = `<div class="empty-thumb">票据照片会显示在这里</div>`;
    return;
  }

  grid.innerHTML = state.photos.map((photo, index) => `
    <div class="thumb" title="${photo.title}">
      <img src="${photo.image}" alt="${photo.title}" />
      <em>${index + 1}</em>
      <span>已拍票据</span>
      <button class="remove-thumb" data-id="${photo.id}" aria-label="删除票据">×</button>
    </div>
  `).join("");

  document.querySelectorAll(".remove-thumb").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = Number(button.dataset.id);
      state.photos = state.photos.filter((photo) => photo.id !== id);
      renderPhotos();
    });
  });
}

function renderCodes() {
  renderReceiveItems();
}

function itemMatchesKeyword(item, keyword) {
  if (!keyword) return true;
  const source = [
    item.name,
    item.spec,
    item.approval,
    item.batch,
    item.expiry,
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

  scanCountEl.textContent = `已录入 ${scanCount} 码`;
  const visibleItems = receiveItems.filter((item) => itemMatchesKeyword(item, state.scanKeyword));
  receiveList.innerHTML = visibleItems.map((item) => {
    const expanded = state.expandedBatchIds.has(item.id);
    return `
    <article class="batch-row ${item.status} ${item.id === state.hitBatchId ? "just-hit" : ""} ${expanded ? "expanded" : ""}" data-batch-id="${item.id}" style="view-transition-name: ${item.id};">
      <div>
        <div class="batch-title">
          <strong>${item.name}</strong>
          <span>${item.spec}</span>
        </div>
        <div class="batch-meta">
          <span>${item.approval}</span>
          <span>批号 ${item.batch}</span>
          <span>效期 ${item.expiry}</span>
        </div>
        <div class="trace-codes ${expanded ? "expanded" : ""}">
          ${item.codes.map((code) => `
            <span class="${code === state.hitTraceCode ? "trace-code-hit" : ""}">
              ${code}
              <button data-remove-code="${code}" data-batch-id="${item.id}" aria-label="删除追溯码${code}">×</button>
            </span>
          `).join("")}
        </div>
      </div>
      <button class="batch-count" data-id="${item.id}" aria-expanded="${expanded}" aria-label="${expanded ? "收起" : "展开"}${item.name}已录入追溯码">
        <span>追溯码</span>
        <b>${item.codes.length}</b>
        <i aria-hidden="true"></i>
      </button>
    </article>
  `;
  }).join("");

  document.querySelectorAll(".batch-count").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const shouldExpand = !state.expandedBatchIds.has(id);
      if (state.expandedBatchIds.has(id)) {
        state.expandedBatchIds.delete(id);
      } else {
        state.expandedBatchIds.add(id);
      }
      renderReceiveItems();
      if (shouldExpand) {
        scrollBatchCodesIntoView(id);
      }
    });
  });
  document.querySelectorAll("[data-remove-code]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      removeTraceCode(button.dataset.batchId, button.dataset.removeCode);
    });
  });
  renderScanReviewPanel();
}

function removeTraceCode(batchId, code) {
  const item = receiveItems.find((batch) => batch.id === batchId);
  if (!item) return;
  item.codes = item.codes.filter((current) => current !== code);
  if (!item.codes.length) {
    const index = receiveItems.findIndex((batch) => batch.id === batchId);
    if (index >= 0) receiveItems.splice(index, 1);
    state.expandedBatchIds.delete(batchId);
  }
  renderReceiveItems();
  showToast("已删除追溯码");
}

function renderScanReviewPanel() {
  const panel = document.getElementById("scanReviewPanel");
  if (!panel) return;
  if (!state.scanReview?.rows?.length) {
    panel.classList.add("hidden");
    panel.innerHTML = "";
    return;
  }
  panel.classList.remove("hidden");
  panel.innerHTML = `
    <div class="scan-review-head">
      <strong>${state.scanReview.name}</strong>
      <button data-scan-report>提报异常</button>
    </div>
    <div class="scan-review-table">
      <div class="scan-review-cell head">字段</div>
      <div class="scan-review-cell head">实物商品资料</div>
      <div class="scan-review-cell head">采购单商品资料</div>
      <div class="scan-review-cell head">美团标准</div>
      ${state.scanReview.rows.map((row) => `
        <div class="scan-review-cell field">${row.label}</div>
        <div class="scan-review-cell bad">${row.physical}</div>
        <div class="scan-review-cell">${row.purchase}</div>
        <div class="scan-review-cell">${row.meituan}</div>
      `).join("")}
    </div>
  `;
  panel.querySelector("[data-scan-report]")?.addEventListener("click", () => showToast("已提报验货异常"));
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
  if (event.id === "batch-cetirizine-z250210") {
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

function getApproveLineEntries() {
  const realEntries = approveOrders.flatMap((order) => order.lines.map((line) => ({ order, line })));
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
  getApproveLineEntries().forEach(({ line }) => {
    if (!state.approveDecisions[line.id]) {
      state.approveDecisions[line.id] = line.status === "ok" ? "selected" : "pending";
    }
  });

  const pending = getLinesByDecision("pending");
  if (!pending.some(({ line }) => line.id === state.currentApproveLineId)) {
    state.currentApproveLineId = pending[0]?.line.id || null;
  }
}

function getLinesByDecision(decision) {
  return getApproveLineEntries().filter(({ line }) => state.approveDecisions[line.id] === decision);
}

function getCurrentApproveEntry() {
  const pending = getLinesByDecision("pending");
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
}

function renderApprovalQueue() {
  const queue = document.getElementById("approvalQueue");
  if (!queue) return;

  const lines = getLinesByDecision("pending");
  const visibleLines = lines.filter(({ line }) => itemMatchesKeyword({
    ...line,
    codes: buildTraceCodes(line)
  }, state.approveKeyword));
  queue.innerHTML = `
    <div class="queue-title ${state.approveSearchOpen ? "search-open" : ""}">
      <span>待核准：${lines.length}</span>
      <button class="queue-search-toggle ${state.approveSearchOpen ? "open" : ""}" data-queue-search-toggle aria-label="${state.approveSearchOpen ? "收起搜索" : "展开搜索"}"></button>
      <input class="queue-search-input ${state.approveSearchOpen ? "" : "hidden"}" value="${state.approveKeyword}" placeholder="扫描追溯码或者输入商品信息" />
    </div>
    ${visibleLines.length ? visibleLines.map(({ line }) => `
    <button class="queue-item ${line.id === state.currentApproveLineId ? "current" : ""}" data-queue-line-id="${line.id}" aria-current="${line.id === state.currentApproveLineId ? "true" : "false"}">
      <strong title="${line.name}X${line.qty}">${line.name}X${line.qty}</strong>
    </button>
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
}

function renderCurrentApprovalCard() {
  const body = document.getElementById("approvalCurrentBody");
  const deferButton = document.getElementById("deferCurrentLine");
  const selectButton = document.getElementById("selectCurrentLine");
  if (!body || !deferButton || !selectButton) return;

  const entry = getCurrentApproveEntry();
  if (!entry) {
    body.innerHTML = `<div class="approval-empty-card">没有待核准明细</div>`;
    deferButton.disabled = true;
    selectButton.disabled = true;
    return;
  }

  const { order, line } = entry;
  const decision = state.approveDecisions[line.id];
  const canDecide = decision === "pending";
  deferButton.disabled = !canDecide;
  selectButton.disabled = !canDecide;

  body.innerHTML = renderApprovalEvidence(order, line);
  bindApprovalEvidenceActions();
}

function renderApprovalEvidence(order, line) {
  const review = getApprovalReviewModel(order, line);
  const traceTotal = Number(review.physical.qty) || line.qty || review.traceCodes.length;
  const purchasePickerOpen = state.purchasePickerLineId === line.id;
  const receiptPickerOpen = state.receiptPickerLineId === line.id;

  return `
    <div class="approval-rebuild">
      <section class="inbound-card">
        <div class="inbound-card-copy">
          <div class="inbound-order-head">
            <b>${review.purchase.orderId}</b>
            <strong>${review.purchase.supplier}</strong>
          </div>
          <div class="inbound-order-meta">
            <span>平台单号 ${order.id}</span>
            <span>采购状态 ${review.purchase.status}</span>
            <span>商品 ${review.physical.name}${review.physical.spec} * ${line.qty}</span>
          </div>
          <div class="inbound-entry-grid">
            <div>
              <span>追溯码录入</span>
              <strong>${traceTotal}/${traceTotal}</strong>
              <button data-approval-modal="trace" data-line-id="${line.id}">编辑追溯码</button>
            </div>
            <div>
              <span>入库批次 / 效期</span>
              <strong>${review.batchFinal} / ${review.physical.expiry}</strong>
              <button data-approval-modal="batch" data-line-id="${line.id}">编辑批次</button>
            </div>
          </div>
        </div>
        <button class="physical-report-button" data-approval-report="提报异常">提报异常</button>
        <div class="physical-watermark">入库</div>
      </section>

      <section class="approval-compare-table-card">
        <div class="approval-table-toolbar">
          <div>
            <b>三方数据对比</b>
          </div>
          <div class="approval-table-tools">
            <button data-purchase-toggle data-line-id="${line.id}">${purchasePickerOpen ? "收起采购单候选" : "更换采购单"}</button>
            <button data-receipt-toggle data-line-id="${line.id}">${receiptPickerOpen ? "收起随货单候选" : "更换随货单"}</button>
          </div>
        </div>
        ${renderApprovalCompareTable(review, line, { purchasePickerOpen, receiptPickerOpen })}
      </section>

      <section class="meituan-bottom-card">
        ${renderMeituanApprovalBlock(review.meituan, line)}
      </section>
    </div>
  `;
}

function renderApprovalCompareTable(review, line, options = {}) {
  const rows = getApprovalCompareRows(review, line);
  const physicalImage = review.physicalImage || "assets/img/追溯码扫描.jpg";
  const purchaseImage = review.meituan.images[0].src;
  const receiptImage = review.receiptImage || "assets/img/随货同行单.png";
  return `
    <div class="approval-compare-table ${options.purchasePickerOpen ? "purchase-picking" : ""} ${options.receiptPickerOpen ? "receipt-picking" : ""}">
      <div class="compare-cell compare-corner"></div>
      <div class="compare-cell compare-head compare-head-with-image">
        <span>实物商品资料</span>
        <img class="compare-head-img" src="${physicalImage}" alt="实物商品" onclick="showLightbox(this.src)" />
      </div>
      <div class="compare-cell compare-head compare-head-with-image">
        <span>采购单商品资料</span>
        <img class="compare-head-img" src="${purchaseImage}" alt="美团商品首图" onclick="showLightbox(this.src)" />
      </div>
      <div class="compare-cell compare-head compare-head-with-image">
        <span>随货单商品资料</span>
        <img class="compare-head-img" src="${receiptImage}" alt="随货同行单" onclick="showLightbox(this.src)" />
      </div>
      ${rows.map((row, index) => `
        <div class="compare-cell compare-field ${row.abnormal ? "abnormal" : ""}">${row.label}</div>
        ${renderCompareValueCell(row, "physical", review.physical)}
        ${options.purchasePickerOpen ? (index === 0 ? renderCompareCandidateColumn("purchase", review.purchaseCandidates, line, rows.length) : "") : renderCompareValueCell(row, "purchase", review.purchase)}
        ${options.receiptPickerOpen ? (index === 0 ? renderCompareCandidateColumn("receipt", review.receiptCandidates, line, rows.length) : "") : renderCompareValueCell(row, "receipt", review.receipt)}
      `).join("")}
    </div>
  `;
}

function getApprovalCompareRows(review, line) {
  const physical = buildApprovalCompareSource(review.physical, line, "physical", review);
  const purchase = buildApprovalCompareSource(review.purchase, line, "purchase", review);
  const receipt = buildApprovalCompareSource(review.receipt, line, "receipt", review);
  const rows = [
    ["name", "名称"],
    ["spec", "规格"],
    ["approval", "准字"],
    ["barcode", "条码"],
    ["manufacturer", "厂家"],
    ["prescription", "处方"],
    ["batch", "批号"],
    ["productionDate", "产期"],
    ["expiry", "效期"],
    ["qty", "数量"],
    ["supplier", "供应商"],
    ["amount", "金额"]
  ].map(([key, label]) => ({
    key,
    label,
    physical: physical[key],
    purchase: purchase[key],
    receipt: receipt[key],
    abnormal: line.abnormalFields.includes(key)
  }));

  return rows.sort((a, b) => Number(b.abnormal) - Number(a.abnormal));
}

function buildApprovalCompareSource(data, line, type, review) {
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
  const amount = type === "purchase"
    ? `￥${((Number(data.qty) || line.qty || 1) * 28.9).toFixed(2)}`
    : `￥${((Number(line.qty) || 1) * 28.9).toFixed(2)}`;
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
    supplier: type === "physical" ? "实物扫码" : review.purchase.supplier,
    amount
  };
}

function renderCompareValueCell(row, source, sourceData) {
  const value = row[source] ?? sourceData?.[row.key] ?? "";
  return `
    <div class="compare-cell compare-value compare-value-${source} ${row.abnormal ? "abnormal" : ""}">
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

function renderMeituanApprovalBlock(meituan, line) {
  return `
    <div class="meituan-bottom-body">
      <div class="meituan-standard-copy">
        <b>美团商品信息</b>
        <div><span>名称</span><strong>${meituan.saleName}</strong></div>
        <div><span>规格</span><strong>${meituan.spec}</strong></div>
        <div><span>准字</span><strong>${meituan.approval}</strong></div>
        <div><span>条码</span><strong>69${String(meituan.approval).replace(/\D/g, "").padEnd(10, "0").slice(0, 10)}</strong></div>
        <div><span>处方分类</span><strong>${line.name.includes("布洛芬") || line.name.includes("阿莫西林") ? "非处方药" : "处方药"}</strong></div>
      </div>
      <div class="meituan-image-rail">
        <button class="meituan-main-image" data-approval-modal="gallery" data-line-id="${line.id}" data-gallery-index="0" aria-label="查看美团商品主图">
          <img src="${meituan.images[0].src}" alt="美团商品主图" />
        </button>
        <div class="meituan-mini-gallery">
          ${meituan.images.slice(1, 3).map((image, index) => `
            <button data-approval-modal="gallery" data-line-id="${line.id}" data-gallery-index="${index + 1}" aria-label="查看美团商品图${index + 2}">
              <img src="${image.src}" alt="美团商品图${index + 2}" />
              <em>${image.label}</em>
            </button>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function getApprovalReviewModel(order, line) {
  const meituanName = line.abnormalFields.includes("name") ? line.trace.name : line.name;
  const purchaseCandidates = buildPurchaseCandidates(order, line);
  const selectedPurchaseIndex = state.purchaseCandidateIndex[line.id] ?? 0;
  const selectedPurchase = purchaseCandidates[selectedPurchaseIndex] || purchaseCandidates[0];
  const receiptCandidates = buildReceiptCandidates(line);
  const selectedReceiptIndex = state.receiptCandidateIndex[line.id] ?? 0;
  const selectedReceipt = receiptCandidates[selectedReceiptIndex] || receiptCandidates[0];
  return {
    physical: line.trace,
    physicalImage: "assets/img/追溯码扫描.jpg",
    purchase: {
      name: selectedPurchase.name,
      spec: selectedPurchase.spec,
      approval: selectedPurchase.approval,
      batch: selectedPurchase.batch,
      expiry: selectedPurchase.expiry,
      qty: selectedPurchase.qty,
      orderId: selectedPurchase.orderId,
      supplier: selectedPurchase.supplier,
      status: selectedPurchase.status
    },
    meituan: {
      name: meituanName,
      spec: line.spec,
      approval: line.approval,
      saleName: `${meituanName}${line.spec}`,
      images: Array.from({ length: 6 }, (_, index) => ({
        label: `${index + 1}/6`,
        src: "assets/img/追溯码扫描.jpg"
      }))
    },
    receipt: selectedReceipt.receipt,
    receiptPhoto: selectedReceipt.receiptPhoto,
    receiptImage: selectedReceipt.image,
    traceCodes: buildTraceCodes(line),
    batchFinal: line.trace.batch || line.receipt.batch || line.system.batch,
    purchaseCandidates,
    receiptCandidates
  };
}

function buildTraceCodes(line) {
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
  return [
    {
      receiptPhoto: `${line.receiptPhoto} · 当前命中`,
      name: line.receipt.name,
      spec: line.receipt.spec,
      batch: line.receipt.batch,
      score: "96%",
      image: "assets/img/拍单识别后框选识别行.png",
      receipt: { ...line.receipt }
    },
    {
      receiptPhoto: "拍摄票据 1 · 第 4 行",
      name: line.trace.name,
      spec: line.trace.spec,
      batch: line.trace.batch,
      score: "82%",
      image: "assets/img/拍单识别后框选识别行.png",
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
  document.querySelectorAll("[data-purchase-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const lineId = button.dataset.lineId;
      state.purchasePickerLineId = state.purchasePickerLineId === lineId ? null : lineId;
      state.receiptPickerLineId = null;
      renderCurrentApprovalCardSmooth();
    });
  });
  document.querySelectorAll("[data-purchase-pick-index]").forEach((button) => {
    button.addEventListener("click", () => {
      state.purchaseCandidateIndex[button.dataset.lineId] = Number(button.dataset.purchasePickIndex) || 0;
      state.purchasePickerLineId = null;
      state.receiptPickerLineId = null;
      renderCurrentApprovalCardSmooth();
      showToast("已更换采购单匹配");
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
      state.receiptCandidateIndex[button.dataset.lineId] = Number(button.dataset.receiptPickIndex) || 0;
      state.receiptPickerLineId = null;
      state.purchasePickerLineId = null;
      renderCurrentApprovalCardSmooth();
      showToast("已更换随货单匹配");
    });
  });
  document.querySelectorAll("[data-approval-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      openApprovalModal(button.dataset.approvalModal, button.dataset.lineId, button.dataset.galleryIndex);
    });
  });
  document.querySelectorAll("[data-approval-report]").forEach((button) => {
    button.addEventListener("click", () => showToast(`已标记：${button.dataset.approvalReport}`));
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

function openApprovalModal(type, lineId, galleryIndex = "0") {
  const entry = getApproveLineEntries().find(({ line }) => line.id === lineId) || getCurrentApproveEntry();
  if (!entry) return;
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
      closeApprovalModal();
      showToast(button.dataset.modalSave || "已保存");
    });
  });
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
      <header class="modal-head"><strong>更换采购单商品</strong><span>${line.name}</span></header>
      <div class="candidate-list">
        ${review.purchaseCandidates.map((item, index) => `
          <button class="${index === 0 ? "selected" : ""}" data-modal-save="已更换采购单匹配">
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
      <header class="modal-head"><strong>更换随货单匹配</strong><span>${line.receiptPhoto}</span></header>
      <div class="candidate-list receipt-candidates">
        ${review.receiptCandidates.map((item, index) => `
          <button class="${index === 0 ? "selected" : ""}" data-modal-save="已更换随货单匹配">
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

function decideCurrentApproveLine(decision) {
  const current = getCurrentApproveEntry();
  if (!current || state.approveDecisions[current.line.id] !== "pending") return;

  const oldId = current.line.id;
  animateDecisionDrop(decision, () => {
    state.approveDecisions[oldId] = decision;
    state.purchasePickerLineId = null;
    state.receiptPickerLineId = null;
    const nextPending = getLinesByDecision("pending").find(({ line }) => line.id !== oldId);
    state.currentApproveLineId = nextPending?.line.id || null;

    const workbench = document.getElementById("approveWorkbench");
    workbench?.classList.remove("swipe-next");
    void workbench?.offsetWidth;
    workbench?.classList.add("swipe-next");
    showToast(decision === "selected" ? "已加入选择入库，自动切到下一条" : "已暂不入库，自动切到下一条");
    renderApproveWorkbench();
  });
}

function animateDecisionDrop(decision, onDone) {
  const currentButton = document.querySelector(".queue-item.current");
  const from = currentButton?.getBoundingClientRect();
  const targetButton = document.getElementById(decision === "selected" ? "selectCurrentLine" : "deferCurrentLine");
  const to = targetButton?.getBoundingClientRect();
  const targetLane = targetButton?.closest(".decision-lane");
  const ghost = document.getElementById("decisionFlyGhost");
  if (!from || !to || !ghost || !targetButton) {
    onDone();
    return;
  }

  ghost.textContent = document.querySelector(".queue-item.current strong")?.textContent || "商品";
  const flyX = to.left + to.width / 2 - (from.left + from.width / 2);
  const flyY = to.top + to.height / 2 - (from.top + from.height / 2);
  ghost.style.left = `${from.left + from.width / 2 - 52}px`;
  ghost.style.top = `${from.top + from.height / 2 - 16}px`;
  ghost.style.setProperty("--fly-x", `${flyX}px`);
  ghost.style.setProperty("--fly-y", `${flyY}px`);
  ghost.style.setProperty("--fly-1x", `${flyX * 0.18}px`);
  ghost.style.setProperty("--fly-1y", `${Math.min(flyY * 0.08, 10) - 28}px`);
  ghost.style.setProperty("--fly-2x", `${flyX * 0.58}px`);
  ghost.style.setProperty("--fly-2y", `${flyY * 0.42 - 8}px`);
  ghost.style.setProperty("--fly-3x", `${flyX * 0.86}px`);
  ghost.style.setProperty("--fly-3y", `${flyY * 0.78}px`);
  ghost.style.setProperty("--fly-impact-y", `${flyY + 6}px`);
  ghost.classList.remove("hidden", "flying", "select", "defer");
  ghost.classList.add(decision === "selected" ? "select" : "defer");
  targetButton.classList.remove("jelly", "liquid-impact");
  targetLane?.classList.remove("splashing");
  currentButton?.classList.add("deciding");
  void ghost.offsetWidth;
  ghost.classList.add("flying");

  window.setTimeout(() => {
    targetButton.classList.add("jelly", "liquid-impact");
    targetLane?.classList.add("splashing");
  }, 560);

  window.setTimeout(() => {
    ghost.classList.add("hidden");
    onDone();
  }, 760);

  window.setTimeout(() => {
    targetButton.classList.remove("jelly", "liquid-impact");
    targetLane?.classList.remove("splashing");
  }, 1450);
}

function showApproveView(view) {
  state.approveView = view;
  document.getElementById("approveWorkbench")?.classList.toggle("hidden", view !== "workbench");
  document.getElementById("approveBucketList")?.classList.toggle("hidden", view !== "bucketList");
  document.getElementById("approveBucketDetail")?.classList.toggle("hidden", view !== "bucketDetail");
}

function openDecisionBucket(decision) {
  state.activeBucket = decision;
  showApproveView("bucketList");
  renderApprovalBucketList();
}

function renderApprovalBucketList() {
  const bucket = document.getElementById("approveBucketList");
  if (!bucket) return;
  const decision = state.activeBucket;
  const title = getDecisionLabel(decision);
  const filteredOrders = getGroupedOrdersByDecision(decision);

  bucket.innerHTML = `
    <div class="bucket-head">
      <button class="detail-back" data-bucket-back="workbench">返回</button>
      <div>
        <h1>${title}</h1>
        <p>${filteredOrders.reduce((sum, order) => sum + order.lines.length, 0)}个商品 · 按采购单汇总</p>
      </div>
    </div>
    <div class="bucket-order-list">
      ${filteredOrders.length ? filteredOrders.map((order) => `
        <article class="bucket-order-card">
          <div class="bucket-order-row">
            <div>
              <strong>${order.id}</strong>
              <span>${order.supplier}</span>
            </div>
            <time>${order.date}</time>
            <em>${order.status}</em>
          </div>
          <div class="bucket-lines">
            ${order.lines.map((line) => `
              <button class="bucket-line-row ${line.status}" data-bucket-detail="${line.id}">
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
              </button>
            `).join("")}
          </div>
        </article>
      `).join("") : `<div class="approval-empty-card">${title}为空</div>`}
    </div>
  `;

  bucket.querySelector("[data-bucket-back]")?.addEventListener("click", () => showApproveView("workbench"));
  bucket.querySelectorAll("[data-bucket-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      state.bucketDetailLineId = button.dataset.bucketDetail;
      showApproveView("bucketDetail");
      renderApprovalBucketDetail();
    });
  });
}

function getGroupedOrdersByDecision(decision) {
  const grouped = new Map();
  getApproveLineEntries().forEach(({ order, line }) => {
    if (state.approveDecisions[line.id] !== decision) return;
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
  const entry = getApproveLineEntries().find(({ line }) => line.id === state.bucketDetailLineId);
  if (!entry) return;
  detail.innerHTML = `
    <div class="bucket-head">
      <button class="detail-back" data-bucket-list-back>返回</button>
      <div>
        <h1>${entry.line.name}</h1>
        <p>${entry.order.id} · ${entry.order.supplier}</p>
      </div>
    </div>
    <div class="bucket-detail-body">
      ${renderApprovalEvidence(entry.order, entry.line)}
    </div>
  `;
  bindApprovalEvidenceActions();
  detail.querySelector("[data-bucket-list-back]")?.addEventListener("click", () => {
    showApproveView("bucketList");
    renderApprovalBucketList();
  });
}

function getDecisionLabel(decision) {
  return {
    pending: "待核准",
    deferred: "暂不入库",
    selected: "选择入库"
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

document.getElementById("takePhoto").addEventListener("click", () => addPhoto("camera"));
document.getElementById("uploadPhoto").addEventListener("click", () => addPhoto("album"));

document.getElementById("clearPhotos").addEventListener("click", () => {
  state.photos = [];
  renderPhotos();
});

document.getElementById("photoDone").addEventListener("click", () => {
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
    showApproveView("workbench");
    return;
  }
  setStep("scan");
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
    setStep(target);
  });
});

document.getElementById("mockScan").addEventListener("click", () => {
  const event = scanEvents[state.scanCursor % scanEvents.length];
  state.scanCursor += 1;
  const previousRects = getBatchRowRects();
  let item = receiveItems.find((batch) => batch.id === event.id);

  if (!item) {
    item = {
      id: event.id,
      name: event.name,
      spec: event.spec,
      approval: event.approval,
      batch: event.batch,
      expiry: event.expiry,
      source: event.source,
      status: event.status,
      codes: []
    };
    receiveItems.unshift(item);
  }

  if (!item.codes.includes(event.code)) {
    item.codes.push(event.code);
  }

  const currentIndex = receiveItems.findIndex((batch) => batch.id === item.id);
  if (currentIndex > 0) {
    receiveItems.splice(currentIndex, 1);
    receiveItems.unshift(item);
  }

  state.hitBatchId = item.id;
  state.hitTraceCode = event.code;
  state.scanReview = buildScanReview(event);
  state.expandedBatchIds.clear();
  state.expandedBatchIds.add(item.id);
  window.clearTimeout(state.hitTimer);
  window.clearTimeout(state.hitCodeTimer);
  document.getElementById("lastTraceCode").textContent = event.code;
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
      row.classList.remove("just-hit");
    });
  }, 2000);
});

document.getElementById("approveBtn").addEventListener("click", () => {
  const selectedCount = getLinesByDecision("selected").length;
  showToast(`已提交 ${selectedCount} 条选择入库明细`);
});

renderPhotos();
renderOrders();
renderCodes();
setStep("photo");
