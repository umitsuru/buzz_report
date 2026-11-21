
'use strict';
(() => {
 const REPO='umitsuru/buzz_report', $=id=>document.getElementById(id);
 let styles=[],posts=[],selected=null,selectedPage=0,currentPost=null,ownOnly=false,sort='views';
 const fmt=v=>Number.isFinite(Number(v))?Number(v).toLocaleString('ja-JP'):'—';
 const img=(folder,file)=>'../posts/'+folder+'/img/'+file;
 const postDir=folder=>'https://github.com/'+REPO+'/tree/main/hikaku15/posts/'+folder;
 const imageUrl=(folder,file)=>'https://github.com/'+REPO+'/blob/main/hikaku15/posts/'+folder+'/img/'+file;
 const el=(tag,cls,value)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(value!=null)x.textContent=value;return x};
 function toast(s){let t=$('toast');t.textContent=s;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,2600)}
 async function copy(s){try{await navigator.clipboard.writeText(s);toast('コピーしました')}catch(e){toast('コピーできませんでした。テキストを選択してコピーしてください')}}
 function styleCommand(){
  if(!selected)return '';
  const s=selected;
  return [
   '【GAFU画風参照ID】'+s.id,
   '参考作品：'+s.title,
   '元のX投稿：'+s.url,
   '参考画像（優先）：'+imageUrl(s.folder,s.images[selectedPage]),
   '全参考画像フォルダ：'+postDir(s.folder),
   '作者：'+s.author,
   '画像を直接観察して、輪郭線・配色・塗り・陰影・顔のデフォルメ・表情・背景密度・文字やコマ割りの一般的な特徴を抽出し、独自の画風指定を組み立ててください。',
   '原作の具体的な人物・セリフ・物語・特徴的な構図をコピーしないでください。画風以外は新しい脚本と人物設定を優先してください。',
   '画像が読めない場合は推測せず、アクセスできないことを報告してください。'
  ].join('\n');
 }
 function prompt(){
  if(!selected){$('claudePrompt').value='画風を選択してください';return}
  const n=Number($('pages').value),ratio=$('ratio').value,workflow=$('workflow').value;
  const idea=$('idea').value.trim()||'題材は未指定。独創的な企画を提案して選定する。';
  const common=[
   'あなたはX向け連続漫画の編集者・脚本家・画像生成プロンプト設計者です。',
   '【題材】'+idea,
   '【方向性】'+$('tone').value,
   '【枚数・比率】'+n+'枚、'+ratio+'。右上に必ず1/'+n+'～'+n+'/'+n+'。',
   '【追加条件】'+($('notes').value.trim()||'なし'),
   '',
   styleCommand(),
   '',
   '【制作の必須ルール】',
   '選択した画風は全ページで統一する。登場人物の年齢、顔、髪型、服装、職場、道具も一致させる。',
   '各ページは1つのネタに絞り、冒頭の描写、途中の出来事、オチが一貫するようにする。上下3コマは基本だが、状況に応じて最適なコマ割りにする。',
   'スマートフォン、明細、LINEなどの画面は誰から誰へのメッセージか区別できるよう明示する。',
   '事実確認できない業界あるあるは、その店舗や人物の架空の設定だと扱う。',
   '参考作品の人物や具体的な展開を転用せず、新しい物語と独自の表現を作る。',
   '【各画像の完成プロンプト】',
   '全体のあらすじのみでは不十分。1枚ずつ独立して画像生成AIに渡せる完成版を作ること。',
   '各ページに、ページ番号・タイトル・登場人物・舞台・時間帯・各コマの構図・表情と動作・セリフ全文と話者・心の声・ナレーション・オチ・文字配置・画風ID・統一条件を具体的に書く。',
   '同じ話が重複していないか、話者や時系列に矛盾がないか、最後のオチが描写とつながるかを作成後に点検する。',
   '【共通設定の末尾に必ず入れる文】',
   '「画像はまだ作らないでください。これは全スライドの共通設定を伝えるためのプロンプトです。これから各スライドの指示を出すので、次の指示を待ってください。」',
   '画像はこの依頼でまだ生成しない。',
   '【保存】',
   '承認後は非公開GitHubリポジトリ umitsuru/ChatGPT_matome の prompts/<作品名>/ に common.md、01.md～'+String(n).padStart(2,'0')+'.md、project.json を保存する。GitHubにアクセスできない場合はファイル内容を出力する。',
   'Grokbotの元投稿データを編集・削除しない。GitHub Pagesに非公開の制作プロンプトを公開しない。'
  ];
  if(workflow==='ideas')common.push('【今回】まずネタ案10本だけを、1枚目の引きと最後のオチを添えて提案する。個別プロンプトはまだ作らない。');
  else if(workflow==='specific')common.push('【今回】指定テーマで共通設定1つと個別プロンプト'+n+'枚分を省略せずすべて作成する。');
  else common.push('【今回】まず企画案を比較して最適案を選び、共通設定と全'+n+'枚の個別完成プロンプトを省略せず作る。');
  $('claudePrompt').value=common.join('\n');
 }
 function showStylePage(i){
  if(!selected)return;
  selectedPage=i;
  $('styleMainImage').src=img(selected.folder,selected.images[i]);
  $('styleMainImage').alt=selected.label+'の参考画像 '+(i+1)+'枚目';
  $('styleMainIndex').textContent=(i+1)+' / '+selected.images.length;
  [...$('styleThumbs').children].forEach((x,j)=>x.classList.toggle('active',i===j));
  prompt();
 }
 function chooseStyle(id,scroll){
  const s=styles.find(x=>x.id===id);if(!s)return;
  selected=s;selectedPage=0;
  $('styleSelectedId').textContent=s.id;$('styleSelectedLabel').textContent=s.label;
  $('styleSourceInfo').textContent=s.author+' ・ '+s.image_count+'枚 ・ '+s.purpose;
  $('styleXLink').href=s.url;
  let t=$('styleThumbs');t.replaceChildren();
  for(let i=0;i<s.images.length;i++){
    let b=el('button'),im=el('img'),num=el('span',null,i+1);
    b.type='button';b.setAttribute('aria-label',(i+1)+'枚目を画風の主な参考画像に指定する');
    im.src=img(s.folder,s.images[i]);im.loading='lazy';b.append(im,num);b.onclick=()=>showStylePage(i);t.append(b);
  }
  showStylePage(0);
  document.querySelectorAll('.gafu-card').forEach(x=>x.classList.toggle('on',x.dataset.id===s.id));
  const counterpart=posts.find(p=>p.folder===s.folder);if(counterpart&&currentPost?.folder!==s.folder)selectPost(counterpart,false);
  const url=new URL(location.href);url.searchParams.set('gafu',s.id);history.replaceState(null,'',url.toString());
  if(scroll)$('styleSelected').scrollIntoView({behavior:'smooth',block:'start'});
 }
 function renderStyles(){
  const filter=$('styleFilter').value;
  const list=styles.filter(s=>!filter||(filter==='自分'?s.own:s.tag===filter));
  $('styleCount').textContent=list.length+' / '+styles.length+' STYLE REFERENCES';
  let root=$('styleCards');root.replaceChildren();
  for(const s of list){
    const card=el('article','gafu-card');card.dataset.id=s.id;if(s.id===selected?.id)card.classList.add('on');
    const cover=el('button','gafu-cover');cover.type='button';cover.setAttribute('aria-label',s.id+'を選択');
    for(const idx of [0,Math.floor(s.images.length/2),s.images.length-1]){
      let im=el('img');im.src=img(s.folder,s.images[idx]);im.alt='収集済みX投稿の画像';im.loading='lazy';cover.append(im);
    }
    cover.append(el('span','gafu-code',s.id));if(s.own)cover.append(el('span','gafu-own','自分の投稿'));
    cover.onclick=()=>chooseStyle(s.id,true);
    const body=el('div','gafu-body');
    body.append(el('h3',null,s.label),el('p','gafu-tags',s.tag+' ・ '+s.image_count+'枚'),el('p','gafu-purpose',s.purpose));
    const actions=el('div','gafu-actions'),b=el('button',null,'この画風を選ぶ'),link=el('a',null,'元投稿 ↗');
    b.type='button';b.onclick=()=>chooseStyle(s.id,true);
    link.href=s.url;link.target='_blank';link.rel='noopener noreferrer';actions.append(b,link);
    body.append(actions);card.append(cover,body);root.append(card);
  }
 }
 async function initStyles(){
  const r=await fetch('./styles.json',{cache:'no-store'});if(!r.ok)throw Error('styles.json '+r.status);
  const data=await r.json();styles=data.styles;
  if(!Array.isArray(styles)||styles.length!==10)throw Error('10件の画風データが必要です');
  const id=new URLSearchParams(location.search).get('gafu');
  chooseStyle(id||styles[0].id,false);renderStyles();
 }
 function postFiles(raw){
  let fs=(raw.thread||[]).flatMap(t=>t.images||[]).map(f=>f.replace(/^img\//,''));
  if(!fs.length&&raw.image_count)fs=Array.from({length:raw.image_count},(_,i)=>String(i+1).padStart(2,'0')+'.jpg');
  return fs;
 }
 async function folderNames(){
  try{const r=await fetch('../posts/index.json',{cache:'no-store'});if(r.ok){const j=await r.json();if(Array.isArray(j)&&j.length)return j;}}catch(e){}
  const r=await fetch('https://api.github.com/repos/'+REPO+'/contents/hikaku15/posts?ref=main');
  if(!r.ok)throw Error('GitHub API '+r.status);
  return (await r.json()).filter(x=>x.type==='dir').map(x=>x.name);
 }
 async function loadPost(folder){
  const r=await fetch('../posts/'+folder+'/raw.json',{cache:'no-store'});if(!r.ok)return null;
  const raw=await r.json(),files=postFiles(raw);
  return files.length?{folder,raw,files}:null;
 }
 const title=raw=>(raw.text||'（本文なし）').split('\n').filter(Boolean).slice(0,2).join(' ').slice(0,110);
 function showPostSlide(i){
  if(!currentPost)return;
  $('heroImage').src=img(currentPost.folder,currentPost.files[i]);
  $('heroPage').textContent=(i+1)+' / '+currentPost.files.length;
  [...$('thumbs').children].forEach((x,j)=>x.classList.toggle('active',i===j));
 }
 function selectPost(p,scroll){
  currentPost=p;const raw=p.raw;
  $('selectedTitle').textContent=title(raw);$('selectedMeta').textContent=(raw.author?.handle||'')+' ・ '+p.files.length+'枚 ・ 表示 '+fmt(raw.metrics?.views);
  $('selectedText').textContent=raw.text||'';$('xLink').href=raw.url;$('archiveLink').href=postDir(p.folder);
  const thumbs=$('thumbs');thumbs.replaceChildren();
  p.files.forEach((file,i)=>{let b=el('button'),im=el('img'),num=el('span',null,i+1);b.type='button';im.loading='lazy';im.src=img(p.folder,file);im.alt='';b.append(im,num);b.onclick=()=>{showPostSlide(i);const s=styles.find(x=>x.folder===p.folder);if(s){chooseStyle(s.id,false);showStylePage(i);}};thumbs.append(b);});
  showPostSlide(0);const matching=styles.find(x=>x.folder===p.folder);if(matching&&selected?.id!==matching.id)chooseStyle(matching.id,false);
  renderPosts();if(scroll)$('selected').scrollIntoView({behavior:'smooth',block:'start'});
 }
 function renderPosts(){
  let arr=posts.filter(p=>(!ownOnly||p.raw.own)&&[p.raw.text,p.raw.author?.handle].join(' ').toLowerCase().includes($('query').value.trim().toLowerCase()));
  if(sort==='new')arr.sort((a,b)=>(b.raw.collected_at||'').localeCompare(a.raw.collected_at||''));
  else arr.sort((a,b)=>Number(b.raw.metrics?.[sort]||0)-Number(a.raw.metrics?.[sort]||0));
  $('shownCount').textContent=arr.length+' / '+posts.length+' 件';const root=$('cards');root.replaceChildren();
  for(const p of arr){
    const c=el('article','post-card');if(currentPost?.folder===p.folder)c.classList.add('active');
    const cover=el('button','cover');cover.type='button';const im=el('img');im.src=img(p.folder,p.files[0]);im.loading='lazy';im.alt=title(p.raw);
    cover.append(im,el('span',null,p.files.length+'枚'));cover.onclick=()=>selectPost(p,true);
    const body=el('div','post-body');body.append(el('h3',null,title(p.raw)),el('div','author',(p.raw.author?.handle||'')+(p.raw.own?' ・ 自分の投稿':'')),el('div','metrics','表示 '+fmt(p.raw.metrics?.views)+' ・ いいね '+fmt(p.raw.metrics?.likes)));
    const actions=el('div','post-actions'),b=el('button',null,'画像を見る・参考にする'),link=el('a',null,'Xで見る ↗');
    b.type='button';b.onclick=()=>selectPost(p,true);link.href=p.raw.url;link.target='_blank';link.rel='noopener noreferrer';actions.append(b,link);body.append(actions);c.append(cover,body);root.append(c);
  }
  if(!arr.length)root.append(el('p','load','一致する投稿がありません'));
 }
 async function initPosts(){
  try{const folders=await folderNames();posts=(await Promise.all(folders.map(f=>loadPost(f).catch(()=>null)))).filter(Boolean);
   $('countPosts').textContent=posts.length;$('countImages').textContent=posts.reduce((a,p)=>a+p.files.length,0);
   renderPosts();if(posts.length)selectPost(posts.find(p=>p.folder===selected?.folder)||posts[0],false);
  }catch(e){$('cards').textContent='';$('loadError').hidden=false;$('loadError').textContent='収集した投稿の一覧を読み込めませんでした。GitHub APIか保存先の公開状態を確認してください。';console.error(e);}
 }
 $('styleFilter').addEventListener('change',renderStyles);
 $('copyStyleCommand').addEventListener('click',()=>copy(styleCommand()));
 $('query').addEventListener('input',renderPosts);$('sort').addEventListener('change',e=>{sort=e.target.value;renderPosts()});
 $('own').addEventListener('change',e=>{ownOnly=e.target.checked;renderPosts()});
 for(const id of ['idea','tone','pages','ratio','notes','workflow'])$(id).addEventListener('input',prompt);
 $('copy').addEventListener('click',()=>copy($('claudePrompt').value));
 $('download').addEventListener('click',()=>{
   const blob=new Blob([$('claudePrompt').value],{type:'text/plain;charset=utf-8'});
   const url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=(selected?.id||'GAFU')+'-claude-instructions.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('保存しました');
 });
 (async()=>{try{await initStyles()}catch(e){$('styleCards').textContent='画風データの読み込みに失敗しました。';console.error(e)}await initPosts();prompt();})();
})();
