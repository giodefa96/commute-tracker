import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet } from 'react-native';
import CommuteForm from '../components/CommuteForm';
import { saveCommute } from '../utils/database';

export default function AddCommute() {
  const router = useRouter();

  const handleSave = async (newCommute: any) => {
    try {
      console.log('AddCommute handleSave chiamato con:', newCommute);
      const id = saveCommute(newCommute);
      console.log('Commute salvato nel database con ID:', id);
      
      // Torna alla home
      console.log('Tentativo di navigazione alla home...');
      if (router.canGoBack()) {
        console.log('Uso router.back()');
        router.back();
      } else {
        console.log('Uso router.push("/")');
        router.push('/');
      }
      console.log('Navigazione completata');
    } catch (error) {
      console.error('Errore in handleSave:', error);
      const message = error instanceof Error ? error.message : 'Errore sconosciuto';
      alert('Errore durante il salvataggio: ' + message);
    }
  };

  const handleCancel = () => {
    console.log('Annullamento premuto');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommuteForm onSave={handleSave} onCancel={handleCancel} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
