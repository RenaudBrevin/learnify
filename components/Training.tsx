import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, Animated, PanResponder} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Deck, Flashcard } from '../utils/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 120;

type TrainingProps = {
    deck: Deck;
    cards: Flashcard[];
    isLoading: boolean;
    onBackToDecks: () => void;
};

const Training: React.FC<TrainingProps> = ({ deck, cards, isLoading, onBackToDecks }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [cardsToReview, setCardsToReview] = useState<string[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const position = useRef(new Animated.ValueXY()).current;

    useEffect(() => {
        setIsFinished(cards.length === 0);
        setCurrentIndex(0);
        setShowAnswer(false);
        setCardsToReview([]);
        position.setValue({ x: 0, y: 0 });
    }, [cards]);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gesture) => {
            return showAnswer && Math.abs(gesture.dx) > 5;
        },
        onPanResponderMove: (_, gesture) => {
            position.setValue({ x: gesture.dx, y: 0 });
        },
        onPanResponderRelease: (_, gesture) => {
            if (gesture.dx > SWIPE_THRESHOLD) {
                swipeCard('right');
            } else if (gesture.dx < -SWIPE_THRESHOLD) {
                swipeCard('left');
            } else {
                resetPosition();
            }
        }
    });

    const resetPosition = () => {
        Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            friction: 5
        }).start();
    };

    const swipeCard = (direction: 'left' | 'right') => {
        const x = direction === 'left' ? -SCREEN_WIDTH * 1.5 : SCREEN_WIDTH * 1.5;
        const needsReview = direction === 'left';
        
        Animated.timing(position, {
            toValue: { x, y: 0 },
            duration: 300,
            useNativeDriver: true
        }).start(() => {
            position.setValue({ x: 0, y: 0 });
            handleNextCard(needsReview);
        });
    };

    const flipCard = () => {
        setShowAnswer(true);
    };

    const handleNextCard = (needsReview: boolean) => {
        const currentCard = cards[currentIndex];
        if (!currentCard) return;

        if (needsReview) {
            setCardsToReview(prev => 
                prev.includes(currentCard.id) ? prev : [...prev, currentCard.id]
            );
        } else {
            setCardsToReview(prev => prev.filter(id => id !== currentCard.id));
        }

        const isLastCard = currentIndex === cards.length - 1;
        if (isLastCard) {
            setIsFinished(true);
        } else {
            setCurrentIndex(currentIndex + 1);
            setShowAnswer(false);
        }
    };

    const markAsReview = () => {
        swipeCard('left');
    };

    const markAsKnown = () => {
        swipeCard('right');
    };

    const getCardStyle = () => {
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-10deg', '0deg', '10deg']
        });

        return {
            transform: [
                { translateX: position.x },
                { rotate }
            ]
        };
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.fixedBackButton} onPress={onBackToDecks}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                    <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{deck?.title || 'Entraînement'}</Text>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4285F4" />
                    <Text style={styles.loadingText}>Chargement des cartes...</Text>
                </View>
            </View>
        );
    }

    if (cards.length === 0) {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.fixedBackButton} onPress={onBackToDecks}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                    <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{deck?.title || 'Entraînement'}</Text>
                <View style={styles.emptyContainer}>
                    <Ionicons name="card-outline" size={64} color="#999" />
                    <Text style={styles.emptyText}>
                        Ce deck ne contient aucune carte.
                    </Text>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={onBackToDecks}
                    >
                        <Text style={styles.createButtonText}>Retour aux decks</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (isFinished) {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.fixedBackButton} onPress={onBackToDecks}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                    <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{deck?.title || 'Entraînement'}</Text>
                <View style={styles.finishedContainer}>
                    <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                    <Text style={styles.finishedTitle}>Entraînement terminé !</Text>
                    <Text style={styles.finishedText}>
                        Vous avez terminé toutes les cartes de ce deck.
                    </Text>

                    <View style={styles.reviewSummary}>
                        <Text style={styles.reviewSummaryText}>
                            Cartes à revoir : {cardsToReview.length}
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
                        onPress={() => {
                            setCurrentIndex(0);
                            setShowAnswer(false);
                            setCardsToReview([]);
                            setIsFinished(false);
                            position.setValue({ x: 0, y: 0 });
                        }}
                    >
                        <Ionicons name="refresh" size={20} color="#FFFFFF" />
                        <Text style={styles.restartButtonText}>Recommencer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={onBackToDecks}
                    >
                        <Ionicons name="albums-outline" size={20} color="#4285F4" />
                        <Text style={styles.homeButtonText}>Retour aux decks</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const currentCard = cards[currentIndex];

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.fixedBackButton} onPress={onBackToDecks}>
                <Ionicons name="arrow-back" size={24} color="#007AFF" />
                <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
            
            <Text style={styles.title}>{deck?.title || 'Entraînement'}</Text>
            
            <View style={styles.progressBar}>
                <Text style={styles.progressText}>
                    {currentIndex + 1} / {cards.length}
                </Text>
            </View>

            {showAnswer && (
                <View style={styles.swipeInstructionsContainer}>
                    <View style={styles.leftInstruction}>
                        <Ionicons name="arrow-back" size={20} color="#FF3B30" />
                        <Text style={styles.instructionText}>À revoir</Text>
                    </View>
                    <View style={styles.rightInstruction}>
                        <Text style={styles.instructionText}>Connue</Text>
                        <Ionicons name="arrow-forward" size={20} color="#4CAF50" />
                    </View>
                </View>
            )}

            <View style={styles.cardWrapper}>
                <Animated.View 
                    style={[styles.cardContainer, getCardStyle()]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.cardContent}>
                        {!showAnswer ? (
                            <>
                                <Text style={styles.questionText}>{currentCard.question}</Text>
                                <TouchableOpacity
                                    style={styles.showAnswerButton}
                                    onPress={flipCard}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.showAnswerButtonText}>Voir la réponse</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <Text style={styles.answerText}>{currentCard.answer}</Text>
                        )}
                    </View>

                    {showAnswer && (
                        <>
                            <Animated.View style={[
                                styles.overlay,
                                styles.leftOverlay,
                                {
                                    opacity: position.x.interpolate({
                                        inputRange: [-SCREEN_WIDTH / 2, 0],
                                        outputRange: [0.8, 0],
                                        extrapolate: 'clamp'
                                    })
                                }
                            ]}>
                                <Text style={styles.overlayText}>À REVOIR</Text>
                            </Animated.View>

                            <Animated.View style={[
                                styles.overlay,
                                styles.rightOverlay,
                                {
                                    opacity: position.x.interpolate({
                                        inputRange: [0, SCREEN_WIDTH / 2],
                                        outputRange: [0, 0.8],
                                        extrapolate: 'clamp'
                                    })
                                }
                            ]}>
                                <Text style={styles.overlayText}>CONNUE</Text>
                            </Animated.View>
                        </>
                    )}
                </Animated.View>
            </View>

            {/* Boutons d'action */}
            {/* {showAnswer && (
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.reviewButton]} 
                        onPress={markAsReview}
                    >
                        <Text style={styles.actionButtonText}>À revoir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.knownButton]} 
                        onPress={markAsKnown}
                    >
                        <Text style={styles.actionButtonText}>Connu</Text>
                    </TouchableOpacity>
                </View>
            )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    fixedBackButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
    },
    backButtonText: {
        fontSize: 16,
        color: '#007AFF',
        marginLeft: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 12,
        textAlign: 'center',
        color: '#333',
    },
    progressBar: {
        alignItems: 'center',
        marginBottom: 10,
    },
    progressText: {
        fontSize: 16,
        color: '#666',
    },
    swipeInstructionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    leftInstruction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightInstruction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    instructionText: {
        fontSize: 14,
        marginHorizontal: 5,
        color: '#666',
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
    },
    cardWrapper: {
        height: 400,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    cardContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    cardContent: {
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        flex: 1,
    },
    questionText: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
        marginBottom: 30,
    },
    answerText: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        color: '#4285F4',
    },
    showAnswerButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 30,
    },
    showAnswerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    leftOverlay: {
        backgroundColor: '#FF3B30',
    },
    rightOverlay: {
        backgroundColor: '#4CAF50',
    },
    overlayText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    actionButton: {
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
    },
    reviewButton: {
        backgroundColor: '#FF3B30',
    },
    knownButton: {
        backgroundColor: '#4CAF50',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    finishedContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    finishedTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
    },
    finishedText: {
        fontSize: 16,
        color: '#777',
        marginVertical: 20,
        textAlign: 'center',
    },
    reviewSummary: {
        backgroundColor: '#E1F5FE',
        padding: 16,
        borderRadius: 8,
        marginVertical: 20,
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
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderColor: '#4285F4',
        borderWidth: 1,
    },
    homeButtonText: {
        color: '#4285F4',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
});

export default Training;