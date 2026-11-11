// Tech Valley Filtration — shared nav + background dust motes
(function(){
  var nav=document.getElementById('tvfNav')||document.getElementById('nav');
  var btn=document.getElementById('menuBtn'),list=document.getElementById('navLinks');
  function stick(){if(nav)nav.classList.toggle('stuck',window.scrollY>20||(list&&list.classList.contains('open')))}
  window.addEventListener('scroll',stick,{passive:true});stick();
  if(btn&&list)btn.addEventListener('click',function(){var o=list.classList.toggle('open');btn.setAttribute('aria-expanded',o);btn.textContent=o?'Close':'Menu';stick()});

  // Accessibility patches for the older page markup (tvfA11y)
  function linkLabels(root){[].forEach.call(root.querySelectorAll('input:not([type=hidden]),select,textarea'),function(f,i){
    if(f.closest('label')||f.getAttribute('aria-label')||f.getAttribute('aria-labelledby'))return;
    if(!f.id)f.id='tvf-f-'+(f.name||'x')+'-'+Math.random().toString(36).slice(2,7);
    if(document.querySelector('label[for="'+f.id+'"]'))return;
    var box=f.parentElement,lab=null;
    for(var d=0;d<3&&box&&!lab;d++){var ls=box.querySelectorAll('label:not([for])');if(ls.length===1)lab=ls[0];else{var pv=f.previousElementSibling;while(pv&&pv.tagName!=='LABEL')pv=pv.previousElementSibling;lab=pv&&!pv.htmlFor?pv:null}box=box.parentElement}
    if(lab)lab.htmlFor=f.id;else f.setAttribute('aria-label',(f.placeholder||f.name||'').replace(/_\d+$/,'').replace(/_/g,' '))})}
  linkLabels(document);
  var qli=document.getElementById('quoteLineItems');if(qli&&'MutationObserver' in window)new MutationObserver(function(){linkLabels(qli)}).observe(qli,{childList:true,subtree:true});
  [].forEach.call(document.querySelectorAll('div[onclick],li[onclick],span[onclick]'),function(el){if(el.hasAttribute('tabindex'))return;el.setAttribute('tabindex','0');el.setAttribute('role','button');
    el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click()}})});

  // About page gallery: drifts sideways on its own in an endless loop; videos play muted while on screen.
  // Arrows, swipe, trackpad and mouse drag still work; the drift holds while the pointer or keyboard focus is on it.
  [].forEach.call(document.querySelectorAll('.tvf-gallery'),function(g){var t=g.querySelector('.tvf-gallery-track'),pv=g.querySelector('.tvf-gal-prev'),nx=g.querySelector('.tvf-gal-next');if(!t)return;
    var still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var vids=function(){return [].slice.call(t.querySelectorAll('video'))};
    if(still){vids().forEach(function(v){v.controls=true;v.loop=false});}
    else{
      // duplicate the set so the loop has no visible seam
      [].slice.call(t.children).forEach(function(li){var c=li.cloneNode(true);c.setAttribute('aria-hidden','true');[].forEach.call(c.querySelectorAll('img'),function(i){i.alt='';i.loading='eager'});t.appendChild(c)});
      t.classList.add('auto');
      vids().forEach(function(v){v.muted=true;v.removeAttribute('controls');v.setAttribute('tabindex','-1')});
      if('IntersectionObserver' in window){var vo=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()})},{root:null,threshold:.15});vids().forEach(function(v){vo.observe(v)})}
      else vids().forEach(function(v){v.autoplay=true;v.play&&v.play()});
    }
    function half(){var n=t.children.length/2,first=t.children[0],mid=t.children[n];return mid?mid.offsetLeft-first.offsetLeft:0}
    function wrap(){if(still)return;var h=half();if(h<=0)return;if(t.scrollLeft>=h)t.scrollLeft-=h;else if(t.scrollLeft<=0)t.scrollLeft+=h}
    function go(d){wrap();t.scrollBy({left:d*Math.max(280,t.clientWidth*.6),behavior:'smooth'});hold(1600)}
    if(pv)pv.addEventListener('click',function(){go(-1)});if(nx)nx.addEventListener('click',function(){go(1)});
    if(still){var st=function(){var max=t.scrollWidth-t.clientWidth-2;if(pv)pv.disabled=t.scrollLeft<=2;if(nx)nx.disabled=t.scrollLeft>=max};t.addEventListener('scroll',st,{passive:true});st()}
    t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(1)}else if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}});
    var down=false,sx=0,sl=0,hover=false,focus=false,until=0,pos=null,last=0,seen=false,started=false;
    function hold(ms){until=Math.max(until,performance.now()+ms);pos=null}
    t.addEventListener('mousedown',function(e){down=true;sx=e.pageX;sl=t.scrollLeft;wrap();sl=t.scrollLeft});
    window.addEventListener('mousemove',function(e){if(!down)return;var dx=e.pageX-sx;if(Math.abs(dx)>4)t.classList.add('drag');t.scrollLeft=sl-dx});
    window.addEventListener('mouseup',function(){if(!down)return;down=false;t.classList.remove('drag');hold(1200)});
    t.addEventListener('dragstart',function(e){e.preventDefault()});
    g.addEventListener('mouseenter',function(){hover=true});g.addEventListener('mouseleave',function(){hover=false;hold(400)});
    g.addEventListener('focusin',function(){focus=true});g.addEventListener('focusout',function(){focus=false;hold(400)});
    t.addEventListener('touchstart',function(){hold(4000)},{passive:true});t.addEventListener('touchmove',function(){hold(4000)},{passive:true});t.addEventListener('wheel',function(){hold(1500)},{passive:true});
    if(still)return;
    if('IntersectionObserver' in window){new IntersectionObserver(function(e){seen=e[0].isIntersecting;pos=null}).observe(g);var so=new IntersectionObserver(function(e){if(e[0].isIntersecting){started=true;so.disconnect()}},{threshold:.7});so.observe(t)}else{seen=true;started=true}
    function tick(now){var dt=Math.min(.05,(now-last)/1000||0);last=now;
      if(seen&&started&&!down&&!hover&&!focus&&now>until&&!document.hidden){if(pos===null)pos=t.scrollLeft;pos+=38*dt;var h=half();if(h>0&&pos>=h)pos-=h;t.scrollLeft=pos}else pos=null;
      requestAnimationFrame(tick)}
    requestAnimationFrame(tick)});

  // Phones (tvfKeyboard): when the on-screen keyboard opens, keep the field being typed in, and the size list under it, in view
  if(window.matchMedia('(pointer: coarse)').matches){
    var vv=window.visualViewport,HEAD=96;
    var settle=function(){var f=document.activeElement;if(!f||!/^(INPUT|TEXTAREA|SELECT)$/.test(f.tagName)||/^(checkbox|radio|submit|button)$/.test(f.type))return;
      var r=f.getBoundingClientRect(),h=vv?vv.height:window.innerHeight,isSize=/^size-input-/.test(f.id);
      // a size field needs room underneath for its list; any other field just has to be visible
      var hidden=r.bottom>h-12||r.top<HEAD-20,needsRoom=isSize&&r.top>Math.max(HEAD+8,h*.28);
      if(hidden||needsRoom)window.scrollBy({top:r.top-(isSize?HEAD+4:Math.max(HEAD,h*.25)),behavior:'smooth'})};
    document.addEventListener('focusin',function(){setTimeout(settle,350)});
    if(vv)vv.addEventListener('resize',function(){setTimeout(settle,60)});
  }

  // Dust motes: same drift as the current site's hero, kept subtle.
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce)return;
  function motes(canvas,edge,gain){
    var ctx=canvas.getContext('2d'),m=[],W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),run=true,last=0;
    function spawn(any){return{x:any?Math.random()*W:W+8,y:Math.random()*H,r:.6+Math.random()*1.5,vx:-(6+Math.random()*14),vy:(Math.random()-.5)*6,a:.15+Math.random()*.45,ph:Math.random()*Math.PI*2}}
    function resize(){var r=canvas.getBoundingClientRect();W=r.width;H=r.height;canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);m=[];for(var i=0,n=Math.round(W/16);i<n;i++)m.push(spawn(true))}
    function frame(t){if(!run)return;var dt=Math.min(.05,(t-last)/1000||0);last=t;ctx.clearRect(0,0,W,H);
      for(var i=0;i<m.length;i++){var p=m[i];p.x+=p.vx*dt;p.y+=p.vy*dt+Math.sin(t/1400+p.ph)*.08;
        var fade=Math.max(0,Math.min(1,(p.x-W*edge)/(W*.2)));
        if(p.x<W*edge||p.y<-5||p.y>H+5){m[i]=spawn(false);continue}
        var tw=.6+.4*Math.sin(t/900+p.ph*3);ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle='rgba(226,232,240,'+(p.a*tw*fade*gain).toFixed(3)+')';ctx.fill()}
      requestAnimationFrame(frame)}
    window.addEventListener('resize',resize);resize();
    if('IntersectionObserver' in window)new IntersectionObserver(function(e){var was=run;run=e[0].isIntersecting;if(run&&!was)requestAnimationFrame(frame)}).observe(canvas);
    requestAnimationFrame(frame);
  }
  var hero=document.getElementById('hero-motes');if(hero)motes(hero,.45,1);
  document.querySelectorAll('.page-hero').forEach(function(h){var c=document.createElement('canvas');c.className='tvf-motes';c.setAttribute('aria-hidden','true');h.appendChild(c);motes(c,-.25,.5)});
})();

// ---- Subtle scroll animations (skipped when the visitor prefers reduced motion) ----
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
  var css=''
  +'.tvf-lu span{color:rgba(242,244,248,.22);transition:color .5s ease}.tvf-lu span.lit{color:#f2f4f8}.tvf-lu span.lit.g{color:#19c48a}'
  +'.tvf-settle{transform:scale(1.07);transition:transform 1.6s cubic-bezier(.16,1,.3,1)}.tvf-settle.in{transform:none}'
  +'.tvf-draw{position:relative}.tvf-draw.b{border-bottom-color:transparent!important}.tvf-draw.t{border-top-color:transparent!important}'
  +'.tvf-draw::before,.tvf-draw::after{content:"";position:absolute;left:0;height:1px;transform:scaleX(0);transform-origin:left;transition:transform 1.3s cubic-bezier(.16,1,.3,1);transition-delay:var(--d,0s);pointer-events:none}'
  +'.tvf-draw.b::before,.tvf-draw.b::after{bottom:-1px}.tvf-draw.t::before,.tvf-draw.t::after{top:-1px}'
  +'.tvf-draw::before{right:0;background:rgba(226,232,255,.2)}.tvf-draw::after{width:56px;background:#19c48a;transition-duration:.9s}'
  +'.tvf-draw.in::before,.tvf-draw.in::after{transform:scaleX(1)}'
  +'.page-hero-inner>*{opacity:0;transform:translateY(16px);filter:blur(6px);animation:tvfEnter 1s cubic-bezier(.16,1,.3,1) forwards}.page-hero-inner>*:nth-child(2){animation-delay:.1s}.page-hero-inner>*:nth-child(3){animation-delay:.2s}.page-hero-inner>*:nth-child(n+4){animation-delay:.28s}'
  +'@keyframes tvfEnter{to{opacity:1;transform:none;filter:none}}'
  +'.brands li{opacity:0;animation:tvfFade .8s ease forwards}@keyframes tvfFade{to{opacity:1}}';
  css+=''
  +'@keyframes tvfLineIn{from{opacity:0;transform:translateY(-10px) scale(.985)}to{opacity:1;transform:none}}.tvf-line-in{animation:tvfLineIn .5s cubic-bezier(.16,1,.3,1)}'
  +'@keyframes tvfSaved{0%{opacity:0;transform:translateY(-14px);box-shadow:0 0 0 0 rgba(25,196,138,.55),inset 0 0 0 999px rgba(25,196,138,.22)}45%{opacity:1;transform:none}100%{box-shadow:0 0 0 10px rgba(25,196,138,0),inset 0 0 0 999px rgba(25,196,138,0)}}.tvf-saved{animation:tvfSaved 1.1s cubic-bezier(.16,1,.3,1)}'
  +'@keyframes tvfPop{0%{transform:scale(1)}40%{transform:scale(1.35)}100%{transform:scale(1)}}.tvf-pop{animation:tvfPop .5s cubic-bezier(.16,1,.3,1);display:inline-block}'
  ;
  css+=''
  +'.tvf-steps li{opacity:.3;transition:opacity .6s ease}.tvf-steps li.lit{opacity:1}.tvf-steps li::before{transition:background .45s ease,color .45s ease,border-color .45s ease,box-shadow .6s ease}.tvf-steps li.lit::before{background:#19c48a!important;color:#04150e!important;border-color:#19c48a!important;box-shadow:0 0 0 6px rgba(25,196,138,.14)}'
  +'@keyframes tvfTab{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}.tab-content.active{animation:tvfTab .55s cubic-bezier(.16,1,.3,1)}'
  +'.btn,.tvf-cta,a[class*="btn"],button[class*="btn"],button[type="submit"]{transition-property:background,background-color,border-color,color,box-shadow,transform;transition-duration:.2s}.btn:active,.tvf-cta:active,a[class*="btn"]:active,button[class*="btn"]:active,button[type="submit"]:active{transform:scale(.965)!important;transition-duration:.08s}'
  ;
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  document.querySelectorAll('.brands li').forEach(function(li,i){li.style.animationDelay=(.5+i*.07)+'s'});

  // 1. Headline words light up as they cross the viewport (same effect as the home page statement)
  function wrap(node,g){[].slice.call(node.childNodes).forEach(function(n){
    if(n.nodeType===3){var f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(function(w){if(!w.trim()){f.appendChild(document.createTextNode(w));return}var s=document.createElement('span');s.textContent=w;if(g)s.className='g';f.appendChild(s)});node.replaceChild(f,n)}
    else if(n.nodeType===1&&n.tagName!=='BR')wrap(n,g||/^(B|EM|STRONG)$/.test(n.tagName))})}
  var lus=[].slice.call(document.querySelectorAll('.cta-section h2, .air .lead, .stock h2, [data-lightup]'));
  lus.forEach(function(el){wrap(el,false);el.classList.add('tvf-lu');el._w=[].slice.call(el.querySelectorAll('span'))});
  function upd(){var vh=window.innerHeight;lus.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;
    var t=Math.min(1,Math.max(0,(vh*.9-r.top)/(vh*.42+r.height*.6))),n=Math.round(t*el._w.length);
    el._w.forEach(function(w,i){w.classList.toggle('lit',i<n)})})}
  if(lus.length){window.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);upd()}

  // 2. Photos settle into place, 3. hairlines draw across, once, when first seen
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.2});
  document.querySelectorAll('.tile .ph img, .product-img-wrap img, .about-image-wrap img, .stock>img').forEach(function(im){im.classList.add('tvf-settle');io.observe(im)});
  document.querySelectorAll('.section-header').forEach(function(h){if(getComputedStyle(h).borderBottomWidth!=='0px'){h.classList.add('tvf-draw','b');io.observe(h)}});
  document.querySelectorAll('.trio>div, .costs>div, .reach>a, .reach>div').forEach(function(d,i){d.classList.add('tvf-draw','t');d.style.setProperty('--d',((i%4)*.09)+'s');io.observe(d)});
  // 4. Quote form: a new filter line eases in; when it is added to the list, the saved row drops in with a green flash and the count ticks
  var items=document.getElementById('quoteLineItems'),list=document.getElementById('filterSummaryList'),badge=document.getElementById('filterSummaryCount');
  if(items&&'MutationObserver' in window)new MutationObserver(function(ms){ms.forEach(function(m){[].forEach.call(m.addedNodes,function(n){if(n.nodeType===1){n.classList.add('tvf-line-in');n.addEventListener('animationend',function(){n.classList.remove('tvf-line-in')},{once:true})}})})}).observe(items,{childList:true});
  if(list&&'MutationObserver' in window){var prev=list.children.length;new MutationObserver(function(){var n=list.children.length;
    if(n>prev){var row=list.children[n-1];row.classList.add('tvf-saved');if(badge){badge.classList.remove('tvf-pop');void badge.offsetWidth;badge.classList.add('tvf-pop')}}prev=n}).observe(list,{childList:true})}
  // 5. Bag-In/Bag-Out: the numbered steps light up one after another as the block scrolls through
  var steps=document.querySelector('.bibo-steps ol');
  if(steps){steps.classList.add('tvf-steps');var lis=[].slice.call(steps.children);
    var su=function(){var r=steps.getBoundingClientRect(),vh=window.innerHeight;if(r.bottom<-200||r.top>vh+200)return;
      var atEnd=window.scrollY+vh>=document.documentElement.scrollHeight-4;var t=atEnd?1:Math.min(1,Math.max(0,(vh*.94-r.top)/(vh*.34))),n=Math.ceil(t*lis.length);lis.forEach(function(li,i){li.classList.toggle('lit',i<n)})};
    window.addEventListener('scroll',su,{passive:true});window.addEventListener('resize',su);su()}
})();
