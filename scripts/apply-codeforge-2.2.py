from pathlib import Path

# CodeForge 2.2 patch runner
app = Path('app.js')
text = app.read_text(encoding='utf-8')
text = text.replace('const APP_VERSION = "2.1.0";', 'const APP_VERSION = "2.2.0";')
old = '''    const pack = await response.json();
    questions = pack.exercises;
    localStorage.setItem(PACK_KEY, JSON.stringify(pack));'''
new = '''    const pack = await response.json();
    const addonResponse = await fetch(`exercises-addon-2.2.json?v=${APP_VERSION}`, { cache:"no-store" });
    const addon = addonResponse.ok ? await addonResponse.json() : { exercises: [] };
    const byId = new Map([...pack.exercises, ...addon.exercises].map(item => [item.id, item]));
    questions = [...byId.values()];
    localStorage.setItem(PACK_KEY, JSON.stringify({ ...pack, version: APP_VERSION, exercises: questions }));'''
if old not in text:
    raise SystemExit('Blocco loadQuestions non trovato')
text = text.replace(old, new)
app.write_text(text, encoding='utf-8')

sw = Path('sw.js')
sw_text = sw.read_text(encoding='utf-8')
sw_text = sw_text.replace('const CACHE = "codeforge-v2-1-2026-08-06";', 'const CACHE = "codeforge-v2-2-2026-08-10";')
sw_text = sw_text.replace('"./exercises.json"]', '"./exercises.json","./exercises-addon-2.2.json"]')
sw.write_text(sw_text, encoding='utf-8')

readme = Path('README.md')
if readme.exists():
    r = readme.read_text(encoding='utf-8')
    marker = '\n## Aggiornamento 2.2.0\n'
    if marker not in r:
        r += marker + '\nNuovi esercizi pratici su C#, SQL Server, Angular, Git, debugging e logica applicata. Il pacchetto aggiuntivo viene unito automaticamente agli esercizi esistenti e la PWA usa una nuova cache aggiornabile.\n'
        readme.write_text(r, encoding='utf-8')
