const PRIVACY_ATTACK_SCENARIOS = [
  {
    id: 'atk-lab-identity', domain: 'PRIVACY E PERIMETRO', level: 'Avanzato', title: 'Separa l’identità di laboratorio',
    objective: 'Configura un’identità dedicata e tracciabile per operare esclusivamente nella CyberRange.',
    story: 'Prima di proseguire devi evitare di mescolare account personali e attività di laboratorio. Un test professionale deve restare attribuibile, autorizzato e documentato.',
    lesson: 'Privacy non significa cancellare le tracce. Significa usare account dedicati, dati fittizi, perimetro scritto e registri firmati che dimostrano cosa è stato autorizzato.',
    prompt: 'cyberlab$',
    task: 'Scrivi il comando che associa trainee-01 a HOME-LAB e abilita un audit firmato.',
    format: 'Un comando cyberlab scope bind.',
    answer: 'cyberlab scope bind --operator trainee-01 --range HOME-LAB --audit signed',
    tokens: ['cyberlab','scope','bind','--operator','trainee-01','--range','home-lab','--audit','signed'],
    hints: [
      'Il comando parte con cyberlab scope bind.',
      'Indica operatore, laboratorio e tipo di audit.',
      'Codice completo: cyberlab scope bind --operator trainee-01 --range HOME-LAB --audit signed'
    ],
    output: '[SCOPE] HOME-LAB associato a trainee-01\n[AUDIT] registro firmato attivo\n[PRIVACY] nessun account personale utilizzato\nFLAG{AUTHORIZED_LAB_IDENTITY}',
    explanation: [
      ['scope bind','lega l’operatore allo scenario autorizzato','impedisce di confondere laboratorio e sistemi reali'],
      ['--operator trainee-01','usa un’identità didattica dedicata','protegge i dati personali mantenendo responsabilità e tracciabilità'],
      ['--range HOME-LAB','definisce il solo ambiente consentito','rende evidente il confine operativo'],
      ['--audit signed','registra le azioni con integrità verificabile','permette revisione e accountability']
    ],
    defense: 'Le organizzazioni devono richiedere account di test separati, scope approvato, log protetti e revisione delle attività red team.',
    nodes: [{name:'Account personale',detail:'Da non utilizzare',state:'risk'},{name:'trainee-01',detail:'Identità laboratorio',state:'active'},{name:'HOME-LAB',detail:'Scope autorizzato',state:'safe'},{name:'Audit',detail:'Da attivare',state:''}],
    afterNodes: [{name:'Account personale',detail:'Separato',state:'safe'},{name:'trainee-01',detail:'Associato',state:'owned'},{name:'HOME-LAB',detail:'Perimetro confermato',state:'safe'},{name:'Audit',detail:'Firmato',state:'active'}]
  },
  {
    id: 'atk-metadata-audit', domain: 'PRIVACY DEI DATI', level: 'Esperto', title: 'Controlla i metadati delle evidenze',
    objective: 'Individua dati personali e tecnici presenti in un file prima di condividerlo nel report.',
    story: 'Hai creato una schermata del laboratorio. Prima di allegarla devi controllare metadati, proprietario e impronta del file senza alterare le evidenze originali.',
    lesson: 'File e immagini possono contenere autore, software, posizione o date. Il professionista lavora su copie, preserva l’originale e documenta ogni trasformazione.',
    prompt: 'cyberlab$',
    task: 'Scrivi il comando che ispeziona report.png mostrando metadata, hash e owner.',
    format: 'Un comando cyberlab evidence inspect.',
    answer: 'cyberlab evidence inspect --file report.png --show metadata,hash,owner',
    tokens: ['cyberlab','evidence','inspect','--file','report.png','--show','metadata','hash','owner'],
    hints: [
      'Usa cyberlab evidence inspect.',
      'Seleziona report.png e i campi metadata,hash,owner.',
      'Codice completo: cyberlab evidence inspect --file report.png --show metadata,hash,owner'
    ],
    output: '[FILE] report.png\n[HASH] SHA256 registrato\n[METADATA] author=trainee-01 software=CyberForge\n[OWNER] laboratorio\nFLAG{EVIDENCE_PRIVACY_REVIEWED}',
    explanation: [
      ['evidence inspect','legge informazioni del file simulato senza modificarlo','permette di valutare privacy e integrità'],
      ['--file report.png','seleziona la copia didattica','evita di operare su documenti reali'],
      ['--show metadata,hash,owner','mostra dati incorporati, impronta e proprietario','aiuta a decidere cosa può essere condiviso e a preservare la prova']
    ],
    defense: 'Usa procedure di gestione evidenze, minimizzazione dei dati, copie di lavoro e verifica dell’hash prima e dopo ogni trattamento autorizzato.',
    nodes: [{name:'report.png',detail:'Da esaminare',state:'active'},{name:'Metadata',detail:'Sconosciuti',state:'risk'},{name:'Hash',detail:'Non registrato',state:''},{name:'Originale',detail:'Preservato',state:'safe'}],
    afterNodes: [{name:'report.png',detail:'Revisionato',state:'owned'},{name:'Metadata',detail:'Classificati',state:'safe'},{name:'Hash',detail:'Registrato',state:'safe'},{name:'Originale',detail:'Immutato',state:'safe'}]
  }
];

const PRIVACY_DEFENSE_SCENARIOS = [
  {
    id: 'def-log-integrity', domain: 'ANTI-EVASIONE', level: 'Esperto', title: 'Rileva alterazioni dei log',
    objective: 'Verifica che auth.log corrisponda alla baseline SHA-256 e genera un alert in caso di modifica.',
    story: 'Un attore potrebbe tentare di cancellare o cambiare gli eventi. Devi proteggere la tracciabilità invece di affidarti a log modificabili localmente.',
    lesson: 'L’integrità si controlla con hash, copie remote, permessi minimi e timestamp affidabili. I log importanti non devono dipendere dal solo sistema osservato.',
    prompt: 'defend$',
    task: 'Scrivi il comando che verifica auth.log con SHA-256 e segnala mismatch.',
    format: 'Un comando defend logs verify.',
    answer: 'defend logs verify --source auth.log --baseline sha256 --alert mismatch',
    tokens: ['defend','logs','verify','--source','auth.log','--baseline','sha256','--alert','mismatch'],
    hints: [
      'Il comando parte con defend logs verify.',
      'Indica auth.log, baseline sha256 e alert mismatch.',
      'Codice completo: defend logs verify --source auth.log --baseline sha256 --alert mismatch'
    ],
    output: '[HASH] baseline caricata\n[VERIFY] auth.log mismatch rilevato\n[ALERT] possibile manomissione\n[EVIDENCE] copia remota preservata\nFLAG{LOG_TAMPERING_DETECTED}',
    explanation: [
      ['logs verify','confronta l’impronta corrente con quella attesa','rileva modifiche non autorizzate'],
      ['--source auth.log','sceglie il registro da controllare','concentra il controllo sugli eventi di autenticazione'],
      ['--baseline sha256','usa un’impronta crittografica registrata','permette di verificare l’integrità'],
      ['--alert mismatch','genera un evento quando i valori differiscono','porta il tentativo all’attenzione del SOC']
    ],
    attackView: 'Cancellare o modificare eventi non rende invisibili: la copia remota e l’hash mostrano la manomissione.',
    nodes: [{name:'auth.log',detail:'Integrità incerta',state:'risk'},{name:'Baseline',detail:'Disponibile',state:'active'},{name:'Remote store',detail:'Copia integra',state:'safe'},{name:'SOC',detail:'In attesa',state:''}],
    afterNodes: [{name:'auth.log',detail:'Mismatch',state:'risk'},{name:'Baseline',detail:'Confrontata',state:'safe'},{name:'Remote store',detail:'Evidenza preservata',state:'safe'},{name:'SOC',detail:'Alert aperto',state:'active'}]
  },
  {
    id: 'def-identity-correlation', domain: 'RILEVAMENTO IDENTITÀ', level: 'Pro', title: 'Correla tentativi di anonimizzazione',
    objective: 'Combina dispositivo, fuso orario, proxy e sequenza degli accessi per individuare un’identità anomala.',
    story: 'Gli eventi sintetici usano indirizzi diversi, ma condividono impronta del dispositivo, orari incompatibili e lo stesso comportamento sulle API.',
    lesson: 'Un singolo indirizzo IP non identifica una persona. Il rilevamento professionale correla più segnali, rispetta la privacy e richiede verifica umana prima di attribuire responsabilità.',
    prompt: 'defend$',
    task: 'Scrivi il comando che correla login.json usando device, timezone e proxy con soglia high.',
    format: 'Un comando defend identity correlate.',
    answer: 'defend identity correlate --events login.json --signals device,timezone,proxy --threshold high',
    tokens: ['defend','identity','correlate','--events','login.json','--signals','device','timezone','proxy','--threshold','high'],
    hints: [
      'Usa defend identity correlate.',
      'Seleziona login.json e i segnali device,timezone,proxy.',
      'Codice completo: defend identity correlate --events login.json --signals device,timezone,proxy --threshold high'
    ],
    output: '[CORRELATION] 18 eventi analizzati\n[HIGH] device-7: timezone impossibile + proxy multipli + stessa sequenza API\n[REVIEW] attribuzione non automatica\nFLAG{EVASION_PATTERN_CORRELATED}',
    explanation: [
      ['identity correlate','unisce eventi riferiti allo stesso comportamento','riduce la dipendenza da un singolo indicatore'],
      ['--events login.json','usa soltanto il dataset sintetico del laboratorio','mantiene privacy e perimetro'],
      ['--signals device,timezone,proxy','combina contesto tecnico e temporale','evidenzia incoerenze utili al rilevamento'],
      ['--threshold high','mostra solo correlazioni forti','riduce falsi positivi e richiede revisione umana']
    ],
    attackView: 'Cambiare indirizzo o proxy non garantisce invisibilità: più segnali coerenti possono collegare gli eventi senza identificare automaticamente una persona.',
    nodes: [{name:'Eventi login',detail:'18 record',state:'active'},{name:'IP',detail:'Variabili',state:''},{name:'Device-7',detail:'Impronta ricorrente',state:'risk'},{name:'Analista',detail:'Da revisionare',state:''}],
    afterNodes: [{name:'Eventi login',detail:'Correlati',state:'safe'},{name:'IP',detail:'Indicatore secondario',state:'safe'},{name:'Device-7',detail:'Pattern high',state:'risk'},{name:'Analista',detail:'Revisione richiesta',state:'active'}]
  }
];

CYBERFORGE_ATTACK.splice(CYBERFORGE_ATTACK.length - 1, 0, ...PRIVACY_ATTACK_SCENARIOS);
CYBERFORGE_DEFENSE.splice(CYBERFORGE_DEFENSE.length - 1, 0, ...PRIVACY_DEFENSE_SCENARIOS);
