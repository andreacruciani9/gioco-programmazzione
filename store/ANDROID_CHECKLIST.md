# Checklist Google Play / Android

- Verificare il package ID `it.codeforge.academy`.
- Eseguire `npm install`, `npx cap add android` e `npm run android`.
- Impostare il target SDK richiesto dalla Play Console. Dal 31 agosto 2026 le nuove app e gli aggiornamenti devono puntare ad Android 16 / API 36 o successiva.
- Creare una chiave di firma e conservarla fuori dal repository.
- Generare un Android App Bundle `.aab` firmato.
- Configurare icona adaptive, icona notifiche monocromatica, schermate e feature graphic.
- Compilare Data safety, classificazione contenuti e URL privacy/supporto.
- Creare i prodotti Google Play Billing: `codeforge_pro_monthly` e, se previsto, annuale.
- Collegare il plugin `CodeForgeBilling` e testare con una traccia interna.
- Testare notifiche, acquisti, ripristino, modalità offline, font grandi e TalkBack.

Riferimento target API: https://developer.android.com/google/play/requirements/target-sdk
