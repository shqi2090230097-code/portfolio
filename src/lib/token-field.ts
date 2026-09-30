import { motion } from '../design/motion.mjs';
import { wake, stop, damp, clamp01 } from './motion-loop';
type Particle = { x:number; y:number; vx:number; vy:number; rotation:number; angularVelocity:number; scale:number; shape:number; color:string; basePosition:{ x:number; depth:number; angle:number }; };
class TokenField extends HTMLElement {
  connectedCallback() {
    const canvas = this.querySelector('canvas');
    const stage = this.querySelector<HTMLElement>('.token-stage');
    const cta = this.querySelector<HTMLElement>('.token-cta');
    const context = canvas?.getContext('2d', { alpha:true });
    if (!canvas || !context || !stage || !cta) return;
    const ctx:CanvasRenderingContext2D = context;
    const controller = new AbortController(), { signal } = controller;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const cfg = motion.field;
    const debug = new URLSearchParams(location.search).has('motion-debug');
    let particles:Particle[] = [], width=0, height=0, pageTop=0, sectionHeight=1, scroll=scrollY;
    let target=0, progress=0, visible=false, mobile=false, initialized=false;
    let zone={left:0,right:0,top:0,bottom:0};
    let pointer={x:-1000,y:-1000,vx:0,vy:0,active:false};
    let previousTime=0, frames=0, costs:number[]=[], slow=0, qualityReduced=false;
    let longTasks=0, longestTask=0, peakDisplacement=0;
    let seed=71;
    const random=()=> { seed=(seed*1664525+1013904223)>>>0; return seed/4294967296; };
    function create() {
      seed=71;
      const count=mobile?cfg.mobile:width>=1400?cfg.desktop:cfg.laptop;
      particles=Array.from({length:count},(_,i)=> {
        const u=(i+.15+random()*.7)/count;
        const depth=Math.pow(random(),1.7);
        const angle=(random()-.5)*Math.PI;
        return { x:u*width,y:height+random()*height*.14,vx:0,vy:0,rotation:angle,angularVelocity:0,
          scale:(mobile?7:11)+random()*(mobile?9:15),shape:Math.floor(random()*10),
          color:random()<cfg.accentRatio?cfg.accents[Math.floor(random()*cfg.accents.length)]:cfg.colors[Math.floor(random()*cfg.colors.length)],
          basePosition:{x:u,depth,angle} };
      });
      qualityReduced=false;
      thisDebug();
    }
    const thisDebug=()=> { if(debug) { this.dataset.particles=String(particles.length); this.dataset.dpr=String(Math.min(devicePixelRatio,mobile?cfg.mobileDpr:cfg.dpr)); } };
    const setTarget=()=> { scroll=scrollY; target=clamp01((scroll+height-pageTop)/sectionHeight); if(visible&&!reduced.matches&&!document.hidden) wake(tick); };
    const measure=()=> {
      const box=stage.getBoundingClientRect(), section=this.getBoundingClientRect(), c=cta.getBoundingClientRect();
      width=box.width; height=box.height; pageTop=section.top+scrollY; sectionHeight=section.height;
      zone={left:c.left-box.left-20,right:c.right-box.left+20,top:c.top-box.top-20,bottom:c.bottom-box.top+20};
      mobile=width<768;
      const dpr=Math.min(devicePixelRatio,mobile?cfg.mobileDpr:cfg.dpr);
      canvas.width=Math.round(width*dpr); canvas.height=Math.round(height*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);
      create(); setTarget();
      if(reduced.matches) { progress=.78; placeStatic(); draw(); } else if(visible) wake(tick);
      initialized=true;
    };
    function destination(p:Particle) {
      const b=p.basePosition;
      const formation=clamp01(progress/.72);
      const settle=clamp01((progress-.85)/.15)*height*.035;
      const terrain=.8+.14*Math.sin(b.x*17)+.07*Math.cos(b.x*31);
      const pile=height*(.065+.34*formation)*terrain;
      const nearCTA=pointer.active && pointer.x>zone.left&&pointer.x<zone.right&&pointer.y>zone.top&&pointer.y<zone.bottom;
      return {x:b.x*width,y:height+p.scale*(2-3*formation)-pile*b.depth+settle+(nearCTA?height*.05*Math.max(0,1-Math.abs(b.x-.5)*2):0)};
    }
    function placeStatic() { for(const p of particles) { const t=destination(p);p.x=t.x;p.y=t.y;p.rotation=p.basePosition.angle;p.vx=p.vy=0; } }
    function shape(p:Particle) {
      const s=p.scale;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rotation);ctx.fillStyle=p.color;ctx.strokeStyle=p.color;ctx.lineWidth=Math.max(2,s*.23);ctx.beginPath();
      switch(p.shape) {
        case 0:ctx.arc(0,0,s*.52,0,Math.PI*2);ctx.fill();break;
        case 1:ctx.arc(0,0,s*.45,0,Math.PI*2);ctx.stroke();break;
        case 2:ctx.roundRect(-s*.5,-s*.5,s,s,s*.18);ctx.fill();break;
        case 3:ctx.moveTo(0,-s*.65);ctx.lineTo(s*.5,0);ctx.lineTo(0,s*.65);ctx.lineTo(-s*.5,0);ctx.closePath();ctx.fill();break;
        case 4:ctx.fillRect(-s*.12,-s*.55,s*.24,s*1.1);ctx.fillRect(-s*.55,-s*.12,s*1.1,s*.24);break;
        case 5:ctx.rotate(Math.PI/4);ctx.fillRect(-s*.12,-s*.5,s*.24,s);ctx.fillRect(-s*.5,-s*.12,s,s*.24);break;
        case 6:ctx.roundRect(-s*.7,-s*.22,s*1.4,s*.44,s*.22);ctx.fill();break;
        case 7:ctx.fillRect(-s*.6,-s*.3,s*1.2,s*.6);break;
        case 8:ctx.moveTo(s*.25,-s*.55);ctx.lineTo(-s*.25,-s*.55);ctx.lineTo(-s*.25,s*.55);ctx.lineTo(s*.25,s*.55);ctx.stroke();break;
        default:ctx.fillRect(-s*.5,-s*.5,s*.5,s*.5);ctx.fillRect(0,-s*.5,s*.5,s*.5);ctx.fillRect(-s*.5,0,s*.5,s*.5);
      }
      ctx.restore();
    }
    function draw() {
      ctx.clearRect(0,0,width,height);
      for(const p of particles) {
        // The text owns this space even during a fast pointer impulse.
        if(p.x>zone.left-p.scale&&p.x<zone.right+p.scale&&p.y>zone.top-p.scale&&p.y<zone.bottom+p.scale) continue;
        shape(p);
      }
    }
    const tick=(dt:number,now:number)=> {
      if(!visible||document.hidden||reduced.matches) return false;
      const start=performance.now();
      progress=damp(progress,target,motion.scrollSmoothing,dt);
      const floor=height+(1-clamp01(progress/.72))*50;
      for(const p of particles) {
        const t=destination(p);
        let fx=(t.x-p.x)*cfg.spring,fy=(t.y-p.y)*cfg.spring+cfg.gravity;
        if(pointer.active&&!mobile&&fine.matches) {
          const dx=p.x-pointer.x,dy=p.y-pointer.y,d=Math.hypot(dx,dy),q=Math.max(0,1-d/cfg.radius);
          if(q>0) { fx+=dx/Math.max(d,1)*q*q*cfg.repulsion+pointer.vx*q*.008;fy+=dy/Math.max(d,1)*q*q*cfg.repulsion+pointer.vy*q*.008; }
        }
        if(p.x>zone.left&&p.x<zone.right&&p.y>zone.top&&p.y<zone.bottom+20) fy+=.7;
        p.vx=(p.vx+fx*dt)*Math.pow(cfg.damping,dt);p.vy=(p.vy+fy*dt)*Math.pow(cfg.damping,dt);
        p.x+=Math.max(-4,Math.min(4,p.vx))*dt;p.y+=Math.max(-5,Math.min(5,p.vy))*dt;
        p.x=Math.max(p.scale,Math.min(width-p.scale,p.x));
        if(p.y>floor-p.scale*.4) {p.y=floor-p.scale*.4;p.vy*=-.12;}
        p.angularVelocity=(p.angularVelocity+(fx*.004+(p.basePosition.angle-p.rotation)*.004)*dt)*Math.pow(.92,dt);
        if(!mobile) p.rotation+=p.angularVelocity*dt;
        if(debug) peakDisplacement=Math.max(peakDisplacement,Math.hypot(p.x-t.x,p.y-t.y));
      }
      pointer.vx*=.8;pointer.vy*=.8;draw();
      const elapsed=performance.now()-start;
      if(previousTime&&now-previousTime>25) slow++; else slow=Math.max(0,slow-1);
      previousTime=now;
      if(slow>35&&!qualityReduced) { particles=particles.slice(0,mobile?60:width>=1400?220:180);qualityReduced=true;thisDebug(); }
      if(debug) {
        costs.push(elapsed);if(costs.length>600)costs.shift();
        if(++frames%60===0) {const sorted=[...costs].sort((a,b)=>a-b);this.dataset.frameP95=String(sorted[Math.floor(sorted.length*.95)]?.toFixed(2));this.dataset.longTasks=String(longTasks);this.dataset.longestTask=String(longestTask.toFixed(1));this.dataset.progress=progress.toFixed(3);this.dataset.peakDisplacement=peakDisplacement.toFixed(1);}
      }
      return true;
    };
    const intersection=new IntersectionObserver(entries=> {visible=entries[0].isIntersecting;this.dataset.running=String(visible&&!reduced.matches&&!document.hidden);if(visible){setTarget();if(reduced.matches){placeStatic();draw();}}else{stop(tick);previousTime=0;}},{threshold:0});
    intersection.observe(this);
    const resize=new ResizeObserver(()=>measure());resize.observe(stage);
    const layoutResize=new ResizeObserver(()=>{const section=this.getBoundingClientRect();pageTop=section.top+scrollY;sectionHeight=section.height;setTarget();});layoutResize.observe(document.body);
    document.fonts.ready.then(()=>{if(this.isConnected) measure();});
    window.addEventListener('scroll',setTarget,{passive:true,signal});
    window.addEventListener('resize',measure,{passive:true,signal});
    stage.addEventListener('pointermove',event=> {
      if(mobile||!fine.matches||reduced.matches||event.pointerType!=='mouse')return;
      const screenTop=Math.min(Math.max(pageTop-scroll,0),pageTop+sectionHeight-scroll-height);
      const x=event.clientX,y=event.clientY-screenTop;
      pointer.vx=pointer.active?Math.max(-35,Math.min(35,x-pointer.x)):0;pointer.vy=pointer.active?Math.max(-35,Math.min(35,y-pointer.y)):0;
      pointer.x=x;pointer.y=y;pointer.active=true;if(visible)wake(tick);
    },{passive:true,signal});
    stage.addEventListener('pointerleave',()=>{pointer.active=false;},{signal});
    const preference=()=> { stop(tick);pointer.active=false;this.dataset.running=String(visible&&!reduced.matches&&!document.hidden);if(initialized){if(reduced.matches){progress=.78;placeStatic();draw();}else if(visible)wake(tick);} };
    reduced.addEventListener('change',preference,{signal});document.addEventListener('visibilitychange',preference,{signal});
    let perf:PerformanceObserver|undefined;
    if(debug&&PerformanceObserver.supportedEntryTypes?.includes('longtask')) {perf=new PerformanceObserver(list=>{if(visible)for(const e of list.getEntries()){longTasks++;longestTask=Math.max(longestTask,e.duration);}});perf.observe({type:'longtask',buffered:false});}
    measure();
    this.addEventListener('field-disconnect',()=>{controller.abort();intersection.disconnect();resize.disconnect();layoutResize.disconnect();perf?.disconnect();stop(tick);},{once:true});
  }
  disconnectedCallback(){this.dispatchEvent(new Event('field-disconnect'));}
}
if(!customElements.get('token-field'))customElements.define('token-field',TokenField);
