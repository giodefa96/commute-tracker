import { Ionicons } from '@expo/vector-icons';
import {
    Alert,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CommuteList({ commutes, onDelete }) {
  console.log('CommuteList renderizzato con', commutes.length, 'commutes');
  
  const handleDelete = (id) => {
    console.log('CommuteList handleDelete chiamato per id:', id);
    
    // Su web usa window.confirm, su mobile usa Alert
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Vuoi eliminare questo commute?');
      console.log('Web confirm result:', confirmed);
      if (confirmed) {
        console.log('Confermata eliminazione per id:', id);
        onDelete(id);
      } else {
        console.log('Eliminazione annullata');
      }
    } else {
      Alert.alert(
        'Elimina',
        'Vuoi eliminare questo commute?',
        [
          { 
            text: 'Annulla', 
            style: 'cancel',
            onPress: () => console.log('Eliminazione annullata')
          },
          { 
            text: 'Elimina', 
            style: 'destructive', 
            onPress: () => {
              console.log('Confermata eliminazione per id:', id);
              onDelete(id);
            }
          },
        ]
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('it-IT', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  if (commutes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nessun commute salvato</Text>
        <Text style={styles.emptySubtext}>Clicca il bottone sopra per iniziare</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {commutes.map((commute) => (
        <View key={commute.id} style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={16} color="#6366f1" />
              <Text style={styles.date}>{formatDate(commute.date)}</Text>
              <View style={[styles.typeBadge, commute.isOutbound ? styles.outboundBadge : styles.returnBadge]}>
                <Text style={styles.typeText}>
                  {commute.isOutbound ? '➡️ Andata' : '⬅️ Ritorno'}
                </Text>
              </View>
            </View>

            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={16} color="#6366f1" />
              <Text style={styles.time}>
                {commute.departureTime || commute.startTime} → {commute.finalArrivalTime || commute.endTime}
              </Text>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{commute.duration}</Text>
              </View>
            </View>

            {/* Timeline dettagliata */}
            {commute.departureTime && (
              <View style={styles.timeline}>
                <View style={styles.timelineItem}>
                  <Text style={styles.timelineIcon}>🏠</Text>
                  <Text style={styles.timelineTime}>{commute.departureTime}</Text>
                  <Text style={styles.timelineLabel}>Partenza</Text>
                </View>
                
                {commute.arrivalPlatformTime && (
                  <View style={styles.timelineItem}>
                    <Text style={styles.timelineIcon}>🚏</Text>
                    <Text style={styles.timelineTime}>{commute.arrivalPlatformTime}</Text>
                    <Text style={styles.timelineLabel}>Banchina</Text>
                  </View>
                )}
                
                {commute.arrivalBusTime && (
                  <View style={styles.timelineItem}>
                    <Text style={styles.timelineIcon}>🚌</Text>
                    <Text style={styles.timelineTime}>{commute.arrivalBusTime}</Text>
                    <Text style={styles.timelineLabel}>Autobus</Text>
                  </View>
                )}
                
                {commute.arrivalDestinationTime && (
                  <View style={styles.timelineItem}>
                    <Text style={styles.timelineIcon}>📍</Text>
                    <Text style={styles.timelineTime}>{commute.arrivalDestinationTime}</Text>
                    <Text style={styles.timelineLabel}>Destinazione</Text>
                  </View>
                )}
                
                {commute.finalArrivalTime && (
                  <View style={styles.timelineItem}>
                    <Text style={styles.timelineIcon}>🎯</Text>
                    <Text style={styles.timelineTime}>{commute.finalArrivalTime}</Text>
                    <Text style={styles.timelineLabel}>Arrivo finale</Text>
                  </View>
                )}
              </View>
            )}

            {commute.transport && (
              <View style={styles.transportRow}>
                <Ionicons name="bus-outline" size={16} color="#6b7280" />
                <Text style={styles.transport}>{commute.transport}</Text>
              </View>
            )}

            {commute.notes && (
              <Text style={styles.notes}>{commute.notes}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(commute.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 0,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
    flexWrap: 'wrap',
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  outboundBadge: {
    backgroundColor: '#dbeafe',
  },
  returnBadge: {
    backgroundColor: '#fce7f3',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeline: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  timelineIcon: {
    fontSize: 16,
    width: 24,
  },
  timelineTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 50,
  },
  timelineLabel: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  time: {
    fontSize: 14,
    color: '#4b5563',
  },
  durationBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  durationText: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: '600',
  },
  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  transport: {
    fontSize: 14,
    color: '#6b7280',
  },
  notes: {
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
  },
});