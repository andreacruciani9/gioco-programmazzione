Object.assign(REAL_WORLD_EXAMPLES,{
  'atk-network-segmentation-review':{
    language:'Python',title:'Confrontare topologia e policy offline',
    scope:'Legge soltanto topology-lab.json e segmentation-policy.json; non apre socket e non genera traffico.',
    code:`from pathlib import Path\nimport json\n\ntopology = json.loads(Path("topology-lab.json").read_text())\npolicy = json.loads(Path("segmentation-policy.json").read_text())\n\nallowed = {(x["src"], x["dst"]) for x in policy["allow"]}\nfor flow in topology["flows"]:\n    pair = (flow["src"], flow["dst"])\n    expected = flow.get("expected", "deny")\n    actual = "allow" if pair in allowed else "deny"\n    if actual != expected:\n        print("Mismatch:", pair, "actual=", actual, "expected=", expected)`,
    lines:[['Path(...).read_text()','legge esclusivamente i file locali'],['allowed = {...}','costruisce l’insieme dei flussi consentiti'],['for flow in topology["flows"]','esamina i flussi sintetici dichiarati'],['actual != expected','confronta comportamento e baseline'],['print(...)','segnala soltanto le incoerenze']],
    purpose:'Serve a revisionare segmentazione e regole esportate da ambienti posseduti senza effettuare scansioni.'
  },
  'atk-web-csp-review':{
    language:'Python',title:'Revisionare una CSP da un file locale',
    scope:'Analizza headers-lab.json; non apre browser, URL o connessioni HTTP.',
    code:`from pathlib import Path\nimport json\n\nheaders = json.loads(Path("headers-lab.json").read_text())\ncsp = headers.get("Content-Security-Policy", "")\n\nrequired = ["default-src", "script-src", "object-src", "frame-ancestors", "base-uri"]\nfor directive in required:\n    if directive not in csp:\n        print("Missing:", directive)\nif "'unsafe-inline'" in csp:\n    print("Review: inline scripts are allowed")`,
    lines:[['json.loads(...)','carica header sintetici'],['csp = ...','estrae la policy CSP'],['required = [...]','definisce le direttive attese'],['directive not in csp','trova requisiti mancanti'],['unsafe-inline','segnala una scelta da riesaminare']],
    purpose:'Serve a fare code/config review difensiva su header posseduti o sintetici.'
  },
  'atk-cloud-iam-review':{
    language:'Python',title:'Confrontare policy IAM sintetiche con least privilege',
    scope:'Legge file JSON locali e non usa SDK, token o API cloud.',
    code:`from pathlib import Path\nimport json\n\niam = json.loads(Path("iam-lab.json").read_text())\nbaseline = json.loads(Path("least-privilege.json").read_text())\n\nfor role, actions in iam["roles"].items():\n    allowed = set(baseline.get(role, []))\n    effective = set(actions)\n    extra = effective - allowed\n    if extra:\n        print(role, "extra actions:", sorted(extra))`,
    lines:[['iam = ...','carica ruoli sintetici locali'],['baseline = ...','carica la baseline minima'],['effective = set(actions)','normalizza i permessi effettivi'],['effective - allowed','calcola i privilegi eccedenti'],['print(...)','mostra soltanto le differenze']],
    purpose:'Serve a verificare least privilege offline prima di applicare policy a un ambiente autorizzato.'
  },
  'def-network-segmentation-tests':{
    language:'Python + unittest',title:'Testare una matrice di segmentazione locale',
    scope:'Esegue test solo su un dizionario locale; non configura firewall né invia pacchetti.',
    code:`import unittest\n\nRULES = {\n    ("guest", "db"): "deny",\n    ("guest", "app"): "deny",\n    ("app", "db"): "allow:tcp/5432",\n}\n\nclass SegmentationTests(unittest.TestCase):\n    def test_guest_to_db_denied(self):\n        self.assertEqual(RULES[("guest", "db")], "deny")\n\n    def test_app_to_db_limited(self):\n        self.assertEqual(RULES[("app", "db")], "allow:tcp/5432")\n\nif __name__ == "__main__":\n    unittest.main()`,
    lines:[['RULES = {...}','rappresenta una policy sintetica'],['SegmentationTests','definisce regressioni automatiche'],['test_guest_to_db_denied','verifica il confine guest/database'],['test_app_to_db_limited','verifica il solo flusso necessario'],['unittest.main()','esegue i test localmente']],
    purpose:'Serve a trasformare requisiti di segmentazione in test ripetibili prima della distribuzione.'
  },
  'def-web-csp-tests':{
    language:'ASP.NET Core / C#',title:'Impostare e testare header CSP su localhost',
    scope:'Middleware destinato a un’app ASP.NET Core posseduta o localhost; non effettua richieste esterne.',
    code:`app.Use(async (context, next) =>\n{\n    context.Response.Headers.ContentSecurityPolicy =\n        "default-src 'self'; " +\n        "script-src 'self'; " +\n        "object-src 'none'; " +\n        "frame-ancestors 'none'; " +\n        "base-uri 'self'";\n\n    await next();\n});`,
    lines:[['app.Use(...)','intercetta le risposte dell’applicazione propria'],['Response.Headers.ContentSecurityPolicy','imposta l’header CSP'],['default-src e script-src','limitano le sorgenti alla stessa origine'],['object-src none','disabilita contenuti object'],['frame-ancestors none','impedisce il framing'],['base-uri self','limita il base URL'],['await next()','continua la pipeline']],
    purpose:'Serve a configurare una baseline CSP su applicazioni locali e a coprirla con integration test.'
  },
  'def-cloud-iam-least-privilege-tests':{
    language:'Python + test locale',title:'Validare una policy least-privilege sintetica',
    scope:'Lavora esclusivamente su strutture dati locali; nessun account o provider cloud è coinvolto.',
    code:`required = {"artifact:read", "artifact:write"}\npolicy = {"artifact:read", "artifact:write"}\nboundary = {"artifact:read", "artifact:write", "build:status"}\n\nassert required <= policy\nassert policy <= boundary\nassert not any(action.endswith(":*") for action in policy)\nassert "admin:*" not in policy\n\nprint("Least privilege policy: PASS")`,
    lines:[['required = {...}','definisce le azioni minime richieste'],['policy = {...}','rappresenta il ruolo sintetico'],['boundary = {...}','definisce il limite massimo'],['required <= policy','verifica che il lavoro necessario resti possibile'],['policy <= boundary','impedisce di superare il boundary'],['endswith(":*")','fallisce se ricompare una wildcard'],['print(...)','conferma il test locale']],
    purpose:'Serve a verificare regressioni IAM in CI usando soltanto dati sintetici.'
  }
});
