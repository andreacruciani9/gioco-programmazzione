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
- 24 esercizi con nuovi problemi di logica;
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
