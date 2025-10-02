import * as SQLite from 'expo-sqlite';

// Variabile per il database
let db = null;

// Funzione per ottenere o creare il database
const getDatabase = () => {
  if (!db) {
    console.log('Apertura database...');
    db = SQLite.openDatabaseSync('commutes.db');
    console.log('Database aperto:', db ? 'OK' : 'ERRORE');
  }
  return db;
};

// Inizializza il database e crea la tabella se non esiste
export const initDatabase = () => {
  try {
    const database = getDatabase();
    
    // Crea la tabella se non esiste
    database.execSync(`
      CREATE TABLE IF NOT EXISTS commutes (
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
    `);
    
    // Verifica se la colonna status esiste
    const tableInfo = database.getAllSync("PRAGMA table_info(commutes)");
    const hasStatus = tableInfo.some(col => col.name === 'status');
    const hasUpdatedAt = tableInfo.some(col => col.name === 'updatedAt');
    
    // Aggiungi colonna status se non esiste (per migrare DB esistenti)
    if (!hasStatus) {
      try {
        database.execSync(`ALTER TABLE commutes ADD COLUMN status TEXT DEFAULT 'completed'`);
        console.log('Colonna status aggiunta con successo');
        
        // Aggiorna tutti i record esistenti per avere status = 'completed'
        database.execSync(`UPDATE commutes SET status = 'completed' WHERE status IS NULL`);
        console.log('Status impostato per tutti i record esistenti');
      } catch (e) {
        console.error('Errore aggiunta colonna status:', e);
      }
    } else {
      console.log('Colonna status già esistente');
    }
    
    // Aggiungi colonna updatedAt se non esiste
    if (!hasUpdatedAt) {
      try {
        database.execSync(`ALTER TABLE commutes ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP`);
        console.log('Colonna updatedAt aggiunta con successo');
        
        // Aggiorna tutti i record esistenti per avere updatedAt = createdAt
        database.execSync(`UPDATE commutes SET updatedAt = createdAt WHERE updatedAt IS NULL`);
        console.log('UpdatedAt impostato per tutti i record esistenti');
      } catch (e) {
        console.error('Errore aggiunta colonna updatedAt:', e);
      }
    } else {
      console.log('Colonna updatedAt già esistente');
    }
    
    // Aggiungi colonna pathId se non esiste
    const hasPathId = tableInfo.some(col => col.name === 'pathId');
    if (!hasPathId) {
      try {
        database.execSync(`ALTER TABLE commutes ADD COLUMN pathId TEXT`);
        console.log('Colonna pathId aggiunta con successo');
      } catch (e) {
        console.error('Errore aggiunta colonna pathId:', e);
      }
    } else {
      console.log('Colonna pathId già esistente');
    }
    
    console.log('Database inizializzato con successo');
  } catch (error) {
    console.error('Errore inizializzazione database:', error);
    throw error;
  }
};

// Salva un nuovo commute
export const saveCommute = (commute) => {
  try {
    const database = getDatabase();
    
    // Verifica se le colonne esistono
    const tableInfo = database.getAllSync("PRAGMA table_info(commutes)");
    const hasStatus = tableInfo.some(col => col.name === 'status');
    const hasUpdatedAt = tableInfo.some(col => col.name === 'updatedAt');
    const hasPathId = tableInfo.some(col => col.name === 'pathId');
    
    const status = commute.status || 'completed';
    
    // Costruisci la query in base alle colonne disponibili
    let columns = '(date, departureTime, arrivalPlatformTime, arrivalBusTime, arrivalDestinationTime, finalArrivalTime, isOutbound, duration, transport, notes';
    let placeholders = '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?';
    const params = [
      commute.date,
      commute.departureTime || null,
      commute.arrivalPlatformTime || null,
      commute.arrivalBusTime || null,
      commute.arrivalDestinationTime || null,
      commute.finalArrivalTime || null,
      commute.isOutbound ? 1 : 0,
      commute.duration || null,
      commute.transport || null,
      commute.notes || null,
    ];
    
    if (hasStatus) {
      columns += ', status';
      placeholders += ', ?';
      params.push(status);
    }
    
    if (hasUpdatedAt) {
      columns += ', updatedAt';
      placeholders += ', CURRENT_TIMESTAMP';
    }
    
    if (hasPathId) {
      columns += ', pathId';
      placeholders += ', ?';
      params.push(commute.pathId || null);
    }
    
    columns += ')';
    placeholders += ')';
    
    const query = `INSERT INTO commutes ${columns} VALUES ${placeholders}`;
    
    const result = database.runSync(query, params);
    console.log('Commute salvato con ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Errore salvataggio commute:', error);
    throw error;
  }
};

// Aggiorna un commute esistente
export const updateCommute = (id, commute) => {
  try {
    const database = getDatabase();
    
    // Verifica se le colonne esistono
    const tableInfo = database.getAllSync("PRAGMA table_info(commutes)");
    const hasStatus = tableInfo.some(col => col.name === 'status');
    const hasUpdatedAt = tableInfo.some(col => col.name === 'updatedAt');
    const hasPathId = tableInfo.some(col => col.name === 'pathId');
    
    // Costruisci la query in base alle colonne disponibili
    let query = `UPDATE commutes 
       SET date = ?, departureTime = ?, arrivalPlatformTime = ?, arrivalBusTime = ?,
           arrivalDestinationTime = ?, finalArrivalTime = ?, isOutbound = ?, 
           duration = ?, transport = ?, notes = ?`;
    
    const params = [
      commute.date,
      commute.departureTime || null,
      commute.arrivalPlatformTime || null,
      commute.arrivalBusTime || null,
      commute.arrivalDestinationTime || null,
      commute.finalArrivalTime || null,
      commute.isOutbound ? 1 : 0,
      commute.duration || null,
      commute.transport || null,
      commute.notes || null,
    ];
    
    if (hasStatus) {
      query += `, status = ?`;
      params.push(commute.status || 'completed');
    }
    
    if (hasUpdatedAt) {
      query += `, updatedAt = CURRENT_TIMESTAMP`;
    }
    
    if (hasPathId) {
      query += `, pathId = ?`;
      params.push(commute.pathId || null);
    }
    
    query += ` WHERE id = ?`;
    params.push(id);
    
    database.runSync(query, params);
    console.log('Commute aggiornato:', id);
    return id;
  } catch (error) {
    console.error('Errore aggiornamento commute:', error);
    throw error;
  }
};

// Carica un singolo commute per ID
export const getCommuteById = (id) => {
  try {
    const database = getDatabase();
    const commute = database.getFirstSync('SELECT * FROM commutes WHERE id = ?', [id]);
    if (commute) {
      return {
        ...commute,
        isOutbound: commute.isOutbound === 1,
      };
    }
    return null;
  } catch (error) {
    console.error('Errore caricamento commute:', error);
    return null;
  }
};

// Carica tutti i commutes
export const loadCommutes = () => {
  try {
    const database = getDatabase();
    const commutes = database.getAllSync('SELECT * FROM commutes ORDER BY date DESC, departureTime DESC');
    
    // Converti isOutbound da integer a boolean
    return commutes.map(c => ({
      ...c,
      isOutbound: c.isOutbound === 1,
    }));
  } catch (error) {
    console.error('Errore caricamento commutes:', error);
    return [];
  }
};

// Carica solo le commute complete
export const loadCompletedCommutes = () => {
  try {
    const database = getDatabase();
    
    // Verifica se la colonna status esiste prima di fare la query
    const tableInfo = database.getAllSync("PRAGMA table_info(commutes)");
    const hasStatus = tableInfo.some(col => col.name === 'status');
    
    if (!hasStatus) {
      console.log('Colonna status non esiste ancora, carico tutte le commute');
      return loadCommutes();
    }
    
    const commutes = database.getAllSync(
      "SELECT * FROM commutes WHERE status = 'completed' ORDER BY date DESC, departureTime DESC"
    );
    return commutes.map(c => ({
      ...c,
      isOutbound: c.isOutbound === 1,
    }));
  } catch (error) {
    console.error('Errore caricamento commutes completate:', error);
    return [];
  }
};

// Carica solo le commute in bozza (draft)
export const loadDraftCommutes = () => {
  try {
    const database = getDatabase();
    
    // Verifica se le colonne esistono prima di fare la query
    const tableInfo = database.getAllSync("PRAGMA table_info(commutes)");
    const hasStatus = tableInfo.some(col => col.name === 'status');
    const hasUpdatedAt = tableInfo.some(col => col.name === 'updatedAt');
    
    if (!hasStatus) {
      console.log('Colonna status non esiste ancora, ritorno array vuoto');
      return [];
    }
    
    // Usa updatedAt se esiste, altrimenti usa createdAt o date
    const orderBy = hasUpdatedAt ? 'updatedAt DESC' : 'createdAt DESC, date DESC';
    
    const commutes = database.getAllSync(
      `SELECT * FROM commutes WHERE status = 'draft' ORDER BY ${orderBy}`
    );
    return commutes.map(c => ({
      ...c,
      isOutbound: c.isOutbound === 1,
    }));
  } catch (error) {
    console.error('Errore caricamento bozze:', error);
    return [];
  }
};

// Elimina un commute
export const deleteCommute = (id) => {
  try {
    const database = getDatabase();
    database.runSync('DELETE FROM commutes WHERE id = ?', [id]);
    console.log('Commute eliminato:', id);
  } catch (error) {
    console.error('Errore eliminazione commute:', error);
    throw error;
  }
};

// Carica commutes per un periodo specifico
export const loadCommutesByDateRange = (startDate, endDate) => {
  try {
    const database = getDatabase();
    const commutes = database.getAllSync(
      'SELECT * FROM commutes WHERE date BETWEEN ? AND ? ORDER BY date DESC, departureTime DESC',
      [startDate, endDate]
    );
    return commutes.map(c => ({
      ...c,
      isOutbound: c.isOutbound === 1,
    }));
  } catch (error) {
    console.error('Errore caricamento commutes per periodo:', error);
    return [];
  }
};

// Carica commutes di oggi
export const loadTodayCommutes = () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    return loadCommutesByDateRange(today, today);
  } catch (error) {
    console.error('Errore caricamento commutes oggi:', error);
    return [];
  }
};

// Carica commutes della settimana corrente
export const loadWeekCommutes = () => {
  try {
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Lunedì
    const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 7)); // Domenica
    
    const startDate = firstDay.toISOString().split('T')[0];
    const endDate = lastDay.toISOString().split('T')[0];
    
    return loadCommutesByDateRange(startDate, endDate);
  } catch (error) {
    console.error('Errore caricamento commutes settimana:', error);
    return [];
  }
};

// Carica commutes del mese corrente
export const loadMonthCommutes = () => {
  try {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const startDate = firstDay.toISOString().split('T')[0];
    const endDate = lastDay.toISOString().split('T')[0];
    
    return loadCommutesByDateRange(startDate, endDate);
  } catch (error) {
    console.error('Errore caricamento commutes mese:', error);
    return [];
  }
};

// Carica commutes dell'anno corrente
export const loadYearCommutes = () => {
  try {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), 0, 1);
    const lastDay = new Date(today.getFullYear(), 11, 31);
    
    const startDate = firstDay.toISOString().split('T')[0];
    const endDate = lastDay.toISOString().split('T')[0];
    
    return loadCommutesByDateRange(startDate, endDate);
  } catch (error) {
    console.error('Errore caricamento commutes anno:', error);
    return [];
  }
};

// Statistiche
export const getStats = () => {
  try {
    const database = getDatabase();
    const result = database.getFirstSync(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN isOutbound = 1 THEN 1 END) as outbound,
        COUNT(CASE WHEN isOutbound = 0 THEN 1 END) as return
      FROM commutes
    `);
    return result;
  } catch (error) {
    console.error('Errore calcolo statistiche:', error);
    return { total: 0, outbound: 0, return: 0 };
  }
};

// Debug: mostra tutti i dati
export const getAllData = () => {
  try {
    const database = getDatabase();
    const commutes = database.getAllSync('SELECT * FROM commutes');
    console.log('=== TUTTI I DATI NEL DATABASE ===');
    console.log(JSON.stringify(commutes, null, 2));
    return commutes;
  } catch (error) {
    console.error('Errore lettura dati:', error);
    return [];
  }
};

// Debug: cancella tutti i dati
export const clearAllData = () => {
  try {
    const database = getDatabase();
    database.runSync('DELETE FROM commutes');
    console.log('Tutti i dati sono stati cancellati');
  } catch (error) {
    console.error('Errore cancellazione dati:', error);
    throw error;
  }
};

// Esporta dati in JSON (per backup)
export const exportToJSON = () => {
  try {
    const database = getDatabase();
    const commutes = database.getAllSync('SELECT * FROM commutes ORDER BY date DESC');
    return JSON.stringify(commutes, null, 2);
  } catch (error) {
    console.error('Errore esportazione:', error);
    return null;
  }
};

// Importa dati da JSON (per ripristino backup)
export const importFromJSON = (jsonData) => {
  try {
    const database = getDatabase();
    const commutes = JSON.parse(jsonData);
    database.runSync('BEGIN TRANSACTION');
    
    commutes.forEach(commute => {
      database.runSync(
        `INSERT INTO commutes 
         (date, departureTime, arrivalPlatformTime, arrivalBusTime, 
          arrivalDestinationTime, finalArrivalTime, isOutbound, duration, transport, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          commute.date,
          commute.departureTime,
          commute.arrivalPlatformTime,
          commute.arrivalBusTime,
          commute.arrivalDestinationTime,
          commute.finalArrivalTime,
          commute.isOutbound ? 1 : 0,
          commute.duration,
          commute.transport,
          commute.notes,
        ]
      );
    });
    
    database.runSync('COMMIT');
    console.log('Importazione completata:', commutes.length, 'commutes');
  } catch (error) {
    const database = getDatabase();
    database.runSync('ROLLBACK');
    console.error('Errore importazione:', error);
    throw error;
  }
};
