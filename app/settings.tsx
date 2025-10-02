import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { deleteUser, getCurrentUser, logout } from '../utils/auth';
import { clearAllData, exportToJSON, getAllData } from '../utils/database';

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Sei sicuro di voler uscire?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Esci',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ],
    );
  };

  const handleResetDatabase = () => {
    Alert.alert(
      '⚠️ Reset Database',
      'Questa operazione eliminerà TUTTI i dati (commute, bozze, ecc.) e ricreerà il database da zero. Sei sicuro?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            try {
              clearAllData();
              Alert.alert('✅ Fatto', 'Database resettato con successo!');
            } catch (error) {
              Alert.alert('❌ Errore', 'Impossibile resettare il database');
              console.error(error);
            }
          },
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Elimina Account',
      'Questa operazione eliminerà il tuo account e tutti i dati. Dovrai registrarti di nuovo. Sei sicuro?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser();
              clearAllData();
              Alert.alert('✅ Fatto', 'Account eliminato', [
                {
                  text: 'OK',
                  onPress: () => router.replace('/login'),
                },
              ]);
            } catch (error) {
              Alert.alert('❌ Errore', 'Impossibile eliminare l\'account');
              console.error(error);
            }
          },
        },
      ],
    );
  };

  const handleShowDebugData = () => {
    const data = getAllData();
    Alert.alert('📊 Debug', `Controlla la console per vedere i dati. Totale: ${data.length} commutes`);
  };

  const handleExportData = () => {
    try {
      const jsonData = exportToJSON();
      console.log('=== EXPORT DATA ===');
      console.log(jsonData);
      Alert.alert(
        '✅ Esportazione',
        'Dati esportati nella console. Totale: ' + JSON.parse(jsonData || '[]').length + ' commutes'
      );
    } catch (error) {
      Alert.alert('❌ Errore', 'Impossibile esportare i dati');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ Impostazioni</Text>
          {user && (
            <View style={styles.userInfo}>
              <Text style={styles.username}>👤 {user.username}</Text>
              <Text style={styles.email}>📧 {user.email}</Text>
            </View>
          )}
        </View>

        {/* Sezione Percorsi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Percorsi</Text>
          
          <TouchableOpacity 
            style={styles.item} 
            onPress={() => router.push('/manage-paths')}
          >
            <View style={styles.itemLeft}>
              <Ionicons name="map-outline" size={24} color="#6366f1" />
              <Text style={styles.itemText}>Gestisci Percorsi</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Sezione Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.item} onPress={handleLogout}>
            <View style={styles.itemLeft}>
              <Ionicons name="log-out-outline" size={24} color="#ef4444" />
              <Text style={styles.itemText}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={handleDeleteAccount}>
            <View style={styles.itemLeft}>
              <Ionicons name="trash-outline" size={24} color="#ef4444" />
              <Text style={[styles.itemText, styles.dangerText]}>Elimina Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Sezione Dati */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dati</Text>
          
          <TouchableOpacity style={styles.item} onPress={handleExportData}>
            <View style={styles.itemLeft}>
              <Ionicons name="download-outline" size={24} color="#6366f1" />
              <Text style={styles.itemText}>Esporta Dati</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={handleResetDatabase}>
            <View style={styles.itemLeft}>
              <Ionicons name="refresh-outline" size={24} color="#f59e0b" />
              <Text style={[styles.itemText, styles.warningText]}>Reset Database</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Sezione Debug */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Debug</Text>
          
          <TouchableOpacity style={styles.item} onPress={handleShowDebugData}>
            <View style={styles.itemLeft}>
              <Ionicons name="bug-outline" size={24} color="#8b5cf6" />
              <Text style={styles.itemText}>Mostra Dati in Console</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Sezione Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informazioni</Text>
          
          <View style={styles.item}>
            <View style={styles.itemLeft}>
              <Ionicons name="information-circle-outline" size={24} color="#6b7280" />
              <Text style={styles.itemText}>Versione App</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Commute Tracker</Text>
          <Text style={styles.footerSubtext}>Made with ❤️</Text>
        </View>
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
    paddingTop: 10,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  userInfo: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  dangerText: {
    color: '#ef4444',
  },
  warningText: {
    color: '#f59e0b',
  },
  versionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    padding: 40,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
