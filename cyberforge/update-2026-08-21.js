const AUG21_ATTACK = [
  {
    id:'atk-oauth-config-offline',domain:'IDENTITÀ E OAUTH',level:'Intermedio',title:'Revisiona una configurazione OAuth locale',
    objective:'Analizza oauth-client-lab.json e individua redirect troppo ampi, PKCE non richiesto e flow legacy.',
    story:'Il team ti consegna l’export sintetico di un client OAuth. Devi valutarlo offline senza inviare richieste al provider o usare token reali.',
    lesson:'La sicurezza OAuth dipende dalla precisione del redirect, dall’uso di Authorization Code + PKCE e dalla riduzione dei flow non necessari. Una review del file di configurazione permette di trovare errori senza autenticarsi.',
    prompt:'cyberlab$',task:'Scrivi il comando che revisiona oauth-client-lab.json per redirect-uri,pkce,grant-types in modalità offline.',format:'Un comando cyberlab identity oauth-review.',
    answer:'cyberlab identity oauth-review --file oauth-client-lab.json --checks redirect-uri,pkce,grant-types --offline',
    tokens:['cyberlab','identity','oauth-review','--file','oauth-client-lab.json','--checks','redirect-uri','pkce','grant-types','--offline'],
    hints:['Inizia con cyberlab identity oauth-review.','Indica oauth-client-lab.json e i controlli redirect-uri,pkce,grant-types.','Codice completo: cyberlab identity oauth-review --file oauth-client-lab.json --checks redirect-uri,pkce,grant-types --offline'],
    output:'[OFFLINE] client demo caricato\n[HIGH] redirect_uri=https://app.lab/* troppo ampia\n[HIGH] pkce_required=false\n[WARN] implicit grant abilitato\nFLAG{OAUTH_CONFIG_REVIEWED}',
    explanation:[['identity oauth-review','avvia la revisione del client OAuth esportato','serve a verificare configurazioni di identità senza autenticarsi'],['--file oauth-client-lab.json','usa soltanto il file sintetico locale','mantiene l’esercizio offline'],['--checks redirect-uri,pkce,grant-types','seleziona i controlli principali del flow','rende la review mirata e ripetibile'],['--offline','impedisce dipendenze dal provider','evita richieste e token reali']],
    defense:'Usa redirect URI esatte, Authorization Code con PKCE S256, disabilita grant non necessari e valida state/nonce lato applicazione.',
    nodes:[{name:'oauth-client-lab.json',detail:'Config locale',state:'active'},{name:'Redirect URI',detail:'Da verificare',state:'risk'},{name:'PKCE',detail:'Da verificare',state:'risk'},{name:'Provider',detail:'Non contattato',state:'safe'}],
    afterNodes:[{name:'oauth-client-lab.json',detail:'Revisionato',state:'owned'},{name:'Redirect URI',detail:'Wildcard trovata',state:'risk'},{name:'PKCE',detail:'Non richiesto',state:'risk'},{name:'Provider',detail:'Mai contattato',state:'safe'}]
  },
  {
    id:'atk-container-manifest-review',domain:'CONTAINER E KUBERNETES',level:'Avanzato',title:'Revisiona un manifest container',
    objective:'Controlla pod-lab.json e individua privilegi eccessivi senza avviare container o collegarti a un cluster.',
    story:'Hai un manifest Kubernetes sintetico esportato su file. Devi cercare privileged, root, hostNetwork e filesystem scrivibile in modalità statica.',
    lesson:'Molti rischi container derivano dalla configurazione. Una review statica del manifest può rilevare privilegi pericolosi prima del deploy, senza eseguire workload.',
    prompt:'cyberlab$',task:'Scrivi il comando che revisiona pod-lab.json per privileged,run-as-root,host-network,writable-rootfs in modalità offline.',format:'Un comando cyberlab container review.',
    answer:'cyberlab container review --file pod-lab.json --checks privileged,run-as-root,host-network,writable-rootfs --offline',
    tokens:['cyberlab','container','review','--file','pod-lab.json','--checks','privileged','run-as-root','host-network','writable-rootfs','--offline'],
    hints:['Usa cyberlab container review.','Aggiungi pod-lab.json e i quattro controlli.','Codice completo: cyberlab container review --file pod-lab.json --checks privileged,run-as-root,host-network,writable-rootfs --offline'],
    output:'[MANIFEST] pod demo caricato\n[HIGH] securityContext.privileged=true\n[HIGH] runAsUser=0\n[WARN] hostNetwork=true\n[WARN] readOnlyRootFilesystem=false\nFLAG{CONTAINER_RISK_REVIEWED}',
    explanation:[['container review','analizza il manifest senza eseguirlo','permette di trovare misconfigurazioni prima del deploy'],['--file pod-lab.json','limita la review al file locale','non richiede cluster o registry'],['--checks ...','cerca privilegi e isolamento insufficienti','focalizza la revisione sui controlli più importanti'],['--offline','esclude accessi esterni','mantiene il laboratorio passivo']],
    defense:'Esegui come utente non root, privileged=false, hostNetwork=false, filesystem root read-only, drop delle capability e profili seccomp/AppArmor appropriati.',
    nodes:[{name:'pod-lab.json',detail:'Manifest locale',state:'active'},{name:'Privileges',detail:'Da verificare',state:'risk'},{name:'Network namespace',detail:'Da verificare',state:'risk'},{name:'Cluster',detail:'Non contattato',state:'safe'}],
    afterNodes:[{name:'pod-lab.json',detail:'Revisionato',state:'owned'},{name:'Privileges',detail:'Eccessivi',state:'risk'},{name:'Network namespace',detail:'hostNetwork ON',state:'risk'},{name:'Cluster',detail:'Mai contattato',state:'safe'}]
  },
  {
    id:'atk-graphql-authz-static',domain:'GRAPHQL E AUTORIZZAZIONE',level:'Esperto',title:'Trova campi sensibili senza guardia',
    objective:'Analizza schema.graphql e resolver-map.json per individuare campi sensibili privi di controllo autorizzativo.',
    story:'Il laboratorio contiene schema e mappa resolver sintetici. Devi fare correlazione statica tra campi sensibili e policy, senza inviare query GraphQL.',
    lesson:'In GraphQL il controllo deve esistere anche a livello di campo o resolver quando i dati hanno sensibilità diversa. Introspection o nomi dei campi non sostituiscono l’autorizzazione server-side.',
    prompt:'cyberlab$',task:'Scrivi il comando che confronta schema.graphql e resolver-map.json cercando sensitive-fields e missing-authz in modalità static.',format:'Un comando cyberlab graphql review.',
    answer:'cyberlab graphql review --schema schema.graphql --resolvers resolver-map.json --checks sensitive-fields,missing-authz --mode static',
    tokens:['cyberlab','graphql','review','--schema','schema.graphql','--resolvers','resolver-map.json','--checks','sensitive-fields','missing-authz','--mode','static'],
    hints:['Inizia con cyberlab graphql review.','Indica schema.graphql, resolver-map.json e i due controlli.','Codice completo: cyberlab graphql review --schema schema.graphql --resolvers resolver-map.json --checks sensitive-fields,missing-authz --mode static'],
    output:'[STATIC] 42 campi correlati\n[HIGH] User.salary resolver=User.salary authz=missing\n[HIGH] User.privateNotes resolver=User.privateNotes authz=missing\n[NETWORK] zero query inviate\nFLAG{GRAPHQL_AUTHZ_GAPS_FOUND}',
    explanation:[['graphql review','correla schema e resolver locali','serve a trovare gap autorizzativi senza interrogare un endpoint'],['--schema schema.graphql','carica la definizione dei tipi','identifica i campi disponibili'],['--resolvers resolver-map.json','carica la mappa delle policy sintetiche','permette di verificare quali resolver hanno guardie'],['--checks sensitive-fields,missing-authz','seleziona campi sensibili senza controllo','prioritizza i rilievi'],['--mode static','impedisce esecuzione di query','mantiene l’analisi non invasiva']],
    defense:'Applica autorizzazione server-side per resolver/campo, minimizza i dati restituiti, usa test di autorizzazione e limiti di complessità/profondità delle query.',
    nodes:[{name:'schema.graphql',detail:'Schema locale',state:'active'},{name:'resolver-map.json',detail:'Policy locali',state:'active'},{name:'Campi sensibili',detail:'Da correlare',state:'risk'},{name:'Endpoint',detail:'Non contattato',state:'safe'}],
    afterNodes:[{name:'schema.graphql',detail:'Analizzato',state:'owned'},{name:'resolver-map.json',detail:'Correlato',state:'owned'},{name:'Campi sensibili',detail:'2 gap trovati',state:'risk'},{name:'Endpoint',detail:'Zero query',state:'safe'}]
  }
];

const AUG21_DEFENSE = [
  {
    id:'def-oauth-hardening-local',domain:'IDENTITÀ E OAUTH',level:'Avanzato',title:'Rafforza il client OAuth di laboratorio',
    objective:'Imposta redirect esatto, PKCE S256, code flow e controlli state/nonce nel file di configurazione locale.',
    story:'La review ha trovato wildcard e PKCE disattivato. Devi applicare una baseline verificabile nel client demo.',
    lesson:'Il client deve ridurre i punti di ambiguità del flow. Redirect esatti e PKCE proteggono il codice di autorizzazione; state e nonce collegano la risposta alla sessione attesa.',
    prompt:'defend$',task:'Scrivi il comando che applica redirect exact, pkce S256, grant authorization-code e state/nonce required.',format:'Un comando defend identity oauth-policy.',
    answer:'defend identity oauth-policy --client app-lab --redirect exact --pkce S256 --grant authorization-code --state required --nonce required',
    tokens:['defend','identity','oauth-policy','--client','app-lab','--redirect','exact','--pkce','s256','--grant','authorization-code','--state','required','--nonce','required'],
    hints:['Usa defend identity oauth-policy.','Imposta redirect exact, PKCE S256 e authorization-code.','Codice completo: defend identity oauth-policy --client app-lab --redirect exact --pkce S256 --grant authorization-code --state required --nonce required'],
    output:'[REDIRECT] exact match required\n[PKCE] S256 required\n[GRANT] authorization-code only\n[STATE/NONCE] required\nFLAG{OAUTH_CLIENT_HARDENED}',
    explanation:[['identity oauth-policy','applica la baseline al client demo','centralizza i controlli del flow'],['--redirect exact','nega wildcard nel redirect','riduce destinazioni ambigue'],['--pkce S256','richiede proof key con metodo forte','lega la redemption del code al client che ha iniziato il flow'],['--grant authorization-code','limita il flow a quello previsto','rimuove grant legacy non necessari'],['--state required / --nonce required','richiede correlazione con la sessione','riduce replay e confusione del flow']],
    attackView:'La configurazione debole non è più accettata e i test locali devono fallire in presenza di redirect non esatti o PKCE assente.',
    nodes:[{name:'app-lab',detail:'Config debole',state:'risk'},{name:'Redirect',detail:'Wildcard',state:'risk'},{name:'PKCE',detail:'OFF',state:'risk'},{name:'Flow',detail:'Legacy attivo',state:'risk'}],
    afterNodes:[{name:'app-lab',detail:'Baseline applicata',state:'safe'},{name:'Redirect',detail:'Exact',state:'safe'},{name:'PKCE',detail:'S256',state:'safe'},{name:'Flow',detail:'Code only',state:'safe'}]
  },
  {
    id:'def-container-hardening',domain:'CONTAINER E KUBERNETES',level:'Esperto',title:'Applica un security context minimo',
    objective:'Imposta non-root, filesystem read-only, capability drop e seccomp su un manifest demo.',
    story:'Il manifest precedente usava root e privileged. Devi trasformarlo in una configurazione a privilegi minimi senza avviare il pod.',
    lesson:'Il container va trattato come processo non fidato: meno capability, meno accesso al filesystem e separazione dal nodo riducono l’impatto di un difetto applicativo.',
    prompt:'defend$',task:'Scrivi il comando che imposta run-as-non-root, privileged off, read-only-rootfs on, drop ALL e seccomp runtime-default.',format:'Un comando defend container harden.',
    answer:'defend container harden --file pod-lab.json --run-as-non-root on --privileged off --read-only-rootfs on --drop-capabilities ALL --seccomp runtime-default',
    tokens:['defend','container','harden','--file','pod-lab.json','--run-as-non-root','on','--privileged','off','--read-only-rootfs','on','--drop-capabilities','all','--seccomp','runtime-default'],
    hints:['Usa defend container harden.','Configura non-root, privileged off e filesystem read-only.','Codice completo: defend container harden --file pod-lab.json --run-as-non-root on --privileged off --read-only-rootfs on --drop-capabilities ALL --seccomp runtime-default'],
    output:'[SECURITY] runAsNonRoot=true privileged=false\n[FILESYSTEM] readOnlyRootFilesystem=true\n[CAPABILITIES] drop=[ALL]\n[SECCOMP] RuntimeDefault\nFLAG{CONTAINER_BASELINE_APPLIED}',
    explanation:[['container harden','applica controlli al manifest locale','riduce privilegi prima del deploy'],['--run-as-non-root on','impedisce l’esecuzione come root','limita il potere del processo'],['--privileged off','disabilita il container privilegiato','mantiene isolamento dal nodo'],['--read-only-rootfs on','rende immutabile il filesystem root','riduce modifiche persistenti'],['--drop-capabilities ALL','rimuove capability Linux aggiuntive','applica minimo privilegio'],['--seccomp runtime-default','usa il profilo syscall predefinito del runtime','riduce la superficie kernel']],
    attackView:'Un difetto nell’applicazione ha meno possibilità di modificare il container o interagire con il nodo.',
    nodes:[{name:'pod-lab.json',detail:'Config debole',state:'risk'},{name:'Root',detail:'Consentito',state:'risk'},{name:'Capabilities',detail:'Ampie',state:'risk'},{name:'Filesystem',detail:'Scrivibile',state:'risk'}],
    afterNodes:[{name:'pod-lab.json',detail:'Hardening applicato',state:'safe'},{name:'Root',detail:'Negato',state:'safe'},{name:'Capabilities',detail:'Drop ALL',state:'safe'},{name:'Filesystem',detail:'Read-only',state:'safe'}]
  },
  {
    id:'def-auth-sequence-detection',domain:'LOG E ANTI-EVASIONE',level:'Pro',title:'Correla una sequenza di autenticazione anomala',
    objective:'Rileva nei log sintetici la combinazione token-reuse, privilege-change e bulk-export preservando le evidenze.',
    story:'events-auth-lab.json contiene eventi inventati. Devi correlare segnali in una finestra temporale senza cancellare log, attribuire identità reale o bloccare utenti automaticamente.',
    lesson:'L’anti-evasione difensiva usa più segnali e preserva le prove. Un singolo IP o user-agent non dimostra chi sia una persona; la risposta deve aprire una review e mantenere l’integrità dei log.',
    prompt:'defend$',task:'Scrivi la regola che correla token-reuse,privilege-change,bulk-export in 15m e apre review con preserve-evidence.',format:'Un comando defend log correlate.',
    answer:'defend log correlate --file events-auth-lab.json --sequence token-reuse,privilege-change,bulk-export --window 15m --action review --preserve-evidence on',
    tokens:['defend','log','correlate','--file','events-auth-lab.json','--sequence','token-reuse','privilege-change','bulk-export','--window','15m','--action','review','--preserve-evidence','on'],
    hints:['Inizia con defend log correlate.','Specifica il file, i tre segnali e una finestra di 15m.','Codice completo: defend log correlate --file events-auth-lab.json --sequence token-reuse,privilege-change,bulk-export --window 15m --action review --preserve-evidence on'],
    output:'[CORRELATE] 120 eventi sintetici\n[MATCH] session=lab-42 sequence completa in 9m\n[ACTION] review aperta\n[EVIDENCE] hash manifest preservato\n[ATTRIBUTION] nessuna identità reale dedotta\nFLAG{MULTI_SIGNAL_DETECTION}',
    explanation:[['log correlate','correla eventi locali ordinati nel tempo','trova pattern che un singolo alert non mostra'],['--file events-auth-lab.json','usa soltanto dati sintetici','mantiene il laboratorio isolato'],['--sequence ...','richiede tre segnali distinti','riduce decisioni basate su un singolo indicatore'],['--window 15m','definisce la finestra temporale','lega gli eventi alla stessa sequenza operativa'],['--action review','apre una verifica umana','evita blocchi automatici non proporzionati'],['--preserve-evidence on','preserva manifest e hash dei log','mantiene integrità e tracciabilità']],
    attackView:'Tentativi di mimetizzare una singola azione vengono meno efficaci quando il blue team correla comportamento e sequenza mantenendo i log integri.',
    nodes:[{name:'events-auth-lab.json',detail:'120 eventi',state:'active'},{name:'Session lab-42',detail:'Segnali separati',state:'risk'},{name:'Detection',detail:'Da correlare',state:'active'},{name:'Evidence',detail:'Da preservare',state:'risk'}],
    afterNodes:[{name:'events-auth-lab.json',detail:'Analizzato',state:'safe'},{name:'Session lab-42',detail:'Sequenza rilevata',state:'risk'},{name:'Detection',detail:'Review aperta',state:'active'},{name:'Evidence',detail:'Hash preservato',state:'safe'}]
  }
];

CYBERFORGE_ATTACK.push(...AUG21_ATTACK);
CYBERFORGE_DEFENSE.push(...AUG21_DEFENSE);
