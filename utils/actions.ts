import { router } from 'expo-router';
import { Alert } from 'react-native';
import { supabase } from '../utils/supabase';


// Cards 
export const getAllDecks = async (setDeck: Function) => {
    try {
        const { data, error } = await supabase.from('decks').select('id, title');
        if (error) {
            throw error;
        }
        setDeck(data);
        return data;
    } catch (error) {
        Alert.alert('Error', (error as Error).message);
    }
};

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