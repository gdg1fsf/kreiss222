(function(){
document.documentElement.classList.add('js');
var P=[];for(var i=0;i<150;i++){var t=2*Math.PI*i/150,r=46+3.2*Math.cos(10*t);P.push((50+r*Math.cos(t)).toFixed(1)+' '+(50+r*Math.sin(t)).toFixed(1))}
document.getElementById('bp').setAttribute('d','M'+P.join(' L')+'Z');
var h=document.getElementById('h1');
h.innerHTML=h.textContent.split(' ').map(function(w,i){return '<span class="wd" style="animation-delay:'+(.1+i*.08)+'s">'+(w=='кофейню'?'<em>'+w+'</em>':w)+'</span>'}).join(' ');
var t=document.getElementById('tr');t.innerHTML+=t.innerHTML;
var red=matchMedia('(prefers-reduced-motion:reduce)').matches;
function count(b){var to=+b.dataset.to,pre=b.dataset.pre||'',suf=b.dataset.suf||'',st=null;
if(red){b.textContent=pre+to+suf;return}
function f(ts){st=st||ts;var k=Math.min((ts-st)/1500,1);b.textContent=pre+Math.round(to*(1-Math.pow(1-k,3)))+suf;if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);e.target.querySelectorAll('[data-to]').forEach(count)})},{threshold:.12});
document.querySelectorAll('.rv').forEach(function(e,i){io.observe(e)});
var bar=document.getElementById('bar'),fab=document.getElementById('fab'),hd=document.getElementById('hd');
function sc(){var m=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(m>0?scrollY/m:0)+')';fab.classList.toggle('show',scrollY>700);hd.classList.toggle('sc',scrollY>10)}
addEventListener('scroll',sc,{passive:true});sc();
})();
