import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDatabase } from "../utils/database";

export default function RootLayout() {
  // Inizializza il database all'avvio dell'app
  useEffect(() => {
    console.log('Inizializzazione database...');
    try {
      initDatabase();
      console.log('Database inizializzato con successo');
    } catch (error) {
      console.error('Errore inizializzazione database:', error);
    }
  }, []);

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="add-commute" 
        options={{ 
          title: 'Aggiungi Commute',
          headerStyle: { backgroundColor: '#6366f1' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
    </Stack>
  );
}
