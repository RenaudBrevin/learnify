export interface DeckType {
    id: string;
    title: string;
    user_id: string;
    cards?: [CardType];
}

export interface CardType{
    id: string;
    question: string;
    answer: string;
    deck_id: string;
}