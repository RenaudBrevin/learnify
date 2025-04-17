import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { renderCardItem } from '../components/ItemCard';
import { renderDeckListView } from '../components/ListDeck';
import { createCard, getAllDecks, getCardsByDeck, updateCard } from '../utils/actions';
import { Deck, Flashcard } from '../utils/types';


const Card = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentCardId, setCurrentCardId] = useState<string | null>(null);

    useEffect(() => {
        const fetchDecks = async () => {
            const data = await getAllDecks();
            setDecks(data);
        };
        fetchDecks();
    }, []);
    
    console.log(decks);

    const loadCards = async (deckId: string) => {
        const fetchedCards = await getCardsByDeck(deckId);
        if (fetchedCards) {
            setCards(fetchedCards);
        }
    };

    const handleBackToDeckList = () => {
        setSelectedDeck(null);
        setCards([]);
    };

    const handleCreateCard = async () => {
        if (!selectedDeck) return;

        if (isEditing && currentCardId) {
            await updateCard(currentCardId, question, answer);
        } else {
            await createCard(selectedDeck.id, question, answer);
        }
        setModalVisible(false);
        setQuestion('');
        setAnswer('');
        setIsEditing(false);
        setCurrentCardId(null);
        loadCards(selectedDeck.id);
    };

    const renderDeckDetailView = () => (
        <>
            <View style={styles.headerWithBack}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackToDeckList}
                >
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                    <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>{selectedDeck?.title}</Text>

            <View style={styles.cardListHeader}>
                <Text style={styles.subtitle}>Cartes</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        setIsEditing(false);
                        setQuestion('');
                        setAnswer('');
                        setCurrentCardId(null);
                        setModalVisible(true);
                    }}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {cards.length > 0 ? (
                <FlatList
                    data={cards}
                    renderItem={renderCardItem}
                    keyExtractor={item => item.id}
                    style={styles.cardList}
                />
            ) : (
                <Text style={styles.emptyText}>Aucune carte dans ce deck</Text>
            )}
        </>
    );

    return (
        <View style={styles.container}>
            {selectedDeck ?
                renderDeckDetailView() :
                renderDeckListView(decks, setSelectedDeck, loadCards)
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {isEditing ? "Modifier la carte" : "Créer une carte"}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Question"
                            placeholderTextColor="#999"
                            onChangeText={setQuestion}
                            value={question}
                            multiline
                        />

                        <TextInput
                            style={[styles.input, styles.answerInput]}
                            placeholder="Réponse"
                            placeholderTextColor="#999"
                            onChangeText={setAnswer}
                            value={answer}
                            multiline
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleCreateCard}
                            >
                                <Text style={styles.saveButtonText}>
                                    {isEditing ? "Enregistrer" : "Créer"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

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
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    cardListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardList: {
        flex: 1,
    },
    headerWithBack: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 16,
        color: '#007AFF',
        marginLeft: 4,
    },
    addButton: {
        backgroundColor: '#4285F4',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 16,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        minHeight: 50,
    },
    answerInput: {
        minHeight: 100,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
    },
    saveButtonText: {
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

export default Card;