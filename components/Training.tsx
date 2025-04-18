import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getCardsByDeck } from '../utils/actions';
import { Flashcard } from '../utils/types';

const Training = () => {
    const { deckId, deckTitle } = useLocalSearchParams();
    
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [cardsToReview, setCardsToReview] = useState<string[]>([]);

    useEffect(() => {
        const loadCards = async () => {
            if (!deckId) return;
            
            setLoading(true);
            const fetchedCards = await getCardsByDeck(deckId as string);
            
            const shuffledCards = fetchedCards ? [...fetchedCards].sort(() => Math.random() - 0.5) : [];
            
            setCards(shuffledCards);
            setLoading(false);
            
            if (shuffledCards.length === 0) {
                setIsFinished(true);
            }
        };
        
        loadCards();
    }, [deckId]);

    const handleCardPress = () => {
        if (!showAnswer) {
            setShowAnswer(true);
        }
    };

    const handleMarkCard = (needsReview: boolean) => {
        if (currentCardIndex >= cards.length) return;
        
        const currentCardId = cards[currentCardIndex].id;
        
        if (needsReview) {
            setCardsToReview(prev => [...prev, currentCardId]);
        } else {
            setCardsToReview(prev => prev.filter(id => id !== currentCardId));
        }
        
        if (currentCardIndex < cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setShowAnswer(false);
        } else {
            setIsFinished(true);
        }
    };

    const handleRestart = () => {
        const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
        setCards(shuffledCards);
        setCurrentCardIndex(0);
        setShowAnswer(false);
        setIsFinished(false);
        setCardsToReview([]);
    };

    const renderCard = () => {
        if (!cards.length || currentCardIndex >= cards.length) {
            return null;
        }
        
        const currentCard = cards[currentCardIndex];
        
        return (
            <TouchableOpacity 
                style={styles.cardContainer} 
                onPress={handleCardPress}
                activeOpacity={0.9}
            >
                {showAnswer ? (
                    <View style={styles.cardContent}>
                        <Text style={styles.answerLabel}>Réponse :</Text>
                        <Text style={styles.answerText}>{currentCard.answer}</Text>
                        
                        <View style={styles.reviewButtonsContainer}>
                            <TouchableOpacity 
                                style={styles.knownButton}
                                onPress={() => handleMarkCard(false)}
                            >
                                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                                <Text style={styles.knownButtonText}>Connue</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.reviewButton}
                                onPress={() => handleMarkCard(true)}
                            >
                                <Ionicons name="refresh-circle" size={20} color="#FFFFFF" />
                                <Text style={styles.reviewButtonText}>À revoir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.cardContent}>
                        <Text style={styles.questionLabel}>Question :</Text>
                        <Text style={styles.questionText}>{currentCard.question}</Text>
                        <Text style={styles.tapInfo}>Appuyez pour voir la réponse</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderFinished = () => (
        <View style={styles.finishedContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            <Text style={styles.finishedTitle}>Entraînement terminé !</Text>
            <Text style={styles.finishedText}>
                Vous avez terminé toutes les cartes de ce deck.
            </Text>
            
            <View style={styles.reviewSummary}>
                <Text style={styles.reviewSummaryText}>
                    Cartes à revoir : {cardsToReview.length} / {cards.length}
                </Text>
                {cardsToReview.length > 0 ? (
                    <Text style={styles.reviewTip}>
                        Continuez à vous entraîner pour maîtriser toutes les cartes !
                    </Text>
                ) : (
                    <Text style={styles.reviewTip}>
                        Excellent travail ! Vous avez maîtrisé toutes les cartes.
                    </Text>
                )}
            </View>
            
            <TouchableOpacity 
                style={styles.restartButton} 
                onPress={handleRestart}
            >
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.restartButtonText}>Recommencer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.homeButton} 
                onPress={() => router.replace('/')}
            >
                <Ionicons name="home" size={20} color="#4285F4" />
                <Text style={styles.homeButtonText}>Retour à l'accueil</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                    <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
            </View>
            
            <Text style={styles.title}>{deckTitle || 'Entraînement'}</Text>
            
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4285F4" />
                    <Text style={styles.loadingText}>Chargement des cartes...</Text>
                </View>
            ) : isFinished ? (
                renderFinished()
            ) : cards.length > 0 ? (
                <>
                    {renderCard()}
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            Carte {currentCardIndex + 1} / {cards.length}
                        </Text>
                        <View style={styles.progressBar}>
                            <View style={[
                                styles.progressFill, 
                                { width: `${((currentCardIndex + 1) / cards.length) * 100}%` }
                            ]} />
                        </View>
                    </View>
                </>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        Ce deck ne contient aucune carte. Veuillez en ajouter pour vous entraîner.
                    </Text>
                    <TouchableOpacity 
                        style={styles.emptyButton} 
                        onPress={() => router.push('/card')}
                    >
                        <Text style={styles.emptyButtonText}>Ajouter des cartes</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    header: {
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#333',
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
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        minHeight: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        marginBottom: 24,
        justifyContent: 'center',
    },
    cardContent: {
        alignItems: 'center',
        width: '100%',
    },
    questionLabel: {
        fontSize: 18,
        color: '#666',
        marginBottom: 16,
    },
    questionText: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
        marginBottom: 24,
    },
    answerLabel: {
        fontSize: 18,
        color: '#666',
        marginBottom: 16,
    },
    answerText: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        color: '#4285F4',
        marginBottom: 24,
    },
    tapInfo: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 16,
    },
    reviewButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginTop: 24,
        paddingHorizontal: 16,
    },
    knownButton: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginHorizontal: 8,
        minWidth: 120,
    },
    knownButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    reviewButton: {
        backgroundColor: '#FF9800',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginHorizontal: 8,
        minWidth: 120,
    },
    reviewButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    reviewSummary: {
        backgroundColor: '#E1F5FE',
        padding: 16,
        borderRadius: 8,
        marginBottom: 24,
        width: '100%',
        alignItems: 'center',
    },
    reviewSummaryText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0277BD',
        marginBottom: 8,
    },
    reviewTip: {
        fontSize: 14,
        color: '#0277BD',
        textAlign: 'center',
    },
    progressContainer: {
        marginBottom: 24,
    },
    progressText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4285F4',
        borderRadius: 4,
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
        marginBottom: 24,
    },
    emptyButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    finishedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    finishedTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    finishedText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
    },
    restartButton: {
        backgroundColor: '#4285F4',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginBottom: 16,
    },
    restartButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    homeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4285F4',
    },
    homeButtonText: {
        color: '#4285F4',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
});

export default Training;