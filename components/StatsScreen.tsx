import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getSessionStats, getUser } from '../utils/actions';

const StatsScreen = ({ onBack }) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);
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
        const fetchStats = async () => {
            if (!userId) return;
            
            try {
                setLoading(true);
                const deckStats = await getSessionStats(userId);
                setStats(deckStats);
            } catch (error) {
                console.error("Erreur lors de la récupération des statistiques:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [userId]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Jamais';
        try {
            // return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
            return dateString.split('T')[0].split('-').reverse().join(' ');
        } catch (error) {
            return 'Date invalide';
        }
    };

    const renderStatItem = ({ item }) => {
        const successRate = item.totalQuestions > 0 
            ? Math.round((item.totalCorrect / item.totalQuestions) * 100) 
            : 0;
            
        return (
            <View style={styles.statItem}>
                <Text style={styles.deckTitle}>{item.deckTitle}</Text>
                <View style={styles.statsRow}>
                    <View style={styles.statBlock}>
                        <Text style={styles.statValue}>{successRate}%</Text>
                        <Text style={styles.statLabel}>Bonnes réponses</Text>
                    </View>
                    <View style={styles.statBlock}>
                        <Text style={styles.statValue}>{item.totalSessions}</Text>
                        <Text style={styles.statLabel}>Sessions</Text>
                    </View>
                </View>
                <View style={styles.lastSessionContainer}>
                    <Text style={styles.lastSessionLabel}>Dernière révision:</Text>
                    <Text style={styles.lastSessionDate}>{formatDate(item.lastSessionDate)}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Statistiques de révision</Text>
            
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007BFF" />
                    <Text style={styles.loadingText}>Chargement des statistiques...</Text>
                </View>
            ) : stats.length > 0 ? (
                <FlatList
                    data={stats}
                    renderItem={renderStatItem}
                    keyExtractor={(item) => item.deckId.toString()}
                    style={styles.list}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Aucune statistique disponible</Text>
                    <Text style={styles.emptySubText}>Complétez des sessions pour voir vos statistiques</Text>
                </View>
            )}
            
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Text style={styles.backButtonText}>Retour à la sélection</Text>
            </TouchableOpacity>
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
        marginBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        textAlign: 'center',
        fontSize: 16,
    },
    list: {
        flex: 1,
    },
    statItem: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    deckTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    statBlock: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007BFF',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    lastSessionContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
        marginTop: 4,
    },
    lastSessionLabel: {
        fontSize: 14,
        color: '#666',
    },
    lastSessionDate: {
        fontSize: 14,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#666',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    backButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default StatsScreen;