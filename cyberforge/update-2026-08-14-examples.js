Object.assign(REAL_WORLD_EXAMPLES,{
  'atk-tls-local-review':{
    language:'Python',title:'Revisionare metadati TLS da un file locale',
    scope:'Legge solo certificate-lab.json; non apre socket e non contatta host esterni.',
    code:`from pathlib import Path\nimport json\nfrom datetime import datetime, timezone\n\nmeta = json.loads(Path("certificate-lab.json").read_text())\nexpires = datetime.fromisoformat(meta["not_after"])\nnow = datetime.now(timezone.utc)\n\nprint("hostname:", meta["hostname"])\nprint("days_left:", (expires - now).days)\nprint("tls_min:", meta["tls_min"])`,
    lines:[['Path(...).read_text()','legge il file locale'],['json.loads(...)','converte il JSON in un oggetto Python'],['datetime.fromisoformat(...)','interpreta la data di scadenza'],['(expires - now).days','calcola i giorni residui'],['print(...)','mostra i valori da confrontare con la baseline']],
    purpose:'Serve a costruire controlli automatici su configurazioni TLS esportate da sistemi propri.'
  },
  'atk-sbom-local-audit':{
    language:'Python',title:'Confrontare una SBOM locale con una allowlist',
    scope:'Legge sbom-lab.json e policy-lab.json locali; non scarica dipendenze e non interroga registry.',
    code:`from pathlib import Path\nimport json\n\nsbom = json.loads(Path("sbom-lab.json").read_text())\npolicy = json.loads(Path("policy-lab.json").read_text())\napproved = set(policy["approved_components"])\n\nfor component in sbom["components"]:\n    name = component["name"]\n    if name not in approved:\n        print("Da revisionare:", name)`,
    lines:[['json.loads(...)','carica inventario e policy'],['set(...)','crea una collezione efficiente di componenti approvati'],['for component ...','scorre i componenti della SBOM'],['if name not in approved','individua elementi fuori allowlist'],['print(...)','segnala il componente per revisione']],
    purpose:'Serve a introdurre controlli supply-chain riproducibili in CI su progetti controllati.'
  },
  'atk-jwt-claims-offline':{
    language:'Python',title:'Decodificare claim di un JWT demo senza verificarlo',
    scope:'Usa esclusivamente token-demo.txt sintetico. Non invia il token a servizi e non lo usa per autenticarsi.',
    code:`from pathlib import Path\nimport base64, json\n\ntoken = Path("token-demo.txt").read_text().strip()\npayload = token.split(".")[1]\npayload += "=" * (-len(payload) % 4)\nclaims = json.loads(base64.urlsafe_b64decode(payload))\n\nfor key in ("iss", "aud", "exp", "role"):\n    print(key, claims.get(key))`,
    lines:[['token.split(".")[1]','estrae il payload del token demo'],['"=" * (-len(payload) % 4)','ripristina il padding Base64'],['urlsafe_b64decode(...)','decodifica il payload locale'],['json.loads(...)','interpreta i claim JSON'],['claims.get(key)','legge solo i claim richiesti']],
    purpose:'Serve a capire la struttura dei JWT. In produzione la decodifica non sostituisce mai la verifica crittografica lato server.'
  },
  'def-web-cors':{
    language:'ASP.NET Core / C#',title:'Configurare una policy CORS esplicita',
    scope:'Codice applicativo per una propria API locale ASP.NET Core.',
    code:`builder.Services.AddCors(options =>\n{\n    options.AddPolicy("LocalUi", policy =>\n        policy.WithOrigins("https://localhost:4200")\n              .WithMethods("GET", "POST")\n              .AllowAnyHeader());\n});\n\napp.UseCors("LocalUi");`,
    lines:[['AddCors(...)','registra il servizio CORS'],['AddPolicy("LocalUi", ...)','crea una policy nominata'],['WithOrigins(...)','consente una sola origine locale'],['WithMethods("GET", "POST")','limita i metodi ammessi'],['UseCors("LocalUi")','attiva la policy nel middleware']],
    purpose:'Serve a evitare wildcard non necessarie in una API posseduta. L’autorizzazione server-side resta comunque obbligatoria.'
  },
  'def-backup-restore-test':{
    language:'Python',title:'Verificare hash e contenuto di un backup demo',
    scope:'Lavora solo su backup-demo.zip, manifest.sha256 e cartella restore-sandbox locali.',
    code:`from pathlib import Path\nfrom hashlib import sha256\nfrom zipfile import ZipFile\n\nbackup = Path("backup-demo.zip")\nexpected = Path("manifest.sha256").read_text().split()[0]\nactual = sha256(backup.read_bytes()).hexdigest()\nassert actual == expected, "Checksum non valido"\n\nPath("restore-sandbox").mkdir(exist_ok=True)\nwith ZipFile(backup) as archive:\n    archive.extractall("restore-sandbox")\n\nprint("Ripristino sandbox completato")`,
    lines:[['sha256(backup.read_bytes())','calcola l’hash del backup locale'],['assert actual == expected','interrompe il test se l’integrità non coincide'],['mkdir(exist_ok=True)','crea una destinazione separata'],['ZipFile(...)','apre il backup demo'],['extractall("restore-sandbox")','ripristina solo nella sandbox']],
    purpose:'Serve a trasformare il backup da semplice copia a procedura di recupero verificabile.'
  },
  'def-identity-correlation':{
    language:'Python',title:'Correlare eventi di autenticazione sintetici',
    scope:'Legge solo events-auth.json locale e non esegue blocchi o attribuzioni automatiche.',
    code:`from pathlib import Path\nimport json\n\nevents = json.loads(Path("events-auth.json").read_text())\nsignals = ("new_device", "new_country", "session_anomaly", "mfa_failure")\n\nfor event in events:\n    score = sum(bool(event.get(signal)) for signal in signals)\n    if score >= 3:\n        print("Review:", event["session_id"], "signals=", score)`,
    lines:[['signals = (...)','definisce indicatori indipendenti'],['for event in events','scorre gli eventi sintetici'],['sum(bool(...))','conta i segnali presenti'],['if score >= 3','applica una soglia multi-segnale'],['print("Review"...)','richiede revisione senza attribuire un’identità']],
    purpose:'Serve a costruire detection più robuste evitando di trattare l’indirizzo IP come prova di identità.'
  }
});