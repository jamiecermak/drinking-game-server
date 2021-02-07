class Card {
    public suit: number
    public number: number
    public name: string
    public id: string

    constructor(suit: number, number: number, name: string, id: string) {
        this.suit = suit
        this.number = number
        this.name = name
        this.id = id
    }
}

export default Card