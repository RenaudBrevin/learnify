import { router } from 'expo-router';
import { Alert } from 'react-native';
import { supabase } from '../utils/supabase';

// Decks
export const getAllDecksWithCard = async (setDeck: Function) => {
    try {
        const { data, error } = await supabase
            .from('decks')
            .select('id, title, flashcards(id, question, answer)');
        if (error) {
            throw error;
        }

        setDeck(data);
        return data;
    } catch (error) {
        Alert.alert('Error', (error as Error).message);
    }
}

export const getAllDecks = async (setDeck: Function) => {
    try {
        const { data, error } = await supabase.from('decks').select('id, title, user_id');
        if (error) {
            throw error;
        }
        setDeck(data);
        return data;
    } catch (error) {
        Alert.alert('Error', (error as Error).message);
    }
};

export const createDeck = async (title: string) => {
    try {
        if (!title) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        const { error } = await supabase.from('decks').insert({
            title: title,
        });

        if (error) {
            throw error;
        }

        Alert.alert('Succès', 'Deck créé avec succès');
    } catch (error) {
        Alert.alert('Erreur', (error as Error).message);
    }
}

export const deleteDeck = async (deckId: string) => {
    try {
        const { error } = await supabase.from('decks').delete().eq('id', deckId);

        if (error) {
            throw error;
        }

        Alert.alert('Succès', 'Deck supprimé avec succès');
    } catch (error) {
        Alert.alert('Erreur', (error as Error).message);
    }
};

export const updateDeck = async (deckId: string, title: string) => {
    try {
        if (!title) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        const { error } = await supabase.from('decks').update({ title }).eq('id', deckId);

        if (error) {
            throw error;
        }

        Alert.alert('Succès', 'Deck mis à jour avec succès');
    } catch (error) {
        Alert.alert('Erreur', (error as Error).message);
    }
};



// Cards 
export const getAllCards = async (deckId: string, setCards: Function) => {
    try {
        const { data, error } = await supabase
            .from('flashcards')
            .select('id, question, answer')
            .eq('deck_id', deckId);

        if (error) {
            throw error;
        }

        setCards(data);
        return data;
    } catch (error) {
        Alert.alert('Error', (error as Error).message);
    }
}

export const createCard = async (deck: string, question: string, answer: string, setQuestion: Function, setAnswer: Function) => {
    try {
        if (!deck || !question || !answer) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        const { error } = await supabase.from('flashcards').insert({
            deck_id: deck,
            question: question,
            answer: answer,
        });

        if (error) {
            throw error;
        }

        Alert.alert('Succès', 'Carte créée avec succès');
        setQuestion('');
        setAnswer('');
    } catch (error) {
        Alert.alert('Erreur', (error as Error).message);
    }
};

// Auth
export async function handleAuth(email: string, password: string, name: string, isLogin: boolean) {
    if (!email || !password) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs');
        return;
    }

    if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        router.replace('/');
    } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) throw authError;

        if (!authData?.user) {
            throw new Error("L'utilisateur n'a pas été créé correctement.");
        }

        const { error: profileError } = await supabase
            .from('users')
            .insert({
                id: authData?.user.id,
                name: name,
                email: email
            });

        if (profileError) throw profileError;

        router.replace('/');
    }
}
