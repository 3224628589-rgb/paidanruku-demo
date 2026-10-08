/* Local reporting prototype. All business data comes from the existing inbound store. */
window.createInboundReporting = function (adapter) {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clone = value => JSON.parse(JSON.stringify(value));
  const types = [
    {id:'recognition', name:'识别结果异常', hint:'请指出页面中识别不正确的信息', words:['随货单识别错误，','追溯码无法识别，'], upload:'可补充随货单原图或追溯码照片'},
    {id:'matching', name:'商品匹配异常', hint:'请说明实物与采购单或随货单的差异', words:['采购单匹配错误，','随货单匹配错误，'], upload:'可补充实物包装与随货单照片'},
    {id:'inbound', name:'入库操作异常', hint:'请说明操作步骤及页面提示', words:['无法提交入库，','入库结果与预期不一致，'], upload:'可补充报错信息或相关单据'},
    {id:'other', name:'其他异常', hint:'请描述当前页面遇到的问题', words:['页面显示异常，','操作没有响应，'], upload:'可补充与问题有关的图片'}
  ];
  const fault = new URLSearchParams(location.search).get('reportFixture');
  let draft = null, layer = null, opener = null, sequence = 0;
  const db = adapter.state.reporting = { tickets: [], draft: null };
  const type = () => types.find(t => t.id === draft?.typeId);
  const setError = message => { const el=layer?.querySelector('[data-report-error]'); if(el){el.textContent=message;el.hidden=!message;} };
  function dispose() { layer?.remove();layer=null;draft=null;db.draft=null;opener?.focus(); }
  function shell(content, footer) {
    layer = document.createElement('div'); layer.className='report-layer';layer.dataset.html2canvasIgnore='true';
    layer.innerHTML=`<section class="report-dialog" role="dialog" aria-modal="true" aria-labelledby="report-title"><header><div><h2 id="report-title">当前页面有异常</h2><span>${esc(draft.context.pageName)} · ${esc(draft.context.task.id)}</span></div><button type="button" data-report-close aria-label="关闭异常提报">×</button></header>${content}<footer><p data-report-error role="alert" hidden></p><div>${footer}</div></footer></section>`;
    document.body.append(layer);
    layer.querySelector('[data-report-close]').onclick=cancel;
    layer.addEventListener('keydown', e=>{
      if(e.key==='Escape'){e.preventDefault();cancel();}
      if(e.key!=='Tab')return;
      const scope=layer.querySelector('.report-discard')||layer;
      const focusable=[...scope.querySelectorAll('button,input,select,textarea,summary,[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length);
      const first=focusable[0],last=focusable.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
    });
  }
  function renderForm() {
    layer?.remove();
    shell(`<div class="report-body"><section class="report-evidence"><div class="report-section-title"><strong>页面快照</strong><time>${esc(draft.context.capturedAt)}</time></div><button class="report-capture" type="button" data-capture-preview disabled><span>正在保存页面快照…</span></button><p data-capture-message>正在记录当前页面，请稍候</p><div class="report-capture-recovery" hidden><button type="button" data-capture-retry>重试截图</button><label class="report-button">上传页面截图<input type="file" accept="image/png,image/jpeg" data-manual-capture hidden></label></div><details><summary>查看业务信息快照</summary><div data-snapshot-info></div></details></section><form class="report-form" novalidate><label for="report-type">异常类型 <em>*</em></label><select id="report-type" data-report-type><option value="">请选择异常类型</option>${types.map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</select><p class="report-hint" data-type-hint></p><div class="report-config-error" hidden>异常配置加载失败<button type="button" data-config-retry>重新加载</button></div><label for="report-description">异常描述 <small>选填</small></label><textarea id="report-description" rows="3" placeholder="请描述您发现的问题" data-report-description></textarea><div class="report-word-row"><div data-report-words></div><span data-word-count>0 / 100</span></div><div class="report-section-title"><strong>补充图片 <small>选填</small></strong><span data-attachment-count>0 / 10</span></div><p class="report-hint" data-upload-hint></p><div class="report-attachments" data-report-attachments></div><label class="report-upload">＋ 上传图片<input type="file" multiple accept="image/png,image/jpeg" data-report-upload hidden></label><small class="report-file-rule">JPG / PNG，最多10张，单张不超过3MB</small></form></div>`, `<button type="button" data-report-cancel>取消</button><button type="button" class="report-primary" data-report-submit>提交异常</button>`);
    layer.querySelector('[data-report-cancel]').onclick=cancel;
    layer.querySelector('[data-report-type]').value=draft.typeId;
    layer.querySelector('[data-report-description]').value=draft.description;
    layer.querySelector('[data-report-type]').onchange=e=>{draft.typeId=e.target.value;draft.dirty=true;updateType();};
    layer.querySelector('[data-report-description]').oninput=e=>{draft.description=e.target.value;draft.dirty=true;updateCounter();};
    layer.querySelector('[data-report-upload]').onchange=e=>{upload([...e.target.files]);e.target.value='';};
    layer.querySelector('[data-report-submit]').onclick=submit;
    layer.querySelector('[data-capture-preview]').onclick=()=>preview(draft.capture,'提报时页面快照');
    layer.querySelector('[data-capture-retry]').onclick=retryCapture;
    layer.querySelector('[data-manual-capture]').onchange=async e=>{const current=draft,f=e.target.files[0];if(!validFile(f))return;try{const src=await readImage(f);if(draft!==current)return;draft.capture=src;draft.captureStatus='ready';draft.dirty=true;updateCapture();setError('');}catch{if(draft===current)setError('截图文件无法读取，请重新选择');}};
    layer.querySelector('[data-config-retry]').onclick=()=>{draft.configReady=true;layer.querySelector('.report-config-error').hidden=true;layer.querySelector('[data-report-type]').disabled=false;draft.typeId=types[0].id;layer.querySelector('[data-report-type]').value=draft.typeId;updateType();setError('');};
    layer.querySelector('[data-snapshot-info]').innerHTML=snapshotHTML(draft.context);
    renderTaskPhotoPicker();
    updateType();updateCounter();renderAttachments();updateCapture();
    if(!draft.configReady){layer.querySelector('.report-config-error').hidden=false;layer.querySelector('[data-report-type]').disabled=true;}
    layer.querySelector('[data-report-type]').focus();
  }
  function snapshotHTML(context) {
    const dl=(fields,keepEmpty=false)=>`<dl>${fields.map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v===null||v===undefined||v===''?(keepEmpty?'':'暂无'):v)}</dd>`).join('')}</dl>`;
    const approvalDetail=Boolean(context.business.approvalSections?.length);
    const basics=[['业务单据号',approvalDetail?(context.item?.systemMatched?context.item?.purchaseOrderNo||'':''):context.task.id],['业务商品码',context.item?.systemMatched?context.item?.goodsCode:''],['业务通信id',context.item?.id||context.task.id]];
    const taskInfo=`<section data-report-business-section="入库任务信息"><h5>入库任务信息</h5>${dl([['来货供应商',context.task.supplier],['来货运单号',context.task.waybill||'暂无'],['提报页面截图','随工单保存，见页面快照'],['提报页面',context.pageName],['提报时间',context.capturedAt]])}</section>`;
    if(context.business.approvalSections?.length){
      return `<div class="report-business-snapshot"><h4>工单基本信息</h4>${dl(basics,true)}<h4>业务拓展信息</h4>${taskInfo}${context.business.approvalSections.map(section=>`<section data-report-business-section="${esc(section.title)}"><h5>${esc(section.title)}</h5>${dl(section.fields)}${(section.rows||[]).map(row=>`<div class="report-business-row"><b>${esc(row.title)}</b>${dl(row.fields)}</div>`).join('')}</section>`).join('')}</div>`;
    }
    const rows=context.business.rows||context.business.inspectionItems||[];
    const info=context.item ? [['商品规格',context.item.spec],['批准文号',context.item.approval],['生产厂家',context.item.manufacturer],['批号 / 效期',`${context.item.batch} / ${context.item.expiry}`],['实录数量',context.item.codes.length],['采购单匹配',context.item.systemMatched?'已匹配':'未匹配'],['随货单匹配',context.item.receiptMatched?'已匹配':'未匹配']] : [['明细数量',rows.length],['已拍随货单',context.business.photos?.length??'—']];
    const evidence=(context.business.uninspectedEvidence||[]).map(photo=>`<div class="report-ocr-evidence"><strong>第${esc(photo.page)}页 · 未验货明细 ${photo.rows.length} 条</strong><div class="report-ocr-image"><img src="${esc(photo.src)}" alt="第${esc(photo.page)}页随货单"/>${photo.rows.map(row=>`<span class="report-ocr-box" style="left:${row.box.left}%;top:${row.box.top}%;width:${row.box.width}%;height:${row.box.height}%" title="第${esc(row.row)}行 ${esc(row.name)}"></span>`).join('')}</div></div>`).join('');
    return `<div class="report-business-snapshot"><h4>工单基本信息</h4>${dl(basics)}<h4>业务拓展信息</h4>${taskInfo}<section data-report-business-section="${esc(context.pageName)}"><h5>${esc(context.pageName)}信息</h5>${dl(info)}${rows.length?`<div class="report-snapshot-rows">${rows.map(r=>`<p>${esc(r.name)} ${esc(r.spec||'')}<small>${esc(r.batch||`第${r.page}页 · 第${r.row}行`)}</small></p>`).join('')}</div>`:''}</section>${evidence?`<section data-report-business-section="未验货随货单图片"><h5>未验货随货单图片</h5>${evidence}</section>`:''}</div>`;
  }
  function renderTaskPhotoPicker(){
    if(!layer||!draft||draft.context.pageName!=='拍单页')return;
    const evidence=layer.querySelector('.report-evidence');
    if(!evidence)return;
    let picker=evidence.querySelector('[data-task-photo-picker]');
    if(!picker){picker=document.createElement('section');picker.className='report-task-photos';picker.dataset.taskPhotoPicker='';evidence.append(picker);}
    const photos=draft.context.business.photos||[];
    picker.innerHTML=`<div class="report-section-title"><strong>当前拍单图片</strong><span>${photos.length} 张 · 点击可加入补充图片</span></div>${photos.length?`<div class="report-task-photo-list">${photos.map(photo=>{
      const added=draft.attachments.some(a=>a.sourcePhotoId===photo.id),pending=draft.pendingPhotoIds.has(photo.id);
      return `<button type="button" data-add-task-photo="${esc(photo.id)}" ${added||pending||draft.busy?'disabled':''} aria-label="${added?'已添加':'添加'}${esc(photo.name)}至补充图片"><img src="${esc(photo.src)}" alt=""/><span>${esc(photo.name)}<small>第${esc(photo.page)}页 · ${pending?'添加中…':added?'已添加':'点击添加'}</small></span></button>`;
    }).join('')}</div>`:'<p class="report-task-photo-empty">暂无已拍图片，可在右侧上传补充图片</p>'}`;
    picker.querySelectorAll('[data-add-task-photo]').forEach(button=>button.onclick=()=>addTaskPhoto(button.dataset.addTaskPhoto));
  }
  async function addTaskPhoto(photoId){
    if(!draft||draft.busy||draft.pendingPhotoIds.has(photoId)||draft.attachments.some(a=>a.sourcePhotoId===photoId))return;
    const photo=(draft.context.business.photos||[]).find(p=>p.id===photoId);
    if(!photo)return;
    if(draft.attachments.length+draft.pendingPhotoIds.size>=10){setError('最多10张补充图片，请减少后再上传');return;}
    const current=draft;
    current.pendingPhotoIds.add(photoId);renderTaskPhotoPicker();setError('');
    try{
      const response=await fetch(photo.src);
      if(!response.ok)throw new Error('photo fetch failed');
      const blob=await response.blob();
      if(draft!==current)return;
      const mime=blob.type||(/\.jpe?g$/i.test(photo.name)?'image/jpeg':'image/png');
      const file=new File([blob],photo.name||`随货单-${photo.page}.png`,{type:mime});
      await upload([file],photoId);
    }catch{if(draft===current)setError('图片读取失败，请重试或在右侧上传');}
    finally{current.pendingPhotoIds.delete(photoId);if(draft===current)renderTaskPhotoPicker();}
  }
  function updateType(){const t=type();layer.querySelector('[data-type-hint]').textContent=t?.hint||'请选择有效的异常类型';layer.querySelector('[data-upload-hint]').textContent=t?.upload||'';layer.querySelector('[data-report-words]').innerHTML=(t?.words||[]).map((w,i)=>`<button type="button" data-word="${i}">${esc(w)}</button>`).join('');layer.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>{const input=layer.querySelector('textarea'),w=t.words[Number(b.dataset.word)],a=input.selectionStart,z=input.selectionEnd,next=input.value.slice(0,a)+w+input.value.slice(z);if(Array.from(next).length>100){setError('异常描述最多100字符，预填词未插入');return;}input.value=draft.description=next;draft.dirty=true;input.focus();input.setSelectionRange(a+w.length,a+w.length);updateCounter();setError('');});}
  function updateCounter(){const n=Array.from(draft.description).length;layer.querySelector('[data-word-count]').textContent=`${n} / 100`;layer.querySelector('[data-word-count]').classList.toggle('report-invalid',n>100);}
  function updateCapture(){if(!layer||!draft)return;const b=layer.querySelector('[data-capture-preview]'),m=layer.querySelector('[data-capture-message]');if(!b)return;layer.querySelector('.report-capture-recovery').hidden=draft.captureStatus!=='failed';b.disabled=draft.captureStatus!=='ready';if(draft.captureStatus==='ready'){b.innerHTML=`<img src="${draft.capture}" alt="提报时页面快照"/>`;m.textContent='已保存页面快照，您在当前页面发现的异常是？';}else if(draft.captureStatus==='failed'){b.innerHTML='<span>页面截图失败</span>';m.textContent='请重试或上传刚才页面的截图；如现场已变化，请取消后重新提报。';layer.querySelector('.report-capture-recovery').hidden=false;}else{b.innerHTML='<span>正在保存页面快照…</span>';}}
  function validFile(f){if(!f)return false;if(!['image/png','image/jpeg'].includes(f.type)){setError('仅支持 JPG / PNG 图片');return false;}if(f.size>3*1024*1024){setError('单张图片不能超过3MB');return false;}return true;}
  function readImage(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onload=()=>resolve(reader.result);img.onerror=reject;img.src=reader.result;};reader.readAsDataURL(file);});}
  async function upload(files,sourcePhotoId){if(draft.busy)return;const current=draft;if(draft.attachments.length+files.length>10){setError('最多10张补充图片，请减少后再上传');return;}for(const file of files){if(draft!==current)return;if(!validFile(file))continue;const item={id:`upload-${++sequence}`,name:file.name,status:'loading',file,sourcePhotoId};draft.attachments.push(item);draft.dirty=true;renderAttachments();await loadAttachment(item);} }
  async function loadAttachment(item){item.status='loading';renderAttachments();try{if(item.file)item.src=await readImage(item.file);else await new Promise((r,j)=>{const i=new Image();i.onload=r;i.onerror=j;i.src=item.src;});item.status='ready';}catch{item.status='failed';}renderAttachments();}
  function renderAttachments(){if(!layer||!draft)return;const root=layer.querySelector('[data-report-attachments]');if(!root)return;root.innerHTML=draft.attachments.map(a=>`<div class="report-thumb"><button type="button" data-preview-attachment="${a.id}" ${a.status!=='ready'?'disabled':''}>${a.status==='ready'?`<img src="${esc(a.src)}" alt="${esc(a.name)}"/>`:`<span>${a.status==='loading'?'上传中…':'上传失败'}</span>`}</button><button class="report-remove" type="button" data-remove-attachment="${a.id}" aria-label="删除${esc(a.name)}">×</button>${a.status==='failed'?`<button type="button" data-retry-attachment="${a.id}">重试</button>`:''}<small>${esc(a.name)}</small></div>`).join('');layer.querySelector('[data-attachment-count]').textContent=`${draft.attachments.length} / 10`;root.querySelectorAll('[data-remove-attachment]').forEach(b=>b.onclick=()=>{if(draft.busy)return;draft.attachments=draft.attachments.filter(a=>a.id!==b.dataset.removeAttachment);draft.dirty=true;renderAttachments();});root.querySelectorAll('[data-preview-attachment]').forEach(b=>b.onclick=()=>{const a=draft.attachments.find(a=>a.id===b.dataset.previewAttachment);preview(a.src,a.name);});root.querySelectorAll('[data-retry-attachment]').forEach(b=>b.onclick=()=>loadAttachment(draft.attachments.find(a=>a.id===b.dataset.retryAttachment)));renderTaskPhotoPicker();}
  function cancel(){if(!draft||draft.busy)return;if(!draft.dirty){dispose();return;}if(layer.querySelector('.report-discard'))return;const c=document.createElement('div');c.className='report-discard';c.innerHTML='<section role="alertdialog" aria-label="放弃本次异常提报"><h3>放弃本次异常提报？</h3><p>已填写的描述和补充图片不会保存。</p><div><button type="button" data-keep>继续编辑</button><button type="button" data-discard>放弃提报</button></div></section>';layer.append(c);c.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();c.querySelector('[data-keep]').click();}});c.querySelector('[data-keep]').onclick=()=>{c.remove();layer.querySelector('textarea').focus();};c.querySelector('[data-discard]').onclick=dispose;c.querySelector('[data-keep]').focus();}
  function preview(src,name){const trigger=document.activeElement;const light=document.createElement('div');light.className='report-lightbox';light.setAttribute('role','dialog');light.setAttribute('aria-label',name);light.innerHTML=`<button type="button" aria-label="关闭图片预览">关闭预览</button><img src="${esc(src)}" alt="${esc(name)}"/>`;layer.append(light);light.querySelector('button').onclick=()=>{light.remove();trigger?.focus();};light.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();light.querySelector('button').click();}if(e.key==='Tab'){e.preventDefault();light.querySelector('button').focus();}});light.querySelector('button').focus();}
  async function submit(){if(!draft||draft.busy)return;setError('');if(!draft.configReady||!type()){setError('请选择有效的异常类型');layer.querySelector('select').focus();return;}if(Array.from(draft.description).length>100){setError('异常描述最多100字符');layer.querySelector('textarea').focus();return;}if(draft.captureStatus!=='ready'){setError('请先保存页面截图或上传当前页面截图');return;}if(draft.pendingPhotoIds.size||draft.attachments.some(a=>a.status!=='ready')){setError('请等待图片上传完成，或重试/删除失败图片');return;}draft.busy=true;layer.querySelectorAll('button,select,textarea,input').forEach(e=>e.disabled=true);layer.querySelector('[data-report-submit]').textContent='提交中…';await new Promise(r=>setTimeout(r,650));if(fault==='submit-fail'&&!draft.failedOnce){draft.failedOnce=true;draft.busy=false;renderForm();setError('提交失败，请重试；已保留页面快照和填写内容');return;}let ticket=db.tickets.find(t=>t.requestId===draft.requestId);if(!ticket){ticket=clone({id:`GD-DEMO-${String(db.tickets.length+1).padStart(4,'0')}`,requestId:draft.requestId,context:draft.context,type:type().name,description:draft.description,capture:draft.capture,attachments:draft.attachments.map(({file,...a})=>a),status:'待接单'});db.tickets.push(ticket);}draft.busy=false;draft.dirty=false;renderSuccess(ticket);}
  function renderSuccess(ticket){layer.remove();shell(`<div class="report-success"><div class="report-success-mark">✓</div><h3>提报成功</h3><p>工单编号：<strong>${esc(ticket.id)}</strong></p><p>${esc(ticket.context.pageName)} · ${esc(ticket.type)} · ${ticket.status}</p><p class="report-hint">页面快照已保存，可返回原页面继续作业</p><small>演示工单，仅保存在本次浏览器会话中</small><details open><summary>查看本次工单</summary><div class="report-ticket-details"><button type="button" data-ticket-capture><img src="${ticket.capture}" alt="已保存的页面截图"/></button><div><p>${esc(ticket.description||'未填写异常描述')}</p>${snapshotHTML(ticket.context)}</div></div>${ticket.attachments.length?`<div class="report-ticket-attachments">${ticket.attachments.map((a,i)=>`<button type="button" data-ticket-image="${i}"><img src="${esc(a.src)}" alt="${esc(a.name)}"/><span>${esc(a.name)}</span></button>`).join('')}</div>`:''}</details></div>`,`<button type="button" class="report-primary" data-report-done>返回原页面</button>`);layer.querySelector('[data-ticket-capture]').onclick=()=>preview(ticket.capture,'已保存的页面截图');layer.querySelectorAll('[data-ticket-image]').forEach(b=>b.onclick=()=>{const a=ticket.attachments[Number(b.dataset.ticketImage)];preview(a.src,a.name);});layer.querySelector('[data-report-done]').onclick=dispose;layer.querySelector('[data-report-close]').onclick=dispose;layer.querySelector('[data-report-done]').focus();}
  function capturePage(){return window.html2canvas?window.html2canvas(document.querySelector('.scroll-container'),{logging:false,scale:1,backgroundColor:'#f7f8fc',width:1366,height:765,windowWidth:1366,windowHeight:765,onclone:doc=>{const root=doc.getElementById('0_1');root.style.setProperty('transform','none','important');root.style.setProperty('left','0','important');root.style.setProperty('top','0','important');},ignoreElements:el=>el.classList?.contains('report-layer')||el.classList?.contains('ui-demo-toast')}):Promise.reject(new Error('capture unavailable'));}
  async function retryCapture(){if(!draft||draft.busy)return;const current=draft;const comparable=c=>JSON.stringify({...c,capturedAt:undefined});if(comparable(adapter.context())!==comparable(draft.context)){setError('当前业务信息已变化，请取消后重新提报以保存同一现场');return;}draft.captureStatus='loading';updateCapture();try{const canvas=await capturePage();if(draft!==current)return;draft.capture=canvas.toDataURL('image/png');draft.captureStatus='ready';setError('');}catch{if(draft!==current)return;draft.captureStatus='failed';}updateCapture();}
  async function open(event){if(draft)return;opener=event?.currentTarget||document.activeElement;const context=clone(adapter.context());draft={context,typeId:types[0].id,description:'',attachments:[],pendingPhotoIds:new Set(),capture:'',captureStatus:'loading',configReady:fault!=='config-fail',dirty:false,busy:false,requestId:crypto.randomUUID()};db.draft=draft;const current=draft;
    // html2canvas clones synchronously before the report layer is mounted.
    const capture = fault==='capture-fail'?Promise.reject(new Error('fixture')):capturePage();
    renderForm();try{const canvas=await capture;if(draft!==current)return;draft.capture=canvas.toDataURL('image/png');draft.captureStatus='ready';}catch{if(draft!==current)return;draft.captureStatus='failed';}updateCapture();
  }
  return {open};
};
