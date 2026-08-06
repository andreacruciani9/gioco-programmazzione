const AD_SCENARIOS = {
  attack: [
    {
      id: 'attack-wifi-recon', level: 'Base', title: 'Ricognizione del Wi‑Fi simulato',
      objective: 'Impara a riconoscere una configurazione wireless debole senza collegarti a reti reali.',
      story: 'Sei nella CyberRange locale. Il sistema genera tre access point inventati. Devi analizzare solo i dati forniti dall’app e scegliere quale configurazione richiede una verifica prioritaria.',
      lesson: 'La ricognizione non significa “provare password”. Prima si osservano tecnologia, cifratura, WPS, separazione ospiti e aggiornamento del dispositivo.',
      code: `// Dati completamente inventati e locali\nconst accessPoints = [\n  { name: "LAB-GUEST", security: "WPA2", wps: true },\n  { name: "LAB-STAFF", security: "WPA3", wps: false },\n  { name: "LAB-IOT", security: "WPA2", wps: false }\n];\n\n// Cerchiamo configurazioni da controllare, non reti reali\nconst risky = accessPoints.filter(ap =>\n  ap.security !== "WPA3" || ap.wps === true\n);`,
      question: 'Quale rete simulata va analizzata per prima?',
      type: 'choice', options: ['LAB-GUEST, perché usa WPA2 e WPS è attivo', 'LAB-STAFF, perché usa WPA3', 'Tutte sono identiche', 'Nessuna configurazione va mai verificata'], correct: 0,
      hint: 'Cerca la combinazione con più superficie di rischio: protezione meno moderna e funzione WPS attiva.',
      explanation: 'LAB-GUEST ha due segnali da approfondire. In un audit autorizzato si documentano configurazione e contromisure, senza tentare accessi a reti di terzi.',
      nodes: [{name:'Analista',detail:'Console locale',state:'active'},{name:'LAB-GUEST',detail:'WPA2 · WPS attivo',state:'risk'},{name:'LAB-STAFF',detail:'WPA3 · WPS spento',state:'safe'},{name:'LAB-IOT',detail:'WPA2 · rete isolata',state:''}]
    },
    {
      id: 'attack-wifi-entry', level: 'Junior', title: 'Trova il varco nella configurazione',
      objective: 'Comprendi come una combinazione di controlli deboli aumenta il rischio.',
      story: 'Il laboratorio non usa password vere. Un motore di simulazione assegna un punteggio di rischio alle configurazioni. Il tuo compito è completare la logica, non attaccare un access point.',
      lesson: 'Una singola debolezza può non bastare. I professionisti correlano più segnali: WPS, credenziali predefinite, firmware vecchio e assenza di isolamento.',
      code: `function calculateRisk(config) {\n  let score = 0;\n\n  // Ogni controllo debole aumenta il rischio simulato\n  if (config.wpsEnabled) score += 2;\n  if (config.defaultPassword) score += 4;\n  if (!config.guestIsolation) score += 3;\n\n  return score;\n}\n\nconst result = calculateRisk({\n  wpsEnabled: true,\n  defaultPassword: true,\n  guestIsolation: false\n});`,
      question: 'Quale intervento riduce maggiormente il rischio dello scenario?',
      type: 'choice', options: ['Cambiare le credenziali predefinite, disattivare WPS e isolare gli ospiti', 'Nascondere soltanto il nome della rete', 'Aumentare la potenza del segnale', 'Rinominare il router'], correct: 0,
      hint: 'Correggi le condizioni che aumentano direttamente il punteggio.',
      explanation: 'La difesa efficace rimuove più cause alla radice. Nascondere il nome della rete non sostituisce autenticazione, aggiornamenti e segmentazione.',
      nodes: [{name:'Motore rischio',detail:'Score locale',state:'active'},{name:'WPS',detail:'Attivo',state:'risk'},{name:'Credenziali',detail:'Predefinite',state:'risk'},{name:'Isolamento',detail:'Disattivato',state:'risk'}]
    },
    {
      id: 'attack-inside-network', level: 'Intermedio', title: 'Dentro la rete del laboratorio',
      objective: 'Mappa i servizi esposti e individua il percorso più rischioso.',
      story: 'Il simulatore considera già ottenuto un accesso fittizio alla zona ospiti. Ora devi capire perché una rete piatta facilita il movimento laterale.',
      lesson: 'Dopo un accesso iniziale, un attaccante cerca servizi raggiungibili. Il difensore deve sapere quali percorsi esistono e limitarli con segmentazione e minimo privilegio.',
      code: `const services = [\n  { name: "Guest portal", zone: "guest", reachable: true },\n  { name: "Printer", zone: "office", reachable: true },\n  { name: "Admin panel", zone: "admin", reachable: true },\n  { name: "Database", zone: "data", reachable: false }\n];\n\n// In una rete ben segmentata, la zona guest non vede admin\nconst exposed = services.filter(service => service.reachable);`,
      question: 'Quale esposizione dimostra il problema più grave?',
      type: 'choice', options: ['Il pannello amministrativo è raggiungibile dalla zona ospiti', 'Il portale ospiti è raggiungibile dagli ospiti', 'Il database non è raggiungibile', 'La stampante ha un nome'], correct: 0,
      hint: 'Confronta il livello di privilegio del servizio con la zona da cui è raggiungibile.',
      explanation: 'Un pannello amministrativo non deve essere raggiungibile dalla rete ospiti. La correzione è segmentare le zone e consentire solo i flussi necessari.',
      nodes: [{name:'Zona guest',detail:'Accesso simulato',state:'active'},{name:'Stampante',detail:'Esposta',state:''},{name:'Admin panel',detail:'Percorso improprio',state:'risk'},{name:'Database',detail:'Bloccato',state:'safe'}]
    },
    {
      id: 'attack-locker-simulation', level: 'Avanzato', title: 'Locker innocuo nel sandbox',
      objective: 'Comprendi il comportamento di un file locker senza cifrare o modificare file reali.',
      story: 'Il laboratorio usa soltanto oggetti JavaScript in memoria. La simulazione marca documenti inventati come “locked” e genera eventi difensivi. Non accede al filesystem, non usa chiavi e non produce malware.',
      lesson: 'Studiare il comportamento permette di rilevare segnali come molte modifiche rapide, estensioni insolite e accessi anomali alle condivisioni. Il codice resta deliberatamente non operativo.',
      code: `const labFiles = [\n  { name: "report.txt", locked: false },\n  { name: "invoice.pdf", locked: false }\n];\n\nfunction simulateLocker(files) {\n  // Solo copia di oggetti in memoria: nessun file reale\n  return files.map(file => ({\n    ...file,\n    locked: true,\n    simulation: true\n  }));\n}\n\nconst simulatedResult = simulateLocker(labFiles);`,
      question: 'Scrivi quali elementi rendono questo esempio una simulazione sicura.',
      type: 'text', keywords: ['memoria','nessun file reale','simulation'], sample: 'Lavora solo in memoria, non modifica nessun file reale e marca ogni risultato con simulation: true.',
      hint: 'Guarda il commento, il tipo di dati usato e la proprietà finale.',
      explanation: 'Il codice trasforma una lista di oggetti già presente nell’app. Non apre cartelle, non cifra dati e non comunica con altri sistemi.',
      nodes: [{name:'Sandbox JS',detail:'Solo memoria',state:'active'},{name:'report.txt',detail:'Oggetto inventato',state:''},{name:'invoice.pdf',detail:'Oggetto inventato',state:''},{name:'Filesystem',detail:'Mai utilizzato',state:'safe'}]
    },
    {
      id: 'attack-pro-report', level: 'Pro', title: 'Chiudi l’operazione come un professionista',
      objective: 'Trasforma la catena simulata in un rapporto utile al blue team.',
      story: 'Hai analizzato configurazione Wi‑Fi, segmentazione e comportamento del locker innocuo. Un professionista non si limita a “entrare”: consegna evidenze ripetibili e correzioni verificabili.',
      lesson: 'Il valore di un test autorizzato è il miglioramento prodotto. Ogni rilievo deve avere evidenza, impatto, rilevamento, mitigazione e prova di risoluzione.',
      code: `const finding = {\n  entryPoint: "configurazione wireless debole",\n  evidence: "punteggio del simulatore",\n  impact: "accesso improprio tra zone",\n  detection: "alert su percorso guest → admin",\n  mitigation: "WPS off, credenziali nuove, segmentazione"\n};\n\n// Il test termina con una verifica della correzione\nconst retestRequired = true;`,
      question: 'Scrivi le quattro parti minime del rapporto finale.',
      type: 'text', keywords: ['evidenza','impatto','rilevamento','mitigazione'], sample: 'Evidenza osservata, impatto possibile, metodo di rilevamento e mitigazione con successivo retest.',
      hint: 'Spiega cosa hai visto, cosa può succedere, come accorgersene e come correggerlo.',
      explanation: 'Un rapporto professionale è ripetibile, proporzionato e orientato alla riduzione del rischio. Non contiene segreti né istruzioni contro bersagli reali.',
      nodes: [{name:'Red team',detail:'Evidenze',state:'active'},{name:'Blue team',detail:'Rilevamenti',state:'active'},{name:'Owner',detail:'Mitigazioni',state:'active'},{name:'Retest',detail:'Conferma finale',state:'safe'}]
    }
  ],
  defense: [
    {
      id: 'defense-wifi-hardening', level: 'Base', title: 'Metti in sicurezza il Wi‑Fi',
      objective: 'Applica una configurazione iniziale robusta alla rete del laboratorio.',
      story: 'Ricevi un router simulato ancora con impostazioni di fabbrica. Devi scegliere una baseline semplice ma efficace.',
      lesson: 'La base è: firmware aggiornato, credenziali amministrative uniche, WPA3 quando supportato, WPS spento e rete ospiti isolata.',
      code: `const secureBaseline = {\n  firmwareUpdated: true,\n  adminPasswordUnique: true,\n  security: "WPA3",\n  wpsEnabled: false,\n  guestIsolation: true\n};`,
      question: 'Quale configurazione rappresenta la baseline migliore?',
      type: 'choice', options: ['WPA3, WPS spento, password amministrativa unica e ospiti isolati', 'WEP e password di fabbrica', 'Rete aperta ma nome nascosto', 'WPS attivo per comodità'], correct: 0,
      hint: 'Scegli controlli che proteggono autenticazione, amministrazione e separazione delle zone.',
      explanation: 'La baseline riduce i rischi più comuni prima ancora del monitoraggio.',
      nodes: [{name:'Router lab',detail:'Baseline da applicare',state:'active'},{name:'WPA3',detail:'Abilitato',state:'safe'},{name:'WPS',detail:'Disattivato',state:'safe'},{name:'Guest',detail:'Isolata',state:'safe'}]
    },
    {
      id: 'defense-wifi-detection', level: 'Junior', title: 'Rileva un accesso anomalo',
      objective: 'Leggi eventi sintetici e assegna la priorità corretta.',
      story: 'Il sistema di laboratorio genera log inventati. Devi individuare la sequenza che suggerisce un tentativo di accesso seguito da una nuova associazione.',
      lesson: 'Un singolo evento può essere normale. La correlazione temporale tra molti errori, successo improvviso, nuovo dispositivo e accesso a zone sensibili aumenta la priorità.',
      code: `const events = [\n  "10:01 guest auth_failed device=A7",\n  "10:01 guest auth_failed device=A7",\n  "10:02 guest auth_success device=A7",\n  "10:03 route_attempt guest_to_admin device=A7"\n];\n\nconst suspicious = events.filter(e =>\n  e.includes("auth_failed") || e.includes("guest_to_admin")\n);`,
      question: 'Qual è la risposta iniziale più corretta?',
      type: 'choice', options: ['Isolare il dispositivo nel laboratorio e conservare gli eventi', 'Cancellare subito tutti i log', 'Ignorare perché il login è riuscito', 'Spegnere l’intera azienda'], correct: 0,
      hint: 'Contieni il soggetto specifico senza perdere le prove.',
      explanation: 'L’isolamento mirato limita il rischio e la conservazione dei log permette di capire la sequenza.',
      nodes: [{name:'A7',detail:'Nuovo dispositivo',state:'risk'},{name:'Guest',detail:'Autenticazione',state:'active'},{name:'Admin',detail:'Tentativo di rotta',state:'risk'},{name:'Log store',detail:'Evidenze integre',state:'safe'}]
    },
    {
      id: 'defense-segmentation', level: 'Intermedio', title: 'Blocca il movimento laterale',
      objective: 'Progetta regole minime tra rete ospiti, utenti, amministrazione e dati.',
      story: 'La simulazione mostra che un dispositivo ospite può vedere il pannello amministrativo. Devi correggere il modello di rete.',
      lesson: 'La segmentazione divide gli asset per funzione e rischio. Le regole devono negare per impostazione predefinita e consentire soltanto flussi giustificati.',
      code: `const rules = [\n  { from: "guest", to: "internet", allow: true },\n  { from: "guest", to: "admin", allow: false },\n  { from: "users", to: "data-api", allow: true },\n  { from: "users", to: "database", allow: false },\n  { from: "admin", to: "database", allow: true }\n];`,
      question: 'Scrivi il principio con cui devono essere create le regole.',
      type: 'text', keywords: ['nega','predefinita','solo','necessari'], sample: 'Nega per impostazione predefinita e consenti solo i flussi strettamente necessari.',
      hint: 'Parti dal divieto generale e apri esclusivamente ciò che serve.',
      explanation: 'Il modello deny-by-default riduce i percorsi disponibili dopo una compromissione.',
      nodes: [{name:'Guest',detail:'Solo Internet',state:'safe'},{name:'Users',detail:'Solo API',state:'active'},{name:'Admin',detail:'Accesso controllato',state:'safe'},{name:'Database',detail:'Zona protetta',state:'safe'}]
    },
    {
      id: 'defense-locker-response', level: 'Avanzato', title: 'Ferma il locker simulato',
      objective: 'Esegui contenimento, analisi e recupero nella sequenza corretta.',
      story: 'Nel sandbox aumentano rapidamente gli oggetti marcati locked. Una condivisione simulata mostra molte rinomine in pochi secondi.',
      lesson: 'La priorità è interrompere la propagazione senza distruggere le evidenze. Poi si identifica la causa, si corregge e si ripristina da copie verificate.',
      code: `const responsePlan = [\n  "isola host interessato",\n  "sospendi accesso alla condivisione",\n  "preserva log e timeline",\n  "identifica causa iniziale",\n  "applica correzione e hardening",\n  "ripristina da backup verificato",\n  "monitora il ritorno in servizio"\n];`,
      question: 'Quale sequenza è corretta?',
      type: 'choice', options: ['Isola, preserva evidenze, correggi la causa, ripristina e monitora', 'Cancella i log e riapri subito la condivisione', 'Ripristina senza capire la causa', 'Ignora finché tutti i file risultano locked'], correct: 0,
      hint: 'Contieni prima, comprendi e correggi prima di ripristinare.',
      explanation: 'Ripristinare senza rimuovere la causa può riattivare l’incidente. Le evidenze aiutano a evitare recidive.',
      nodes: [{name:'Endpoint',detail:'Isolato',state:'risk'},{name:'Condivisione',detail:'Accesso sospeso',state:'active'},{name:'Log',detail:'Preservati',state:'safe'},{name:'Backup',detail:'Verificato',state:'safe'}]
    },
    {
      id: 'defense-pro-detection', level: 'Pro', title: 'Costruisci il rilevamento da pro',
      objective: 'Definisci una regola comportamentale e la relativa risposta automatizzata.',
      story: 'Il blue team vuole rilevare il comportamento del locker innocuo senza basarsi su un singolo nome di file o processo.',
      lesson: 'I rilevamenti robusti combinano comportamento, volume, tempo, contesto dell’utente e destinazione. Devono essere testati contro falsi positivi.',
      code: `function evaluateActivity(event) {\n  const rapidChanges = event.fileChanges > 80;\n  const unusualExtensions = event.newExtensions > 5;\n  const sharedPath = event.pathType === "shared";\n\n  return rapidChanges && unusualExtensions && sharedPath;\n}\n\n// Alla conferma: isola il dispositivo e avvisa il team`,
      question: 'Scrivi una regola completa includendo segnale, contesto e risposta.',
      type: 'text', keywords: ['modifiche','estensioni','condivisione','isola'], sample: 'Genera un alert quando molte modifiche rapide introducono estensioni insolite su una condivisione; isola il dispositivo e avvisa il team.',
      hint: 'Unisci volume, tipo di cambiamento, luogo in cui avviene e azione di contenimento.',
      explanation: 'La correlazione comportamentale è più resistente ai cambi di nome. La regola va poi provata in laboratorio e regolata per ridurre falsi positivi.',
      nodes: [{name:'Telemetry',detail:'Eventi correlati',state:'active'},{name:'Detection',detail:'Comportamento',state:'safe'},{name:'Automation',detail:'Isolamento',state:'safe'},{name:'SOC',detail:'Revisione umana',state:'active'}]
    }
  ]
};

const AD_KEY = 'cyberforge-attack-defense-v1';
let adProgress = loadAdProgress();
let adSession = null;
let adSelected = null;
let adAnswered = false;
let adWasCorrect = false;

function loadAdProgress() {
  const fallback = { completed: {}, xp: 0, lastMode: 'attack' };
  try { return { ...fallback, ...JSON.parse(localStorage.getItem(AD_KEY) || '{}') }; }
  catch { return fallback; }
}

function saveAdProgress() {
  localStorage.setItem(AD_KEY, JSON.stringify(adProgress));
}

function adCompletedCount(mode) {
  return AD_SCENARIOS[mode].filter(s => adProgress.completed[s.id]).length;
}

function refreshAttackDefenseCard() {
  const attackDone = adCompletedCount('attack');
  const defenseDone = adCompletedCount('defense');
  const attackText = document.getElementById('attackPathProgress');
  const defenseText = document.getElementById('defensePathProgress');
  const totalText = document.getElementById('attackDefenseProgress');
  if (attackText) attackText.textContent = `${attackDone}/${AD_SCENARIOS.attack.length}`;
  if (defenseText) defenseText.textContent = `${defenseDone}/${AD_SCENARIOS.defense.length}`;
  if (totalText) totalText.textContent = `${attackDone + defenseDone}/${AD_SCENARIOS.attack.length + AD_SCENARIOS.defense.length}`;
}

function openAttackDefenseHub() {
  show('dashboardView');
  dashboard();
  refreshAttackDefenseCard();
  setTimeout(() => document.getElementById('attackDefenseCard')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
}

function startAdPath(mode) {
  const list = AD_SCENARIOS[mode];
  let index = list.findIndex(s => !adProgress.completed[s.id]);
  if (index < 0) index = list.length - 1;
  adProgress.lastMode = mode;
  saveAdProgress();
  adSession = { mode, index, gainedXp: 0 };
  show('battleView');
  document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('navBattle')?.classList.add('active');
  renderAdScenario();
}

function renderAdScenario() {
  adSelected = null;
  adAnswered = false;
  adWasCorrect = false;
  const scenario = AD_SCENARIOS[adSession.mode][adSession.index];
  const list = AD_SCENARIOS[adSession.mode];
  const modeLabel = adSession.mode === 'attack' ? 'Attacco simulato' : 'Difesa';

  document.getElementById('battleMode').textContent = modeLabel;
  document.getElementById('battleLevel').textContent = `${scenario.level} · ${adSession.index + 1}/${list.length}`;
  document.getElementById('battleProgress').style.width = `${(adSession.index / list.length) * 100}%`;
  document.getElementById('battleTitle').textContent = scenario.title;
  document.getElementById('battleObjective').textContent = scenario.objective;
  document.getElementById('battleStory').textContent = scenario.story;
  document.getElementById('battleLesson').innerHTML = `<strong>Cosa impari</strong><br>${scenario.lesson}`;
  document.getElementById('battleCode').textContent = scenario.code;
  document.getElementById('battleQuestion').textContent = scenario.question;
  document.getElementById('battleFeedback').className = 'battle-feedback hidden';
  document.getElementById('battleVerify').classList.remove('hidden');
  document.getElementById('battleNext').classList.add('hidden');
  document.getElementById('battleHint').disabled = false;

  document.getElementById('labMap').innerHTML = scenario.nodes.map(node => `
    <div class="lab-node ${node.state || ''}">
      <strong>${node.name}</strong>
      <small>${node.detail}</small>
    </div>`).join('');

  const answerArea = document.getElementById('battleAnswerArea');
  if (scenario.type === 'choice') {
    answerArea.innerHTML = `<div class="battle-options">${scenario.options.map((option, index) =>
      `<button class="battle-option" data-index="${index}">${option}</button>`).join('')}</div>`;
    answerArea.querySelectorAll('.battle-option').forEach(button => {
      button.onclick = () => {
        if (adAnswered) return;
        adSelected = Number(button.dataset.index);
        answerArea.querySelectorAll('.battle-option').forEach(item => item.classList.remove('selected'));
        button.classList.add('selected');
      };
    });
  } else {
    answerArea.innerHTML = '<textarea id="battleTextAnswer" class="battle-text" placeholder="Scrivi la risposta con parole tue..."></textarea>';
  }
}

function normalizeAd(value) {
  return (value || '').toLowerCase().replace(/[’']/g, '').replace(/\s+/g, ' ').trim();
}

function verifyAdScenario() {
  if (adAnswered) return;
  const scenario = AD_SCENARIOS[adSession.mode][adSession.index];
  let correct = false;

  if (scenario.type === 'choice') {
    if (adSelected === null) return alert('Seleziona una risposta.');
    correct = adSelected === scenario.correct;
  } else {
    const value = document.getElementById('battleTextAnswer')?.value || '';
    if (!value.trim()) return alert('Scrivi una risposta.');
    const normalized = normalizeAd(value);
    correct = scenario.keywords.every(keyword => normalized.includes(normalizeAd(keyword)));
  }

  adAnswered = true;
  adWasCorrect = correct;
  const gain = correct ? 45 + adSession.index * 20 : 8;
  adProgress.xp += gain;
  adSession.gainedXp += gain;

  if (correct) {
    adProgress.completed[scenario.id] = true;
    if (typeof P !== 'undefined') {
      P.xp += gain;
      if (typeof save === 'function') save();
    }
  }
  saveAdProgress();

  const feedback = document.getElementById('battleFeedback');
  feedback.className = `battle-feedback ${correct ? 'ok' : 'bad'}`;
  feedback.innerHTML = `
    <strong>${correct ? '✅ Fase completata' : '❌ Riprova il ragionamento'}</strong>
    <p>${scenario.explanation}</p>
    ${!correct && scenario.sample ? `<code>${scenario.sample}</code>` : ''}`;

  document.getElementById('battleVerify').classList.add('hidden');
  document.getElementById('battleNext').classList.remove('hidden');
  document.getElementById('battleNext').textContent = correct ? 'Prossimo scenario' : 'Riprova scenario';
  refreshAttackDefenseCard();
}

function nextAdScenario() {
  if (!adWasCorrect) {
    renderAdScenario();
    return;
  }

  const list = AD_SCENARIOS[adSession.mode];
  if (adSession.index < list.length - 1) {
    adSession.index += 1;
    renderAdScenario();
    return;
  }

  document.getElementById('battleProgress').style.width = '100%';
  document.getElementById('resultTitle').textContent = adSession.mode === 'attack'
    ? 'Percorso offensivo simulato completato'
    : 'Percorso difensivo completato';
  document.getElementById('resultScore').textContent = `${adSession.gainedXp} XP`;
  document.getElementById('resultText').textContent = 'Hai completato tutti gli scenari disponibili. I prossimi aggiornamenti aggiungeranno nuove operazioni e livelli.';
  show('resultView');
}

function showAdHint() {
  const scenario = AD_SCENARIOS[adSession.mode][adSession.index];
  const feedback = document.getElementById('battleFeedback');
  feedback.className = 'battle-feedback hint';
  feedback.innerHTML = `<strong>💡 Suggerimento guidato</strong><p>${scenario.hint}</p>`;
  document.getElementById('battleHint').disabled = true;
}

document.getElementById('startAttackPath').onclick = () => startAdPath('attack');
document.getElementById('startDefensePath').onclick = () => startAdPath('defense');
document.getElementById('navBattle').onclick = openAttackDefenseHub;
document.getElementById('exitBattle').onclick = openAttackDefenseHub;
document.getElementById('battleVerify').onclick = verifyAdScenario;
document.getElementById('battleNext').onclick = nextAdScenario;
document.getElementById('battleHint').onclick = showAdHint;

refreshAttackDefenseCard();