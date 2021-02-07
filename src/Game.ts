import WebSocket from 'ws'
import Utils from './utils'
import Clients from './Clients'
import Actions from './actions'
import GameState from './GameState'
import Client from './Client'
import ActionNames from './lib/ActionNames'
import GameError from './lib/GameError'
import Errors from './lib/Errors'
import GameEvents, { EventTypes } from './lib/Events'
import Transitions from './transitions'

export default class Game {
    private game_id: string
    private secret_key: string
    public clients: Clients
    public state: GameState

    constructor(game_id: string, row_config: Array<number>, deck_count: number) {
        this.game_id = game_id

        this.secret_key = Utils.GenerateUUID()
        this.clients = new Clients(game_id)
        this.state = new GameState(game_id, row_config, deck_count)

        this.onMessage = this.onMessage.bind(this)
        GameEvents.on(game_id, data => {
            const { action, payload } = data

            this.onEvent(action, payload)
        })
    }

    public getSecretKey() {
        return this.secret_key
    }

    public getId() {
        return this.game_id
    }

    public destroy() {

    }

    public onMessage(socket: WebSocket, action: string, payload: any) {
        let client: Client

        if (action !== ActionNames.JOIN_GAME) {
            const { client_id, secret_key } = payload

            // check that the secret_key of the client is stored
            // and get client
            client = this.clients.getClient(client_id)

            // check secret key
            if (!client.validateSecretKey(secret_key)) {
                throw GameError.fromPayload(Errors.INVALID_KEY)
            }

            
        }

        switch(action) {
            case ActionNames.JOIN_GAME:
                Actions.JOIN_GAME(this, socket, payload)
                break
            case ActionNames.START_GAME:
                Actions.START_GAME(this, client, socket, payload)
                break
            case ActionNames.CHANGE_NAME:
                Actions.CHANGE_NAME(this, client, socket, payload)
                break
            case ActionNames.COMPLETE:
                Actions.COMPLETE(this, client, socket, payload)
                break
            case ActionNames.GIVE_CARD:
                Actions.GIVE_CARD(this, client, socket, payload)
                break
            case ActionNames.GIVE_DRINK:
                Actions.GIVE_DRINK(this, client, socket, payload)
                break
            case ActionNames.READY:
                Actions.READY(this, client, socket, payload)
                break
            default:
                throw GameError.fromPayload(Errors.UNKNOWN_ACTION)
        }
    }

    public onEvent(action: string, payload: any) {
        switch(action) {
            case EventTypes.GIVE_DRINKS:
                Transitions.GIVE_DRINKS(this)
                break
            case EventTypes.NEW_ROUND:
                Transitions.NEW_ROUND(this)
                break
            case EventTypes.DRINK:
                Transitions.DRINK(this)
                break
            default:
                break
        }
    }
}