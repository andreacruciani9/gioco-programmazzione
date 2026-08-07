const WEEKLY_ATTACK_SCENARIOS = [
  {
    id:'atk-secure-code-review',domain:'SECURE CODING',level:'Intermedio',title:'Trova la query vulnerabile',
    objective:'Analizza codice locale e individua la concatenazione di input non fidato in una query SQL.',
    story:'Nel repository demo compare una query costruita con input utente. Devi farla controllare dal simulatore senza eseguire payload.',
    lesson:'La revisione offensiva sicura cerca pattern pericolosi nel codice posseduto. Non serve attaccare un database: basta dimostrare che dati e struttura SQL vengono mescolati.',
    prompt:'cyberlab$',task:'Scrivi il comando che analizza src/OrdersRepository.cs cercando sql-concatenation.',format:'Un comando cyberlab code review.',
    answer:'cyberlab code review --file src/OrdersRepository.cs --rule sql-concatenation --mode static',
    tokens:['cyberlab','code','review','--file','src/ordersrepository.cs','--rule','sql-concatenation','--mode','static'],
    hints:['Inizia con cyberlab code review.','Indica file, regola sql-concatenation e modalità static.','Codice completo: cyberlab code review --file src/OrdersRepository.cs --rule sql-concatenation --mode static'],
    output:'[STATIC] file caricato\n[HIGH] riga 42: input concatenato nella query\n[IMPACT] struttura SQL modificabile\nFLAG{STATIC_SQL_RISK_FOUND}',
    explanation:[['code review','avvia una revisione statica nel simulatore','trova difetti senza eseguire il programma'],['--file src/OrdersRepository.cs','seleziona il file locale inventato','limita l’analisi al codice autorizzato'],['--rule sql-concatenation','cerca input concatenato nel testo SQL','evidenzia il rischio alla radice'],['--mode static','impedisce qualunque esecuzione','mantiene il test sicuro e ripetibile']],
    defense:'Usa query parametrizzate, validazione coerente, test automatici e code review prima del rilascio.',
    nodes:[{name:'Repository',detail:'Codice locale',state:'active'},{name:'Query SQL',detail:'Da verificare',state:'risk'},{name:'Database',detail:'Non contattato',state:'safe'},{name:'Regola SAST',detail:'Pronta',state:''}],
    afterNodes:[{name:'Repository',detail:'Revisionato',state:'owned'},{name:'Query SQL',detail:'Concatenazione trovata',state:'risk'},{name:'Database',detail:'Mai contattato',state:'safe'},{name:'Regola SAST',detail:'Match confermato',state:'active'}]
  },
  {
    id:'atk-secret-exposure',domain:'SEGRETI E CONFIGURAZIONE',level:'Avanzato',title:'Individua un segreto nel repository demo',
    objective:'Controlla un file .env sintetico e rileva valori che non devono essere versionati.',
    story:'Una build locale contiene un file .env.demo. Devi dimostrare l’esposizione senza usare né stampare il valore completo.',
    lesson:'Un test professionale segnala il tipo di segreto, il percorso e l’impatto, ma evita di diffondere credenziali anche quando sono di laboratorio.',
    prompt:'cyberlab$',task:'Scrivi il comando che analizza .env.demo, maschera i valori e cerca api-key e password.',format:'Un comando cyberlab secrets scan.',
    answer:'cyberlab secrets scan --file .env.demo --types api-key,password --redact on',
    tokens:['cyberlab','secrets','scan','--file','.env.demo','--types','api-key','password','--redact','on'],
    hints:['Usa cyberlab secrets scan.','Seleziona .env.demo, i tipi api-key,password e abilita redact.','Codice completo: cyberlab secrets scan --file .env.demo --types api-key,password --redact on'],
    output:'[SCAN] 6 variabili analizzate\n[HIGH] API_KEY=sk_****91\n[HIGH] DB_PASSWORD=****\n[SAFE] valori completi non mostrati\nFLAG{SECRET_EXPOSURE_REDACTED}',
    explanation:[['secrets scan','analizza testo locale alla ricerca di pattern sensibili','previene la pubblicazione accidentale'],['--types api-key,password','limita le categorie cercate','riduce rumore e falsi positivi'],['--redact on','oscura i valori rilevati','protegge il segreto durante report e formazione']],
    defense:'Rimuovi i segreti dal repository, ruotali, usa secret manager e aggiungi scansioni pre-commit e CI.',
    nodes:[{name:'.env.demo',detail:'Da analizzare',state:'active'},{name:'API key',detail:'Possibile esposizione',state:'risk'},{name:'Password',detail:'Possibile esposizione',state:'risk'},{name:'Output',detail:'Redazione richiesta',state:''}],
    afterNodes:[{name:'.env.demo',detail:'Analizzato',state:'owned'},{name:'API key',detail:'Mascherata',state:'risk'},{name:'Password',detail:'Mascherata',state:'risk'},{name:'Output',detail:'Nessun valore completo',state:'safe'}]
  }
];

const WEEKLY_DEFENSE_SCENARIOS = [
  {
    id:'def-parameterized-query',domain:'SECURE CODING',level:'Intermedio',title:'Correggi la query con parametri',
    objective:'Sostituisci la concatenazione con una query parametrizzata e aggiungi un test di regressione.',
    story:'La revisione statica ha trovato input dentro il testo SQL. Devi applicare la correzione nel laboratorio.',
    lesson:'I parametri separano il comando dai valori. Il database interpreta il valore come dato e non come parte della sintassi.',
    prompt:'defend$',task:'Scrivi il comando che applica la fix parameterized-query e richiede il test OtherUsersInput_IsData.',format:'Un comando defend code fix.',
    answer:'defend code fix --file src/OrdersRepository.cs --pattern parameterized-query --test OtherUsersInput_IsData',
    tokens:['defend','code','fix','--file','src/ordersrepository.cs','--pattern','parameterized-query','--test','otherusersinput_isdata'],
    hints:['Inizia con defend code fix.','Usa pattern parameterized-query e indica il test.','Codice completo: defend code fix --file src/OrdersRepository.cs --pattern parameterized-query --test OtherUsersInput_IsData'],
    output:'[PATCH] concatenazione rimossa\n[PARAMETER] @customerId aggiunto\n[TEST] OtherUsersInput_IsData = PASS\nFLAG{QUERY_PARAMETERIZED}',
    explanation:[['code fix','applica una modifica nel repository simulato','trasforma il rilievo in correzione'],['--pattern parameterized-query','seleziona la soluzione sicura','separa struttura SQL e valori'],['--test OtherUsersInput_IsData','esegue il test di regressione','impedisce che il difetto ritorni']],
    attackView:'L’input non può più cambiare la struttura della query e il test automatico verifica la protezione.',
    nodes:[{name:'Repository',detail:'Fix da applicare',state:'active'},{name:'Query SQL',detail:'Concatenata',state:'risk'},{name:'Parametro',detail:'Assente',state:''},{name:'Test',detail:'Assente',state:''}],
    afterNodes:[{name:'Repository',detail:'Patch applicata',state:'safe'},{name:'Query SQL',detail:'Parametrizzata',state:'safe'},{name:'Parametro',detail:'@customerId',state:'safe'},{name:'Test',detail:'PASS',state:'active'}]
  },
  {
    id:'def-evidence-chain',domain:'INTEGRITÀ DELLE EVIDENZE',level:'Esperto',title:'Costruisci la catena di custodia',
    objective:'Registra hash, orario UTC, operatore e copia read-only per un file di evidenza sintetico.',
    story:'Devi consegnare events.json a un altro analista senza perdere provenienza e integrità.',
    lesson:'La catena di custodia documenta chi ha raccolto, trasferito e verificato una prova. Non basta calcolare un hash una sola volta.',
    prompt:'defend$',task:'Scrivi il comando che registra events.json con SHA-256, UTC, trainee-01 e storage read-only.',format:'Un comando defend evidence register.',
    answer:'defend evidence register --file events.json --hash sha256 --time utc --operator trainee-01 --storage read-only',
    tokens:['defend','evidence','register','--file','events.json','--hash','sha256','--time','utc','--operator','trainee-01','--storage','read-only'],
    hints:['Usa defend evidence register.','Specifica hash, UTC, operatore e storage read-only.','Codice completo: defend evidence register --file events.json --hash sha256 --time utc --operator trainee-01 --storage read-only'],
    output:'[HASH] SHA256 registrato\n[TIME] 2026-08-07T06:58:00Z\n[OPERATOR] trainee-01\n[STORAGE] read-only\nFLAG{CHAIN_OF_CUSTODY_CREATED}',
    explanation:[['evidence register','crea la scheda della prova nel simulatore','documenta provenienza e passaggi'],['--hash sha256','registra un’impronta del contenuto','permette di rilevare modifiche'],['--time utc','usa un riferimento temporale uniforme','facilita correlazione tra sistemi'],['--operator trainee-01','associa la raccolta a un’identità di laboratorio','mantiene accountability senza dati personali'],['--storage read-only','protegge la copia acquisita da modifiche','preserva l’originale']],
    attackView:'Tentativi successivi di alterare o sostituire la prova generano mismatch e restano documentati.',
    nodes:[{name:'events.json',detail:'Da acquisire',state:'active'},{name:'Hash',detail:'Assente',state:'risk'},{name:'Timestamp',detail:'Locale',state:'risk'},{name:'Storage',detail:'Scrivibile',state:'risk'}],
    afterNodes:[{name:'events.json',detail:'Acquisito',state:'safe'},{name:'Hash',detail:'SHA-256',state:'safe'},{name:'Timestamp',detail:'UTC',state:'safe'},{name:'Storage',detail:'Read-only',state:'safe'}]
  }
];

CYBERFORGE_ATTACK.splice(CYBERFORGE_ATTACK.length - 1,0,...WEEKLY_ATTACK_SCENARIOS);
CYBERFORGE_DEFENSE.splice(CYBERFORGE_DEFENSE.length - 1,0,...WEEKLY_DEFENSE_SCENARIOS);