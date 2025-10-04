# 🚀 Release Management Guide

## 📋 Version Numbers

The app version is managed in **`app.json`**:

```json
{
  "expo": {
    "version": "1.0.0",           // User-facing version (Semantic Versioning)
    "android": {
      "versionCode": 1,           // Integer, auto-incremented for Play Store
      "package": "com.giodefa96.commutetracker"
    }
  }
}
```

### Semantic Versioning (SemVer)

Format: `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)

- **MAJOR** (1.x.x): Breaking changes, incompatible API changes
- **MINOR** (x.2.x): New features, backward-compatible
- **PATCH** (x.x.3): Bug fixes, backward-compatible

**Examples**:
- `1.0.0` → `1.0.1` - Fixed a bug
- `1.0.1` → `1.1.0` - Added CSV export feature
- `1.1.0` → `2.0.0` - Redesigned database schema (breaking change)

### Android versionCode

- **Integer** that must increase with each release
- Google Play uses this to determine newer versions
- Start at `1`, increment by `1` for each build
- Must **always increase**, even if you decrease the version string

**Examples**:
| Version | versionCode | Notes |
|---------|-------------|-------|
| 1.0.0   | 1           | Initial release |
| 1.0.1   | 2           | Bug fix |
| 1.1.0   | 3           | New feature |
| 1.1.1   | 4           | Bug fix |
| 2.0.0   | 5           | Major update |

## 🔄 Release Workflow

### 1️⃣ Prepare Release

```bash
# Make sure develop is up to date
git checkout develop
git pull origin develop

# Bump version using script
./scripts/bump-version.sh patch   # for bug fixes (1.0.0 → 1.0.1)
./scripts/bump-version.sh minor   # for new features (1.0.0 → 1.1.0)
./scripts/bump-version.sh major   # for breaking changes (1.0.0 → 2.0.0)

# Or manually edit app.json:
# - "version": "1.1.0"
# - "versionCode": 2 (increment by 1)

# Commit version bump
git add app.json
git commit -m "chore: bump version to 1.1.0"
git push origin develop
```

### 2️⃣ Update CHANGELOG

Edit `CHANGELOG.md` to document changes:

```bash
# Move items from [Unreleased] to new version section
# Add new [1.1.0] section with date and changes

git add CHANGELOG.md
git commit -m "docs: update changelog for v1.1.0"
git push origin develop
```

### 3️⃣ Create Release Branch (optional, for complex releases)

```bash
# Create release branch from develop
git checkout -b release/1.1.0

# Final testing and bug fixes
# ...

# Commit any last-minute fixes
git commit -m "fix: last-minute bug fix"
```

### 4️⃣ Merge to Main (triggers APK build)

```bash
# Merge to main
git checkout main
git pull origin main
git merge develop  # or git merge release/1.1.0

# Push to main → triggers automatic APK build!
git push origin main
```

### 5️⃣ Create Git Tag

```bash
# Tag the release
git tag -a v1.1.0 -m "Release v1.1.0: CSV export and charts"

# Push tag to GitHub
git push origin v1.1.0
```

### 6️⃣ Create GitHub Release

1. Go to GitHub repository
2. Click on "Releases" → "Draft a new release"
3. Fill in:
   - **Tag**: `v1.1.0` (select existing tag)
   - **Title**: `v1.1.0 - CSV Export & Charts`
   - **Description**: Copy from CHANGELOG.md
   - **Attach files**: Upload the APK file from EAS Build
4. Click "Publish release"

### 7️⃣ Merge Back to Develop

```bash
# Keep develop in sync with main
git checkout develop
git merge main
git push origin develop

# Delete release branch if you created one
git branch -d release/1.1.0
git push origin --delete release/1.1.0
```

## 🤖 Automated Version Bump

Use the provided script to automatically bump versions:

```bash
# Bug fix release (1.0.0 → 1.0.1)
./scripts/bump-version.sh patch

# New feature release (1.0.0 → 1.1.0)
./scripts/bump-version.sh minor

# Breaking change release (1.0.0 → 2.0.0)
./scripts/bump-version.sh major
```

The script automatically:
- ✅ Updates `version` in app.json
- ✅ Increments `versionCode` in app.json
- ✅ Shows you the changes
- ✅ Provides next steps

## 📝 CHANGELOG Format

Keep `CHANGELOG.md` updated following [Keep a Changelog](https://keepachangelog.com/):

```markdown
## [Unreleased]

### Added
- New feature X
- New feature Y

### Changed
- Modified behavior of Z

### Fixed
- Bug fix for A

## [1.1.0] - 2025-10-15

### Added
- CSV export functionality
- Dark mode support

### Fixed
- Calendar crash on Android

[Unreleased]: https://github.com/giodefa96/commute-tracker/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/giodefa96/commute-tracker/compare/v1.0.0...v1.1.0
```

## 🔔 Build Notifications

After merging to `main`:
1. GitHub Actions triggers EAS Build automatically
2. Build takes ~10-20 minutes
3. Check status: https://expo.dev/accounts/giodefa96/projects/commute-tracker/builds
4. Download APK when ready
5. Attach to GitHub Release

## 📦 Distribution

### Internal Testing
- Share APK link directly from EAS Build
- Or download and share APK file via email/Drive

### Google Play Store (future)
```bash
# Build production APK
eas build -p android --profile production

# Submit to Google Play
eas submit -p android
```

## 🎯 Quick Reference

| Action | Command |
|--------|---------|
| Bump patch version | `./scripts/bump-version.sh patch` |
| Bump minor version | `./scripts/bump-version.sh minor` |
| Bump major version | `./scripts/bump-version.sh major` |
| Check current version | `grep version app.json` |
| List all releases | `git tag -l` |
| View specific release | `git show v1.0.0` |
| Check build status | `npx eas-cli build:list --limit 5` |

## ⚠️ Important Notes

1. **Always increment versionCode** - Even if you rollback the version string, versionCode must always increase
2. **Test before merging to main** - Main should always be stable and ready for release
3. **Update CHANGELOG** - Document all changes for users and developers
4. **Tag releases** - Makes it easy to track and rollback if needed
5. **Keep develop synced** - Always merge main back to develop after release

---

💡 **Tip**: For hotfixes, you can merge directly to main, then merge main back to develop to keep them in sync.
