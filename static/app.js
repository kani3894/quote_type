let screenshotDataUrl = null;

// Paste screenshot handler
document.addEventListener('paste', (event)=>{
  const items = event.clipboardData?.items;
  if(!items) return;
  
  for(let item of items){
    if(item.type.indexOf('image') !== -1){
      event.preventDefault();
      const blob = item.getAsFile();
      const reader = new FileReader();
      
      reader.onload = (e)=>{
        screenshotDataUrl = e.target.result;
        document.getElementById('screenshot').src = screenshotDataUrl;
        document.getElementById('screenshot').style.display = 'block';
        updatePoster();
      };
      
      reader.readAsDataURL(blob);
      break;
    }
  }
});

function updatePoster(){
  const posterImage = document.getElementById('posterImage');
  if(screenshotDataUrl){
    posterImage.src = screenshotDataUrl;
    posterImage.style.display = 'block';
  }
}

// Size presets
document.querySelectorAll('[data-size]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const [w, h] = btn.dataset.size.split('x');
    document.getElementById('poster').style.width = w + 'px';
    document.getElementById('poster').style.height = h + 'px';
    document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Background gradients
document.querySelectorAll('[data-grad]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const stage = document.getElementById('stage');
    stage.classList.forEach(c=>{if(c.startsWith('g-')) stage.classList.remove(c);});
    stage.classList.add(btn.dataset.grad);
    document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Shadow toggle
document.getElementById('shadow').addEventListener('change', (e)=>{
  document.getElementById('poster').classList.toggle('shadow-soft', e.target.checked);
});

// Frame toggle
document.getElementById('frame').addEventListener('change', (e)=>{
  document.getElementById('chrome').classList.toggle('hidden', !e.target.checked);
});

// Padding slider
document.getElementById('padding').addEventListener('input', (e)=>{
  const val = e.target.value;
  document.getElementById('poster').style.padding = val + 'px';
  document.getElementById('padVal').textContent = val;
});

// Export functions
document.getElementById('downloadPng').addEventListener('click', async ()=>{
  if(!screenshotDataUrl){
    alert('Please paste a screenshot first');
    return;
  }
  
  html2canvas(document.getElementById('stage')).then(canvas=>{
    const link = document.createElement('a');
    link.download = 'quote-poster.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});

document.getElementById('copyPng').addEventListener('click', async ()=>{
  if(!screenshotDataUrl){
    alert('Please paste a screenshot first');
    return;
  }
  
  html2canvas(document.getElementById('stage')).then(canvas=>{
    canvas.toBlob(blob=>{
      navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);
      alert('Image copied to clipboard!');
    });
  });
});

document.getElementById('clear').addEventListener('click', ()=>{
  screenshotDataUrl = null;
  document.getElementById('screenshot').src = '';
  document.getElementById('screenshot').style.display = 'none';
  document.getElementById('posterImage').src = '';
  document.getElementById('posterImage').style.display = 'none';
});

// Save poster
document.getElementById('savePoster').addEventListener('click', async ()=>{
  if(!screenshotDataUrl){
    alert('Please paste a screenshot first');
    return;
  }
  
  const stage = document.getElementById('stage');
  const grad = Array.from(stage.classList).find(c=>c.startsWith('g-')) || 'g-ink';
  const size = document.getElementById('poster').getBoundingClientRect();
  
  const payload = {
    image: screenshotDataUrl,
    gradient: grad,
    shadow: document.getElementById('shadow').checked,
    frame: document.getElementById('frame').checked,
    padding: parseInt(document.getElementById('padding').value),
    width: parseInt(size.width),
    height: parseInt(size.height)
  };
  
  try{
    const r = await fetch('/api/posters', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({payload})
    });
    const j = await r.json();
    if(r.ok){
      navigator.clipboard?.writeText(location.origin + j.url).catch(()=>{});
      alert('Saved! Link copied to clipboard: ' + j.url);
      location.href = j.url;
    }else{
      alert(j.detail || 'Save failed');
    }
  }catch(e){
    alert('Network error');
  }
});
