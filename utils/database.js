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
    const result = database.runSync(
      `INSERT INTO commutes 
       (date, departureTime, arrivalPlatformTime, arrivalBusTime, 
        arrivalDestinationTime, finalArrivalTime, isOutbound, duration, transport, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
      ]
    );
    console.log('Commute salvato con ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Errore salvataggio commute:', error);
    throw error;
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
