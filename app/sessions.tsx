import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DeckSelection from '../components/DeckSelection';
import { getAllCardsMulti, getUser, saveSession } from '../utils/actions';

const Sessions = () => {
    const [loading, setLoading] = useState(true);
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [timerActive, setTimerActive] = useState(false);
    const [deckIds, setDeckIds] = useState([]);
    const [showDeckSelection, setShowDeckSelection] = useState(true);
    const [userId, setUserId] = useState('');

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
        const fetchAllCards = async () => {
            setLoading(true);
            let allCards = [];
    
            for (const deckId of deckIds) {
                const cards = await getAllCardsMulti(deckId);
                allCards = [...allCards, ...cards];
            }
    
            setFlashcards(allCards);
            setLoading(false);
        };
    
        if (deckIds.length > 0) {
            fetchAllCards();
        }
    }, [deckIds]);
    

    useEffect(() => {
        if (!loading && flashcards.length > 0) {
            setTimerActive(true);
        }
    }, [loading, flashcards]);

    useEffect(() => {
        let timer;
        if (timerActive && !showAnswer) {
            timer = setTimeout(() => {
                setShowAnswer(true);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [currentIndex, timerActive, showAnswer]);

    const handleDeckSelection = (selectedDeckIds) => {
        setDeckIds(selectedDeckIds);
        setShowDeckSelection(false);
    };

    const handleAnswer = async (correct) => {
        if (correct) {
            setCorrectAnswers(prev => prev + 1);
        }

        if (currentIndex === flashcards.length - 1) {
            try {
                const totalQuestions = flashcards.length;
                const newCorrectAnswers = correct ? correctAnswers + 1 : correctAnswers;

                for (const deckId of deckIds) {
                    const deckFlashcards = flashcards.filter(card => card.deck_id === deckId);

                    if (deckFlashcards.length > 0) {
                        const deckTotalQuestions = deckFlashcards.length;
                        const deckCorrectAnswers = Math.round((newCorrectAnswers / totalQuestions) * deckTotalQuestions);

                        saveSession(userId, deckId, deckCorrectAnswers, deckTotalQuestions)
                    }
                }

                setQuizFinished(true);
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement de la session:', error);
            }
        } else {
            setCurrentIndex(prev => prev + 1);
            setShowAnswer(false);
        }
    };

    const handleFinish = () => {
        router.push('/sessions');
    };

    if (showDeckSelection) {
        return (
            <DeckSelection
                onSelect={handleDeckSelection}
            />
        );
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Préparation des questions...</Text>
            </View>
        );
    }

    if (flashcards.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Aucune flashcard trouvée pour les decks sélectionnés</Text>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/sessions')}>
                    <Text style={styles.buttonText}>Retour</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (quizFinished) {
        const score = Math.round((correctAnswers / flashcards.length) * 100);

        return (
            <View style={styles.container}>
                <Text style={styles.resultTitle}>Résultat du test</Text>
                <Text style={styles.scoreText}>{correctAnswers} / {flashcards.length} correctes</Text>
                <Text style={styles.percentageText}>{score}%</Text>

                <View style={styles.resultMessageContainer}>
                    <Text style={styles.resultMessage}>
                        {score >= 80 ? '🎉 Excellent travail !' :
                            score >= 60 ? '👍 Bon travail, continuez ainsi !' :
                                score >= 40 ? '🤔 Vous êtes en bon chemin, continuez !' :
                                    '📚 Continuez à réviser, vous progresserez !'}
                    </Text>
                </View>

                <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
                    <Text style={styles.finishButtonText}>Terminer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentCard = flashcards[currentIndex];

    return (
        <View style={styles.container}>
            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                    Question {currentIndex + 1} / {flashcards.length}
                </Text>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${((currentIndex + 1) / flashcards.length) * 100}%` }
                        ]}
                    />
                </View>
            </View>

            <View style={styles.cardContainer}>
                <Text style={styles.questionText}>{currentCard.question}</Text>

                {showAnswer ? (
                    <View style={styles.answerContainer}>
                        <Text style={styles.answerText}>{currentCard.answer}</Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.answerButton, styles.incorrectButton]}
                                onPress={() => handleAnswer(false)}
                            >
                                <Text style={styles.answerButtonText}>Je ne savais pas</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.answerButton, styles.correctButton]}
                                onPress={() => handleAnswer(true)}
                            >
                                <Text style={styles.answerButtonText}>Je savais</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>Réfléchissez à la réponse...</Text>
                        <View style={styles.timerBar}>
                            <View style={styles.timerFill} />
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 16,
        fontSize: 16,
    },
    errorText: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 20,
        color: '#d32f2f',
    },
    progressContainer: {
        marginBottom: 20,
    },
    progressText: {
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#007BFF',
        borderRadius: 4,
    },
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        minHeight: 200,
        justifyContent: 'space-between',
    },
    questionText: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 20,
    },
    timerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    timerText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#666',
    },
    timerBar: {
        width: '100%',
        height: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    timerFill: {
        height: '100%',
        width: '100%',
        backgroundColor: '#FFB74D',
        borderRadius: 3,
    },
    answerContainer: {
        marginTop: 20,
    },
    answerText: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        color: '#2E7D32',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    answerButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    incorrectButton: {
        backgroundColor: '#ffcdd2',
    },
    correctButton: {
        backgroundColor: '#c8e6c9',
    },
    answerButtonText: {
        fontWeight: '600',
        fontSize: 16,
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    scoreText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
    percentageText: {
        fontSize: 48,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#007BFF',
        marginBottom: 24,
    },
    resultMessageContainer: {
        backgroundColor: '#f0f9ff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 20,
    },
    resultMessage: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
    finishButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    finishButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Sessions;