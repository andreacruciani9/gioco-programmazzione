const CYBERFORGE_ATTACK = [
    {
      id: 'atk-wifi-audit', domain: 'RETI WI-FI', level: 'Base', title: 'Individua il punto debole',
      objective: 'Interroga la rete inventata HOME-LAB e visualizza cifratura, WPS e isolamento.',
      story: 'La CyberRange contiene tre access point fittizi. Devi raccogliere informazioni prima di decidere quale configurazione approfondire.',
      lesson: 'La ricognizione serve a capire la superficie esposta. Qui non provi password: chiedi al simulatore di mostrarti solo configurazioni già presenti nei dati locali.',
      prompt: 'cyberlab$',
      task: 'Riscrivi il comando che ispeziona HOME-LAB mostrando security, wps e isolation.',
      format: 'Un solo comando cyberlab.',
      answer: 'cyberlab wifi inspect --range HOME-LAB --show security,wps,isolation',
      tokens: ['cyberlab','wifi','inspect','--range','home-lab','--show','security','wps','isolation'],
      hints: [
        'Il comando parte con cyberlab wifi inspect.',
        'Specifica il laboratorio con --range HOME-LAB e i campi con --show.',
        'Codice completo: cyberlab wifi inspect --range HOME-LAB --show security,wps,isolation'
      ],
      output: '[LAB] 3 access point caricati\n[!] LAB-GUEST: WPA2 · WPS ON · isolamento OFF\n[+] LAB-STAFF: WPA3 · WPS OFF · isolamento ON\n[+] LAB-IOT: WPA2 · WPS OFF · isolamento ON\nFLAG{CONFIGURATION_REVIEW}',
      explanation: [
        ['cyberlab','avvia il linguaggio inventato della CyberRange','garantisce che nulla venga eseguito sulla rete reale'],
        ['wifi inspect','chiede di leggere la configurazione wireless simulata','serve per iniziare dalla raccolta di informazioni'],
        ['--range HOME-LAB','limita l’operazione allo scenario locale HOME-LAB','definisce esplicitamente il perimetro autorizzato'],
        ['--show security,wps,isolation','seleziona i tre controlli da visualizzare','aiuta a confrontare cifratura, WPS e separazione degli ospiti']
      ],
      defense: 'La difesa consiste nell’usare WPA3 quando disponibile, disattivare WPS, cambiare le credenziali predefinite e isolare la rete ospiti.',
      nodes: [{name:'Console',detail:'In attesa',state:'active'},{name:'LAB-GUEST',detail:'Configurazione sconosciuta',state:''},{name:'LAB-STAFF',detail:'Configurazione sconosciuta',state:''},{name:'LAB-IOT',detail:'Configurazione sconosciuta',state:''}],
      afterNodes: [{name:'Console',detail:'Ricognizione completata',state:'owned'},{name:'LAB-GUEST',detail:'WPA2 · WPS ON',state:'risk'},{name:'LAB-STAFF',detail:'WPA3 · protetta',state:'safe'},{name:'LAB-IOT',detail:'Isolata',state:'safe'}]
    },
    {
      id: 'atk-web-map', domain: 'APPLICAZIONI WEB', level: 'Junior', title: 'Mappa l’applicazione',
      objective: 'Elenca le sole rotte inventate di shop.lab e individua quella amministrativa esposta.',
      story: 'Hai ottenuto accesso alla rete del laboratorio. Il passo successivo è capire quali componenti web esistono, senza inviare payload o modificare dati.',
      lesson: 'Mappare una web app significa identificare pagine, API e confini di fiducia. In questo esercizio il comando legge un elenco statico incluso nell’app.',
      prompt: 'cyberlab$', task: 'Scrivi il comando per mappare le rotte di shop.lab senza eseguire test attivi.',
      format: 'Un comando con --routes-only.',
      answer: 'cyberlab web map --target shop.lab --routes-only',
      tokens: ['cyberlab','web','map','--target','shop.lab','--routes-only'],
      hints: ['Usa cyberlab web map.','Il bersaglio fittizio si indica con --target shop.lab.','Codice completo: cyberlab web map --target shop.lab --routes-only'],
      output: '[200] /\n[200] /login\n[200] /api/products\n[403] /admin\n[!] /admin è raggiungibile ma protetta\nFLAG{WEB_SURFACE_MAPPED}',
      explanation: [
        ['web map','carica la mappa statica dell’applicazione simulata','permette di capire quali componenti devono essere protetti'],
        ['--target shop.lab','sceglie il servizio inventato shop.lab','evita qualunque ambiguità sul perimetro'],
        ['--routes-only','impedisce test attivi e mostra soltanto l’elenco delle rotte','mantiene l’esercizio nella fase di ricognizione']
      ],
      defense: 'La difesa riduce le rotte esposte, protegge /admin con autorizzazione forte, logging e MFA, e non considera il semplice 403 come unica barriera.',
      nodes: [{name:'HOME-LAB',detail:'Accesso simulato',state:'owned'},{name:'shop.lab',detail:'Superficie sconosciuta',state:'active'},{name:'/admin',detail:'Non classificata',state:''},{name:'API',detail:'Non classificata',state:''}],
      afterNodes: [{name:'HOME-LAB',detail:'Accesso simulato',state:'owned'},{name:'shop.lab',detail:'Rotte mappate',state:'owned'},{name:'/admin',detail:'Protetta · da verificare',state:'risk'},{name:'API',detail:'Inventario creato',state:'active'}]
    },
    {
      id: 'atk-api-authz', domain: 'API E AUTORIZZAZIONE', level: 'Intermedio', title: 'Verifica l’accesso alla risorsa',
      objective: 'Controlla che user-7 non possa leggere l’ordine 1042 appartenente a un altro utente.',
      story: 'La mappa mostra una API ordini. Devi verificare l’autorizzazione a livello di singola risorsa nella simulazione.',
      lesson: 'Essere autenticati non significa poter leggere ogni oggetto. Un test di autorizzazione confronta identità, proprietario e policy prevista.',
      prompt: 'cyberlab$', task: 'Scrivi il test che si aspetta un rifiuto per user-7 sulla risorsa /orders/1042.',
      format: 'Usa --as user-7 e --expect forbidden.',
      answer: 'cyberlab api test --resource /orders/1042 --as user-7 --expect forbidden',
      tokens: ['cyberlab','api','test','--resource','/orders/1042','--as','user-7','--expect','forbidden'],
      hints: ['Inizia con cyberlab api test.','Indica risorsa, identità simulata e risultato atteso.','Codice completo: cyberlab api test --resource /orders/1042 --as user-7 --expect forbidden'],
      output: '[TEST] user-7 -> /orders/1042\n[FAIL] API ha restituito 200 invece di 403\n[IMPACT] controllo proprietà mancante\nFLAG{OBJECT_AUTHORIZATION_GAP}',
      explanation: [
        ['api test','esegue un’asserzione sul modello locale della API','serve a verificare una regola di sicurezza'],
        ['--resource /orders/1042','sceglie l’ordine inventato da controllare','porta il test sul singolo oggetto'],
        ['--as user-7','simula una richiesta con identità a privilegi bassi','verifica cosa può fare un utente normale'],
        ['--expect forbidden','dichiara che il risultato corretto deve essere un rifiuto','trasforma il test in una verifica automatica']
      ],
      defense: 'La API deve verificare sul server che l’utente sia proprietario della risorsa oppure abbia un ruolo esplicitamente autorizzato.',
      nodes: [{name:'user-7',detail:'Utente standard',state:'active'},{name:'API ordini',detail:'Test in corso',state:'risk'},{name:'Ordine 1042',detail:'Altro proprietario',state:''},{name:'Policy',detail:'Da verificare',state:''}],
      afterNodes: [{name:'user-7',detail:'Accesso improprio dimostrato',state:'owned'},{name:'API ordini',detail:'Autorizzazione debole',state:'risk'},{name:'Ordine 1042',detail:'Esposto nel simulatore',state:'risk'},{name:'Policy',detail:'Controllo mancante',state:'risk'}]
    },
    {
      id: 'atk-identity-path', domain: 'IDENTITÀ E PRIVILEGI', level: 'Avanzato', title: 'Trova il percorso verso privilegi maggiori',
      objective: 'Analizza ruoli e relazioni dell’utente analyst nella directory inventata.',
      story: 'La API usa una directory di laboratorio. Devi capire se gruppi annidati o deleghe errate creano un percorso verso il ruolo admin.',
      lesson: 'L’analisi dei privilegi cerca relazioni eccessive. Il simulatore non usa account reali: elabora un grafo statico incluso nell’app.',
      prompt: 'cyberlab$', task: 'Scrivi il comando che traccia ruoli e percorsi dell’identità analyst.',
      format: 'Richiedi roles e paths.',
      answer: 'cyberlab identity trace --user analyst --show roles,paths',
      tokens: ['cyberlab','identity','trace','--user','analyst','--show','roles','paths'],
      hints: ['Usa identity trace.','Seleziona analyst e mostra roles,paths.','Codice completo: cyberlab identity trace --user analyst --show roles,paths'],
      output: 'analyst -> report-editors -> legacy-operators -> admin-console\n[!] delega legacy non necessaria\nFLAG{PRIVILEGE_PATH_FOUND}',
      explanation: [
        ['identity trace','analizza il grafo locale di identità e gruppi','aiuta a scoprire privilegi indiretti'],
        ['--user analyst','seleziona l’identità inventata analyst','definisce il punto iniziale del percorso'],
        ['--show roles,paths','mostra ruoli diretti e collegamenti indiretti','rende visibile la causa dell’escalation simulata']
      ],
      defense: 'Applica minimo privilegio, rimuovi gruppi legacy, revisiona periodicamente le deleghe e richiedi MFA per le azioni amministrative.',
      nodes: [{name:'analyst',detail:'Ruolo base',state:'active'},{name:'report-editors',detail:'Gruppo',state:''},{name:'legacy-operators',detail:'Delega ignota',state:'risk'},{name:'admin-console',detail:'Privilegio elevato',state:''}],
      afterNodes: [{name:'analyst',detail:'Percorso identificato',state:'owned'},{name:'report-editors',detail:'Passaggio 1',state:'active'},{name:'legacy-operators',detail:'Passaggio debole',state:'risk'},{name:'admin-console',detail:'Impatto potenziale',state:'risk'}]
    },
    {
      id: 'atk-cloud-policy', domain: 'CLOUD', level: 'Esperto', title: 'Valuta una policy cloud',
      objective: 'Verifica se il principal guest può leggere il bucket inventato reports-lab.',
      story: 'Il percorso identità conduce a un account cloud di laboratorio. Devi valutare una policy statica, senza collegarti a provider reali.',
      lesson: 'Una policy cloud deve essere valutata considerando principal, azione, risorsa e condizioni. Permessi pubblici o wildcard ampliano l’impatto.',
      prompt: 'cyberlab$', task: 'Scrivi il comando che valuta read di guest sul bucket reports-lab.',
      format: 'Specifica bucket, principal e action.',
      answer: 'cyberlab cloud evaluate --bucket reports-lab --principal guest --action read',
      tokens: ['cyberlab','cloud','evaluate','--bucket','reports-lab','--principal','guest','--action','read'],
      hints: ['Usa cloud evaluate.','Aggiungi --bucket reports-lab, --principal guest e --action read.','Codice completo: cyberlab cloud evaluate --bucket reports-lab --principal guest --action read'],
      output: '[POLICY] Allow principal=* action=read resource=reports-lab/*\n[RESULT] guest può leggere 24 documenti inventati\nFLAG{PUBLIC_CLOUD_POLICY}',
      explanation: [
        ['cloud evaluate','esegue il motore locale di valutazione policy','serve a capire il risultato effettivo dei permessi'],
        ['--bucket reports-lab','indica la risorsa inventata','limita la valutazione a un singolo contenitore'],
        ['--principal guest','simula un soggetto non autenticato','verifica l’esposizione pubblica'],
        ['--action read','controlla il permesso di lettura','misura la confidenzialità dei dati']
      ],
      defense: 'Imposta accesso pubblico disabilitato, policy deny-by-default, cifratura, logging e revisioni automatiche delle configurazioni.',
      nodes: [{name:'guest',detail:'Principal pubblico',state:'active'},{name:'Policy engine',detail:'Valutazione',state:'active'},{name:'reports-lab',detail:'Bucket simulato',state:'risk'},{name:'Audit log',detail:'Non attivo',state:''}],
      afterNodes: [{name:'guest',detail:'Lettura concessa',state:'owned'},{name:'Policy engine',detail:'Allow wildcard',state:'risk'},{name:'reports-lab',detail:'Dati esposti',state:'risk'},{name:'Audit log',detail:'Visibilità insufficiente',state:'risk'}]
    },
    {
      id: 'atk-endpoint-impact', domain: 'ENDPOINT', level: 'Esperto', title: 'Dimostra l’impatto nel sandbox',
      objective: 'Avvia il locker innocuo che modifica soltanto oggetti JavaScript in memoria.',
      story: 'Hai raggiunto un endpoint inventato. Devi dimostrare l’impatto senza aprire cartelle, cifrare file o creare software eseguibile.',
      lesson: 'La simulazione genera telemetria utile alla difesa: molte modifiche rapide, estensioni insolite e accesso a una condivisione fittizia.',
      prompt: 'cyberlab$', task: 'Scrivi il comando che avvia lo scenario locker-memory sui soli file demo.',
      format: 'Deve contenere --safe e --files demo.',
      answer: 'cyberlab endpoint simulate --scenario locker-memory --files demo --safe',
      tokens: ['cyberlab','endpoint','simulate','--scenario','locker-memory','--files','demo','--safe'],
      hints: ['Usa endpoint simulate.','Seleziona locker-memory, i file demo e la modalità --safe.','Codice completo: cyberlab endpoint simulate --scenario locker-memory --files demo --safe'],
      output: '[SAFE MODE] filesystem non disponibile\n[MEMORY] 120 oggetti demo marcati locked=true\n[TELEMETRY] rapid_changes=120 new_extensions=8 shared_path=true\nFLAG{IMPACT_SAFELY_DEMONSTRATED}',
      explanation: [
        ['endpoint simulate','avvia un comportamento inventato dentro l’app','permette di studiare l’impatto senza produrre malware'],
        ['--scenario locker-memory','sceglie la trasformazione di oggetti in memoria','evita operazioni su file reali'],
        ['--files demo','usa esclusivamente dati dimostrativi inclusi nell’app','mantiene il test isolato'],
        ['--safe','blocca per progettazione filesystem, rete e processi esterni','rende esplicito il vincolo di sicurezza']
      ],
      defense: 'Rileva modifiche rapide e anomale, limita i permessi sulle condivisioni, usa backup verificati e isola tempestivamente il dispositivo interessato.',
      nodes: [{name:'Endpoint-LAB',detail:'Sandbox',state:'active'},{name:'Demo files',detail:'Oggetti in memoria',state:''},{name:'Telemetry',detail:'In ascolto',state:'safe'},{name:'Filesystem',detail:'Non accessibile',state:'safe'}],
      afterNodes: [{name:'Endpoint-LAB',detail:'Impatto simulato',state:'owned'},{name:'Demo files',detail:'locked=true',state:'risk'},{name:'Telemetry',detail:'Segnali generati',state:'active'},{name:'Filesystem',detail:'Mai toccato',state:'safe'}]
    },
    {
      id: 'atk-pro-report', domain: 'RED TEAM PROFESSIONALE', level: 'Pro', title: 'Consegna una prova utile',
      objective: 'Genera il rapporto finale della catena simulata includendo evidenza, impatto, rilevamento, mitigazione e retest.',
      story: 'Hai completato una catena interamente fittizia. Il valore professionale non è “essere entrato”, ma produrre una correzione verificabile.',
      lesson: 'Un rapporto red team collega ogni azione al rischio e alla difesa. Non deve contenere credenziali, dati reali o istruzioni fuori dal perimetro.',
      prompt: 'cyberlab$', task: 'Scrivi il comando che costruisce il report con tutte le sezioni richieste.',
      format: 'Usa --include con cinque sezioni.',
      answer: 'cyberlab report build --scenario full-chain --include evidence,impact,detection,mitigation,retest',
      tokens: ['cyberlab','report','build','--scenario','full-chain','--include','evidence','impact','detection','mitigation','retest'],
      hints: ['Usa report build.','Lo scenario è full-chain e le sezioni vanno dopo --include.','Codice completo: cyberlab report build --scenario full-chain --include evidence,impact,detection,mitigation,retest'],
      output: '[REPORT] 6 evidenze collegate\n[REPORT] impatto classificato\n[REPORT] 7 controlli difensivi proposti\n[REPORT] retest obbligatorio\nFLAG{PROFESSIONAL_RED_TEAM}',
      explanation: [
        ['report build','crea il documento finale nel simulatore','trasforma l’attività tecnica in miglioramento misurabile'],
        ['--scenario full-chain','collega tutte le fasi precedenti','mantiene la storia e le evidenze coerenti'],
        ['--include evidence,impact,detection,mitigation,retest','richiede prova, conseguenza, visibilità, correzione e verifica finale','copre l’intero ciclo professionale']
      ],
      defense: 'Il blue team usa il rapporto per correggere i controlli, creare rilevamenti, assegnare priorità e ripetere il test fino alla chiusura.',
      nodes: [{name:'Red team',detail:'Evidenze raccolte',state:'owned'},{name:'Blue team',detail:'In attesa del report',state:'active'},{name:'Owner',detail:'Mitigazioni da approvare',state:''},{name:'Retest',detail:'Da pianificare',state:''}],
      afterNodes: [{name:'Red team',detail:'Report consegnato',state:'safe'},{name:'Blue team',detail:'Detection pronte',state:'safe'},{name:'Owner',detail:'Piano approvato',state:'safe'},{name:'Retest',detail:'Obbligatorio',state:'active'}]
    }
  ];
