const AUG14_ATTACK = [
  {
    id:'atk-tls-local-review',domain:'RETI E TLS',level:'Junior',title:'Revisiona un certificato locale',
    objective:'Analizza certificate-lab.json e verifica scadenza, hostname e versione TLS minima.',
    story:'Il laboratorio contiene i metadati sintetici di un certificato usato da localhost. Devi valutarli senza aprire connessioni di rete.',
    lesson:'La revisione TLS controlla identità del servizio, validità temporale e protocollo minimo. Qui lavori solo su dati esportati localmente.',
    prompt:'cyberlab$',task:'Scrivi il comando che controlla certificate-lab.json per hostname, expiry e tls-min in modalità offline.',format:'Un comando cyberlab tls review.',
    answer:'cyberlab tls review --file certificate-lab.json --check hostname,expiry,tls-min --offline',
    tokens:['cyberlab','tls','review','--file','certificate-lab.json','--check','hostname','expiry','tls-min','--offline'],
    hints:['Inizia con cyberlab tls review.','Usa --file certificate-lab.json e controlla hostname,expiry,tls-min.','Codice completo: cyberlab tls review --file certificate-lab.json --check hostname,expiry,tls-min --offline'],
    output:'[OFFLINE] certificato caricato\n[OK] hostname=localhost\n[WARN] scadenza tra 9 giorni\n[WARN] tls_min=1.1\nFLAG{TLS_BASELINE_REVIEWED}',
    explanation:[['tls review','avvia una revisione statica dei metadati TLS','serve a valutare la configurazione senza contattare servizi'],['--file certificate-lab.json','seleziona il file sintetico locale','mantiene il test nel laboratorio'],['--check hostname,expiry,tls-min','definisce i controlli richiesti','rende la baseline verificabile'],['--offline','impedisce accessi di rete','garantisce isolamento']],
    defense:'Rinnova i certificati prima della scadenza, valida il nome del servizio e configura TLS 1.2 o superiore secondo i requisiti del sistema.',
    nodes:[{name:'certificate-lab.json',detail:'Metadati locali',state:'active'},{name:'Hostname',detail:'Da verificare',state:''},{name:'Scadenza',detail:'Da verificare',state:''},{name:'TLS minimo',detail:'Da verificare',state:''}],
    afterNodes:[{name:'certificate-lab.json',detail:'Revisionato',state:'owned'},{name:'Hostname',detail:'localhost OK',state:'safe'},{name:'Scadenza',detail:'9 giorni',state:'risk'},{name:'TLS minimo',detail:'1.1 debole',state:'risk'}]
  },
  {
    id:'atk-sbom-local-audit',domain:'SUPPLY CHAIN',level:'Avanzato',title:'Analizza una SBOM locale',
    objective:'Controlla sbom-lab.json e individua dipendenze obsolete o non approvate.',
    story:'Hai una Software Bill of Materials sintetica del progetto demo. Devi classificarne i componenti senza scaricare pacchetti o interrogare registry.',
    lesson:'Una SBOM rende visibili componenti e versioni. Una revisione offline aiuta a trovare dipendenze fuori policy senza eseguire codice di terzi.',
    prompt:'cyberlab$',task:'Scrivi il comando che controlla sbom-lab.json rispetto a policy-lab.json in modalità offline.',format:'Un comando cyberlab sbom audit.',
    answer:'cyberlab sbom audit --file sbom-lab.json --policy policy-lab.json --offline',
    tokens:['cyberlab','sbom','audit','--file','sbom-lab.json','--policy','policy-lab.json','--offline'],
    hints:['Usa cyberlab sbom audit.','Specifica SBOM e policy locali.','Codice completo: cyberlab sbom audit --file sbom-lab.json --policy policy-lab.json --offline'],
    output:'[SBOM] 42 componenti\n[WARN] demo-lib 1.2 fuori baseline\n[WARN] legacy-parser non approvato\nFLAG{SUPPLY_CHAIN_REVIEWED}',
    explanation:[['sbom audit','confronta componenti e policy del laboratorio','serve a individuare dipendenze da revisionare'],['--file sbom-lab.json','legge l’inventario locale','evita enumerazioni esterne'],['--policy policy-lab.json','usa regole approvate dal progetto','rende la revisione coerente'],['--offline','disabilita accessi esterni','mantiene il test riproducibile']],
    defense:'Mantieni una SBOM aggiornata, approva esplicitamente le dipendenze, blocca versioni non conformi in CI e verifica aggiornamenti prima del rilascio.',
    nodes:[{name:'SBOM',detail:'42 componenti',state:'active'},{name:'demo-lib',detail:'Da verificare',state:''},{name:'legacy-parser',detail:'Da verificare',state:'risk'},{name:'Registry',detail:'Non contattato',state:'safe'}],
    afterNodes:[{name:'SBOM',detail:'Audit completato',state:'owned'},{name:'demo-lib',detail:'Fuori baseline',state:'risk'},{name:'legacy-parser',detail:'Non approvato',state:'risk'},{name:'Registry',detail:'Mai contattato',state:'safe'}]
  },
  {
    id:'atk-jwt-claims-offline',domain:'IDENTITÀ E TOKEN',level:'Esperto',title:'Revisiona claim JWT sintetici',
    objective:'Decodifica solo il payload di token-demo.txt e controlla issuer, audience, expiration e role.',
    story:'Il file contiene un token fittizio creato per il laboratorio. Devi esaminare i claim senza usarlo per autenticarti da nessuna parte.',
    lesson:'Leggere i claim aiuta a verificare assunzioni su identità e autorizzazione. La validazione reale deve comunque verificare firma, issuer, audience e scadenza sul server.',
    prompt:'cyberlab$',task:'Scrivi il comando che revisiona token-demo.txt in modalità offline e mostra iss,aud,exp,role.',format:'Un comando cyberlab jwt inspect.',
    answer:'cyberlab jwt inspect --file token-demo.txt --show iss,aud,exp,role --offline',
    tokens:['cyberlab','jwt','inspect','--file','token-demo.txt','--show','iss','aud','exp','role','--offline'],
    hints:['Inizia con cyberlab jwt inspect.','Seleziona token-demo.txt e i quattro claim.','Codice completo: cyberlab jwt inspect --file token-demo.txt --show iss,aud,exp,role --offline'],
    output:'[JWT] iss=lab.local aud=shop.lab\n[WARN] exp già superata\n[INFO] role=admin-demo\nFLAG{JWT_CLAIMS_REVIEWED}',
    explanation:[['jwt inspect','decodifica i dati sintetici senza autenticazione','serve a comprendere i claim'],['--file token-demo.txt','usa esclusivamente il token fittizio locale','evita raccolta di credenziali'],['--show iss,aud,exp,role','mostra i claim rilevanti','aiuta a confrontarli con la policy'],['--offline','impedisce chiamate esterne','mantiene il laboratorio isolato']],
    defense:'Valida sempre firma, algoritmo consentito, issuer, audience, expiration e autorizzazioni lato server; non fidarti dei claim solo perché sono decodificabili.',
    nodes:[{name:'token-demo.txt',detail:'Token sintetico',state:'active'},{name:'Issuer',detail:'Da verificare',state:''},{name:'Expiration',detail:'Da verificare',state:''},{name:'Role',detail:'Demo',state:''}],
    afterNodes:[{name:'token-demo.txt',detail:'Revisionato',state:'owned'},{name:'Issuer',detail:'lab.local',state:'safe'},{name:'Expiration',detail:'Scaduto',state:'risk'},{name:'Role',detail:'admin-demo',state:'active'}]
  }
];

const AUG14_DEFENSE = [
  {
    id:'def-web-cors',domain:'WEB E API',level:'Junior',title:'Correggi una policy CORS',
    objective:'Consenti solo l’origine locale prevista e i metodi necessari.',
    story:'La configurazione demo usa una policy troppo ampia. Devi sostituirla con una allowlist esplicita.',
    lesson:'CORS non è autenticazione, ma una policy troppo permissiva aumenta l’esposizione dal browser. La difesa deve essere specifica e minima.',
    prompt:'defend$',task:'Scrivi la policy che consente solo https://localhost:4200, GET e POST, con credentials disabilitate.',format:'Un comando defend web cors.',
    answer:'defend web cors --origin https://localhost:4200 --methods GET,POST --credentials off --default deny',
    tokens:['defend','web','cors','--origin','https://localhost:4200','--methods','get','post','--credentials','off','--default','deny'],
    hints:['Usa defend web cors.','Imposta una sola origine locale e solo GET,POST.','Codice completo: defend web cors --origin https://localhost:4200 --methods GET,POST --credentials off --default deny'],
    output:'[CORS] origin=https://localhost:4200\n[METHODS] GET,POST\n[CREDENTIALS] OFF\n[DEFAULT] deny\nFLAG{CORS_RESTRICTED}',
    explanation:[['web cors','configura la policy CORS del laboratorio','riduce origini e metodi ammessi'],['--origin https://localhost:4200','definisce l’unica origine consentita','evita wildcard non necessarie'],['--methods GET,POST','limita i metodi','applica minimo privilegio'],['--credentials off','non consente credenziali cross-origin','riduce esposizione'],['--default deny','nega tutto il resto','evita aperture implicite']],
    attackView:'Le origini non previste vengono bloccate dal browser e la policy resta verificabile.',
    nodes:[{name:'API',detail:'CORS ampio',state:'risk'},{name:'localhost:4200',detail:'Client previsto',state:'active'},{name:'Origini esterne',detail:'Consentite',state:'risk'},{name:'Credentials',detail:'ON',state:'risk'}],
    afterNodes:[{name:'API',detail:'CORS ristretto',state:'safe'},{name:'localhost:4200',detail:'Consentito',state:'safe'},{name:'Origini esterne',detail:'Negate',state:'safe'},{name:'Credentials',detail:'OFF',state:'safe'}]
  },
  {
    id:'def-backup-restore-test',domain:'RESILIENZA E INCIDENT RESPONSE',level:'Avanzato',title:'Prova davvero il ripristino',
    objective:'Verifica checksum, ripristina in sandbox e confronta i dati prima di dichiarare valido il backup.',
    story:'Hai backup-demo.zip e manifest.sha256. Devi dimostrare che il backup è utilizzabile senza sovrascrivere dati reali.',
    lesson:'Un backup non è affidabile finché non viene verificato e provato. Il test deve essere isolato e ripetibile.',
    prompt:'defend$',task:'Scrivi il comando che verifica l’hash, ripristina in restore-sandbox e valida il manifest.',format:'Un comando defend backup test.',
    answer:'defend backup test --file backup-demo.zip --checksum manifest.sha256 --restore restore-sandbox --validate manifest --offline',
    tokens:['defend','backup','test','--file','backup-demo.zip','--checksum','manifest.sha256','--restore','restore-sandbox','--validate','manifest','--offline'],
    hints:['Usa defend backup test.','Aggiungi checksum, cartella sandbox e validazione manifest.','Codice completo: defend backup test --file backup-demo.zip --checksum manifest.sha256 --restore restore-sandbox --validate manifest --offline'],
    output:'[HASH] OK\n[RESTORE] restore-sandbox completato\n[VALIDATE] 120/120 file coerenti\nFLAG{BACKUP_RESTORE_PROVEN}',
    explanation:[['backup test','avvia una prova di recupero controllata','dimostra che il backup è realmente utilizzabile'],['--checksum manifest.sha256','verifica l’integrità prima del ripristino','evita uso di copie corrotte'],['--restore restore-sandbox','usa una destinazione isolata','non tocca dati reali'],['--validate manifest','confronta il risultato atteso','verifica completezza'],['--offline','evita dipendenze esterne','rende il test ripetibile']],
    attackView:'Anche in caso di perdita o cifratura dei dati, esiste una procedura verificata di recupero.',
    nodes:[{name:'Backup',detail:'Non testato',state:'risk'},{name:'Checksum',detail:'Disponibile',state:'active'},{name:'Sandbox',detail:'Vuota',state:''},{name:'Recovery',detail:'Non provato',state:'risk'}],
    afterNodes:[{name:'Backup',detail:'Verificato',state:'safe'},{name:'Checksum',detail:'OK',state:'safe'},{name:'Sandbox',detail:'120 file',state:'safe'},{name:'Recovery',detail:'Provato',state:'active'}]
  },
  {
    id:'def-identity-correlation',domain:'IDENTITÀ E ANTI-EVASIONE',level:'Esperto',title:'Correla segnali senza attribuire alla cieca',
    objective:'Correla login sintetici usando account, device, sessione e rischio, senza trattare l’IP come identità.',
    story:'events-auth.json contiene accessi da reti diverse. Devi generare un alert solo quando più segnali indipendenti superano la soglia.',
    lesson:'Un IP può essere condiviso, dinamico o mediato. Una detection robusta usa più segnali e mantiene l’attribuzione separata dall’identificazione tecnica.',
    prompt:'defend$',task:'Scrivi la regola che richiede almeno 3 segnali tra new-device,new-country,session-anomaly,mfa-failure e genera review.',format:'Un comando defend identity correlate.',
    answer:'defend identity correlate --file events-auth.json --signals new-device,new-country,session-anomaly,mfa-failure --threshold 3 --action review',
    tokens:['defend','identity','correlate','--file','events-auth.json','--signals','new-device','new-country','session-anomaly','mfa-failure','--threshold','3','--action','review'],
    hints:['Usa defend identity correlate.','Definisci quattro segnali e soglia 3.','Codice completo: defend identity correlate --file events-auth.json --signals new-device,new-country,session-anomaly,mfa-failure --threshold 3 --action review'],
    output:'[EVENTS] 80 login sintetici\n[MATCH] session=LAB-17 signals=3\n[ACTION] review richiesta\n[NOTE] IP non usato come identità\nFLAG{IDENTITY_SIGNALS_CORRELATED}',
    explanation:[['identity correlate','correla eventi locali di autenticazione','riduce decisioni basate su un singolo indicatore'],['--signals ...','definisce segnali indipendenti','aumenta qualità del rilevamento'],['--threshold 3','richiede almeno tre condizioni','riduce falsi positivi'],['--action review','richiede revisione invece di attribuzione automatica','mantiene il processo proporzionato']],
    attackView:'Tentativi anomali diventano visibili anche se cambiano rete, mentre la difesa evita conclusioni errate basate solo sull’IP.',
    nodes:[{name:'events-auth.json',detail:'80 eventi',state:'active'},{name:'Device',detail:'Segnale',state:''},{name:'Sessione',detail:'Segnale',state:''},{name:'IP',detail:'Non è identità',state:'safe'}],
    afterNodes:[{name:'LAB-17',detail:'3 segnali',state:'risk'},{name:'Detection',detail:'Correlata',state:'active'},{name:'Review',detail:'Aperta',state:'active'},{name:'IP',detail:'Solo contesto',state:'safe'}]
  }
];

CYBERFORGE_ATTACK.splice(CYBERFORGE_ATTACK.length - 1,0,...AUG14_ATTACK);
CYBERFORGE_DEFENSE.splice(CYBERFORGE_DEFENSE.length - 1,0,...AUG14_DEFENSE);