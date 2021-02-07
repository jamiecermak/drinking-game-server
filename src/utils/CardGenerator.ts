import Card from "@/types/Card";

class CardGenerator {
    private generateDeck(): Card[] {
        let deck: Card[] = [];

        deck.push(new Card(1, 1, 'Ace of Hearts', 'AH'))
        deck.push(new Card(1, 2, 'Two of Hearts', '2H'))
        deck.push(new Card(1, 3, 'Three of Hearts', '3H'))
        deck.push(new Card(1, 4, 'Four of Hearts', '4H'))
        deck.push(new Card(1, 5, 'Five of Hearts', '5H'))
        deck.push(new Card(1, 6, 'Six of Hearts', '6H'))
        deck.push(new Card(1, 7, 'Seven of Hearts', '7H'))
        deck.push(new Card(1, 8, 'Eight of Hearts', '8H'))
        deck.push(new Card(1, 9, 'Nine of Hearts', '9H'))
        deck.push(new Card(1, 10, 'Ten of Hearts', '10H'))
        deck.push(new Card(1, 11, 'Jack of Hearts', 'JH'))
        deck.push(new Card(1, 12, 'Queen of Hearts', 'QH'))
        deck.push(new Card(1, 13, 'King of Hearts', 'KH'))
    
        deck.push(new Card(2, 1, 'Ace of Diamonds', 'ACEDIA'))
        deck.push(new Card(2, 2, 'Two of Diamonds', '2D'))
        deck.push(new Card(2, 3, 'Three of Diamonds', '3D'))
        deck.push(new Card(2, 4, 'Four of Diamonds', '4D'))
        deck.push(new Card(2, 5, 'Five of Diamonds', '5D'))
        deck.push(new Card(2, 6, 'Six of Diamonds', '6D'))
        deck.push(new Card(2, 7, 'Seven of Diamonds', '7D'))
        deck.push(new Card(2, 8, 'Eight of Diamonds', '8D'))
        deck.push(new Card(2, 9, 'Nine of Diamonds', '9D'))
        deck.push(new Card(2, 10, 'Ten of Diamonds', '10D'))
        deck.push(new Card(2, 11, 'Jack of Diamonds', 'JD'))
        deck.push(new Card(2, 12, 'Queen of Diamonds', 'QD'))
        deck.push(new Card(2, 13, 'King of Diamonds', 'KD'))
    
        deck.push(new Card(3, 1, 'Ace of Clubs', 'AC'))
        deck.push(new Card(3, 2, 'Two of Clubs', '2C'))
        deck.push(new Card(3, 3, 'Three of Clubs', '3C'))
        deck.push(new Card(3, 4, 'Four of Clubs', '4C'))
        deck.push(new Card(3, 5, 'Five of Clubs', '5C'))
        deck.push(new Card(3, 6, 'Six of Clubs', '6C'))
        deck.push(new Card(3, 7, 'Seven of Clubs', '7C'))
        deck.push(new Card(3, 8, 'Eight of Clubs', '8C'))
        deck.push(new Card(3, 9, 'Nine of Clubs', '9C'))
        deck.push(new Card(3, 10, 'Ten of Clubs', '10C'))
        deck.push(new Card(3, 11, 'Jack of Clubs', 'JC'))
        deck.push(new Card(3, 12, 'Queen of Clubs', 'QC'))
        deck.push(new Card(3, 13, 'King of Clubs', 'KC'))

        deck.push(new Card(4, 1, 'Ace of Spades', 'AS'))
        deck.push(new Card(4, 2, 'Two of Spades', '2S'))
        deck.push(new Card(4, 3, 'Three of Spades', '3S'))
        deck.push(new Card(4, 4, 'Four of Spades', '4S'))
        deck.push(new Card(4, 5, 'Five of Spades', '5S'))
        deck.push(new Card(4, 6, 'Six of Spades', '6S'))
        deck.push(new Card(4, 7, 'Seven of Spades', '7S'))
        deck.push(new Card(4, 8, 'Eight of Spades', '8S'))
        deck.push(new Card(4, 9, 'Nine of Spades', '9S'))
        deck.push(new Card(4, 10, 'Ten of Spades', '10S'))
        deck.push(new Card(4, 11, 'Jack of Spades', 'JS'))
        deck.push(new Card(4, 12, 'Queen of Spades', 'QS'))
        deck.push(new Card(4, 13, 'King of Spades', 'KS'))

        return deck
    }

    private randomiseCards(cards: Card[]): Card[] {
        let randCards = cards

        for (let i = randCards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [randCards[i], randCards[j]] = [randCards[j], randCards[i]];
        }

        return randCards
    }

    public generateDecks(deckNum: number) {
        let cards: Card[] = []

        for(var i = 0; i < deckNum; i++) {
            cards = cards.concat(this.generateDeck())
        }

        cards = this.randomiseCards(cards)

        return cards
    }
}

export default CardGenerator