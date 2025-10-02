import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    Modal,
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
    deletePath,
    loadPaths,
    savePath,
    setDefaultPath,
    updatePath,
} from '../utils/commutePaths';

interface Path {
  id: string;
  name: string;
  emoji: string;
  steps: {
    id: string;
    name: string;
    emoji: string;
    field: string;
    enabled: boolean;
  }[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ManagePaths() {
  const router = useRouter();
  const [paths, setPaths] = useState<Path[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPath, setEditingPath] = useState<Path | null>(null);
  const [pathName, setPathName] = useState('');
  const [pathEmoji, setPathEmoji] = useState('🏠→🏢');
  const [selectedSteps, setSelectedSteps] = useState(
    AVAILABLE_STEPS.map(step => ({ ...step, enabled: true }))
  );

  const loadAllPaths = async () => {
    try {
      const allPaths = await loadPaths();
      setPaths(allPaths);
    } catch (error) {
      console.error('Errore caricamento percorsi:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAllPaths();
    }, [])
  );

  const handleAddNew = () => {
    setEditingPath(null);
    setPathName('');
    setPathEmoji('🏠→🏢');
    setSelectedSteps(AVAILABLE_STEPS.map(step => ({ ...step, enabled: true })));
    setModalVisible(true);
  };

  const handleEdit = (path: Path) => {
    setEditingPath(path);
    setPathName(path.name);
    setPathEmoji(path.emoji);
    setSelectedSteps(path.steps);
    setModalVisible(true);
  };

  const handleDelete = (path: Path) => {
    if (path.isDefault && paths.length > 1) {
      Alert.alert(
        'Errore',
        'Non puoi eliminare il percorso predefinito. Imposta prima un altro percorso come predefinito.'
      );
      return;
    }

    Alert.alert(
      'Conferma Eliminazione',
      `Sei sicuro di voler eliminare "${path.name}"?`,
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePath(path.id);
              await loadAllPaths();
            } catch (error) {
              console.error('Errore eliminazione percorso:', error);
              Alert.alert('Errore', 'Impossibile eliminare il percorso');
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (path: Path) => {
    try {
      await setDefaultPath(path.id);
      await loadAllPaths();
    } catch (error) {
      console.error('Errore impostazione default:', error);
      Alert.alert('Errore', 'Impossibile impostare il percorso predefinito');
    }
  };

  const toggleStep = (stepId: string) => {
    setSelectedSteps(prev =>
      prev.map(step =>
        step.id === stepId ? { ...step, enabled: !step.enabled } : step
      )
    );
  };

  const handleSave = async () => {
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
      const pathData = {
        name: pathName.trim(),
        emoji: pathEmoji,
        steps: selectedSteps,
        isDefault: paths.length === 0, // Primo percorso è default
      };

      if (editingPath) {
        await updatePath(editingPath.id, pathData);
      } else {
        await savePath(pathData);
      }

      setModalVisible(false);
      await loadAllPaths();
    } catch (error) {
      console.error('Errore salvataggio percorso:', error);
      Alert.alert('Errore', 'Impossibile salvare il percorso');
    }
  };

  const getEnabledStepsText = (steps: Path['steps']) => {
    const enabled = steps.filter(s => s.enabled);
    return `${enabled.length}/${steps.length} tappe`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {paths.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🗺️</Text>
            <Text style={styles.emptyTitle}>Nessun Percorso</Text>
            <Text style={styles.emptyText}>
              Aggiungi il tuo primo percorso per iniziare
            </Text>
          </View>
        ) : (
          <View style={styles.pathsList}>
            {paths.map(path => (
              <View
                key={path.id}
                style={[styles.pathCard, path.isDefault && styles.pathCardDefault]}
              >
                <View style={styles.pathHeader}>
                  <View style={styles.pathTitleRow}>
                    <Text style={styles.pathEmoji}>{path.emoji}</Text>
                    <View style={styles.pathTitleContainer}>
                      <Text style={styles.pathName}>{path.name}</Text>
                      <Text style={styles.pathSteps}>
                        {getEnabledStepsText(path.steps)}
                      </Text>
                    </View>
                  </View>
                  {path.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Predefinito</Text>
                    </View>
                  )}
                </View>

                <View style={styles.stepsPreview}>
                  {path.steps
                    .filter(s => s.enabled)
                    .map((step, index, arr) => (
                      <View key={step.id} style={styles.stepPreview}>
                        <Text style={styles.stepPreviewEmoji}>{step.emoji}</Text>
                        {index < arr.length - 1 && (
                          <Ionicons
                            name="chevron-forward"
                            size={14}
                            color="#9ca3af"
                          />
                        )}
                      </View>
                    ))}
                </View>

                <View style={styles.pathActions}>
                  {!path.isDefault && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleSetDefault(path)}
                    >
                      <Ionicons name="star-outline" size={20} color="#6366f1" />
                      <Text style={styles.actionButtonText}>Imposta Default</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEdit(path)}
                  >
                    <Ionicons name="create-outline" size={20} color="#f59e0b" />
                    <Text style={styles.actionButtonText}>Modifica</Text>
                  </TouchableOpacity>
                  {paths.length > 1 && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDelete(path)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#ef4444" />
                      <Text style={styles.actionButtonText}>Elimina</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleAddNew}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal per Aggiungere/Modificare Percorso */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>Annulla</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingPath ? 'Modifica Percorso' : 'Nuovo Percorso'}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.modalSave}>Salva</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
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
              <Text style={styles.label}>Emoji</Text>
              <TextInput
                style={styles.input}
                placeholder="🏠→🏢"
                value={pathEmoji}
                onChangeText={setPathEmoji}
                maxLength={10}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tappe Attive</Text>
              <Text style={styles.helperText}>
                Seleziona le tappe da tracciare
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
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  pathsList: {
    padding: 15,
  },
  pathCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pathCardDefault: {
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  pathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  pathTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  pathEmoji: {
    fontSize: 32,
  },
  pathTitleContainer: {
    flex: 1,
  },
  pathName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  pathSteps: {
    fontSize: 14,
    color: '#6b7280',
  },
  defaultBadge: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  stepsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
  },
  stepPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepPreviewEmoji: {
    fontSize: 18,
  },
  pathActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalSave: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
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
});
