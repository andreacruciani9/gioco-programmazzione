const CYBERFORGE_DEFENSE = [
    {
      id: 'def-wifi', domain: 'RETI WI-FI', level: 'Base', title: 'Chiudi il varco iniziale',
      objective: 'Applica una baseline sicura al router fittizio HOME-LAB.',
      story: 'Il report mostra WPA2, WPS attivo e rete ospiti non isolata. Devi correggere i tre controlli nel simulatore.',
      lesson: 'La baseline riduce la probabilità di accesso iniziale prima ancora di attivare il monitoraggio.',
      prompt: 'defend$', task: 'Scrivi il comando che abilita WPA3, spegne WPS e isola gli ospiti.',
      format: 'Un comando defend wifi apply.',
      answer: 'defend wifi apply --range HOME-LAB --wpa3 on --wps off --guest-isolation on',
      tokens: ['defend','wifi','apply','--range','home-lab','--wpa3','on','--wps','off','--guest-isolation'],
      hints: ['Inizia con defend wifi apply.','Configura HOME-LAB con WPA3 on, WPS off e guest-isolation on.','Codice completo: defend wifi apply --range HOME-LAB --wpa3 on --wps off --guest-isolation on'],
      output: '[APPLY] WPA3=ON\n[APPLY] WPS=OFF\n[APPLY] guest_isolation=ON\n[PASS] baseline wireless applicata\nFLAG{INITIAL_ACCESS_REDUCED}',
      explanation: [
        ['defend wifi apply','modifica la configurazione del router inventato','serve a rimuovere le debolezze individuate'],
        ['--wpa3 on','abilita la protezione più moderna prevista dal laboratorio','rafforza autenticazione e cifratura'],
        ['--wps off','disattiva la funzione non necessaria','riduce la superficie di rischio'],
        ['--guest-isolation on','separa gli ospiti dalle altre zone','limita il movimento laterale']
      ],
      attackView: 'L’attaccante perde il percorso più semplice e deve affrontare controlli più forti.',
      nodes: [{name:'Router-LAB',detail:'Configurazione debole',state:'risk'},{name:'WPA3',detail:'OFF',state:'risk'},{name:'WPS',detail:'ON',state:'risk'},{name:'Guest',detail:'Non isolata',state:'risk'}],
      afterNodes: [{name:'Router-LAB',detail:'Baseline applicata',state:'safe'},{name:'WPA3',detail:'ON',state:'safe'},{name:'WPS',detail:'OFF',state:'safe'},{name:'Guest',detail:'Isolata',state:'safe'}]
    },
    {
      id: 'def-web', domain: 'APPLICAZIONI WEB', level: 'Junior', title: 'Riduci l’esposizione web',
      objective: 'Applica intestazioni di sicurezza e limita la pagina amministrativa.',
      story: 'La ricognizione ha trovato /admin. Devi rafforzare il portale inventato senza affidarti al solo URL nascosto.',
      lesson: 'La difesa web combina autorizzazione server-side, MFA, logging e intestazioni che riducono alcune classi di abuso nel browser.',
      prompt: 'defend$', task: 'Scrivi il comando che applica CSP strict, HSTS, frame deny e protegge /admin con MFA.',
      format: 'Un comando defend web harden.',
      answer: 'defend web harden --app shop.lab --csp strict --hsts on --frame deny --admin-mfa required',
      tokens: ['defend','web','harden','--app','shop.lab','--csp','strict','--hsts','on','--frame','deny','--admin-mfa','required'],
      hints: ['Usa defend web harden.','Configura shop.lab con CSP, HSTS, frame deny e MFA admin.','Codice completo: defend web harden --app shop.lab --csp strict --hsts on --frame deny --admin-mfa required'],
      output: '[HEADERS] CSP=strict HSTS=on FRAME=deny\n[ADMIN] MFA=required server_authorization=on\n[PASS] superficie web ridotta\nFLAG{WEB_HARDENED}',
      explanation: [
        ['web harden','applica il profilo difensivo all’app simulata','raggruppa più controlli complementari'],
        ['--csp strict','limita le sorgenti di contenuto ammesse','riduce l’impatto di script non autorizzati'],
        ['--hsts on','forza il canale protetto previsto dal simulatore','impedisce downgrade nel modello didattico'],
        ['--frame deny','nega l’incorporamento della pagina','riduce il rischio di clickjacking'],
        ['--admin-mfa required','richiede un secondo fattore per l’area amministrativa','rafforza l’accesso privilegiato']
      ],
      attackView: 'La rotta resta visibile, ma visibilità non equivale più ad accesso: servono autorizzazione e MFA.',
      nodes: [{name:'shop.lab',detail:'Da rafforzare',state:'risk'},{name:'/admin',detail:'Solo 403',state:'risk'},{name:'Browser policy',detail:'Assente',state:''},{name:'MFA',detail:'Assente',state:''}],
      afterNodes: [{name:'shop.lab',detail:'Hardening attivo',state:'safe'},{name:'/admin',detail:'Authz + MFA',state:'safe'},{name:'Browser policy',detail:'CSP/HSTS',state:'safe'},{name:'MFA',detail:'Richiesta',state:'safe'}]
    },
    {
      id: 'def-api', domain: 'API E AUTORIZZAZIONE', level: 'Intermedio', title: 'Blocca l’accesso tra utenti',
      objective: 'Imposta deny-by-default e consenti l’ordine soltanto al proprietario o a un amministratore.',
      story: 'Il test precedente ha ottenuto 200 dove era previsto 403. Devi applicare una policy server-side.',
      lesson: 'Il controllo deve avvenire per ogni richiesta e per ogni risorsa, senza fidarsi dell’ID inviato dal client.',
      prompt: 'defend$', task: 'Scrivi la policy per la risorsa orders con regola owner-or-admin e default deny.',
      format: 'Un comando defend api policy.',
      answer: 'defend api policy --resource orders --rule owner-or-admin --default deny --log denied',
      tokens: ['defend','api','policy','--resource','orders','--rule','owner-or-admin','--default','deny','--log','denied'],
      hints: ['Usa defend api policy.','La regola è owner-or-admin; il default è deny.','Codice completo: defend api policy --resource orders --rule owner-or-admin --default deny --log denied'],
      output: '[POLICY] orders: owner-or-admin\n[DEFAULT] deny\n[LOG] denied requests enabled\n[TEST] user-7 -> /orders/1042 = 403\nFLAG{OBJECT_AUTHORIZATION_FIXED}',
      explanation: [
        ['api policy','crea una regola nel motore API simulato','centralizza il controllo di autorizzazione'],
        ['--rule owner-or-admin','consente accesso solo al proprietario o al ruolo admin','lega l’identità alla risorsa'],
        ['--default deny','rifiuta tutto ciò che non è esplicitamente permesso','evita accessi involontari'],
        ['--log denied','registra i tentativi rifiutati','fornisce visibilità al team difensivo']
      ],
      attackView: 'Il test dell’attaccante ora riceve 403 e genera un evento utile al SOC.',
      nodes: [{name:'user-7',detail:'Utente standard',state:'active'},{name:'API ordini',detail:'Authz debole',state:'risk'},{name:'Ordine 1042',detail:'Esposto',state:'risk'},{name:'Log',detail:'Assente',state:''}],
      afterNodes: [{name:'user-7',detail:'Accesso negato',state:'safe'},{name:'API ordini',detail:'Policy applicata',state:'safe'},{name:'Ordine 1042',detail:'Protetto',state:'safe'},{name:'Log',detail:'Tentativo registrato',state:'active'}]
    },
    {
      id: 'def-identity', domain: 'IDENTITÀ E PRIVILEGI', level: 'Avanzato', title: 'Interrompi il percorso privilegiato',
      objective: 'Rimuovi la delega legacy, richiedi MFA e limita la durata delle sessioni admin.',
      story: 'Il grafo ha mostrato analyst -> legacy-operators -> admin-console. Devi eliminare il collegamento non necessario.',
      lesson: 'Il minimo privilegio elimina percorsi indiretti; MFA e sessioni brevi riducono l’impatto di credenziali compromesse.',
      prompt: 'defend$', task: 'Scrivi il comando che rimuove analyst da legacy-operators e rafforza admin-console.',
      format: 'Un comando defend identity enforce.',
      answer: 'defend identity enforce --remove analyst:legacy-operators --admin-mfa required --admin-session 15m',
      tokens: ['defend','identity','enforce','--remove','analyst:legacy-operators','--admin-mfa','required','--admin-session','15m'],
      hints: ['Usa defend identity enforce.','Rimuovi analyst:legacy-operators, poi imposta MFA e sessione 15m.','Codice completo: defend identity enforce --remove analyst:legacy-operators --admin-mfa required --admin-session 15m'],
      output: '[REMOVE] analyst -X-> legacy-operators\n[MFA] admin-console required\n[SESSION] admin=15m\n[PASS] percorso privilegiato interrotto\nFLAG{IDENTITY_PATH_CLOSED}',
      explanation: [
        ['identity enforce','applica cambiamenti al grafo locale delle identità','corregge i privilegi effettivi'],
        ['--remove analyst:legacy-operators','elimina il collegamento che creava escalation','rimuove un privilegio non necessario'],
        ['--admin-mfa required','richiede MFA sulle funzioni elevate','aggiunge una barriera oltre la password'],
        ['--admin-session 15m','riduce la durata delle sessioni privilegiate','limita la finestra di abuso']
      ],
      attackView: 'Il percorso indiretto non esiste più e l’accesso admin richiede un secondo fattore.',
      nodes: [{name:'analyst',detail:'Ruolo base',state:'active'},{name:'legacy-operators',detail:'Collegamento improprio',state:'risk'},{name:'admin-console',detail:'MFA assente',state:'risk'},{name:'Sessione',detail:'Lunga',state:'risk'}],
      afterNodes: [{name:'analyst',detail:'Minimo privilegio',state:'safe'},{name:'legacy-operators',detail:'Collegamento rimosso',state:'safe'},{name:'admin-console',detail:'MFA richiesta',state:'safe'},{name:'Sessione',detail:'15 minuti',state:'safe'}]
    },
    {
      id: 'def-cloud', domain: 'CLOUD', level: 'Esperto', title: 'Proteggi dati e visibilità',
      objective: 'Disattiva l’accesso pubblico, abilita cifratura e audit sul bucket reports-lab.',
      story: 'La valutazione policy ha mostrato Allow principal=*. Devi sostituirla con una configurazione privata e osservabile.',
      lesson: 'La sicurezza cloud richiede prevenzione e rilevamento: blocco pubblico, identità esplicite, cifratura e log protetti.',
      prompt: 'defend$', task: 'Scrivi il comando completo per rendere privato, cifrato e monitorato reports-lab.',
      format: 'Un comando defend cloud bucket.',
      answer: 'defend cloud bucket --name reports-lab --public off --encrypt on --audit on --default deny',
      tokens: ['defend','cloud','bucket','--name','reports-lab','--public','off','--encrypt','on','--audit','on','--default','deny'],
      hints: ['Usa defend cloud bucket.','Imposta public off, encrypt on, audit on e default deny.','Codice completo: defend cloud bucket --name reports-lab --public off --encrypt on --audit on --default deny'],
      output: '[PUBLIC] blocked\n[ENCRYPTION] enabled\n[AUDIT] enabled immutable=true\n[POLICY] default=deny\nFLAG{CLOUD_DATA_PROTECTED}',
      explanation: [
        ['cloud bucket','modifica il contenitore fittizio','applica controlli alla risorsa dati'],
        ['--public off','nega principal anonimi','chiude l’esposizione rilevata'],
        ['--encrypt on','marca i dati del simulatore come cifrati','protegge la confidenzialità nel modello'],
        ['--audit on','registra accessi e cambi policy','permette indagine e rilevamento'],
        ['--default deny','richiede permessi espliciti','riduce errori di configurazione']
      ],
      attackView: 'Il principal guest riceve deny e il tentativo viene registrato.',
      nodes: [{name:'guest',detail:'Lettura consentita',state:'risk'},{name:'reports-lab',detail:'Pubblico',state:'risk'},{name:'Cifratura',detail:'OFF',state:'risk'},{name:'Audit',detail:'OFF',state:'risk'}],
      afterNodes: [{name:'guest',detail:'Accesso negato',state:'safe'},{name:'reports-lab',detail:'Privato',state:'safe'},{name:'Cifratura',detail:'ON',state:'safe'},{name:'Audit',detail:'ON',state:'active'}]
    },
    {
      id: 'def-endpoint', domain: 'ENDPOINT E RILEVAMENTO', level: 'Esperto', title: 'Rileva e contiene il locker simulato',
      objective: 'Crea una regola comportamentale e isola automaticamente l’endpoint nel laboratorio.',
      story: 'La telemetria mostra 120 modifiche rapide, 8 nuove estensioni e una condivisione coinvolta. Devi correlare i segnali.',
      lesson: 'Un rilevamento robusto non dipende da un nome di processo: usa comportamento, volume, tempo e contesto.',
      prompt: 'defend$', task: 'Scrivi la regola con soglia 80, estensioni 5, shared true e isolamento automatico.',
      format: 'Un comando defend endpoint detect.',
      answer: 'defend endpoint detect --rule rapid-file-change --changes 80 --extensions 5 --shared true --isolate on',
      tokens: ['defend','endpoint','detect','--rule','rapid-file-change','--changes','80','--extensions','5','--shared','true','--isolate','on'],
      hints: ['Usa defend endpoint detect.','Definisci le tre condizioni e abilita --isolate on.','Codice completo: defend endpoint detect --rule rapid-file-change --changes 80 --extensions 5 --shared true --isolate on'],
      output: '[RULE] rapid-file-change enabled\n[MATCH] Endpoint-LAB changes=120 extensions=8 shared=true\n[ACTION] Endpoint-LAB isolated\n[EVIDENCE] timeline preserved\nFLAG{BEHAVIOR_DETECTED}',
      explanation: [
        ['endpoint detect','crea una regola sul flusso di eventi inventato','permette di riconoscere il comportamento'],
        ['--changes 80','imposta una soglia di modifiche rapide','separa attività normali da volumi anomali'],
        ['--extensions 5','richiede molte estensioni nuove','aggiunge un secondo segnale'],
        ['--shared true','limita la regola alle condivisioni','considera il contesto ad alto impatto'],
        ['--isolate on','attiva il contenimento simulato','interrompe la propagazione mantenendo le evidenze']
      ],
      attackView: 'Il locker innocuo viene rilevato e l’endpoint non può più raggiungere la condivisione simulata.',
      nodes: [{name:'Endpoint-LAB',detail:'Attività anomala',state:'risk'},{name:'Detection',detail:'Regola assente',state:''},{name:'Condivisione',detail:'Esposta',state:'risk'},{name:'Timeline',detail:'Disponibile',state:'active'}],
      afterNodes: [{name:'Endpoint-LAB',detail:'Isolato',state:'safe'},{name:'Detection',detail:'Match confermato',state:'active'},{name:'Condivisione',detail:'Propagazione fermata',state:'safe'},{name:'Timeline',detail:'Preservata',state:'safe'}]
    },
    {
      id: 'def-pro-response', domain: 'INCIDENT RESPONSE', level: 'Pro', title: 'Gestisci l’incidente completo',
      objective: 'Esegui contenimento, preservazione, correzione, ripristino e monitoraggio nella sequenza corretta.',
      story: 'L’attacco simulato è stato contenuto. Ora devi chiudere l’incidente senza reintrodurre la causa.',
      lesson: 'La risposta professionale coordina tecnologia, evidenze e recupero. Ripristinare prima della correzione può riaprire l’incidente.',
      prompt: 'defend$', task: 'Scrivi le cinque righe del playbook in ordine.',
      format: 'Cinque comandi, uno per riga.',
      answer: 'defend incident contain --scope affected\ndefend incident preserve --evidence logs,timeline\ndefend incident remediate --cause confirmed\ndefend incident restore --backup verified\ndefend incident monitor --period 24h',
      tokens: ['defend incident contain','--scope affected','defend incident preserve','--evidence logs,timeline','defend incident remediate','--cause confirmed','defend incident restore','--backup verified','defend incident monitor','--period 24h'],
      hints: ['L’ordine è: contiene, preserva, correggi, ripristina, monitora.','Ogni fase è un comando defend incident distinto.','Codice completo:\ndefend incident contain --scope affected\ndefend incident preserve --evidence logs,timeline\ndefend incident remediate --cause confirmed\ndefend incident restore --backup verified\ndefend incident monitor --period 24h'],
      output: '[1/5] affected scope contained\n[2/5] logs and timeline preserved\n[3/5] root cause remediated\n[4/5] verified backup restored\n[5/5] enhanced monitoring active for 24h\nFLAG{INCIDENT_CLOSED_PROFESSIONALLY}',
      explanation: [
        ['incident contain','limita immediatamente il perimetro colpito','riduce il danno senza spegnere indiscriminatamente tutto'],
        ['incident preserve','conserva log e timeline','mantiene le prove per capire cosa è accaduto'],
        ['incident remediate','rimuove la causa confermata','impedisce la ricomparsa dello stesso percorso'],
        ['incident restore','ripristina soltanto da backup verificato','evita di reintrodurre dati compromessi'],
        ['incident monitor','aumenta la sorveglianza per 24 ore','conferma che il servizio sia tornato stabile']
      ],
      attackView: 'La catena non è più ripetibile, i dati vengono recuperati e i segnali restano monitorati.',
      nodes: [{name:'Contenimento',detail:'In corso',state:'active'},{name:'Evidenze',detail:'Da preservare',state:'risk'},{name:'Backup',detail:'Disponibile',state:''},{name:'Servizio',detail:'Degradato',state:'risk'}],
      afterNodes: [{name:'Contenimento',detail:'Completato',state:'safe'},{name:'Evidenze',detail:'Integre',state:'safe'},{name:'Backup',detail:'Verificato e ripristinato',state:'safe'},{name:'Servizio',detail:'Monitoraggio 24h',state:'active'}]
    }
  ];
