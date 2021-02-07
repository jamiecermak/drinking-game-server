import Utils from "@/utils"
import WebSocket from "ws"
import BaseClient from "./lib/BaseClient"
import Card from "./types/Card"
import GameError from "./lib/GameError"
import Errors from "./lib/Errors"
import ActionNames from "./lib/ActionNames"

class Client extends BaseClient {
    // is client ready to start game
    private ready: boolean = false

    // has client completed current stage
    private complete: boolean = false

    private cards: Array<Card> = []
    private current_cards: Array<Card> = []
    private current_drinks: number = 0
    private given_drinks: Array<any> = []

    constructor(socket: WebSocket, client_id: string, name: string, operator: boolean) {
        super(socket, client_id, name, operator)
    }

    public isComplete() {
        return this.complete
    }

    public setComplete() {
        this.complete = true
    }

    public clearComplete() {
        this.complete = false
    }
    
    public isReady() {
        return this.ready
    }

    public setReady() {
        this.ready = true
    }

    public clearReady() {
        this.ready = false
    }

    public setCards(cards: Array<Card>) {
        this.cards = cards
    }

    public hasCard(card_id: string): boolean {
        const cardIdx = this.cards.findIndex((card: Card) => card.id === card_id)

        return cardIdx !== -1
    }

    public useCard(card_id: string) {
        if (!this.hasCard(card_id)) {
            throw GameError.fromPayload(Errors.NO_CARD)
        }

        // remove card from player cards
        const cardIdx = this.cards.findIndex((card: Card) => card.id === card_id)

        this.current_cards.push(this.cards.splice(cardIdx, 1)[0])
        this.sendMessage(ActionNames.CARDS_UPDATE, this.current_cards)
    }

    public resetRound() {
        this.current_drinks = 0
        this.given_drinks = []
        this.current_cards = []
    }

    public getCurrentCards() {
        return this.current_cards
    }

    public getCurrentDrinks() {
        return this.current_drinks
    }

    public useDrink() {
        if (this.current_drinks <= 0) {
            throw GameError.fromPayload(Errors.NO_DRINKS)
        }

        this.current_drinks -= 1
        this.sendMessage(ActionNames.PLAYER_DRINKS_UPDATE, this.current_drinks)
    }

    public giveDrink(client_id: string) {
        const drinkIdx = this.given_drinks.findIndex(drink => drink.client_id === client_id)

        if (drinkIdx === -1) {
            this.given_drinks.push({
                client_id,
                count: 1
            })

            return
        }

        this.given_drinks[drinkIdx] = {
            ...this.given_drinks[drinkIdx],
            count: this.given_drinks[drinkIdx].count + 1
        }
    }

    public getGivenDrinks() {
        return this.given_drinks
    }

    public getNumberGivenDrinks() {
        return this.given_drinks.reduce((acc, drink) => {
            return acc + drink.count
        }, 0)
    }

    public calculateDrinks(currentPosition: CurrentPosition) {
        this.current_drinks = currentPosition.row * this.current_cards.length
    }

    public getCards() {
        return this.cards
    }
}

export default Client