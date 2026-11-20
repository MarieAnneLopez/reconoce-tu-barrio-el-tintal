import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(resolve('barrio-frontend/package.json'));
const { chromium } = require('@playwright/test');
const sharp = require('sharp');
const base = process.env.PALETTE_URL || 'http://127.0.0.1:5173';
const routes = ['/', '/historia', '/ranking', '/galeria', '/preguntas', '/creadora', '/ayuda', '/acceso', '/creditos-fotos', '/no-existe'];
const colors = {crema:[252,240,207], rosa_claro:[243,209,220], rosa:[246,167,193], amarillo:[253,207,118], marron:[177,110,75]};
const results = [];
await mkdir('docs/capturas/h35-paleta', {recursive:true});
const browser = await chromium.launch({headless:true, channel:'msedge'});
try {
 for (const width of [390,1440]) {
  const page = await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
  await page.addInitScript(() => sessionStorage.setItem('mini-marie:welcome-seen','true'));
  try {
   for (const route of routes) {
    await page.goto(base + route, {waitUntil:'networkidle', timeout:45000});
    await page.locator('.loading-screen').waitFor({state:'hidden',timeout:60000});
    await page.locator('main').waitFor({state:'visible',timeout:30000});
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
    await page.evaluate(() => {
     for (const el of document.querySelectorAll('*')) {
      const bg = getComputedStyle(el).backgroundImage;
      if (bg.includes('url(')) el.setAttribute('data-palette-image','');
     }
    });
    const mask = page.locator('img, picture, video, canvas, .maplibregl-map, [data-palette-image]');
    const image = await page.screenshot({fullPage:true,mask:[mask],maskColor:'#00ff00'});
    const file = `${width}-${route.slice(1)||'inicio'}.png`;
    await writeFile(`docs/capturas/h35-paleta/${file}`, image);
    const {data,info} = await sharp(image).removeAlpha().raw().toBuffer({resolveWithObject:true});
    const counts = Object.fromEntries(Object.keys(colors).map(k=>[k,0]));
    let excluded=0, other=0;
    for(let i=0;i<data.length;i+=info.channels){
     const rgb=[data[i],data[i+1],data[i+2]];
     if(rgb[0]===0 && rgb[1]===255 && rgb[2]===0){excluded++;continue;}
     let best='', dist=Infinity;
     for(const [name,c] of Object.entries(colors)){
      const d=Math.hypot(...c.map((v,j)=>v-rgb[j]));
      if(d<dist){dist=d;best=name;}
     }
     if(dist<=30) counts[best]++; else other++;
    }
    const classified=Object.values(counts).reduce((a,b)=>a+b,0);
    results.push({route,width,file,excluded,other,classified,counts,percent:Object.fromEntries(Object.entries(counts).map(([k,v])=>[k,100*v/classified]))});
   }
  } finally {await page.close();}
 }
} finally {await browser.close();}
await writeFile('docs/capturas/h35-paleta/resultados.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));

const header=['ruta','ancho','captura','excluidos','otros','clasificados',...Object.keys(colors)];
const rows=results.map(r=>[r.route,r.width,r.file,r.excluded,r.other,r.classified,...Object.keys(colors).map(k=>r.percent[k].toFixed(2))]);
await writeFile('docs/capturas/h35-paleta/resultados.csv',[header,...rows].map(row=>row.join(',')).join('\n')+'\n');
const target={crema:60,rosa_claro:18,rosa:12,amarillo:5,marron:5};
const deviations=[['ruta','ancho','color','medido_pct','objetivo_pct','desviacion_puntos','fuera_de_tolerancia']];
for(const r of results) for(const [key,goal] of Object.entries(target)){
 const measured=Number(r.percent[key].toFixed(2)), delta=Number((measured-goal).toFixed(2));
 deviations.push([r.route,r.width,key,measured,goal,delta,Math.abs(delta)>3?'si':'no']);
}
await writeFile('docs/capturas/h35-paleta/desviaciones.csv',deviations.map(row=>row.join(',')).join('\n')+'\n');
