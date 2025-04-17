import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, Modal, Alert } from 'react-native';
import { createCard, getAllDecks, getCardsByDeck, deleteCard, updateCard } from '../utils/actions';
import { Deck, Flashcard } from '../utils/types';
import { Ionicons } from '@expo/vector-icons';

const Card = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [selectedDeck, setSelectedDeck] = useState<string>('');
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentCardId, setCurrentCardId] = useState<string | null>(null);
    
    useEffect(() => {
        loadDecks();
    }, []);
    
    useEffect(() => {
        if (selectedDeck) {
            loadCards();
        }
    }, [selectedDeck]);
    
    const loadDecks = async () => {
        const fetchedDecks = await getAllDecks();
        if (fetchedDecks && fetchedDecks.length > 0) {
            setDecks(fetchedDecks);
        }
    };
    
    const loadCards = async () => {
        const fetchedCards = await getCardsByDeck(selectedDeck, setCards);
        if (fetchedCards) {
            setCards(fetchedCards);
        }
    };
    
    const handleCreateCard = async () => {
        if (isEditing && currentCardId) {
            await updateCard(currentCardId, question, answer);
        } else {
            await createCard(selectedDeck, question, answer, setQuestion, setAnswer);
        }
        setModalVisible(false);
        setQuestion('');
        setAnswer('');
        setIsEditing(false);
        setCurrentCardId(null);
        loadCards();
    };
    
    const handleEditCard = (card: Flashcard) => {
        setQuestion(card.question);
        setAnswer(card.answer);
        setCurrentCardId(card.id);
        setIsEditing(true);
        setModalVisible(true);
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
                        loadCards();
                    },
                    style: "destructive"
                }
            ]
        );
    };
    
    const renderCardItem = ({ item }: { item: Flashcard }) => (
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
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gestion des cartes</Text>
            
            <View style={styles.deckSelector}>
                <Text style={styles.selectLabel}>Choisir un deck:</Text>
                <Picker
                    selectedValue={selectedDeck}
                    onValueChange={(itemValue) => setSelectedDeck(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Sélectionner..." value="" />
                    {decks.map((deck) => (
                        <Picker.Item key={deck.id} label={deck.title} value={deck.id} />
                    ))}
                </Picker>
            </View>
            
            {selectedDeck && (
                <>
                    <View style={styles.cardListHeader}>
                        <Text style={styles.subtitle}>Liste des cartes</Text>
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
            )}
            
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

export default Card;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    deckSelector: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
    },
    selectLabel: {
        marginBottom: 5,
        fontWeight: '500',
    },
    picker: {
        height: 50,
    },
    cardListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    addButton: {
        backgroundColor: '#4285F4',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    cardList: {
        flex: 1,
    },
    cardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    cardContent: {
        flex: 1,
    },
    cardQuestion: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    cardAnswer: {
        color: '#555',
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButton: {
        padding: 8,
        marginRight: 10,
    },
    deleteButton: {
        padding: 8,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
        fontStyle: 'italic',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 12,
        marginBottom: 15,
        minHeight: 50,
    },
    answerInput: {
        minHeight: 100,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
    },
    saveButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#f2f2f2',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#333',
        textAlign: 'center',
    },
});