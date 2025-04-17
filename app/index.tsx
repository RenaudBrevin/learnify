import { User } from '@supabase/supabase-js';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { supabase } from '../utils/supabase';

export default function Index() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);

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
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FlashCards App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});