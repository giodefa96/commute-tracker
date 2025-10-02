import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../utils/auth";
import { initDatabase } from "../utils/database";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

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

  // Controlla l'autenticazione e gestisce il redirect
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsAuthChecked(true);

      const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

      if (!authenticated && !inAuthGroup) {
        // Non autenticato e non nella schermata di login/register -> vai al login
        router.replace('/login');
      } else if (authenticated && inAuthGroup) {
        // Autenticato ma nella schermata di login/register -> vai alla home
        router.replace('/');
      }
    };

    checkAuth();
  }, [segments]);

  if (!isAuthChecked) {
    // Mostra uno schermo vuoto mentre controlla l'autenticazione
    return null;
  }

  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'Registrazione',
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
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
      <Stack.Screen 
        name="edit-commute" 
        options={{ 
          title: 'Modifica Commute',
          headerStyle: { backgroundColor: '#f59e0b' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: 'Impostazioni',
          headerStyle: { backgroundColor: '#6366f1' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
    </Stack>
  );
}
