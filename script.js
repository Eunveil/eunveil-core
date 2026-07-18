const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);createStars();}
function createStars(){stars=Array.from({length:Math.min(260,Math.floor(innerWidth/5))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.4+.2,a:Math.random()*.7+.2,s:Math.random()*.08+.01}));}
function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);for(const s of stars){s.y+=s.s;if(s.y>innerHeight)s.y=0;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,235,190,${s.a})`;ctx.fill();}requestAnimationFrame(draw)}
addEventListener('resize',resize);resize();draw();

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const modal=document.getElementById('journeyModal');
const openModal=()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false')};
const closeModal=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')};
['beginJourney','finalJourney'].forEach(id=>document.getElementById(id).addEventListener('click',openModal));
document.getElementById('modalClose').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});

document.getElementById('modalScan').addEventListener('click',()=>{closeModal();document.getElementById('journey').scrollIntoView({behavior:'smooth'});setTimeout(runScan,700)});

document.getElementById('scanButton').addEventListener('click',runScan);
const objects=['UNCLASSIFIED WORLD','DERELICT VESSEL','ICE MOON','DEEP-SPACE RELAY','RED GIANT','ASTEROID FIELD'];
function randomHex(n){return Array.from({length:n},()=>Math.floor(Math.random()*16).toString(16)).join('').toUpperCase()}
function runScan(){
  const btn=document.getElementById('scanButton');btn.disabled=true;btn.textContent='SCANNING...';
  const steps=[...document.querySelectorAll('.journey-step')], lines=[...document.querySelectorAll('.journey-line i')];
  steps.forEach(s=>s.classList.remove('active'));lines.forEach(l=>l.style.width='0');
  let i=0;const sequence=setInterval(()=>{steps[i].classList.add('active');if(i>0)lines[i-1].style.width='100%';i++;if(i===steps.length){clearInterval(sequence);finishScan()}},520);
}
function finishScan(){
  const quality=Math.random();
  let reward;
  if(quality>.997) reward=(Math.random()*9+1).toFixed(6);
  else if(quality>.96) reward=(Math.random()*.08+.005).toFixed(9);
  else if(quality>.75) reward=(Math.random()*.001).toFixed(12);
  else reward=(Math.random()*0.000001).toFixed(12);
  document.getElementById('objectType').textContent=objects[Math.floor(Math.random()*objects.length)];
  document.getElementById('signalId').textContent='E-'+randomHex(4)+'-'+Math.floor(Math.random()*999).toString().padStart(3,'0');
  document.getElementById('hashValue').textContent=randomHex(32);
  document.getElementById('rewardValue').textContent=reward+' EUN';
  const btn=document.getElementById('scanButton');btn.disabled=false;btn.textContent='SCAN ANOTHER SIGNAL';
}
setInterval(()=>{document.getElementById('journeyTime').textContent=new Date().toLocaleTimeString('en-US',{hour12:false})},1000);

document.getElementById('soundToggle').addEventListener('click',e=>{e.currentTarget.classList.toggle('on');e.currentTarget.textContent=e.currentTarget.classList.contains('on')?'◉':'◌'});
