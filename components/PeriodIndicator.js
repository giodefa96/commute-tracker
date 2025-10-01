import { StyleSheet, Text, View } from 'react-native';

export default function PeriodIndicator({ filter, count }) {
  const getPeriodText = () => {
    const today = new Date();
    
    switch (filter) {
      case 'today':
        return `Oggi - ${today.toLocaleDateString('it-IT', { 
          day: 'numeric', 
          month: 'long' 
        })}`;
      case 'week':
        return `Questa settimana`;
      case 'month':
        return today.toLocaleDateString('it-IT', { 
          month: 'long', 
          year: 'numeric' 
        });
      case 'year':
        return `Anno ${today.getFullYear()}`;
      default:
        return 'Tutti i commute';
    }
  };

  if (count === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.period}>{getPeriodText()}</Text>
      <Text style={styles.count}>
        {count} {count === 1 ? 'viaggio' : 'viaggi'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    padding: 12,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  period: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'capitalize',
  },
  count: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '600',
  },
});
