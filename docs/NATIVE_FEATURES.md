# CodeForge 2.1 - Native Ready

## Funzioni già operative nella PWA
- Pacchetto esercizi scaricabile e disponibile offline.
- Editor con numeri di riga, tab, parentesi/graffe, lambda, undo/redo e auto-indent.
- Livelli calcolati dagli XP.
- Obiettivo giornaliero configurabile.
- 12 badge con requisiti misurabili.
- Modalità esame con timer, punteggio e suggerimenti disabilitati.
- Backup JSON e importazione dei progressi.
- Profilo locale.
- Testo ridimensionabile, contrasto elevato, riduzione animazioni, focus visibile e attributi ARIA.
- Rilevamento e attivazione controllata degli aggiornamenti.
- 24 esercizi, inclusi nuovi casi di logica e complessità.

## Funzioni predisposte per la build nativa
- Notifiche locali giornaliere.
- Aptica iOS/Android con fallback vibrazione Android web.
- Dati per widget della serie giornaliera.
- Ripristino acquisti e acquisto Pro tramite plugin `CodeForgeBilling`.
- Sincronizzazione REST tramite `CODEFORGE_API_BASE`.
- Preferenze native condivise.

## Cosa richiede configurazione esterna
- Backend, autenticazione e database per sincronizzazione fra dispositivi.
- Prodotti reali in App Store Connect e Google Play Console.
- Implementazione nativa del plugin billing.
- Estensione WidgetKit iOS e widget Android.
- Firma, certificati, account sviluppatore e schede store.
