const $ = (s)=>document.querySelector(s);
const el = {
  text: $('#text'), author: $('#author'), meta: $('#meta'),
  font: $('#font'), weight: $('#weight'), size: $('#size'), sizeVal: $('#sizeVal'),
  lh: $('#lh'), lhVal: $('#lhVal'), align: $('#align'), padding: $('#padding'), padVal: $('#padVal'),
  stage: $('#stage'), poster: $('#poster'), quote: $('#quote'), authorOut: $('#authorOut'), authorBox: $('#authorBox'), metaBox: $('#metaBox'),
  chrome: $('#chrome'),
  shadow: $('#shadow'), frame: $('#frame'), showAuthor: $('#showAuthor'), showMeta: $('#showMeta'),
  dl: $('#downloadPng'), copy: $('#copyPng'), clear: $('#clear'), save: $('#savePoster')
};

function apply(){
  el.quote.textContent = '"' + (el.text.value.trim() || ' ') + '"';
  el.quote.style.fontFamily = el.font.value;
  el.quote.style.fontWeight = el.weight.value;
  el.quote.style.fontSize = el.size.value + 'px';
  el.quote.style.lineHeight = (el.lh.value/100).toFixed(2);
  el.quote.style.textAlign = el.align.value;
  el.poster.style.padding = el.padding.value + 'px';
  el.sizeVal.textContent = el.size.value; el.lhVal.textContent = (el.lh.value/100).toFixed(2); el.padVal.textContent = el.padding.value;
  el.quote.classList.toggle('shadow-soft', el.shadow.checked);
  el.chrome.classList.toggle('hidden', !el.frame.checked);
  el.authorBox.style.display = el.showAuthor.checked ? 'block' : 'none';
  el.metaBox.style.display = el.showMeta.checked ? 'block' : 'none';
  el.authorOut.textContent = el.author.value.trim();
  el.metaBox.textContent = el.meta.value.trim();
}

['input','change'].forEach(evt=>{
  [el.text, el.author, el.meta, el.font, el.weight, el.size, el.lh, el.align, el.padding, el.shadow, el.frame, el.showAuthor, el.showMeta]
    .forEach(node=> node.addEventListener(evt, apply));
});

// size chips
Array.from(document.querySelectorAll('[data-size]')).forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const [w,h] = btn.dataset.size.split('x').map(n=>parseInt(n,10));
    el.poster.style.width = w+'px';
    el.poster.style.height = h+'px';
    const base = Math.max(36, Math.min(72, Math.floor(w/20)));
    el.size.value = base; apply();
  })
});
// gradient chips
Array.from(document.querySelectorAll('[data-grad]')).forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const prev = Array.from(el.stage.classList).find(c=>c.startsWith('g-'));
    if(prev) el.stage.classList.remove(prev);
    el.stage.classList.add(btn.dataset.grad);
  })
});

// clear
el.clear.addEventListener('click', ()=>{ el.text.value=''; apply(); el.text.focus(); })

// renderers
async function makeCanvas(){
  const canvas = await html2canvas(el.poster, {backgroundColor: null, scale: 2});
  return canvas;
}

el.dl.addEventListener('click', async ()=>{
  el.dl.disabled = true; el.dl.textContent = 'Rendering…';
  const c = await makeCanvas();
  const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = 'quotetype.png'; a.click();
  el.dl.disabled = false; el.dl.textContent = 'Download PNG';
})

el.copy.addEventListener('click', async ()=>{
  try{
    const c = await makeCanvas();
    c.toBlob(async (blob)=>{
      try{ await navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);
        el.copy.textContent = 'Copied ✔'; setTimeout(()=> el.copy.textContent='Copy image', 1500);
      }catch(err){ alert('Copy blocked by browser. Download instead.'); }
    });
  }catch(e){ alert('Copy not supported here.'); }
});

// save to backend
function payload(){
  const size = el.poster.getBoundingClientRect();
  const w = parseInt(size.width), h = parseInt(size.height);
  const grad = Array.from(el.stage.classList).find(c=>c.startsWith('g-')) || 'g-ink';
  return {
    text: el.text.value.trim(),
    author: el.author.value.trim(),
    meta: el.meta.value.trim(),
    font: el.font.value, weight: el.weight.value,
    size: parseInt(el.size.value), line_height: parseFloat((el.lh.value/100).toFixed(2)),
    align: el.align.value, padding: parseInt(el.padding.value),
    gradient: grad, shadow: el.shadow.checked, frame: el.frame.checked,
    show_author: el.showAuthor.checked, show_meta: el.showMeta.checked,
    width: w, height: h
  };
}

el.save.addEventListener('click', async ()=>{
  const body = { payload: payload() };
  if(!body.payload.text){ alert('Please enter some text.'); return; }
  try{
    const r = await fetch('/api/posters', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
    const j = await r.json();
    if(r.ok){
      const url = j.url;
      navigator.clipboard?.writeText(location.origin + url).catch(()=>{});
      alert('Saved! Link copied to clipboard: ' + url);
      location.href = url;
    }else{ alert(j.detail || 'Save failed'); }
  }catch(e){ alert('Network error'); }
});

// Handle paste events for screenshots
let isProcessing = false;

document.addEventListener('paste', async (event)=>{
  if(isProcessing) return;
  
  const items = event.clipboardData?.items;
  if(!items) return;
  
  for(let item of items){
    if(item.type.indexOf('image') !== -1){
      event.preventDefault();
      isProcessing = true;
      
      const blob = item.getAsFile();
      if(!blob) continue;
      
      // Show loading indicator
      const statusMsg = document.createElement('div');
      statusMsg.textContent = '⏳ Extracting text from screenshot...';
      statusMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #667eea; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999;';
      document.body.appendChild(statusMsg);
      
      try{
        const formData = new FormData();
        formData.append('file', blob, 'screenshot.png');
        
        const response = await fetch('/api/extract-text', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if(result.success && result.text){
          el.text.value = result.text;
          apply();
          statusMsg.textContent = '✅ Text extracted!';
          setTimeout(()=> statusMsg.remove(), 1000);
        }else{
          statusMsg.textContent = '❌ Failed to extract text';
          statusMsg.style.background = '#ff6b6b';
          setTimeout(()=> statusMsg.remove(), 2000);
        }
      }catch(error){
        statusMsg.textContent = '❌ Error processing image';
        statusMsg.style.background = '#ff6b6b';
        setTimeout(()=> statusMsg.remove(), 2000);
      }finally{
        isProcessing = false;
      }
      
      break;
    }
  }
});

apply();
