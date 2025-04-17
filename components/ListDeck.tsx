import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Deck, Flashcard } from '../utils/types';
import { renderDeckItem } from './ItemDeck';
import { createDeck } from '../utils/actions';
import { renderCardItem } from './ItemCard';

export const renderDeckListView = (
    decks: Deck[],
    setSelectedDeck: Function,
    loadCards: Function
) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [availableCards, setAvailableCards] = useState<Flashcard[]>([]);
    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');

    const handleCreateDeck = async () => {
        setIsLoading(true);
        await createDeck(title);
        setIsLoading(false);
        setModalVisible(false);
    };

    return (
        <>
            <Text style={styles.title}>Mes Decks</Text>
            {decks?.length > 0 ? (
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
                    setTitle('');
                    setModalVisible(true);
                }}
            >
                <Text style={styles.addDeckButtonText}>Créer un nouveau deck</Text>
            </TouchableOpacity>


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Créer un nouveau deck</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text>X</Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Titre du deck"
                            placeholderTextColor="#999"
                            onChangeText={setTitle}
                            value={title}
                        />

                        <Text style={styles.sectionTitle}>Sélectionner des cartes (optionnel)</Text>

                        {availableCards?.length > 0 ? (
                            <FlatList
                                data={availableCards}
                                renderItem={renderCardItem}
                                keyExtractor={item => item.id}
                                style={styles.cardList}
                            />
                        ) : (
                            <Text style={styles.emptyText}>
                                {isLoading ? "Chargement des cartes..." : "Aucune carte disponible"}
                            </Text>
                        )}

                        <View style={styles.selectionInfo}>
                            <Text style={styles.selectionText}>
                                {selectedCards?.length} carte(s) sélectionnée(s)
                            </Text>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.createButton, isLoading && styles.disabledButton]}
                                onPress={handleCreateDeck}
                                disabled={isLoading}
                            >
                                <Text style={styles.createButtonText}>
                                    {isLoading ? "Création..." : "Créer le deck"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
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
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    cardList: {
        maxHeight: 300,
    },
    cardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    selectedCardItem: {
        backgroundColor: '#e6f0ff',
        borderColor: '#b3d1ff',
    },
    cardContent: {
        flex: 1,
    },
    cardQuestion: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    cardAnswer: {
        fontSize: 12,
        color: '#666',
    },
    checkbox: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginLeft: 8,
    },
    selectionInfo: {
        marginVertical: 12,
        alignItems: 'center',
    },
    selectionText: {
        fontSize: 14,
        color: '#666',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
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
    createButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledButton: {
        opacity: 0.7,
    },
});