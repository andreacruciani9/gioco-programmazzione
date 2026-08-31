# CodeForge Academy

App di allenamento pratico per C#, SQL Server, Angular, Git, logica e debugging.

## Versione 2.1 Native Ready

La stessa base funziona come:
- PWA installabile su iPhone e Android;
- progetto iOS tramite Capacitor e Xcode;
- progetto Android tramite Capacitor e Android Studio;
- base per App Store e Google Play.

## Novità principali

- editor di codice migliorato;
- modalità esame con timer;
- obiettivi giornalieri, livelli e 12 badge;
- esercizi pratici e progressivi con pacchetti aggiuntivi;
- pacchetto offline scaricabile;
- backup e importazione progressi;
- accessibilità e dimensione testo regolabile;
- bridge per notifiche, aptica, widget, sincronizzazione e acquisti;
- configurazione Capacitor condivisa iOS/Android.

## Avvio web

Pubblicare il branch `main` con GitHub Pages oppure aprire il progetto tramite un server HTTPS.

## Generazione app native

```bash
npm install
npm run prepare:native
npx cap add ios
npx cap add android
npm run cap:sync
```

Documentazione:
- `docs/NATIVE_FEATURES.md`
- `docs/STORE_RELEASE.md`
- `store/IOS_CHECKLIST.md`
- `store/ANDROID_CHECKLIST.md`

I progressi esistenti usano ancora la chiave `codeforge_live_v2` e non vengono azzerati dall'aggiornamento.

## Aggiornamento 2.2.0

Nuovi esercizi pratici su C#, SQL Server, Angular, Git, debugging e logica applicata. Il pacchetto aggiuntivo viene unito automaticamente agli esercizi esistenti e la PWA usa una nuova cache aggiornabile.

## Aggiornamento 2.3.0

Aggiunti 22 nuovi esercizi progressivi nel pacchetto `exercises-addon-2.3.json`, senza riutilizzare gli ID dei pacchetti precedenti. La release approfondisce C# con stato, null e LINQ; SQL Server con transazioni, NULL, aggregazioni e aggiornamenti massivi; Angular con guard clause, lifecycle e flussi dipendenti; Git con revert, reflog e hotfix; debugging con stack trace, stato UI e repository; logica con booleani, cicli, collezioni, edge case, riconciliazione e traduzione di requisiti in regole verificabili.

Rispetto alla 2.2.0 il focus passa da singole tecniche isolate a problemi multi-step più vicini al lavoro reale, con maggiore attenzione a flusso del codice, stato, atomicità, recovery ed edge case.

## Aggiornamento 2.4.0

Aggiunti esercizi progressivi su guard clause, nullable, LINQ, SQL con duplicati e `ROW_NUMBER`, Angular con `switchMap`, Git per hotfix e cherry-pick, debugging di race condition e bug intermittenti, oltre a logica su booleani, cicli, collezioni ed edge case. La PWA usa la cache `codeforge-v2-4-2026-08-17` e unisce i pacchetti precedenti senza duplicare gli ID.

## Aggiornamento 2.5.0

Aggiunti 18 nuovi esercizi nel pacchetto `exercises-addon-2.5.json`, con tre livelli per ciascuna area principale: C#, SQL Server, Angular, Git, Debugging e Logica. I nuovi casi includono nullable e idempotenza, traduzione di transizioni di stato, intervalli temporali SQL, `NOT EXISTS`, transazioni atomiche, validazione Angular legata a `touched`, immutabilità delle collezioni, eliminazione delle subscribe annidate, `git diff`, `reflog`, staging selettivo, logging strutturato, concorrenza ottimistica, validazioni di range, conteggio frequenze e scomposizione di requisiti complessi tramite guard clause.

Rispetto alla 2.4.0 aumenta il peso dei problemi multi-step e del ragionamento sul flusso: non solo riconoscere la sintassi corretta, ma decidere precondizioni, atomicità, idempotenza, ordine delle operazioni, diagnosi della causa e comportamento sugli edge case.

La PWA 2.5 usa la cache `codeforge-v2-5-2026-08-20`, include offline `exercises-addon-2.5.json` e continua a fondere i pacchetti 2.2, 2.3, 2.4 e 2.5 tramite ID, mantenendo i progressi esistenti.

## Aggiornamento 2.6.0

Aggiunto il pacchetto `exercises-addon-2.6.json` con esercizi progressivi su C#, SQL Server, Angular, Git, debugging e logica applicata. La PWA usa la cache `codeforge-v2-6-2026-08-24` e fonde i pacchetti fino alla 2.6 tramite ID.

## Aggiornamento 2.7.0

Aggiunti 24 nuovi esercizi nel pacchetto `exercises-addon-2.7.json`: 4 per C#, SQL Server, Angular, Git, Debugging e Logica, con difficoltà crescente da Base a Esperto. I nuovi casi allenano nullable, funzioni e modifiche massive, traduzione di cambi stato, collezioni mutate durante l'iterazione, intervalli temporali SQL, `NOT EXISTS`, JOIN uno-a-molti, UPDATE con `OUTPUT`, stato Angular immutabile, `switchMap`, modifica massiva con override per riga, staging selettivo, `reflog`, `revert`, diagnosi di autorizzazioni, logging strutturato, concorrenza ottimistica, validazioni di range, frequenze, flusso dei cicli e algoritmo Two Sum O(n).

Rispetto alla 2.6.0 aumenta il focus sulla traduzione di requisiti reali in codice e sul ragionamento end-to-end: una stessa regola viene affrontata come validazione, aggiornamento massivo, gestione dello stato UI, query sicura o diagnosi di bug. Sono stati aggiunti anche più esercizi in cui bisogna scegliere una strategia, non soltanto completare la sintassi.

La PWA 2.7 usa la cache `codeforge-v2-7-2026-08-27`, include offline `exercises-addon-2.7.json` e fonde i pacchetti 2.2–2.7 tramite ID, mantenendo compatibili i progressi esistenti.

## Aggiornamento 2.8.0

Aggiunti 24 nuovi esercizi nel pacchetto `exercises-addon-2.8.json`, con 4 esercizi per C#, SQL Server, Angular, Git, Debugging e Logica e difficoltà crescente da Base a Esperto. I nuovi casi includono guard clause, filtri LINQ, doppia enumerazione, `NULL`, `GROUP BY/HAVING`, UPDATE protetti e transazioni, validazioni Angular, aggiornamenti immutabili, `switchMap`, condizioni booleane corrette, cherry-pick e gestione dei conflitti, lettura degli stack trace, regressioni con `git bisect`, profiling di salvataggi massivi, deduplicazione con `HashSet`, edge case di `Any`/`All` e chunking di collezioni.

Rispetto alla 2.7.0 aumenta il focus sul passaggio da requisito a implementazione verificabile e sulla capacità di diagnosticare il flusso completo: precondizioni, stato, query, UI, performance e recovery. Sono stati aggiunti più esercizi in cui il problema va prima scomposto e solo dopo tradotto in codice.

La PWA 2.8 usa la cache `codeforge-v2-8-2026-08-31`, include offline `exercises-addon-2.8.json` e fonde i pacchetti 2.2–2.8 tramite ID, mantenendo compatibili i progressi esistenti.
