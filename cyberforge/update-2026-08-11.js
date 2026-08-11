const AUG11_ATTACK = [
  {
    id:'atk-dns-offline-audit',domain:'RETI E DNS',level:'Junior',title:'Revisiona una zona DNS locale',
    objective:'Analizza zone-lab.json e individua nomi che rivelano troppo sull’architettura.',
    story:'Il laboratorio contiene una zona DNS sintetica. Devi lavorare solo sul file locale, senza interrogare reti esterne.',
    lesson:'Nomi come admin, vpn, db e staging possono rivelare ruoli e priorità degli asset. Una revisione offline è sufficiente per valutarne l’esposizione informativa.',
    prompt:'cyberlab$',task:'Scrivi il comando che controlla zone-lab.json cercando admin,vpn,db,staging in modalità offline.',format:'Un comando cyberlab dns review.',
    answer:'cyberlab dns review --file zone-lab.json --names admin,vpn,db,staging --offline',
    tokens:['cyberlab','dns','review','--file','zone-lab.json','--names','admin','vpn','db','staging','--offline'],
    hints:['Inizia con cyberlab dns review.','Aggiungi --file zone-lab.json e --names admin,vpn,db,staging.','Codice completo: cyberlab dns review --file zone-lab.json --names admin,vpn,db,staging --offline'],
    output:'[OFFLINE] 18 record caricati\n[WARN] vpn.lab.local nome informativo\n[WARN] db-admin.lab.local nome sensibile\nFLAG{DNS_METADATA_REVIEWED}',
    explanation:[['dns review','avvia la revisione della zona locale','serve a valutare quante informazioni espone la nomenclatura'],['--file zone-lab.json','usa un file sintetico','mantiene l’attività nel laboratorio'],['--names admin,vpn,db,staging','definisce termini informativi','aiuta a classificare i record'],['--offline','impedisce interrogazioni esterne','garantisce che nessun sistema reale venga contattato']],
    defense:'Separa DNS interno ed esterno e pubblica solo record necessari con nomenclature proporzionate.',
    nodes:[{name:'zone-lab.json',detail:'Zona sintetica',state:'active'},{name:'vpn',detail:'Da valutare',state:''},{name:'db-admin',detail:'Da valutare',state:'risk'},{name:'Rete esterna',detail:'Non usata',state:'safe'}],
    afterNodes:[{name:'zone-lab.json',detail:'Revisionata',state:'owned'},{name:'vpn',detail:'Informativo',state:'risk'},{name:'db-admin',detail:'Sensibile',state:'risk'},{name:'Rete esterna',detail:'Mai contattata',state:'safe'}]
  },
  {
    id:'atk-session-header-audit',domain:'WEB E SESSIONI',level:'Intermedio',title:'Controlla i cookie di sessione',
    objective:'Analizza response-demo.txt e verifica la presenza dei flag Secure, HttpOnly e SameSite.',
    story:'Hai una risposta HTTP sintetica registrata da localhost. Devi fare un controllo statico delle intestazioni.',
    lesson:'I flag dei cookie riducono il rischio di esposizione della sessione. L’audit può essere svolto completamente offline.',
    prompt:'cyberlab$',task:'Scrivi il comando che controlla response-demo.txt per secure,httponly,samesite.',format:'Un comando cyberlab web cookies.',
    answer:'cyberlab web cookies --file response-demo.txt --require secure,httponly,samesite',
    tokens:['cyberlab','web','cookies','--file','response-demo.txt','--require','secure','httponly','samesite'],
    hints:['Usa cyberlab web cookies.','Indica response-demo.txt e i tre flag richiesti.','Codice completo: cyberlab web cookies --file response-demo.txt --require secure,httponly,samesite'],
    output:'[COOKIE] sessionid Secure=NO HttpOnly=YES SameSite=NONE\n[HIGH] baseline incompleta\nFLAG{SESSION_COOKIE_GAP}',
    explanation:[['web cookies','analizza cookie presenti in un file locale','consente revisione senza traffico'],['--file response-demo.txt','seleziona la risposta sintetica','limita l’analisi ai dati del laboratorio'],['--require secure,httponly,samesite','definisce la baseline attesa','rende i controlli verificabili']],
    defense:'Imposta Secure, HttpOnly e SameSite appropriato, usa HTTPS e ruota la sessione dopo cambi di privilegio.',
    nodes:[{name:'response-demo.txt',detail:'Header locali',state:'active'},{name:'Secure',detail:'Assente',state:'risk'},{name:'HttpOnly',detail:'Presente',state:'safe'},{name:'SameSite',detail:'Debole',state:'risk'}],
    afterNodes:[{name:'response-demo.txt',detail:'Audit completato',state:'owned'},{name:'Secure',detail:'Gap trovato',state:'risk'},{name:'HttpOnly',detail:'OK',state:'safe'},{name:'SameSite',detail:'Da correggere',state:'risk'}]
  }
];

const AUG11_DEFENSE = [
  {
    id:'def-api-rate-limit',domain:'API E DISPONIBILITÀ',level:'Intermedio',title:'Applica rate limiting',
    objective:'Proteggi una API locale da raffiche di richieste usando una soglia per client.',
    story:'Il simulatore genera 120 richieste al minuto da un client demo. Devi definire una policy che limiti il consumo.',
    lesson:'Il rate limiting protegge disponibilità e costi. Una risposta 429 rende il comportamento coerente e osservabile.',
    prompt:'defend$',task:'Scrivi la policy per 60 richieste al minuto per client, risposta 429 e logging attivo.',format:'Un comando defend api ratelimit.',
    answer:'defend api ratelimit --scope client --limit 60 --window 1m --status 429 --log on',
    tokens:['defend','api','ratelimit','--scope','client','--limit','60','--window','1m','--status','429','--log','on'],
    hints:['Usa defend api ratelimit.','Imposta scope client, limite 60 e finestra 1m.','Codice completo: defend api ratelimit --scope client --limit 60 --window 1m --status 429 --log on'],
    output:'[POLICY] client=60/1m\n[TEST] richiesta 61 -> 429\n[LOG] evento registrato\nFLAG{API_RATE_LIMITED}',
    explanation:[['api ratelimit','crea una policy nel gateway simulato','limita abusi senza modificare l’app'],['--scope client','separa i contatori per client','evita quote condivise improprie'],['--limit 60 --window 1m','definisce quantità e intervallo','rende la soglia misurabile'],['--status 429','usa una risposta HTTP standard','comunica correttamente il limite'],['--log on','registra il superamento','fornisce telemetria difensiva']],
    attackView:'Le raffiche oltre soglia vengono limitate e diventano visibili nei log.',
    nodes:[{name:'API',detail:'120 req/min',state:'risk'},{name:'Gateway',detail:'Nessun limite',state:'risk'},{name:'Client demo',detail:'Raffica',state:'active'},{name:'Log',detail:'Parziale',state:''}],
    afterNodes:[{name:'API',detail:'Protetta',state:'safe'},{name:'Gateway',detail:'60/1m',state:'safe'},{name:'Client demo',detail:'429 oltre soglia',state:'safe'},{name:'Log',detail:'Evento registrato',state:'active'}]
  },
  {
    id:'def-log-privacy-minimize',domain:'PRIVACY E LOG',level:'Avanzato',title:'Minimizza i dati nei log',
    objective:'Rimuovi email e token da log sintetici e pseudonimizza user_id.',
    story:'events-raw.json contiene dati non necessari al SOC. Devi produrre una copia minimizzata senza perdere la correlazione.',
    lesson:'La minimizzazione conserva solo ciò che serve. Un identificatore pseudonimo stabile può permettere correlazione senza esporre direttamente l’identità.',
    prompt:'defend$',task:'Scrivi il comando che redige email e token, pseudonimizza user_id e salva events-safe.json.',format:'Un comando defend logs minimize.',
    answer:'defend logs minimize --input events-raw.json --redact email,token --pseudonymize user_id --output events-safe.json',
    tokens:['defend','logs','minimize','--input','events-raw.json','--redact','email','token','--pseudonymize','user_id','--output','events-safe.json'],
    hints:['Usa defend logs minimize.','Redigi email,token e pseudonimizza user_id.','Codice completo: defend logs minimize --input events-raw.json --redact email,token --pseudonymize user_id --output events-safe.json'],
    output:'[READ] 240 eventi\n[REDACT] email=240 token=17\n[PSEUDONYM] user_id trasformato\n[WRITE] events-safe.json\nFLAG{LOG_PRIVACY_MINIMIZED}',
    explanation:[['logs minimize','trasforma i log locali','riduce dati personali senza perdere utilità'],['--redact email,token','rimuove campi sensibili','previene esposizione accidentale'],['--pseudonymize user_id','usa un identificatore non diretto','mantiene la correlazione'],['--output events-safe.json','scrive una copia separata','preserva l’originale del laboratorio']],
    attackView:'Un accesso ai log minimizzati espone meno dati e nessun token.',
    nodes:[{name:'events-raw.json',detail:'Dati sensibili',state:'risk'},{name:'Email',detail:'Completa',state:'risk'},{name:'Token',detail:'Presente',state:'risk'},{name:'SOC',detail:'Serve correlazione',state:'active'}],
    afterNodes:[{name:'events-safe.json',detail:'Minimizzato',state:'safe'},{name:'Email',detail:'Redatta',state:'safe'},{name:'Token',detail:'Rimosso',state:'safe'},{name:'SOC',detail:'Pseudonimo stabile',state:'active'}]
  },
  {
    id:'def-log-chain-verify',domain:'ANTI-EVASIONE E INTEGRITÀ',level:'Esperto',title:'Rileva una manomissione dei log',
    objective:'Verifica una catena hash sintetica e genera un alert al primo mismatch.',
    story:'audit-chain.json contiene un record modificato. Devi rilevare il punto in cui la catena di integrità non è più valida.',
    lesson:'Una catena hash collega ogni record al precedente. Una modifica successiva rende il mismatch rilevabile senza insegnare a cancellare tracce.',
    prompt:'defend$',task:'Scrivi il comando che verifica audit-chain.json con sha256, alert e stop al primo errore.',format:'Un comando defend logs verify-chain.',
    answer:'defend logs verify-chain --file audit-chain.json --hash sha256 --on-mismatch alert --stop-first',
    tokens:['defend','logs','verify-chain','--file','audit-chain.json','--hash','sha256','--on-mismatch','alert','--stop-first'],
    hints:['Usa defend logs verify-chain.','Seleziona sha256 e alert sul mismatch.','Codice completo: defend logs verify-chain --file audit-chain.json --hash sha256 --on-mismatch alert --stop-first'],
    output:'[VERIFY] records 1..37 = OK\n[MISMATCH] record 38\n[ALERT] possibile manomissione\nFLAG{LOG_TAMPERING_DETECTED}',
    explanation:[['logs verify-chain','verifica la sequenza di integrità','rileva alterazioni'],['--hash sha256','usa l’algoritmo previsto','permette un confronto coerente'],['--on-mismatch alert','genera un evento difensivo','porta il problema al SOC'],['--stop-first','ferma la verifica sul primo errore','identifica il punto iniziale del problema']],
    attackView:'Alterazioni o rimozioni di eventi diventano rilevabili.',
    nodes:[{name:'audit-chain.json',detail:'Da verificare',state:'active'},{name:'Record 38',detail:'Modificato',state:'risk'},{name:'Hash chain',detail:'Da validare',state:''},{name:'SOC',detail:'In attesa',state:''}],
    afterNodes:[{name:'audit-chain.json',detail:'Verificato',state:'safe'},{name:'Record 38',detail:'Mismatch',state:'risk'},{name:'Hash chain',detail:'Interrotta al 38',state:'active'},{name:'SOC',detail:'Alert aperto',state:'active'}]
  }
];

CYBERFORGE_ATTACK.splice(CYBERFORGE_ATTACK.length - 1,0,...AUG11_ATTACK);
CYBERFORGE_DEFENSE.splice(CYBERFORGE_DEFENSE.length - 1,0,...AUG11_DEFENSE);