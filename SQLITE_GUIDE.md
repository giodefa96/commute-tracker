# 🗄️ Database SQLite Locale Integrato

## ✅ Implementato con successo!

La tua app ora usa **SQLite** come database locale, integrato direttamente nell'APK.

## 🎯 Cos'è cambiato?

### Prima (AsyncStorage):
- ❌ Storage chiave-valore semplice
- ❌ Solo stringhe JSON
- ❌ Nessuna query complessa
- ❌ Prestazioni limitate con molti dati

### Ora (SQLite):
- ✅ Database relazionale completo
- ✅ Query SQL potenti
- ✅ Indici per performance migliori
- ✅ Transazioni ACID
- ✅ Tutto nel file `commutes.db` dentro l'app

## 📂 Dove si trova il database?

Il database `commutes.db` viene creato automaticamente in:
- **Android**: `/data/data/[package-name]/databases/SQLiteDatabaseHelperDB/commutes.db`
- **iOS**: `~/Library/Application Support/commutes.db`
- **Web**: IndexedDB (fallback automatico)

## 🔧 Funzionalità disponibili

### Funzioni Base:
```javascript
import { 
  initDatabase,      // Inizializza il DB
  saveCommute,       // Salva un commute
  loadCommutes,      // Carica tutti i commutes
  deleteCommute,     // Elimina un commute
} from './utils/database';
```

### Funzioni Avanzate:
```javascript
import { 
  loadCommutesByDateRange,  // Filtra per periodo
  getStats,                  // Statistiche aggregate
  getAllData,                // Debug: vedi tutti i dati
  clearAllData,              // Debug: cancella tutto
  exportToJSON,              // Esporta backup
  importFromJSON,            // Importa backup
} from './utils/database';
```

## 📊 Schema del database

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
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Vantaggi per il tuo caso d'uso

1. **Prestazioni**: SQLite è velocissimo anche con migliaia di commutes
2. **Query**: Puoi facilmente filtrare per data, tipo (andata/ritorno), etc.
3. **Affidabilità**: Transazioni garantiscono che i dati non si corrompano
4. **Portabilità**: Tutto in un file, facile da backup/ripristino
5. **Offline**: Funziona completamente offline

## 🔄 Migrazione da AsyncStorage

Se avevi già dati in AsyncStorage, puoi migrarli:

```javascript
// 1. Carica da AsyncStorage (vecchio)
import AsyncStorage from '@react-native-async-storage/async-storage';
const oldData = await AsyncStorage.getItem('@commutes');
const commutes = JSON.parse(oldData);

// 2. Importa in SQLite (nuovo)
import { importFromJSON } from './utils/database';
importFromJSON(JSON.stringify(commutes));
```

## 📱 Backup e Ripristino

### Esporta dati:
```javascript
import { exportToJSON } from './utils/database';
const backup = exportToJSON();
// Salva su file, invia via email, etc.
```

### Importa dati:
```javascript
import { importFromJSON } from './utils/database';
importFromJSON(backupData);
```

## 🐛 Debug

Usa il bottone "🔍 Debug" nell'app per vedere tutti i dati nella console.

## ❓ FAQ

**Q: Il database viene cancellato quando disinstallo l'app?**
A: Sì, come qualsiasi dato dell'app.

**Q: Posso vedere il database durante lo sviluppo?**
A: Sì, usa il bottone debug o tools come [DB Browser for SQLite](https://sqlitebrowser.org/)

**Q: È sicuro?**
A: Sì, il database è privato all'app e non accessibile da altre app.

**Q: Quanto può essere grande?**
A: SQLite può gestire database fino a 140TB (teorico). Per il tuo uso: illimitato praticamente.

**Q: E se voglio sincronizzare tra dispositivi in futuro?**
A: Puoi facilmente aggiungere sync con Supabase/Firebase mantenendo SQLite locale come cache.

## 🎉 Conclusione

Hai ora un database professionale embedded nella tua app, senza bisogno di server esterni!
