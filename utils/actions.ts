import { router } from 'expo-router';
import { Alert } from 'react-native';
import { supabase } from '../utils/supabase';

export const getAllDecks = async (setDecks?: Function) => {
    try {
        const { data, error } = await supabase.from('decks').select('id, title, user_id');
        if (error) {
            throw error;
        }
        if (setDecks) {
            setDecks(data);
        }
        return data;
    } catch (error) {
        Alert.alert('Error', (error as Error).message);
        return [];
    }
};

export const getCardsByDeck = async (deckId: string, setCards?: Function) => {
    try {
        const { data, error } = await supabase
            .from('flashcards')
            .select('*')
            .eq('deck_id', deckId);

        if (error) {
            throw error;
        }

        if (setCards) {
            setCards(data);
        }

        return data;
    } catch (error) {
        Alert.alert('Error', (error as Error).message);
        return [];
    }
};

export const createDeck = async (title: string) => {
    try {
        if (!title) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            throw new Error("Impossible de récupérer l'utilisateur");
        }

        const userId = user.id;

        const { error } = await supabase.from('decks').insert({
            title: title,
            user_id: userId,
        });

        if (error) {
            throw error;
        }

    } catch (error) {
        Alert.alert('Erreur', (error as Error).message);
    }
};


export const deleteDeck = async (deckId: string) => {
    try {
        deleteCardFromDeck(deckId);
        const { error } = await supabase.from('decks').delete().eq('id', deckId);

        if (error) {
            throw error;
        }

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

export const createCard = async (deck: string, question: string, answer: string, setQuestion?: Function, setAnswer?: Function) => {
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

        if (setQuestion) setQuestion('');
        if (setAnswer) setAnswer('');
        return true;
    } catch (error) {
        Alert.alert('Erreur', (error as Error).message);
        return false;
    }
};

export const updateCard = async (cardId: string, question: string, answer: string) => {
    try {
        if (!cardId || !question || !answer) {
            Alert.alert('Erreur', 'Informations incomplètes');
            return false;
        }

        const { error } = await supabase
            .from('flashcards')
            .update({
                question: question,
                answer: answer,
            })
            .eq('id', cardId);

        if (error) {
            throw error;
        }

        return true;
    } catch (error) {
        Alert.alert('Erreur', (error as Error).message);
        return false;
    }
};

export const deleteCard = async (cardId: string) => {
    try {
        const { error } = await supabase
            .from('flashcards')
            .delete()
            .eq('id', cardId);

        if (error) {
            throw error;
        }
        return true;
    } catch (error) {
        Alert.alert('Erreur', (error as Error).message);
        return false;
    }
};


export const deleteCardFromDeck = async (deckId: string) => {
    try {
        const { error } = await supabase
            .from('flashcards')
            .delete()
            .eq('deck_id', deckId);

        if (error) {
            throw error;
        }
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

        if (name) {
            const { error: profileError } = await supabase
                .from('users')
                .insert({
                    id: authData?.user.id,
                    name: name,
                    email: email
                });

            if (profileError) throw profileError;
        }

        router.replace('/');
    }
}
