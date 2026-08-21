Object.assign(REAL_WORLD_EXAMPLES,{
  'atk-oauth-config-offline':{
    language:'Python',title:'Revisionare una configurazione OAuth esportata',
    scope:'Legge solo oauth-client-lab.json locale; non apre browser, non usa token e non contatta provider OAuth.',
    code:`from pathlib import Path\nimport json\n\nclient = json.loads(Path("oauth-client-lab.json").read_text())\nredirects = client.get("redirect_uris", [])\n\nfor uri in redirects:\n    if "*" in uri:\n        print("Wildcard redirect da rimuovere:", uri)\n\nif client.get("pkce_required") is not True:\n    print("PKCE non obbligatorio")\n\nif "implicit" in client.get("grant_types", []):\n    print("Grant legacy da revisionare")`,
    lines:[['Path(...).read_text()','legge esclusivamente il file di configurazione locale'],['json.loads(...)','trasforma il JSON in dati Python'],['if "*" in uri','segnala redirect con wildcard'],['pkce_required is not True','verifica che PKCE sia obbligatorio'],['"implicit" in grant_types','individua un flow legacy da riesaminare']],
    purpose:'Serve a controllare configurazioni OAuth possedute prima del rilascio, senza autenticarsi né usare credenziali.'
  },
  'atk-container-manifest-review':{
    language:'Python',title:'Revisionare un manifest Kubernetes offline',
    scope:'Legge soltanto pod-lab.json sintetico; non usa kubectl, non accede a cluster e non avvia container.',
    code:`from pathlib import Path\nimport json\n\npod = json.loads(Path("pod-lab.json").read_text())\nspec = pod.get("spec", {})\ncontainer = spec.get("containers", [{}])[0]\nsecurity = container.get("securityContext", {})\n\nchecks = {\n    "privileged": security.get("privileged") is True,\n    "root": security.get("runAsUser") == 0,\n    "hostNetwork": spec.get("hostNetwork") is True,\n    "writableRoot": security.get("readOnlyRootFilesystem") is not True\n}\n\nfor name, risky in checks.items():\n    if risky:\n        print("Review:", name)`,
    lines:[['json.loads(...)','carica il manifest sintetico'],['securityContext','estrae la configurazione di sicurezza del container'],['privileged is True','segnala un container privilegiato'],['runAsUser == 0','segnala esecuzione come root'],['hostNetwork is True','rileva uso della rete del nodo'],['readOnlyRootFilesystem is not True','segnala filesystem root scrivibile']],
    purpose:'Serve a introdurre policy-as-code per manifest posseduti senza interagire con un cluster reale.'
  },
  'atk-graphql-authz-static':{
    language:'Python',title:'Correlare campi GraphQL e policy di autorizzazione',
    scope:'Legge schema.graphql e resolver-map.json locali; non invia query a endpoint GraphQL.',
    code:`from pathlib import Path\nimport json\nimport re\n\nschema = Path("schema.graphql").read_text()\nresolver_map = json.loads(Path("resolver-map.json").read_text())\n\nsensitive = re.findall(r"(salary|privateNotes)\\s*:", schema)\nfor field in sensitive:\n    key = f"User.{field}"\n    policy = resolver_map.get(key, {})\n    if not policy.get("authorization"):\n        print("Missing authz:", key)`,
    lines:[['Path("schema.graphql").read_text()','carica lo schema locale'],['json.loads(...)','carica la mappa sintetica dei resolver'],['re.findall(...)','individua i campi sensibili definiti nel laboratorio'],['resolver_map.get(...)','recupera la policy del resolver'],['if not authorization','segnala l’assenza di controllo server-side']],
    purpose:'Serve a fare code review statica dell’autorizzazione GraphQL senza interrogare servizi.'
  },
  'def-oauth-hardening-local':{
    language:'Python + test locale',title:'Validare una baseline OAuth nel file di configurazione',
    scope:'Testa soltanto oauth-client-lab.json locale; non avvia flow OAuth e non contatta provider.',
    code:`from pathlib import Path\nimport json\n\nclient = json.loads(Path("oauth-client-lab.json").read_text())\n\nassert all("*" not in uri for uri in client["redirect_uris"])\nassert client["pkce_required"] is True\nassert client["pkce_method"] == "S256"\nassert client["grant_types"] == ["authorization_code"]\nassert client["state_required"] is True\nassert client["nonce_required"] is True\n\nprint("OAuth baseline: PASS")`,
    lines:[['assert all("*" not in uri...)','impedisce redirect URI con wildcard'],['pkce_required is True','richiede PKCE'],['pkce_method == "S256"','richiede il metodo PKCE forte'],['grant_types == ["authorization_code"]','limita i flow abilitati'],['state_required / nonce_required','verifica correlazione della sessione']],
    purpose:'Serve a trasformare la baseline OAuth in un controllo automatico eseguibile in CI su configurazioni proprie.'
  },
  'def-container-hardening':{
    language:'Kubernetes YAML',title:'Applicare un securityContext a privilegi minimi',
    scope:'Esempio di manifest per workload posseduti; non esegue kubectl e non modifica cluster.',
    code:`apiVersion: v1\nkind: Pod\nmetadata:\n  name: app-lab\nspec:\n  hostNetwork: false\n  securityContext:\n    runAsNonRoot: true\n    seccompProfile:\n      type: RuntimeDefault\n  containers:\n    - name: app\n      image: example.local/app:demo\n      securityContext:\n        privileged: false\n        readOnlyRootFilesystem: true\n        allowPrivilegeEscalation: false\n        capabilities:\n          drop: ["ALL"]`,
    lines:[['hostNetwork: false','mantiene il pod fuori dalla rete del nodo'],['runAsNonRoot: true','impedisce l’avvio come root'],['seccompProfile: RuntimeDefault','usa il profilo syscall del runtime'],['privileged: false','nega modalità privilegiata'],['readOnlyRootFilesystem: true','rende il filesystem root non scrivibile'],['allowPrivilegeEscalation: false','impedisce aumento di privilegi nel processo'],['drop: ["ALL"]','rimuove capability Linux aggiuntive']],
    purpose:'Serve come baseline difensiva da sottoporre a review e test policy-as-code prima del deploy.'
  },
  'def-auth-sequence-detection':{
    language:'Python',title:'Correlare una sequenza multi-segnale nei log sintetici',
    scope:'Legge solo events-auth-lab.json; non blocca account, non modifica log e non tenta attribuzione personale.',
    code:`from pathlib import Path\nfrom datetime import datetime, timedelta\nimport json\n\nevents = json.loads(Path("events-auth-lab.json").read_text())\nrequired = ["token-reuse", "privilege-change", "bulk-export"]\n\nby_session = {}\nfor event in events:\n    by_session.setdefault(event["session"], []).append(event)\n\nfor session, items in by_session.items():\n    items.sort(key=lambda e: e["time"])\n    kinds = {e["kind"] for e in items}\n    if all(kind in kinds for kind in required):\n        first = datetime.fromisoformat(items[0]["time"])\n        last = datetime.fromisoformat(items[-1]["time"])\n        if last - first <= timedelta(minutes=15):\n            print("REVIEW:", session)`,
    lines:[['json.loads(...)','carica eventi sintetici locali'],['by_session.setdefault(...)','raggruppa gli eventi per sessione del laboratorio'],['items.sort(...)','ordina la timeline'],['all(kind in kinds...)','richiede più segnali prima di aprire una review'],['timedelta(minutes=15)','limita la correlazione alla finestra prevista'],['print("REVIEW"...)','segnala senza bloccare o alterare le evidenze']],
    purpose:'Serve a costruire detection comportamentali e anti-evasione basate su correlazione, preservando log e revisione umana.'
  }
});
