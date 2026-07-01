const state = {
  currentStep: "photo",
  photos: [],
  orderKeyword: "",
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
  bucketDetailLineId: null,
  currentApproveLineId: null,
  approveDecisions: {},
  confirmedPendingLineIds: new Set(),
  inboundCompletedLineIds: new Set(),
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
  },
  {
    id: "batch-unmatched-trace",
    name: "没有找到商品信息",
    spec: "供应商未上传码上放心商品资料",
    approval: "-",
    batch: "-",
    expiry: "-",
    source: "码上放心未返回商品资料",
    status: "unknown",
    code: "81990026061500000901",
    unmatched: true
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
  renderInboundProgress();
}

function addPhoto(source) {
  const beforeCounts = getProgressCountsSnapshot();
  const nextIndex = state.photos.length + 1;
  state.photos.push({
    id: Date.now() + nextIndex,
    title: source === "camera" ? `拍摄票据 ${nextIndex}` : `相册票据 ${nextIndex}`,
    image: "assets/img/随货同行单.png"
  });
  markProgressIncreases(beforeCounts, ["uninspected"]);
  renderPhotos();
  showToast(source === "camera" ? "拍摄成功" : "上传成功");
}

function renderPhotos() {
  const grid = document.getElementById("photoGrid");
  const count = state.photos.length;
  document.getElementById("photoCount").textContent = `已拍票据：${count}张`;
  const photoDone = document.getElementById("photoDone");
  if (photoDone) photoDone.disabled = count === 0;
  renderInboundProgress();

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
  if (scanCount) syncSmartApprovalDecisions();
  state.scanCount = scanCount;
  const scanCountEl = document.getElementById("scanCount");
  const receiveList = document.getElementById("receiveList");
  if (!scanCountEl || !receiveList) return;

  const scanPage = document.getElementById("scanPage");
  scanPage?.classList.toggle("has-expanded-batch", state.expandedBatchIds.size > 0);

  scanCountEl.textContent = `已录入 ${scanCount} 码`;
  const visibleItems = receiveItems.filter((item) => itemMatchesKeyword(item, state.scanKeyword));
  receiveList.innerHTML = visibleItems.map((item) => {
    const currentCodes = item.codes.filter((code) => state.currentScanCodes.includes(code));
    const isDamaged = state.damagedBatchIds.has(item.id);
    const isUnmatched = item.unmatched || item.id === "batch-unmatched-trace";
    const approvalState = getScanSystemApprovalState(item);
    return `
    <article class="batch-row ${item.status} ${approvalState.className} ${currentCodes.length ? "has-current-code" : ""} ${isUnmatched ? "unmatched" : ""} ${isDamaged ? "damaged" : ""} ${item.id === state.hitBatchId ? "just-hit" : ""}" data-batch-id="${item.id}" style="view-transition-name: ${item.id};">
      <div>
        <div class="batch-title">
          <strong>${item.name}</strong>
          <span>${item.spec}</span>
          <mark class="batch-approval-mark">${approvalState.label}</mark>
        </div>
        <div class="batch-meta">
          ${isUnmatched ? `
            <span>没有找到商品信息</span>
            <span>待供应商补传</span>
          ` : `
            <span>${item.approval}</span>
            <span>批号 ${item.batch}</span>
            <span>效期 ${item.expiry}</span>
          `}
        </div>
        ${currentCodes.length ? `
        <div class="trace-current">
          <span>本次录入</span>
          <div>
            ${currentCodes.map((code) => `
              <strong class="${code === state.hitTraceCode ? "trace-code-hit" : ""}">
                <em>${code}</em>
                <button data-remove-code="${code}" data-batch-id="${item.id}" aria-label="删除追溯码${code}">×</button>
              </strong>
            `).join("")}
          </div>
        </div>
        ` : ""}
        <div class="trace-codes">
          ${item.codes.slice(-3).map((code) => `
            <span class="${code === state.hitTraceCode ? "trace-code-hit" : ""}">
              <em>${code}</em>
              <button data-remove-code="${code}" data-batch-id="${item.id}" aria-label="删除追溯码${code}">×</button>
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
  document.querySelectorAll("[data-damage-toggle]").forEach((input) => {
    input.addEventListener("change", () => {
      const id = input.dataset.damageToggle;
      if (input.checked) {
        state.damagedBatchIds.add(id);
      } else {
        state.damagedBatchIds.delete(id);
      }
      syncSmartApprovalDecisions();
      renderReceiveItems();
    });
  });
  document.querySelectorAll("[data-remove-code]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      removeTraceCode(button.dataset.batchId, button.dataset.removeCode);
    });
  });
  renderScanReviewPanel();
  renderInboundProgress();
}

function removeTraceCode(batchId, code) {
  const item = receiveItems.find((batch) => batch.id === batchId);
  if (!item) return;
  item.codes = item.codes.filter((current) => current !== code);
  state.currentScanCodes = state.currentScanCodes.filter((current) => current !== code);
  if (!item.codes.length) {
    const index = receiveItems.findIndex((batch) => batch.id === batchId);
    if (index >= 0) receiveItems.splice(index, 1);
    state.expandedBatchIds.delete(batchId);
    state.damagedBatchIds.delete(batchId);
  }
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
  const modal = ensureApprovalModal();
  modal.innerHTML = `
    <div class="approval-modal-backdrop" data-modal-close></div>
    <section class="approval-modal-sheet">
      <button class="modal-close" data-modal-close aria-label="关闭">×</button>
      <header class="modal-head"><strong>追溯码${item.codes.length}</strong><span>${item.name}</span></header>
      <div class="modal-code-list readonly">
        ${item.codes.map((code) => `
          <label>
            <input value="${code}" readonly />
            <button data-remove-code="${code}" data-batch-id="${item.id}">删除</button>
          </label>
        `).join("")}
      </div>
    </section>
  `;
  modal.classList.remove("hidden");
  modal.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", closeApprovalModal);
  });
  modal.querySelectorAll("[data-remove-code]").forEach((button) => {
    button.addEventListener("click", () => {
      removeTraceCode(button.dataset.batchId, button.dataset.removeCode);
      openScanTraceModal(batchId);
    });
  });
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

function getBaseApproveLineEntries() {
  const realEntries = approveOrders.flatMap((order) => order.lines.map((line) => ({ order, line })));
  return realEntries;
}

function getApproveLineEntries() {
  const realEntries = getBaseApproveLineEntries();
  const scannedEntries = receiveItems.flatMap((item) => (
    item.codes.map((code, codeIndex) => {
      const template = realEntries.find(({ line }) => line.name === item.name && line.batch === item.batch)
        || realEntries.find(({ line }) => line.status !== "ok")
        || realEntries[0];
      const order = {
        ...template.order,
        id: template.order.id || `验货扫码-${String(codeIndex + 1).padStart(2, "0")}`
      };
      const line = {
        ...template.line,
        id: `ap-scan-${code}`,
        name: item.name,
        spec: item.spec,
        approval: item.approval,
        batch: item.batch,
        expiry: item.expiry,
        qty: 1,
        status: item.status === "ok" && !item.unmatched ? "ok" : "warn",
        issue: item.status === "ok" && !item.unmatched ? "" : item.source,
        traceCode: code,
        receipt: { ...template.line.receipt, name: item.name, spec: item.spec, batch: item.batch, qty: 1 },
        trace: { ...template.line.trace, name: item.name, spec: item.spec, batch: item.batch, qty: 1 },
        system: { ...template.line.system, name: item.name, spec: item.spec, batch: item.batch, qty: item.status === "ok" ? 1 : 2 },
        abnormalFields: item.status === "ok" && !item.unmatched ? [] : (template.line.abnormalFields?.length ? template.line.abnormalFields : ["qty"])
      };
      return { order, line };
    })
  ));
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
  getApproveLineEntries().forEach(({ line }) => {
    if (!line.id.startsWith("ap-demo-") && !state.approveDecisions[line.id]) {
      state.approveDecisions[line.id] = "pending";
    }
  });
  syncSmartApprovalDecisions();

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
    if (!state.approveDecisions[line.id] && hasReceivedLine(line)) {
      state.approveDecisions[line.id] = "pending";
    }
    if (!isSmartConsistentLine(line)) return;
    if (!state.approveDecisions[line.id] && !hasReceivedLine(line)) return;
    state.approveDecisions[line.id] = isLineDamaged(line) ? "pending" : "selected";
  });
}

function findApproveLineForReceiveItem(item) {
  return getApproveLineEntries().find(({ line }) => (
    line.name === item.name &&
    line.batch === item.batch
  ))?.line || null;
}

function getScanSystemApprovalState(item) {
  const isDamaged = state.damagedBatchIds.has(item.id);
  const isUnmatched = item.unmatched || item.id === "batch-unmatched-trace";
  const line = findApproveLineForReceiveItem(item);
  const noNeedApproval = line && isSmartConsistentLine(line) && !isDamaged && !isUnmatched;
  return noNeedApproval
    ? { className: "approval-ok", label: "无需核准" }
    : { className: "approval-pending", label: "待核准" };
}

function hasReceivedLine(line) {
  return receiveItems.some((item) => (
    item.codes.length &&
    item.name === line.name &&
    item.batch === line.batch
  ));
}

function getReceiptUninspectedGroups() {
  if (!state.photos.length) return [];
  const matchedCounts = new Map();
  receiveItems
    .filter((item) => item.codes.length)
    .forEach((item) => {
      const key = `${item.name}__${item.batch}`;
      matchedCounts.set(key, (matchedCounts.get(key) || 0) + 1);
    });

  const baseLines = orders.flatMap((order) => order.lines.map((line, lineIndex) => ({
    order,
    line,
    lineIndex
  })));

  return state.photos.map((photo, photoIndex) => {
    const lines = baseLines.map(({ order, line, lineIndex }) => ({
      id: `receipt-${photo.id}-${order.id}-${lineIndex}`,
      orderId: order.id,
      receiptId: `receipt-photo-${photoIndex + 1}`,
      lineNo: lineIndex + 1,
      supplier: order.supplier,
      name: line.name,
      spec: line.spec,
      maker: order.supplier,
      qty: line.qty,
      batch: line.batch,
      price: line.price,
      amount: (Number(line.qty) * Number(line.price || 0)).toFixed(2),
      status: line.status
    })).filter((line) => {
      const key = `${line.name}__${line.batch}`;
      const matched = matchedCounts.get(key) || 0;
      if (matched <= 0) return true;
      matchedCounts.set(key, matched - 1);
      return false;
    }).map((line, index) => ({ ...line, lineNo: index + 1 }));

    return {
      id: `receipt-photo-${photoIndex + 1}`,
      title: photo.title || `随货同行单 ${photoIndex + 1}`,
      image: photo.image || "assets/img/随货同行单.png",
      supplier: lines[0]?.supplier || "广东壹号药业有限公司",
      lineCount: lines.length,
      lines
    };
  }).filter((receipt) => receipt.lines.length);
}

function getProgressCountsSnapshot() {
  const groups = getProgressGroups();
  return Object.fromEntries(
    ["uninspected", "pending", "ready", "inbound"].map((key) => [key, groups[key]?.items.length || 0])
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
      description: "已经提交入库的清单",
      icon: "assets/icons/progress-inbound.svg",
      items: []
    },
    ready: {
      key: "ready",
      label: "准入库",
      bubble: "个商品待入库",
      description: "核准通过准备入库的清单",
      icon: "assets/icons/progress-ready.svg",
      items: []
    },
    pending: {
      key: "pending",
      label: "待核准",
      bubble: "个商品待核准",
      description: "验货后发现可能存在异常",
      icon: "assets/icons/progress-pending.svg",
      items: []
    },
    uninspected: {
      key: "uninspected",
      label: "待验货",
      bubble: "个商品未验货",
      description: "拍了单但是没有匹配到验货数据",
      icon: "assets/icons/progress-uninspected.svg",
      items: [],
      receipts: []
    }
  };

  if (!state.photos.length) {
    return groups;
  }

  const hasInspection = receiveItems.some((item) => item.codes.length);
  const includeApprovalDemo = hasInspection && (state.currentStep === "approve" || state.approveReady);

  if (!hasInspection && !includeApprovalDemo && !state.inboundCompletedLineIds.size) {
    groups.uninspected.receipts = getReceiptUninspectedGroups();
    groups.uninspected.items = groups.uninspected.receipts.flatMap((receipt) => (
      receipt.lines.map((line) => ({ receipt, line }))
    ));
    return groups;
  }

  if (hasInspection && !includeApprovalDemo) {
    getApproveLineEntries().forEach((entry) => {
      const decision = state.approveDecisions[entry.line.id]
        || (isSmartConsistentLine(entry.line) ? "selected" : "pending");
      const target = decision === "selected" ? groups.ready : groups.pending;
      target.items.push(entry);
    });
    groups.uninspected.receipts = getReceiptUninspectedGroups();
    groups.uninspected.items = groups.uninspected.receipts.flatMap((receipt) => (
      receipt.lines.map((line) => ({ receipt, line }))
    ));
    return groups;
  }

  const progressEntries = getApproveLineEntries().filter(({ line }) => (
    includeApprovalDemo || hasReceivedLine(line) || state.inboundCompletedLineIds.has(line.id)
  ));

  progressEntries.forEach(({ order, line }) => {
    const entry = { order, line };
    const decision = state.approveDecisions[line.id]
      || (isSmartConsistentLine(line) && hasReceivedLine(line) ? "selected" : "pending");
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
  groups.uninspected.items = groups.uninspected.receipts.flatMap((receipt) => (
    receipt.lines.map((line) => ({ receipt, line }))
  ));

  return groups;
}

function renderInboundProgress() {
  const footers = document.querySelectorAll("[data-progress-footer]");
  if (!footers.length) return;
  const groups = getProgressGroups();
  const orderedGroups = [groups.uninspected, groups.pending, groups.ready, groups.inbound];
  const totalCount = orderedGroups.reduce((total, group) => total + group.items.length, 0) || 1;
  const impactKeys = new Set(state.progressImpactKeys);
  const cardHtml = orderedGroups.map((group) => {
    const isImpact = impactKeys.has(group.key);
    return `
    <button class="progress-bubble ${group.key} ${isImpact ? "bucket-impact" : ""}" data-progress-open="${group.key}" aria-label="查看${group.label}商品">
      <span class="progress-icon-shell" aria-hidden="true">
        <img class="progress-icon" src="${group.icon}" alt="" />
      </span>
      <span class="progress-copy">
        <b>${group.items.length}</b>
        <em>${group.label}</em>
      </span>
    </button>
  `;
  }).join("");
  const trackHtml = orderedGroups.map((group) => {
    const width = (group.items.length / totalCount) * 100;
    const chargeClass = group.key === "ready" || group.key === "inbound" ? "charge-left" : "charge-right";
    return `<button class="progress-segment ${group.key} ${chargeClass} ${group.items.length ? "" : "empty"} ${impactKeys.has(group.key) ? "charging" : ""}" style="--segment-width:${width}%" data-progress-open="${group.key}" aria-label="查看${group.label}商品"></button>`;
  }).join("");
  const dropletHtml = Array.from({ length: 14 }, (_, index) => `<i style="--drop-index:${index}"></i>`).join("");

  footers.forEach((footer) => {
    const isApproveFooter = footer.closest("#approvePage");
    const showApprovalPrompts = Boolean(isApproveFooter && state.currentStep === "approve" && state.approveReady && state.approveView === "workbench");
    const canDropApproval = Boolean(showApprovalPrompts && getCurrentApproveEntry());
    isApproveFooter?.classList.toggle("approval-bubbles-visible", showApprovalPrompts);
    footer.innerHTML = `
      ${showApprovalPrompts ? `
        <div class="approval-drop-prompts ${canDropApproval ? "" : "disabled"}" aria-label="核准快捷动作">
          <button class="approve-drop-cta pending" data-approve-drop="pending" ${canDropApproval ? "" : "disabled"}>
            <span class="cta-icon pending-icon" aria-hidden="true">
              <img class="pending-gloss" src="assets/icons/approval-bubble-pending-gloss.svg" alt="" />
              <b>?</b>
            </span>
            <span class="cta-copy">
              <strong class="cta-badge">核准待定</strong>
              <em>留在待核准栏，随后回头再核</em>
            </span>
            <span class="bubble-drops" aria-hidden="true">${dropletHtml}</span>
          </button>
          <button class="approve-drop-cta ready" data-approve-drop="selected" ${canDropApproval ? "" : "disabled"}>
            <span class="cta-icon ready-icon" aria-hidden="true">
              <b></b>
            </span>
            <span class="cta-copy">
              <strong class="cta-badge">核准完毕</strong>
              <em>放入准入库栏，随后批量入库</em>
            </span>
            <span class="bubble-drops" aria-hidden="true">${dropletHtml}</span>
          </button>
        </div>
      ` : ""}
      <div class="progress-card">
        <div class="progress-bubbles">${cardHtml}</div>
        <div class="progress-rail" aria-hidden="true">
          <div class="progress-track">${trackHtml}</div>
        </div>
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
  document.querySelectorAll("[data-approve-drop]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.closest(".approval-drop-prompts")?.classList.contains("bursting")) return;
      playApprovalBubbleBurst(button);
      window.setTimeout(() => decideCurrentApproveLine(button.dataset.approveDrop), 120);
    });
  });
}

function openProgressDetail(key) {
  if (!getProgressGroups()[key]) return;
  state.activeBucket = key;
  state.bucketDetailLineId = null;
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
  return getLinesByDecision("pending").filter(({ line }) => !state.confirmedPendingLineIds.has(line.id));
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

function getApprovalQueueItemRects() {
  return new Map(Array.from(document.querySelectorAll("#approvalQueue .queue-item")).map((item) => [
    item.dataset.queueLineId,
    item.getBoundingClientRect()
  ]));
}

function animateApprovalQueueShift(previousRects) {
  if (!previousRects?.size) return;
  document.querySelectorAll("#approvalQueue .queue-item").forEach((item) => {
    const previous = previousRects.get(item.dataset.queueLineId);
    if (!previous) return;
    const next = item.getBoundingClientRect();
    const deltaX = previous.left - next.left;
    const deltaY = previous.top - next.top;
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
          ${renderReceiptHitPreview(review, line)}
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
            <button data-approval-modal="purchase" data-line-id="${line.id}">采购单商品匹配错了，换一个</button>
            <button data-approval-modal="receipt" data-line-id="${line.id}">随货单商品匹配错了，换一个</button>
          </div>
        </div>
        ${renderApprovalCompareTable(review, line)}
      </section>

      <section class="meituan-bottom-card">
        ${renderMeituanApprovalBlock(review.meituan, line)}
      </section>
    </div>
  `;
}

function renderReceiptHitPreview(review, line) {
  return `
    <section class="receipt-hit-card">
      <button class="receipt-hit-zoom" data-approval-modal="receiptImage" data-line-id="${line.id}" aria-label="查看随货单命中行">
        <img src="${review.receiptImage}" alt="随货单命中行" />
      </button>
    </section>
  `;
}

function renderApprovalCompareTable(review, line, options = {}) {
  const rows = getApprovalCompareRows(review, line);
  return `
    <div class="approval-compare-table ${options.purchasePickerOpen ? "purchase-picking" : ""} ${options.receiptPickerOpen ? "receipt-picking" : ""}">
      <div class="compare-cell compare-corner"></div>
      <div class="compare-cell compare-head">实物商品资料</div>
      <div class="compare-cell compare-head">采购单商品资料</div>
      <div class="compare-cell compare-head">随货单商品资料</div>
      ${rows.map((row, index) => `
        ${row.toggle ? `
          <button class="compare-normal-toggle" data-normal-toggle>
            ${state.approvalNormalExpanded ? "收起全部字段" : "展开全部字段"}
          </button>
        ` : `
        <div class="compare-cell compare-field ${row.abnormal ? "abnormal" : ""}">
          <span>${row.label}</span>
        </div>
        ${renderCompareValueCell(row, "physical", review.physical)}
        ${options.purchasePickerOpen ? (index === 0 ? renderCompareCandidateColumn("purchase", review.purchaseCandidates, line, rows.length) : "") : renderCompareValueCell(row, "purchase", review.purchase)}
        ${options.receiptPickerOpen ? (index === 0 ? renderCompareCandidateColumn("receipt", review.receiptCandidates, line, rows.length) : "") : renderCompareValueCell(row, "receipt", review.receipt)}
        `}
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

  const sortedRows = rows.sort((a, b) => Number(b.abnormal) - Number(a.abnormal));
  const abnormalRows = sortedRows.filter((row) => row.abnormal);
  if (state.approvalNormalExpanded) {
    const normalRows = sortedRows.filter((row) => !row.abnormal);
    return abnormalRows.concat({ toggle: true }, normalRows);
  }
  return abnormalRows.length
    ? abnormalRows.concat({ toggle: true })
    : [{ toggle: true }];
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
  const barcode = `69${String(meituan.approval).replace(/\D/g, "").padEnd(10, "0").slice(0, 10)}`;
  return `
    <div class="meituan-bottom-body">
      <div class="meituan-standard-copy">
        <b class="meituan-section-title">美团商品信息</b>
        <div class="meituan-title-line">
          <span>OTC</span>
          <strong>${meituan.saleName}</strong>
        </div>
        <dl class="meituan-fact-list">
          <div><dt>批准文号</dt><dd>国药准字 ${meituan.approval.replace(/^国药准字/, "")}</dd></div>
          <div><dt>条形码</dt><dd>${barcode}</dd></div>
          <div class="meituan-price-fact">
            <dt>折后价 / 原价</dt>
            <dd>
              <strong>￥${meituan.discountPrice}</strong>
              <span class="meituan-original-price">￥${meituan.originalPrice}</span>
              <em>24% OFF</em>
            </dd>
          </div>
          <div><dt>生产厂家</dt><dd>${meituan.manufacturer}</dd></div>
        </dl>
      </div>
      <div class="meituan-image-rail">
        ${meituan.images.slice(0, 6).map((image, index) => `
            <button class="meituan-gallery-item" data-approval-modal="gallery" data-line-id="${line.id}" data-gallery-index="${index}" aria-label="查看美团商品图${index + 1}">
              <img src="${image.src}" alt="美团商品图${index + 1}" />
              <em>${image.label}</em>
            </button>
          `).join("")}
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
      manufacturer: "华润三九惠州制药厂",
      discountPrice: "15.56",
      originalPrice: "20.44",
      images: Array.from({ length: 6 }, (_, index) => ({
        label: `${index + 1}/6`,
        src: "assets/img/美团商品图片.png"
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
      state.receiptCandidateIndex[button.dataset.lineId] = Number(button.dataset.receiptPickIndex) || 0;
      state.receiptPickerLineId = null;
      state.purchasePickerLineId = null;
      renderCurrentApprovalCardSmooth();
      showToast("已替换随货单匹配");
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
  modal.querySelectorAll("[data-purchase-pick-index]").forEach((button) => {
    button.addEventListener("click", () => {
      state.purchaseCandidateIndex[button.dataset.lineId] = Number(button.dataset.purchasePickIndex) || 0;
      closeApprovalModal();
      renderCurrentApprovalCardSmooth();
      showToast("已替换采购单匹配");
    });
  });
  modal.querySelectorAll("[data-receipt-pick-index]").forEach((button) => {
    button.addEventListener("click", () => {
      state.receiptCandidateIndex[button.dataset.lineId] = Number(button.dataset.receiptPickIndex) || 0;
      closeApprovalModal();
      renderCurrentApprovalCardSmooth();
      showToast("已替换随货单匹配");
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

function decideCurrentApproveLine(decision) {
  const current = getCurrentApproveEntry();
  if (!current || state.approveDecisions[current.line.id] !== "pending") return;

  const oldId = current.line.id;
  const previousQueueRects = getApprovalQueueItemRects();
  let decisionApplied = false;
  const applyDecision = () => {
    if (decisionApplied) return;
    decisionApplied = true;
    if (decision === "pending") state.confirmedPendingLineIds.add(oldId);
    state.approveDecisions[oldId] = decision;
    state.purchasePickerLineId = null;
    state.receiptPickerLineId = null;
    const nextPending = getActivePendingApprovalEntries().find(({ line }) => line.id !== oldId);
    state.currentApproveLineId = nextPending?.line.id || null;

    const workbench = document.getElementById("approveWorkbench");
    workbench?.classList.remove("swipe-next");
    void workbench?.offsetWidth;
    workbench?.classList.add("swipe-next");
    renderApproveWorkbench();
    animateApprovalQueueShift(previousQueueRects);
  };

  animateDecisionDrop(decision, () => {
    applyDecision();
    showToast(decision === "selected" ? "已放入准入库栏，自动切到下一条" : "已保留在待核准，自动切到下一条");
    triggerProgressBucketImpact(decision === "selected" ? "ready" : "pending");
  }, applyDecision);
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

function animateDecisionDrop(decision, onDone, onLift) {
  const currentButton = document.querySelector(".queue-item.current");
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
    renderUninspectedReceiptBucketList(bucket);
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

function submitReadyBucketToInbound() {
  const readyEntries = getProgressGroups().ready.items;
  if (!readyEntries.length) {
    showToast("准入库暂无可提交明细");
    return;
  }
  const beforeCounts = getProgressCountsSnapshot();
  readyEntries.forEach(({ line }) => state.inboundCompletedLineIds.add(line.id));
  markProgressIncreases(beforeCounts, ["inbound"]);
  initializeProgressPageExpansion("ready");
  renderApprovalBucketList();
  renderInboundProgress();
  showToast(`已提交 ${readyEntries.length} 条准入库明细`);
}

function renderUninspectedReceiptBucketList(bucket) {
  const receipts = getReceiptUninspectedGroups();
  if (receipts.length && !receipts.some((receipt) => state.expandedProgressOrderIds.has(receipt.id))) {
    state.expandedProgressOrderIds.add(receipts[0].id);
  }

  bucket.innerHTML = `
    <div class="bucket-head">
      <button class="detail-back" data-bucket-back="workbench">返回</button>
      <div>
        <h1>待验货</h1>
        <p>${receipts.reduce((sum, receipt) => sum + receipt.lines.length, 0)}行未被追溯码匹配 · 按随货单图片汇总</p>
      </div>
    </div>
    <div class="bucket-order-list progress-bucket-list receipt-bucket-list">
      ${receipts.length ? receipts.map((receipt) => `
        <article class="receipt-bucket-card ${state.expandedProgressOrderIds.has(receipt.id) ? "expanded" : ""}">
          <button class="receipt-summary-row" data-progress-order-toggle="${receipt.id}" aria-expanded="${state.expandedProgressOrderIds.has(receipt.id) ? "true" : "false"}">
            <img src="${receipt.image}" alt="${receipt.title}" />
            <div>
              <strong>${receipt.title}</strong>
              <span>供应商：${receipt.supplier}</span>
              <span>未验货行：${receipt.lineCount}行</span>
            </div>
            <em>${state.expandedProgressOrderIds.has(receipt.id) ? "收起" : "展开"}</em>
          </button>
          <div class="receipt-ocr-lines ${state.expandedProgressOrderIds.has(receipt.id) ? "expanded" : ""}">
            ${receipt.lines.map((line) => `
              <article class="receipt-ocr-row">
                <b>第${line.lineNo}行</b>
                <div>
                  <strong>${line.name}</strong>
                  <span>${line.spec}</span>
                </div>
                <p>
                  <span>厂家 ${line.maker}</span>
                  <span>数量 ${line.qty}</span>
                  <span>批次 ${line.batch}</span>
                  <span>单价 ${line.price}</span>
                  <span>金额 ${line.amount}</span>
                </p>
              </article>
            `).join("")}
          </div>
        </article>
      `).join("") : `<div class="approval-empty-card">没有待验货的随货单行</div>`}
    </div>
  `;

  bucket.querySelector("[data-bucket-back]")?.addEventListener("click", returnToApproveWorkbench);
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

document.getElementById("takePhoto").addEventListener("click", () => addPhoto("camera"));
document.getElementById("uploadPhoto").addEventListener("click", () => addPhoto("album"));

document.getElementById("clearPhotos").addEventListener("click", () => {
  state.photos = [];
  renderPhotos();
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
    [2, 4, 5],
    [3, 1],
    [0, 2, 4, 5],
    [1, 5]
  ];
  const group = groups[state.scanCursor % groups.length];
  const round = Math.floor(state.scanCursor / groups.length);
  state.scanCursor += 1;
  return group.map((eventIndex, index) => {
    const event = scanEvents[eventIndex];
    const suffix = String(round * 10 + index + 3).padStart(2, "0");
    return {
      ...event,
      code: event.code.replace(/\d{2}$/, suffix)
    };
  });
}

function upsertScannedEvent(event) {
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
      unmatched: event.unmatched,
      codes: []
    };
    receiveItems.push(item);
  }
  if (!item.codes.includes(event.code)) {
    item.codes.push(event.code);
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
  receiveItems.unshift(...uniqueItems);
}

document.getElementById("mockScan").addEventListener("click", () => {
  const beforeCounts = getProgressCountsSnapshot();
  const events = buildMockScanBatch();
  const previousRects = getBatchRowRects();
  const scannedItems = events.map(upsertScannedEvent);
  prioritizeScannedItems(scannedItems);
  syncSmartApprovalDecisions();
  markProgressIncreases(beforeCounts, ["pending", "ready"]);
  const lastEvent = events[events.length - 1];
  const lastItem = scannedItems[scannedItems.length - 1];

  state.hitBatchId = lastItem.id;
  state.hitTraceCode = lastEvent.code;
  state.currentScanCodes = events.map((event) => event.code);
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
      row.classList.remove("just-hit");
    });
  }, 2000);
});

document.getElementById("approveBtn")?.addEventListener("click", () => {
  const selectedCount = getLinesByDecision("selected").length;
  const beforeCounts = getProgressCountsSnapshot();
  getLinesByDecision("selected").forEach(({ line }) => state.inboundCompletedLineIds.add(line.id));
  markProgressIncreases(beforeCounts, ["inbound"]);
  renderInboundProgress();
  showToast(`已提交 ${selectedCount} 条选择入库明细`);
});

renderPhotos();
renderOrders();
renderCodes();
setStep("photo");
