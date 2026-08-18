Object.assign(REAL_WORLD_EXAMPLES,{
  'atk-network-acl-offline':{
    language:'Python',title:'Revisionare regole firewall esportate in JSON',
    scope:'Legge solo firewall-lab.json locale; non invia pacchetti, non apre socket e non modifica firewall.',
    code:`from pathlib import Path\nimport json\n\nrules = json.loads(Path("firewall-lab.json").read_text())\nadmin_ports = {22, 3389, 5985, 5986}\n\nfor rule in rules:\n    source_any = rule.get("source") in {"any", "0.0.0.0/0"}\n    admin_port = int(rule.get("port", 0)) in admin_ports\n    allowed = rule.get("action") == "allow"\n    if source_any and admin_port and allowed:\n        print("Da revisionare:", rule["id"])`,
    lines:[['Path(...).read_text()','legge soltanto l’export locale'],['admin_ports = {...}','definisce servizi amministrativi da controllare'],['source_any = ...','riconosce sorgenti troppo ampie'],['admin_port = ...','verifica se la porta è amministrativa'],['if source_any and admin_port and allowed','segnala solo la combinazione più rischiosa']],
    purpose:'Serve a fare policy review su configurazioni proprie senza effettuare scansioni di rete.'
  },
  'atk-ssrf-static-review':{
    language:'Python',title:'Cercare staticamente un fetch server-side non vincolato',
    scope:'Legge solo un file di codice locale posseduto; non esegue il programma e non effettua richieste HTTP.',
    code:`from pathlib import Path\n\nsource = Path("src/UrlPreviewService.cs").read_text()\nchecks = {\n    "http_client": "GetAsync(" in source,\n    "user_input": "userUrl" in source,\n    "host_allowlist": "AllowedHosts" in source,\n    "scheme_check": "Uri.UriSchemeHttps" in source\n}\n\nfor name, present in checks.items():\n    print(name, "OK" if present else "MISSING")`,
    lines:[['Path(...).read_text()','carica il sorgente locale'],['checks = {...}','definisce indicatori semplici da cercare'],['"GetAsync(" in source','rileva l’uso del client HTTP senza eseguirlo'],['"AllowedHosts" in source','controlla la presenza di una allowlist applicativa'],['print(...)','produce un report statico']],
    purpose:'Serve a introdurre una revisione SAST didattica. Un vero analyzer dovrebbe usare AST/data-flow invece di sole stringhe.'
  },
  'atk-cloud-iac-offline':{
    language:'Python',title:'Revisionare un piano IaC locale prima del deploy',
    scope:'Legge solo tfplan-lab.json sintetico; non usa credenziali cloud e non contatta provider.',
    code:`from pathlib import Path\nimport json\n\nplan = json.loads(Path("tfplan-lab.json").read_text())\n\nfor resource in plan["resources"]:\n    cfg = resource.get("config", {})\n    if cfg.get("cidr") == "0.0.0.0/0" and cfg.get("port") in (22, 3389):\n        print("Public admin ingress:", resource["name"])\n    if cfg.get("encryption") is False:\n        print("Encryption missing:", resource["name"])\n    if cfg.get("actions") == ["*"]:\n        print("Wildcard role:", resource["name"])`,
    lines:[['json.loads(...)','carica il piano sintetico'],['for resource ...','scorre le risorse previste'],['cidr == "0.0.0.0/0"','individua ingress pubblico nel modello'],['encryption is False','segnala storage senza cifratura'],['actions == ["*"]','segnala privilegi wildcard']],
    purpose:'Serve a creare controlli policy-as-code su artefatti locali prima che una modifica venga distribuita.'
  },
  'def-wifi-rogue-detect':{
    language:'Python',title:'Confrontare inventario Wi-Fi e osservazioni sintetiche',
    scope:'Legge inventory-ap.json e observed-ap.json locali; non usa la scheda Wi-Fi e non tenta connessioni.',
    code:`from pathlib import Path\nimport json\n\ninventory = json.loads(Path("inventory-ap.json").read_text())\nobserved = json.loads(Path("observed-ap.json").read_text())\nknown = {(ap["ssid"], ap["bssid"], ap["security"]) for ap in inventory}\n\nfor ap in observed:\n    fingerprint = (ap["ssid"], ap["bssid"], ap["security"])\n    if fingerprint not in known:\n        print("Review AP:", ap["ssid"], ap["bssid"])`,
    lines:[['json.loads(...)','carica i due dataset locali'],['known = {...}','crea la baseline autorizzata'],['fingerprint = (...)','combina più attributi invece del solo SSID'],['if fingerprint not in known','identifica una discrepanza'],['print("Review AP"...)','richiede verifica senza collegarsi al dispositivo']],
    purpose:'Serve a capire come costruire detection basate su inventario e fingerprint mantenendo il laboratorio completamente offline.'
  },
  'def-api-contract-validation':{
    language:'ASP.NET Core / C#',title:'Validare input e autenticazione su una API localhost',
    scope:'Codice per una propria API ASP.NET Core e relativi test di integrazione locali.',
    code:`public sealed record OrderCreate(string ProductCode, int Quantity);\n\napp.MapPost("/api/orders", (OrderCreate request) =>\n{\n    if (string.IsNullOrWhiteSpace(request.ProductCode) || request.ProductCode.Length > 40)\n        return Results.ValidationProblem(new Dictionary<string,string[]>\n        { ["ProductCode"] = ["Invalid product code"] });\n\n    if (request.Quantity is < 1 or > 100)\n        return Results.BadRequest();\n\n    return Results.Created("/api/orders/demo", request);\n}).RequireAuthorization();`,
    lines:[['record OrderCreate(...)','definisce un modello di input esplicito'],['MapPost("/api/orders"...)','registra la route posseduta'],['ProductCode.Length > 40','applica un limite server-side'],['Quantity is < 1 or > 100','valida l’intervallo numerico'],['RequireAuthorization()','richiede autenticazione per la route']],
    purpose:'Serve a rendere esplicito il contratto di una API e a verificarlo con test su localhost.'
  },
  'def-endpoint-allowlist-hash':{
    language:'Python',title:'Verificare hash di artefatti demo contro una allowlist',
    scope:'Legge solo demo-bin e allowlist.json locali; non avvia processi, non elimina e non modifica file.',
    code:`from pathlib import Path\nfrom hashlib import sha256\nimport json\n\nallowed = json.loads(Path("allowlist.json").read_text())\nfor path in Path("demo-bin").iterdir():\n    if not path.is_file():\n        continue\n    digest = sha256(path.read_bytes()).hexdigest()\n    expected = allowed.get(path.name)\n    if expected != digest:\n        print("ALERT:", path.name, "unknown-or-mismatch")`,
    lines:[['json.loads(...)','carica la baseline hash locale'],['Path("demo-bin").iterdir()','limita il controllo alla cartella demo'],['sha256(path.read_bytes())','calcola l’impronta del contenuto'],['allowed.get(path.name)','recupera l’hash atteso'],['if expected != digest','genera una segnalazione senza modificare il file']],
    purpose:'Serve a creare verifiche passive di integrità su artefatti controllati e a preservare le evidenze in caso di mismatch.'
  }
});