import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createCard, getAllDecks } from '../utils/actions';
import { Deck } from '../utils/types';

const Card = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [deck, setDeck] = useState<string>('');
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');

    useEffect(() => {
        getAllDecks(setDeck);
    }, []);

    getAllDecks(setDeck)
    
    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>Créer une carte</Text>
            <TextInput
                style={styles.input}
                placeholder="Question"
                placeholderTextColor="#999"
                onChangeText={setQuestion}
                value={question}
            />
            <TextInput
                style={styles.input}
                placeholder="Reponse"
                placeholderTextColor="#999"
                onChangeText={setAnswer}
                value={answer}
            />
            <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>Deck:</Text>
                <Picker
                    selectedValue={deck}
                    onValueChange={(itemValue) => setDeck(itemValue)}
                    style={styles.select}
                >
                    <Picker.Item label="Choisir un deck" value="" enabled={false} />
                    {decks.map((deck) => (
                        <Picker.Item key={deck.id} label={deck.title} value={deck.id} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => createCard(deck, question, answer, setQuestion, setAnswer)}>
                <Text style={styles.buttonText}>Créer</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Card;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    selectContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    selectLabel: {
        marginRight: 10,
    },
    select: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#4285F4',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        padding: 15,
        fontWeight: 'bold',
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#000',
    },
})