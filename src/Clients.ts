import Utils from "./utils"
import Client from "./Client"
import WebSocket from "ws"
import ActionNames from "./lib/ActionNames"
import Card from "./types/Card"
import GameEvents from "./lib/Events"

type ClientRegistry = Record<string, Client>

class Clients {
    private clients: ClientRegistry = {}
    public socket: WebSocket
    private completed_event: string | null = null
    private game_id: string

    constructor(game_id: string) {
        this.game_id = game_id
    }

    public createNew(socket: WebSocket, name: string, operator: boolean): Array<string> {
        const client_id = Utils.GenerateUUID()
        this.clients[client_id] = new Client(socket, client_id, name, operator)
        const secret_key = this.clients[client_id].getSecretKey()

        this.sendClientList()

        return [client_id, secret_key]
    }

    public getActive() {
        return Object.keys(this.clients)
            .filter(client_id => this.clients[client_id].isActive())
    }

    public onExit(client_id: string) {
        this.clients[client_id].setActive(false)

        this.sendClientList()
        
        // broadcast message that client is inactive
    }

    public broadcastMessage(action: string, payload: any) {
        this.getActive()
            .forEach(client_id => this.sendMessage(client_id, action, payload))
    }

    public emitMessage(client_id: string, action: string, payload: any) {
        this.getActive()
            .filter(x => x !== client_id)
            .forEach(client_id => this.sendMessage(client_id, action, payload))
    }

    public sendMessage(client_id: string, action: string, payload: any) {
        this.clients[client_id].sendMessage(action, payload)
    }

    public sendClientList() {
        const clientList = this.getList()

        this.getActive()
            .forEach(client_id => this.sendMessage(client_id, ActionNames.CLIENTS_UPDATE, clientList))
    }

    public getList() {
        return Object.values(this.clients)
            .map(client => ({
                client_id: client.getId(),
                name: client.getName(),
                operator: client.isOperator(),
                active: client.isActive(),
                ready: client.isReady(),
                complete: client.isComplete()
            }))
    }

    public getActiveList() {
        return Object.values(this.clients)
            .filter(client => client.isActive())
            .map(client => ({
                client_id: client.getId(),
                name: client.getName(),
                operator: client.isOperator()
            }))
    }

    public getClient(client_id: string) {
        return this.clients[client_id]
    } 

    public clearCompleteFlags() {
        Object.values(this.clients)
            .forEach(client => client.clearComplete())

        this.sendClientList()
    }

    public broadcastNewRound(currentPosition: CurrentPosition) {
        return Object.values(this.clients)
            .filter(client => client.isActive())
            .forEach(client => client.sendMessage(ActionNames.NEW_ROUND, {
                cards: client.getCards(),
                position: currentPosition.getArray()
            }))
    }

    public distributeCards(cards: Array<Card>) {
        const num_cards = cards.length
        const num_clients = Object.keys(this.getActive()).length
        const num_distributed_cards = (num_cards - (num_cards % num_clients)) / num_clients

        Object.values(this.clients)
            .filter(client => client.isActive())
            .forEach(client => client.setCards(cards.splice(0, num_distributed_cards)))

        Object.values(this.clients)
            .filter(client => client.isActive())
            .forEach(client => client.setCards(cards.splice(0, num_distributed_cards)))
    }

    public someoneHasCard(card: Card) {
        const num_clients = Object.values(this.clients)
            .filter(client => client.isActive())
            .filter(client => client.hasCard(card.id))
            .length

        return num_clients !== 0
    }

    public onComplete() {
        if (this.completed_event === null) return

        GameEvents.emit(this.game_id, { 
            payload: {},
            action: this.completed_event
        })

        this.completed_event = null
    }

    public checkCompletedClients() {
        const num_clients = Object.values(this.clients)
            .filter(client => client.isActive())
            .filter(client => client.isComplete())
            .length

        if (num_clients !== 0) return

        this.onComplete()
    }

    public clientComplete(client_id) {
        this.getClient(client_id).setComplete()
        this.sendClientList()

        this.checkCompletedClients()
    }

    public clientReady(client_id) {
        this.getClient(client_id).setReady()
        this.sendClientList()
    }

    public setCompleteEvent(eventName: string | null) {
        this.completed_event = eventName
    }   

    public getClientsPlayedCards() {
        return Object.values(this.clients)
            .filter(client => client.getCurrentCards().length > 0)
            .reduce((acc, client) => {
                return [...acc, {
                    client_id: client.getId(),
                    cards: client.getCurrentCards()
                }]
            }, [])
    }

    public calculateClientDrinks(currentPosition: CurrentPosition) {
        Object.values(this.clients)
            .filter(client => client.getCurrentCards().length > 0)
            .forEach(client => client.calculateDrinks(currentPosition))
    }

    public sendClientsDrinks() {
        Object.values(this.clients)
            .filter(client => client.isActive())
            .forEach(client => client.sendMessage(ActionNames.PLAYER_DRINKS_UPDATE, client.getCurrentDrinks()))
    }

    public sendClientsGivenDrinks() {
        Object.values(this.clients)
            .filter(client => client.isActive())
            .forEach(client => client.sendMessage(ActionNames.REVEALED_DRINKS_UPDATE, client.getGivenDrinks()))
    }

    public resetRound() {
        Object.values(this.clients)
            .forEach(client => client.resetRound())
    }

    public getTotalDrinks() {
        return Object.values(this.clients)
            .filter(client => client.isActive())
            .reduce((acc, client) => acc + client.getCurrentDrinks(), 0)
    }

    public getTotalGivenDrinks() {
        return Object.values(this.clients)
            .filter(client => client.isActive())
            .reduce((acc, client) => acc + client.getNumberGivenDrinks(), 0)
    }
}

export default Clients