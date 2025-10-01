import { StyleSheet, Text, View } from 'react-native';

export default function StatsCard({ commutes }) {
  const calculateStats = () => {
    if (commutes.length === 0) return null;

    const totalMinutes = commutes.reduce((sum, c) => {
      const [h, m] = c.duration.replace('h', '').replace('m', '').split(' ').map(Number);
      return sum + h * 60 + m;
    }, 0);

    const avgMinutes = Math.round(totalMinutes / commutes.length);
    const avgHours = Math.floor(avgMinutes / 60);
    const avgMins = avgMinutes % 60;

    return `${avgHours}h ${avgMins}m`;
  };

  if (commutes.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.statBox}>
        <Text style={styles.statValue}>{commutes.length}</Text>
        <Text style={styles.statLabel}>Totale viaggi</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statBox}>
        <Text style={styles.statValue}>{calculateStats()}</Text>
        <Text style={styles.statLabel}>Tempo medio</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eef2ff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  divider: {
    width: 1,
    backgroundColor: '#c7d2fe',
    marginHorizontal: 15,
  },
});