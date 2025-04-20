import { User } from '@supabase/supabase-js';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import { supabase } from '../utils/supabase';
import { getAllDecks, getCardsByDeck } from '../utils/actions';
import { Deck, Flashcard } from '../utils/types';
import { Ionicons } from '@expo/vector-icons';
import Training from '../components/Training';

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);

  useEffect(() => {
    checkUser();
    loadDecks();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) router.replace('/auth');
    });
    return () => authListener?.subscription?.unsubscribe();
  }, []);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) router.replace('/auth');
    } catch {
      router.replace('/auth');
    }
  }

  async function loadDecks() {
    setLoading(true);
    const fetchedDecks = await getAllDecks();
    setDecks(fetchedDecks || []);
    setLoading(false);
  }

  const handleSelectDeck = async (deck: Deck) => {
    setSelectedDeck(deck);
    setCardsLoading(true);
    const fetchedCards = await getCardsByDeck(deck.id);
    const shuffledCards = fetchedCards ? [...fetchedCards].sort(() => Math.random() - 0.5) : [];
    setCards(shuffledCards);
    setCardsLoading(false);
  };

  const handleBackToDecks = () => {
    setSelectedDeck(null);
    setCards([]);
  };

  const renderDeckItem = ({ item }: { item: Deck }) => (
    <TouchableOpacity style={styles.deckItem} onPress={() => handleSelectDeck(item)}>
      <View style={styles.deckContent}>
        <Text style={styles.deckTitle}>{item.title}</Text>
        <Text style={styles.deckSubtitle}>Appuyez pour commencer l'entraînement</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#4285F4" />
    </TouchableOpacity>
  );

  const renderDeckSelectionView = () => (
    <View style={styles.container}>
      <Text style={styles.title}>FlashCards App</Text>
      <Text style={styles.subtitle}>Choisissez un deck pour vous entraîner</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={styles.loadingText}>Chargement des decks...</Text>
        </View>
      ) : decks.length > 0 ? (
        <FlatList
          data={decks}
          renderItem={renderDeckItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.deckList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="albums-outline" size={64} color="#999" />
          <Text style={styles.emptyText}>
            Vous n'avez pas encore de decks. Créez-en un pour commencer votre entraînement !
          </Text>
          <TouchableOpacity style={styles.createButton} onPress={() => router.push('/card')}>
            <Text style={styles.createButtonText}>Créer un deck</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return selectedDeck ? (
    <Training 
      deck={selectedDeck} 
      cards={cards} 
      isLoading={cardsLoading} 
      onBackToDecks={handleBackToDecks} 
    />
  ) : renderDeckSelectionView();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  deckList: {
    paddingBottom: 20,
  },
  deckItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deckContent: {
    flex: 1,
  },
  deckTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  deckSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  createButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  }
});