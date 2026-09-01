// Safe September mission pack: all scenarios operate only on local synthetic files or localhost tests.
const SEP01_ATTACK = [
  {
    id:'atk-network-segmentation-review',domain:'RETI',level:'Base',title:'Revisiona la segmentazione da file locali',
    objective:'Confronta una topologia sintetica con la policy attesa e individua flussi troppo permissivi.',
    story:'Hai due file JSON locali. Non vengono inviati pacchetti e non vengono interrogati host.',
    lesson:'La segmentazione è verificabile confrontando flussi dichiarati e flussi consentiti in una rappresentazione offline.',
    prompt:'cyberlab$',task:'Riscrivi il comando che confronta topology-lab.json e segmentation-policy.json in modalità offline.',format:'Un comando cyberlab network segmentation-review.',
    answer:'cyberlab network segmentation-review --topology topology-lab.json --policy segmentation-policy.json --offline',
    tokens:['cyberlab','network','segmentation-review','--topology','topology-lab.json','--policy','segmentation-policy.json','--offline'],
    hints:['Inizia con cyberlab network segmentation-review.','Indica topologia e policy locali.','Codice completo: cyberlab network segmentation-review --topology topology-lab.json --policy segmentation-policy.json --offline'],
    output:'[OFFLINE] dati caricati\n[PASS] guest -> app: deny\n[WARN] guest -> db: regola troppo permissiva\n[PASS] app -> db: allow tcp/5432\n[NETWORK] zero traffico',
    explanation:[['network segmentation-review','confronta grafo e policy','evidenzia incoerenze senza usare la rete'],['--topology topology-lab.json','legge la topologia sintetica','non esegue discovery'],['--policy segmentation-policy.json','legge le regole attese','fornisce la baseline'],['--offline','forza analisi locale','impedisce traffico']],
    defense:'Usa deny-by-default tra zone, consenti solo i flussi necessari e valida le regole con test automatici.',
    nodes:[{name:'Guest',detail:'Zona demo',state:'active'},{name:'App',detail:'Zona demo',state:'active'},{name:'DB',detail:'Da verificare',state:'risk'}],
    afterNodes:[{name:'Guest → DB',detail:'Gap rilevato',state:'risk'},{name:'App → DB',detail:'Solo tcp/5432',state:'safe'},{name:'Rete reale',detail:'Non contattata',state:'safe'}]
  },
  {
    id:'atk-web-csp-review',domain:'WEB E SECURE CODING',level:'Intermedio',title:'Revisiona una Content Security Policy offline',
    objective:'Analizza un file di header sintetici e trova direttive CSP mancanti o troppo permissive.',
    story:'Il laboratorio contiene headers-lab.json. Non vengono aperti URL né browser.',
    lesson:'Le policy browser devono essere esplicite, minimali e testabili come qualsiasi altra configurazione di sicurezza.',
    prompt:'cyberlab$',task:'Riscrivi il comando che controlla default-src, script-src, object-src, frame-ancestors e base-uri.',format:'Un comando cyberlab web csp-review.',
    answer:'cyberlab web csp-review --file headers-lab.json --checks default-src,script-src,object-src,frame-ancestors,base-uri --mode static',
    tokens:['cyberlab','web','csp-review','--file','headers-lab.json','--checks','default-src','script-src','object-src','frame-ancestors','base-uri','--mode','static'],
    hints:['Inizia con cyberlab web csp-review.','Usa headers-lab.json e i cinque controlli.','Codice completo: cyberlab web csp-review --file headers-lab.json --checks default-src,script-src,object-src,frame-ancestors,base-uri --mode static'],
    output:'[STATIC] CSP caricata\n[WARN] script-src consente inline script\n[WARN] object-src mancante\n[WARN] frame-ancestors mancante\n[HTTP] zero richieste',
    explanation:[['web csp-review','analizza la CSP salvata','permette una review riproducibile'],['--file headers-lab.json','usa dati sintetici locali','non contatta server'],['--checks ...','verifica direttive specifiche','rende il controllo deterministico'],['--mode static','esegue solo parsing','mantiene il test offline']],
    defense:'Definisci una CSP restrittiva, elimina inline script non necessari e aggiungi test automatici sugli header.',
    nodes:[{name:'CSP',detail:'Configurazione demo',state:'active'},{name:'script-src',detail:'Da verificare',state:'risk'},{name:'frame-ancestors',detail:'Da verificare',state:'risk'}],
    afterNodes:[{name:'script-src',detail:'Troppo permissivo',state:'risk'},{name:'object-src',detail:'Mancante',state:'risk'},{name:'HTTP',detail:'Zero richieste',state:'safe'}]
  },
  {
    id:'atk-cloud-iam-review',domain:'CLOUD, IDENTITA E AUTORIZZAZIONE',level:'Avanzato',title:'Calcola i privilegi effettivi da policy sintetiche',
    objective:'Confronta ruoli e boundary locali con una baseline least-privilege.',
    story:'iam-lab.json contiene solo identità e policy inventate. Nessun provider cloud viene contattato.',
    lesson:'Nel cloud i privilegi effettivi derivano dalla combinazione di più policy; la review deve confrontarli con una baseline minima.',
    prompt:'cyberlab$',task:'Riscrivi il comando che confronta iam-lab.json e least-privilege.json cercando wildcard, azioni inutilizzate e boundary mancanti.',format:'Un comando cyberlab cloud iam-review.',
    answer:'cyberlab cloud iam-review --iam iam-lab.json --baseline least-privilege.json --checks wildcard,unused-actions,boundary --offline',
    tokens:['cyberlab','cloud','iam-review','--iam','iam-lab.json','--baseline','least-privilege.json','--checks','wildcard','unused-actions','boundary','--offline'],
    hints:['Inizia con cyberlab cloud iam-review.','Confronta IAM demo e baseline.','Codice completo: cyberlab cloud iam-review --iam iam-lab.json --baseline least-privilege.json --checks wildcard,unused-actions,boundary --offline'],
    output:'[OFFLINE] policy sintetiche caricate\n[WARN] build-role: wildcard oltre baseline\n[WARN] analyst-role: azioni non necessarie\n[WARN] permission boundary assente\n[CLOUD] zero API chiamate',
    explanation:[['cloud iam-review','calcola permessi da file locali','spiega il privilegio effettivo'],['--iam iam-lab.json','carica ruoli sintetici','non usa account reali'],['--baseline least-privilege.json','definisce i permessi minimi','consente il confronto'],['--checks ...','cerca eccessi e boundary mancanti','copre governance autorizzativa'],['--offline','esclude API cloud','mantiene il laboratorio locale']],
    defense:'Riduci i permessi al minimo necessario, evita wildcard non necessarie e valida le policy con test positivi e negativi.',
    nodes:[{name:'IAM',detail:'Dataset locale',state:'active'},{name:'Baseline',detail:'Least privilege',state:'active'},{name:'Boundary',detail:'Da verificare',state:'risk'}],
    afterNodes:[{name:'build-role',detail:'Permessi eccessivi',state:'risk'},{name:'Boundary',detail:'Mancante',state:'risk'},{name:'Cloud API',detail:'Non usata',state:'safe'}]
  }
];

const SEP01_DEFENSE = [
  {
    id:'def-network-segmentation-tests',domain:'RETI',level:'Intermedio',title:'Trasforma la segmentazione in test automatici',
    objective:'Imposta deny-by-default e verifica i soli flussi richiesti usando file locali.',
    story:'La review ha trovato una regola guest-to-db troppo permissiva. Devi correggere solo la policy demo.',
    lesson:'Le regole di rete sono più affidabili quando ogni eccezione è esplicita e coperta da test.',
    prompt:'defend$',task:'Riscrivi il comando che imposta default deny, nega guest-to-db e consente app-to-db tcp/5432 in modalità test.',format:'Un comando defend network segmentation.',
    answer:'defend network segmentation --policy segmentation-policy.json --default deny --deny guest-to-db --allow app-to-db:tcp/5432 --mode test',
    tokens:['defend','network','segmentation','--policy','segmentation-policy.json','--default','deny','--deny','guest-to-db','--allow','app-to-db','tcp/5432','--mode','test'],
    hints:['Inizia con defend network segmentation.','Imposta default deny e il flusso consentito.','Codice completo: defend network segmentation --policy segmentation-policy.json --default deny --deny guest-to-db --allow app-to-db:tcp/5432 --mode test'],
    output:'[POLICY] default=deny\n[TEST] guest -> db: DENY PASS\n[TEST] app -> db tcp/5432: ALLOW PASS\n[RESULT] baseline valida',
    explanation:[['network segmentation','modifica solo la policy demo','non configura apparati reali'],['--default deny','nega ciò che non è dichiarato','riduce esposizioni accidentali'],['--deny guest-to-db','blocca il flusso non richiesto','rende esplicito il confine'],['--allow app-to-db:tcp/5432','consente solo il servizio necessario','applica least privilege'],['--mode test','esegue test locali','previene regressioni']],
    attackView:'I test locali confermano che la zona guest non può raggiungere il database nel modello sintetico.',
    nodes:[{name:'Default',detail:'Da correggere',state:'risk'},{name:'Guest → DB',detail:'Da bloccare',state:'risk'}],
    afterNodes:[{name:'Default',detail:'Deny',state:'safe'},{name:'Guest → DB',detail:'Bloccato',state:'safe'},{name:'App → DB',detail:'Solo 5432',state:'safe'}]
  },
  {
    id:'def-web-csp-tests',domain:'WEB E SECURE CODING',level:'Avanzato',title:'Applica una CSP verificabile',
    objective:'Costruisci una baseline CSP locale e validala con test automatici su localhost.',
    story:'La review ha trovato direttive mancanti. Devi rendere la configurazione esplicita e versionabile.',
    lesson:'Gli header di sicurezza vanno trattati come codice: revisionati, versionati e coperti da regressioni automatiche.',
    prompt:'defend$',task:'Riscrivi il comando che imposta default-src self, script-src self, object-src none, frame-ancestors none e base-uri self.',format:'Un comando defend web csp-baseline.',
    answer:'defend web csp-baseline --file headers-lab.json --default-src self --script-src self --object-src none --frame-ancestors none --base-uri self --mode test',
    tokens:['defend','web','csp-baseline','--file','headers-lab.json','--default-src','self','--script-src','self','--object-src','none','--frame-ancestors','none','--base-uri','self','--mode','test'],
    hints:['Inizia con defend web csp-baseline.','Imposta object-src e frame-ancestors a none.','Codice completo: defend web csp-baseline --file headers-lab.json --default-src self --script-src self --object-src none --frame-ancestors none --base-uri self --mode test'],
    output:'[CSP] baseline applicata al file locale\n[TEST] direttive obbligatorie: PASS\n[TEST] localhost headers: PASS',
    explanation:[['web csp-baseline','genera la policy demo','centralizza i requisiti'],['--default-src self','stabilisce un default restrittivo','riduce fallback permissivi'],['--script-src self','limita gli script previsti','evita inline non necessario'],['--object-src none','disabilita object','riduce superfici legacy'],['--frame-ancestors none','impedisce framing nella demo','rafforza l’interfaccia'],['--base-uri self','limita il base URL','rende la policy esplicita'],['--mode test','valida localmente','previene regressioni']],
    attackView:'I test falliscono se una direttiva richiesta viene rimossa o resa più permissiva.',
    nodes:[{name:'CSP',detail:'Incompleta',state:'risk'},{name:'Tests',detail:'Assenti',state:'risk'}],
    afterNodes:[{name:'CSP',detail:'Baseline esplicita',state:'safe'},{name:'Tests',detail:'PASS',state:'safe'}]
  },
  {
    id:'def-cloud-iam-least-privilege-tests',domain:'CLOUD, IDENTITA E AUTORIZZAZIONE',level:'Esperto',title:'Applica least privilege e test di regressione',
    objective:'Riduci un ruolo sintetico alla baseline minima e aggiungi controlli allow/deny.',
    story:'La review IAM ha trovato permessi eccedenti. Devi correggere solo file locali e test.',
    lesson:'Least privilege richiede una baseline minima e test negativi che impediscano di reintrodurre permessi non previsti.',
    prompt:'defend$',task:'Riscrivi il comando che minimizza build-role, applica BuildBoundary e verifica allow-required, deny-extra e wildcard-free.',format:'Un comando defend cloud iam-baseline.',
    answer:'defend cloud iam-baseline --iam iam-lab.json --role build-role --boundary BuildBoundary --checks allow-required,deny-extra,wildcard-free --mode test',
    tokens:['defend','cloud','iam-baseline','--iam','iam-lab.json','--role','build-role','--boundary','buildboundary','--checks','allow-required','deny-extra','wildcard-free','--mode','test'],
    hints:['Inizia con defend cloud iam-baseline.','Seleziona build-role e BuildBoundary.','Codice completo: defend cloud iam-baseline --iam iam-lab.json --role build-role --boundary BuildBoundary --checks allow-required,deny-extra,wildcard-free --mode test'],
    output:'[POLICY] build-role minimizzato\n[BOUNDARY] BuildBoundary applicata al dataset\n[TEST] required actions: ALLOW PASS\n[TEST] extra action: DENY PASS\n[TEST] wildcard: NONE PASS',
    explanation:[['cloud iam-baseline','modifica solo il dataset IAM demo','non cambia account reali'],['--role build-role','seleziona un ruolo sintetico','mantiene lo scope ristretto'],['--boundary BuildBoundary','applica un limite massimo locale','mostra defense-in-depth'],['--checks ...','verifica permessi richiesti, extra e wildcard','copre regressioni positive e negative'],['--mode test','esegue soltanto test locali','non usa credenziali cloud']],
    attackView:'I test sintetici rifiutano automaticamente permessi fuori baseline.',
    nodes:[{name:'build-role',detail:'Permessi larghi',state:'risk'},{name:'Boundary',detail:'Assente',state:'risk'}],
    afterNodes:[{name:'build-role',detail:'Minimizzato',state:'safe'},{name:'Boundary',detail:'Applicata',state:'safe'},{name:'Tests',detail:'PASS',state:'safe'}]
  }
];

for (const scenario of SEP01_ATTACK) {
  if (!CYBERFORGE_ATTACK.some(existing => existing.id === scenario.id)) CYBERFORGE_ATTACK.push(scenario);
}
for (const scenario of SEP01_DEFENSE) {
  if (!CYBERFORGE_DEFENSE.some(existing => existing.id === scenario.id)) CYBERFORGE_DEFENSE.push(scenario);
}
