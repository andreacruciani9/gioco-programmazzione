const AUG18_ATTACK = [
  {
    id:'atk-network-acl-offline',domain:'RETI E FIREWALL',level:'Intermedio',title:'Revisiona una ACL di laboratorio',
    objective:'Analizza firewall-lab.json e individua regole troppo ampie verso servizi amministrativi.',
    story:'Hai esportato le regole di un firewall demo in un file locale. Devi trovare esposizioni eccessive senza inviare traffico o contattare host.',
    lesson:'Una revisione ACL confronta sorgente, destinazione, porta e azione. Regole molto ampie verso servizi amministrativi aumentano inutilmente la superficie esposta.',
    prompt:'cyberlab$',task:'Scrivi il comando che controlla firewall-lab.json cercando sorgenti any, porte admin e regole allow, in modalità offline.',format:'Un comando cyberlab network acl-review.',
    answer:'cyberlab network acl-review --file firewall-lab.json --check any-source,admin-ports,allow --offline',
    tokens:['cyberlab','network','acl-review','--file','firewall-lab.json','--check','any-source','admin-ports','allow','--offline'],
    hints:['Inizia con cyberlab network acl-review.','Indica firewall-lab.json e i controlli any-source,admin-ports,allow.','Codice completo: cyberlab network acl-review --file firewall-lab.json --check any-source,admin-ports,allow --offline'],
    output:'[OFFLINE] 26 regole caricate\n[HIGH] rule-17 source=any destination=admin-zone port=22 action=allow\n[WARN] rule-21 source=guest destination=mgmt port=443 action=allow\nFLAG{ACL_EXPOSURE_REVIEWED}',
    explanation:[['network acl-review','avvia una revisione delle regole esportate','serve a trovare esposizioni senza generare traffico'],['--file firewall-lab.json','usa soltanto il file locale sintetico','mantiene il test nel perimetro autorizzato'],['--check any-source,admin-ports,allow','cerca combinazioni ad alto rischio','porta l’attenzione sulle regole più permissive'],['--offline','disabilita qualunque accesso di rete','rende la revisione sicura e ripetibile']],
    defense:'Applica deny-by-default, limita le sorgenti alle reti necessarie, separa la zona amministrativa e documenta ogni eccezione.',
    nodes:[{name:'firewall-lab.json',detail:'26 regole',state:'active'},{name:'rule-17',detail:'Da verificare',state:'risk'},{name:'Admin zone',detail:'Servizio sensibile',state:'risk'},{name:'Rete',detail:'Non contattata',state:'safe'}],
    afterNodes:[{name:'firewall-lab.json',detail:'Revisionato',state:'owned'},{name:'rule-17',detail:'Allow eccessivo',state:'risk'},{name:'Admin zone',detail:'Esposizione confermata',state:'risk'},{name:'Rete',detail:'Mai contattata',state:'safe'}]
  },
  {
    id:'atk-ssrf-static-review',domain:'WEB E SECURE CODING',level:'Avanzato',title:'Trova un fetch server-side non vincolato',
    objective:'Analizza UrlPreviewService.cs e individua l’uso di URL ricevuti dall’utente senza allowlist o validazione dello schema.',
    story:'Il progetto demo contiene una funzione di anteprima URL. Devi fare code review statica: nessuna richiesta HTTP viene eseguita.',
    lesson:'Il rischio SSRF nasce quando il server effettua richieste verso destinazioni controllabili dall’utente. La revisione sicura cerca il flusso input -> client HTTP e i controlli mancanti.',
    prompt:'cyberlab$',task:'Scrivi il comando che revisiona UrlPreviewService.cs con la regola server-side-fetch e modalità static.',format:'Un comando cyberlab code review.',
    answer:'cyberlab code review --file src/UrlPreviewService.cs --rule server-side-fetch --mode static',
    tokens:['cyberlab','code','review','--file','src/urlpreviewservice.cs','--rule','server-side-fetch','--mode','static'],
    hints:['Usa cyberlab code review.','Seleziona src/UrlPreviewService.cs e la regola server-side-fetch.','Codice completo: cyberlab code review --file src/UrlPreviewService.cs --rule server-side-fetch --mode static'],
    output:'[STATIC] data-flow analizzato\n[HIGH] userUrl -> HttpClient.GetAsync(userUrl)\n[MISSING] scheme allowlist, host allowlist, redirect policy\nFLAG{SERVER_SIDE_FETCH_RISK}',
    explanation:[['code review','analizza il codice senza eseguirlo','permette di trovare il problema senza inviare richieste'],['--file src/UrlPreviewService.cs','limita la revisione al file posseduto','definisce chiaramente il perimetro'],['--rule server-side-fetch','cerca input che raggiunge un client HTTP','individua il pattern alla radice'],['--mode static','impedisce esecuzione del programma','mantiene il test non invasivo']],
    defense:'Consenti solo schemi e host esplicitamente approvati, risolvi e valida la destinazione, limita redirect e applica egress filtering.',
    nodes:[{name:'UrlPreviewService.cs',detail:'Codice locale',state:'active'},{name:'userUrl',detail:'Input non fidato',state:'risk'},{name:'HttpClient',detail:'Destinazione variabile',state:'risk'},{name:'Rete',detail:'Non usata',state:'safe'}],
    afterNodes:[{name:'UrlPreviewService.cs',detail:'Revisionato',state:'owned'},{name:'userUrl',detail:'Flusso trovato',state:'risk'},{name:'Controlli URL',detail:'Mancanti',state:'risk'},{name:'Rete',detail:'Zero richieste',state:'safe'}]
  },
  {
    id:'atk-cloud-iac-offline',domain:'CLOUD E IaC',level:'Esperto',title:'Revisiona un piano Infrastructure-as-Code',
    objective:'Controlla tfplan-lab.json e individua ingress pubblici, storage non cifrato e ruoli con wildcard.',
    story:'Il team ti consegna un piano Terraform sintetico. Devi valutarlo offline prima del deploy, senza collegarti a provider cloud.',
    lesson:'La sicurezza IaC sposta i controlli prima del rilascio. Un piano locale permette di rilevare configurazioni pericolose senza creare risorse reali.',
    prompt:'cyberlab$',task:'Scrivi il comando che controlla tfplan-lab.json per public-ingress,unencrypted-storage,wildcard-role in modalità offline.',format:'Un comando cyberlab iac review.',
    answer:'cyberlab iac review --file tfplan-lab.json --checks public-ingress,unencrypted-storage,wildcard-role --offline',
    tokens:['cyberlab','iac','review','--file','tfplan-lab.json','--checks','public-ingress','unencrypted-storage','wildcard-role','--offline'],
    hints:['Inizia con cyberlab iac review.','Aggiungi il file tfplan-lab.json e i tre controlli.','Codice completo: cyberlab iac review --file tfplan-lab.json --checks public-ingress,unencrypted-storage,wildcard-role --offline'],
    output:'[PLAN] 31 risorse sintetiche\n[HIGH] admin_sg ingress=0.0.0.0/0:22\n[HIGH] reports_bucket encryption=false\n[HIGH] build_role actions=*\nFLAG{IAC_RISKS_FOUND_BEFORE_DEPLOY}',
    explanation:[['iac review','analizza il piano locale prima del deploy','porta la sicurezza nella pipeline'],['--file tfplan-lab.json','usa un artefatto sintetico','non richiede accesso al cloud'],['--checks ...','seleziona tre classi di misconfigurazione','rende la revisione focalizzata e verificabile'],['--offline','blocca dipendenze esterne','mantiene l’analisi riproducibile']],
    defense:'Blocca ingress pubblici non necessari, abilita cifratura, sostituisci wildcard con privilegi minimi e applica policy-as-code in CI.',
    nodes:[{name:'tfplan-lab.json',detail:'31 risorse',state:'active'},{name:'Security group',detail:'Da verificare',state:'risk'},{name:'Storage',detail:'Da verificare',state:'risk'},{name:'Cloud provider',detail:'Non contattato',state:'safe'}],
    afterNodes:[{name:'tfplan-lab.json',detail:'Audit completato',state:'owned'},{name:'Security group',detail:'Ingress pubblico',state:'risk'},{name:'Storage',detail:'Cifratura OFF',state:'risk'},{name:'Cloud provider',detail:'Mai contattato',state:'safe'}]
  }
];

const AUG18_DEFENSE = [
  {
    id:'def-wifi-rogue-detect',domain:'WI-FI E RILEVAMENTO',level:'Intermedio',title:'Rileva un access point non autorizzato',
    objective:'Confronta inventario e osservazioni sintetiche usando SSID, BSSID, sicurezza e canale.',
    story:'inventory-ap.json contiene gli AP autorizzati; observed-ap.json contiene una rilevazione sintetica. Devi aprire una review se nome simile e fingerprint non coincidono.',
    lesson:'Il solo SSID non identifica un access point. Una detection difensiva confronta più attributi e non tenta connessioni al dispositivo sospetto.',
    prompt:'defend$',task:'Scrivi la regola che confronta i due file su ssid,bssid,security,channel e apre review sui mismatch.',format:'Un comando defend wifi compare.',
    answer:'defend wifi compare --inventory inventory-ap.json --observed observed-ap.json --fields ssid,bssid,security,channel --on-mismatch review',
    tokens:['defend','wifi','compare','--inventory','inventory-ap.json','--observed','observed-ap.json','--fields','ssid','bssid','security','channel','--on-mismatch','review'],
    hints:['Usa defend wifi compare.','Indica inventory-ap.json, observed-ap.json e i quattro campi.','Codice completo: defend wifi compare --inventory inventory-ap.json --observed observed-ap.json --fields ssid,bssid,security,channel --on-mismatch review'],
    output:'[COMPARE] 4 AP autorizzati / 5 osservati\n[MISMATCH] LAB-STAFF BSSID sconosciuto security=WPA2\n[ACTION] review aperta; nessuna connessione eseguita\nFLAG{ROGUE_AP_REVIEW_OPENED}',
    explanation:[['wifi compare','confronta due inventari locali','rileva discrepanze senza interagire con reti'],['--inventory inventory-ap.json','definisce la baseline autorizzata','fornisce il riferimento atteso'],['--observed observed-ap.json','carica osservazioni sintetiche','separa telemetria e configurazione'],['--fields ssid,bssid,security,channel','usa più attributi','riduce conclusioni basate sul solo nome'],['--on-mismatch review','richiede verifica umana','evita azioni automatiche aggressive']],
    attackView:'Un AP che imita il nome della rete non viene considerato affidabile se fingerprint e sicurezza non corrispondono.',
    nodes:[{name:'Inventory',detail:'4 AP',state:'safe'},{name:'Observed',detail:'5 AP',state:'active'},{name:'LAB-STAFF?',detail:'Fingerprint diverso',state:'risk'},{name:'Client',detail:'Non connesso',state:'safe'}],
    afterNodes:[{name:'Inventory',detail:'Baseline usata',state:'safe'},{name:'Observed',detail:'Confrontato',state:'safe'},{name:'LAB-STAFF?',detail:'Review aperta',state:'risk'},{name:'Client',detail:'Nessuna connessione',state:'safe'}]
  },
  {
    id:'def-api-contract-validation',domain:'API E SECURE CODING',level:'Avanzato',title:'Applica un contratto di input all’API',
    objective:'Richiedi autenticazione, limiti di lunghezza e validazione dei campi per l’endpoint locale /api/orders.',
    story:'I test di integrazione mostrano payload troppo grandi e campi inattesi. Devi applicare una policy verificabile su localhost.',
    lesson:'La validazione server-side riduce ambiguità e superficie di errore. Autenticazione, schema e limiti devono essere testati automaticamente.',
    prompt:'defend$',task:'Scrivi il comando che applica auth required, schema OrderCreate, max-body 16kb e reject-unknown.',format:'Un comando defend api contract.',
    answer:'defend api contract --route /api/orders --auth required --schema OrderCreate --max-body 16kb --reject-unknown on',
    tokens:['defend','api','contract','--route','/api/orders','--auth','required','--schema','ordercreate','--max-body','16kb','--reject-unknown','on'],
    hints:['Inizia con defend api contract.','Definisci route, autenticazione, schema e dimensione massima.','Codice completo: defend api contract --route /api/orders --auth required --schema OrderCreate --max-body 16kb --reject-unknown on'],
    output:'[AUTH] required\n[SCHEMA] OrderCreate active\n[LIMIT] body <= 16kb\n[TEST] unknown field -> 400\n[TEST] unauthenticated -> 401\nFLAG{API_CONTRACT_ENFORCED}',
    explanation:[['api contract','definisce regole d’ingresso per una route','centralizza i controlli'],['--auth required','richiede identità valida','impedisce accesso anonimo alla funzione'],['--schema OrderCreate','accetta soltanto la struttura prevista','riduce input ambiguo'],['--max-body 16kb','limita la dimensione del payload','protegge risorse e parsing'],['--reject-unknown on','rifiuta campi non previsti','rende il contratto esplicito']],
    attackView:'Input fuori contratto viene rifiutato in modo coerente e i test impediscono regressioni.',
    nodes:[{name:'/api/orders',detail:'Contratto debole',state:'risk'},{name:'Auth',detail:'Da imporre',state:'risk'},{name:'Schema',detail:'Largo',state:'risk'},{name:'Test localhost',detail:'Pronti',state:'active'}],
    afterNodes:[{name:'/api/orders',detail:'Contratto attivo',state:'safe'},{name:'Auth',detail:'Required',state:'safe'},{name:'Schema',detail:'OrderCreate',state:'safe'},{name:'Test localhost',detail:'PASS',state:'active'}]
  },
  {
    id:'def-endpoint-allowlist-hash',domain:'ENDPOINT E INTEGRITÀ',level:'Esperto',title:'Verifica una allowlist con hash',
    objective:'Confronta i file demo con allowlist.json usando SHA-256 e genera un alert per artefatti non riconosciuti.',
    story:'La cartella demo-bin contiene artefatti sintetici. Devi controllarne l’integrità senza avviare processi, cancellare file o intervenire sul sistema operativo.',
    lesson:'Una allowlist basata su hash verifica contenuto e provenienza attesa. Il controllo può essere completamente passivo e produce evidenze ripetibili.',
    prompt:'defend$',task:'Scrivi il comando che verifica demo-bin contro allowlist.json con sha256 e apre alert per unknown o mismatch.',format:'Un comando defend endpoint allowlist.',
    answer:'defend endpoint allowlist --dir demo-bin --manifest allowlist.json --hash sha256 --on unknown,mismatch --action alert',
    tokens:['defend','endpoint','allowlist','--dir','demo-bin','--manifest','allowlist.json','--hash','sha256','--on','unknown','mismatch','--action','alert'],
    hints:['Usa defend endpoint allowlist.','Specifica demo-bin, allowlist.json e SHA-256.','Codice completo: defend endpoint allowlist --dir demo-bin --manifest allowlist.json --hash sha256 --on unknown,mismatch --action alert'],
    output:'[VERIFY] 12 artefatti\n[PASS] 11 hash riconosciuti\n[ALERT] helper-demo.bin hash mismatch\n[ACTION] segnalazione soltanto; nessun processo avviato o file modificato\nFLAG{ENDPOINT_INTEGRITY_CHECKED}',
    explanation:[['endpoint allowlist','confronta artefatti con una baseline locale','verifica integrità in modo passivo'],['--dir demo-bin','limita il controllo alla cartella demo','evita scansioni del sistema'],['--manifest allowlist.json','carica gli hash attesi','fornisce la baseline'],['--hash sha256','calcola impronte coerenti','permette confronto del contenuto'],['--action alert','genera solo una segnalazione','preserva file ed evidenze']],
    attackView:'Artefatti alterati o non approvati diventano visibili senza affidarsi al nome del file.',
    nodes:[{name:'demo-bin',detail:'12 artefatti',state:'active'},{name:'allowlist.json',detail:'Baseline',state:'safe'},{name:'helper-demo.bin',detail:'Da verificare',state:'risk'},{name:'Processi',detail:'Non avviati',state:'safe'}],
    afterNodes:[{name:'demo-bin',detail:'Verificata',state:'safe'},{name:'allowlist.json',detail:'Usata',state:'safe'},{name:'helper-demo.bin',detail:'Mismatch alert',state:'risk'},{name:'Processi',detail:'Zero esecuzioni',state:'safe'}]
  }
];

CYBERFORGE_ATTACK.splice(CYBERFORGE_ATTACK.length - 1,0,...AUG18_ATTACK);
CYBERFORGE_DEFENSE.splice(CYBERFORGE_DEFENSE.length - 1,0,...AUG18_DEFENSE);