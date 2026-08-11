Object.assign(REAL_WORLD_EXAMPLES,{
  'atk-dns-offline-audit':{
    language:'Python',title:'Analizzare una zona DNS esportata in JSON',
    scope:'Legge solo zone-lab.json locale e non effettua query DNS.',
    code:`from pathlib import Path
import json

records = json.loads(Path("zone-lab.json").read_text())
keywords = ("admin", "vpn", "db", "staging")

for record in records:
    name = record.get("name", "").lower()
    if any(word in name for word in keywords):
        print("Nome informativo:", name)`,
    lines:[['Path(...).read_text()','legge il file locale'],['json.loads(...)','converte il testo JSON in dati Python'],['keywords = (...)','definisce termini da classificare'],['any(word in name...)','verifica se il nome contiene uno dei termini'],['print(...)','segnala il record per revisione']],
    purpose:'Serve a revisionare una configurazione DNS posseduta senza inviare traffico di rete.'
  },
  'atk-session-header-audit':{
    language:'Python',title:'Verificare flag di cookie da una risposta salvata',
    scope:'Analizza response-demo.txt registrato da localhost; non apre connessioni.',
    code:`from pathlib import Path

text = Path("response-demo.txt").read_text().lower()
required = ["secure", "httponly", "samesite"]

for flag in required:
    print(flag, "OK" if flag in text else "MANCANTE")`,
    lines:[['read_text().lower()','legge e normalizza la risposta salvata'],['required = [...]','definisce i flag attesi'],['flag in text','controlla la presenza nel file'],['print(...)','mostra l’esito del controllo']],
    purpose:'Serve come introduzione a test automatici di configurazione delle sessioni su applicazioni proprie.'
  },
  'def-api-rate-limit':{
    language:'ASP.NET Core / C#',title:'Configurare rate limiting per una API locale',
    scope:'Esempio applicativo per un progetto posseduto; non genera traffico verso servizi esterni.',
    code:`builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("api", limiter =>
    {
        limiter.PermitLimit = 60;
        limiter.Window = TimeSpan.FromMinutes(1);
        limiter.QueueLimit = 0;
    });
});

app.UseRateLimiter();`,
    lines:[['AddRateLimiter(...)','registra il servizio di rate limiting'],['AddFixedWindowLimiter("api", ...)','crea una policy a finestra fissa'],['PermitLimit = 60','consente fino a 60 richieste per finestra'],['Window = ...1','imposta la finestra a un minuto'],['QueueLimit = 0','non accoda richieste oltre soglia'],['UseRateLimiter()','attiva il middleware']],
    purpose:'Serve a proteggere disponibilità e risorse di una API controllata con una policy esplicita.'
  },
  'def-log-privacy-minimize':{
    language:'Python',title:'Minimizzare dati personali in log locali',
    scope:'Legge events-raw.json e scrive events-safe.json; nessun dato viene inviato fuori dal dispositivo.',
    code:`from pathlib import Path
from hashlib import sha256
import json

events = json.loads(Path("events-raw.json").read_text())
for event in events:
    event.pop("email", None)
    event.pop("token", None)
    raw_id = str(event.get("user_id", ""))
    event["user_id"] = sha256(raw_id.encode()).hexdigest()[:16]

Path("events-safe.json").write_text(json.dumps(events, indent=2))`,
    lines:[['event.pop("email", None)','rimuove l’email se presente'],['event.pop("token", None)','rimuove il token'],['sha256(raw_id.encode())','crea un identificatore pseudonimo stabile'],['[:16]','usa una rappresentazione più corta per il laboratorio'],['write_text(...)','salva una copia minimizzata']],
    purpose:'Serve a mantenere correlazione tra eventi riducendo i dati personali presenti nei log operativi.'
  },
  'def-log-chain-verify':{
    language:'Python',title:'Verificare una catena hash di log sintetici',
    scope:'Legge audit-chain.json locale e segnala mismatch senza modificare il file.',
    code:`from pathlib import Path
from hashlib import sha256
import json

records = json.loads(Path("audit-chain.json").read_text())
previous = "GENESIS"

for index, record in enumerate(records, start=1):
    payload = f"{previous}|{record['event']}"
    calculated = sha256(payload.encode()).hexdigest()
    if calculated != record["hash"]:
        print("Mismatch al record", index)
        break
    previous = calculated`,
    lines:[['previous = "GENESIS"','definisce il punto iniziale della catena'],['payload = ...','combina hash precedente ed evento corrente'],['sha256(...).hexdigest()','ricalcola l’impronta attesa'],['calculated != record["hash"]','confronta hash calcolato e registrato'],['break','ferma l’analisi sul primo mismatch']],
    purpose:'Serve a rilevare alterazioni nei log e a introdurre il concetto di integrità verificabile.'
  }
});