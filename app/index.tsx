import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CommuteList from '../components/CommuteList';
import FilterBar from '../components/FilterBar';
import PeriodIndicator from '../components/PeriodIndicator';
import StatsCard from '../components/StatsCard';
import {
  deleteCommute,
  getAllData,
  loadCommutes,
  loadMonthCommutes,
  loadTodayCommutes,
  loadWeekCommutes,
  loadYearCommutes
} from '../utils/database';

export default function Index() {
  const router = useRouter();
  const [commutes, setCommutes] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentFilter, setCurrentFilter] = useState('all');

  const loadData = () => {
    console.log('Caricamento dati con filtro:', currentFilter);
    let data = [];
    
    switch (currentFilter) {
      case 'today':
        data = loadTodayCommutes();
        break;
      case 'week':
        data = loadWeekCommutes();
        break;
      case 'month':
        data = loadMonthCommutes();
        break;
      case 'year':
        data = loadYearCommutes();
        break;
      default:
        data = loadCommutes();
    }
    
    console.log('Dati caricati:', data.length, 'commutes');
    setCommutes(data);
    setRefreshKey(prev => prev + 1); // Forza il re-render
  };

  const handleFilterChange = (filter: string) => {
    console.log('Cambio filtro:', filter);
    setCurrentFilter(filter);
  };

  // Ricarica quando cambia il filtro
  useEffect(() => {
    loadData();
  }, [currentFilter]);

  // Ricarica i dati ogni volta che la schermata diventa attiva
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleDelete = (id: number) => {
    try {
      console.log('handleDelete chiamato per id:', id);
      console.log('Commutes attuali:', commutes.length);
      
      // Elimina dal database
      deleteCommute(id);
      
      // Ricarica i dati
      loadData();
      
      console.log('Eliminazione completata');
    } catch (error) {
      console.error('Errore durante eliminazione:', error);
      alert('Errore durante l\'eliminazione');
    }
  };

  // Funzione di debug per vedere i dati salvati
  const handleDebugData = () => {
    const data = getAllData();
    alert('Controlla la console per vedere i dati');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>🚗 Commute Tracker</Text>
          <Text style={styles.subtitle}>I tuoi spostamenti giornalieri</Text>
        </View>

        <FilterBar 
          onFilterChange={handleFilterChange} 
          currentFilter={currentFilter}
        />

        <PeriodIndicator filter={currentFilter} count={commutes.length} />

        <StatsCard commutes={commutes} key={`stats-${refreshKey}`} />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-commute')}
        >
          <Text style={styles.addButtonText}>+ Nuovo Commute</Text>
        </TouchableOpacity>

        {/* Bottone Debug - puoi rimuoverlo in produzione */}
        <TouchableOpacity
          style={styles.debugButton}
          onPress={handleDebugData}
        >
          <Text style={styles.debugButtonText}>🔍 Debug: Mostra dati salvati</Text>
        </TouchableOpacity>

        <CommuteList commutes={commutes} onDelete={handleDelete} key={`list-${refreshKey}`} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  addButton: {
    backgroundColor: '#6366f1',
    padding: 18,
    margin: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  debugButton: {
    backgroundColor: '#f59e0b',
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
