(() => {
  const WIDTH = 1366;
  const HEIGHT = 765;
  const FRAME_IDS = ["783_20705","783_20214","783_18987","783_18643","783_18305","783_18037","783_17921","783_17873","783_17844","783_17822","783_17730","783_17644","783_16867","783_16817","783_16767","783_15578","783_15476","783_15044","783_14682","783_14519","783_14372"];
  const MAIN_FRAME_IDS = new Set(["783_20705","783_20214","783_18987","783_18643","783_18305","783_18037","783_16867","783_15578","783_15044","783_14682","783_14519","783_14372"]);
  const MODALS = {"783_16767":[580,356],"783_16817":[580,348],"783_15476":[580,284],"783_17921":[580,284],"783_17873":[488,458],"783_17844":[544,532],"783_17822":[574,421],"783_17730":[574,610],"783_17644":[574,606]};
  const STATUS_PAGES = ["783_18037","783_18305","783_20214","783_18987"];
  const MAIN_FLOW = new Set(["783_14372","783_14519","783_14682","783_15044","783_16867"]);
  const PRODUCTS = [
    ["布洛芬缓释胶囊", "0.3g*20粒", "国药准字H20013062", "B250301", "2027-03-30", "中美天津史克制药有限公司"],
    ["连花清瘟颗粒", "6g*10袋", "国药准字Z20040063", "L250108", "2027-11-30", "石家庄以岭药业股份有限公司"],
    ["盐酸左西替利嗪片", "5mg*12片", "国药准字H20040249", "Z250210", "2027-02-10", "重庆华邦制药有限公司"],
    ["阿莫西林胶囊", "0.25g*24粒", "国药准字H44021987", "A240516", "2027-09-28", "广州白云山制药股份有限公司"],
    ["蒲地蓝消炎口服液", "10ml*6支/盒", "国药准字Z20030095", "P250214", "2027-08-14", "济川药业集团有限公司"],
    ["复方氨酚烷胺片", "12片", "国药准字H22026193", "F250106", "2027-06-30", "吉林省吴太感康药业有限公司"],
    ["蒙脱石散", "3g*10袋", "国药准字H20000690", "M250228", "2027-12-31", "博福-益普生制药有限公司"],
    ["奥美拉唑肠溶胶囊", "20mg*14粒", "国药准字H20033444", "O250315", "2028-03-14", "山东罗欣药业集团股份有限公司"]
  ];
  // Local fixtures stand in for code-detail package_level and the existing YOS split API.
  // A parent package code is never stored as an inbound trace code.
  const PACKAGE_FIXTURES = {
    "62034803834789840000": { level: 3, product: PRODUCTS[0], children: Array.from({ length: 10 }, (_, index) => `6203480383478984${String(index + 100).padStart(4, "0")}`) },
    "62034803834789850000": { level: 2, product: PRODUCTS[1], children: Array.from({ length: 4 }, (_, index) => `6203480383478985${String(index + 100).padStart(4, "0")}`) },
    "62034803834789890000": { level: 3, product: PRODUCTS[0], children: [], parseError: true }
  };
  const cloneScanResults = (results) => ({
    success: [...(results?.success || [])], duplicate: [...(results?.duplicate || [])], failed: [...(results?.failed || [])],
    packages: (results?.packages || []).map(group => ({ ...group, success: [...group.success], duplicate: [...group.duplicate], failed: [...group.failed] }))
  });
  const TASK_FIXTURE = Array.from({ length: 10 }, (_, index) => ({
    id: `RKRW20260804${String(index + 1).padStart(4, "0")}`,
    supplier: index % 2 ? "广东壹号药业有限公司" : "厦门示例药业有限公司",
    waybill: index % 2 ? `YT12000000${index + 10}` : `120000008${index}`,
    createdAt: `2026-08-${String(4 + (index % 5)).padStart(2, "0")}`,
    updatedAt: `2026-08-${String(8 + (index % 4)).padStart(2, "0")}`,
    empty: index === 2 || index === 4,
    done: index === 9
  }));
  function makeInspectionItems() {
    return PRODUCTS.map((product, index) => ({
      id: `inspection-${index + 1}`,
      name: product[0], spec: product[1], approval: product[2], batch: product[3], expiry: product[4], manufacturer: product[5],
      codes: Array.from({ length: index < 4 ? 3 : 2 }, (_, codeIndex) => `8126002${String(index + 1).padStart(2, "0")}51600000${String(codeIndex + 1).padStart(4, "0")}`.slice(0, 20)),
      expected: index < 4 ? 3 : 2,
      damaged: false,
      systemMatched: index !== 6,
      receiptMatched: index !== 7,
      systemAbnormal: index % 3 !== 0,
      manualDecision: index < 3 || index > 5 ? "pending" : "ready",
      status: index < 3 || index > 5 ? "pending" : "ready",
      createdAt: 100 - index,
      purchaseCandidate: 0,
      receiptCandidate: 0,
      drugId: index === 4 ? "" : `800000${String(index + 1).padStart(2, "0")}`,
      goodsCode: `YSP${String(index + 1).padStart(6, "0")}`,
      category: index % 3 === 0 ? "OTC" : "RX",
      platformOrder: `2320101209${String(1112312 + index)}`,
      waybill: `SF11212091${String(21 + index)}`,
      purchasePrice: (10.2 + index * 0.35).toFixed(2),
      purchaseOrderNo: index < 5 ? "CG2026001121" : "CG2026001122",
      purchaseLines: index === 0 ? [2, 3] : [index < 4 ? 3 : 2],
      receiptQuantity: index === 0 ? 2 : index < 4 ? 3 : 2,
      barcode: index === 0 ? "691212011102" : `69121201110${index + 2}`,
      replaceable: index === 0,
      replaced: false,
      replacementName: "白云山 布洛芬缓释胶囊",
      split: index === 1 ? { from: "1大盒", to: "6小盒", ratio: 6 } : null,
      oneCodeManyProducts: index === 3,
      nearExpiry: index === 5,
      doubleCross: index === 3,
      matchScore: index === 6 ? 78 : 92,
      operationLogs: []
    }));
  }
  const state = {
    currentMain: "783_15578",
    photoSelected: false,
    scanRound: 0,
    recognitionTimer: 0,
    scanSubmitTimer: 0,
    galleryIndex: 2,
    selectedQueueAction: "",
    listSelection: false,
    lastModal: "",
    busy: false,
    tasks: TASK_FIXTURE.map((task) => ({ ...task })),
    taskSnapshots: new Map(),
    currentTaskId: TASK_FIXTURE[0].id,
    photos: [
      { id: "photo-1", name: "随货同行单-1.png", page: 1, src: "../../../assets/demo-receipt-1.png" },
      { id: "photo-2", name: "随货同行单-2.png", page: 2, src: "../../../assets/demo-receipt-2.png" }
    ],
    selectedPhotoIds: new Set(),
    inspectionItems: makeInspectionItems(),
    selectedBatchIds: new Set(),
    selectedLineIds: new Set(),
    pendingScanEvents: [],
    lastScanResults: { success: [], duplicate: [], failed: [], packages: [] },
    scanCursor: 0,
    currentApprovalId: "inspection-1",
    previousMain: "783_16867",
    readOnly: false,
    taskFilters: { task: "", supplier: "", waybill: "", from: "", to: "" },
    taskDraftSupplier: "",
    taskDraftWaybill: "",
    taskEditWaybill: "",
    activeTraceItemId: "",
    activeMatchType: "",
    selectedCandidate: 0,
    compareExpanded: false,
    dynamic: false,
    approvalSource: "",
    receiptRows: [],
    taskHomeDynamic: false,
    taskDialogOpen: false,
    selectedInspectionIds: new Set(),
    selectedReceiptIds: new Set(),
    deletedReceiptIds: new Set(),
    onlyUninspected: true,
    inspectionSearch: ""
  };
  function reconcileReceiptRows() {
    const existing = new Map(state.receiptRows.map(row => [row.id, row]));
    state.receiptRows = state.photos.flatMap((photo, photoIndex) => Array.from({ length: 4 }, (_, rowIndex) => {
      const id = `${photo.id}-row-${rowIndex + 1}`;
      if (state.deletedReceiptIds.has(id)) return null;
      const product = PRODUCTS[(photoIndex * 4 + rowIndex) % PRODUCTS.length];
      return existing.get(id) || {
        id, photoId: photo.id, page: photo.page, row: rowIndex + 1,
        name: product[0], spec: product[1], approval: product[2], batch: product[3],
        expiry: product[4], manufacturer: product[5], dosage: /胶囊/.test(product[0]) ? "胶囊剂" : /颗粒/.test(product[0]) ? "颗粒剂" : /片/.test(product[0]) ? "片剂" : "—",
        produceDate: "2026-01-08", packageQuantity: 4, batchPrice: "32.50"
      };
    }).filter(Boolean));
  }
  reconcileReceiptRows();
  state.inspectionItems.forEach((item,index) => { item.receiptRowId = state.receiptRows[index]?.id || null; });
  const uninspectedReceiptRows = () => state.receiptRows.filter(row => !state.inspectionItems.some(item => item.receiptMatched && item.receiptRowId === row.id));
  let reporting;
  let frameDocument;

  function requestedFrame() {
    const value = new URLSearchParams(window.location.search).get("frame");
    if (!value) return "";
    const id = value.includes(":") ? value.replace(":", "_") : value;
    return id.startsWith("783_") ? id : `783_${id}`;
  }
  function resizeCanvas() {
    document.documentElement.style.setProperty("--ui-demo-scale", String(Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT)));
  }
  function topFrame(element) {
    for (let node = element; node?.parentElement; node = node.parentElement) if (FRAME_IDS.includes(node.id)) return node;
    return null;
  }
  function labels(root, text) {
    return [...root.querySelectorAll("p")].filter((label) => label.textContent.trim() === text);
  }
  function node(id) {
    return frameDocument?.getElementById(id) || null;
  }
  function bindNode(id, handler, actionName, targetId = id) {
    const source = node(id);
    const target = node(targetId);
    if (!source || !target) return;
    makeInteractive(target, () => handler(source, topFrame(source)), actionName || id);
  }
  function bindNodes(ids, handler, actionName) {
    ids.forEach((id, index) => bindNode(id, (source, frame) => handler(source, index, frame), `${actionName || "action"}-${index}`));
  }
  function bindClosest(id, selector, handler, actionName) {
    const source = node(id);
    const target = source?.closest(selector);
    if (!source || !target) return;
    makeInteractive(target, () => handler(source, topFrame(source)), actionName || id);
  }
  function bindClosestNodes(ids, selector, handler, actionName) {
    ids.forEach((id, index) => bindClosest(id, selector, (source, frame) => handler(source, index, frame), `${actionName || "action"}-${index}`));
  }
  function makeInteractive(node, handler, actionName = "action") {
    if (!node) return;
    const target = node;
    if (target.dataset.uiBound === "true") return;
    target.dataset.uiBound = "true";
    target.dataset.uiAction = actionName;
    node.style.pointerEvents = "auto";
    target.style.pointerEvents = "auto";
    target.style.cursor = "pointer";
    if (!target.hasAttribute("tabindex")) target.tabIndex = 0;
    if (!target.hasAttribute("role")) target.setAttribute("role", "button");
    target.addEventListener("click", (event) => {
      if (state.busy) return;
      event.stopPropagation();
      handler(node, topFrame(node));
    });
    target.addEventListener("keydown", (event) => {
      if (state.busy || !["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      handler(node, topFrame(node));
    });
  }
  function toast(message) {
    frameDocument.querySelector(".ui-demo-toast")?.remove();
    const notice = frameDocument.createElement("div");
    notice.className = "ui-demo-toast";
    notice.textContent = message;
    frameDocument.body.appendChild(notice);
    window.setTimeout(() => notice.remove(), 2200);
  }
  function setBusy(message, duration = 650) {
    frameDocument.querySelector(".ui-demo-busy")?.remove();
    const busy = frameDocument.createElement("div");
    busy.className = "ui-demo-busy";
    busy.innerHTML = `<span></span><p>${message}</p>`;
    frameDocument.body.appendChild(busy);
    state.busy = true;
    window.setTimeout(() => { busy.remove(); state.busy = false; }, duration);
  }
  function closeModal() {
    frameDocument?.querySelector(".ui-demo-backdrop")?.remove();
    Object.keys(MODALS).forEach((id) => {
      const modal = frameDocument?.getElementById(id);
      if (!modal) return;
      modal.style.display = "none";
      ["position","left","top","transform","z-index","width","min-width","height","min-height"].forEach((property) => modal.style.removeProperty(property));
    });
    state.lastModal = "";
  }
  function showMain(id) {
    if (!MAIN_FRAME_IDS.has(id)) return;
    closeModal();
    MAIN_FRAME_IDS.forEach((frameId) => {
      const frame = frameDocument.getElementById(frameId);
      if (frame) frame.style.display = frameId === id ? "block" : "none";
    });
    state.currentMain = id;
    frameDocument.documentElement.scrollTop = 0;
    frameDocument.body.scrollTop = 0;
    syncVisibleState();
    renderReportRails();
    if(id==="783_15578") renderTaskHome();
    if(["783_14372","783_14519"].includes(id)) renderPhotoGallery();
    if(["783_14682","783_15044"].includes(id)) { renderInspectionCards(); renderScanResults(); }
  }
  function openModal(id) {
    const modal = frameDocument.getElementById(id);
    const size = MODALS[id];
    if (!modal || !size) return;
    closeModal();
    const backdrop = frameDocument.createElement("div");
    backdrop.className = "ui-demo-backdrop";
    backdrop.addEventListener("click", closeModal);
    (frameDocument.getElementById("0_1") || frameDocument.body).appendChild(backdrop);
    Object.assign(modal.style, {display:"block",position:"fixed",left:"50%",top:"50%",width:`${size[0]}px`,minWidth:`${size[0]}px`,height:`${size[1]}px`,minHeight:`${size[1]}px`,transform:"translate(-50%,-50%)",zIndex:"9999"});
    state.lastModal = id;
  }
  function setText(rootId, from, to, index = 0) {
    const root = frameDocument.getElementById(rootId);
    const label = root ? labels(root, from)[index] : null;
    if (label) label.textContent = to;
  }
  function allText(rootId, pattern) {
    const root = frameDocument.getElementById(rootId);
    return root ? [...root.querySelectorAll("p")].filter((node) => pattern.test(node.textContent.trim())) : [];
  }
  function setTextPattern(rootId, pattern, values) {
    const nodes = allText(rootId, pattern);
    const next = Array.isArray(values) ? values : [values];
    nodes.forEach((node, index) => { if (next[index] !== undefined) node.textContent = next[index]; });
  }
  function makeEditableLabel(node, onCommit) {
    if (!node || node.dataset.editable === "true") return;
    node.dataset.editable = "true";
    node.contentEditable = "true";
    node.spellcheck = false;
    node.setAttribute("role", "textbox");
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter") { event.preventDefault(); node.blur(); }
    });
    node.addEventListener("blur", () => onCommit?.(node.textContent.trim()));
  }
  function counts() {
    return state.inspectionItems.reduce((result, item) => {
      result[item.status] = (result[item.status] || 0) + 1;
      return result;
    }, { uninspected: uninspectedReceiptRows().length, pending: 0, ready: 0, inbound: 0 });
  }
  function syncStatusCounts() {
    const value = counts();
    const map = [["已入库", value.inbound], ["准入库", value.ready], ["待核准", value.pending], ["待验货", value.uninspected]];
    MAIN_FRAME_IDS.forEach((id) => map.forEach(([label, count]) => {
      allText(id, new RegExp(`^${label} \\(\\d+\\)$`)).forEach((node) => { node.textContent = `${label} (${count})`; });
    }));
  }
  function syncInspectionFrame(id) {
    const total = state.inspectionItems.reduce((sum, item) => sum + item.codes.length, 0);
    const totalLabel = frameDocument.getElementById(id === "783_14682" ? "783_14786" : "783_15217");
    if (totalLabel) totalLabel.textContent = `已验货品批：${total}码`;
    const names = allText(id, /缓释胶囊.*\//);
    const approvals = allText(id, /^国药准字/);
    const batches = allText(id, /^批号/);
    const expiries = allText(id, /^效期/);
    const traceCounts = allText(id, /^追溯码 \d+$/);
    const statusLabels = allText(id, /^(待核准|无需核准|已入库)$/);
    state.inspectionItems.slice(0, names.length).forEach((item, index) => {
      names[index].textContent = `${item.name}/${item.spec}`;
      if (approvals[index]) approvals[index].textContent = item.approval;
      if (batches[index]) batches[index].textContent = `批号${item.batch}`;
      if (expiries[index]) expiries[index].textContent = `效期${item.expiry}`;
      if (traceCounts[index]) traceCounts[index].textContent = `追溯码 ${item.codes.length}`;
      if (statusLabels[index]) statusLabels[index].textContent = item.status === "inbound" ? "已入库" : item.status === "ready" ? "无需核准" : "待核准";
    });
    const result = state.lastScanResults;
    const lastTotal = result.success.length + result.duplicate.length + result.failed.length;
    setTextPattern(id, /^上次录入（\d+）$/, `上次录入（${lastTotal}）`);
  }
  function syncPhotoFrames() {
    ["783_14372", "783_14519"].forEach((id) => setTextPattern(id, /^已拍票据：\d+张$/, `已拍票据：${state.photos.length}张`));
  }
  function syncStatusPageData(id, status) {
    const items = state.inspectionItems.filter((item) => item.status === status);
    const root = frameDocument.getElementById(id);
    if (!root || !items.length) return;
    const names = [...root.querySelectorAll("p")].filter((node) => PRODUCTS.some((product) => node.textContent.trim().includes(product[0])));
    const specs = allText(id, /^(0\.3g\*20粒|6g\*10袋)$/);
    const approvals = allText(id, /^国药准字/);
    const batches = allText(id, /^(L|B|Z|A|P|F|M|O)\d+/);
    const expiries = allText(id, /^有效期 /);
    const traceCodes = allText(id, /^\d{14,20}$/);
    names.forEach((node, index) => { const item = items[index % items.length]; node.textContent = item.name; });
    specs.forEach((node, index) => { const item = items[index % items.length]; node.textContent = item.spec; });
    approvals.forEach((node, index) => { const item = items[index % items.length]; node.textContent = item.approval; });
    batches.forEach((node, index) => { const item = items[index % items.length]; node.textContent = item.batch; });
    expiries.forEach((node, index) => { const item = items[index % items.length]; node.textContent = `有效期 ${item.expiry}`; });
    traceCodes.forEach((node, index) => { const item = items[index % items.length]; node.textContent = item.codes[0] || "-"; });
  }
  function approvalQueue() {
    return state.inspectionItems.filter((item) => item.status === "pending").sort((a, b) => b.createdAt - a.createdAt);
  }
  function currentApproval() {
    const queue = approvalQueue();
    let current = state.inspectionItems.find((item) => item.id === state.currentApprovalId);
    if (!current) current = queue[0] || state.inspectionItems[0];
    state.currentApprovalId = current?.id || "";
    return current;
  }
  function syncApprovalFrame() {
    const id = "783_16867";
    const queue = approvalQueue();
    const current = currentApproval();
    setTextPattern(id, /^待核准：\d+$/, `待核准：${queue.length}`);
    const queueLabels = allText(id, /X\d+$/);
    queueLabels.forEach((node, index) => {
      const item = queue[index];
      if (item) { node.textContent = `${item.name}X${item.codes.length}`; node.parentElement.style.display = ""; }
      else node.parentElement.style.display = "none";
    });
    if (!current) return;
    const title = allText(id, / 0\.3g\*20粒$/)[0];
    if (title) title.textContent = `${current.name} ${current.spec}`;
    setTextPattern(id, /^B\d+\/\d{4}-\d{2}-\d{2}$/, `${current.batch}/${current.expiry}`);
    setTextPattern(id, /^\d+$/, [String(current.codes.length)]);
    const purchaseTitle = allText(id, /^【800000】/)[0];
    if (purchaseTitle) purchaseTitle.textContent = current.systemMatched ? `【800000】${current.name} ${current.spec}` : "未匹配采购单商品，请指定";
    const purchaseSection = labels(frameDocument.getElementById(id), "采购单匹配结果：")[0];
    if (purchaseSection) purchaseSection.textContent = current.systemMatched ? "采购单匹配结果：" : "采购单匹配结果：暂无";
    const receiptSection = labels(frameDocument.getElementById(id), "随货单匹配结果：")[0] || labels(frameDocument.getElementById(id), "随货单匹配结果：暂无")[0];
    if (receiptSection) receiptSection.textContent = current.receiptMatched ? "随货单匹配结果：" : "随货单匹配结果：暂无";
  }
  function syncVisibleState() {
    if (!frameDocument) return;
    syncStatusCounts();
    syncPhotoFrames();
    ["783_14682", "783_15044"].forEach(syncInspectionFrame);
    syncApprovalFrame();
    syncStatusPageData("783_20214", "pending");
    syncStatusPageData("783_18305", "ready");
    syncStatusPageData("783_18643", "ready");
    syncStatusPageData("783_18037", "inbound");
    renderApprovalPanel();
    renderStatusOverlays();
  }
  function beginDynamic() {
    state.dynamic = true;
  }
  function taskSnapshot() {
    return {
      photos: state.photos.map((item) => ({ ...item })),
      receiptRows: state.receiptRows.map(row => ({ ...row })),
      deletedReceiptIds: [...state.deletedReceiptIds],
      inspectionItems: state.inspectionItems.map((item) => ({ ...item, codes: [...item.codes], operationLogs: [...(item.operationLogs || [])], split: item.split ? { ...item.split } : null })),
      lastScanResults: cloneScanResults(state.lastScanResults)
    };
  }
  function restoreTask(task) {
    const snapshot = state.taskSnapshots.get(task.id);
    state.currentTaskId = task.id;
    state.approvalSource = "";
    state.selectedLineIds.clear();
    state.selectedInspectionIds.clear();
    state.selectedReceiptIds.clear();
    state.readOnly = task.done;
    if (snapshot) {
      state.photos = snapshot.photos.map((item) => ({ ...item }));
      state.receiptRows = (snapshot.receiptRows || []).map(row => ({ ...row }));
      state.deletedReceiptIds = new Set(snapshot.deletedReceiptIds || []);
      state.inspectionItems = snapshot.inspectionItems.map((item) => ({ ...item, codes: [...item.codes], operationLogs: [...(item.operationLogs || [])], split: item.split ? { ...item.split } : null }));
      state.lastScanResults = cloneScanResults(snapshot.lastScanResults);
    } else {
      state.photos = task.empty ? [] : [1,2].map(n => ({id:`photo-${n}`,name:`随货同行单-${n}.png`,page:n,src:`../../../assets/demo-receipt-${n}.png`}));
      state.deletedReceiptIds = new Set();
      state.receiptRows = []; reconcileReceiptRows();
      state.inspectionItems = task.empty ? [] : makeInspectionItems();
      state.inspectionItems.forEach((item,index) => { item.receiptRowId = state.receiptRows[index]?.id || null; });
      if (task.done) state.inspectionItems.forEach((item) => { item.status = "inbound"; });
      state.lastScanResults = { success: [], duplicate: [], failed: [], packages: [] };
    }
    state.photoSelected = state.photos.length > 0;
    state.currentApprovalId = approvalQueue()[0]?.id || state.inspectionItems[0]?.id || "";
  }
  function saveTaskSnapshot() {
    reconcileReceiptRows();
    if (state.currentTaskId) {
      state.taskSnapshots.set(state.currentTaskId, taskSnapshot());
      const task=state.tasks.find(t=>t.id===state.currentTaskId);
      if(task&&state.dynamic){task.empty=!state.photos.length&&!state.inspectionItems.length;task.done=state.inspectionItems.length>0&&state.inspectionItems.every(i=>i.status==="inbound")&&!uninspectedReceiptRows().length;}
    }
  }
  function openTask(index) {
    const task = state.tasks[index] || state.tasks[0];
    restoreTask(task);
    // Navigation must not rewrite the Pixso-authored static fixture. Dynamic
    // synchronization begins only after the user performs a data mutation.
    state.dynamic = state.taskSnapshots.has(task.id);
    showMain("783_14372");
    if (task.done) window.setTimeout(() => toast("已入库任务仅支持查看"), 0);
  }
  function guardMutation() {
    if (!state.readOnly) return false;
    toast("已入库任务仅支持查看");
    return true;
  }
  function normalizeCode(value) {
    return String(value || "").replace(/\D/g, "");
  }
  function isValidTrace(value) {
    return /^\d{20}$/.test(String(value || ""));
  }
  function nextScanEvent() {
    const cycle = state.scanCursor++;
    if (cycle > 0 && cycle % 8 === 7) {
      const code = "62034803834789840000";
      return { code, ...PACKAGE_FIXTURES[code] };
    }
    const product = PRODUCTS[cycle % PRODUCTS.length];
    let code = `9326002${String(cycle + 1).padStart(2, "0")}71600000${String(cycle + 1).padStart(4, "0")}`.slice(0, 20);
    let apiInvalid = false;
    if (cycle % 7 === 4) code = code.slice(0, 16);
    if (cycle % 7 === 5) code = state.inspectionItems[0]?.codes[0] || code;
    if (cycle % 7 === 6) apiInvalid = true;
    return { product, code, apiInvalid };
  }
  function applyScanEvents(events) {
    beginDynamic();
    const allCodes = new Set(state.inspectionItems.flatMap((item) => item.codes));
    const success = [], duplicate = [], failed = [], packages = [];
    const recordSmallCode = (event, group) => {
      const bucket = group || { success, duplicate, failed };
      if (!isValidTrace(event.code) || event.apiInvalid) return bucket.failed.push(event.code);
      if (allCodes.has(event.code)) return bucket.duplicate.push(event.code);
      const [name, spec, approval, batch, expiry, manufacturer] = event.product;
      let item = state.inspectionItems.find((candidate) => candidate.name === name && candidate.batch === batch);
      if (!item) {
        item = { id: `inspection-${Date.now()}-${state.inspectionItems.length}`, name, spec, approval, batch, expiry, manufacturer, codes: [], expected: 1, damaged: false, systemMatched: true, receiptMatched: state.photos.length > 0, systemAbnormal: true, manualDecision: "pending", status: "pending", createdAt: Date.now(), purchaseCandidate: 0, receiptCandidate: 0, purchaseOrderNo: "CG2026001121" };
        item.receiptRowId = state.receiptRows.find(row => row.name === name)?.id || null;
        item.drugId = `800000${PRODUCTS.findIndex(p => p[0] === name) + 1}`; item.goodsCode=`YSP${String(PRODUCTS.findIndex(p=>p[0]===name)+1).padStart(6,'0')}`; item.operationLogs=[];
        state.inspectionItems.unshift(item);
      }
      item.codes.push(event.code);
      allCodes.add(event.code);
      bucket.success.push(event.code);
    };
    events.forEach((event) => {
      if (!isValidTrace(event.code) || event.apiInvalid) return failed.push(event.code);
      if (event.level === 2 || event.level === 3) {
        if (event.parseError || !event.children?.length) return failed.push(event.code);
        const group = { parentCode: event.code, packageLevel: event.level, success: [], duplicate: [], failed: [] };
        event.children.forEach(code => recordSmallCode({ code, product: event.product }, group));
        packages.push(group);
        return;
      }
      recordSmallCode(event);
    });
    state.lastScanResults = { success, duplicate, failed, packages };
    state.pendingScanEvents = [];
    state.scanRound += 1;
    state.currentApprovalId = approvalQueue()[0]?.id || state.currentApprovalId;
    saveTaskSnapshot();
    showMain("783_15044");
    pulseProgress(2);
    const total = status => state.lastScanResults[status].length + packages.reduce((count, group) => count + group[status].length, 0);
    toast(`验货完成：成功 ${total("success")} 个${total("duplicate") ? `，重复 ${total("duplicate")} 个` : ""}${total("failed") ? `，失败 ${total("failed")} 个` : ""}`);
  }
  function updateApprovalDecision(decision) {
    beginDynamic();
    const item = currentApproval();
    if (!item) return toast("当前没有待核准商品");
    if (decision === "ready" && !item.systemMatched) return toast("未匹配系统单据，无法入库");
    item.manualDecision = decision === "ready" ? "ready" : "pending";
    if (decision === "ready") item.status = "ready";
    else item.createdAt = -Date.now();
    state.currentApprovalId = approvalQueue()[0]?.id || "";
    saveTaskSnapshot();
    syncVisibleState();
    pulseProgress(decision === "ready" ? 1 : 2);
  }
  function openTraceEditor(item){
    if(!item)return;document.querySelector('.ui-phase1-trace-dialog')?.remove();const readOnly=item.status==='inbound'||state.readOnly;const draft=[...(item.codes||[])];const layer=document.createElement('div');layer.className='ui-phase1-trace-dialog';document.body.append(layer);
    const close=()=>layer.remove();const render=()=>{layer.innerHTML=`<section role="dialog" aria-modal="true" aria-label="${readOnly?'查看':'编辑'}追溯码"><header><strong>${readOnly?'查看':'编辑'}追溯码</strong><button type="button" data-trace-close aria-label="关闭">×</button></header><p>实录追溯码 ${draft.length} 条${readOnly?' · 已入库仅支持查看':''}</p><div class="phase1-trace-codes">${draft.map((code,index)=>`<div><span>${escapeNonstandard(code)}</span>${!readOnly&&draft.length>1?`<button type="button" data-trace-remove="${index}" aria-label="删除追溯码${escapeNonstandard(code)}">×</button>`:''}</div>`).join('')}</div><footer><button type="button" data-trace-cancel>${readOnly?'关闭':'取消'}</button>${readOnly?'':'<button type="button" class="primary" data-trace-save>保存</button>'}</footer></section>`;layer.querySelector('[data-trace-close]').onclick=close;layer.querySelector('[data-trace-cancel]').onclick=close;layer.querySelectorAll('[data-trace-remove]').forEach(b=>b.onclick=()=>{draft.splice(Number(b.dataset.traceRemove),1);render();});layer.querySelector('[data-trace-save]')?.addEventListener('click',()=>{if(draft.length<1)return toast('至少保留一个追溯码');if(draft.some(c=>!isValidTrace(c)))return toast('追溯码必须为20位纯数字');if(guardMutation())return;item.codes=draft;beginDynamic();saveTaskSnapshot();close();syncVisibleState();renderInspectionCards();toast('追溯码已保存');});};render();layer.addEventListener('keydown',e=>{if(e.key==='Escape')close();});layer.querySelector('[data-trace-close]').focus();
  }
  function applyCandidate() {
    beginDynamic();
    const item = currentApproval();
    if (!item) return;
    if (state.activeMatchType === "purchase") { item.purchaseCandidate = state.selectedCandidate; item.systemMatched = true; }
    if (state.activeMatchType === "receipt") { item.receiptCandidate = state.selectedCandidate; item.receiptMatched = true; }
    item.systemAbnormal = state.selectedCandidate !== 0;
    item.status = item.systemAbnormal || item.damaged ? "pending" : "ready";
    saveTaskSnapshot();
  }
  function openConfirm(message, onConfirm) {
    frameDocument.querySelector(".ui-demo-confirm")?.remove();
    const box = frameDocument.createElement("div");
    box.className = "ui-demo-confirm";
    box.innerHTML = `<p>${message}</p><div><button data-cancel>取消</button><button data-confirm>确定</button></div>`;
    frameDocument.body.appendChild(box);
    box.querySelector("[data-cancel]").addEventListener("click", () => box.remove());
    box.querySelector("[data-confirm]").addEventListener("click", () => { box.remove(); onConfirm(); });
  }
  function openPhotoLightbox(source) {
    frameDocument.querySelector(".ui-demo-lightbox")?.remove();
    const imageValue = window.getComputedStyle(source).backgroundImage;
    if (!imageValue || imageValue === "none") return;
    const box = frameDocument.createElement("div");
    box.className = "ui-demo-lightbox";
    box.innerHTML = `<button type="button" aria-label="关闭票据预览">×</button><div class="ui-demo-lightbox-image"></div>`;
    box.querySelector(".ui-demo-lightbox-image").style.backgroundImage = imageValue;
    box.addEventListener("click", (event) => { if (event.target === box) box.remove(); });
    box.querySelector("button").addEventListener("click", () => box.remove());
    (frameDocument.getElementById("0_1") || frameDocument.body).appendChild(box);
  }
  function pulseProgress(index) {
    const target = [...frameDocument.querySelectorAll(`[data-ui-action^="progress-card-"][data-ui-action$="-${index}"]`)]
      .find((candidate) => candidate.getBoundingClientRect().width > 0);
    if (!target) return;
    target.classList.remove("ui-demo-pulse");
    window.requestAnimationFrame(() => target.classList.add("ui-demo-pulse"));
    window.setTimeout(() => target.classList.remove("ui-demo-pulse"), 720);
  }
  function switchStep(step) {
    state.approvalSource = "";
    if (step === "photo") return showMain(state.photos.length ? "783_14519" : "783_14372");
    if (step === "scan") return showMain(state.inspectionItems.length ? "783_15044" : "783_14682");
    if (step === "approve") return showMain("783_16867");
  }
  function selectPhoto(selected) {
    if (guardMutation()) return;
    beginDynamic();
    state.photoSelected = selected;
    state.selectedPhotoIds = selected ? new Set(state.photos.map((photo) => photo.id)) : new Set();
    showMain(selected ? "783_14519" : "783_14372");
    renderPhotoGallery();
    toast(selected ? `已选择 ${state.selectedPhotoIds.size} 张票据` : "已取消选择");
  }
  function runRecognition(enteredCode) {
    if (guardMutation()) return;
    window.clearTimeout(state.recognitionTimer);
    window.clearTimeout(state.scanSubmitTimer);
    const event = nextScanEvent();
    if (enteredCode !== undefined) {
      event.code = String(enteredCode).trim(); event.apiInvalid = false;
      const packageFixture = PACKAGE_FIXTURES[event.code];
      if (packageFixture) Object.assign(event, packageFixture);
    }
    if (!event.code) return;
    state.pendingScanEvents.push(event);
    state.busy = false;
    frameDocument.querySelector(".ui-demo-busy")?.remove();
    const currentLabel = allText(state.currentMain, /^本次录入（\d+）$/)[0];
    if (currentLabel) currentLabel.textContent = `本次录入（${state.pendingScanEvents.length}）`;
    renderScanResults();
    state.recognitionTimer = window.setTimeout(() => {
      const pending = [...state.pendingScanEvents];
      setBusy("正在验货、对码并智能核准", 720);
      state.scanSubmitTimer = window.setTimeout(() => applyScanEvents(pending), 730);
    }, enteredCode === undefined ? 500 : 0);
  }
  function bindStatusCards(rootId) {
    const idsByFrame = {
      "783_14372": ["783_14489", "783_14500", "783_14508", "783_14518"],
      "783_14519": ["783_14651", "783_14662", "783_14670", "783_14680"],
      "783_14682": ["783_15014", "783_15025", "783_15033", "783_15043"],
      "783_15044": ["783_15446", "783_15457", "783_15465", "783_15475"],
      "783_16867": ["783_17178", "783_17189", "783_17197", "783_17207"],
      "783_18037": ["783_18275", "783_18286", "783_18294", "783_18304"],
      "783_18305": ["783_18613", "783_18624", "783_18632", "783_18642"],
      "783_18643": ["783_18957", "783_18968", "783_18976", "783_18986"],
      "783_18987": ["783_19325", "783_19336", "783_19344", "783_19354"],
      "783_20214": ["783_20675", "783_20686", "783_20694", "783_20704"]
    };
    bindClosestNodes(idsByFrame[rootId] || [], '[class^="stroke-wrapper-"]', (_source, index) => showMain(STATUS_PAGES[index]), `progress-card-${rootId}`);
  }
  function bindModalActions(rootId) {
    const root = frameDocument.getElementById(rootId);
    if (!root) return;
    const cancelIds = {"783_16767":"783_16814","783_16817":"783_16863","783_15476":"783_15574","783_17921":"783_18019","783_17873":"783_17918","783_17644":"783_17727","783_17730":"783_17819"};
    const confirmIds = {"783_16767":"783_16816","783_16817":"783_16865","783_15476":"783_15576","783_17921":"783_18021","783_17873":"783_17920","783_17644":"783_17729","783_17730":"783_17821"};
    const closeIds = {"783_16767":"783_16770","783_16817":"783_16820","783_15476":"783_15479","783_17921":"783_17924","783_17873":"783_17876","783_17844":"783_17847","783_17822":"783_17825","783_17730":"783_17733","783_17644":"783_17647"};
    if (cancelIds[rootId]) bindNode(cancelIds[rootId], closeModal, `modal-cancel-${rootId}`);
    if (confirmIds[rootId]) bindNode(confirmIds[rootId], () => {
      if (guardMutation() && !["783_16767", "783_16817"].includes(rootId)) return;
      if (["783_17644", "783_17730"].includes(rootId)) applyCandidate();
      if (["783_15476", "783_17921"].includes(rootId)) {
        const item = state.inspectionItems.find((candidate) => candidate.id === state.activeTraceItemId);
        if (!item?.codes.length) return toast("至少保留一个追溯码");
        if (item.codes.some((code) => !isValidTrace(code))) return toast("追溯码必须为20位纯数字");
        beginDynamic();
        saveTaskSnapshot();
      }
      closeModal();
      setBusy("正在保存", 420);
      window.setTimeout(() => { syncVisibleState(); pulseProgress(2); toast("保存成功"); }, 430);
    }, `modal-confirm-${rootId}`);
    if (["783_17644", "783_17730"].includes(rootId)) {
      const candidateIds = rootId === "783_17644" ? ["783_17688","783_17702","783_17714"] : ["783_17776","783_17792","783_17806"];
      const candidates = candidateIds.map(node).filter(Boolean);
      candidates.forEach((label, index) => makeInteractive(label, () => {
        state.selectedCandidate = index;
        candidates.forEach((candidate, candidateIndex) => candidate.parentElement?.classList.toggle("ui-demo-candidate-selected", candidateIndex === index));
      }));
    }
    if (rootId === "783_17873") {
      ["783_17880", "783_17883", "783_17886"].forEach((id, index) => bindNode(id, () => {
        const item = currentApproval();
        if (!item) return;
        beginDynamic();
        const batches = [item.batch, index === 1 ? "SH250302" : "CG250303", index === 1 ? "SH250302" : "CG250303"];
        item.batch = batches[index]; saveTaskSnapshot(); toast("已填入批次信息");
      }, `batch-quick-fill-${index}`));
      const item = currentApproval();
      const values = allText(rootId, /^(B\d+|\d{4}-\d{2}-\d{2})$/);
      values.slice(-3).forEach((node, index) => makeEditableLabel(node, (value) => {
        if (!item) return;
        beginDynamic();
        if (index === 0) item.batch = value;
        if (index === 1) item.expiry = value;
        if (index === 2) item.produceDate = value;
        saveTaskSnapshot();
      }));
    }
    if (closeIds[rootId]) bindNode(closeIds[rootId], closeModal, `modal-close-${rootId}`);
  }
  const supplierPool=[{id:"supplier-xm",name:"厦门示例药业有限公司"},{id:"supplier-gd",name:"广东壹号药业有限公司"}];
  function parseWaybills(value){return [...new Set(String(value||"").split(/[,，;\n\r]+/).map(v=>v.trim()).filter(Boolean))];}
  function taskHasData(task){const snap=state.taskSnapshots.get(task.id);return !!(task.done||(snap ? snap.photos.length||snap.receiptRows.length||snap.inspectionItems.length : !task.empty));}
  function taskCounts(task){const snap=state.taskSnapshots.get(task.id);if(!snap)return task.empty?{uninspected:0,pending:0,ready:0,inbound:0}:task.done?{uninspected:0,pending:0,ready:0,inbound:8}:{uninspected:1,pending:5,ready:3,inbound:0};const linked=new Set(snap.inspectionItems.filter(i=>i.receiptMatched).map(i=>i.receiptRowId));return {uninspected:snap.receiptRows.filter(r=>!linked.has(r.id)).length,pending:snap.inspectionItems.filter(i=>i.status==="pending").length,ready:snap.inspectionItems.filter(i=>i.status==="ready").length,inbound:snap.inspectionItems.filter(i=>i.status==="inbound").length};}
  function renderTaskHome(){
    const frame=frameDocument.getElementById("783_15578");if(!frame||!state.taskHomeDynamic)return;
    let home=frame.querySelector('.ui-phase1-task-home');if(!home){home=document.createElement('section');home.className='ui-phase1-task-home';frame.append(home);}
    const filters=state.taskFilters;const filtered=state.tasks.filter(t=>{const w=(t.waybillNoList||[t.waybill]).join('；');return (!filters.task||t.id.includes(filters.task))&&(!filters.supplier||t.supplier.includes(filters.supplier))&&(!filters.waybill||w.includes(filters.waybill))&&(!filters.from||t.createdAt>=filters.from)&&(!filters.to||t.createdAt<=filters.to);});
    home.innerHTML=`<div class="phase1-task-filters"><input data-task-query="task" placeholder="入库任务单号" value="${escapeNonstandard(filters.task)}"/><input data-task-query="supplier" placeholder="供应商名称" value="${escapeNonstandard(filters.supplier)}"/><input data-task-query="waybill" placeholder="运单号" value="${escapeNonstandard(filters.waybill)}"/><div class="phase1-task-range"><input data-task-query="from" type="date" aria-label="时间从" value="${escapeNonstandard(filters.from)}"/><span>→</span><input data-task-query="to" type="date" aria-label="时间至" value="${escapeNonstandard(filters.to)}"/></div><button data-task-recent>近7天</button><button data-task-clear>清空筛选</button><button class="primary" data-task-create>新建入库任务</button></div><div class="phase1-task-table"><table><thead><tr><th>入库任务单号</th><th>供应商名称</th><th>运单号</th><th>任务创建时间</th><th>最近操作时间</th><th>待验货数量</th><th>待核准数量</th><th>准入库数量</th><th>已入库数量</th><th>操作</th></tr></thead><tbody>${filtered.map(t=>{const c=taskCounts(t),w=(t.waybillNoList||[t.waybill]).filter(Boolean).join('；');return `<tr data-task-row="${escapeNonstandard(t.id)}"><td>${escapeNonstandard(t.id)}</td><td title="${escapeNonstandard(t.supplier)}">${escapeNonstandard(t.supplier)}</td><td title="${escapeNonstandard(w)}">${escapeNonstandard(w||'—')}</td><td>${escapeNonstandard(t.createdAt)}</td><td>${escapeNonstandard(t.updatedAt||t.createdAt)}</td><td>${c.uninspected}</td><td>${c.pending}</td><td>${c.ready}</td><td>${c.inbound}</td><td><button data-task-enter="${escapeNonstandard(t.id)}">进入</button><button data-task-edit="${escapeNonstandard(t.id)}" ${t.done?'disabled':''}>编辑运单</button><button data-task-delete="${escapeNonstandard(t.id)}" ${taskHasData(t)?'disabled title="已有出入库数据或任务完成，不可删除"':''}>删除</button></td></tr>`}).join('')||'<tr><td colspan="10" class="phase1-task-empty">暂无符合条件的任务</td></tr>'}</tbody></table></div><footer class="phase1-task-pagination"><span>${filtered.length}个任务 / ${filtered.filter(t=>!t.done).length}个进行中</span><div><button type="button" disabled>50条/页⌄</button><span>1 / 1</span><button type="button" disabled aria-label="上一页">‹</button><button type="button" disabled aria-label="下一页">›</button><span>共${filtered.length}条</span></div></footer>`;
    home.querySelectorAll('[data-task-query]').forEach(i=>i.onchange=()=>{filters[i.dataset.taskQuery]=i.value.trim();renderTaskHome();});
    home.querySelector('[data-task-create]').onclick=()=>openTaskDialog('create');
    home.querySelector('[data-task-clear]').onclick=()=>{state.taskFilters={task:'',supplier:'',waybill:'',from:'',to:''};renderTaskHome();};
    home.querySelector('[data-task-recent]').onclick=()=>{const d=new Date();d.setDate(d.getDate()-6);filters.from=d.toISOString().slice(0,10);filters.to=new Date().toISOString().slice(0,10);renderTaskHome();};
    home.querySelectorAll('[data-task-enter]').forEach(b=>b.onclick=()=>openTask(state.tasks.findIndex(t=>t.id===b.dataset.taskEnter)));
    home.querySelectorAll('[data-task-edit]').forEach(b=>b.onclick=()=>openTaskDialog('edit',state.tasks.find(t=>t.id===b.dataset.taskEdit)));
    home.querySelectorAll('[data-task-delete]').forEach(b=>b.onclick=()=>{const task=state.tasks.find(t=>t.id===b.dataset.taskDelete);if(!task||taskHasData(task))return toast('该任务已有出入库数据或已完成，不能删除');openConfirm('确认删除该入库任务？',()=>{state.tasks=state.tasks.filter(t=>t.id!==task.id);state.taskSnapshots.delete(task.id);renderTaskHome();toast('任务已删除');});});
  }
  function openTaskDialog(mode,task){
    if(state.taskDialogOpen)return;if(mode==='edit'&&(!task||task.done))return toast('已完成任务不可编辑运单');
    state.taskDialogOpen=true;const dialog=document.createElement('div');dialog.className='ui-phase1-dialog';dialog.innerHTML=`<section role="dialog" aria-modal="true" aria-label="${mode==='create'?'新建入库任务':'编辑入库任务'}"><header><strong>${mode==='create'?'新建入库任务':'编辑入库任务'}</strong><button type="button" data-task-dialog-close aria-label="关闭">×</button></header><p>${mode==='create'?'选择当前门店尚未全部入库采购单对应的供应商':'仅支持更新运单号'}</p><form novalidate><label>供应商名称 <em>*</em>${mode==='create'?`<select name="supplier"><option value="">搜索或选择供应商</option>${supplierPool.map(o=>`<option value="${o.id}">${o.name}</option>`).join('')}</select>`:`<input value="${escapeNonstandard(task.supplier)}" disabled/>`}</label><label>运单号 <small>可填多值，用逗号、分号或换行分隔</small><textarea name="waybills" maxlength="500" rows="4" placeholder="请输入运单号">${escapeNonstandard(mode==='edit'?(task.waybillNoList||[task.waybill]).filter(Boolean).join('\n'):'')}</textarea></label><p data-task-error role="alert" hidden></p><footer><button type="button" data-task-dialog-cancel>取消</button><button class="primary" type="submit">${mode==='create'?'创建并进入拍单':'保存'}</button></footer></form></section>`;document.body.append(dialog);
    const close=()=>{dialog.remove();state.taskDialogOpen=false;};dialog.querySelector('[data-task-dialog-close]').onclick=close;dialog.querySelector('[data-task-dialog-cancel]').onclick=close;dialog.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
    dialog.querySelector('form').onsubmit=e=>{e.preventDefault();const form=e.currentTarget,error=dialog.querySelector('[data-task-error]'),ways=parseWaybills(form.elements.waybills.value);if(mode==='create'&&!supplierPool.some(o=>o.id===form.elements.supplier.value)){error.hidden=false;error.textContent='请选择当前门店供应商池中的供应商';form.elements.supplier.focus();return;}
      if(mode==='create'){const d=new Date(),day=`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`,max=state.tasks.map(t=>/^RKRW(\d{8})(\d{4})$/.exec(t.id)).filter(x=>x&&x[1]===day).reduce((n,x)=>Math.max(n,Number(x[2])),0),id=`RKRW${day}${String(max+1).padStart(4,'0')}`,supplier=supplierPool.find(o=>o.id===form.elements.supplier.value);const created={id,supplierId:supplier.id,supplier:supplier.name,waybill:ways[0]||'',waybillNoList:ways,createdAt:d.toISOString().slice(0,10),updatedAt:d.toISOString().slice(0,10),empty:true,done:false};state.tasks.unshift(created);state.taskHomeDynamic=true;close();openTask(0);toast('任务创建成功');}
      else{task.waybillNoList=ways;task.waybill=ways[0]||'';task.updatedAt=new Date().toISOString().slice(0,10);state.taskHomeDynamic=true;close();renderTaskHome();toast('运单号已更新');}
    };dialog.querySelector(mode==='create'?'select':'textarea').focus();
  }
  function bindTaskList() {
    bindNodes(["783_15815","783_15900","783_15985","783_16071","783_16156","783_16242","783_16327","783_16412","783_16497","783_16582","783_16667","783_16752"], (_source, index) => openTask(index), "task-enter");
    bindNode("783_15653", () => openTaskDialog('create'), "task-create", "783_15652");
    bindNodes(["783_15816","783_15901","783_16072","783_16157","783_16243","783_16328","783_16413","783_16498","783_16583","783_16668","783_16753"], (_source,index)=>openTaskDialog('edit',state.tasks[index]),"task-edit");
    ["783_15987","783_16158"].forEach((id,index)=>makeInteractive(node(id),()=>{const task=state.tasks[index===0?2:4];if(!task||taskHasData(task))return toast('该任务已有出入库数据，不能删除');openConfirm('确认删除该入库任务？',()=>{state.tasks=state.tasks.filter(t=>t.id!==task.id);state.taskHomeDynamic=true;renderTaskHome();});},`task-delete-${id}`));
    bindNode("783_15644",()=>{state.taskHomeDynamic=true;const d=new Date();d.setDate(d.getDate()-6);state.taskFilters.from=d.toISOString().slice(0,10);state.taskFilters.to=new Date().toISOString().slice(0,10);renderTaskHome();},'task-recent-seven-days');
    bindNode("783_15650",()=>{state.taskHomeDynamic=true;state.taskFilters={task:'',supplier:'',waybill:'',from:'',to:''};renderTaskHome();},'task-filter-clear');
  }
  function renderPhotoGallery(){
    for(const id of ["783_14372","783_14519"]){const frame=frameDocument.getElementById(id);if(!frame)continue;frame.querySelector('.ui-phase1-photo-gallery')?.remove();if(!state.dynamic||id!=="783_14519")continue;
      const pane=document.createElement('section');pane.className='ui-phase1-photo-gallery';pane.innerHTML=`<header><strong>已拍票据：${state.photos.length}张</strong><button data-photo-upload>相册上传</button></header><div class="phase1-photo-actions"><label><input type="checkbox" data-photo-all ${state.photos.length&&state.selectedPhotoIds.size===state.photos.length?'checked':''}/>全选</label><button data-photo-delete ${state.selectedPhotoIds.size?'':'disabled'}>删除所选${state.selectedPhotoIds.size?`（${state.selectedPhotoIds.size}）`:''}</button></div><div class="phase1-photo-items">${state.photos.map(p=>`<article data-photo-id="${escapeNonstandard(p.id)}"><label><input type="checkbox" data-photo-check="${escapeNonstandard(p.id)}" ${state.selectedPhotoIds.has(p.id)?'checked':''}/></label><button type="button" data-photo-preview="${escapeNonstandard(p.id)}"><img src="${escapeNonstandard(new URL(p.src,location.href).href)}" alt="${escapeNonstandard(p.name)}"/><small>${escapeNonstandard(p.name)} · 第${p.page}页</small></button></article>`).join('')}</div>`;frame.append(pane);
      pane.querySelector('[data-photo-upload]').onclick=()=>photoUploadInput?.click();
      pane.querySelector('[data-photo-all]').onchange=e=>{state.selectedPhotoIds=e.target.checked?new Set(state.photos.map(p=>p.id)):new Set();renderPhotoGallery();};
      pane.querySelector('[data-photo-delete]').onclick=deleteSelectedPhotos;
      pane.querySelectorAll('[data-photo-check]').forEach(e=>e.onchange=()=>{e.checked?state.selectedPhotoIds.add(e.dataset.photoCheck):state.selectedPhotoIds.delete(e.dataset.photoCheck);renderPhotoGallery();});
      pane.querySelectorAll('[data-photo-preview]').forEach(e=>e.onclick=()=>{const p=state.photos.find(x=>x.id===e.dataset.photoPreview);if(!p)return;const box=document.createElement('div');box.className='ui-phase1-image-viewer';box.innerHTML=`<button type="button" aria-label="关闭票据预览">关闭预览</button><img src="${escapeNonstandard(new URL(p.src,location.href).href)}" alt="${escapeNonstandard(p.name)}"/>`;document.body.append(box);box.querySelector('button').onclick=()=>box.remove();box.onclick=event=>{if(event.target===box)box.remove();};});
    }
  }
  let photoUploadInput;
  function deleteSelectedPhotos(){
    if(guardMutation())return;const ids=new Set(state.selectedPhotoIds);if(!ids.size)return toast('请先勾选需要删除的随货单图片');
    const linked=state.receiptRows.filter(r=>ids.has(r.photoId));const linkedIds=new Set(linked.map(r=>r.id));
    if(state.inspectionItems.some(i=>i.status==='inbound'&&linkedIds.has(i.receiptRowId)))return toast('所选图片关联已入库追溯码，禁止删除');
    openConfirm('删除随货单图片后将重新匹配随货单并智能核准，请注意待核准数量的变化。',()=>{
      beginDynamic();setBusy('正在删除并重新智能核准',600);
      window.setTimeout(()=>{state.photos=state.photos.filter(p=>!ids.has(p.id));state.receiptRows=state.receiptRows.filter(r=>!linkedIds.has(r.id));state.inspectionItems.forEach(i=>{if(linkedIds.has(i.receiptRowId)){i.receiptRowId=null;i.receiptMatched=false;if(i.status==='ready'&&i.manualDecision!=='ready')i.status='pending';}});state.selectedPhotoIds.clear();state.photoSelected=state.photos.length>0;saveTaskSnapshot();showMain(state.photoSelected?'783_14519':'783_14372');toast(`已删除${ids.size}张票据，关联随货单已重新匹配`);},610);
    });
  }
  function bindPhotoPage() {
    const input=document.createElement('input');photoUploadInput=input;input.type='file';input.accept='image/png,image/jpeg';input.multiple=true;input.hidden=true;document.body.append(input);
    input.addEventListener('change',()=>{const files=[...input.files];input.value='';if(!files.length||guardMutation())return;const good=files.filter(file=>{if(!['image/png','image/jpeg'].includes(file.type)){toast('仅支持 PNG/JPG 图片');return false;}if(file.size>10*1024*1024){toast('单张图片不能超过10MB');return false;}return true;});if(!good.length)return;
      setBusy('正在识别随货单并重新智能核准',720);window.setTimeout(()=>{if(new URLSearchParams(location.search).get('photoFixture')==='ocr-fail'){toast('识别失败，请重新拍照或上传；本次未保存图片');return;}beginDynamic();const added=[];good.forEach(file=>{const photo={id:`photo-${crypto.randomUUID()}`,name:file.name,page:state.photos.length+1,src:URL.createObjectURL(file)};state.photos.push(photo);added.push(photo.id);});state.photoSelected=true;saveTaskSnapshot();showMain('783_14519');toast(`识别成功，新增${added.length}张随货单`);},730);
    });
    bindNode('783_14402',()=>input.click(),'photo-upload-empty','783_14398');bindNode('783_14619',()=>input.click(),'photo-upload-selected','783_14615');
    bindNode('783_14452',()=>selectPhoto(true),'photo-select-all-empty','783_14449');bindNode('783_14550',()=>selectPhoto(true),'photo-select-all-selected','783_14547');
    bindNode('783_14552',deleteSelectedPhotos,'photo-delete','783_14551');
    bindNodes(['783_14554','783_14559','783_14563','783_14567','783_14571'],(source)=>openPhotoLightbox(source),'photo-preview');
    [['783_14393','783_14372'],['783_14610','783_14519']].forEach(([targetId,frameId])=>bindNode(targetId,()=>{if(state.currentMain!==frameId||guardMutation())return;setBusy('正在识别随货单',720);window.setTimeout(()=>{if(new URLSearchParams(location.search).get('photoFixture')==='ocr-fail'){toast('识别失败，请重新拍照或上传；本次未保存图片');return;}beginDynamic();const photo={id:`photo-${crypto.randomUUID()}`,name:'拍摄票据',page:state.photos.length+1,src:'../../../assets/demo-receipt-1.png'};state.photos.push(photo);state.photoSelected=true;saveTaskSnapshot();showMain('783_14519');toast('识别成功');},730);},`photo-camera-${frameId}`));
  }
  function escapeNonstandard(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  function similarity(left, right) {
    const a = String(left || "").replace(/\s/g, "").toUpperCase();
    const b = String(right || "").replace(/\s/g, "").toUpperCase();
    if (!a || !b) return 0;
    const row = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i += 1) {
      let previous = row[0];
      row[0] = i;
      for (let j = 1; j <= b.length; j += 1) {
        const old = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
        previous = old;
      }
    }
    return 1 - row[b.length] / Math.max(a.length, b.length);
  }
  function phase2CandidateData(item, type) {
    const source = item || PRODUCTS[0];
    const baseName = source.name || source[0];
    const baseSpec = source.spec || source[1];
    const baseApproval = source.approval || source[2];
    const baseBatch = source.batch || source[3];
    const alternatives = [
      { name: baseName, spec: baseSpec, approval: baseApproval, batch: baseBatch, tag: "当前关联", replacement: false },
      { name: source.replacementName || `白云山 ${baseName}`, spec: baseSpec, approval: baseApproval, batch: `${baseBatch}-A`, tag: source.replaceable ? "易错替换" : "高相似候选", replacement: Boolean(source.replaceable) },
      { name: `${baseName}（集采）`, spec: baseSpec, approval: `${baseApproval}A`, batch: baseBatch, tag: type === "purchase" ? "合并发货" : "同行单候选", replacement: false }
    ];
    return alternatives.map((candidate, index) => {
      const clean = (value) => String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
      const batchScore = similarity(clean(baseBatch), clean(candidate.batch));
      const approvalScore = similarity(clean(baseApproval), clean(candidate.approval));
      const nameScore = similarity(baseName, candidate.name);
      const eligible = index === 0 || batchScore >= .8 || approvalScore >= .8 || nameScore >= .8;
      return { ...candidate, eligible, score: Math.round(Math.max(batchScore, approvalScore, nameScore) * 100) };
    });
  }
  function closePhase2Dialog() {
    frameDocument.querySelector(".ui-phase2-dialog-layer")?.remove();
  }
  function openPhase2CandidateDialog(type) {
    if (guardMutation()) return;
    const item = currentApproval();
    if (!item) return;
    closePhase2Dialog();
    const candidates = phase2CandidateData(item, type);
    const layer = frameDocument.createElement("div");
    layer.className = "ui-phase2-dialog-layer";
    const purchase = type === "purchase";
    const candidateCards = candidates.map((candidate,index)=>{
      const selected=index === (purchase ? item.purchaseCandidate : item.receiptCandidate);
      const visualScore=new URLSearchParams(location.search).get("visualFixture")==="figma-approval" ? (purchase && index===1?"—":purchase?"12":index===0?"12":"11") : String(candidate.score);
      const product=purchase
        ? `<div class="ui-phase2-candidate-product"><b><i class="${index===1?'rx':''}">${index===1?'RX':escapeNonstandard(item.category||'OTC')}</i>【${escapeNonstandard(item.drugId||'空drugid')}】${escapeNonstandard(candidate.name)} ${escapeNonstandard(candidate.spec)}</b><span>${escapeNonstandard(item.manufacturer||'暂无')}/${escapeNonstandard(candidate.approval)}</span><span>/${escapeNonstandard(item.barcode||'暂无')}</span></div>`
        : `<div class="ui-phase2-candidate-product"><b>${escapeNonstandard(candidate.name)} ${escapeNonstandard(candidate.spec)}</b><span>${escapeNonstandard(item.manufacturer||'暂无')}</span><span>${escapeNonstandard(candidate.approval)}</span></div>`;
      const detail=purchase
        ? `<div class="ui-phase2-candidate-orders">${(index===2?(item.purchaseLines||[2,3]):[(item.purchaseLines||[2])[0]]).map(count=>`<div><b>${escapeNonstandard(item.purchaseOrderNo||'CG2026001121')} 采购数量${count}</b><span>运单号：${escapeNonstandard(item.waybill)}</span><span>平台单号：${escapeNonstandard(item.platformOrder)}</span><span>采购时间：2026-09-13 14:29</span></div>`).join('')}</div>`
        : `<div class="ui-phase2-candidate-photo" role="img" aria-label="随货单候选行图片"></div>`;
      return `<label class="ui-phase2-candidate ${selected?'selected':''}" data-candidate-index="${index}"><input type="radio" name="candidate" value="${index}" ${selected?'checked':''}/><div class="ui-phase2-candidate-main">${product}${detail}</div><div class="ui-phase2-candidate-score"><b>得分：${visualScore}</b><span class="${index===0?'current':index===1&&purchase?'replacement':'merged'}">${escapeNonstandard(candidate.tag)}</span></div></label>`;
    }).join('');
    layer.innerHTML = `<div class="ui-phase2-dialog-shade" data-phase2-close></div><section class="ui-phase2-dialog ${purchase?'purchase':'receipt'}" role="dialog" aria-modal="true"><header><strong>${purchase ? "采购单商品匹配错误，换一个" : "随货单商品匹配错误，换一个"}</strong><button data-phase2-close aria-label="关闭">×</button></header><div class="ui-phase2-dialog-filters"><label>${purchase?'采购单信息':'随货单信息'}<input data-candidate-document autocomplete="off" aria-label="${purchase?'采购单信息':'随货单信息'}"/></label><label>商品信息<input data-candidate-product autocomplete="off" aria-label="商品信息"/></label></div><div class="ui-phase2-dialog-caption"><strong>请选择要替换的商品</strong>${purchase?'<button type="button" data-phase2-rematch>重新匹配系统单</button>':''}</div><div class="ui-phase2-candidates">${candidateCards}</div><footer><button data-phase2-close>取消</button><button class="primary" data-phase2-confirm>确定</button></footer></section>`;
    frameDocument.body.appendChild(layer);
    layer.querySelectorAll(".ui-phase2-candidate").forEach((label) => label.addEventListener("click", () => {
      layer.querySelectorAll(".ui-phase2-candidate").forEach((entry) => entry.classList.remove("selected")); label.classList.add("selected");
    }));
    const filterCandidates=()=>{
      const documentTerm=layer.querySelector('[data-candidate-document]').value.trim().toLowerCase();
      const productTerm=layer.querySelector('[data-candidate-product]').value.trim().toLowerCase();
      const cards=[...layer.querySelectorAll('.ui-phase2-candidate')];
      cards.forEach((card,index)=>{card.hidden=Boolean((documentTerm&&!card.textContent.toLowerCase().includes(documentTerm))||(productTerm&&!String(candidates[index].name).toLowerCase().includes(productTerm)));});
      const visible=cards.filter(card=>!card.hidden);
      if(visible.length && !visible.some(card=>card.querySelector('input').checked)){
        cards.forEach(card=>{card.classList.remove('selected');card.querySelector('input').checked=false;});
        visible[0].classList.add('selected');visible[0].querySelector('input').checked=true;
      }
      layer.querySelector('[data-phase2-confirm]').disabled=!visible.length;
    };
    layer.querySelectorAll('.ui-phase2-dialog-filters input').forEach(input=>input.addEventListener('input',filterCandidates));
    layer.querySelector("[data-phase2-rematch]")?.addEventListener("click", () => {
      setBusy("正在基于最新匹配池重新对码核准", 900);
      window.setTimeout(() => { item.systemMatched = true; item.matchScore = 94; renderApprovalPanel(); toast("重新匹配完成，候选集已刷新"); }, 910);
    });
    layer.querySelector("[data-phase2-confirm]").addEventListener("click", () => {
      const index = Number(layer.querySelector('input[name="candidate"]:checked')?.value || 0);
      if (type === "purchase") { item.purchaseCandidate = index; item.systemMatched = true; }
      else { item.receiptCandidate = index; item.receiptMatched = true; item.receiptRowId = state.receiptRows[index]?.id || null; }
      item.operationLogs.push(`${type === "purchase" ? "采购单" : "随货单"}候选切换`);
      saveTaskSnapshot(); closePhase2Dialog(); renderApprovalPanel(); toast("匹配结果已更新");
    });
    layer.querySelectorAll("[data-phase2-close]").forEach((button) => button.addEventListener("click", closePhase2Dialog));
  }
  function openReplacementDialog(item) {
    if (!item || guardMutation()) return;
    closePhase2Dialog();
    const layer = frameDocument.createElement("div");
    layer.className = "ui-phase2-dialog-layer";
    layer.innerHTML = `<div class="ui-phase2-dialog-shade" data-phase2-close></div><section class="ui-phase2-dialog ui-replacement-dialog" role="dialog" aria-modal="true"><header><div><strong>请选择合适的替换品</strong><small>替换后将重新执行系统单核准</small></div><button data-phase2-close>×</button></header><div class="ui-phase2-candidates">
      <label class="selected"><input type="radio" name="replacement" checked/><div><strong><i>OTC</i>【80000001】${escapeNonstandard(item.replacementName)}</strong><p>${escapeNonstandard(item.manufacturer)} / ${escapeNonstandard(item.approval)}</p></div></label>
      <label><input type="radio" name="replacement"/><div><strong><i class="rx">RX</i>【80000011】白云山 ${escapeNonstandard(item.name)}</strong><p>${escapeNonstandard(item.manufacturer)} / ${escapeNonstandard(item.approval)}</p></div></label>
      </div><footer><button data-phase2-close>取消</button><button class="primary" data-replace-confirm>确定</button></footer></section>`;
    frameDocument.body.appendChild(layer);
    layer.querySelectorAll("label").forEach((label) => label.addEventListener("click", () => { layer.querySelectorAll("label").forEach((entry) => entry.classList.remove("selected")); label.classList.add("selected"); }));
    layer.querySelector("[data-replace-confirm]").addEventListener("click", () => {
      const selected=[...layer.querySelectorAll('input[name="replacement"]')].findIndex(input=>input.checked);
      const replacement=selected===1?`白云山 ${item.name}`:item.replacementName;
      openConfirm(`确定将“${item.name}”替换为“${replacement}”（${selected===1?"RX":"OTC"}）并重新核准？`, () => {
      item.replacementName=replacement; item.category=selected===1?"RX":"OTC"; item.replaced = true; item.systemMatched = true; item.matchScore = 96; item.operationLogs.push("完成替换品操作并重新核准");
      saveTaskSnapshot(); closePhase2Dialog(); renderApprovalPanel(); toast("替换成功，系统已重新核准");
      });
    });
    layer.querySelectorAll("[data-phase2-close]").forEach((button) => button.addEventListener("click", closePhase2Dialog));
  }
  function approvalBadges(item) {
    return [
      item.replaced ? ["已替换入库", "blue"] : item.replaceable ? ["易错品，可平替其他商品入库", "blue"] : null,
      item.split ? [`拆零 ${item.split.from}→${item.split.to}`, "blue"] : null,
      item.oneCodeManyProducts ? ["一码多品", "orange"] : null,
      item.doubleCross ? ["双跨药：确保实物-采购单-美团处方分类一致", "orange"] : null,
      item.nearExpiry ? ["近效期：一年内的效期不可入库", "orange"] : null,
      !item.drugId ? ["空 drugid，禁止入库", "red"] : null
    ].filter(Boolean);
  }
  function canEnterReady(item) {
    return Boolean(item && !item.damaged && item.systemMatched && item.receiptMatched && !item.nearExpiry);
  }
  function renderApprovalPanel() {
    if (!frameDocument) return;
    const frame = frameDocument.getElementById("783_16867");
    if (!frame) return;
    frame.querySelector(".ui-phase2-approval-panel")?.remove();
    const item = currentApproval();
    if (!item) return;
    const quantity = item.codes.length;
    const badges = approvalBadges(item);
    const panel = frameDocument.createElement("section");
    panel.className = "ui-phase2-approval-panel";
    if (new URLSearchParams(location.search).get("visualFixture") === "figma-approval") panel.classList.add("is-visual-fixture");
    const purchaseLines = Array.isArray(item.purchaseLines) && item.purchaseLines.length ? item.purchaseLines : [item.expected || quantity];
    const comparison = [
      ["数量", item.expected || quantity, item.receiptMatched ? item.receiptQuantity ?? quantity : "—", item.comparisonPhysicalQuantity ?? quantity],
      ["商品名称", item.systemMatched ? item.name : "未匹配", item.receiptMatched ? item.name : "未匹配", item.name],
      ["规格", item.systemMatched ? item.spec : "未匹配", item.receiptMatched ? item.spec : "未匹配", item.spec],
      ["批准文号", item.systemMatched ? item.approval : "未匹配", item.receiptMatched ? item.approval : "未匹配", item.approval],
      ["生产厂家", item.systemMatched ? item.manufacturer : "未匹配", item.receiptMatched ? item.manufacturer : "未匹配", item.manufacturer],
      ["批号", item.batch, item.receiptMatched ? item.batch : "未匹配", item.batch],
      ["有效期", item.expiry, item.receiptMatched ? item.expiry : "未匹配", item.expiry]
    ];
    const compareRow = ([label, purchase, receipt, physical], index) => `<div class="ui-phase2-compare-row ${index === 0 ? "quantity" : ""}"><span>${escapeNonstandard(label)}</span><span>${escapeNonstandard(String(purchase ?? "暂无"))}</span><span>${escapeNonstandard(String(receipt ?? "暂无"))}</span><span>${escapeNonstandard(String(physical ?? "暂无"))}</span></div>`;
    panel.innerHTML = `<header class="ui-phase2-section-heading"><strong>实物入库信息</strong></header>
      <div class="ui-phase2-summary"><div><b>${escapeNonstandard(item.name || "未识别商品")} ${escapeNonstandard(item.spec || "")}</b><span>${escapeNonstandard(item.manufacturer || "未填写厂家")}</span><span>${escapeNonstandard(item.approval || "无批准文号")}</span></div><div><span>入库批次 / 效期</span><b>${escapeNonstandard(item.batch || "未填写")} / ${escapeNonstandard(item.expiry || "未填写")}</b><button data-edit-batch>编辑批次</button></div><div><span>入库数量=实录追溯码数量</span><b>${quantity}</b><button data-edit-trace>编辑追溯码</button></div></div>
      <h3>三方数据对比</h3><div class="ui-phase2-compare"><div class="ui-phase2-compare-head"><span></span><span>采购商品资料</span><span>随货单商品资料</span><span>实物商品资料</span></div>${comparison.slice(0,state.compareExpanded ? undefined : 1).map(compareRow).join("")}<button type="button" class="ui-phase2-compare-toggle" data-compare-toggle aria-expanded="${state.compareExpanded}">${state.compareExpanded ? "收起全部字段" : "展开全部字段"}</button></div>
      <div class="ui-phase2-match"><div class="ui-phase2-section-title"><b>采购单匹配结果:</b><button data-purchase-match>${item.systemMatched ? "匹配错了，换一个" : "匹配失败，请指定"}</button></div>${item.systemMatched ? `<div class="ui-phase2-purchase"><div class="ui-phase2-match-product"><b><i>${item.category || "OTC"}</i>${escapeNonstandard(item.purchaseDisplayName || (item.replaced ? item.replacementName : item.name))} ${escapeNonstandard(item.spec || "")}</b><span>${escapeNonstandard(item.manufacturer || "")}/${escapeNonstandard(item.approval || "")}</span><span>/${escapeNonstandard(item.barcode || "暂无")}</span>${badges.map(([text, tone]) => `<button class="badge ${tone}" ${text.startsWith("易错品") && !item.replaced ? "data-open-replacement" : ""}>${escapeNonstandard(text)}${text.startsWith("易错品") ? " ›" : ""}</button>`).join("")}</div>${purchaseLines.map((count,index)=>`<div class="ui-phase2-purchase-line"><b>CG2026001121 采购数量${count}</b><span>运单号：${escapeNonstandard(item.waybill)}</span><span>平台单号：${escapeNonstandard(item.platformOrder)}</span><span>采购时间：2026-09-13 14:29</span></div>`).join("")}</div>` : '<div class="ui-phase2-empty-match">匹配失败，请指定</div>'}</div>
      <div class="ui-phase2-match"><div class="ui-phase2-section-title"><b>随货单匹配结果:</b><button data-receipt-match>${item.receiptMatched ? "匹配错了，换一个" : "匹配失败，请指定"}</button></div>${item.receiptMatched ? `<div class="ui-phase2-receipt"><div class="ui-phase2-receipt-photo"><div class="ui-phase2-receipt-image" role="img" aria-label="随货单命中行"></div></div></div>` : '<div class="ui-phase2-empty-match">匹配失败，请指定</div>'}</div>
      <div class="ui-phase2-match ui-phase2-mt"><div class="ui-phase2-section-title"><b>美团商品匹配结果:</b></div><div class="ui-phase2-mt-content"><div class="ui-phase2-match-product"><b><i>${escapeNonstandard(item.category || "OTC")}</i>${escapeNonstandard(item.meituanName || item.name)} ${escapeNonstandard(item.spec || "")}</b><span>${escapeNonstandard(item.meituanManufacturer || item.manufacturer || "")}/${escapeNonstandard(item.meituanApproval || item.approval || "")}</span><span>/${escapeNonstandard(item.barcode || "暂无")}</span></div><div class="ui-phase2-product-strip" aria-label="美团商品参考图片">${Array.from({length:5},()=>'<span></span>').join("")}</div></div></div>
      <footer><button data-approval-pending>留在待核准</button><button class="primary" data-approval-ready ${canEnterReady(item) ? "" : "disabled"}>放入准入库</button></footer>`;
    frame.appendChild(panel);

    if (state.readOnly) panel.querySelectorAll("button").forEach(button => { button.hidden = true; });
    if (state.approvalSource) { const back = document.createElement("button"); back.type="button"; back.textContent="返回核准清单"; back.dataset.detailBack=""; back.onclick=()=>{const target=state.approvalSource;state.approvalSource="";state.readOnly=false;showMain(target);}; panel.querySelector("header").append(back); }
    panel.querySelector("[data-edit-batch]").addEventListener("click", () => openModal("783_17873"));
    panel.querySelector("[data-edit-trace]")?.addEventListener("click", () => openTraceEditor(item));
    panel.querySelector("[data-compare-toggle]")?.addEventListener("click", () => { state.compareExpanded = !state.compareExpanded; renderApprovalPanel(); });
    panel.querySelector("[data-purchase-match]").addEventListener("click", () => openPhase2CandidateDialog("purchase"));
    panel.querySelector("[data-receipt-match]").addEventListener("click", () => openPhase2CandidateDialog("receipt"));
    panel.querySelector("[data-open-replacement]")?.addEventListener("click", () => openReplacementDialog(item));
    panel.querySelector("[data-approval-pending]").addEventListener("click", () => { updateApprovalDecision("pending"); renderApprovalPanel(); toast("已留在待核准队列"); });
    panel.querySelector("[data-approval-ready]")?.addEventListener("click", () => { if (!canEnterReady(item)) return; updateApprovalDecision("ready"); renderApprovalPanel(); toast("已放入准入库，自动定位下一商品"); });
  }
  function statusConfig(frameId) {
    return {
      "783_18037": { status: "inbound", title: "已入库", action: "查看" },
      "783_18305": { status: "ready", title: "准入库", action: "查看核准详情", selectable: true },
      "783_18643": { status: "ready", title: "准入库", action: "查看核准详情", selectable: true },
      "783_20214": { status: "pending", title: "待核准", action: "查看核准详情", selectable: true },
      "783_18987": { status: "uninspected", title: "待验货", action: "去验货" }
    }[frameId];
  }
  function statusItemQuantity(item) {
    return item.codes.length;
  }
  function renderStatusOverlay(frameId) {
    const frame = frameDocument.getElementById(frameId);
    const config = statusConfig(frameId);
    if (!frame || !config) return;
    frame.querySelector(".ui-phase2-status-panel")?.remove();
    const items = config.status === "uninspected" ? [] : state.inspectionItems.filter((item) => item.status === config.status);
    const panel = frameDocument.createElement("section");
    panel.className = "ui-phase2-status-panel";
    const pending = config.status === "pending";
    const ready = config.status === "ready";
    const inbound = config.status === "inbound";
    const uninspected = config.status === "uninspected";
    if (pending) panel.classList.add("ui-phase2-status-pending");
    if (ready) panel.classList.add("ui-phase2-status-ready");
    if (inbound) panel.classList.add("ui-phase2-status-ready", "ui-phase2-status-inbound");
    if (uninspected) panel.classList.add("ui-phase2-status-uninspected");
    const toolbar = pending
      ? `<header><div class="ui-phase2-status-title"><strong>待核准</strong><button data-status-back>返回</button></div><div class="ui-phase2-status-toolbar"><div class="ui-phase2-filters"><input placeholder="药品名称" data-status-search/><input placeholder="批准文号" data-status-approval/><input placeholder="当前异常项" data-status-exception/><button data-status-filter>搜索</button></div><button class="primary" data-submit-inbound>放入准入库</button></div></header>`
      : ready
      ? `<header><div class="ui-phase2-status-title"><strong>准入库</strong><button data-status-back>返回</button></div><div class="ui-phase2-status-toolbar"><div class="ui-phase2-filters"><input placeholder="采购单号" data-status-order/><input placeholder="商品名称" data-status-search/><input placeholder="批准文号" data-status-approval/><button data-status-filter>搜索</button></div><div class="ui-phase1-status-actions"><button type="button" data-status-rollback>回退勾选项</button><button class="primary" data-submit-inbound>提交入库</button></div></div></header>`
      : inbound
      ? `<header><div class="ui-phase2-status-title"><strong>已入库</strong><button data-status-back>返回</button></div><div class="ui-phase2-status-toolbar"><div class="ui-phase2-filters"><input placeholder="采购单号" data-status-order/><input placeholder="商品名称" data-status-search/><input placeholder="批准文号" data-status-approval/><button data-status-filter>搜索</button></div></div></header>`
      : uninspected
      ? `<header><div class="ui-phase2-status-title"><strong>待验货</strong><button data-status-back>返回</button></div><div class="ui-phase2-status-toolbar"><div class="ui-phase2-filters"><input placeholder="页码数" data-receipt-page-query/><input placeholder="商品名称" data-status-search/><input placeholder="批准文号" data-status-approval/><button data-status-filter>搜索</button></div><label class="ui-receipt-only"><span>只看未验货</span><input type="checkbox" data-receipt-only ${state.onlyUninspected?"checked":""}/></label><button class="ui-receipt-delete" type="button" data-receipt-delete>删除</button></div></header>`
      : `<header><div><strong>${config.title}</strong><button data-status-back>返回</button></div><div class="ui-phase2-filters"><input placeholder="商品名称 / 批准文号 / 追溯码" data-status-search/><input placeholder="批次文号"/><button data-status-filter>搜索</button></div>${config.selectable ? `<div class="ui-phase1-status-actions"><button type="button" data-status-select-all>全选可操作项</button>${config.status==="ready"?'<button type="button" data-status-rollback>回退勾选项</button>':''}<button class="primary" data-submit-inbound>${config.status==="ready"?"提交入库":"放入准入库"}</button></div>` : ""}</header>`;
    const headings = pending
      ? `<div class="ui-phase2-status-head"><button type="button" data-status-select-all aria-label="全选待核准明细">□</button><span>药品名称/供应商</span><span>包装规格/制剂规格</span><span>批准文号/剂型厂家</span><span>批号/生产日期/效期</span><span>实录追溯码</span><span>操作</span></div>`
      : ready
      ? `<div class="ui-phase2-status-head"><button type="button" data-status-select-all aria-label="全选准入库明细">□</button><span>商品/规格</span><span>批准文号/条码/厂家</span><span>入库批号/生产日期/效期</span><span>采购数量/入库数量/单价</span><span>操作</span></div>`
      : inbound
      ? `<div class="ui-phase2-status-head"><span></span><span>商品/批准文号/条码/厂家</span><span>入库批号/生产日期/效期</span><span>采购数量/入库数量/单价</span><span>操作</span></div>`
      : uninspected
      ? `<div class="ui-phase2-status-head"><button type="button" data-receipt-select-all aria-label="全选未验货明细">□</button><span>行序号/商品</span><span>规格/批准文号</span><span>剂型/生产厂家</span><span>批号/生产日期/效期</span><span>包装数量/批次单价</span><span>验货标识</span></div>`
      : `<div class="ui-phase2-status-head"><span>${config.selectable ? "选择" : ""}</span><span>商品 / 规格</span><span>批准文号 / 厂家</span><span>批号 / 效期</span><span>数量 / 标签</span><span>操作</span></div>`;
    const receiptGroups = uninspected ? state.photos.map(photo=>{
      const matchedIds=new Set(state.inspectionItems.filter(item=>item.receiptMatched).map(item=>item.receiptRowId));
      const visible=state.receiptRows.filter(row=>row.photoId===photo.id && (!state.onlyUninspected || !matchedIds.has(row.id)));
      if(!visible.length)return "";
      const thumb=new URL(photo.src,location.href).href;
      const groupHeader=`<div class="ui-phase2-receipt-group" data-ready-group="${escapeNonstandard(photo.id)}"><input type="checkbox" data-receipt-group-check="${escapeNonstandard(photo.id)}" aria-label="勾选第${photo.page}页未验货明细"/><img src="${escapeNonstandard(thumb)}" alt="随货单第${photo.page}页缩略图"/><div><strong>第${photo.page}页</strong><small>${escapeNonstandard(state.tasks.find(task=>task.id===state.currentTaskId)?.supplier||"演示供应商")} / 业务单据号CG2026001121 / 销售日期2026-06-03 / 发货日期2026-06-03</small></div><button type="button" data-ready-group-toggle="${escapeNonstandard(photo.id)}" aria-label="折叠第${photo.page}页">⌃</button></div>`;
      return groupHeader+visible.map(row=>{
        const matched=matchedIds.has(row.id);
        return `<article data-receipt-row="${escapeNonstandard(row.id)}" data-ready-order="${escapeNonstandard(photo.id)}"><span><input type="checkbox" data-receipt-check="${escapeNonstandard(row.id)}" ${matched?"disabled":""}/></span><div><b>第${row.row}行/${escapeNonstandard(row.name)}</b><small>RL-${photo.page}-${String(row.row).padStart(2,"0")}</small></div><div><b>${escapeNonstandard(row.spec||"暂无")}</b><small>${escapeNonstandard(row.approval||"暂无")}</small></div><div><b>${escapeNonstandard(row.dosage||"暂无")}</b><small>${escapeNonstandard(row.manufacturer||"暂无")}</small></div><div><b>${escapeNonstandard(row.batch||"暂无")}</b><small>生产 ${escapeNonstandard(row.produceDate||"暂无")}</small><small>有效期 ${escapeNonstandard(row.expiry||"暂无")}</small></div><div><b>${row.packageQuantity??"暂无"}</b><small>¥${escapeNonstandard(row.batchPrice||"暂无")}</small></div><button class="${matched?"inspected":"uninspected"}" data-go-inspect>${matched?"已验货":"未验货"}</button></article>`;
      }).join("");
    }).join("") : "";
    const readyGroups = ready || inbound ? [...items.reduce((groups,item) => {
      const order=item.purchaseOrderNo || "CG2026001121";
      if(!groups.has(order)) groups.set(order,[]);
      groups.get(order).push(item);
      return groups;
    },new Map())].map(([order,group]) => {
      const first=group[0],supplier=state.tasks.find(task=>task.id===state.currentTaskId)?.supplier || "演示供应商";
      const groupHeader=`<div class="ui-phase2-ready-group" data-ready-group="${escapeNonstandard(order)}"><input type="checkbox" ${ready?`data-ready-group-check="${escapeNonstandard(order)}"`:"disabled"} aria-label="采购单${escapeNonstandard(order)}"/><div><strong>${escapeNonstandard(order)}</strong><small>掌店易 / ${ready?"待入库":"已入库"} / ${escapeNonstandard(supplier)} / 平台单号 ${escapeNonstandard(first.platformOrder)} / 运单号 ${escapeNonstandard(first.waybill)}</small></div><button type="button" data-ready-group-toggle="${escapeNonstandard(order)}" aria-label="折叠采购单">⌃</button></div>`;
      const lines=group.map(item=>{
        const disabled=!item.drugId||item.nearExpiry;
        const title=!item.drugId?"空drugid的系统单商品无法入库，请联系采购管理员处理":item.nearExpiry?"近效期：一年内的效期不可入库":"";
        if(inbound) return `<article data-status-item="${item.id}" data-ready-order="${escapeNonstandard(order)}"><span><input type="checkbox" disabled aria-label="已入库商品"/></span><div><b>${escapeNonstandard(item.name)}</b><small>${escapeNonstandard(order)}/${escapeNonstandard(item.barcode || "暂无")}</small><small>${escapeNonstandard(item.manufacturer)}</small></div><div><b>${escapeNonstandard(item.batch)}</b><small>生产 ${escapeNonstandard(item.produceDate || "暂无")}</small><small>有效期 ${escapeNonstandard(item.expiry)}</small></div><div><b>${item.expected || item.codes.length} / ${item.codes.length}</b><small>¥${escapeNonstandard(item.purchasePrice || "—")}</small></div><button data-status-detail="${item.id}">${config.action}</button></article>`;
        return `<article data-status-item="${item.id}" data-ready-order="${escapeNonstandard(order)}" class="${disabled?"disabled":""}" ${title?`title="${escapeNonstandard(title)}"`:""}><span><input type="checkbox" data-status-check="${item.id}" ${disabled?"disabled":""}/></span><div><b>${escapeNonstandard(item.name)}</b><small>${escapeNonstandard(item.spec)}</small></div><div><b>${escapeNonstandard(item.approval)}</b><small>${escapeNonstandard(item.barcode || "暂无")}</small><small>${escapeNonstandard(item.manufacturer)}</small></div><div><b>${escapeNonstandard(item.batch)}</b><small>生产 ${escapeNonstandard(item.produceDate || "暂无")}</small><small>有效期 ${escapeNonstandard(item.expiry)}</small></div><div><b>${item.expected || item.codes.length} / ${item.codes.length}</b><small>¥${escapeNonstandard(item.purchasePrice || "—")}</small></div><button data-status-detail="${item.id}">${config.action}</button></article>`;
      }).join("");
      return groupHeader+lines;
    }).join("") : "";
    const rows = config.status === "uninspected"
      ? (receiptGroups || `<div class="ui-phase2-empty-state"><b>暂无未验货明细</b><span>随货单识别后，未完成验货的行会出现在这里</span><button data-go-inspect>返回验货</button></div>`)
      : ready || inbound ? (readyGroups || `<div class="ui-phase2-empty-state"><b>当前清单为空</b><span>${ready?"核准后商品会自动出现在这里":"提交入库后商品会自动出现在这里"}</span></div>`)
      : items.map(item => {
        const disabled = config.status === "ready" && (!item.drugId || item.nearExpiry);
        const title = !item.drugId ? "空drugid的系统单商品无法入库，请联系采购管理员处理" : item.nearExpiry ? "近效期：一年内的效期不可入库" : "";
        const badges = approvalBadges(item);
        const check = config.selectable ? `<input type="checkbox" data-status-check="${item.id}" ${disabled ? "disabled" : ""}/>` : "";
        if (pending) {
          const dosage = /胶囊/.test(item.name) ? "胶囊剂" : /颗粒/.test(item.name) ? "颗粒剂" : /片/.test(item.name) ? "片剂" : "—";
          return `<article data-status-item="${item.id}"><span>${check}</span><div><b>${escapeNonstandard(item.name)}</b><small>${escapeNonstandard(item.manufacturer)}</small></div><div><b>${escapeNonstandard(item.spec)}</b><small>${dosage}</small></div><div><b>${escapeNonstandard(item.approval)}</b><small>${escapeNonstandard(item.manufacturer)}</small></div><div><b>${escapeNonstandard(item.batch)}</b><small>生产 ${escapeNonstandard(item.produceDate || "暂无")}</small><small>有效期 ${escapeNonstandard(item.expiry)}</small></div><div><b>${escapeNonstandard(item.codes[0] || "暂无")}</b></div><button data-status-detail="${item.id}">${config.action}</button></article>`;
        }
        return `<article data-status-item="${item.id}" class="${disabled ? "disabled" : ""}" ${title ? `title="${escapeNonstandard(title)}"` : ""}><span>${check}</span><div><b>${escapeNonstandard(item.name || "未识别商品")}</b><small>${escapeNonstandard(item.spec || "—")}</small></div><div><b>${escapeNonstandard(item.approval || "无批准文号")}</b><small>${escapeNonstandard(item.manufacturer || "未填写厂家")}</small></div><div><b>${escapeNonstandard(item.batch || "未填写")}</b><small>${escapeNonstandard(item.expiry || "未填写")}</small></div><div><b>${statusItemQuantity(item)}</b><small>${badges.slice(0,2).map(([text]) => escapeNonstandard(text)).join(" · ") || "普通入库"}</small></div><button data-status-detail="${item.id}">${config.action}</button></article>`;
      }).join("") || '<div class="ui-phase2-empty-state"><b>当前清单为空</b><span>流程状态变更后将自动同步到这里</span></div>';
    panel.innerHTML = `${toolbar}${headings}<div class="ui-phase2-status-body">${rows}</div>`;
    frame.appendChild(panel);
    panel.querySelector("[data-status-back]").addEventListener("click", () => showMain("783_16867"));
    panel.querySelector("[data-status-filter]").addEventListener("click", () => {
      const keyword = panel.querySelector("[data-status-search]").value.trim().toLowerCase();
      const orderKeyword = panel.querySelector("[data-status-order]")?.value.trim().toLowerCase() || "";
      const approvalKeyword = panel.querySelector("[data-status-approval]")?.value.trim().toLowerCase() || "";
      const exceptionKeyword = panel.querySelector("[data-status-exception]")?.value.trim().toLowerCase() || "";
      if(uninspected){
        const pageKeyword=panel.querySelector('[data-receipt-page-query]').value.trim();
        panel.querySelectorAll('[data-receipt-row]').forEach(element=>{
          const row=state.receiptRows.find(entry=>entry.id===element.dataset.receiptRow);
          element.hidden=Boolean(row&&((pageKeyword&&!String(row.page).includes(pageKeyword))||(keyword&&!String(row.name).toLowerCase().includes(keyword))||(approvalKeyword&&!String(row.approval).toLowerCase().includes(approvalKeyword))));
        });
        panel.querySelectorAll('[data-ready-group]').forEach(group=>group.hidden=![...panel.querySelectorAll(`[data-ready-order="${group.dataset.readyGroup}"]`)].some(row=>!row.hidden));
        return;
      }
      panel.querySelectorAll("[data-status-item]").forEach((row) => {
        const item = state.inspectionItems.find((entry) => entry.id === row.dataset.statusItem);
        const abnormal = item?.systemAbnormal ? "暂无" : "实物VS采购单账实不符";
        row.hidden = Boolean(item && ((keyword && !`${item.name} ${item.approval} ${item.batch} ${(item.codes || []).join(" ")}`.toLowerCase().includes(keyword)) || (orderKeyword && !String(item.purchaseOrderNo).toLowerCase().includes(orderKeyword)) || (approvalKeyword && !String(item.approval).toLowerCase().includes(approvalKeyword)) || (exceptionKeyword && !abnormal.toLowerCase().includes(exceptionKeyword))));
      });
      panel.querySelectorAll('[data-ready-group]').forEach(group=>{group.hidden=![...panel.querySelectorAll(`[data-ready-order="${group.dataset.readyGroup}"]`)].some(row=>!row.hidden);});
    });
    panel.querySelectorAll("[data-status-detail]").forEach((button) => button.addEventListener("click", () => {
      const item = state.inspectionItems.find((entry) => entry.id === button.dataset.statusDetail); if (!item) return;
      state.currentApprovalId = item.id; state.previousMain = frameId; state.approvalSource = frameId; state.readOnly = item.status === "inbound"; showMain("783_16867");
      if (state.readOnly) toast("已入库明细仅支持查看");
    }));
    panel.querySelectorAll("[data-status-check]").forEach((input) => input.addEventListener("change", () => { input.checked ? state.selectedLineIds.add(input.dataset.statusCheck) : state.selectedLineIds.delete(input.dataset.statusCheck); }));
    panel.querySelector('[data-receipt-only]')?.addEventListener('change',event=>{state.onlyUninspected=event.target.checked;renderStatusOverlay(frameId);});
    panel.querySelectorAll('[data-receipt-check]').forEach(input=>input.addEventListener('change',()=>{input.checked?state.selectedReceiptIds.add(input.dataset.receiptCheck):state.selectedReceiptIds.delete(input.dataset.receiptCheck);}));
    panel.querySelector('[data-receipt-select-all]')?.addEventListener('click',event=>{
      const available=[...panel.querySelectorAll('[data-receipt-check]:enabled')].filter(input=>!input.closest('[data-receipt-row]').hidden);
      const shouldSelect=available.some(input=>!input.checked);
      available.forEach(input=>{input.checked=shouldSelect;shouldSelect?state.selectedReceiptIds.add(input.dataset.receiptCheck):state.selectedReceiptIds.delete(input.dataset.receiptCheck);});
      event.currentTarget.textContent=shouldSelect?'☑':'□';
    });
    panel.querySelectorAll('[data-receipt-group-check]').forEach(input=>input.addEventListener('change',()=>{
      panel.querySelectorAll(`[data-ready-order="${input.dataset.receiptGroupCheck}"] [data-receipt-check]:enabled`).forEach(check=>{check.checked=input.checked;input.checked?state.selectedReceiptIds.add(check.dataset.receiptCheck):state.selectedReceiptIds.delete(check.dataset.receiptCheck);});
    }));
    panel.querySelector('[data-receipt-delete]')?.addEventListener('click',()=>{
      const ids=new Set([...state.selectedReceiptIds].filter(id=>uninspectedReceiptRows().some(row=>row.id===id)));
      if(!ids.size)return toast('请先勾选未验货明细');
      openConfirm(`确定删除选中的${ids.size}条随货单明细？`,()=>{
        ids.forEach(id=>state.deletedReceiptIds.add(id));
        state.receiptRows=state.receiptRows.filter(row=>!ids.has(row.id));
        state.selectedReceiptIds.clear();saveTaskSnapshot();renderStatusOverlay(frameId);toast(`已删除${ids.size}条未验货明细`);
      });
    });
    panel.querySelectorAll('[data-ready-group-check]').forEach(input=>input.addEventListener('change',()=>{
      const groupItems=items.filter(item=>(item.purchaseOrderNo||"CG2026001121")===input.dataset.readyGroupCheck);
      groupItems.forEach(item=>input.checked?state.selectedLineIds.add(item.id):state.selectedLineIds.delete(item.id));
      panel.querySelectorAll(`[data-ready-order="${input.dataset.readyGroupCheck}"] [data-status-check]:enabled`).forEach(check=>check.checked=input.checked);
    }));
    panel.querySelectorAll('[data-ready-group-toggle]').forEach(button=>button.addEventListener('click',()=>{
      const collapsed=button.getAttribute('aria-expanded')==='false';
      button.setAttribute('aria-expanded',String(collapsed));
      button.textContent=collapsed?'⌃':'⌄';
      panel.querySelectorAll(`[data-ready-order="${button.dataset.readyGroupToggle}"]`).forEach(row=>row.hidden=!collapsed);
    }));
    panel.querySelector('[data-status-select-all]')?.addEventListener('click',()=>{
      const available=items.filter(i=>config.status!=='ready'||(i.drugId&&!i.nearExpiry));
      const shouldSelect=available.some(i=>!state.selectedLineIds.has(i.id));
      available.forEach(i=>shouldSelect?state.selectedLineIds.add(i.id):state.selectedLineIds.delete(i.id));
      panel.querySelectorAll('[data-status-check]:enabled').forEach(e=>e.checked=shouldSelect);
      const all=panel.querySelector('.ui-phase2-status-head [data-status-select-all]');if(all)all.textContent=shouldSelect?'☑':'□';
    });
    panel.querySelector('[data-status-rollback]')?.addEventListener('click',()=>{const selected=items.filter(i=>state.selectedLineIds.has(i.id));if(!selected.length)return toast('请先勾选要回退的明细');beginDynamic();selected.forEach(i=>{i.status='pending';i.manualDecision='pending';});state.selectedLineIds.clear();saveTaskSnapshot();showMain('783_20214');toast(`已回退${selected.length}条至待核准`);});
    panel.querySelector('[data-submit-inbound]')?.addEventListener('click',()=>{const selected=items.filter(i=>state.selectedLineIds.has(i.id));if(!selected.length)return toast(config.status==='ready'?'请先勾选可入库的商品':'请先勾选待核准明细');
      if(config.status==='pending'){const invalid=selected.find(i=>!i.systemMatched);if(invalid)return toast(`${invalid.name}未匹配系统单据，无法放入准入库`);beginDynamic();selected.forEach(i=>{i.status='ready';i.manualDecision='ready';});state.selectedLineIds.clear();saveTaskSnapshot();showMain('783_18643');toast(`已放入准入库：${selected.length}条`);return;}
      if(selected.some(i=>!i.drugId||i.nearExpiry))return toast('所选明细有空drugid或近效期商品，无法提交');
      openConfirm('入库后库存将流入仓店可上架，是否继续？',()=>{beginDynamic();setBusy('正在校验并提交入库',760);window.setTimeout(()=>{let quantity=0;selected.forEach(i=>{i.status='inbound';quantity+=statusItemQuantity(i);i.operationLogs||=[];i.operationLogs.push(i.split?'拆零品入库日志':i.replaced?'替换品入库日志':'普通入库日志');});state.selectedLineIds.clear();saveTaskSnapshot();showMain('783_18037');toast(`入库成功：${selected.length}行，数量${quantity}`);},770);});
    });
    panel.querySelectorAll("[data-go-inspect]").forEach(button => button.addEventListener("click", () => showMain("783_15044")));
  }
  function renderStatusOverlays() {
    ["783_18037","783_18305","783_18643","783_18987","783_20214"].forEach(renderStatusOverlay);
  }
  function renderScanResults(){
    for(const frameId of ['783_14682','783_15044']){
      const frame=frameDocument.getElementById(frameId);if(!frame)continue;
      frame.querySelector('.ui-phase1-scan-results')?.remove();
      if(frameId!==state.currentMain)continue;
      const pane=frameDocument.createElement('section');pane.className='ui-phase1-scan-results';
      const result=state.lastScanResults;
      const rows=[['录入成功',result.success,'success'],['重复录入',result.duplicate,'duplicate'],['录入失败',result.failed,'failed']];
      const packageRows=result.packages||[];
      const count=tone=>result[tone].length+packageRows.reduce((sum,group)=>sum+group[tone].length,0);
      const total=count('success')+count('duplicate')+count('failed');
      pane.innerHTML=`<div class="phase1-scan-result-title"><strong>本次录入（${state.pendingScanEvents.length}）</strong><button type="button" data-scan-cancel-pending ${state.pendingScanEvents.length?'':'disabled'}>撤回待提交</button></div><form class="phase1-gun-scan"><input data-gun-scan autocomplete="off" inputmode="numeric" aria-label="扫码枪追溯码" placeholder="扫码枪录入追溯码，回车提交"/><button type="submit">录入</button></form><div class="phase1-package-fixtures"><span>模拟包装码：</span><button type="button" data-demo-package="3">扫描大包装码</button><button type="button" data-demo-package="2">扫描中包装码</button></div><div class="phase1-scan-pending">${state.pendingScanEvents.length?state.pendingScanEvents.map(event=>`<span>${escapeNonstandard(event.code)}</span>`).join(''):'<small>等待扫描追溯码</small>'}</div><div class="phase1-scan-result-title"><strong>上次录入（${total}）</strong><small>仅展示最近一次扫码结果</small></div><div class="phase1-scan-result-groups">${rows.map(([label,codes,tone])=>{const groups=packageRows.filter(group=>group[tone].length);return `<div class="phase1-scan-group"><span>${label} ${count(tone)}</span>${codes.length?`<div>${codes.map(code=>`<code class="${tone}">${escapeNonstandard(code)}</code>`).join('')}</div>`:''}${groups.map(group=>`<div class="phase1-package-group" data-package-level="${group.packageLevel}" data-package-parent="${escapeNonstandard(group.parentCode)}"><b>${escapeNonstandard(group.parentCode)}（${group.packageLevel===3?'大':'中'}包装码）解析为 ${group.success.length+group.duplicate.length+group.failed.length} 个小码：</b><div>${group[tone].map(code=>`<code class="${tone}">${escapeNonstandard(code)}</code>`).join('')}</div></div>`).join('')}${!codes.length&&!groups.length?'<small>无</small>':''}</div>`}).join('')}</div>`;
      frame.append(pane);
      pane.querySelector('.phase1-gun-scan').onsubmit=e=>{e.preventDefault();const input=e.currentTarget.querySelector('[data-gun-scan]'),code=input.value.trim();if(!code)return;runRecognition(code);};
      pane.querySelectorAll('[data-demo-package]').forEach(button=>button.onclick=()=>runRecognition(button.dataset.demoPackage==='3'?'62034803834789840000':'62034803834789850000'));
      pane.querySelector('[data-scan-cancel-pending]').onclick=()=>{window.clearTimeout(state.recognitionTimer);window.clearTimeout(state.scanSubmitTimer);state.pendingScanEvents=[];frameDocument.querySelector('.ui-demo-busy')?.remove();state.busy=false;setTextPattern(state.currentMain,/^本次录入（\d+）$/,'本次录入（0）');renderScanResults();toast('已撤回本次待提交录入');};
    }
  }
  function renderInspectionCards(){
    for(const frameId of ['783_14682','783_15044']){const frame=frameDocument.getElementById(frameId);if(!frame)continue;frame.querySelector('.ui-phase1-check-list')?.remove();if(!state.dynamic||frameId!==state.currentMain)continue;
      const cards=state.inspectionItems.filter(i=>!state.inspectionSearch||`${i.name} ${i.approval} ${i.batch} ${(i.codes||[]).join(' ')}`.toLowerCase().includes(state.inspectionSearch.toLowerCase()));const selectable=cards.filter(i=>i.status!=='inbound');
      const pane=document.createElement('section');pane.className='ui-phase1-check-list';pane.innerHTML=`<header><input data-check-search placeholder="扫描追溯码或者输入商品信息" value="${escapeNonstandard(state.inspectionSearch)}"/><span>已验货品批：${state.inspectionItems.length}</span></header><div class="phase1-check-actions"><label><input type="checkbox" data-check-all ${selectable.length&&selectable.every(i=>state.selectedInspectionIds.has(i.id))?'checked':''}/>全选</label><button data-check-delete ${state.selectedInspectionIds.size?'':'disabled'}>删除所选${state.selectedInspectionIds.size?`（${state.selectedInspectionIds.size}）`:''}</button></div><div class="phase1-check-cards">${cards.map(i=>`<article data-inspection-id="${escapeNonstandard(i.id)}"><div><label><input type="checkbox" data-check-id="${escapeNonstandard(i.id)}" ${state.selectedInspectionIds.has(i.id)?'checked':''} ${i.status==='inbound'?'disabled':''}/><b>${escapeNonstandard(i.name)} / ${escapeNonstandard(i.spec)}</b></label><small>${i.status==='inbound'?'已入库':i.status==='ready'?'准入库':'待核准'}</small></div><p>${escapeNonstandard(i.approval)} · 批号${escapeNonstandard(i.batch)} · 效期${escapeNonstandard(i.expiry)}</p><footer><button data-check-trace="${escapeNonstandard(i.id)}">追溯码 ${i.codes.length} ›</button><label>破损待采退 <input type="checkbox" data-check-damage="${escapeNonstandard(i.id)}" ${i.damaged?'checked':''} ${i.status==='inbound'?'disabled':''}/></label></footer><p class="phase1-latest-code">${escapeNonstandard(i.codes.at(-1)||'无追溯码')}</p></article>`).join('')||'<p class="phase1-check-empty">暂无验货明细</p>'}</div>`;frame.append(pane);
      pane.querySelector('[data-check-search]').onchange=e=>{state.inspectionSearch=e.target.value.trim();renderInspectionCards();};
      pane.querySelector('[data-check-all]').onchange=e=>{selectable.forEach(i=>e.target.checked?state.selectedInspectionIds.add(i.id):state.selectedInspectionIds.delete(i.id));renderInspectionCards();};
      pane.querySelector('[data-check-delete]').onclick=deleteSelectedInspections;
      pane.querySelectorAll('[data-check-id]').forEach(e=>e.onchange=()=>{e.checked?state.selectedInspectionIds.add(e.dataset.checkId):state.selectedInspectionIds.delete(e.dataset.checkId);renderInspectionCards();});
      pane.querySelectorAll('[data-check-trace]').forEach(e=>e.onclick=()=>openTraceEditor(state.inspectionItems.find(i=>i.id===e.dataset.checkTrace)));
      pane.querySelectorAll('[data-check-damage]').forEach(e=>e.onchange=()=>{const i=state.inspectionItems.find(x=>x.id===e.dataset.checkDamage);if(!i||i.status==='inbound')return;i.damaged=e.checked;if(i.damaged)i.status='pending';beginDynamic();saveTaskSnapshot();syncVisibleState();renderInspectionCards();toast(i.damaged?'已标记破损待采退':'已取消破损标记');});
    }
  }
  function deleteSelectedInspections(){if(guardMutation())return;const ids=new Set(state.selectedInspectionIds);if(!ids.size)return toast('请先勾选验货明细');if(state.inspectionItems.some(i=>ids.has(i.id)&&i.status==='inbound'))return toast('已入库卡片不可删除');openConfirm('确定删除选中的验货明细？',()=>{beginDynamic();state.inspectionItems=state.inspectionItems.filter(i=>!ids.has(i.id));state.selectedInspectionIds.clear();saveTaskSnapshot();syncVisibleState();renderInspectionCards();toast(`已删除${ids.size}条验货明细`);});}
  function bindInspectionPage() {
    bindNode("783_15180",()=>{if(!state.pendingScanEvents.length)return toast('上次录入已提交，请在验货卡片中逐条删除未入账追溯码');window.clearTimeout(state.recognitionTimer);window.clearTimeout(state.scanSubmitTimer);state.pendingScanEvents=[];frameDocument.querySelector('.ui-demo-busy')?.remove();state.busy=false;setTextPattern(state.currentMain,/^本次录入（\d+）$/,'本次录入（0）');renderScanResults();toast('已撤回本次待提交录入');},'scan-undo','783_15175');
    ["783_14682","783_15044"].forEach((id) => {
      const root = frameDocument.getElementById(id);
      bindNode(id === "783_14682" ? "783_14732" : "783_15094", () => { if (state.currentMain === id) runRecognition(); }, `scan-camera-${id}`);
      const damageIds = id === "783_14682" ? ["783_14815","783_14855","783_14893","783_14923","783_14983"] : ["783_15244","783_15285","783_15325","783_15355","783_15415"];
      damageIds.forEach((damageId, index) => bindNode(damageId, (label) => {
        if (guardMutation()) return;
        beginDynamic();
        const item = state.inspectionItems[index];
        if (item) { item.damaged = !item.damaged; item.status = "pending"; saveTaskSnapshot(); }
        const target = label.parentElement;
        target.dataset.active = target.dataset.active === "true" ? "false" : "true";
        target.classList.toggle("ui-demo-active", target.dataset.active === "true");
        toast(target.dataset.active === "true" ? "已标记破损待采退" : "已取消破损标记");
      }, `scan-damaged-${id}-${index}`));
      bindNode(id === "783_14682" ? "783_14793" : "783_15224",()=>{state.inspectionItems.filter(i=>i.status!=='inbound').forEach(i=>state.selectedInspectionIds.add(i.id));renderInspectionCards();toast(`已选择${state.selectedInspectionIds.size}条验货明细`);},`scan-select-all-${id}`);
      bindNode(id === "783_14682" ? "783_14795" : "783_15226",deleteSelectedInspections,`scan-delete-${id}`);
      const traceIds = id === "783_14682" ? ["783_14823","783_14861","783_14901","783_14931","783_14961","783_14989"] : ["783_15253","783_15293","783_15333","783_15363","783_15393","783_15421"];
      bindNodes(traceIds, (_source, index) => openTraceEditor(state.inspectionItems[index]), `scan-trace-${id}`);
      const search = labels(root, "扫描追溯码或者输入商品信息")[0];
      makeEditableLabel(search, (value) => {
        const keyword = value.toLowerCase();
        const names = allText(id, /\//).filter((node) => !["/"].includes(node.textContent.trim()));
        names.forEach((node, index) => {
          const item = state.inspectionItems[index];
          const matched = !keyword || `${item?.name} ${item?.approval} ${item?.batch} ${(item?.codes || []).join(" ")}`.toLowerCase().includes(keyword);
          node.parentElement?.parentElement?.parentElement?.classList.toggle("ui-demo-filtered", !matched);
        });
      });
    });
  }
  function bindApprovalPage() {
    bindNode("783_16986", () => { if (!guardMutation()) openModal("783_17873"); }, "approval-edit-batch", "783_16985");
    bindNode("783_16993", () => openTraceEditor(currentApproval()), "approval-edit-trace", "783_16992");
    [["783_16999","purchase"],["783_17026","receipt"]].forEach(([id, type]) => bindNode(id, () => {
      state.activeMatchType = type;
      state.selectedCandidate = state.activeMatchType === "purchase" ? currentApproval()?.purchaseCandidate || 0 : currentApproval()?.receiptCandidate || 0;
      openModal(state.activeMatchType === "purchase" ? "783_17644" : "783_17730");
    }, `approval-rematch-${type}`));
    bindNode("783_17120", () => openModal("783_17844"), "approval-gallery", "783_17119");
    bindNode("783_17094", (label) => {
      const expanded = label.dataset.expanded === "true";
      label.dataset.expanded = expanded ? "false" : "true";
      label.textContent = expanded ? "展开全部字段" : "收起全部字段";
      state.compareExpanded = !expanded;
      const card = label.parentElement?.parentElement?.parentElement;
      card?.classList.toggle("ui-demo-expanded", !expanded);
      toast(expanded ? "已收起对比字段" : "已展开全部对比字段");
    }, "approval-compare-expand", "783_17093");
    bindNode("783_16926", () => {
      if (guardMutation()) return;
      state.selectedQueueAction = "ready";
      const root = frameDocument.getElementById("783_16867");
      const item = node("783_16925");
      item?.classList.add("ui-demo-pop");
      setBusy("正在智能核准", 620);
      window.setTimeout(() => { updateApprovalDecision("ready"); toast("已放入准入库，自动定位下一商品"); }, 630);
    }, "approval-ready", "783_16925");
    bindNode("783_16928", () => { if (guardMutation()) return; state.selectedQueueAction = "pending"; updateApprovalDecision("pending"); toast("已移至待核准队尾"); }, "approval-pending", "783_16927");
    bindNodes(["783_16923","783_16934","783_16939","783_16944","783_16949","783_16954","783_16959","783_16964"], (_source, index) => { const item = approvalQueue()[index]; if (item) { state.currentApprovalId = item.id; syncApprovalFrame(); renderApprovalPanel(); } }, "approval-queue-item");
    const queueSearch = labels(frameDocument.getElementById("783_16867"), "待核准：8")[0] || allText("783_16867", /^待核准：\d+$/)[0];
    makeEditableLabel(queueSearch, (value) => {
      const keyword = value.replace(/^待核准：\d+/, "").trim().toLowerCase();
      allText("783_16867", /X\d+$/).forEach((node, index) => {
        const item = approvalQueue()[index];
        node.parentElement?.classList.toggle("ui-demo-filtered", Boolean(keyword && item && !`${item.name} ${item.codes.join(" ")}`.toLowerCase().includes(keyword)));
      });
    });
    bindNode("783_17027", () => { if (state.currentMain === "783_16867") openModal("783_17822"); }, "approval-receipt-hit");
  }
  function bindStatusPages() {
    const detailIds = {
      "783_18305":["783_18479","783_18521","783_18545","783_18569","783_18593"],
      "783_18643":["783_18821","783_18865","783_18889","783_18913","783_18937"],
      "783_20214":["783_20398","783_20440","783_20482","783_20524","783_20566","783_20608","783_20650","783_20793","783_20830"]
    };
    ["783_20214", "783_18305", "783_18643"].forEach((id) => {
      bindNodes(detailIds[id], (_source, index) => {
        const status = id === "783_20214" ? "pending" : "ready";
        const item = state.inspectionItems.filter((candidate) => candidate.status === status)[index] || state.inspectionItems[0];
        state.currentApprovalId = item?.id || ""; state.previousMain = id; state.approvalSource = id; state.readOnly = false; showMain("783_16867");
      }, `status-detail-${id}`);
    });
    bindNodes(["783_18199","783_18218","783_18255"], (_source, index) => {
      const item = state.inspectionItems.filter((candidate) => candidate.status === "inbound")[index] || state.inspectionItems[0];
      state.currentApprovalId = item?.id || ""; state.previousMain = "783_18037"; state.approvalSource = "783_18037"; state.readOnly = true; showMain("783_16867"); toast("已入库明细仅支持查看");
    }, "inbound-view-detail");
    ["783_18037","783_18305","783_18643","783_18987","783_20214"].forEach((id) => {
      const searchIds = {"783_18037":"783_18123","783_18305":"783_18391","783_18643":"783_18729","783_18987":"783_19073","783_20214":"783_20300"};
      if (searchIds[id]) bindNode(searchIds[id], () => { const root = frameDocument.getElementById(id); root?.classList.toggle("ui-demo-search-active"); toast("已按当前条件筛选"); }, `status-search-${id}`);
      const root = frameDocument.getElementById(id);
      const filterLabels = ["采购单号", "商品名称", "药品名称", "批准文号", "页码数", "当前异常项"];
      filterLabels.forEach((text) => labels(root, text).slice(0, 1).forEach((node) => {
        node.setAttribute("aria-label", `${text}筛选`);
        makeEditableLabel(node, (value) => {
          const keyword = value.toLowerCase();
          const rows = allText(id, /^(连花清瘟|CG10000002|第一页)/);
          rows.forEach((row) => row.parentElement?.parentElement?.parentElement?.classList.toggle("ui-demo-filtered", Boolean(keyword && !row.textContent.toLowerCase().includes(keyword))));
        });
      }));
    });
    bindNode("783_19086", () => openConfirm("确定删除所选待验货明细？", () => toast("所选明细已删除")), "uninspected-delete");
    ["783_18393","783_18732","783_20302"].forEach(id=>bindNode(id,()=>{const frame=frameDocument.getElementById(state.currentMain);frame?.querySelector('[data-submit-inbound]')?.click();},`status-submit-${id}`));
    bindNode("783_18402",()=>showMain("783_18643"),"ready-select-all");
    bindNode("783_18740",()=>{state.selectedLineIds.clear();showMain("783_18305");},"ready-unselect-all");
    bindNode("783_18698",()=>frameDocument.getElementById('783_18643')?.querySelector('[data-status-rollback]')?.click(),"ready-return-to-pending");
    labels(frameDocument.getElementById("783_18643"), "提交入库").forEach((label) => label.setAttribute("aria-label", "提交勾选项入库"));
    const readyRoot = frameDocument.getElementById("783_18643");
    if (readyRoot) {
      const revert = frameDocument.createElement("button");
      revert.className = "ui-demo-dev-action";
      revert.type = "button";
      revert.textContent = "回退勾选项至待核准";
      revert.setAttribute("aria-label", "回退勾选项至待核准");
      revert.hidden = true;
      revert.addEventListener("click", () => {
        if (guardMutation()) return;
        beginDynamic();
        state.inspectionItems.filter((item) => item.status === "ready").forEach((item) => { item.status = "pending"; item.manualDecision = "pending"; });
        saveTaskSnapshot(); showMain("783_20214"); toast("已回退至待核准");
      });
      readyRoot.appendChild(revert);
    }
  }
  function bindGallery() {
    const root = frameDocument.getElementById("783_17844");
    const turn = (delta) => {
      if (state.lastModal !== "783_17844") return;
      state.galleryIndex = delta < 0 ? (state.galleryIndex <= 1 ? 6 : state.galleryIndex - 1) : (state.galleryIndex >= 6 ? 1 : state.galleryIndex + 1);
      const counter = labels(root, "2/6")[0] || [...root.querySelectorAll("p")].find((p) => /^\d\/6$/.test(p.textContent.trim()));
      if (counter) counter.textContent = `${state.galleryIndex}/6`;
    };
    bindNode("783_17868", () => turn(-1), "gallery-previous");
    bindNode("783_17872", () => turn(1), "gallery-next");
  }
  function bindSharedNavigation() {
    bindNodes(["783_14419","783_14581","783_14704","783_15066","783_16889","783_18059","783_18327","783_18665","783_19009","783_20236"], () => { saveTaskSnapshot(); state.readOnly = false; showMain("783_15578"); }, "return-task-list");
    bindNodes(["783_18092","783_18360","783_19042","783_20269"], () => { state.readOnly = false; showMain("783_16867"); }, "return-approval");
    bindClosestNodes(["783_14423","783_14585","783_14707","783_15069","783_16892","783_18062","783_18330","783_18668","783_19012","783_20239"], '[class^="Pixso-frame-"]', () => switchStep("photo"), "step-photo");
    bindClosestNodes(["783_14430","783_14592","783_14715","783_15077","783_16899","783_18069","783_18337","783_18675","783_19019","783_20246"], '[class^="Pixso-frame-"]', () => switchStep("scan"), "step-scan");
    bindClosestNodes(["783_14439","783_14601","783_14724","783_15086","783_16908","783_18078","783_18346","783_18684","783_19028","783_20255"], '[class^="Pixso-frame-"]', () => switchStep("approve"), "step-approve");
    ["783_14372","783_14519","783_14682","783_15044","783_16867","783_18037","783_18305","783_18643","783_18987","783_20214"].forEach(bindStatusCards);
  }
  function bindInteractions() {
    bindTaskList();
    bindPhotoPage();
    bindInspectionPage();
    bindApprovalPage();
    bindStatusPages();
    bindGallery();
    bindSharedNavigation();
    Object.keys(MODALS).forEach(bindModalActions);
  }

  function reportContext() {
    const pageNames = {"783_14372":"拍单页","783_14519":"拍单页","783_14682":"验货页","783_15044":"验货页","783_16867":"核准页","783_18987":"待验货","783_20214":"待核准","783_18305":"准入库","783_18643":"准入库","783_18037":"已入库"};
    const task=state.tasks.find(t=>t.id===state.currentTaskId);
    const detail=state.currentMain==="783_16867";
    const item=detail ? currentApproval() : null;
    const config=statusConfig(state.currentMain);
    const current=document.getElementById(state.currentMain);
    const pageItems=config ? state.inspectionItems.filter(i=>i.status===config.status) : [];
    const visibleIds=[...(current?.querySelectorAll('[data-status-item]')||[])].filter(e=>!e.hidden).map(e=>e.dataset.statusItem);
    const filters=[...(current?.querySelectorAll('input:not([type="checkbox"]),[contenteditable="true"]')||[])].map(e=>({field:e.getAttribute('placeholder')||e.getAttribute('aria-label')||e.id,value:e.value??e.textContent}));
    const receiptRow=item?.receiptMatched?state.receiptRows.find(r=>r.id===item.receiptRowId)||null:null;
    const business=detail ? {inspection:item,receiptRow,systemMatched:item?.systemMatched,receiptMatched:item?.receiptMatched,readOnly:state.readOnly,approvalSections:item?approvalSnapshotSections(item,receiptRow):[]} : config ? {scope:"当前任务演示清单（无服务端分页）",filters,selectedIds:[...state.selectedLineIds],visibleIds,rows:config.status==="uninspected"?uninspectedReceiptRows():pageItems,uninspectedEvidence:config.status==="uninspected"?state.photos.map(photo=>({photoId:photo.id,page:photo.page,src:new URL(photo.src,location.href).href,rows:uninspectedReceiptRows().filter(row=>row.photoId===photo.id).map(row=>({row:row.row,name:row.name,box:{left:12,top:33+(row.row-1)*9,width:79,height:8}}))})).filter(evidence=>evidence.rows.length):[]} : pageNames[state.currentMain]==="拍单页" ? {photos:state.photos.map(photo=>({...photo,src:new URL(photo.src,location.href).href})),selectedPhotoIds:[...state.selectedPhotoIds]} : {lastScanResults:state.lastScanResults,inspectionItems:state.inspectionItems,filters};
    return {pageName:detail&&state.approvalSource?"核对详情页":pageNames[state.currentMain],sourcePage:state.approvalSource?pageNames[state.approvalSource]:"",capturedAt:new Date().toLocaleString('zh-CN',{hour12:false}),task:{id:task.id,supplier:task.supplier,waybill:task.waybill,storeName:"演示门店"},counts:counts(),item,business};
  }
  function approvalSnapshotSections(item,receiptRow){
    const qty=item.codes?.length||0,matched=item.systemMatched?'已匹配':'未匹配',receipt=item.receiptMatched?'已匹配':'未匹配';
    const purchase=item.systemMatched?(item.purchaseLines||[Math.max(1,qty)]).map((count,index)=>({title:`采购单明细 ${index+1}`,fields:[['采购单号',item.purchaseOrderNo||''],['采购单状态','待入库'],['采购数量',count],['采购单价',item.purchasePrice],['运单号',item.waybill],['平台单号',item.platformOrder],['采购时间','2026-09-13 14:29'],['商品编码',item.goodsCode]]})):[];
    const compare=[['数量',item.expected||qty,item.receiptMatched?item.receiptQuantity??qty:null,qty],['通用名称',item.systemMatched?item.name:null,receiptRow?.name,item.name],['规格',item.systemMatched?item.spec:null,item.receiptMatched?item.spec:null,item.spec],['批准文号',item.systemMatched?item.approval:null,item.receiptMatched?item.approval:null,item.approval],['生产厂家',item.systemMatched?item.manufacturer:null,item.receiptMatched?item.manufacturer:null,item.manufacturer],['批号',item.systemMatched?item.batch:null,item.receiptMatched?item.batch:null,item.batch],['生产日期',null,null,null],['有效期',item.systemMatched?item.expiry:null,item.receiptMatched?item.expiry:null,item.expiry]];
    return [
      {title:'实物入库数据',fields:[['商品名称',item.name],['商品规格',item.spec],['批准文号',item.approval],['生产厂家',item.manufacturer],['入库批号',item.batch],['入库有效期',item.expiry],['入库数量',qty],['实录追溯码',(item.codes||[]).join('、')],['破损待采退',item.damaged?'是':'否'],['核准状态',item.status==='inbound'?'已入库':item.status==='ready'?'准入库':'待核准']]},
      {title:'采购单匹配结果',fields:[['匹配状态',matched],['商品编码',item.systemMatched?item.goodsCode:null],['商品名称',item.systemMatched?item.name:null],['商品规格',item.systemMatched?item.spec:null],['批准文号',item.systemMatched?item.approval:null],['生产厂家',item.systemMatched?item.manufacturer:null],['处方分类',item.systemMatched?item.category:null],['匹配得分',item.systemMatched&&item.matchScore!=null?`${item.matchScore}%`:null]],rows:purchase},
      {title:'随货单匹配结果',fields:[['匹配状态',receipt],['随货单图片页码',receiptRow?.page],['随货单行号',receiptRow?.row],['商品名称',receiptRow?.name],['商品规格',item.receiptMatched?item.spec:null],['批准文号',item.receiptMatched?item.approval:null],['生产厂家',item.receiptMatched?item.manufacturer:null],['批号',item.receiptMatched?item.batch:null],['有效期',item.receiptMatched?item.expiry:null],['随货单数量',item.receiptMatched?item.receiptQuantity??qty:null]]},
      {title:'美团商品参考',fields:[['商品名称',item.meituanName||item.name],['规格',item.spec],['条码',item.barcode],['折后价',null],['生产厂家',item.meituanManufacturer||item.manufacturer],['批准文号',item.meituanApproval||item.approval],['处方分类',item.category],['商品图片','演示图 5 张']]},
      {title:'三方数据对比（采购单 / 随货单 / 实物）',fields:compare.map(([name,a,b,c])=>[name,`${a??'暂无'} / ${b??'暂无'} / ${c??'暂无'}`])}
    ];
  }
  function renderReportRails() {
    const map={"783_14372":"783_14423","783_14519":"783_14585","783_14682":"783_14707","783_15044":"783_15069","783_16867":"783_16892","783_18037":"783_18062","783_18305":"783_18330","783_18643":"783_18668","783_18987":"783_19012","783_20214":"783_20239"};
    for(const [frameId,labelId] of Object.entries(map)){
      const frame=document.getElementById(frameId);if(!frame)continue;
      let rail=frame.querySelector('.report-step-rail');
      if(!rail){
        const label=document.getElementById(labelId),wrapper=label?.parentElement?.parentElement?.parentElement?.parentElement;
        if(!wrapper)continue;
        // Replace the old exported rail subtree with a flow layout, preserving all domain handlers.
        const originalIcons=[...wrapper.querySelectorAll('*')].map(el=>getComputedStyle(el).backgroundImage.match(/url\("?([^")]+)"?\)/)?.[1]).filter(url=>url && /\/svg\d+\.svg$/.test(url));
        wrapper.replaceChildren();rail=document.createElement('nav');rail.className='report-step-rail';rail.setAttribute('aria-label','入库操作');
        rail.innerHTML=`<button type="button" data-task-back>← 返回任务列表</button>${[['photo','拍单'],['scan','验货'],['approve','核准']].map(([key,name],i)=>`<button type="button" data-step="${key}">${originalIcons[i]?`<img src="${originalIcons[i]}" alt=""/>`:''}<span>${name}</span></button>`).join('')}<button type="button" data-open-report>当前页面有异常</button>`;
        wrapper.append(rail);rail.querySelector('[data-task-back]').onclick=()=>{saveTaskSnapshot();state.readOnly=false;showMain('783_15578');};rail.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>switchStep(b.dataset.step));rail.querySelector('[data-open-report]').onclick=e=>reporting?.open(e);
      }
      const active=['783_14372','783_14519'].includes(frameId)?'photo':['783_14682','783_15044','783_18987'].includes(frameId)?'scan':['783_16867','783_18037','783_18305','783_18643','783_20214'].includes(frameId)?'approve':'';
      rail.querySelectorAll('[data-step]').forEach(b=>{if(b.dataset.step===active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    }
  }

  function applyVisualFixture() {
    if (new URLSearchParams(location.search).get("visualFixture") !== "figma-approval") return;
    const item = state.inspectionItems[0];
    Object.assign(item, {
      name: "布洛芬缓释胶囊", spec: "0.3g*20粒", manufacturer: "重庆祥耀医药有限公司",
      approval: "国药准字H20000000", batch: "B250301", expiry: "2027-03-30",
      codes: Array.from({length:8},(_,index)=>`8126002015160000000${index+1}`), expected: 1, receiptQuantity: 2, comparisonPhysicalQuantity: 1,
      purchaseLines: [2, 3], replaceable: false, drugId: "80000008",
      purchaseDisplayName: "白云山白云山白云山白云山 布洛芬缓释胶囊",
      meituanName: "白云山 布洛芬缓释胶囊", meituanManufacturer: "重庆祥耀医药有限公司",
      meituanApproval: "国药准字H20000000", barcode: "691212011102"
    });
  }

  function initializeFrame() {
    frameDocument = document;
    applyVisualFixture();
    const style = frameDocument.createElement("style");
    style.textContent = `
      @font-face{font-family:"Alibaba PuHuiTi 2.0-55 Regular";font-style:normal;font-weight:400;src:url(fonts/AlibabaPuHuiTi-2-55-Regular_1.ttf) format("truetype")}
      @font-face{font-family:"Alibaba PuHuiTi 2.0-65 Medium";font-style:normal;font-weight:500;src:url(fonts/AlibabaPuHuiTi-2-65-Medium_1.ttf) format("truetype")}
      @font-face{font-family:"Alibaba PuHuiTi 2.0-75 SemiBold";font-style:normal;font-weight:600;src:url(fonts/AlibabaPuHuiTi-2-75-SemiBold_1.ttf) format("truetype")}
      @font-face{font-family:"Roboto-Regular";font-style:normal;font-weight:400;src:url(fonts/Roboto-Regular_1.ttf) format("truetype")}
      html,body,.scroll-container{width:100%!important;height:100%!important;overflow:hidden!important}
      .Pixso-canvas-0_1{position:absolute!important;left:50%!important;top:50%!important;width:1366px!important;height:765px!important;overflow:hidden!important;transform:translate(-50%,-50%) scale(var(--ui-demo-scale))!important;transform-origin:center!important}
      [id="783_20705"]{width:1129px!important;min-width:1129px!important}
      body{margin:0!important;background:#f7f8fc!important}
      [class^="stroke-wrapper-"] > [class^="Pixso-frame-"]:empty{z-index:0!important;pointer-events:none!important}
      [class*="-content-layer"]{z-index:2!important}
      [class^="stroke-"]:not([class^="stroke-wrapper-"]){z-index:1!important;pointer-events:none!important}
      .ui-demo-backdrop{display:block!important;position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.45)}
      .ui-demo-toast{position:fixed;left:50%;top:76px;transform:translateX(-50%);z-index:12000;padding:10px 18px;border-radius:10px;background:rgba(28,36,62,.94);color:#fff;font:500 14px/20px "Alibaba PuHuiTi 2.0-65 Medium";box-shadow:0 12px 36px rgba(24,35,65,.25);pointer-events:none;animation:uiToast .18s ease-out}
      .ui-demo-busy{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:12001;display:flex;align-items:center;gap:10px;padding:14px 20px;border-radius:12px;background:rgba(28,36,62,.94);color:#fff;box-shadow:0 18px 50px rgba(24,35,65,.28)}
      .ui-demo-busy span{width:16px;height:16px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:uiSpin .7s linear infinite}.ui-demo-busy p{margin:0!important;color:#fff!important;font:500 14px/20px "Alibaba PuHuiTi 2.0-65 Medium"!important}
      .ui-demo-confirm{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:12002;width:360px;padding:22px;border-radius:14px;background:#fff;box-shadow:0 20px 70px rgba(24,35,65,.25);font-family:"Alibaba PuHuiTi 2.0-55 Regular"}.ui-demo-confirm p{margin:0 0 22px!important;font-size:16px!important;line-height:24px!important;color:#1d2742!important;white-space:normal!important}.ui-demo-confirm div{display:flex;justify-content:flex-end;gap:10px}.ui-demo-confirm button{min-width:72px;height:34px;border:1px solid #d5dced;border-radius:7px;background:#fff;color:#34415f;cursor:pointer}.ui-demo-confirm button[data-confirm]{border-color:#4f6ef7;background:#4f6ef7;color:#fff}
      .ui-demo-active{filter:saturate(1.5);outline:2px solid rgba(255,167,38,.45);outline-offset:2px}.ui-demo-pop{animation:uiPop .45s ease-out}
      .ui-demo-candidate-selected{outline:2px solid #4f6ef7!important;outline-offset:2px;border-radius:8px}.ui-demo-invalid{outline:1px solid #ff596f!important;background:#fff1f3!important}.ui-demo-expanded{min-height:150px!important;overflow:visible!important}.ui-demo-filtered{opacity:.18!important;pointer-events:none!important}.ui-demo-search-active{filter:saturate(.92)}
      [role="button"]:focus-visible{outline:2px solid #315efb!important;outline-offset:2px!important}
      @keyframes uiSpin{to{transform:rotate(360deg)}}@keyframes uiToast{from{opacity:0;transform:translate(-50%,-8px)}}@keyframes uiPop{50%{transform:scale(1.04)}}
    `;
    frameDocument.head.appendChild(style);
    FRAME_IDS.forEach((id) => { const frame = frameDocument.getElementById(id); if (frame) frame.style.display = "none"; });
    bindInteractions();
    reporting = window.createInboundReporting({state,context:reportContext});
    const requested = requestedFrame();
    if (MAIN_FRAME_IDS.has(requested)) showMain(requested);
    else if (MODALS[requested]) {
      showMain(requested === "783_15476" ? "783_15044" : "783_16867");
      openModal(requested);
    } else showMain("783_15578");
    frameDocument.body.classList.add("ui-demo-ready");
  }
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("DOMContentLoaded", () => {
    resizeCanvas();
    initializeFrame();
  });
})();
