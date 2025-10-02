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

# Production build (for publishing)
npx eas build -p android --profile production
```

The build takes 10-20 minutes. You will receive a link to download the APK.

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