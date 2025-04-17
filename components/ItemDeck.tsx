import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Deck } from '../utils/types';

const handleSelectDeck = (deck: Deck, setSelectedDeck: Function, loadCards: Function) => {
    setSelectedDeck(deck);
    loadCards(deck.id);
};

export const renderDeckItem = ({ item }: { item: Deck }, setSelectedDeck: Function, loadCards: Function) => (
    <TouchableOpacity 
        style={styles.deckItem}
        onPress={() => handleSelectDeck(item, setSelectedDeck, loadCards)}
    >
        <View style={styles.deckContent}>
            <Text style={styles.deckTitle}>{item.title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    deckItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
})