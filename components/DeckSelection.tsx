import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAllDecks, getUser } from '../utils/actions';
import StatsScreen from './StatsScreen';

const DeckSelection = ({ onSelect }) => {
    const [decks, setDecks] = useState([]);
    const [selectedDeckIds, setSelectedDeckIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [showStatsScreen, setShowStatsScreen] = useState(false);

    useEffect(() => {
        const getUserId = async () => {
            try {
                const user = await getUser();
                if (user) {
                    setUserId(user.id);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur:", error);
            }
        };
        getUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            getAllDecks().then((decks) => {
                setDecks(decks);
                setLoading(false);
            })
        }
    }, [userId]);


    const toggleDeckSelection = (deckId) => {
        setSelectedDeckIds((prev) =>
            prev.includes(deckId)
                ? prev.filter((id) => id !== deckId)
                : [...prev, deckId]
        );
    };

    const handleConfirm = () => {
        onSelect(selectedDeckIds);
    };
    
    const handleShowStats = () => {
        setShowStatsScreen(true);
    };
    
    const handleBackFromStats = () => {
        setShowStatsScreen(false);
    };

    const renderDeckItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.deckItem,
                selectedDeckIds.includes(item.id) && styles.selectedDeck
            ]}
            onPress={() => toggleDeckSelection(item.id)}
        >
            <Text style={styles.deckTitle}>{item.title}</Text>
            {selectedDeckIds.includes(item.id) && (
                <Text style={styles.selectedText}>✓</Text>
            )}
        </TouchableOpacity>
    );

    if (showStatsScreen) {
        return <StatsScreen onBack={handleBackFromStats} />
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Chargement des decks...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sélectionnez les decks pour le test</Text>
            <Text style={styles.subtitle}>Vous pouvez sélectionner plusieurs decks</Text>

            {decks.length > 0 ? (
                <FlatList
                    data={decks}
                    renderItem={renderDeckItem}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.list}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Aucun deck disponible</Text>
                </View>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleShowStats}>
                    <Text style={styles.cancelButtonText}>Statistiques</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.confirmButton,
                        selectedDeckIds.length === 0 && styles.disabledButton
                    ]}
                    onPress={handleConfirm}
                    disabled={selectedDeckIds.length === 0}
                >
                    <Text style={styles.confirmButtonText}>Commencer le test</Text>
                </TouchableOpacity>
            </View>
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
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 16,
        textAlign: 'center',
        fontSize: 16,
    },
    list: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
    },
    deckItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    selectedDeck: {
        backgroundColor: '#e6f0ff',
        borderColor: '#007BFF',
        borderWidth: 1,
    },
    deckTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    selectedText: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#f2f2f2',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: '600',
    },
    confirmButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
});

export default DeckSelection;