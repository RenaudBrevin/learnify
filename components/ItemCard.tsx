import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Flashcard } from '../utils/types';

type CardItemProps = {
    item: Flashcard;
    onEdit: (card: Flashcard) => void;
    onDelete: (id: string) => void;
};

export const renderCardItem = ({ item, onEdit, onDelete }: CardItemProps) => {
    return (
        <View style={styles.cardItem}>
            <View style={styles.cardContent}>
                <Text style={styles.cardQuestion}>{item.question}</Text>
                <Text style={styles.cardAnswer}>{item.answer}</Text>
            </View>
            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => onEdit(item)}
                >
                    <Ionicons name="pencil" size={22} color="#4285F4" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(item.id)}
                >
                    <Ionicons name="trash" size={22} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </View>
    )
};

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