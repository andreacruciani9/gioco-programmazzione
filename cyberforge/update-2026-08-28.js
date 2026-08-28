const AUG28_ATTACK = [
  {
    id:'atk-wifi-enterprise-config-audit',domain:'RETI E WI-FI',level:'Intermedio',title:'Revisiona una configurazione Wi-Fi enterprise offline',
    objective:'Analizza wifi-enterprise-lab.json e individua cifratura debole, PMF opzionale e validazione del server RADIUS incompleta.',
    story:'Il laboratorio contiene una configurazione Wi-Fi sintetica esportata da un ambiente di test. Devi valutarla senza usare interfacce radio, scansioni o reti reali.',
    lesson:'Una review Wi-Fi sicura può verificare policy e configurazioni offline. WPA3-Enterprise, Protected Management Frames e validazione corretta del certificato RADIUS riducono downgrade e connessioni a infrastrutture non attese.',
    prompt:'cyberlab$',task:'Scrivi il comando che revisiona wifi-enterprise-lab.json per encryption,pmf,radius-cert in modalità offline.',format:'Un comando cyberlab wifi config-review.',
    answer:'cyberlab wifi config-review --file wifi-enterprise-lab.json --checks encryption,pmf,radius-cert --offline',
    tokens:['cyberlab','wifi','config-review','--file','wifi-enterprise-lab.json','--checks','encryption','pmf','radius-cert','--offline'],
    hints:['Inizia con cyberlab wifi config-review.','Usa il file locale e i controlli encryption,pmf,radius-cert.','Codice completo: cyberlab wifi config-review --file wifi-enterprise-lab.json --checks encryption,pmf,radius-cert --offline'],
    output:'[OFFLINE] configurazione caricata\n[WARN] encryption=WPA2-Enterprise\n[HIGH] pmf=optional\n[HIGH] radiusServerNameValidation=false\n[RADIO] nessuna interfaccia utilizzata\nFLAG{WIFI_POLICY_REVIEWED}',
    explanation:[['wifi config-review','avvia una revisione statica della configurazione Wi-Fi','permette di studiare hardening senza interagire con reti'],['--file wifi-enterprise-lab.json','legge soltanto il dataset sintetico locale','mantiene l’attività nel laboratorio'],['--checks encryption,pmf,radius-cert','controlla cifratura, frame management e trust del server','copre tre confini di sicurezza distinti'],['--offline','impedisce scansioni e connessioni','garantisce zero traffico radio o IP']],
    defense:'Preferisci WPA3-Enterprise quando supportato, richiedi PMF, valida nome e catena del certificato RADIUS e distribuisci profili gestiti ai client.',
    nodes:[{name:'wifi-enterprise-lab.json',detail:'Config locale',state:'active'},{name:'Encryption',detail:'Da verificare',state:'risk'},{name:'PMF',detail:'Da verificare',state:'risk'},{name:'Radio',detail:'Non utilizzata',state:'safe'}],
    afterNodes:[{name:'Encryption',detail:'WPA2 rilevato',state:'risk'},{name:'PMF',detail:'Optional',state:'risk'},{name:'RADIUS trust',detail:'Incompleto',state:'risk'},{name:'Radio',detail:'Zero scansioni',state:'safe'}]
  },
  {
    id:'atk-api-object-authz-matrix',domain:'API E AUTORIZZAZIONE',level:'Avanzato',title:'Trova un buco di autorizzazione object-level',
    objective:'Confronta openapi-lab.json e authz-matrix.json per trovare endpoint che verificano il ruolo ma non la relazione tra utente e risorsa.',
    story:'Hai solo contratti API e policy sintetiche locali. Devi individuare incoerenze di autorizzazione senza inviare richieste HTTP.',
    lesson:'L’autorizzazione object-level deve verificare sia chi è il chiamante sia se può operare proprio su quella risorsa. Una matrice di policy e test negativi evita che il solo possesso di un ID sia sufficiente.',
    prompt:'cyberlab$',task:'Scrivi il comando che confronta contratto e matrice per owner-check,tenant-boundary,negative-tests in modalità static.',format:'Un comando cyberlab api authz-review.',
    answer:'cyberlab api authz-review --contract openapi-lab.json --policy authz-matrix.json --checks owner-check,tenant-boundary,negative-tests --mode static',
    tokens:['cyberlab','api','authz-review','--contract','openapi-lab.json','--policy','authz-matrix.json','--checks','owner-check','tenant-boundary','negative-tests','--mode','static'],
    hints:['Usa cyberlab api authz-review.','Confronta openapi-lab.json con authz-matrix.json.','Codice completo: cyberlab api authz-review --contract openapi-lab.json --policy authz-matrix.json --checks owner-check,tenant-boundary,negative-tests --mode static'],
    output:'[STATIC] contratto e policy caricati\n[HIGH] GET /projects/{id}: owner-check assente\n[HIGH] PUT /projects/{id}: tenant-boundary non esplicito\n[WARN] test negativo cross-tenant mancante\n[HTTP] zero richieste inviate\nFLAG{OBJECT_AUTHZ_GAP_FOUND}',
    explanation:[['api authz-review','confronta contratto e regole di autorizzazione','rende visibili controlli mancanti'],['--contract openapi-lab.json','usa il contratto API locale','non contatta endpoint'],['--policy authz-matrix.json','carica la matrice di accesso sintetica','definisce chi può fare cosa'],['--checks owner-check,tenant-boundary,negative-tests','verifica ownership, isolamento tenant e test di diniego','copre i casi più importanti di object authorization'],['--mode static','esegue soltanto analisi locale','mantiene il laboratorio non operativo']],
    defense:'Applica controlli server-side su owner/tenant per ogni oggetto, usa deny-by-default e aggiungi test automatici che provino accessi a risorse di altri utenti o tenant con dati sintetici.',
    nodes:[{name:'OpenAPI',detail:'Contratto locale',state:'active'},{name:'AuthZ matrix',detail:'Policy locale',state:'active'},{name:'Owner check',detail:'Da verificare',state:'risk'},{name:'HTTP',detail:'Non usato',state:'safe'}],
    afterNodes:[{name:'GET project',detail:'Owner check mancante',state:'risk'},{name:'PUT project',detail:'Tenant gap',state:'risk'},{name:'Negative tests',detail:'Incompleti',state:'risk'},{name:'HTTP',detail:'Zero richieste',state:'safe'}]
  },
  {
    id:'atk-ir-telemetry-gap-analysis',domain:'LOG, INCIDENT RESPONSE E ANTI-EVASIONE',level:'Esperto',title:'Individua buchi nella telemetria di un incidente',
    objective:'Analizza eventi sintetici provenienti da endpoint, identity e API e rileva intervalli sospetti in cui una sorgente smette di riportare dati mentre le altre continuano.',
    story:'Un incidente simulato contiene tre file JSONL locali. Non devi attribuire un’identità né ricostruire tecniche di occultamento: devi solo riconoscere perdita di visibilità e preservare le evidenze.',
    lesson:'Il rilevamento anti-evasione difensivo non insegna a evitare i controlli: confronta sorgenti indipendenti, segnala silenzi anomali e conserva gli originali per la revisione umana.',
    prompt:'cyberlab$',task:'Scrivi il comando che correla endpoint.jsonl,identity.jsonl,api.jsonl e segnala source-silence e sequence-gap preservando gli originali.',format:'Un comando cyberlab ir telemetry-review.',
    answer:'cyberlab ir telemetry-review --inputs endpoint.jsonl,identity.jsonl,api.jsonl --checks source-silence,sequence-gap --preserve-originals --offline',
    tokens:['cyberlab','ir','telemetry-review','--inputs','endpoint.jsonl','identity.jsonl','api.jsonl','--checks','source-silence','sequence-gap','--preserve-originals','--offline'],
    hints:['Inizia con cyberlab ir telemetry-review.','Inserisci le tre sorgenti e i controlli source-silence,sequence-gap.','Codice completo: cyberlab ir telemetry-review --inputs endpoint.jsonl,identity.jsonl,api.jsonl --checks source-silence,sequence-gap --preserve-originals --offline'],
    output:'[OFFLINE] 3 sorgenti caricate\n[ALERT] endpoint telemetry silence: 09:14-09:19Z\n[INFO] identity e API continuano nello stesso intervallo\n[EVIDENCE] originali invariati; copie di lavoro create\n[DECISION] escalation a revisione umana\nFLAG{TELEMETRY_GAP_CORRELATED}',
    explanation:[['ir telemetry-review','correla più fonti di telemetria','riduce la dipendenza da una singola sorgente'],['--inputs ...','usa esclusivamente file sintetici locali','mantiene l’analisi riproducibile'],['--checks source-silence,sequence-gap','cerca assenze e discontinuità temporali','rileva perdita di visibilità senza spiegare come causarla'],['--preserve-originals','mantiene immutati i file sorgente','protegge l’integrità delle evidenze'],['--offline','esclude servizi esterni','mantiene l’incidente interamente simulato']],
    defense:'Usa telemetria ridondante, heartbeat firmati o verificabili, alert sui silenzi delle sorgenti, sincronizzazione temporale e procedure di preservazione con hash e copie read-only.',
    nodes:[{name:'Endpoint log',detail:'Sorgente sintetica',state:'active'},{name:'Identity log',detail:'Sorgente sintetica',state:'active'},{name:'API log',detail:'Sorgente sintetica',state:'active'},{name:'Evidence',detail:'Originali',state:'safe'}],
    afterNodes:[{name:'Endpoint log',detail:'Gap rilevato',state:'risk'},{name:'Identity log',detail:'Continuo',state:'safe'},{name:'API log',detail:'Continuo',state:'safe'},{name:'Evidence',detail:'Preservata',state:'safe'}]
  }
];

const AUG28_DEFENSE = [
  {
    id:'def-wifi-enterprise-baseline',domain:'RETI E WI-FI',level:'Avanzato',title:'Applica una baseline Wi-Fi enterprise',
    objective:'Imposta una policy sintetica con WPA3-Enterprise, PMF required e validazione stretta del certificato RADIUS.',
    story:'La review offline ha trovato controlli incompleti. Devi trasformare la configurazione locale in una baseline verificabile senza usare una scheda Wi-Fi.',
    lesson:'Profili gestiti e trust esplicito riducono errori di configurazione. La baseline deve essere testabile prima della distribuzione.',
    prompt:'defend$',task:'Scrivi il comando che imposta WPA3-Enterprise, PMF required e valida server-name e CA del RADIUS nel file locale.',format:'Un comando defend wifi baseline.',
    answer:'defend wifi baseline --file wifi-enterprise-lab.json --security wpa3-enterprise --pmf required --radius-server-name radius.lab.local --radius-ca LabRootCA --mode static',
    tokens:['defend','wifi','baseline','--file','wifi-enterprise-lab.json','--security','wpa3-enterprise','--pmf','required','--radius-server-name','radius.lab.local','--radius-ca','labrootca','--mode','static'],
    hints:['Usa defend wifi baseline.','Imposta wpa3-enterprise e pmf required.','Codice completo: defend wifi baseline --file wifi-enterprise-lab.json --security wpa3-enterprise --pmf required --radius-server-name radius.lab.local --radius-ca LabRootCA --mode static'],
    output:'[SECURITY] WPA3-Enterprise\n[PMF] required\n[RADIUS] server-name e CA espliciti\n[MODE] static validation only\nFLAG{WIFI_BASELINE_APPLIED}',
    explanation:[['wifi baseline','definisce una policy Wi-Fi locale','rende il requisito ripetibile'],['--security wpa3-enterprise','seleziona una baseline moderna nel laboratorio','rafforza la cifratura configurata'],['--pmf required','rende obbligatoria la protezione dei management frame','riduce una classe di abusi sul piano di gestione'],['--radius-server-name ...','vincola il nome atteso del server','evita trust generico'],['--radius-ca LabRootCA','vincola la CA del laboratorio','rende esplicita la catena fidata'],['--mode static','non applica la configurazione a dispositivi','mantiene il test sicuro']],
    attackView:'Il profilo demo accetta solo la configurazione attesa e fallisce i test quando PMF o trust RADIUS vengono indeboliti.',
    nodes:[{name:'Security',detail:'Legacy',state:'risk'},{name:'PMF',detail:'Optional',state:'risk'},{name:'RADIUS',detail:'Trust largo',state:'risk'},{name:'Device',detail:'Non modificato',state:'safe'}],
    afterNodes:[{name:'Security',detail:'WPA3-Enterprise',state:'safe'},{name:'PMF',detail:'Required',state:'safe'},{name:'RADIUS',detail:'Trust esplicito',state:'safe'},{name:'Device',detail:'Solo test statico',state:'safe'}]
  },
  {
    id:'def-api-object-authz-policy',domain:'API E AUTORIZZAZIONE',level:'Esperto',title:'Implementa object authorization deny-by-default',
    objective:'Definisci una policy che richiede tenant e owner corretti e aggiungi test negativi cross-user e cross-tenant.',
    story:'Il contratto locale contiene endpoint con controllo ruolo insufficiente. Devi introdurre una regola esplicita per la singola risorsa.',
    lesson:'Il ruolo da solo non basta per decidere l’accesso a un oggetto. Ownership, tenant e policy server-side devono essere verificati insieme e coperti da test di diniego.',
    prompt:'defend$',task:'Scrivi il comando che richiede tenant-match e owner-or-admin, deny-by-default e test negativi cross-user,cross-tenant.',format:'Un comando defend api object-authz.',
    answer:'defend api object-authz --resource Project --require tenant-match,owner-or-admin --default deny --negative-tests cross-user,cross-tenant --mode test',
    tokens:['defend','api','object-authz','--resource','project','--require','tenant-match','owner-or-admin','--default','deny','--negative-tests','cross-user','cross-tenant','--mode','test'],
    hints:['Inizia con defend api object-authz.','Richiedi tenant-match,owner-or-admin e default deny.','Codice completo: defend api object-authz --resource Project --require tenant-match,owner-or-admin --default deny --negative-tests cross-user,cross-tenant --mode test'],
    output:'[POLICY] Project: tenant-match AND owner-or-admin\n[DEFAULT] deny\n[TEST] cross-user -> 403 PASS\n[TEST] cross-tenant -> 403 PASS\nFLAG{OBJECT_AUTHZ_ENFORCED}',
    explanation:[['api object-authz','definisce una policy per la singola risorsa','porta l’autorizzazione vicino al dato protetto'],['--resource Project','seleziona il tipo di oggetto del laboratorio','rende la policy esplicita'],['--require tenant-match,owner-or-admin','richiede confine tenant e relazione con la risorsa','impedisce che un ID sia sufficiente'],['--default deny','nega quando nessuna regola autorizza','applica deny-by-default'],['--negative-tests cross-user,cross-tenant','verifica scenari di diniego sintetici','previene regressioni']],
    attackView:'I test locali mostrano che conoscere un ID appartenente a un altro utente o tenant non concede accesso.',
    nodes:[{name:'Project policy',detail:'Incompleta',state:'risk'},{name:'Tenant check',detail:'Mancante',state:'risk'},{name:'Owner check',detail:'Mancante',state:'risk'},{name:'Tests',detail:'Parziali',state:'active'}],
    afterNodes:[{name:'Project policy',detail:'Deny-by-default',state:'safe'},{name:'Tenant check',detail:'Required',state:'safe'},{name:'Owner check',detail:'Required',state:'safe'},{name:'Tests',detail:'Negativi PASS',state:'safe'}]
  },
  {
    id:'def-ir-resilient-evidence-bundle',domain:'INCIDENT RESPONSE, EVIDENZE E ANTI-EVASIONE',level:'Pro',title:'Crea un bundle di evidenze resiliente',
    objective:'Genera copie di lavoro, hash SHA-256 e manifest append-only per tre sorgenti sintetiche, poi verifica che eventuali gap di telemetria restino evidenti.',
    story:'Hai rilevato un intervallo con telemetria endpoint assente. Devi preservare gli originali e costruire un pacchetto verificabile per l’analisi successiva.',
    lesson:'Una risposta agli incidenti robusta separa originali e copie di lavoro, calcola digest, registra tempi e provenienza e usa più sorgenti per evitare che la perdita di una sola telemetria renda invisibile l’evento.',
    prompt:'defend$',task:'Scrivi il comando che crea copie read-only, manifest SHA-256, timeline UTC e controllo cross-source-gap per i tre file locali.',format:'Un comando defend ir evidence-bundle.',
    answer:'defend ir evidence-bundle --inputs endpoint.jsonl,identity.jsonl,api.jsonl --copies read-only --hash sha256 --timeline utc --check cross-source-gap --offline',
    tokens:['defend','ir','evidence-bundle','--inputs','endpoint.jsonl','identity.jsonl','api.jsonl','--copies','read-only','--hash','sha256','--timeline','utc','--check','cross-source-gap','--offline'],
    hints:['Usa defend ir evidence-bundle.','Richiedi copie read-only, hash sha256 e timeline utc.','Codice completo: defend ir evidence-bundle --inputs endpoint.jsonl,identity.jsonl,api.jsonl --copies read-only --hash sha256 --timeline utc --check cross-source-gap --offline'],
    output:'[EVIDENCE] originali non modificati\n[COPIES] 3 copie read-only create\n[HASH] SHA-256 manifest completato\n[TIMELINE] UTC normalizzata\n[DETECTION] cross-source gap preserved as finding\nFLAG{RESILIENT_EVIDENCE_BUNDLE_READY}',
    explanation:[['ir evidence-bundle','crea un pacchetto di analisi verificabile','struttura la catena di custodia'],['--inputs ...','seleziona soltanto sorgenti sintetiche locali','mantiene il perimetro controllato'],['--copies read-only','separa le copie di lavoro dagli originali','riduce modifiche accidentali'],['--hash sha256','calcola digest per ogni file','permette verifiche di integrità'],['--timeline utc','normalizza i timestamp','facilita la correlazione'],['--check cross-source-gap','mantiene il gap come finding difensivo','supporta rilevamento anti-evasione senza insegnare elusione'],['--offline','non invia dati fuori dal laboratorio','protegge privacy e perimetro']],
    attackView:'La perdita di una singola sorgente non cancella il segnale: il confronto con identity e API mantiene visibile il gap e le evidenze restano verificabili.',
    nodes:[{name:'Originals',detail:'Da preservare',state:'active'},{name:'Working copies',detail:'Da creare',state:'active'},{name:'Manifest',detail:'Assente',state:'risk'},{name:'Timeline',detail:'Da correlare',state:'active'}],
    afterNodes:[{name:'Originals',detail:'Immutati',state:'safe'},{name:'Working copies',detail:'Read-only',state:'safe'},{name:'Manifest',detail:'SHA-256',state:'safe'},{name:'Timeline',detail:'UTC correlata',state:'safe'}]
  }
];

function appendAug28Unique(target, incoming){
  const ids = new Set(target.map(item => item.id));
  incoming.forEach(item => { if(!ids.has(item.id)){ target.push(item); ids.add(item.id); } });
}

if (typeof CYBERFORGE_ATTACK !== 'undefined') appendAug28Unique(CYBERFORGE_ATTACK, AUG28_ATTACK);
if (typeof CYBERFORGE_DEFENSE !== 'undefined') appendAug28Unique(CYBERFORGE_DEFENSE, AUG28_DEFENSE);
