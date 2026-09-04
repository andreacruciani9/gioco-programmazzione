Object.assign(REAL_WORLD_EXAMPLES,{
  'atk-api-replay-review':{
    language:'Python',title:'Correlare duplicati da un log JSONL locale',
    scope:'Legge soltanto api-requests-lab.jsonl e non invia richieste HTTP.',
    code:`from pathlib import Path\nimport json\nfrom collections import defaultdict\n\nseen = defaultdict(list)\nfor line in Path("api-requests-lab.jsonl").read_text().splitlines():\n    event = json.loads(line)\n    key = (event.get("user"), event.get("idempotency_key"))\n    seen[key].append(event)\n\nfor key, events in seen.items():\n    if key[1] and len(events) > 1:\n        print("Review duplicate:", key, "count=", len(events))`,
    lines:[['Path(...).read_text()','legge il file JSONL locale'],['json.loads(line)','deserializza un evento sintetico'],['key = (...)','lega la chiave al contesto utente'],['seen[key].append(event)','raggruppa i possibili retry'],['len(events) > 1','segnala duplicazioni da revisionare']],
    purpose:'Serve a verificare offline la telemetria di API possedute senza generare traffico.'
  },
  'atk-cloud-storage-policy-review':{
    language:'Python',title:'Revisionare policy storage sintetiche offline',
    scope:'Analizza storage-lab.json senza SDK, token o connessioni cloud.',
    code:`from pathlib import Path\nimport json\n\ndata = json.loads(Path("storage-lab.json").read_text())\nfor bucket in data["buckets"]:\n    findings = []\n    if bucket.get("public"):\n        findings.append("public-access")\n    if "*" in bucket.get("principals", []):\n        findings.append("wildcard-principal")\n    if not bucket.get("encryption"):\n        findings.append("missing-encryption")\n    if findings:\n        print(bucket["name"], findings)`,
    lines:[['json.loads(...)','carica configurazioni sintetiche'],['for bucket ...','esamina ogni storage demo'],['bucket.get("public")','controlla esposizione pubblica'],['"*" in principals','trova principal wildcard'],['not bucket.get("encryption")','verifica cifratura dichiarata'],['print(...)','riporta solo i finding']],
    purpose:'Serve a fare policy-as-code review prima di distribuire configurazioni cloud autorizzate.'
  },
  'atk-endpoint-startup-integrity-review':{
    language:'Python',title:'Confrontare inventario endpoint e baseline senza eseguire file',
    scope:'Lavora esclusivamente su due file JSON locali contenenti metadati sintetici.',
    code:`from pathlib import Path\nimport json\n\ncurrent = json.loads(Path("startup-lab.json").read_text())\nbaseline = json.loads(Path("startup-baseline.json").read_text())\napproved = {x["name"]: x for x in baseline["entries"]}\n\nfor item in current["entries"]:\n    old = approved.get(item["name"])\n    if old is None:\n        print("New entry:", item["name"])\n    elif item.get("sha256") != old.get("sha256"):\n        print("Hash mismatch:", item["name"])`,
    lines:[['current = ...','carica inventario sintetico'],['baseline = ...','carica lo stato approvato'],['approved = {...}','indicizza gli elementi attesi'],['old is None','rileva un nuovo elemento'],['sha256 != ...','rileva una variazione di integrità']],
    purpose:'Serve a detection difensiva basata su integrità senza enumerare o avviare programmi reali.'
  },
  'def-api-idempotency-tests':{
    language:'ASP.NET Core / C#',title:'Testare idempotenza su una API localhost',
    scope:'Esempio destinato a una API posseduta in localhost con store in memoria e payload sintetici.',
    code:`public sealed record CachedResult(string User, string Operation, string PayloadHash, object Result);\n\nvar cache = new Dictionary<string, CachedResult>();\n\nIResult Execute(string key, string user, string operation, string payloadHash)\n{\n    if (cache.TryGetValue(key, out var existing))\n    {\n        if (existing.User != user || existing.Operation != operation || existing.PayloadHash != payloadHash)\n            return Results.Conflict(new { error = "idempotency-key-reuse" });\n\n        return Results.Ok(existing.Result);\n    }\n\n    var result = new { status = "created" };\n    cache[key] = new CachedResult(user, operation, payloadHash, result);\n    return Results.Created("/localhost/demo", result);\n}`,
    lines:[['CachedResult','salva il contesto associato alla chiave'],['Dictionary','simula uno store locale'],['TryGetValue','riconosce un retry già visto'],['confronto user/operation/hash','rifiuta il riuso incoerente'],['Results.Ok','restituisce il risultato precedente al retry equivalente'],['Results.Created','registra solo la prima esecuzione']],
    purpose:'Serve a implementare e testare idempotenza in un servizio locale prima del deploy.'
  },
  'def-cloud-storage-private-baseline':{
    language:'Python + test locale',title:'Validare una baseline storage privata',
    scope:'Usa soltanto dizionari Python sintetici e non contatta provider cloud.',
    code:`policy = {\n    "public": False,\n    "principals": ["app-reader"],\n    "encryption": "required",\n    "retention_days": 30,\n}\n\nassert policy["public"] is False\nassert "*" not in policy["principals"]\nassert policy["encryption"] == "required"\nassert policy["retention_days"] > 0\n\nprint("Storage baseline: PASS")`,
    lines:[['policy = {...}','rappresenta una configurazione sintetica'],['public is False','verifica private-by-default'],['"*" not in principals','impedisce principal wildcard'],['encryption == required','rende esplicito il requisito di cifratura'],['retention_days > 0','verifica una conservazione definita'],['print(...)','conferma il test locale']],
    purpose:'Serve a trasformare requisiti di privacy e cloud governance in controlli automatici.'
  },
  'def-endpoint-evidence-preserve-detect':{
    language:'Python',title:'Creare un manifest di evidenze locali con SHA-256',
    scope:'Copia solo file sintetici da evidence-lab/ a evidence-copy/ e non elimina o modifica gli originali.',
    code:`from pathlib import Path\nfrom hashlib import sha256\nfrom datetime import datetime, timezone\nimport json, shutil\n\nsrc = Path("evidence-lab")\ndst = Path("evidence-copy")\ndst.mkdir(exist_ok=True)\nmanifest = []\n\nfor item in src.iterdir():\n    if not item.is_file():\n        continue\n    copied = dst / item.name\n    shutil.copy2(item, copied)\n    digest = sha256(copied.read_bytes()).hexdigest()\n    manifest.append({\n        "file": item.name,\n        "sha256": digest,\n        "source": str(item),\n        "captured_utc": datetime.now(timezone.utc).isoformat(),\n    })\n\n(dst / "manifest.json").write_text(json.dumps(manifest, indent=2))\nprint("Evidence preserved:", len(manifest))`,
    lines:[['Path("evidence-lab")','seleziona la sorgente sintetica'],['dst.mkdir(...)','prepara una cartella separata'],['shutil.copy2','copia senza cancellare l’origine'],['sha256(...).hexdigest()','calcola l’impronta della copia'],['captured_utc','registra un timestamp UTC'],['manifest.json','salva metadati e hash per verifiche successive']],
    purpose:'Serve a preservare integrità e provenienza delle evidenze locali prima della remediation.'
  }
});
