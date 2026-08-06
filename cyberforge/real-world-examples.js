const REAL_WORLD_EXAMPLES = {
  'atk-wifi-audit': {
    language: 'Python', title: 'Analizzare una configurazione Wi-Fi esportata dal proprio laboratorio',
    scope: 'Legge solo il file locale wifi_lab.json. Non cerca reti, non prova password e non usa l’interfaccia wireless.',
    code: `import json

with open("wifi_lab.json", encoding="utf-8") as file:
    access_points = json.load(file)

for ap in access_points:
    risky = ap["security"] != "WPA3" or ap["wps"] is True
    print(ap["name"], "DA VERIFICARE" if risky else "OK")`,
    lines: [
      ['import json', 'carica il modulo standard per leggere JSON'],
      ['open("wifi_lab.json")', 'apre un file di configurazione già esportato dal tuo laboratorio'],
      ['json.load(file)', 'trasforma il contenuto in oggetti Python'],
      ['risky = ...', 'applica una regola di valutazione senza interagire con la rete'],
      ['print(...)', 'mostra quali configurazioni richiedono revisione']
    ],
    purpose: 'Serve a imparare l’analisi di configurazioni autorizzate senza effettuare scansioni wireless.'
  },
  'atk-web-map': {
    language: 'Python / Flask', title: 'Elencare le rotte della propria applicazione Flask',
    scope: 'Funziona soltanto sul codice dell’app che possiedi o stai sviluppando.',
    code: `from app import app

for rule in app.url_map.iter_rules():
    methods = ",".join(sorted(rule.methods - {"HEAD", "OPTIONS"}))
    print(f"{methods:12} {rule.rule}")`,
    lines: [
      ['from app import app', 'importa la tua applicazione Flask'],
      ['app.url_map.iter_rules()', 'legge le rotte registrate internamente'],
      ['rule.methods', 'mostra i metodi HTTP ammessi'],
      ['rule.rule', 'mostra il percorso della rotta']
    ],
    purpose: 'Serve a creare l’inventario della superficie web direttamente dal progetto, senza scandagliare siti esterni.'
  },
  'atk-api-authz': {
    language: 'C# / xUnit', title: 'Test automatico di autorizzazione su una API locale',
    scope: 'Usa WebApplicationFactory e una API di test eseguita in memoria.',
    code: `[Fact]
public async Task OtherUsersOrder_ReturnsForbidden()
{
    using var client = _factory.CreateClient();
    client.DefaultRequestHeaders.Add("X-Test-User", "user-7");

    var response = await client.GetAsync("/api/orders/1042");

    Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
}`,
    lines: [
      ['[Fact]', 'dichiara un test xUnit'],
      ['CreateClient()', 'crea un client collegato alla tua app di test'],
      ['X-Test-User', 'imposta un’identità fittizia prevista solo dal laboratorio'],
      ['GetAsync(...)', 'richiede la risorsa del test'],
      ['Assert.Equal(...Forbidden)', 'verifica che l’accesso sia negato']
    ],
    purpose: 'Serve a scoprire regressioni di autorizzazione prima del rilascio.'
  },
  'atk-identity-path': {
    language: 'Python', title: 'Cercare percorsi di privilegi in un grafo locale',
    scope: 'Analizza soltanto il file roles_lab.json con identità inventate.',
    code: `import json
from collections import deque

with open("roles_lab.json", encoding="utf-8") as file:
    graph = json.load(file)

queue = deque([("analyst", ["analyst"])])
while queue:
    node, path = queue.popleft()
    if node == "admin-console":
        print(" -> ".join(path))
        break
    for next_node in graph.get(node, []):
        queue.append((next_node, path + [next_node]))`,
    lines: [
      ['json.load(file)', 'carica le relazioni del laboratorio'],
      ['deque(...)', 'crea una coda per esplorare il grafo'],
      ['while queue', 'visita progressivamente i collegamenti'],
      ['path + [next_node]', 'conserva il percorso seguito'],
      ['node == "admin-console"', 'ferma la ricerca quando raggiunge il ruolo elevato']
    ],
    purpose: 'Serve a comprendere gruppi annidati e deleghe eccessive usando dati sotto il tuo controllo.'
  },
  'atk-cloud-policy': {
    language: 'Python', title: 'Valutare una policy cloud salvata localmente',
    scope: 'Non si collega ad AWS, Azure o altri provider: legge policy_lab.json.',
    code: `import json

with open("policy_lab.json", encoding="utf-8") as file:
    policy = json.load(file)

public_read = any(
    item["effect"] == "Allow"
    and item["principal"] == "*"
    and "read" in item["actions"]
    for item in policy["statements"]
)

print("ESPOSTA" if public_read else "PRIVATA")`,
    lines: [
      ['policy = json.load(file)', 'carica una policy esportata o sintetica'],
      ['any(...)', 'controlla se almeno una regola soddisfa le condizioni'],
      ['principal == "*"', 'riconosce un soggetto pubblico'],
      ['"read" in actions', 'verifica la possibilità di lettura'],
      ['print(...)', 'restituisce l’esito della valutazione']
    ],
    purpose: 'Serve a revisionare configurazioni cloud prima di applicarle.'
  },
  'atk-endpoint-impact': {
    language: 'JavaScript', title: 'Simulare un locker esclusivamente in memoria',
    scope: 'Non usa filesystem, rete, crittografia o processi esterni.',
    code: `const demoFiles = [
  { name: "report.txt", locked: false },
  { name: "invoice.pdf", locked: false }
];

const simulated = demoFiles.map(file => ({
  ...file,
  locked: true,
  simulation: true
}));

console.table(simulated);`,
    lines: [
      ['demoFiles', 'crea oggetti inventati presenti solo in memoria'],
      ['map(...)', 'produce una nuova lista senza modificare file'],
      ['...file', 'copia le proprietà originali'],
      ['locked: true', 'simula lo stato di blocco'],
      ['simulation: true', 'marca esplicitamente il risultato come didattico']
    ],
    purpose: 'Serve a generare telemetria e ragionare sull’impatto senza creare malware.'
  },
  'atk-lab-identity': {
    language: 'Python', title: 'Creare un registro attribuibile per il proprio laboratorio',
    scope: 'Scrive soltanto audit_lab.json nella cartella corrente.',
    code: `import json
from datetime import datetime, timezone

record = {
    "operator": "trainee-01",
    "scope": "HOME-LAB",
    "started_at": datetime.now(timezone.utc).isoformat(),
    "authorization": "training-only"
}

with open("audit_lab.json", "w", encoding="utf-8") as file:
    json.dump(record, file, indent=2)`,
    lines: [
      ['record = {...}', 'definisce operatore, perimetro e autorizzazione'],
      ['timezone.utc', 'usa un orario uniforme e confrontabile'],
      ['open(..., "w")', 'crea il registro locale del laboratorio'],
      ['json.dump(...)', 'salva i dati in formato leggibile']
    ],
    purpose: 'Serve a separare la privacy personale dalla responsabilità professionale: account dedicato, ma attività documentata.'
  },
  'atk-metadata-audit': {
    language: 'Python / Pillow', title: 'Controllare metadati e hash di un proprio file',
    scope: 'Legge report.png senza modificarlo. Lavora su una copia autorizzata.',
    code: `from hashlib import sha256
from PIL import Image

path = "report.png"
with open(path, "rb") as file:
    digest = sha256(file.read()).hexdigest()

with Image.open(path) as image:
    metadata = dict(image.getexif())

print("SHA256:", digest)
print("Metadati:", metadata)`,
    lines: [
      ['sha256(file.read())', 'calcola l’impronta del contenuto'],
      ['Image.open(path)', 'apre l’immagine in sola lettura'],
      ['image.getexif()', 'legge eventuali metadati EXIF'],
      ['print(...)', 'mostra hash e dati incorporati per la revisione']
    ],
    purpose: 'Serve a evitare la condivisione involontaria di dati personali mantenendo integra l’evidenza originale.'
  },
  'atk-pro-report': {
    language: 'Python', title: 'Generare un rapporto red team in Markdown',
    scope: 'Crea un documento locale da dati sintetici, senza credenziali o informazioni reali.',
    code: `finding = {
    "evidence": "test autorizzato fallito",
    "impact": "accesso improprio alla risorsa demo",
    "detection": "alert su risposta 200 inattesa",
    "mitigation": "controllo owner-or-admin",
    "retest": "obbligatorio"
}

with open("report.md", "w", encoding="utf-8") as file:
    for section, value in finding.items():
        file.write(f"## {section.title()}\\n{value}\\n\\n")`,
    lines: [
      ['finding = {...}', 'organizza le sezioni del rilievo'],
      ['open("report.md", "w")', 'crea il rapporto locale'],
      ['finding.items()', 'scorre tutte le sezioni'],
      ['file.write(...)', 'scrive il documento Markdown']
    ],
    purpose: 'Serve a trasformare un test autorizzato in correzioni verificabili.'
  },
  'def-wifi': {
    language: 'Python', title: 'Validare una baseline Wi-Fi esportata',
    scope: 'Controlla router_config.json; non modifica il router.',
    code: `import json

with open("router_config.json", encoding="utf-8") as file:
    config = json.load(file)

checks = {
    "WPA3": config["security"] == "WPA3",
    "WPS disattivato": config["wps"] is False,
    "Ospiti isolati": config["guest_isolation"] is True
}

for name, passed in checks.items():
    print("PASS" if passed else "FAIL", name)`,
    lines: [
      ['config = json.load(file)', 'carica la configurazione esportata'],
      ['checks = {...}', 'definisce i requisiti della baseline'],
      ['passed', 'rappresenta l’esito di ogni controllo'],
      ['print(...)', 'produce un report semplice']
    ],
    purpose: 'Serve a verificare in modo ripetibile una configurazione autorizzata.'
  },
  'def-web': {
    language: 'C# / ASP.NET Core', title: 'Aggiungere intestazioni difensive alla propria applicazione',
    scope: 'Codice da inserire nel progetto ASP.NET Core che controlli.',
    code: `app.UseHsts();

app.Use(async (context, next) =>
{
    context.Response.Headers["Content-Security-Policy"] =
        "default-src 'self'; frame-ancestors 'none'";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    await next();
});`,
    lines: [
      ['UseHsts()', 'richiede HTTPS ai browser compatibili'],
      ['Content-Security-Policy', 'limita le sorgenti e vieta l’inclusione in frame'],
      ['X-Frame-Options: DENY', 'riduce il rischio di clickjacking'],
      ['nosniff', 'impedisce interpretazioni automatiche del tipo di contenuto'],
      ['await next()', 'prosegue la pipeline HTTP']
    ],
    purpose: 'Serve a rafforzare il browser; autorizzazione server-side e MFA restano comunque necessarie.'
  },
  'def-api': {
    language: 'C#', title: 'Autorizzazione server-side sulla singola risorsa',
    scope: 'Esempio per una API proprietaria con utente già autenticato.',
    code: `public static bool CanReadOrder(
    ClaimsPrincipal user,
    Order order)
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    var isAdmin = user.IsInRole("Admin");

    return isAdmin || order.CustomerUserId == userId;
}`,
    lines: [
      ['FindFirstValue(...)', 'legge l’identità verificata dal server'],
      ['IsInRole("Admin")', 'controlla il ruolo privilegiato'],
      ['order.CustomerUserId == userId', 'confronta il proprietario della risorsa'],
      ['return isAdmin || ...', 'consente solo admin o proprietario']
    ],
    purpose: 'Serve a evitare accessi tra utenti anche quando l’ID della risorsa è prevedibile.'
  },
  'def-identity': {
    language: 'Python', title: 'Rimuovere una relazione eccessiva da un grafo locale',
    scope: 'Modifica soltanto roles_lab.json con utenti inventati.',
    code: `import json

with open("roles_lab.json", encoding="utf-8") as file:
    graph = json.load(file)

graph["analyst"] = [
    role for role in graph.get("analyst", [])
    if role != "legacy-operators"
]

with open("roles_lab.fixed.json", "w", encoding="utf-8") as file:
    json.dump(graph, file, indent=2)`,
    lines: [
      ['graph = json.load(file)', 'carica il modello delle identità'],
      ['role != "legacy-operators"', 'esclude il privilegio non necessario'],
      ['roles_lab.fixed.json', 'salva una nuova versione senza sovrascrivere l’originale'],
      ['json.dump(...)', 'scrive il risultato revisionabile']
    ],
    purpose: 'Serve a praticare il minimo privilegio su un dataset di laboratorio.'
  },
  'def-cloud': {
    language: 'Python', title: 'Bloccare policy cloud insicure prima del deployment',
    scope: 'Valida un file locale durante CI; non modifica provider reali.',
    code: `import json
import sys

with open("policy_lab.json", encoding="utf-8") as file:
    policy = json.load(file)

unsafe = any(
    item["effect"] == "Allow" and item["principal"] == "*"
    for item in policy["statements"]
)

if unsafe:
    print("Policy pubblica non consentita")
    sys.exit(1)

print("Policy approvata")`,
    lines: [
      ['unsafe = any(...)', 'cerca regole pubbliche'],
      ['sys.exit(1)', 'fa fallire la pipeline quando trova una policy vietata'],
      ['Policy approvata', 'conferma che il controllo è superato']
    ],
    purpose: 'Serve a impedire configurazioni pubbliche accidentali prima del rilascio.'
  },
  'def-endpoint': {
    language: 'Sigma YAML', title: 'Regola comportamentale per modifiche massive ai file',
    scope: 'Regola generica da testare nel proprio SIEM con eventi di laboratorio.',
    code: `title: Rapid File Changes On Shared Path
detection:
  selection:
    event_type: file_change
    path_type: shared
  condition: selection | count() by host > 80
level: high
falsepositives:
  - migrazione dati autorizzata`,
    lines: [
      ['event_type: file_change', 'seleziona eventi di modifica file'],
      ['path_type: shared', 'limita il controllo alle condivisioni'],
      ['count() by host > 80', 'cerca un volume anomalo per dispositivo'],
      ['falsepositives', 'documenta attività lecite da verificare']
    ],
    purpose: 'Serve a rilevare comportamenti anomali invece di dipendere dal nome di un processo.'
  },
  'def-log-integrity': {
    language: 'Python', title: 'Verificare l’integrità di un log con SHA-256',
    scope: 'Confronta auth.log con una baseline locale conosciuta.',
    code: `from hashlib import sha256

with open("auth.log", "rb") as file:
    current = sha256(file.read()).hexdigest()

with open("auth.log.sha256", encoding="utf-8") as file:
    expected = file.read().strip()

if current != expected:
    raise SystemExit("ALERT: log modificato")

print("Integrità verificata")`,
    lines: [
      ['sha256(file.read())', 'calcola l’impronta corrente'],
      ['expected = ...', 'legge la baseline registrata'],
      ['current != expected', 'rileva una differenza'],
      ['SystemExit(...)', 'interrompe il controllo e segnala l’evento']
    ],
    purpose: 'Serve a rendere visibili cancellazioni o modifiche dei registri.'
  },
  'def-identity-correlation': {
    language: 'Python', title: 'Correlare eventi sintetici senza attribuzione automatica',
    scope: 'Analizza login.json con dati inventati e richiede revisione umana.',
    code: `import json
from collections import defaultdict

with open("login.json", encoding="utf-8") as file:
    events = json.load(file)

by_device = defaultdict(list)
for event in events:
    by_device[event["device"]].append(event)

for device, items in by_device.items():
    proxies = {item["proxy"] for item in items}
    timezones = {item["timezone"] for item in items}
    if len(proxies) > 2 and len(timezones) > 2:
        print("REVIEW", device, len(items), "eventi")`,
    lines: [
      ['defaultdict(list)', 'raggruppa eventi per dispositivo sintetico'],
      ['proxies = {...}', 'conta i contesti di rete osservati'],
      ['timezones = {...}', 'conta le differenze temporali'],
      ['print("REVIEW"...)', 'richiede analisi umana senza identificare automaticamente una persona']
    ],
    purpose: 'Serve a riconoscere pattern di evasione rispettando proporzionalità e privacy.'
  },
  'def-pro-response': {
    language: 'Python', title: 'Eseguire un playbook di risposta nel laboratorio',
    scope: 'Aggiorna soltanto lo stato di un incidente sintetico in memoria.',
    code: `steps = [
    "contain",
    "preserve_evidence",
    "remediate_root_cause",
    "restore_verified_backup",
    "monitor_24h"
]

incident = {"status": "open", "completed": []}
for step in steps:
    incident["completed"].append(step)
    print("DONE", step)

incident["status"] = "monitoring"`,
    lines: [
      ['steps = [...]', 'definisce la sequenza corretta'],
      ['incident = {...}', 'crea lo stato sintetico'],
      ['for step in steps', 'esegue le fasi in ordine'],
      ['completed.append(step)', 'registra cosa è stato completato'],
      ['status = "monitoring"', 'porta l’incidente alla fase di osservazione']
    ],
    purpose: 'Serve a memorizzare l’ordine corretto della risposta senza eseguire modifiche sui sistemi.'
  }
};
