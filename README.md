# 🚗 Commute Tracker

A mobile app to track daily commute times (home-work-home) with statistics and filters.

## 📱 Features

- ✅ **Complete trip tracking**: departure time, platform arrival, bus arrival, destination arrival, final arrival
- 📅 **Calendar** to select dates
- ⏰ **Time pickers** for each timestamp
- 🔄 **Outbound/Return switch** to distinguish trips
- 📊 **Statistics**: total trips and average time
- 🔍 **Filters**: All, Today, Week, Month, Year
- 💾 **Local SQLite database** to save data
- 🗑️ **Delete trips** with confirmation
- 📱 **APK build** for Android installation

## 🚀 Development

### Prerequisites

- Node.js 18+
- Expo CLI
- Expo Account (for APK builds)

### Installation

```bash
# Clone the repository
git clone https://github.com/[your-username]/commute-tracker.git
cd commute-tracker

# Install dependencies
npm install

# Start the app in development
npx expo start
```

### Development with Expo Go

1. Install [Expo Go](https://expo.dev/go) on your phone
2. Scan the QR code from the terminal
3. The app will open in Expo Go

## 📦 Build APK for Android

### Initial Setup

```bash
# Login to Expo
npx eas-cli login

# Configure EAS Build (already done if eas.json exists)
npx eas build:configure
```

### Manual Build

```bash
# Preview build (recommended for personal use)
npx eas build -p android --profile preview

# Production build (for Google Play Store - generates AAB)
npx eas build -p android --profile production
```

The build takes 10-20 minutes. You will receive a link to download the APK/AAB.

## 🏪 Pubblicazione su Google Play Store

### Prerequisiti

1. **Account Google Play Developer** ($25 una tantum)
2. **Privacy Policy pubblicata online** (vedi `PRIVACY_POLICY.md`)
3. **Materiali grafici**:
   - Feature Graphic: 1024x500 px
   - Screenshot: almeno 2 (min 320px, max 3840px)
   - Icona: 512x512 px (già presente in `assets/images/icon.png`)

### 1. Pubblica la Privacy Policy

```bash
# Opzione 1: GitHub Pages
# Crea un file privacy-policy.html nella root del repository
# Abilita GitHub Pages nelle impostazioni del repository
# URL sarà: https://giodefa96.github.io/commute-tracker/privacy-policy.html

# Opzione 2: Usa un servizio gratuito come:
# - GitHub Gist
# - Google Sites
# - Netlify Drop
```

### 2. Crea il Build per Play Store (AAB)

```bash
# Build di produzione (genera App Bundle)
npx eas build -p android --profile production

# Attendi il completamento (10-20 minuti)
# Scarica il file .aab dal link fornito
```

### 3. Configura Google Play Console

1. Vai su [play.google.com/console](https://play.google.com/console)
2. Crea una nuova applicazione
3. Compila tutti i campi obbligatori:

**Scheda Prodotto**:

- Titolo: Commute Tracker
- Descrizione breve: (vedi `store-metadata/android/it-IT/short_description.txt`)
- Descrizione completa: (vedi `store-metadata/android/it-IT/full_description.txt`)

**Grafica**:

- Icona: `assets/images/icon.png` (convertita a 512x512 se necessario)
- Feature Graphic: da creare (1024x500 px)
- Screenshot: cattura almeno 2 schermate dall'app

**Categorizzazione**:

- App o gioco: App
- Categoria: Produttività
- Tag: pendolari, trasporti, statistiche

**Privacy e sicurezza**:

- Privacy Policy URL: [TUO-URL-PRIVACY-POLICY]
- Permessi richiesti: VIBRATE (feedback tattile)
- Sicurezza dei dati: Tutti i dati salvati solo localmente

**Content Rating**:

- Completa il questionario (probabilmente PEGI 3)

**Prezzi e distribuzione**:

- Gratuita
- Paesi: seleziona i paesi dove distribuire

### 4. Carica l'App Bundle

1. Vai su **Release** > **Produzione**
2. Clicca **Crea nuova release**
3. Carica il file `.aab`
4. Compila le **Note sulla versione**:

```
Versione 2.0.0
- Prima release pubblica
- Tracciamento completo viaggi casa-lavoro
- Statistiche e filtri intelligenti
- Database locale per privacy garantita
```

### 5. Invia per Revisione

1. Completa tutti i campi obbligatori
2. Clicca **Invia per revisione**
3. La revisione richiede solitamente 1-7 giorni

### 6. (Opzionale) Automatizza il Submit

```bash
# Configura il service account per automatizzare i caricamenti
# Vedi: https://github.com/expo/fyi/blob/main/creating-google-service-account.md

# Una volta configurato, puoi usare:
npx eas submit -p android --profile production
```

### Aggiornamenti Futuri

```bash
# 1. Aggiorna version e versionCode in app.json
./scripts/bump-version.sh patch  # o minor/major

# 2. Crea nuovo build
npx eas build -p android --profile production

# 3. Carica su Play Console come aggiornamento
```

### Automated Build with GitHub Actions

This repository includes a GitHub Actions workflow that automatically builds the APK when you push to `main`.

**Setup**:

1. Go to [Expo Dashboard](https://expo.dev/accounts/[your-account]/settings/access-tokens)
2. Create an **Access Token**
3. Go to GitHub → Settings → Secrets → Actions
4. Add a secret named `EXPO_TOKEN` with your Expo token
5. Every push to `main` will trigger an automatic build!

## 📂 Project Structure

```
commute-tracker/
├── app/
│   ├── _layout.tsx          # Main layout with navigation
│   ├── index.tsx             # Home screen with list and filters
│   └── add-commute.tsx       # Screen to add new trip
├── components/
│   ├── CommuteForm.js        # Form with time pickers
│   ├── CommuteList.js        # Trip list with timeline
│   ├── StatsCard.js          # Statistics card
│   ├── FilterBar.js          # Filter bar
│   └── PeriodIndicator.js    # Selected period indicator
├── utils/
│   └── database.js           # SQLite management
├── assets/                   # Images and icons
├── eas.json                  # EAS Build configuration
└── .github/
    └── workflows/
        └── eas-build.yml     # GitHub Actions for automated builds
```

## 🗃️ Database

The app uses **SQLite** (`expo-sqlite`) to save data locally on the device.

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

### Debug Functions

Available in the code:

- `getAllData()` - Display all saved trips
- `clearAllData()` - Delete all trips (use with caution!)

## 🔄 Git Workflow

This project uses a **Git Flow** branching strategy:

- **`main`**: Production-ready code. Every push triggers an automatic APK build.
- **`develop`**: Development branch. Only runs lint/type checks, no APK builds.
- **`feature/*`**: Feature branches for new functionality.

**Quick workflow**:

```bash
# Daily work on develop (no APK builds)
git checkout develop
git pull

# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git commit -m "feat: description of changes"

# Push and create PR to develop
git push origin feature/new-feature

# When ready for release: merge develop → main
# This triggers automatic APK build!
```

📖 **For detailed guides**:

- [BRANCHING.md](./BRANCHING.md) - Git workflow details
- [RELEASES.md](./RELEASES.md) - Version management and releases

## 📦 Release Management

### Version Numbers

Versions are defined in `app.json`:

- **`version`**: `"1.0.0"` - Semantic versioning (MAJOR.MINOR.PATCH)
- **`android.versionCode`**: `1` - Integer, must increment for each release

### Quick Version Bump

```bash
# Bump version automatically
./scripts/bump-version.sh patch   # 1.0.0 → 1.0.1 (bug fixes)
./scripts/bump-version.sh minor   # 1.0.0 → 1.1.0 (new features)
./scripts/bump-version.sh major   # 1.0.0 → 2.0.0 (breaking changes)

# Commit and merge to main
git commit -am "chore: bump version to X.Y.Z"
git checkout main
git merge develop
git push origin main  # ← Triggers APK build!

# Tag the release
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z
```

## 🛠️ Technologies

- **React Native** 0.81.4
- **Expo** SDK ~54.0.11
- **Expo Router** ~6.0.9 (navigation)
- **Expo SQLite** (local database)
- **React Native DateTimePicker** (date and time pickers)
- **Expo Vector Icons** (icons)
- **EAS Build** (APK builds)

## 📝 Future TODO

- [ ] Export data to CSV/JSON
- [ ] Multiple commute form
- [ ] Custom commute form
- [ ] Step-by-step trip update
- [ ] Login form
- [ ] Gps tracking mode (optional)
- [ ] Charts to visualize time trends
- [ ] Notifications for scheduled trips
- [ ] Dark mode
- [ ] Cloud sync (optional)
- [ ] Home screen widget

## 📄 License

Personal project - Private use
