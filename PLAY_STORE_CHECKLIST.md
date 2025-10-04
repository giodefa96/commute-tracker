# 📋 Checklist Pre-Pubblicazione Google Play Store

## ✅ Configurazione Tecnica

### File di Configurazione

- [x] `app.json` aggiornato con:
  - [x] Nome app: "Commute Tracker"
  - [x] Descrizione completa
  - [x] Package: `com.giodefa96.commutetracker`
  - [x] Version: `2.0.0`
  - [x] VersionCode: `2`
  - [x] Icone Android configurate
  - [x] Permessi specificati (VIBRATE)

- [x] `eas.json` configurato per:
  - [x] Production build genera AAB (App Bundle)
  - [x] Submit configuration per Google Play

### Build dell'App

- [ ] Testare l'app in modalità development
- [ ] Verificare che tutte le funzionalità funzionino
- [ ] Testare su diversi dispositivi Android (se possibile)
- [ ] Creare build di produzione:
  ```bash
  npx eas build -p android --profile production
  ```
- [ ] Scaricare e testare l'AAB generato (se possibile)

## 📄 Documenti Legali

### Privacy Policy

- [x] File `PRIVACY_POLICY.md` creato
- [x] **IMPORTANTE**: Aggiornare l'email di contatto nel file
- [x] **IMPORTANTE**: Pubblicare la Privacy Policy online:
  - **Opzione 1**: GitHub Pages
    1. Vai su Settings > Pages nel repository
    2. Abilita GitHub Pages
    3. Crea file `docs/privacy-policy.html`
    4. URL: `https://giodefa96.github.io/commute-tracker/privacy-policy.html`
  - **Opzione 2**: GitHub Gist (veloce)
    1. Vai su https://gist.github.com
    2. Crea nuovo Gist pubblico
    3. Copia il contenuto di PRIVACY_POLICY.md
    4. Salva e usa l'URL del Gist
  - **Opzione 3**: Altri servizi gratuiti
    - Google Sites
    - Netlify Drop
    - Vercel

### Termini di Servizio (Opzionale)

- [ ] Creare termini di servizio (se necessario)

## 🎨 Materiali Grafici

### Icone (Già Pronte)

- [x] App Icon: 512x512 px (`assets/images/icon.png`)
- [x] Adaptive Icon Foreground
- [x] Adaptive Icon Background
- [x] Adaptive Icon Monochrome

### Screenshot (DA CREARE)

- [ ] **Minimo 2 screenshot richiesti**
  - Dimensioni minime: 320px lato corto
  - Dimensioni massime: 3840px lato lungo
  - Rapporto aspetto: tra 16:9 e 2:1

  **Come crearli**:
  1. Avvia l'app su un dispositivo o emulatore
  2. Cattura schermate di:
     - Schermata principale con lista viaggi
     - Schermata aggiungi viaggio con form
     - Schermata con statistiche visibili
     - (Opzionale) Schermata filtri attivi
  3. Salva in `store-metadata/android/screenshots/`

### Feature Graphic (DA CREARE)

- [ ] **Feature Graphic obbligatorio**
  - Dimensioni: **1024 x 500 px**
  - Formato: PNG o JPG
  - Nessun testo sovrapposto (Google lo aggiunge)

  **Suggerimenti**:
  - Design semplice e pulito
  - Mostra l'icona dell'app
  - Usa i colori del brand (#E6F4FE)
  - Può includere mockup dello schermo

  **Strumenti gratuiti**:
  - Canva: https://www.canva.com
  - Figma: https://www.figma.com
  - GIMP: https://www.gimp.org

### Video Promozionale (Opzionale)

- [ ] Video dimostrativo (opzionale ma consigliato)
  - Durata: 30 secondi - 2 minuti
  - Formato: MP4, MOV, o MPEG
  - Risoluzione massima: 1920x1080

## 📝 Metadati Store

### Testi (Già Preparati)

- [x] Titolo app (max 50 caratteri)
  - File: `store-metadata/android/it-IT/title.txt`
- [x] Descrizione breve (max 80 caratteri)
  - File: `store-metadata/android/it-IT/short_description.txt`
- [x] Descrizione completa (max 4000 caratteri)
  - File: `store-metadata/android/it-IT/full_description.txt`
- [x] Traduzioni in inglese
  - Files in: `store-metadata/android/en-US/`

### Categorizzazione

- [ ] Categoria principale: **Produttività**
- [ ] Categoria secondaria: Viaggi e locale (opzionale)
- [ ] Tag: pendolari, trasporti pubblici, statistiche, mobilità

## 🏪 Google Play Console

### Account e Setup Iniziale

- [ ] Creare account Google Play Developer ($25 una tantum)
  - Link: https://play.google.com/console/signup
- [ ] Completare il profilo sviluppatore
- [ ] Accettare i termini e condizioni

### Creazione App

- [ ] Accedere a [Google Play Console](https://play.google.com/console)
- [ ] Cliccare "Crea app"
- [ ] Selezionare:
  - Nome: Commute Tracker
  - Lingua predefinita: Italiano
  - Tipo: App
  - Gratuita/A pagamento: Gratuita

### Compilazione Campi Obbligatori

#### 1. Scheda Prodotto

- [ ] Titolo app
- [ ] Descrizione breve
- [ ] Descrizione completa
- [ ] Icona app (512x512)
- [ ] Feature Graphic (1024x500)
- [ ] Screenshot (minimo 2)

#### 2. Pubblico e Contenuti

- [ ] **Fascia d'età obiettivo**: Tutte le età
- [ ] **Content Rating**:
  - Completare questionario
  - Probabilmente: PEGI 3 / Everyone
- [ ] **Privacy e sicurezza**:
  - Dichiarazione sulla privacy
  - URL Privacy Policy
  - Tipo di dati raccolti: Nessuno (tutti locali)
  - Sicurezza dei dati: completare il form

#### 3. Distribuzione

- [ ] **Paesi disponibili**:
  - Italia (obbligatorio)
  - Europa
  - Mondo (opzionale)
- [ ] **Consenso per programma Android Excellence**: Sì
- [ ] **Conformità US**: Solo se distribuisci negli USA

#### 4. Prezzo

- [ ] Seleziona: **Gratuita**

#### 5. App Content

- [ ] Annunci: No (se non usi pubblicità)
- [ ] Acquisti in-app: No
- [ ] Categoria app: Produttività
- [ ] Informazioni di contatto:
  - Email: [TUA EMAIL]
  - Sito web: https://github.com/giodefa96/commute-tracker
  - Telefono: (opzionale)

### Caricamento Build

- [ ] Vai su **Release** > **Produzione**
- [ ] Clicca **Crea nuova release**
- [ ] Carica il file `.aab` (da EAS Build)
- [ ] Inserisci le note sulla versione:

  ```
  Versione 2.0.0

  🎉 Prima release pubblica di Commute Tracker!

  ✨ Funzionalità:
  • Tracciamento completo dei viaggi casa-lavoro
  • 5 timestamp per viaggio: partenza, fermata, arrivo mezzo, destinazione, arrivo finale
  • Statistiche dettagliate: numero viaggi e tempo medio
  • Filtri intelligenti: oggi, settimana, mese, anno
  • Database locale SQLite per massima privacy
  • Interfaccia intuitiva e veloce
  • Supporto tema chiaro e scuro

  💾 Privacy garantita: tutti i dati rimangono sul tuo dispositivo!
  ```

### Test e Revisione

- [ ] **Test interno** (consigliato):
  1. Crea lista tester interni
  2. Carica su track "Internal Testing"
  3. Testa l'app per alcuni giorni
  4. Verifica funzionalità

- [ ] **Invio per revisione**:
  1. Completa TUTTI i campi obbligatori
  2. Verifica la checklist di Google Play
  3. Clicca "Invia per revisione"
- [ ] **Attendere approvazione**:
  - Tempo medio: 1-7 giorni
  - Riceverai email con esito

## 🚀 Post-Pubblicazione

### Monitoraggio

- [ ] Installare Google Play Console app su smartphone
- [ ] Monitorare download e recensioni
- [ ] Rispondere a recensioni utenti
- [ ] Controllare crash reports

### Marketing (Opzionale)

- [ ] Condividere su social media
- [ ] Creare post su forum/community di pendolari
- [ ] Aggiungere badge Google Play su README
- [ ] Creare landing page per l'app

### Aggiornamenti Futuri

- [ ] Pianificare roadmap funzionalità
- [ ] Raccogliere feedback utenti
- [ ] Preparare prossimo aggiornamento

---

## 📞 Contatti e Risorse

### Link Utili

- **Google Play Console**: https://play.google.com/console
- **EAS Build Documentation**: https://docs.expo.dev/build/introduction/
- **Google Play Policies**: https://play.google.com/about/developer-content-policy/
- **Content Rating**: https://support.google.com/googleplay/android-developer/answer/9859655

### Comandi Rapidi

```bash
# Build produzione
npx eas build -p android --profile production

# Aggiornare versione
./scripts/bump-version.sh patch

# Submit automatico (dopo configurazione service account)
npx eas submit -p android --profile production
```

---

## ⚠️ Checklist Finale Prima dell'Invio

Prima di cliccare "Invia per revisione", verifica:

- [ ] ✅ Privacy Policy pubblicata online e URL inserito
- [ ] ✅ Email di contatto valida inserita
- [ ] ✅ Tutti i campi obbligatori compilati (icona verde)
- [ ] ✅ Feature Graphic caricato
- [ ] ✅ Almeno 2 screenshot caricati
- [ ] ✅ Content rating completato
- [ ] ✅ Sicurezza dei dati dichiarata correttamente
- [ ] ✅ AAB testato (se possibile)
- [ ] ✅ Note sulla versione scritte in italiano e inglese
- [ ] ✅ Categoria e tag selezionati
- [ ] ✅ Paesi di distribuzione scelti

**Tutto verde? Sei pronto per pubblicare! 🚀**

---

**Ultima verifica**: 4 Ottobre 2025
**Versione app**: 2.0.0
**VersionCode**: 2
