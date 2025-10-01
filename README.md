# 🚗 Commute Tracker

App per tracciare i tempi dei propri spostamenti quotidiani (casa-lavoro-casa) con statistiche e filtri.

## 📱 Funzionalità

- ✅ **Tracciamento completo del viaggio**: orari di partenza, arrivo in banchina, arrivo bus, arrivo a destinazione, arrivo finale
- 📅 **Calendario** per selezionare la data
- ⏰ **Time picker** per ogni orario
- 🔄 **Switch Andata/Ritorno** per distinguere i viaggi
- 📊 **Statistiche**: totale viaggi e tempo medio
- 🔍 **Filtri**: Tutti, Oggi, Settimana, Mese, Anno
- 💾 **Database SQLite** locale per salvare i dati
- 🗑️ **Elimina viaggi** con conferma
- 📱 **Build APK** per installazione su Android

## 🚀 Sviluppo

### Prerequisiti
- Node.js 18+
- Expo CLI
- Account Expo (per build APK)

### Installazione

```bash
# Clona il repository
git clone https://github.com/[tuo-username]/commute-tracker.git
cd commute-tracker

# Installa le dipendenze
npm install

# Avvia l'app in sviluppo
npx expo start
```

### Sviluppo con Expo Go
1. Installa [Expo Go](https://expo.dev/go) sul tuo telefono
2. Scansiona il QR code dal terminale
3. L'app si aprirà in Expo Go

## 📦 Build APK per Android

### Setup iniziale
```bash
# Login a Expo
npx eas-cli login

# Configura EAS Build (già fatto se esiste eas.json)
npx eas build:configure
```

### Build manuale
```bash
# Build preview (consigliato per uso personale)
npx eas build -p android --profile preview

# Build production (per pubblicazione)
npx eas build -p android --profile production
```

Il build richiede 10-20 minuti. Riceverai un link per scaricare l'APK.

### Build automatico con GitHub Actions

Questo repository include un workflow GitHub Actions che builda automaticamente l'APK quando fai push su `main`.

**Setup**:
1. Vai su [Expo Dashboard](https://expo.dev/accounts/[tuo-account]/settings/access-tokens)
2. Crea un **Access Token**
3. Vai su GitHub → Settings → Secrets → Actions
4. Aggiungi un secret chiamato `EXPO_TOKEN` con il token di Expo
5. Ogni push su `main` triggerera un build automatico!

## 📂 Struttura del Progetto

```
commute-tracker/
├── app/
│   ├── _layout.tsx          # Layout principale con navigazione
│   ├── index.tsx             # Schermata home con lista e filtri
│   └── add-commute.tsx       # Schermata per aggiungere viaggio
├── components/
│   ├── CommuteForm.js        # Form con time picker
│   ├── CommuteList.js        # Lista viaggi con timeline
│   ├── StatsCard.js          # Card statistiche
│   ├── FilterBar.js          # Barra filtri
│   └── PeriodIndicator.js    # Indicatore periodo selezionato
├── utils/
│   └── database.js           # Gestione SQLite
├── assets/                   # Immagini e icone
├── eas.json                  # Configurazione EAS Build
└── .github/
    └── workflows/
        └── eas-build.yml     # GitHub Actions per build automatici
```

## 🗃️ Database

L'app usa **SQLite** (`expo-sqlite`) per salvare i dati localmente sul dispositivo.

### Schema
```sql
CREATE TABLE commutes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  departureTime TEXT,
  arrivalPlatformTime TEXT,
  arrivalBusTime TEXT,
  arrivalDestinationTime TEXT,
  finalArrivalTime TEXT,
  isOutbound INTEGER DEFAULT 1,
  duration TEXT,
  transport TEXT,
  notes TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Funzioni di debug
Nel codice sono disponibili:
- `getAllData()` - Visualizza tutti i viaggi salvati
- `clearAllData()` - Cancella tutti i viaggi (usa con cautela!)

## 🔄 Git Workflow

```bash
# Crea un nuovo branch per feature
git checkout -b feature/nuova-funzionalita

# Fai commit delle modifiche
git add .
git commit -m "feat: descrizione della modifica"

# Push sul branch
git push origin feature/nuova-funzionalita

# Crea una Pull Request su GitHub
# Dopo il merge su main, il build automatico partirà!
```

## 🛠️ Tecnologie

- **React Native** 0.81.4
- **Expo** SDK ~54.0.11
- **Expo Router** ~6.0.9 (navigazione)
- **Expo SQLite** (database locale)
- **React Native DateTimePicker** (date e time picker)
- **Expo Vector Icons** (icone)
- **EAS Build** (build APK)

## 📝 TODO Future

- [ ] Esportazione dati in CSV/JSON
- [ ] Grafici per visualizzare andamento tempi
- [ ] Notifiche per viaggi programmati
- [ ] Dark mode
- [ ] Sync cloud (opzionale)
- [ ] Widget per home screen

## 👤 Autore

**Melania Blandi** (@giodefa96)

## 📄 Licenza

Progetto personale - Uso privato