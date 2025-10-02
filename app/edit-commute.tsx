import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import CommuteForm from '../components/CommuteForm';
import { getCommuteById, updateCommute } from '../utils/database';

export default function EditCommute() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [commute, setCommute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const commuteId = Array.isArray(id) ? id[0] : id;
      const data = getCommuteById(parseInt(commuteId));
      setCommute(data);
      setLoading(false);
    }
  }, [id]);

  const handleSave = (updatedCommute: any) => {
    try {
      const commuteId = Array.isArray(id) ? id[0] : id;
      console.log('Aggiornamento commute:', commuteId, updatedCommute);
      updateCommute(parseInt(commuteId), updatedCommute);
      console.log('Commute aggiornato con successo');
      router.back();
    } catch (error) {
      console.error('Errore durante aggiornamento:', error);
      alert('Errore durante il salvataggio');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Caricamento...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!commute) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Commute non trovato</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CommuteForm 
        onSave={handleSave} 
        onCancel={handleCancel}
        initialData={commute}
        isEditing={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    fontWeight: '600',
  },
});
