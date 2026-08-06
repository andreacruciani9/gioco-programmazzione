from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise RuntimeError(f"Pattern non trovato per {label}")
    return text.replace(old, new, 1)


index_path = Path("cyberforge/index.html")
index = index_path.read_text(encoding="utf-8")

index = replace_once(
    index,
    '  <link rel="stylesheet" href="attack-defense.css" />',
    '  <link rel="stylesheet" href="attack-defense.css" />\n  <link rel="stylesheet" href="real-world.css" />',
    "foglio stile reale",
)

index = replace_once(index, '<span id="attackDefenseProgress" class="pill">0/14</span>', '<span id="attackDefenseProgress" class="pill">0/18</span>', "contatore totale")
index = replace_once(index, '<strong id="attackPathProgress">0/7</strong>', '<strong id="attackPathProgress">0/9</strong>', "contatore attacco")
index = replace_once(index, '<strong id="defensePathProgress">0/7</strong>', '<strong id="defensePathProgress">0/9</strong>', "contatore difesa")

index = replace_once(
    index,
    '            Scegli il ruolo e scrivi personalmente ogni comando o blocco di codice. Il terminale ti guida con suggerimenti progressivi, esegue la soluzione soltanto nel simulatore e, dopo ogni fase, spiega cosa significa ogni riga, cosa fa e perché serve.',
    '            Scegli il ruolo e scrivi personalmente ogni comando o blocco di codice. Prima lavori nella CyberRange; dopo la soluzione si sblocca un esempio equivalente in Python, C#, JavaScript, Sigma o configurazione reale, limitato a localhost, file locali e sistemi autorizzati.',
    "descrizione modalità",
)

index = replace_once(
    index,
    '            I comandi <strong>cyberlab</strong> e <strong>defend</strong> sono un linguaggio inventato dell’app. Non eseguono scansioni, accessi, cifrature o modifiche sul dispositivo.',
    '            I comandi <strong>cyberlab</strong> e <strong>defend</strong> restano simulati. Gli esempi reali lavorano solo su localhost, file locali, test automatici e dati sintetici. Privacy legittima sì; cancellazione delle tracce, falsificazione dell’identità ed elusione dei controlli no.',
    "confine sicurezza",
)

index = replace_once(index, '<span>SIMULATORE LOCALE</span>', '<span>SIMULATORE + CODICE REALE</span>', "titolo terminale")

old_scripts = '''  <script src="app.js"></script>
  <script src="attack-scenarios.js"></script>
  <script src="defense-scenarios.js"></script>
  <script src="attack-defense.js"></script>'''
new_scripts = '''  <script src="app.js"></script>
  <script src="attack-scenarios.js"></script>
  <script src="defense-scenarios.js"></script>
  <script src="privacy-scenarios.js"></script>
  <script src="attack-defense.js"></script>
  <script src="real-world-examples.js"></script>
  <script src="real-world-ui.js"></script>'''
index = replace_once(index, old_scripts, new_scripts, "script applicazione")
index_path.write_text(index, encoding="utf-8")

sw_path = Path("cyberforge/sw.js")
sw = sw_path.read_text(encoding="utf-8")
sw = replace_once(sw, "const CACHE = 'cyberforge-v3-terminal-training';", "const CACHE = 'cyberforge-v4-real-code-privacy';", "versione cache")
sw = replace_once(sw, "  './attack-defense.css',", "  './attack-defense.css',\n  './real-world.css',", "css cache")
sw = replace_once(sw, "  './defense-scenarios.js',", "  './defense-scenarios.js',\n  './privacy-scenarios.js',", "scenari privacy cache")
sw = replace_once(sw, "  './attack-defense.js',", "  './attack-defense.js',\n  './real-world-examples.js',\n  './real-world-ui.js',", "moduli reali cache")
sw_path.write_text(sw, encoding="utf-8")

print("CyberForge v4 patch applicata correttamente")
