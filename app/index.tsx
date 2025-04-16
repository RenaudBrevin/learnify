import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../utils/supabase';
import { User } from '@supabase/supabase-js';
import LogoutButton from '../components/LogoutButton';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);

      if (!session?.user) {
        router.replace('/auth');
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      setUser(user);

      if (!user) {
        router.replace('/auth');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'utilisateur:', error);
      router.replace('/auth');
    } finally {
      setLoading(false);
    }
  }

  // Si en chargement, afficher un indicateur
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FlashCards App</Text>
      <Text style={styles.content}>
        Votre application de révision par flashcards
      </Text>
      <Text style={styles.welcome}>Bienvenue {user?.email}</Text>
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  welcome: {
    fontSize: 18, // Add the font size for the welcome text
    color: '#333', // Add the color for the welcome text
  },
  content: {
    fontSize: 16, // Add the font size for the content text
    color: '#666', // Add the color for the content text
  },
});