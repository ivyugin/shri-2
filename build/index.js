(()=>{var e={460:e=>{e.exports=function(e,t,a){const i=[];return t.forEach((e=>{let t={title:e.id,hint:e.name,value:0};e.id===a&&(t.active=!0),i.push(t)})),e.forEach((e=>{e.sprintId=t.find((t=>e.timestamp>=t.startAt&&e.timestamp<=t.finishAt)).id;let a=i.findIndex((t=>t.title===e.sprintId));-1!=a&&(i[a].value+=1)})),i.sort(((e,t)=>e.title<t.title?-1:e.title>t.title?1:0)),i}},508:e=>{function t(e,t){const i=e-t;return`${i>0?"+"+i:i} ${a(Math.abs(i),"commit")}`}function a(e,t){return words={commit:["коммит","коммита","коммитов"]},e>=10&&e<20?words[t][2]:e%10==1?words[t][0]:e%10<5?words[t][1]:words[2]}e.exports=function(e,i,r){let s=0,n=0,o=0,l=0;r.forEach(((e,t)=>{const a=e.summaries.reduce(((e,t)=>{if("object"==typeof t)return e+t.added+t.removed;{const a=i.find((e=>e.id===t));return e+a.added+a.removed}}),0);a<=100?s+=1:a<=500?n+=1:a<=1e3?o+=1:l+=1}));let u=0,d=0,c=0,f=0;return e.forEach(((e,t)=>{const a=e.summaries.reduce(((e,t)=>{if("object"==typeof t)return e+t.added+t.removed;{const a=i.find((e=>e.id===t));return e+a.added+a.removed}}),0);a<=100?u+=1:a<=500?d+=1:a<=1e3?c+=1:f+=1})),[{title:"> 1001 строки",valueText:`${f} ${a(f,"commit")}`,differenceText:t(f,l)},{title:"501 — 1000 строк",valueText:`${c} ${a(c,"commit")}`,differenceText:t(c,o)},{title:"101 — 500 строк",valueText:`${d} ${a(d,"commit")}`,differenceText:t(d,n)},{title:"1 — 100 строк",valueText:`${u} ${a(u,"commit")}`,differenceText:t(u,s)}]}},138:(e,t,a)=>{e.exports=function(e,{sprintId:t}){const i=a(447),r=a(155),s=a(460),n=a(508);let o=[],l=[],u=[],d=[],c=[];e.forEach((e=>{switch(e.type){case"Sprint":o.push(e);break;case"User":l.push(e);break;case"Comment":u.push(e);break;case"Commit":d.push(e);break;case"Summary":c.push(e)}}));const f=o.find((e=>e.id===t)),m=o.find((e=>e.id===t-1)),x=u.filter((e=>"Comment"===e.type&&e.createdAt>=f.startAt&&e.createdAt<=f.finishAt)),v=d.filter((e=>e.timestamp>=f.startAt&&e.timestamp<=f.finishAt)),h=d.filter((e=>e.timestamp>=m.startAt&&e.timestamp<=m.finishAt)),p=v.length-h.length,T=v.length;let $;$=T%10==1?`${T} коммит`:`${T} коммит${T%10>=5||T%10==0?"ов":"а"}`;const b=i(v,l);return JSON.stringify([{alias:"vote",data:{title:"Самый 🔎 внимательный разработчик",subtitle:f.name,emoji:"🔎",users:r(x,l)}},{alias:"leaders",data:{title:"Больше всего коммитов",subtitle:f.name,emoji:"👑",users:b}},{alias:"chart",data:{title:"Коммиты",subtitle:f.name,values:s(d,o,t),users:b}},{alias:"diagram",data:{title:"Размер коммитов",subtitle:f.name,totalText:$,differenceText:`${p>0?"+"+p:p} с прошлого спринта`,categories:n(v,c,h)}}])}},447:e=>{e.exports=function(e,t){const a=[];return e.forEach((e=>{let i="object"==typeof e.author?e.author.id:e.author,r=a.findIndex((e=>e.id===i));if(-1===r){let e=t.find((e=>e.id===i));a.push({id:e.id,name:e.name,avatar:e.avatar,valueText:1})}else a[r].valueText+=1})),a.sort(((e,t)=>e.valueText>t.valueText?-1:e.valueText<t.valueText?1:0)),a}},155:e=>{e.exports=function(e,t){const a=[];return e.forEach((e=>{let i="object"==typeof e.author?e.author.id:e.author,r=a.findIndex((e=>e.id===i));if(-1===r){let r=t.find((e=>e.id===i));a.push({id:r.id,name:r.name,avatar:r.avatar,valueText:e.likes.length})}else a[r].valueText+=e.likes.length})),a.sort(((e,t)=>e.valueText>t.valueText?-1:e.valueText<t.valueText?1:0)),a.forEach(((e,t)=>{let i;i=1==e.valueText%10?`${e.valueText} голос`:`${e.valueText} голос${e.valueText%10>=5||e.valueText%10==0?"ов":"а"}`,a[t].valueText=i})),a}}},t={};!function a(i){var r=t[i];if(void 0!==r)return r.exports;var s=t[i]={exports:{}};return e[i](s,s.exports,a),s.exports}(138)})();