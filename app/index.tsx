import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import CommuteList from '../components/CommuteList';
import FilterBar from '../components/FilterBar';
import PeriodIndicator from '../components/PeriodIndicator';
import StatsCard from '../components/StatsCard';
import { getCurrentUser } from '../utils/auth';
import {
    deleteCommute,
    loadCommutes,
    loadDraftCommutes,
    loadMonthCommutes,
    loadTodayCommutes,
    loadWeekCommutes,
    loadYearCommutes
} from '../utils/database';

export default function Index() {
  const router = useRouter();
  const [commutes, setCommutes] = useState<any[]>([]);
  const [draftCommutes, setDraftCommutes] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [username, setUsername] = useState('');

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
    
    // Filtra solo le commute completate
    const completed = data.filter((c: any) => c.status !== 'draft');
    const drafts = loadDraftCommutes();
    
    console.log('Dati caricati:', completed.length, 'completate,', drafts.length, 'bozze');
    setCommutes(completed);
    setDraftCommutes(drafts);
    setRefreshKey(prev => prev + 1); // Forza il re-render
  };

  const handleFilterChange = (filter: string) => {
    console.log('Cambio filtro:', filter);
    setCurrentFilter(filter);
  };

  // Carica i dati dell'utente
  useEffect(() => {
    const loadUserData = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUsername(user.username);
      }
    };
    loadUserData();
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>🚗 Commute Tracker</Text>
              <Text style={styles.subtitle}>I tuoi spostamenti giornalieri</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
            >
              <Ionicons name="settings-outline" size={28} color="#6366f1" />
            </TouchableOpacity>
          </View>
          {username ? (
            <Text style={styles.welcomeText}>Ciao, {username}! 👋</Text>
          ) : null}
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

        {/* Sezione Bozze */}
        {draftCommutes.length > 0 && (
          <View style={styles.draftSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📝 Da Completare ({draftCommutes.length})</Text>
              <Text style={styles.sectionSubtitle}>
                Clicca sulla matita per completare le informazioni
              </Text>
            </View>
            <CommuteList commutes={draftCommutes} onDelete={handleDelete} key={`drafts-${refreshKey}`} />
          </View>
        )}

        {/* Sezione Commute Completate */}
        {commutes.length > 0 && (
          <View style={styles.completedSection}>
            <Text style={styles.sectionTitle}>✅ Completate</Text>
          </View>
        )}
        
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  welcomeText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
    marginTop: 12,
  },
  settingsButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  draftSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  completedSection: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
});
