import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Deck } from '../utils/types';
import { renderDeckItem } from './ItemDeck';


export const renderDeckListView = (decks: Deck[], setSelectedDeck: Function, loadCards: Function) => (
    <>
        <Text style={styles.title}>Mes Decks</Text>
        {decks.length > 0 ? (
            <FlatList
                data={decks}
                renderItem={({ item }) => renderDeckItem({ item }, setSelectedDeck, loadCards)}
                keyExtractor={item => item.id}
                style={styles.deckList}
            />

        ) : (
            <Text style={styles.emptyText}>Aucun deck disponible</Text>
        )}
        <TouchableOpacity
            style={styles.addDeckButton}
            onPress={() => {
                // Ajouter la logique pour créer un nouveau deck
                Alert.alert("Info", "Fonctionnalité à implémenter: Créer un nouveau deck");
            }}
        >
            <Text style={styles.addDeckButtonText}>Créer un nouveau deck</Text>
        </TouchableOpacity>
    </>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    deckList: {
        flex: 1,
        marginBottom: 16,
    },
    addDeckButton: {
        backgroundColor: '#4285F4',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    addDeckButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginTop: 24,
    },
});