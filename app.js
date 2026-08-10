const $ = id => document.getElementById(id);
const PROGRESS_KEY = "codeforge_live_v2";
const SETTINGS_KEY = "codeforge_settings_v2";
const PACK_KEY = "codeforge_exercise_pack";
const APP_VERSION = "2.2.0";

const DEFAULT_SETTINGS = {
  count: 10,
  dailyGoal: 5,
  examMinutes: 10,
  fontScale: 1,
  highContrast: false,
  reduceMotion: false,
  sound: true,
  haptics: true,
  reminderEnabled: false,
  reminderTime: "19:00"
};

const BADGES = [
  { id:"first", icon:"🚀", name:"Primo passo", description:"Completa il primo esercizio", test:p=>p.total>=1 },
  { id:"ten", icon:"🔟", name:"Riscaldamento", description:"Completa 10 esercizi", test:p=>p.total>=10 },
  { id:"fifty", icon:"🏋️", name:"Allenamento", description:"Completa 50 esercizi", test:p=>p.total>=50 },
  { id:"xp500", icon:"⚡", name:"500 XP", description:"Raggiungi 500 XP", test:p=>p.xp>=500 },
  { id:"xp2000", icon:"🔥", name:"2000 XP", description:"Raggiungi 2000 XP", test:p=>p.xp>=2000 },
  { id:"streak3", icon:"📅", name:"Costanza", description:"Serie di 3 giorni", test:p=>p.streak>=3 },
  { id:"streak7", icon:"🗓️", name:"Settimana perfetta", description:"Serie di 7 giorni", test:p=>p.streak>=7 },
  { id:"accuracy80", icon:"🎯", name:"Precisione", description:"80% su almeno 20 risposte", test:p=>p.total>=20 && p.correct/p.total>=.8 },
  { id:"exam", icon:"⏱️", name:"Sotto pressione", description:"Supera un esame con almeno 80%", test:p=>(p.bestExam||0)>=80 },
  { id:"logic", icon:"🧠", name:"Pensiero logico", description:"Porta Logica almeno al 60%", test:(p,q)=>masteryFor("Logica",p,q)>=60 },
  { id:"offline", icon:"📦", name:"Sempre pronto", description:"Scarica il pacchetto offline", test:p=>Boolean(p.offlineDownloaded) },
  { id:"allround", icon:"🌟", name:"Full stack", description:"Almeno 30% in ogni area", test:(p,q)=>[...new Set(q.map(x=>x.category))].every(c=>masteryFor(c,p,q)>=30) }
];

let settings = loadSettings();
let progress = loadProgress();
let questions = [];
let session = null;
let answered = false;
let timerId = null;
let editorHistory = [""];
let editorHistoryIndex = 0;
let waitingWorker = null;

function loadSettings() {
  const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
  const legacyCount = Number(localStorage.getItem("codeforge_settings_v1")) || undefined;
  return { ...DEFAULT_SETTINGS, ...(saved || {}), ...(legacyCount && !saved ? { count: legacyCount } : {}) };
}

function loadProgress() {
  const parsed = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "null");
  return {
    xp:0, correct:0, total:0, streak:0, last:null, items:{}, daily:{}, badges:[],
    sessions:0, bestExam:0, offlineDownloaded:false, profile:{name:"",email:""}, pro:false,
    ...(parsed || {})
  };
}

function saveAll() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  CodeForgeNative.saveNativePreferences(PROGRESS_KEY, progress).catch(()=>{});
  updateWidget();
}

function itemState(id) {
  return progress.items[id] || (progress.items[id] = { mastery:0, wrong:0, next:"2000-01-01" });
}

function dateKey(date = new Date()) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0,10);
}

function normalize(value) {
  return (value || "").replace(/\s+/g," ").replace(/;$/," ").trim().toLowerCase();
}

function masteryFor(category,p=progress,q=questions) {
  const items = q.filter(x=>x.category===category);
  if (!items.length) return 0;
  return Math.round(items.reduce((sum,x)=>sum+(p.items[x.id]?.mastery || 0),0)/items.length);
}

function levelInfo(xp) {
  const level = Math.max(1, Math.floor(Math.sqrt(xp / 110)) + 1);
  const names = ["Apprendista","Junior","Sviluppatore","Debugger","Specialista","Senior","Architect","Code Master"];
  const currentBase = Math.pow(level-1,2)*110;
  const nextBase = Math.pow(level,2)*110;
  return { level, name:names[Math.min(names.length-1,level-1)], currentBase, nextBase };
}

async function loadQuestions(force=false) {
  if (!force) {
    const cached = JSON.parse(localStorage.getItem(PACK_KEY) || "null");
    if (cached?.exercises?.length) questions = cached.exercises;
  }
  try {
    const response = await fetch(`exercises.json?v=${APP_VERSION}`, { cache:"no-store" });
    if (!response.ok) throw new Error("Pacchetto non disponibile");
    const pack = await response.json();
    const addonResponse = await fetch(`exercises-addon-2.2.json?v=${APP_VERSION}`, { cache:"no-store" });
    const addon = addonResponse.ok ? await addonResponse.json() : { exercises: [] };
    const byId = new Map([...pack.exercises, ...addon.exercises].map(item => [item.id, item]));
    questions = [...byId.values()];
    localStorage.setItem(PACK_KEY, JSON.stringify({ ...pack, version: APP_VERSION, exercises: questions }));
  } catch (error) {
    if (!questions.length) throw error;
  }
}

function show(id) {
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo({top:0,behavior:settings.reduceMotion?"auto":"smooth"});
  if (id==="home") renderHome();
}

function renderHome() {
  const level = levelInfo(progress.xp);
  $("xp").textContent = progress.xp;
  $("accuracy").textContent = progress.total ? `${Math.round(progress.correct/progress.total*100)}%` : "0%";
  $("streak").textContent = `${progress.streak} ${progress.streak===1?"giorno":"giorni"}`;
  $("level").textContent = level.level;
  $("levelName").textContent = level.name;
  const due = questions.filter(q=>itemState(q.id).next<=dateKey()).length;
  $("due").textContent = `${due} da ripassare`;

  const done = progress.daily[dateKey()] || 0;
  const percentage = Math.min(100,done/settings.dailyGoal*100);
  $("goalTitle").textContent = `${done} / ${settings.dailyGoal} esercizi`;
  $("goalBar").style.width = `${percentage}%`;
  $("goalStatus").textContent = done>=settings.dailyGoal ? "Completato" : "In corso";
  $("goalMessage").textContent = done>=settings.dailyGoal ? "Obiettivo raggiunto: ottimo lavoro!" : `Mancano ${Math.max(0,settings.dailyGoal-done)} esercizi.`;

  const categories = [...new Set(questions.map(q=>q.category))];
  $("skills").innerHTML = categories.map(category=>{
    const mastery = masteryFor(category);
    return `<div class="skill"><b>${escapeHtml(category)}</b><div class="bar"><i style="width:${mastery}%"></i></div><b>${mastery}%</b></div>`;
  }).join("");

  renderBadgeGrid("badgePreview", false);
  $("offlineStatus").textContent = progress.offlineDownloaded ? "Pacchetto offline disponibile e aggiornabile." : "Scarica gli esercizi per allenarti senza rete.";
}

function renderBadgeGrid(targetId, all) {
  const unlocked = new Set(progress.badges || []);
  const list = all ? BADGES : BADGES.filter(x=>unlocked.has(x.id)).slice(-5);
  $(targetId).innerHTML = (list.length?list:BADGES.slice(0,3)).map(b=>{
    const isUnlocked = unlocked.has(b.id);
    return `<article class="badge-item ${isUnlocked?"":"locked"}"><span class="badge-icon">${b.icon}</span><b>${escapeHtml(b.name)}</b><small>${escapeHtml(b.description)}</small></article>`;
  }).join("");
}

function updateBadges() {
  const before = new Set(progress.badges || []);
  const newly = [];
  BADGES.forEach(b=>{
    if (!before.has(b.id) && b.test(progress,questions)) {
      before.add(b.id); newly.push(b);
    }
  });
  progress.badges = [...before];
  return newly;
}

function updateStreak() {
  const today = dateKey();
  if (!progress.last) progress.streak = 1;
  else {
    const distance = Math.floor((new Date(today)-new Date(progress.last))/86400000);
    if (distance===1) progress.streak += 1;
    else if (distance>1) progress.streak = 1;
  }
  progress.last = today;
}

function pickQuestions(mode,count) {
  let pool;
  if (mode==="adaptive" || mode==="exam") pool=[...questions];
  else if (mode==="review") pool=questions.filter(q=>itemState(q.id).next<=dateKey());
  else pool=questions.filter(q=>q.type===mode);
  if (!pool.length) pool=[...questions];
  pool.sort((a,b)=>(itemState(a.id).mastery-itemState(b.id).mastery)+(Math.random()-.5));
  const result=[];
  while(result.length<count) {
    for (const q of pool) {
      result.push(q);
      if(result.length===count) break;
    }
  }
  return result;
}

function startSession(mode="adaptive") {
  updateStreak();
  const isExam = mode==="exam";
  const count = isExam ? Math.max(10,settings.count) : settings.count;
  session={mode,questions:pickQuestions(mode,count),index:0,xp:0,correct:0,newBadges:[],seconds:isExam?settings.examMinutes*60:null};
  answered=false;
  $("tot").textContent=session.questions.length;
  $("timerRow").classList.toggle("hidden",!isExam);
  $("hint").classList.toggle("hidden",isExam);
  show("session");
  renderQuestion();
  if(isExam) startTimer();
  saveAll();
}

function renderQuestion() {
  answered=false;
  const q=session.questions[session.index];
  $("idx").textContent=session.index+1;
  $("sessionXp").textContent=session.xp;
  $("prog").style.width=`${session.index/session.questions.length*100}%`;
  $("cat").textContent=q.category;
  $("diff").textContent=q.difficulty;
  $("questionTitle").textContent=q.prompt;
  $("context").textContent=q.context;
  $("code").textContent=q.code;
  $("feedback").className="feedback hidden";
  $("feedback").innerHTML="";
  $("check").classList.remove("hidden");
  $("next").classList.add("hidden");
  $("hint").disabled=false;
  $("answer").disabled=false;
  $("answer").value="";
  editorHistory=[""]; editorHistoryIndex=0;
  updateLineNumbers();
  setTimeout(()=>$("answer").focus(),50);
}

function evaluate(q,value) {
  if(q.answers) return q.answers.some(answer=>normalize(answer)===normalize(value));
  const normalized=normalize(value);
  return q.keywords.every(keyword=>normalized.includes(normalize(keyword)));
}

function checkAnswer(auto=false) {
  if(answered) return;
  const q=session.questions[session.index];
  const value=$("answer").value;
  if(!auto && !value.trim()) { $("feedback").className="feedback ko"; $("feedback").textContent="Scrivi una risposta prima di verificare."; return; }
  answered=true;
  const correct=!auto && evaluate(q,value);
  const state=itemState(q.id);
  const gain=correct ? 20+(q.difficulty==="Intermedio"?5:q.difficulty==="Avanzato"?10:0) : 5;
  session.xp+=gain; progress.xp+=gain; progress.total+=1;
  progress.daily[dateKey()] = (progress.daily[dateKey()]||0)+1;
  if(correct){session.correct+=1;progress.correct+=1;state.mastery=Math.min(100,state.mastery+15)}
  else{state.wrong+=1;state.mastery=Math.max(0,state.mastery-8)}
  const nextDate=new Date();
  nextDate.setDate(nextDate.getDate()+(correct?Math.min(30,Math.max(1,Math.ceil(state.mastery/20))):1));
  state.next=dateKey(nextDate);
  saveAll();
  playSound(correct);
  if(settings.haptics) CodeForgeNative.haptic(correct?"success":"error");
  $("answer").disabled=true;
  $("feedback").className=`feedback ${correct?"ok":"ko"}`;
  $("feedback").innerHTML=`<b>${correct?"✅ Corretto":auto?"⏰ Tempo scaduto":"❌ Da rivedere"}</b><p>${escapeHtml(q.explanation)}${correct?"":`<br><br><b>Soluzione possibile:</b><br><code>${escapeHtml(q.solution || q.answers?.[0] || "")}</code>`}</p>`;
  $("check").classList.add("hidden");
  $("next").classList.remove("hidden");
  $("sessionXp").textContent=session.xp;
}

function nextQuestion() {
  if(++session.index>=session.questions.length) finishSession();
  else renderQuestion();
}

function finishSession() {
  stopTimer();
  progress.sessions+=1;
  const score=Math.round(session.correct/session.questions.length*100);
  if(session.mode==="exam") progress.bestExam=Math.max(progress.bestExam||0,score);
  session.newBadges=updateBadges();
  saveAll();
  $("resultXp").textContent=session.xp;
  $("resultText").textContent=`${session.correct}/${session.questions.length} corrette — ${score}% di precisione${session.mode==="exam"?" in modalità esame":""}.`;
  $("newBadges").innerHTML=session.newBadges.map(b=>`<article class="badge-item"><span class="badge-icon">${b.icon}</span><b>Nuovo: ${escapeHtml(b.name)}</b><small>${escapeHtml(b.description)}</small></article>`).join("");
  $("prog").style.width="100%";
  show("result");
}

function startTimer() {
  updateTimer();
  timerId=setInterval(()=>{
    session.seconds-=1;
    updateTimer();
    if(session.seconds<=0){stopTimer();checkAnswer(true)}
  },1000);
}
function stopTimer(){if(timerId){clearInterval(timerId);timerId=null}}
function updateTimer(){
  const min=Math.floor(session.seconds/60),sec=session.seconds%60;
  $("timer").textContent=`${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  $("timerRow").classList.toggle("urgent",session.seconds<=60);
}

function playSound(ok) {
  if(!settings.sound) return;
  try{
    const ctx=new AudioContext(),osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.connect(gain);gain.connect(ctx.destination);osc.frequency.value=ok?700:190;gain.gain.value=.05;
    osc.start();gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.15);osc.stop(ctx.currentTime+.16);
  }catch{}
}

function updateLineNumbers() {
  const count=Math.max(1,$("answer").value.split("\n").length);
  $("lineNumbers").textContent=Array.from({length:count},(_,i)=>i+1).join("\n");
}
function pushEditorHistory(){
  const value=$("answer").value;
  if(editorHistory[editorHistoryIndex]===value)return;
  editorHistory=editorHistory.slice(0,editorHistoryIndex+1);
  editorHistory.push(value);editorHistoryIndex=editorHistory.length-1;
}
function setEditorValue(value){
  $("answer").value=value;updateLineNumbers();
}
function insertAtCursor(text,wrapEnd=""){
  const el=$("answer"),start=el.selectionStart,end=el.selectionEnd,selected=el.value.slice(start,end);
  const value=el.value.slice(0,start)+text+selected+wrapEnd+el.value.slice(end);
  setEditorValue(value);el.focus();
  const cursor=start+text.length+selected.length;
  el.setSelectionRange(cursor,cursor);pushEditorHistory();
}

async function downloadOfflinePack() {
  $("offlineStatus").textContent="Download in corso…";
  try{
    await loadQuestions(true);
    if("caches" in window){
      const cache=await caches.open(`codeforge-offline-${APP_VERSION}`);
      await cache.addAll(["./","index.html","styles.css","app.js","native-bridge.js","manifest.json","icon.svg","exercises.json"]);
    }
    progress.offlineDownloaded=true;updateBadges();saveAll();renderHome();
    $("offlineStatus").textContent="Pacchetto aggiornato: esercizi disponibili offline.";
  }catch(error){$("offlineStatus").textContent=`Download non riuscito: ${error.message}`}
}

function applySettingsToUi(){
  document.documentElement.style.setProperty("--font-scale",String(settings.fontScale));
  document.body.classList.toggle("high-contrast",settings.highContrast);
  document.body.classList.toggle("reduce-motion",settings.reduceMotion);
  $("count").value=String(settings.count);$("dailyGoal").value=String(settings.dailyGoal);$("examMinutes").value=String(settings.examMinutes);
  $("fontScale").value=String(settings.fontScale);$("highContrast").checked=settings.highContrast;$("reduceMotion").checked=settings.reduceMotion;
  $("sound").checked=settings.sound;$("haptics").checked=settings.haptics;$("reminderEnabled").checked=settings.reminderEnabled;$("reminderTime").value=settings.reminderTime;
}
async function saveSettingsFromUi(){
  settings={...settings,count:Number($("count").value),dailyGoal:Number($("dailyGoal").value),examMinutes:Number($("examMinutes").value),
    fontScale:Number($("fontScale").value),highContrast:$("highContrast").checked,reduceMotion:$("reduceMotion").checked,
    sound:$("sound").checked,haptics:$("haptics").checked,reminderEnabled:$("reminderEnabled").checked,reminderTime:$("reminderTime").value};
  applySettingsToUi();saveAll();
  let message="Impostazioni salvate.";
  if(settings.reminderEnabled){const result=await CodeForgeNative.scheduleDailyReminder(settings.reminderTime);message=result.message}
  else await CodeForgeNative.cancelDailyReminder();
  $("settingsStatus").textContent=message;
}

function saveProfile(){
  progress.profile={name:$("profileName").value.trim(),email:$("profileEmail").value.trim()};
  saveAll();$("syncStatus").textContent="Profilo salvato sul dispositivo.";
}
async function syncNow(){
  $("syncStatus").textContent="Sincronizzazione in corso…";
  try{
    const result=await CodeForgeNative.syncProgress({version:APP_VERSION,profile:progress.profile,progress,settings});
    $("syncStatus").textContent=result.message || (result.ok?"Progressi sincronizzati.":"Sincronizzazione non disponibile.");
  }catch(error){$("syncStatus").textContent=error.message}
}
function exportProgress(){
  const blob=new Blob([JSON.stringify({version:APP_VERSION,exportedAt:new Date().toISOString(),progress,settings},null,2)],{type:"application/json"});
  const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download=`codeforge-backup-${dateKey()}.json`;link.click();URL.revokeObjectURL(link.href);
}
async function importProgress(file){
  try{
    const data=JSON.parse(await file.text());
    if(!data.progress)throw new Error("Backup non valido");
    progress={...progress,...data.progress};settings={...settings,...(data.settings||{})};saveAll();applySettingsToUi();renderHome();
    $("syncStatus").textContent="Backup importato correttamente.";
  }catch(error){$("syncStatus").textContent=`Importazione fallita: ${error.message}`}
}

async function restorePurchases(){
  $("purchaseStatus").textContent="Controllo acquisti…";
  const result=await CodeForgeNative.restorePurchases();
  if(result.active){progress.pro=true;saveAll()}
  $("purchaseStatus").textContent=result.active?"CodeForge Pro ripristinato.":result.message;
}
async function purchasePro(){
  $("purchaseStatus").textContent="Apertura store…";
  const result=await CodeForgeNative.purchasePro();
  if(result.active){progress.pro=true;saveAll()}
  $("purchaseStatus").textContent=result.active?"CodeForge Pro attivato.":result.message;
}

function updateWidget(){
  const level=levelInfo(progress.xp);
  CodeForgeNative.updateStreakWidget({streak:progress.streak,xp:progress.xp,level:level.level,daily:progress.daily[dateKey()]||0,goal:settings.dailyGoal});
}

function checkWebReminder(){
  if(!settings.reminderEnabled||CodeForgeNative.isNative())return;
  const now=new Date(),[h,m]=settings.reminderTime.split(":").map(Number);
  const last=localStorage.getItem("codeforge_web_reminder_seen");
  if((now.getHours()>h||(now.getHours()===h&&now.getMinutes()>=m))&&last!==dateKey()){
    localStorage.setItem("codeforge_web_reminder_seen",dateKey());
    $("goalMessage").textContent="Promemoria: completa il ripasso giornaliero per mantenere la serie.";
  }
}

function setupEditor(){
  $("answer").addEventListener("input",()=>{updateLineNumbers();pushEditorHistory()});
  $("answer").addEventListener("keydown",event=>{
    if(event.key==="Tab"){event.preventDefault();insertAtCursor("  ")}
    if(event.key==="Enter"){
      const start=$("answer").selectionStart,before=$("answer").value.slice(0,start),line=before.split("\n").pop()||"",indent=line.match(/^\s*/)?.[0]||"";
      if(line.trim().endsWith("{"))setTimeout(()=>insertAtCursor(indent+"  "),0);
    }
  });
  document.querySelectorAll(".editor-tool[data-insert]").forEach(btn=>btn.addEventListener("click",()=>insertAtCursor(btn.dataset.insert)));
  document.querySelectorAll(".editor-tool[data-wrap]").forEach(btn=>btn.addEventListener("click",()=>insertAtCursor(btn.dataset.wrap[0],btn.dataset.wrap[1])));
  $("undoBtn").onclick=()=>{if(editorHistoryIndex>0)setEditorValue(editorHistory[--editorHistoryIndex])};
  $("redoBtn").onclick=()=>{if(editorHistoryIndex<editorHistory.length-1)setEditorValue(editorHistory[++editorHistoryIndex])};
}

function registerServiceWorker(){
  if(!("serviceWorker" in navigator))return;
  navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"}).then(registration=>{
    if(registration.waiting){waitingWorker=registration.waiting;$("updateBanner").classList.remove("hidden")}
    registration.addEventListener("updatefound",()=>{
      const worker=registration.installing;
      worker?.addEventListener("statechange",()=>{
        if(worker.state==="installed"&&navigator.serviceWorker.controller){waitingWorker=worker;$("updateBanner").classList.remove("hidden")}
      });
    });
    setInterval(()=>registration.update(),3600000);
  }).catch(console.error);
  navigator.serviceWorker.addEventListener("controllerchange",()=>location.reload());
}

function escapeHtml(value){
  return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
}

function bindEvents(){
  document.querySelectorAll(".mode").forEach(button=>button.onclick=()=>startSession(button.dataset.mode));
  $("daily").onclick=()=>startSession("adaptive");$("examQuick").onclick=()=>startSession("exam");
  $("check").onclick=()=>checkAnswer();$("next").onclick=nextQuestion;
  $("hint").onclick=()=>{const q=session.questions[session.index];$("feedback").className="feedback";$("feedback").innerHTML=`<b>💡 Suggerimento</b><p>${escapeHtml(q.hint)}</p>`;$("hint").disabled=true};
  $("exit").onclick=()=>{if(confirm("Uscire dalla sessione?")){stopTimer();show("home")}};
  $("homeBtn").onclick=()=>show("home");$("brandHome").onclick=()=>show("home");
  $("navHome").onclick=()=>show("home");$("navReview").onclick=()=>startSession("review");$("navDaily").onclick=()=>startSession("adaptive");$("navExam").onclick=()=>startSession("exam");
  $("settingsBtn").onclick=()=>show("settings");$("profileBtn").onclick=()=>{show("profile");$("profileName").value=progress.profile.name||"";$("profileEmail").value=progress.profile.email||""};
  document.querySelectorAll(".backHome").forEach(btn=>btn.onclick=()=>show("home"));
  $("allBadgesBtn").onclick=()=>{renderBadgeGrid("allBadges",true);show("badges")};
  $("downloadOffline").onclick=downloadOfflinePack;$("saveSettings").onclick=saveSettingsFromUi;
  $("reset").onclick=()=>{if(confirm("Azzerare tutti i progressi?")){localStorage.removeItem(PROGRESS_KEY);location.reload()}};
  $("saveProfile").onclick=saveProfile;$("syncNow").onclick=syncNow;$("exportProgress").onclick=exportProgress;
  $("importProgress").onchange=e=>e.target.files?.[0]&&importProgress(e.target.files[0]);
  $("restorePurchases").onclick=restorePurchases;$("upgradeBtn").onclick=purchasePro;
  $("applyUpdate").onclick=()=>waitingWorker?.postMessage({type:"SKIP_WAITING"});
}

async function init(){
  $("platformLabel").textContent=CodeForgeNative.isNative()?`App ${CodeForgeNative.platform()}`:"Web App";
  applySettingsToUi();bindEvents();setupEditor();registerServiceWorker();
  try{await loadQuestions()}catch(error){document.body.innerHTML=`<main class="app-shell"><article class="card"><h1>CodeForge non disponibile</h1><p>${escapeHtml(error.message)}</p></article></main>`;return}
  updateBadges();saveAll();renderHome();checkWebReminder();
}
init();