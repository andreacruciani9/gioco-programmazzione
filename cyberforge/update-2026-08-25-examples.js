Object.assign(REAL_WORLD_EXAMPLES,{
  'atk-mtls-policy-offline':{
    language:'Python',title:'Revisionare una policy mTLS da file locale',
    scope:'Legge soltanto mtls-policy-lab.json; non apre socket, non risolve host e non contatta servizi.',
    code:`from pathlib import Path\nimport json\n\npolicy = json.loads(Path("mtls-policy-lab.json").read_text())\n\nif policy.get("clientCertificate") != "required":\n    print("Client certificate non obbligatorio")\nif policy.get("trustScope") != "service-ca":\n    print("Trust scope da restringere")\nif float(policy.get("minTls", "1.0")) < 1.2:\n    print("Versione TLS minima troppo bassa")\nprint("Expiry days:", policy.get("daysToExpiry"))`,
    lines:[['Path(...).read_text()','legge esclusivamente il file locale'],['json.loads(...)','trasforma la configurazione JSON in dati Python'],['clientCertificate != "required"','verifica che il certificato client sia obbligatorio'],['trustScope != "service-ca"','controlla che il trust sia ristretto'],['minTls < 1.2','segnala protocolli troppo vecchi'],['daysToExpiry','espone la scadenza per il monitoraggio']],
    purpose:'Serve a verificare configurazioni mTLS possedute senza effettuare alcuna connessione di rete.'
  },
  'atk-mass-assignment-static':{
    language:'Python',title:'Individuare proprietà sensibili in modelli C# locali',
    scope:'Legge soltanto UserUpdateController.cs e UserEntity.cs dalla cartella di laboratorio; non avvia server e non invia HTTP.',
    code:`from pathlib import Path\nimport re\n\ncontroller = Path("UserUpdateController.cs").read_text()\nentity = Path("UserEntity.cs").read_text()\n\nsensitive = {"IsAdmin", "CreditLimit"}\nproperties = set(re.findall(r"public\\s+\\w+[?]?\\s+(\\w+)\\s*{", entity))\n\nif "[FromBody] UserEntity" in controller:\n    print("Binding diretto sulla entity")\nfor name in sorted(properties & sensitive):\n    print("Campo sensibile nel modello:", name)`,
    lines:[['Path(...).read_text()','carica esclusivamente i sorgenti locali'],['re.findall(...)','estrae i nomi delle proprietà dal modello demo'],['sensitive = {...}','definisce i campi sensibili previsti dal laboratorio'],['"[FromBody] UserEntity" in controller','segnala binding diretto del body sulla entity'],['properties & sensitive','evidenzia l’intersezione con campi privilegiati']],
    purpose:'Serve a introdurre una review statica del mass assignment su codice posseduto, senza inviare payload.'
  },
  'atk-cicd-permissions-review':{
    language:'Python',title:'Revisionare un workflow CI/CD locale',
    scope:'Legge soltanto workflow-lab.yml come testo; non avvia runner, non usa token e non scarica action.',
    code:`from pathlib import Path\nimport re\n\ntext = Path("workflow-lab.yml").read_text()\n\nif "permissions: write-all" in text:\n    print("Permessi eccessivi")\n\nuses = re.findall(r"uses:\\s*([^\\s]+)", text)\nfor ref in uses:\n    if "@" in ref and len(ref.split("@", 1)[1]) < 40:\n        print("Riferimento action da pinnare a commit:", ref)\n\nif "sha256" not in text.lower():\n    print("Verifica digest artefatto assente")`,
    lines:[['Path("workflow-lab.yml").read_text()','legge la pipeline sintetica locale'],['permissions: write-all','ricerca un livello di privilegi eccessivo'],['re.findall("uses:...")','estrae i riferimenti alle action'],['len(ref...) < 40','segnala riferimenti che non sembrano commit SHA completi'],['"sha256" not in text.lower()','controlla la presenza di una verifica di integrità']],
    purpose:'Serve a fare code review di pipeline proprie prima dell’esecuzione, senza interagire con CI reali.'
  },
  'def-mtls-policy-hardening':{
    language:'Python + test locale',title:'Validare una baseline mTLS offline',
    scope:'Testa soltanto mtls-policy-lab.json locale; non apre connessioni TLS.',
    code:`from pathlib import Path\nimport json\n\npolicy = json.loads(Path("mtls-policy-lab.json").read_text())\n\nassert policy["clientCertificate"] == "required"\nassert policy["trustScope"] == "service-ca"\nassert float(policy["minTls"]) >= 1.2\nassert int(policy["expiryAlertDays"]) >= 30\n\nprint("mTLS baseline: PASS")`,
    lines:[['clientCertificate == "required"','richiede autenticazione del client'],['trustScope == "service-ca"','limita la catena di fiducia'],['minTls >= 1.2','verifica la versione TLS minima'],['expiryAlertDays >= 30','controlla l’anticipo dell’avviso scadenza'],['assert','trasforma la baseline in un test automatico']],
    purpose:'Serve a rendere verificabile una configurazione mTLS propria con un test offline eseguibile in CI.'
  },
  'def-mass-assignment-dto':{
    language:'ASP.NET Core / C#',title:'Usare un DTO esplicito per gli aggiornamenti',
    scope:'Esempio per una API localhost o posseduta; mostra solo binding e mapping difensivo.',
    code:`public sealed record UserUpdateDto(string DisplayName, string Email);\n\n[HttpPut("users/{id:long}")]\npublic async Task<IActionResult> Update(long id, UserUpdateDto input)\n{\n    var user = await db.Users.FindAsync(id);\n    if (user is null) return NotFound();\n\n    user.DisplayName = input.DisplayName;\n    user.Email = input.Email;\n    await db.SaveChangesAsync();\n    return NoContent();\n}`,
    lines:[['UserUpdateDto(...)','espone soltanto i campi che il client può modificare'],['Update(..., UserUpdateDto input)','impedisce il binding diretto sulla entity completa'],['FindAsync(id)','recupera la entity lato server'],['user.DisplayName = ...','mappa esplicitamente un campo consentito'],['user.Email = ...','mappa il secondo campo consentito'],['SaveChangesAsync()','salva soltanto le modifiche esplicitamente applicate']],
    purpose:'Serve a prevenire over-posting e mass assignment separando il contratto HTTP dalla entity interna.'
  },
  'def-cicd-least-privilege':{
    language:'GitHub Actions YAML',title:'Pipeline a permessi minimi e riferimenti immutabili',
    scope:'Esempio di configurazione per repository posseduti; non contiene segreti né azioni di distribuzione.',
    code:`name: verify\npermissions:\n  contents: read\n  id-token: none\n\njobs:\n  verify:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@<COMMIT_SHA_VERIFICATO>\n      - name: Verify artifact digest\n        run: |\n          echo "<SHA256_ATTESO>  artifact.bin" | sha256sum -c -`,
    lines:[['permissions: contents: read','concede sola lettura al contenuto del repository'],['id-token: none','disabilita il token OIDC quando non serve'],['actions/checkout@<COMMIT_SHA_VERIFICATO>','richiede un riferimento immutabile verificato'],['sha256sum -c -','confronta il digest atteso con quello dell’artefatto locale']],
    purpose:'Serve come baseline per workflow propri: minimo privilegio, dipendenze immutabili e integrità verificabile.'
  }
});