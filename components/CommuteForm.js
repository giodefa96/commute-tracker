import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Helper per mostrare alert cross-platform
const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function CommuteForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    date: new Date(),
    departureTime: '',
    arrivalPlatformTime: '',
    arrivalBusTime: '',
    arrivalDestinationTime: '',
    finalArrivalTime: '',
    isOutbound: true,
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(null); // null, 'departure', 'platform', etc.
  const [tempTime, setTempTime] = useState(new Date());

  const calculateDuration = (start, end) => {
    if (!start || !end) return '0h 0m';
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    const diff = endMin - startMin;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hours}h ${mins}m`;
  };

  const handleDateChange = (event, selectedDate) => {
    // Chiudi il picker su Android dopo la selezione
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setForm({ ...form, date: selectedDate });
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(null);
    }
    
    if (selectedTime && showTimePicker) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      
      const fieldMap = {
        'departure': 'departureTime',
        'platform': 'arrivalPlatformTime',
        'bus': 'arrivalBusTime',
        'destination': 'arrivalDestinationTime',
        'final': 'finalArrivalTime',
      };
      
      const field = fieldMap[showTimePicker];
      if (field) {
        setForm({ ...form, [field]: timeString });
      }
      
      if (Platform.OS === 'ios') {
        // Su iOS non chiudiamo automaticamente
      } else {
        setShowTimePicker(null);
      }
    }
  };

  const openTimePicker = (field) => {
    const fieldValue = form[field];
    if (fieldValue) {
      // Se c'è già un valore, usalo come default
      const [hours, minutes] = fieldValue.split(':').map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      setTempTime(date);
    } else {
      setTempTime(new Date());
    }
    
    const fieldMap = {
      'departureTime': 'departure',
      'arrivalPlatformTime': 'platform',
      'arrivalBusTime': 'bus',
      'arrivalDestinationTime': 'destination',
      'finalArrivalTime': 'final',
    };
    
    setShowTimePicker(fieldMap[field]);
  };

  const validateTime = (time) => {
    if (!time) return true; // Campi opzionali
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(time);
  };

  const formatTime = (text, field) => {
    // Rimuovi tutto tranne i numeri
    let numbers = text.replace(/[^0-9]/g, '');
    
    // Limita a 4 cifre
    if (numbers.length > 4) {
      numbers = numbers.slice(0, 4);
    }
    
    // Formatta automaticamente HH:MM
    let formatted = numbers;
    if (numbers.length >= 3) {
      formatted = numbers.slice(0, 2) + ':' + numbers.slice(2);
    }
    
    setForm({ ...form, [field]: formatted });
  };

  const handleSave = () => {
    console.log('handleSave chiamato', form);
    
    // Validazione campi obbligatori
    if (!form.departureTime || !form.finalArrivalTime) {
      showAlert('Errore', 'Inserisci almeno orario di partenza e arrivo finale');
      return;
    }

    // Validazione formato orari
    const timesToValidate = [
      { time: form.departureTime, label: 'Orario Partenza' },
      { time: form.arrivalPlatformTime, label: 'Orario Arrivo Banchina' },
      { time: form.arrivalBusTime, label: 'Orario Arrivo Autobus' },
      { time: form.arrivalDestinationTime, label: 'Orario Arrivo Destinazione' },
      { time: form.finalArrivalTime, label: 'Orario Arrivo Finale' },
    ];

    for (const item of timesToValidate) {
      if (item.time && !validateTime(item.time)) {
        console.log('Validazione fallita per:', item.label, item.time);
        showAlert(
          'Formato non valido', 
          `${item.label}: inserisci un orario nel formato HH:MM (es. 08:30)`
        );
        return;
      }
    }

    const duration = calculateDuration(form.departureTime, form.finalArrivalTime);
    const newCommute = {
      id: Date.now(),
      date: form.date.toISOString().split('T')[0],
      departureTime: form.departureTime,
      arrivalPlatformTime: form.arrivalPlatformTime,
      arrivalBusTime: form.arrivalBusTime,
      arrivalDestinationTime: form.arrivalDestinationTime,
      finalArrivalTime: form.finalArrivalTime,
      isOutbound: form.isOutbound,
      duration,
    };

    console.log('Chiamata onSave con:', newCommute);
    console.log('onSave è una funzione?', typeof onSave === 'function');
    
    try {
      onSave(newCommute);
      console.log('onSave completato con successo');
    } catch (error) {
      console.error('Errore durante onSave:', error);
      showAlert('Errore', 'Si è verificato un errore durante il salvataggio');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Data */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Data</Text>
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {form.date.toLocaleDateString('it-IT', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={form.date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* Andata/Ritorno Switch */}
      <View style={styles.switchGroup}>
        <Text style={styles.label}>Tipo di viaggio</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Ritorno</Text>
          <Switch
            value={form.isOutbound}
            onValueChange={(value) => setForm({ ...form, isOutbound: value })}
            trackColor={{ false: '#d1d5db', true: '#a5b4fc' }}
            thumbColor={form.isOutbound ? '#6366f1' : '#f3f4f6'}
          />
          <Text style={[styles.switchLabel, styles.switchLabelActive]}>Andata</Text>
        </View>
      </View>

      {/* Orario Partenza */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>🏠 Orario Partenza *</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => openTimePicker('departureTime')}
        >
          <Text style={form.departureTime ? styles.timeButtonTextFilled : styles.timeButtonText}>
            {form.departureTime || '🕐 Seleziona orario'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orario Arrivo Banchina */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>🚏 Orario Arrivo Banchina</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => openTimePicker('arrivalPlatformTime')}
        >
          <Text style={form.arrivalPlatformTime ? styles.timeButtonTextFilled : styles.timeButtonText}>
            {form.arrivalPlatformTime || '🕐 Seleziona orario'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orario Arrivo Autobus */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>🚌 Orario Arrivo Autobus</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => openTimePicker('arrivalBusTime')}
        >
          <Text style={form.arrivalBusTime ? styles.timeButtonTextFilled : styles.timeButtonText}>
            {form.arrivalBusTime || '🕐 Seleziona orario'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orario Arrivo Destinazione */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>📍 Orario Arrivo Destinazione</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => openTimePicker('arrivalDestinationTime')}
        >
          <Text style={form.arrivalDestinationTime ? styles.timeButtonTextFilled : styles.timeButtonText}>
            {form.arrivalDestinationTime || '🕐 Seleziona orario'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orario Arrivo Finale */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>🎯 Orario Arrivo Finale *</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => openTimePicker('finalArrivalTime')}
        >
          <Text style={form.finalArrivalTime ? styles.timeButtonTextFilled : styles.timeButtonText}>
            {form.finalArrivalTime || '🕐 Seleziona orario'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={tempTime}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salva</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Annulla</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  formGroup: {
    marginBottom: 20,
  },
  switchGroup: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#eef2ff',
    borderRadius: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  switchLabelActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  halfGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#eef2ff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#374151',
    textTransform: 'capitalize',
  },
  timeButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  timeButtonTextFilled: {
    fontSize: 18,
    color: '#374151',
    fontWeight: '600',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
    marginBottom: 40,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: 'bold',
  },
});