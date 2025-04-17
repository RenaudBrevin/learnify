export interface Deck {
    id: string;
    title: string;
}
export interface Flashcard {
    id: string;
    deck_id: string;
    question: string;
    answer: string;
    created_at?: string;
}