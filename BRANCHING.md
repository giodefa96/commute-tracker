# 🌳 Git Branching Strategy

## Branch Structure

```
main (production)
  └── Build APK automatico quando fai push
  └── Solo codice stabile e testato

develop (development)
  └── Nessun build, solo controlli lint/type-check
  └── Lavoro quotidiano e integrazione features

feature/* (feature branches)
  └── Nessun workflow automatico
  └── Nuove funzionalità isolate
```

## 📝 Workflow Completo

### 1️⃣ Setup iniziale (una volta sola)

```bash
# Crea e pusha il branch develop
git checkout -b develop
git push -u origin develop

# Imposta develop come branch predefinito su GitHub (opzionale)
# Settings → Branches → Default branch → develop
```

### 2️⃣ Lavorare su nuove features

```bash
# Parti sempre da develop aggiornato
git checkout develop
git pull origin develop

# Crea un nuovo feature branch
git checkout -b feature/nome-funzionalita

# Lavora e fai commit
git add .
git commit -m "feat: descrizione della modifica"

# Pusha il feature branch
git push -u origin feature/nome-funzionalita

# Su GitHub: crea Pull Request verso develop
# Dopo review → merge su develop
```

### 3️⃣ Rilasciare in produzione

```bash
# Quando develop è stabile e pronto per release
git checkout main
git pull origin main

# Merge develop in main
git merge develop

# Pusha su main → trigga build APK automatico!
git push origin main

# (Opzionale) Crea un tag per la versione
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### 4️⃣ Hotfix urgenti

```bash
# Parti da main
git checkout main
git checkout -b hotfix/descrizione-fix

# Fai il fix
git add .
git commit -m "fix: descrizione del fix urgente"

# Merge in main E develop
git checkout main
git merge hotfix/descrizione-fix
git push origin main

git checkout develop
git merge hotfix/descrizione-fix
git push origin develop

# Elimina il branch hotfix
git branch -d hotfix/descrizione-fix
```

## 🚀 GitHub Actions

### Su `develop`:
- ✅ Lint check (ESLint)
- ✅ Type check (TypeScript)
- ❌ NO build APK

### Su `main`:
- ✅ Build APK automatico
- 📦 Link per scaricare APK disponibile dopo ~10-20 minuti
- 🔔 Notifica quando il build è pronto

### Manuale (quando vuoi):
- Vai su GitHub → Actions → EAS Build
- Click su "Run workflow"
- Scegli il branch e avvia

## 💡 Best Practices

### Naming Conventions
- **Features**: `feature/add-export-csv`, `feature/dark-mode`
- **Bug fixes**: `fix/calendar-crash`, `fix/stats-calculation`
- **Hotfix**: `hotfix/critical-save-bug`
- **Refactor**: `refactor/database-queries`
- **Docs**: `docs/update-readme`

### Commit Messages
```bash
feat: add export to CSV functionality
fix: resolve calendar crash on Android
refactor: improve database query performance
docs: update README with new features
style: format code with prettier
test: add unit tests for statistics
chore: update dependencies
```

### Pull Requests
1. **Titolo chiaro**: "Add CSV export feature"
2. **Descrizione**: cosa fa, perché serve, come testarlo
3. **Screenshots**: se cambi UI
4. **Checklist**:
   - [ ] Codice testato in locale
   - [ ] Nessun warning/errore
   - [ ] README aggiornato se necessario

## 🔄 Branch Protection (consigliato)

Su GitHub, proteggi `main`:
1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Abilita:
   - ✅ Require pull request before merging
   - ✅ Require status checks to pass (quando attivi i workflows)
   - ✅ Require branches to be up to date

Così non puoi pushare direttamente su `main` per errore!

## 📊 Esempio Pratico

```bash
# Giorno 1: Nuova feature "esportazione CSV"
git checkout develop
git pull
git checkout -b feature/csv-export
# ... lavoro ...
git commit -m "feat: add CSV export button"
git push -u origin feature/csv-export
# → Crea PR su GitHub verso develop

# Giorno 2: Review e merge
# Su GitHub: review → merge PR → develop aggiornato

# Giorno 3: Altra feature "grafici"
git checkout develop
git pull  # ora ha anche csv-export!
git checkout -b feature/charts
# ... lavoro ...

# Settimana dopo: Release
git checkout main
git merge develop
git push  # → Build APK parte automaticamente!
git tag -a v1.1.0 -m "Release: CSV export e grafici"
git push origin v1.1.0
```

## 🎯 TL;DR (Riassunto veloce)

**Lavoro quotidiano**: `develop` (no build APK)
**Release stabile**: merge `develop` → `main` (build automatico)
**Nuove features**: `feature/*` → PR verso `develop`
**Fix urgenti**: `hotfix/*` → merge sia in `main` che `develop`

---

💡 **Tip**: Usa sempre `git pull` prima di creare nuovi branch per evitare conflitti!
