Object.assign(REAL_WORLD_EXAMPLES,{
  'atk-secure-code-review':{
    language:'Python',title:'Rilevare concatenazioni SQL in un file locale',
    scope:'Legge solo src/OrdersRepository.cs nel progetto locale e non esegue query.',
    code:`from pathlib import Path

source = Path("src/OrdersRepository.cs").read_text(encoding="utf-8")
patterns = ['SELECT ' + '" +', 'WHERE ' + '" +']

for pattern in patterns:
    if pattern in source:
        print("Possibile concatenazione SQL:", pattern)`,
    lines:[['Path(...).read_text(...)','legge il file sorgente locale'],['patterns = [...]','definisce pattern didattici da cercare'],['if pattern in source','controlla il testo senza eseguire il programma'],['print(...)','segnala il punto da revisionare']],
    purpose:'Serve come semplice introduzione alla revisione statica; in un progetto reale va affiancato a strumenti SAST e code review.'
  },
  'atk-secret-exposure':{
    language:'Python',title:'Cercare segreti in un file locale oscurando i valori',
    scope:'Analizza solo .env.demo e non usa né invia i valori trovati.',
    code:`from pathlib import Path

for line in Path(".env.demo").read_text().splitlines():
    if "=" not in line:
        continue
    key, value = line.split("=", 1)
    if "KEY" in key.upper() or "PASSWORD" in key.upper():
        masked = value[:2] + "****" if value else "****"
        print(f"{key}={masked}")`,
    lines:[['read_text().splitlines()','legge le righe del file locale'],['line.split("=", 1)','separa nome e valore'],['KEY / PASSWORD','seleziona categorie sensibili'],['masked = ...','oscura il valore prima di mostrarlo']],
    purpose:'Serve a capire la minimizzazione dei segreti nei report; i valori rilevati devono poi essere rimossi e ruotati.'
  },
  'def-parameterized-query':{
    language:'C# / ADO.NET',title:'Usare una query parametrizzata',
    scope:'Esempio per codice applicativo posseduto; non contiene credenziali né connessioni reali.',
    code:`using var command = connection.CreateCommand();
command.CommandText = "SELECT * FROM Orders WHERE CustomerId = @customerId";

var parameter = command.CreateParameter();
parameter.ParameterName = "@customerId";
parameter.Value = customerId;
command.Parameters.Add(parameter);`,
    lines:[['CreateCommand()','crea il comando sul collegamento gestito dall’app'],['@customerId','mantiene il valore separato dalla struttura SQL'],['CreateParameter()','crea un parametro tipizzato dal provider'],['Parameters.Add(...)','associa il valore al comando']],
    purpose:'Serve a impedire che l’input venga interpretato come parte della sintassi SQL.'
  },
  'def-evidence-chain':{
    language:'Python',title:'Registrare hash e metadati di una prova locale',
    scope:'Lavora su events.json locale e crea chain-of-custody.json senza modificare l’originale.',
    code:`from pathlib import Path
from hashlib import sha256
from datetime import datetime, timezone
import json

path = Path("events.json")
record = {
    "file": path.name,
    "sha256": sha256(path.read_bytes()).hexdigest(),
    "collected_at": datetime.now(timezone.utc).isoformat(),
    "operator": "trainee-01"
}
Path("chain-of-custody.json").write_text(json.dumps(record, indent=2))`,
    lines:[['path.read_bytes()','legge i byte senza cambiare il file'],['sha256(...).hexdigest()','calcola l’impronta del contenuto'],['datetime.now(timezone.utc)','registra un orario UTC'],['operator','associa un’identità di laboratorio'],['write_text(...)','salva la scheda separata']],
    purpose:'Serve a documentare integrità, provenienza e momento della raccolta di una prova sintetica.'
  }
});