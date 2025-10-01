import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import CommuteForm from './components/CommuteForm';
import CommuteList from './components/CommuteList';
import StatsCard from './components/StatsCard';
import { loadCommutes, saveCommutes } from './utils/storage';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const [commutes, setCommutes] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await loadCommutes();
    setCommutes(data);
  };

  const handleAddCommute = async (newCommute) => {
    const updated = [newCommute, ...commutes];
    setCommutes(updated);
    await saveCommutes(updated);
    navigation.goBack();
  };

  const handleDelete = async (id) => {
    const updated = commutes.filter(c => c.id !== id);
    setCommutes(updated);
    await saveCommutes(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>🚗 Commute Tracker</Text>
          <Text style={styles.subtitle}>I tuoi spostamenti giornalieri</Text>
        </View>

        <StatsCard commutes={commutes} />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddCommute', { onAdd: handleAddCommute })}
        >
          <Text style={styles.addButtonText}>+ Nuovo Commute</Text>
        </TouchableOpacity>

        <CommuteList commutes={commutes} onDelete={handleDelete} />
      </ScrollView>
    </SafeAreaView>
  );
}

function AddCommuteScreen({ route, navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <CommuteForm onSave={route.params.onAdd} onCancel={() => navigation.goBack()} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AddCommute" 
          component={AddCommuteScreen}
          options={{ 
            title: 'Aggiungi Commute',
            headerStyle: { backgroundColor: '#6366f1' },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
});