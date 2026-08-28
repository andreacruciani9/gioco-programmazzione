Object.assign(REAL_WORLD_EXAMPLES,{
  'atk-wifi-enterprise-config-audit':{
    language:'Python',title:'Revisionare una configurazione Wi-Fi locale',
    scope:'Legge soltanto wifi-enterprise-lab.json; non usa interfacce Wi-Fi, non scansiona reti e non apre connessioni.',
    code:`from pathlib import Path\nimport json\n\nconfig = json.loads(Path("wifi-enterprise-lab.json").read_text())\n\nif config.get("security") != "wpa3-enterprise":\n    print("Security baseline da aggiornare")\nif config.get("pmf") != "required":\n    print("PMF non obbligatorio")\nif not config.get("radiusServerNameValidation", False):\n    print("Validazione nome server RADIUS assente")`,
    lines:[['Path(...).read_text()','legge esclusivamente il file locale'],['json.loads(...)','converte il JSON sintetico in dati Python'],['security != "wpa3-enterprise"','verifica la baseline di sicurezza configurata'],['pmf != "required"','controlla la protezione dei management frame'],['radiusServerNameValidation','verifica che il trust del server sia esplicito']],
    purpose:'Serve a revisionare configurazioni Wi-Fi possedute o sintetiche senza interagire con reti radio.'
  },
  'atk-api-object-authz-matrix':{
    language:'Python',title:'Confrontare contratto API e matrice autorizzativa offline',
    scope:'Legge soltanto openapi-lab.json e authz-matrix.json; non avvia server e non invia richieste HTTP.',
    code:`from pathlib import Path\nimport json\n\napi = json.loads(Path("openapi-lab.json").read_text())\npolicy = json.loads(Path("authz-matrix.json").read_text())\n\nrequired = {"ownerCheck", "tenantBoundary", "negativeTests"}\nfor route in api["routes"]:\n    rules = set(policy.get(route["id"], []))\n    missing = required - rules\n    if missing:\n        print(route["id"], "missing:", ",".join(sorted(missing)))`,
    lines:[['Path(...).read_text()','carica soltanto i due file del laboratorio'],['required = {...}','definisce i controlli autorizzativi attesi'],['for route in api["routes"]','esamina ogni operazione dichiarata'],['policy.get(...)','recupera le regole associate alla rotta'],['required - rules','calcola i controlli mancanti senza eseguire l’API']],
    purpose:'Serve a individuare gap di object authorization tramite review statica di artefatti locali.'
  },
  'atk-ir-telemetry-gap-analysis':{
    language:'Python',title:'Rilevare silenzi anomali tra log sintetici',
    scope:'Analizza tre file JSONL locali e sintetici; non modifica gli originali e non contatta SIEM o endpoint.',
    code:`from pathlib import Path\nimport json\nfrom datetime import datetime, timezone\n\ndef load(path):\n    return [json.loads(x) for x in Path(path).read_text().splitlines() if x.strip()]\n\nendpoint = load("endpoint.jsonl")\nidentity = load("identity.jsonl")\napi = load("api.jsonl")\n\ndef minutes(events):\n    return {e["ts"][:16] for e in events}\n\nmissing = (minutes(identity) & minutes(api)) - minutes(endpoint)\nfor minute in sorted(missing):\n    print("Endpoint telemetry gap:", minute, "UTC")`,
    lines:[['load(path)','legge JSONL esclusivamente da file locali'],['minutes(events)','normalizza gli eventi al minuto per il laboratorio'],['minutes(identity) & minutes(api)','trova intervalli osservati da due fonti indipendenti'],['- minutes(endpoint)','evidenzia quando la terza sorgente è silente'],['print(...)','segnala il gap senza attribuire identità o spiegare come produrlo']],
    purpose:'Serve a insegnare correlazione difensiva e resilienza della telemetria usando solo dati sintetici.'
  },
  'def-wifi-enterprise-baseline':{
    language:'Python + test locale',title:'Validare una baseline Wi-Fi enterprise',
    scope:'Testa soltanto un file JSON locale; non applica configurazioni a dispositivi né usa hardware radio.',
    code:`from pathlib import Path\nimport json\n\nconfig = json.loads(Path("wifi-enterprise-lab.json").read_text())\n\nassert config["security"] == "wpa3-enterprise"\nassert config["pmf"] == "required"\nassert config["radiusServerName"] == "radius.lab.local"\nassert config["radiusCA"] == "LabRootCA"\n\nprint("Wi-Fi enterprise baseline: PASS")`,
    lines:[['assert security == ...','richiede la baseline WPA3-Enterprise del laboratorio'],['assert pmf == "required"','verifica PMF obbligatorio'],['radiusServerName','vincola il nome atteso del server demo'],['radiusCA','vincola la CA sintetica attesa'],['print(...)','conferma il superamento del test locale']],
    purpose:'Serve a trasformare requisiti Wi-Fi difensivi in test automatici su configurazioni possedute.'
  },
  'def-api-object-authz-policy':{
    language:'ASP.NET Core / C#',title:'Applicare object authorization server-side',
    scope:'Esempio per API localhost o possedute con dati sintetici; non include chiamate a servizi esterni.',
    code:`public async Task<IActionResult> GetProject(long id)\n{\n    var project = await db.Projects.FindAsync(id);\n    if (project is null) return NotFound();\n\n    var userId = User.FindFirst("sub")?.Value;\n    var tenantId = User.FindFirst("tenant_id")?.Value;\n    var isAdmin = User.IsInRole("Admin");\n\n    if (project.TenantId != tenantId) return Forbid();\n    if (!isAdmin && project.OwnerId != userId) return Forbid();\n\n    return Ok(project);\n}`,
    lines:[['FindAsync(id)','recupera la risorsa lato server'],['FindFirst("sub")','legge l’identità già autenticata'],['FindFirst("tenant_id")','legge il tenant associato alla sessione'],['project.TenantId != tenantId','nega accessi cross-tenant'],['project.OwnerId != userId','nega accessi a oggetti non posseduti salvo ruolo autorizzato'],['return Ok(project)','restituisce la risorsa solo dopo i controlli']],
    purpose:'Serve a mostrare autorizzazione object-level difensiva su un’applicazione propria, con deny esplicito.'
  },
  'def-ir-resilient-evidence-bundle':{
    language:'Python',title:'Creare un manifest SHA-256 di evidenze locali',
    scope:'Lavora esclusivamente su tre file sintetici locali e crea copie nella cartella evidence-copy; non cancella né altera gli originali.',
    code:`from pathlib import Path\nimport hashlib, json, shutil\nfrom datetime import datetime, timezone\n\nsources = [Path("endpoint.jsonl"), Path("identity.jsonl"), Path("api.jsonl")]\nout = Path("evidence-copy")\nout.mkdir(exist_ok=True)\nmanifest = []\n\nfor src in sources:\n    data = src.read_bytes()\n    digest = hashlib.sha256(data).hexdigest()\n    dst = out / src.name\n    shutil.copy2(src, dst)\n    dst.chmod(0o444)\n    manifest.append({"file": src.name, "sha256": digest})\n\nrecord = {"createdUtc": datetime.now(timezone.utc).isoformat(), "files": manifest}\n(out / "manifest.json").write_text(json.dumps(record, indent=2))\nprint("Evidence bundle created")`,
    lines:[['sources = [...]','definisce solo i tre file sintetici del laboratorio'],['read_bytes()','legge l’originale senza modificarlo'],['hashlib.sha256(...)','calcola il digest di integrità'],['shutil.copy2(...)','crea una copia di lavoro separata'],['chmod(0o444)','rende la copia non scrivibile nel laboratorio Unix'],['createdUtc','registra un timestamp UTC del bundle'],['manifest.json','salva nomi e digest per verifiche successive']],
    purpose:'Serve a esercitare preservazione, integrità e catena di custodia su evidenze sintetiche senza cancellare tracce o alterare fonti.'
  }
});
