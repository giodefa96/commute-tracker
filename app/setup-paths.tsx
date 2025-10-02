import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    AVAILABLE_STEPS,
    createDefaultPath,
    markSetupDone,
    savePath,
} from '../utils/commutePaths';

export default function SetupPaths() {
  const router = useRouter();
  const [pathName, setPathName] = useState('');
  const [pathEmoji, setPathEmoji] = useState('🏠→🏢');
  const [selectedSteps, setSelectedSteps] = useState(
    AVAILABLE_STEPS.map(step => ({ ...step, enabled: true }))
  );

  const toggleStep = (stepId: string) => {
    setSelectedSteps(prev =>
      prev.map(step =>
        step.id === stepId ? { ...step, enabled: !step.enabled } : step
      )
    );
  };

  const handleUseDefault = async () => {
    try {
      await createDefaultPath();
      await markSetupDone();
      router.replace('/');
    } catch (error) {
      console.error('Errore creazione path default:', error);
      Alert.alert('Errore', 'Impossibile creare il percorso predefinito');
    }
  };

  const handleCreateCustom = async () => {
    if (!pathName.trim()) {
      Alert.alert('Errore', 'Inserisci un nome per il percorso');
      return;
    }

    const enabledSteps = selectedSteps.filter(s => s.enabled);
    if (enabledSteps.length < 2) {
      Alert.alert('Errore', 'Seleziona almeno 2 tappe');
      return;
    }

    try {
      await savePath({
        name: pathName.trim(),
        emoji: pathEmoji,
        steps: selectedSteps,
        isDefault: true,
      });
      await markSetupDone();
      Alert.alert('✅ Perfetto!', 'Percorso creato con successo', [
        {
          text: 'OK',
          onPress: () => router.replace('/'),
        },
      ]);
    } catch (error) {
      console.error('Errore creazione path:', error);
      Alert.alert('Errore', 'Impossibile creare il percorso');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>🎯 Configura il tuo Percorso</Text>
          <Text style={styles.subtitle}>
            Imposta le tappe del tuo commute giornaliero
          </Text>
        </View>

        {/* Quick Setup */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Setup Rapido</Text>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={handleUseDefault}
          >
            <View style={styles.quickButtonContent}>
              <Text style={styles.quickButtonEmoji}>🏠→🏢</Text>
              <View style={styles.quickButtonText}>
                <Text style={styles.quickButtonTitle}>Percorso Standard</Text>
                <Text style={styles.quickButtonSubtitle}>
                  Tutte le tappe attive
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>oppure</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Custom Setup */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 Personalizza</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Percorso</Text>
            <TextInput
              style={styles.input}
              placeholder="es: Casa - Lavoro"
              value={pathName}
              onChangeText={setPathName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Emoji (opzionale)</Text>
            <TextInput
              style={styles.input}
              placeholder="🏠→🏢"
              value={pathEmoji}
              onChangeText={setPathEmoji}
              maxLength={10}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Seleziona le Tappe</Text>
            <Text style={styles.helperText}>
              Scegli quali tappe vuoi tracciare
            </Text>
            {selectedSteps.map((step, index) => (
              <TouchableOpacity
                key={step.id}
                style={[
                  styles.stepItem,
                  !step.enabled && styles.stepItemDisabled,
                  index === 0 && styles.firstStep,
                  index === selectedSteps.length - 1 && styles.lastStep,
                ]}
                onPress={() => toggleStep(step.id)}
              >
                <View style={styles.stepLeft}>
                  <Text style={styles.stepEmoji}>{step.emoji}</Text>
                  <Text
                    style={[
                      styles.stepName,
                      !step.enabled && styles.stepNameDisabled,
                    ]}
                  >
                    {step.name}
                  </Text>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    step.enabled && styles.checkboxChecked,
                  ]}
                >
                  {step.enabled && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateCustom}
          >
            <Text style={styles.createButtonText}>Crea Percorso</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💡 Potrai aggiungere altri percorsi in seguito
          </Text>
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
    paddingTop: 40,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  quickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  quickButtonEmoji: {
    fontSize: 32,
  },
  quickButtonText: {
    flex: 1,
  },
  quickButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  quickButtonSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  firstStep: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  lastStep: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomWidth: 0,
  },
  stepItemDisabled: {
    opacity: 0.5,
  },
  stepLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepEmoji: {
    fontSize: 24,
  },
  stepName: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  stepNameDisabled: {
    color: '#9ca3af',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  createButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
