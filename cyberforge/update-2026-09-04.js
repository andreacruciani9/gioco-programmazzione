// Safe mission pack 2026-09-04: local files, synthetic data and localhost-only tests.
const SEP04_ATTACK = [
  {
    id:'atk-api-replay-review',domain:'API, IDENTITA E AUTORIZZAZIONE',level:'Intermedio',title:'Rileva richieste duplicate da log sintetici',
    objective:'Analizza un file JSONL locale e individua richieste mutate ripetute con lo stesso idempotency key o request id.',
    story:'Il laboratorio contiene api-requests-lab.jsonl con eventi inventati. Non viene inviata alcuna richiesta HTTP.',
    lesson:'Le API che modificano stato devono distinguere retry legittimi da duplicazioni e replay, usando identificatori verificabili e finestre temporali coerenti.',
    prompt:'cyberlab$',task:'Riscrivi il comando che analizza api-requests-lab.jsonl per duplicati di request-id e idempotency-key in modalità offline.',format:'Un comando cyberlab api replay-review.',
    answer:'cyberlab api replay-review --log api-requests-lab.jsonl --keys request-id,idempotency-key --window 5m --offline',
    tokens:['cyberlab','api','replay-review','--log','api-requests-lab.jsonl','--keys','request-id','idempotency-key','--window','5m','--offline'],
    hints:['Inizia con cyberlab api replay-review.','Usa il file JSONL locale e controlla request-id e idempotency-key.','Codice completo: cyberlab api replay-review --log api-requests-lab.jsonl --keys request-id,idempotency-key --window 5m --offline'],
    output:'[OFFLINE] 14 eventi sintetici caricati\n[PASS] request-id univoci: 12\n[WARN] idempotency-key DEMO-42 ripetuta 2 volte entro 41s\n[HTTP] zero richieste inviate',
    explanation:[['api replay-review','correla richieste duplicate','lavora su telemetria esportata'],['--log api-requests-lab.jsonl','legge solo eventi locali','non interroga servizi'],['--keys ...','definisce gli identificatori da confrontare','riduce falsi positivi'],['--window 5m','limita la correlazione temporale','distingue eventi lontani'],['--offline','blocca ogni dipendenza di rete','mantiene il laboratorio isolato']],
    defense:'Per operazioni mutanti usa idempotency key robuste, associa la chiave all’identità e al payload, scadala in modo controllato e testa i retry.',
    nodes:[{name:'API log',detail:'Dataset sintetico',state:'active'},{name:'Idempotency',detail:'Da verificare',state:'risk'}],
    afterNodes:[{name:'DEMO-42',detail:'Duplicato rilevato',state:'risk'},{name:'Rete',detail:'Non usata',state:'safe'}]
  },
  {
    id:'atk-cloud-storage-policy-review',domain:'CLOUD E PRIVACY',level:'Avanzato',title:'Revisiona esposizione storage da configurazioni locali',
    objective:'Controlla policy sintetiche di object storage e trova accessi pubblici, wildcard e cifratura mancante.',
    story:'storage-lab.json rappresenta bucket inventati. Nessun SDK o account cloud viene utilizzato.',
    lesson:'Una review cloud può essere eseguita prima del deploy, trattando policy e configurazioni come codice e confrontandole con una baseline privata.',
    prompt:'cyberlab$',task:'Riscrivi il comando che controlla public-access, wildcard-principal, encryption e retention nel file storage-lab.json.',format:'Un comando cyberlab cloud storage-review.',
    answer:'cyberlab cloud storage-review --file storage-lab.json --checks public-access,wildcard-principal,encryption,retention --offline',
    tokens:['cyberlab','cloud','storage-review','--file','storage-lab.json','--checks','public-access','wildcard-principal','encryption','retention','--offline'],
    hints:['Inizia con cyberlab cloud storage-review.','Passa storage-lab.json e i quattro controlli richiesti.','Codice completo: cyberlab cloud storage-review --file storage-lab.json --checks public-access,wildcard-principal,encryption,retention --offline'],
    output:'[OFFLINE] 3 storage policy caricate\n[WARN] demo-assets: accesso pubblico abilitato\n[WARN] audit-archive: retention non definita\n[PASS] pii-backup: privato + cifrato\n[CLOUD] zero API chiamate',
    explanation:[['cloud storage-review','analizza configurazioni di storage','anticipa errori prima del deploy'],['--file storage-lab.json','usa dati sintetici locali','non richiede credenziali'],['--checks ...','verifica esposizione e protezioni','copre riservatezza e conservazione'],['--offline','esclude SDK e API cloud','rende il test riproducibile']],
    defense:'Imposta private-by-default, blocco dell’accesso pubblico, cifratura, principal espliciti e retention coerente con requisiti legittimi di conservazione.',
    nodes:[{name:'demo-assets',detail:'Policy demo',state:'risk'},{name:'pii-backup',detail:'Privato',state:'safe'}],
    afterNodes:[{name:'Public access',detail:'Gap rilevato',state:'risk'},{name:'Cloud API',detail:'Non usata',state:'safe'}]
  },
  {
    id:'atk-endpoint-startup-integrity-review',domain:'ENDPOINT, LOG E ANTI-EVASIONE',level:'Esperto',title:'Trova anomalie di avvio da inventario firmato',
    objective:'Confronta un inventario sintetico di elementi di avvio con una baseline hash e publisher senza eseguire file.',
    story:'startup-lab.json e startup-baseline.json contengono solo percorsi, hash e publisher inventati. Nessun binario viene avviato.',
    lesson:'Il rilevamento anti-evasione difensivo deve correlare integrità, provenienza e cambiamenti di configurazione senza insegnare come nascondere attività.',
    prompt:'cyberlab$',task:'Riscrivi il comando che confronta inventario e baseline verificando hash, publisher, nuovi elementi e telemetria mancante.',format:'Un comando cyberlab endpoint startup-integrity.',
    answer:'cyberlab endpoint startup-integrity --inventory startup-lab.json --baseline startup-baseline.json --checks hash,publisher,new-entry,telemetry-gap --offline',
    tokens:['cyberlab','endpoint','startup-integrity','--inventory','startup-lab.json','--baseline','startup-baseline.json','--checks','hash','publisher','new-entry','telemetry-gap','--offline'],
    hints:['Inizia con cyberlab endpoint startup-integrity.','Confronta inventario e baseline usando i quattro controlli.','Codice completo: cyberlab endpoint startup-integrity --inventory startup-lab.json --baseline startup-baseline.json --checks hash,publisher,new-entry,telemetry-gap --offline'],
    output:'[OFFLINE] baseline caricata\n[WARN] updater-demo: hash differente dalla baseline\n[WARN] helper-demo: nuovo elemento non approvato\n[WARN] host-03: telemetria startup assente\n[EXEC] zero file avviati',
    explanation:[['endpoint startup-integrity','confronta lo stato dichiarato','supporta detection basata su integrità'],['--inventory startup-lab.json','carica l’inventario sintetico','non enumera endpoint reali'],['--baseline startup-baseline.json','fornisce lo stato approvato','abilita il confronto'],['--checks ...','cerca variazioni e gap di telemetria','rafforza detection e affidabilità dei log'],['--offline','impedisce azioni esterne','mantiene la prova locale']],
    defense:'Mantieni baseline firmate, allowlist applicativa, telemetria protetta e alert sui cambiamenti; conserva le evidenze prima di qualsiasi remediation.',
    nodes:[{name:'Baseline',detail:'Firmata demo',state:'active'},{name:'host-03',detail:'Telemetria incompleta',state:'risk'}],
    afterNodes:[{name:'updater-demo',detail:'Hash mismatch',state:'risk'},{name:'helper-demo',detail:'Nuovo elemento',state:'risk'},{name:'Esecuzione',detail:'Nessuna',state:'safe'}]
  }
];

const SEP04_DEFENSE = [
  {
    id:'def-api-idempotency-tests',domain:'API E SECURE CODING',level:'Avanzato',title:'Rendi idempotente una API localhost',
    objective:'Definisci controlli che accettano il primo comando, restituiscono lo stesso risultato ai retry equivalenti e rifiutano riuso incoerente della chiave.',
    story:'L’API è una demo localhost. I test usano payload sintetici e nessun servizio esterno.',
    lesson:'Una idempotency key è sicura quando è legata a identità, operazione e digest del payload e quando il comportamento è coperto da test automatici.',
    prompt:'defend$',task:'Riscrivi il comando che abilita idempotency, lega user+operation+payload-hash e lancia i test retry-same e reject-key-reuse.',format:'Un comando defend api idempotency.',
    answer:'defend api idempotency --scope user,operation,payload-hash --ttl 10m --tests retry-same,reject-key-reuse --target localhost',
    tokens:['defend','api','idempotency','--scope','user','operation','payload-hash','--ttl','10m','--tests','retry-same','reject-key-reuse','--target','localhost'],
    hints:['Inizia con defend api idempotency.','Lega la chiave a user, operation e payload-hash.','Codice completo: defend api idempotency --scope user,operation,payload-hash --ttl 10m --tests retry-same,reject-key-reuse --target localhost'],
    output:'[LOCALHOST] idempotency store inizializzato\n[TEST] primo comando: 201 PASS\n[TEST] retry stesso payload: stesso risultato PASS\n[TEST] stessa chiave, payload diverso: 409 PASS',
    explanation:[['api idempotency','protegge operazioni mutanti duplicate','rende i retry deterministici'],['--scope ...','lega la chiave al contesto','evita riusi tra operazioni differenti'],['--ttl 10m','definisce una finestra controllata','limita lo stato conservato'],['--tests ...','verifica casi positivi e negativi','previene regressioni'],['--target localhost','limita l’esecuzione alla demo locale','esclude sistemi esterni']],
    attackView:'I test confermano che un retry equivalente non duplica l’operazione e che un riuso incoerente viene respinto.',
    nodes:[{name:'API localhost',detail:'Demo',state:'active'},{name:'Retry tests',detail:'Da eseguire',state:'risk'}],
    afterNodes:[{name:'Retry equivalente',detail:'Deterministico',state:'safe'},{name:'Key reuse',detail:'Rifiutato',state:'safe'}]
  },
  {
    id:'def-cloud-storage-private-baseline',domain:'CLOUD, PRIVACY E COMPLIANCE',level:'Esperto',title:'Applica una baseline storage privata e verificabile',
    objective:'Correggi la policy sintetica imponendo accesso privato, principal espliciti, cifratura e retention testata.',
    story:'La modifica avviene soltanto sul file storage-lab.json e su test locali.',
    lesson:'La privacy legittima si traduce in minimizzazione dell’esposizione, accessi motivati, cifratura e conservazione verificabile dei dati.',
    prompt:'defend$',task:'Riscrivi il comando che applica private-by-default, blocca public access, richiede encryption e verifica principal e retention.',format:'Un comando defend cloud storage-baseline.',
    answer:'defend cloud storage-baseline --file storage-lab.json --default private --block-public true --encryption required --tests explicit-principal,retention-defined --mode test',
    tokens:['defend','cloud','storage-baseline','--file','storage-lab.json','--default','private','--block-public','true','--encryption','required','--tests','explicit-principal','retention-defined','--mode','test'],
    hints:['Inizia con defend cloud storage-baseline.','Imposta private, block-public e encryption required.','Codice completo: defend cloud storage-baseline --file storage-lab.json --default private --block-public true --encryption required --tests explicit-principal,retention-defined --mode test'],
    output:'[POLICY] private-by-default applicato al dataset\n[TEST] public access: DENY PASS\n[TEST] wildcard principal: NONE PASS\n[TEST] encryption: REQUIRED PASS\n[TEST] retention: DEFINED PASS',
    explanation:[['cloud storage-baseline','modifica la configurazione demo','non tocca account reali'],['--default private','nega esposizione implicita','riduce disclosure accidentali'],['--block-public true','impedisce policy pubbliche nel modello','aggiunge un guardrail'],['--encryption required','rende la cifratura requisito','protegge dati a riposo'],['--tests ...','verifica principal e retention','unisce sicurezza e governance'],['--mode test','esegue controlli locali','non usa provider cloud']],
    attackView:'La baseline fallisce automaticamente se ricompare accesso pubblico o un principal wildcard.',
    nodes:[{name:'Storage policy',detail:'Da correggere',state:'risk'}],
    afterNodes:[{name:'Public access',detail:'Bloccato',state:'safe'},{name:'Encryption',detail:'Obbligatoria',state:'safe'},{name:'Retention',detail:'Definita',state:'safe'}]
  },
  {
    id:'def-endpoint-evidence-preserve-detect',domain:'INCIDENT RESPONSE, EVIDENZE E ANTI-EVASIONE',level:'Esperto',title:'Preserva evidenze e rileva gap prima della remediation',
    objective:'Crea un manifest locale append-only con hash SHA-256 e segnala endpoint con telemetria incompleta senza cancellare o alterare le fonti.',
    story:'Gli artefatti sono file sintetici nella cartella evidence-lab/. Devi preservarli prima di ogni azione correttiva.',
    lesson:'Una risposta agli incidenti affidabile separa acquisizione, verifica e remediation: prima si preservano prove e metadati, poi si decide l’intervento.',
    prompt:'defend$',task:'Riscrivi il comando che acquisisce copie read-only, calcola SHA-256, registra UTC/source e verifica telemetry-gap senza modificare gli originali.',format:'Un comando defend ir preserve-detect.',
    answer:'defend ir preserve-detect --source evidence-lab --copy evidence-copy --hash sha256 --metadata utc,source --check telemetry-gap --readonly --mode local',
    tokens:['defend','ir','preserve-detect','--source','evidence-lab','--copy','evidence-copy','--hash','sha256','--metadata','utc','source','--check','telemetry-gap','--readonly','--mode','local'],
    hints:['Inizia con defend ir preserve-detect.','Preserva una copia read-only e usa SHA-256 con metadati UTC/source.','Codice completo: defend ir preserve-detect --source evidence-lab --copy evidence-copy --hash sha256 --metadata utc,source --check telemetry-gap --readonly --mode local'],
    output:'[LOCAL] 4 artefatti copiati read-only\n[HASH] manifest SHA-256 creato\n[METADATA] timestamp UTC + source registrati\n[WARN] host-03: telemetry-gap\n[ORIGINALS] invariati',
    explanation:[['ir preserve-detect','coordina preservazione e detection','evita remediation prematura'],['--source evidence-lab','seleziona solo artefatti sintetici','mantiene lo scope locale'],['--copy evidence-copy','separa copia e origine','protegge le fonti'],['--hash sha256','crea impronte verificabili','supporta integrità'],['--metadata utc,source','registra provenienza e tempo','rafforza catena di custodia'],['--check telemetry-gap','segnala assenze di telemetria','supporta anti-evasione difensiva'],['--readonly','impedisce modifiche intenzionali alla copia','preserva le evidenze'],['--mode local','esclude sistemi remoti','mantiene il laboratorio sicuro']],
    attackView:'La procedura non cancella tracce: preserva gli originali, verifica l’integrità e segnala i gap per la revisione umana.',
    nodes:[{name:'Evidence',detail:'Da preservare',state:'risk'},{name:'host-03',detail:'Gap telemetria',state:'risk'}],
    afterNodes:[{name:'Manifest',detail:'SHA-256 + UTC',state:'safe'},{name:'Originali',detail:'Invariati',state:'safe'},{name:'host-03',detail:'Review richiesta',state:'risk'}]
  }
];

for (const scenario of SEP04_ATTACK) {
  if (!CYBERFORGE_ATTACK.some(existing => existing.id === scenario.id)) CYBERFORGE_ATTACK.push(scenario);
}
for (const scenario of SEP04_DEFENSE) {
  if (!CYBERFORGE_DEFENSE.some(existing => existing.id === scenario.id)) CYBERFORGE_DEFENSE.push(scenario);
}
