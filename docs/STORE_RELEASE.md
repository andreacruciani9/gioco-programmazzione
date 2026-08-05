# Pubblicazione iOS e Android

## Architettura
La cartella principale resta la PWA pubblicabile su GitHub Pages. Capacitor copia gli stessi file in `www/` e genera contenitori nativi separati per iOS e Android.

## Prima configurazione
```bash
npm install
npm run prepare:native
npx cap add ios
npx cap add android
npm run cap:sync
```

Per iOS:
```bash
npm run ios
```
Apre Xcode. Servono Apple Developer Program, certificati, Bundle ID e configurazione App Store Connect.

Per Android:
```bash
npm run android
```
Apre Android Studio. Generare un Android App Bundle `.aab`, firmarlo con una chiave di release e caricarlo su Google Play Console.

## Identificativo applicazione
Il valore iniziale è `it.codeforge.academy`. Deve essere verificato prima della prima pubblicazione: dopo la pubblicazione non è consigliabile cambiarlo.

## Funzionalità native
- `@capacitor/local-notifications`: ripasso giornaliero.
- `@capacitor/haptics`: feedback corretto/errore.
- `@capacitor/preferences`: progressi e dati condivisi.
- Plugin `CodeForgeWidget`: da implementare con WidgetKit su iOS e AppWidget/Glance su Android.
- Plugin `CodeForgeBilling`: da collegare a StoreKit 2 e Google Play Billing.
- API cloud: configurare `window.CODEFORGE_API_BASE` e il relativo backend autenticato.

## Android
Al momento della build per Google Play, verificare nel progetto Android generato il target SDK richiesto dalla Play Console e le dichiarazioni Data safety. Generare icone adaptive e una feature graphic.

## iOS
Aggiungere le descrizioni richieste in Info.plist, App Privacy, privacy manifest dei SDK, URL supporto e privacy. Testare con TestFlight.

## Nota
I file nativi `ios/` e `android/` vengono generati localmente dal CLI di Capacitor. Non contengono credenziali o certificati nel repository.
