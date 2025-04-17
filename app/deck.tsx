import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createDeck, deleteDeck, getAllCards, getAllDecksWithCard, updateDeck } from '../utils/actions';
import { CardType, DeckType } from '../utils/types';

const Deck = () => {
    const [decks, setDecks] = useState<DeckType[]>([]);
    const [allCards, setAllCards] = useState<CardType[]>([]);
    const [filteredCards, setFilteredCards] = useState<CardType[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // États pour les modals
    const [deckModalVisible, setDeckModalVisible] = useState(false);
    const [cardSelectionModalVisible, setCardSelectionModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // États pour les formulaires
    const [currentDeck, setCurrentDeck] = useState<DeckType | null>(null);
    const [deckTitle, setDeckTitle] = useState('');
    const [selectedCards, setSelectedCards] = useState<string[]>([]);

    useEffect(() => {
        loadDecks();
        loadAllCards();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredCards(allCards);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredCards(
                allCards.filter(
                    card => card.question.toLowerCase().includes(query) ||
                        card.answer.toLowerCase().includes(query)
                )
            );
        }
    }, [searchQuery, allCards]);

    const loadDecks = () => {
        getAllDecksWithCard(setDecks);
    };

    getAllCards(deckId, setAllCards);

    // Fonctions pour les decks
    const handleOpenDeckModal = (deck?: DeckType) => {
        if (deck) {
            setCurrentDeck(deck);
            setDeckTitle(deck.title);
            setEditMode(true);
        } else {
            setCurrentDeck(null);
            setDeckTitle('');
            setEditMode(false);
        }
        setDeckModalVisible(true);
    };

    const handleSaveDeck = async () => {
        if (deckTitle.trim() === '') {
            Alert.alert('Erreur', 'Veuillez saisir un titre pour le deck');
            return;
        }

        try {
            if (editMode && currentDeck) {
                await updateDeck(currentDeck.id, deckTitle);
            } else {
                await createDeck(deckTitle);
            }
            setDeckModalVisible(false);
            loadDecks();
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de sauvegarder le deck');
        }
    };

    const handleDeleteDeck = async (deckId: string) => {
        Alert.alert(
            'Confirmation',
            'Êtes-vous sûr de vouloir supprimer ce deck ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDeck(deckId);
                            loadDecks();
                        } catch (error) {
                            Alert.alert('Erreur', 'Impossible de supprimer le deck');
                        }
                    }
                }
            ]
        );
    };

    // Fonctions pour la sélection de cartes
    const handleOpenCardSelectionModal = (deck: DeckType) => {
        setCurrentDeck(deck);
        // Récupérer les IDs des cartes déjà présentes dans le deck
        const existingCardIds = deck.cards?.map(card => card.id) || [];
        setSelectedCards(existingCardIds);
        setCardSelectionModalVisible(true);
    };

    const toggleCardSelection = (cardId: string) => {
        if (selectedCards.includes(cardId)) {
            setSelectedCards(selectedCards.filter(id => id !== cardId));
        } else {
            setSelectedCards([...selectedCards, cardId]);
        }
    };

    const handleSaveCardSelection = async () => {
        if (!currentDeck) return;

        try {
            // Cartes actuelles dans le deck
            const currentCardIds = currentDeck.cards?.map(card => card.id) || [];

            // Cartes à ajouter (présentes dans selectedCards mais pas dans currentCardIds)
            const cardsToAdd = selectedCards.filter(id => !currentCardIds.includes(id));

            // Cartes à supprimer (présentes dans currentCardIds mais pas dans selectedCards)
            const cardsToRemove = currentCardIds.filter(id => !selectedCards.includes(id));

            setCardSelectionModalVisible(false);
            loadDecks();
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de sauvegarder les cartes sélectionnées');
        }
    };

    const renderCardSelectionItem = ({ item }: { item: CardType }) => {
        const isSelected = selectedCards.includes(item.id);

        return (
            <TouchableOpacity
                style={[styles.cardSelectionItem, isSelected && styles.cardSelectionItemSelected]}
                onPress={() => toggleCardSelection(item.id)}
            >
                <View style={styles.cardSelectionContent}>
                    <Text style={styles.cardQuestion}>{item.question}</Text>
                    <Text style={styles.cardAnswer}>{item.answer}</Text>
                </View>
                <View style={styles.cardSelectionCheckbox}>
                    {isSelected && <Feather name="check" size={18} color="#007AFF" />}
                </View>
            </TouchableOpacity>
        );
    };

    const renderDeckItem = ({ item }: { item: DeckType }) => (
        <View style={styles.deckItem}>
            <View style={styles.deckHeader}>
                <Text style={styles.deckTitle}>{item.title}</Text>
                <Text style={styles.cardCount}>{item?.cards?.length || 0} cartes</Text>
            </View>

            <View style={styles.cardList}>
                {item.cards && item.cards.length > 0 ? (
                    item.cards.map((card) => (
                        <View key={card.id} style={styles.cardItem}>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardQuestion}>{card.question}</Text>
                                <Text style={styles.cardAnswer}>{card.answer}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Aucune carte dans ce deck</Text>
                )}
            </View>

            <View style={styles.deckActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOpenCardSelectionModal(item)}
                >
                    <Feather name="list" size={16} color="#007AFF" />
                    <Text style={styles.actionButtonText}>Sélectionner des cartes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOpenDeckModal(item)}
                >
                    <Feather name="edit" size={16} color="#007AFF" />
                    <Text style={styles.actionButtonText}>Modifier</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteDeck(item.id)}
                >
                    <Feather name="trash-2" size={16} color="#FF3B30" />
                    <Text style={styles.deleteButtonText}>Supprimer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mes Decks</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleOpenDeckModal()}
                >
                    <Feather name="plus" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {decks.length > 0 ? (
                <FlatList
                    data={decks}
                    renderItem={renderDeckItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.deckList}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Vous n'avez pas encore de decks</Text>
                    <TouchableOpacity
                        style={styles.emptyButton}
                        onPress={() => handleOpenDeckModal()}
                    >
                        <Text style={styles.emptyButtonText}>Créer un deck</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Modal pour créer/éditer un deck */}
            <Modal
                visible={deckModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setDeckModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editMode ? 'Modifier le deck' : 'Créer un nouveau deck'}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Nom du deck"
                            placeholderTextColor="#999"
                            value={deckTitle}
                            onChangeText={setDeckTitle}
                            autoFocus
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setDeckModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveDeck}
                            >
                                <Text style={styles.saveButtonText}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal pour sélectionner des cartes */}
            <Modal
                visible={cardSelectionModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setCardSelectionModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContentLarge}>
                        <Text style={styles.modalTitle}>
                            Sélectionner des cartes
                        </Text>

                        <TextInput
                            style={styles.searchInput}
                            placeholder="Rechercher des cartes..."
                            placeholderTextColor="#999"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />

                        <View style={styles.cardSelectionList}>
                            <FlatList
                                data={filteredCards}
                                renderItem={renderCardSelectionItem}
                                keyExtractor={item => item.id}
                                contentContainerStyle={styles.cardSelectionListContent}
                            />

                            {filteredCards.length === 0 && (
                                <Text style={styles.emptyText}>Aucune carte trouvée</Text>
                            )}
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setCardSelectionModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveCardSelection}
                            >
                                <Text style={styles.saveButtonText}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Deck;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#007AFF',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    deckList: {
        paddingBottom: 20,
    },
    deckItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    deckHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    deckTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    cardCount: {
        fontSize: 14,
        color: '#666',
    },
    cardList: {
        marginBottom: 12,
    },
    cardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    cardContent: {
        flex: 1,
    },
    cardQuestion: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    cardAnswer: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    deckActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    actionButtonText: {
        marginLeft: 6,
        color: '#007AFF',
        fontSize: 14,
    },
    deleteButton: {
        marginLeft: 'auto',
    },
    deleteButtonText: {
        marginLeft: 6,
        color: '#FF3B30',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginVertical: 10,
        textAlign: 'center',
    },
    emptyButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    emptyButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    modalContentLarge: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#F7F8FA',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
    },
    searchInput: {
        backgroundColor: '#F7F8FA',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
    },
    cardSelectionList: {
        flex: 1,
        maxHeight: 400,
        marginBottom: 16,
    },
    cardSelectionListContent: {
        paddingBottom: 8,
    },
    cardSelectionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: 'white',
    },
    cardSelectionItemSelected: {
        backgroundColor: '#E3F2FD',
    },
    cardSelectionContent: {
        flex: 1,
        paddingRight: 12,
    },
    cardSelectionCheckbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    modalButton: {
        padding: 12,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F0F0F0',
        marginRight: 8,
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: '500',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        marginLeft: 8,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '500',
    },
});