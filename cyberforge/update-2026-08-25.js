const AUG25_ATTACK = [
  {
    id:'atk-mtls-policy-offline',domain:'RETI, TLS E IDENTITÀ',level:'Intermedio',title:'Revisiona una policy mTLS offline',
    objective:'Analizza mtls-policy-lab.json e individua trust troppo ampio, client certificate opzionale e protocolli legacy.',
    story:'Il laboratorio contiene una policy TLS sintetica esportata da un servizio interno. Devi valutarla senza aprire socket o contattare host.',
    lesson:'mTLS autentica entrambe le parti. Una review sicura controlla trust store, obbligatorietà del certificato client, protocolli ammessi e scadenze senza effettuare connessioni.',
    prompt:'cyberlab$',task:'Scrivi il comando che revisiona mtls-policy-lab.json per client-cert,trust-scope,tls-version,expiry in modalità offline.',format:'Un comando cyberlab tls policy-review.',
    answer:'cyberlab tls policy-review --file mtls-policy-lab.json --checks client-cert,trust-scope,tls-version,expiry --offline',
    tokens:['cyberlab','tls','policy-review','--file','mtls-policy-lab.json','--checks','client-cert','trust-scope','tls-version','expiry','--offline'],
    hints:['Inizia con cyberlab tls policy-review.','Usa il file mtls-policy-lab.json e i quattro controlli richiesti.','Codice completo: cyberlab tls policy-review --file mtls-policy-lab.json --checks client-cert,trust-scope,tls-version,expiry --offline'],
    output:'[OFFLINE] policy caricata\n[HIGH] clientCertificate=optional\n[WARN] trustScope=all-internal-CAs\n[WARN] TLS1.1 ancora ammesso\n[INFO] certificato demo scade tra 21 giorni\nFLAG{MTLS_POLICY_REVIEWED}',
    explanation:[['tls policy-review','avvia la revisione statica della policy TLS','serve a verificare autenticazione e cifratura senza rete'],['--file mtls-policy-lab.json','usa esclusivamente il file sintetico locale','mantiene il perimetro offline'],['--checks client-cert,trust-scope,tls-version,expiry','seleziona i controlli di identità, trust, protocollo e scadenza','rende la review ripetibile'],['--offline','impedisce qualsiasi connessione','garantisce che nessun host venga contattato']],
    defense:'Rendi obbligatorio il certificato client, limita le CA fidate al servizio necessario, consenti solo TLS moderno e monitora rinnovi e revoche.',
    nodes:[{name:'mtls-policy-lab.json',detail:'Policy locale',state:'active'},{name:'Client cert',detail:'Da verificare',state:'risk'},{name:'Trust store',detail:'Da verificare',state:'risk'},{name:'Rete',detail:'Non utilizzata',state:'safe'}],
    afterNodes:[{name:'mtls-policy-lab.json',detail:'Revisionata',state:'owned'},{name:'Client cert',detail:'Optional',state:'risk'},{name:'Trust store',detail:'Troppo ampio',state:'risk'},{name:'Rete',detail:'Zero connessioni',state:'safe'}]
  },
  {
    id:'atk-mass-assignment-static',domain:'WEB, API E SECURE CODING',level:'Avanzato',title:'Trova un rischio di mass assignment',
    objective:'Analizza UserUpdateController.cs e UserEntity.cs per capire se il client può valorizzare campi che non dovrebbe controllare.',
    story:'La CyberRange contiene sorgenti C# sintetici. Il controller associa direttamente il body HTTP a una entity con proprietà IsAdmin e CreditLimit.',
    lesson:'Il mass assignment nasce quando il binding accetta più proprietà di quelle previste dal caso d’uso. La review statica confronta input model, entity e campi sensibili senza inviare richieste.',
    prompt:'cyberlab$',task:'Scrivi il comando che confronta controller ed entity cercando direct-entity-binding e sensitive-fields in modalità static.',format:'Un comando cyberlab code binding-review.',
    answer:'cyberlab code binding-review --controller UserUpdateController.cs --model UserEntity.cs --checks direct-entity-binding,sensitive-fields --mode static',
    tokens:['cyberlab','code','binding-review','--controller','userupdatecontroller.cs','--model','userentity.cs','--checks','direct-entity-binding','sensitive-fields','--mode','static'],
    hints:['Usa cyberlab code binding-review.','Indica controller, model e i controlli direct-entity-binding,sensitive-fields.','Codice completo: cyberlab code binding-review --controller UserUpdateController.cs --model UserEntity.cs --checks direct-entity-binding,sensitive-fields --mode static'],
    output:'[STATIC] controller e model caricati\n[HIGH] body bind diretto su UserEntity\n[HIGH] proprietà sensibili esposte: IsAdmin,CreditLimit\n[NETWORK] zero richieste inviate\nFLAG{MASS_ASSIGNMENT_RISK_FOUND}',
    explanation:[['code binding-review','confronta il codice di binding e il modello dati','serve a trovare proprietà esposte involontariamente'],['--controller UserUpdateController.cs','carica il controller sintetico','identifica come entra l’input'],['--model UserEntity.cs','carica la entity locale','elenca le proprietà potenzialmente valorizzabili'],['--checks direct-entity-binding,sensitive-fields','cerca binding diretto e campi privilegiati','prioritizza il rischio'],['--mode static','esegue solo analisi del sorgente','non invia richieste HTTP']],
    defense:'Usa DTO dedicati con sole proprietà consentite, mappatura esplicita server-side, autorizzazione sui campi sensibili e test automatici che rifiutino proprietà extra.',
    nodes:[{name:'Controller',detail:'Sorgente locale',state:'active'},{name:'UserEntity',detail:'Entity completa',state:'risk'},{name:'IsAdmin',detail:'Campo sensibile',state:'risk'},{name:'HTTP',detail:'Non utilizzato',state:'safe'}],
    afterNodes:[{name:'Controller',detail:'Binding diretto trovato',state:'risk'},{name:'UserEntity',detail:'Superficie eccessiva',state:'risk'},{name:'IsAdmin',detail:'Esposto al binder',state:'risk'},{name:'HTTP',detail:'Zero richieste',state:'safe'}]
  },
  {
    id:'atk-cicd-permissions-review',domain:'CLOUD, CI/CD E SUPPLY CHAIN',level:'Esperto',title:'Revisiona i privilegi della pipeline',
    objective:'Analizza workflow-lab.yml e individua permessi eccessivi, action non pinnate e artifact senza verifica di integrità.',
    story:'Hai una copia locale sintetica di una pipeline CI. Devi valutarla senza eseguire workflow, scaricare action o usare token.',
    lesson:'La sicurezza CI/CD dipende da minimo privilegio, dipendenze pinnate e artefatti verificabili. Una review statica può rilevare questi problemi prima dell’esecuzione.',
    prompt:'cyberlab$',task:'Scrivi il comando che revisiona workflow-lab.yml per permissions,action-pinning,artifact-integrity in modalità offline.',format:'Un comando cyberlab cicd review.',
    answer:'cyberlab cicd review --file workflow-lab.yml --checks permissions,action-pinning,artifact-integrity --offline',
    tokens:['cyberlab','cicd','review','--file','workflow-lab.yml','--checks','permissions','action-pinning','artifact-integrity','--offline'],
    hints:['Inizia con cyberlab cicd review.','Usa workflow-lab.yml e i tre controlli richiesti.','Codice completo: cyberlab cicd review --file workflow-lab.yml --checks permissions,action-pinning,artifact-integrity --offline'],
    output:'[OFFLINE] workflow caricato\n[HIGH] permissions: write-all\n[WARN] action usa tag mobile invece di commit SHA\n[WARN] artifact privo di digest verificato\nFLAG{CICD_PRIVILEGES_REVIEWED}',
    explanation:[['cicd review','analizza la pipeline come testo','permette di trovare rischi prima dell’esecuzione'],['--file workflow-lab.yml','usa il workflow sintetico locale','non richiede accesso a GitHub o runner'],['--checks permissions,action-pinning,artifact-integrity','controlla privilegi, dipendenze e integrità','copre i principali confini di fiducia della pipeline'],['--offline','blocca dipendenze esterne','evita token, download e workflow reali']],
    defense:'Imposta permissions esplicite e minime, pin delle action a commit verificati, ambienti protetti e verifica SHA-256 degli artefatti prima della promozione.',
    nodes:[{name:'workflow-lab.yml',detail:'Pipeline locale',state:'active'},{name:'Token scope',detail:'Da verificare',state:'risk'},{name:'Actions',detail:'Da verificare',state:'risk'},{name:'Runner',detail:'Non avviato',state:'safe'}],
    afterNodes:[{name:'workflow-lab.yml',detail:'Revisionato',state:'owned'},{name:'Token scope',detail:'write-all',state:'risk'},{name:'Actions',detail:'Non pinnate',state:'risk'},{name:'Runner',detail:'Mai avviato',state:'safe'}]
  }
];

const AUG25_DEFENSE = [
  {
    id:'def-mtls-policy-hardening',domain:'RETI, TLS E IDENTITÀ',level:'Avanzato',title:'Applica una baseline mTLS',
    objective:'Rendi obbligatorio il certificato client, limita il trust e consenti soltanto TLS moderno nel modello locale.',
    story:'La review ha trovato client certificate opzionale e trust troppo ampio. Devi trasformare la policy sintetica in una baseline verificabile.',
    lesson:'Una baseline mTLS riduce l’accesso a identità certificate e limita la fiducia al minimo necessario. Scadenze e revoche devono restare osservabili.',
    prompt:'defend$',task:'Scrivi il comando che imposta client-cert required, trust service-ca, min-tls 1.2 e expiry-alert 30d.',format:'Un comando defend tls mtls-policy.',
    answer:'defend tls mtls-policy --file mtls-policy-lab.json --client-cert required --trust service-ca --min-tls 1.2 --expiry-alert 30d',
    tokens:['defend','tls','mtls-policy','--file','mtls-policy-lab.json','--client-cert','required','--trust','service-ca','--min-tls','1.2','--expiry-alert','30d'],
    hints:['Usa defend tls mtls-policy.','Imposta certificato client required, trust service-ca e TLS minimo 1.2.','Codice completo: defend tls mtls-policy --file mtls-policy-lab.json --client-cert required --trust service-ca --min-tls 1.2 --expiry-alert 30d'],
    output:'[CLIENT CERT] required\n[TRUST] service-ca only\n[TLS] minimum=1.2\n[EXPIRY] alert=30d\nFLAG{MTLS_BASELINE_APPLIED}',
    explanation:[['tls mtls-policy','applica controlli al modello mTLS locale','centralizza la baseline'],['--client-cert required','richiede autenticazione del client tramite certificato','nega client non certificati'],['--trust service-ca','limita le CA ammesse','riduce il perimetro di fiducia'],['--min-tls 1.2','rifiuta protocolli più vecchi nel modello','mantiene una baseline moderna'],['--expiry-alert 30d','genera un avviso prima della scadenza','riduce interruzioni e certificati scaduti']],
    attackView:'Il servizio simulato non accetta più client senza certificato valido e la catena di fiducia è più stretta.',
    nodes:[{name:'Client cert',detail:'Optional',state:'risk'},{name:'Trust',detail:'Ampio',state:'risk'},{name:'TLS',detail:'Legacy ammesso',state:'risk'},{name:'Expiry',detail:'Non monitorata',state:'risk'}],
    afterNodes:[{name:'Client cert',detail:'Required',state:'safe'},{name:'Trust',detail:'service-ca',state:'safe'},{name:'TLS',detail:'>=1.2',state:'safe'},{name:'Expiry',detail:'Alert 30d',state:'active'}]
  },
  {
    id:'def-mass-assignment-dto',domain:'WEB, API E SECURE CODING',level:'Esperto',title:'Blocca il mass assignment con un DTO',
    objective:'Limita l’input aggiornabile a DisplayName e Email e verifica che IsAdmin venga ignorato o rifiutato.',
    story:'La review ha mostrato binding diretto sulla entity. Devi introdurre un contratto esplicito e una mappatura server-side.',
    lesson:'Un DTO dedicato restringe la superficie del binder. La sicurezza aumenta quando la mappatura è esplicita e i campi privilegiati vengono gestiti soltanto da percorsi autorizzati.',
    prompt:'defend$',task:'Scrivi il comando che crea una policy di binding allowlist per DisplayName,Email e rifiuta proprietà extra.',format:'Un comando defend api binding-policy.',
    answer:'defend api binding-policy --dto UserUpdateDto --allow DisplayName,Email --extra-properties reject --sensitive IsAdmin,CreditLimit',
    tokens:['defend','api','binding-policy','--dto','userupdatedto','--allow','displayname','email','--extra-properties','reject','--sensitive','isadmin','creditlimit'],
    hints:['Inizia con defend api binding-policy.','Consenti solo DisplayName,Email e imposta extra-properties reject.','Codice completo: defend api binding-policy --dto UserUpdateDto --allow DisplayName,Email --extra-properties reject --sensitive IsAdmin,CreditLimit'],
    output:'[DTO] UserUpdateDto allow=DisplayName,Email\n[BINDING] extra properties=reject\n[SENSITIVE] IsAdmin,CreditLimit esclusi\n[TEST] payload con IsAdmin -> rejected\nFLAG{MASS_ASSIGNMENT_BLOCKED}',
    explanation:[['api binding-policy','definisce una policy di input esplicita','riduce i campi accettati dal client'],['--dto UserUpdateDto','usa un modello dedicato al caso d’uso','separa input pubblico dalla entity interna'],['--allow DisplayName,Email','consente solo i campi necessari','applica minimo privilegio ai dati in ingresso'],['--extra-properties reject','rifiuta proprietà non previste','rende visibili tentativi o errori di contratto'],['--sensitive IsAdmin,CreditLimit','marca i campi che non devono arrivare dal client','previene modifiche privilegiate tramite binding']],
    attackView:'Un payload locale che aggiunge IsAdmin non viene più mappato sulla entity e il test di regressione fallisce in modo sicuro.',
    nodes:[{name:'UserUpdateDto',detail:'Da creare',state:'active'},{name:'DisplayName',detail:'Consentito',state:''},{name:'IsAdmin',detail:'Da proteggere',state:'risk'},{name:'Tests',detail:'Da aggiungere',state:'active'}],
    afterNodes:[{name:'UserUpdateDto',detail:'Allowlist attiva',state:'safe'},{name:'DisplayName',detail:'Consentito',state:'safe'},{name:'IsAdmin',detail:'Escluso dal DTO',state:'safe'},{name:'Tests',detail:'Regressione coperta',state:'safe'}]
  },
  {
    id:'def-cicd-least-privilege',domain:'CLOUD, CI/CD E SUPPLY CHAIN',level:'Pro',title:'Rendi la pipeline verificabile e a minimo privilegio',
    objective:'Riduci i permessi del workflow, richiedi action pinnate e verifica il digest dell’artefatto prima della promozione.',
    story:'La pipeline sintetica usa write-all e riferimenti mobili. Devi applicare controlli che riducano il blast radius senza eseguire la pipeline.',
    lesson:'Il runner deve ricevere solo i permessi necessari. Dipendenze e artefatti devono essere identificabili in modo immutabile e verificabile prima del rilascio.',
    prompt:'defend$',task:'Scrivi il comando che imposta contents read, id-token none, action pin required e artifact sha256 verify.',format:'Un comando defend cicd policy.',
    answer:'defend cicd policy --workflow workflow-lab.yml --permissions contents:read,id-token:none --action-pin commit-sha --artifact-verify sha256 --mode static',
    tokens:['defend','cicd','policy','--workflow','workflow-lab.yml','--permissions','contents:read','id-token:none','--action-pin','commit-sha','--artifact-verify','sha256','--mode','static'],
    hints:['Usa defend cicd policy.','Riduci permissions e richiedi pin a commit SHA.','Codice completo: defend cicd policy --workflow workflow-lab.yml --permissions contents:read,id-token:none --action-pin commit-sha --artifact-verify sha256 --mode static'],
    output:'[PERMISSIONS] contents=read id-token=none\n[ACTIONS] immutable commit pin required\n[ARTIFACT] sha256 verification required\n[MODE] static validation only\nFLAG{CICD_LEAST_PRIVILEGE_APPLIED}',
    explanation:[['cicd policy','definisce i requisiti della pipeline locale','trasforma la review in una baseline testabile'],['--permissions contents:read,id-token:none','concede soltanto lettura del repository e nessun token OIDC','riduce il blast radius'],['--action-pin commit-sha','richiede riferimenti immutabili alle action','evita cambi inattesi del codice dipendente'],['--artifact-verify sha256','richiede verifica del digest prima della promozione','controlla l’integrità dell’artefatto'],['--mode static','valida il file senza eseguire workflow','mantiene il laboratorio offline']],
    attackView:'Una modifica della dipendenza o dell’artefatto viene rilevata dalla policy prima che il contenuto possa essere promosso.',
    nodes:[{name:'Permissions',detail:'write-all',state:'risk'},{name:'Actions',detail:'Tag mobile',state:'risk'},{name:'Artifact',detail:'Non verificato',state:'risk'},{name:'Runner',detail:'Non avviato',state:'safe'}],
    afterNodes:[{name:'Permissions',detail:'Minime',state:'safe'},{name:'Actions',detail:'Commit pin',state:'safe'},{name:'Artifact',detail:'SHA-256 richiesto',state:'safe'},{name:'Runner',detail:'Policy statica',state:'safe'}]
  }
];

function appendUniqueScenarios(target, incoming){
  const ids = new Set(target.map(item => item.id));
  incoming.forEach(item => { if(!ids.has(item.id)){ target.push(item); ids.add(item.id); } });
}

if (typeof CYBERFORGE_ATTACK !== 'undefined') appendUniqueScenarios(CYBERFORGE_ATTACK, AUG25_ATTACK);
if (typeof CYBERFORGE_DEFENSE !== 'undefined') appendUniqueScenarios(CYBERFORGE_DEFENSE, AUG25_DEFENSE);
