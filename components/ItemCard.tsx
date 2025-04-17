import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deleteCard, getCardsByDeck } from '../utils/actions';
import { Deck, Flashcard } from '../utils/types';

const [decks, setDecks] = useState<Deck[]>([]);
const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
const [question, setQuestion] = useState<string>('');
const [answer, setAnswer] = useState<string>('');
const [cards, setCards] = useState<Flashcard[]>([]);
const [modalVisible, setModalVisible] = useState<boolean>(false);
const [isEditing, setIsEditing] = useState<boolean>(false);
const [currentCardId, setCurrentCardId] = useState<string | null>(null);

const handleEditCard = (card: Flashcard) => {
    setQuestion(card.question);
    setAnswer(card.answer);
    setCurrentCardId(card.id);
    setIsEditing(true);
    setModalVisible(true);
};

const loadCards = async (deckId: string) => {
    const fetchedCards = await getCardsByDeck(deckId);
    if (fetchedCards) {
        setCards(fetchedCards);
    }
};

const handleDeleteCard = async (id: string) => {
    Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de vouloir supprimer cette carte ?",
        [
            {
                text: "Annuler",
                style: "cancel"
            },
            {
                text: "Supprimer",
                onPress: async () => {
                    await deleteCard(id);
                    if (selectedDeck) {
                        loadCards(selectedDeck.id);
                    }
                },
                style: "destructive"
            }
        ]
    );
};

export const renderCardItem = ({ item }: { item: Flashcard }) => (
    <View style={styles.cardItem}>
        <View style={styles.cardContent}>
            <Text style={styles.cardQuestion}>{item.question}</Text>
            <Text style={styles.cardAnswer}>{item.answer}</Text>
        </View>
        <View style={styles.cardActions}>
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditCard(item)}
            >
                <Ionicons name="pencil" size={22} color="#4285F4" />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteCard(item.id)}
            >
                <Ionicons name="trash" size={22} color="#FF3B30" />
            </TouchableOpacity>
        </View>
    </View>
);



const styles = StyleSheet.create({
    cardItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    cardContent: {
        marginBottom: 8,
    },
    cardQuestion: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    cardAnswer: {
        fontSize: 14,
        color: '#666',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    editButton: {
        padding: 8,
        marginRight: 8,
    },
    deleteButton: {
        padding: 8,
    }
});