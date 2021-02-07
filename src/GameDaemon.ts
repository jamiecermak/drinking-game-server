import WebSocket from 'ws'
import Game from './Game'
import Utils from './utils'
import Errors from '@/lib/Errors'
import GameError from './lib/GameError'

type GameRegistry = Record<string, Game>

export default class GameDaemon {
    private games: GameRegistry = {}

    private doesGameExist(game_id: string) {
        return Object.keys(this.games).includes(game_id)
    }

    private createNewGame(socket: WebSocket, payload: any) {
        const { row_config, deck_count } = payload

        // generate gameid
        const game_id = Utils.GenerateUUID()

        // create new game instance
        this.games[game_id] = new Game(game_id, row_config, deck_count)

        const secret_key = this.games[game_id].getSecretKey()

        // send back game_id and secret_key
        Utils.Messages.SendSuccess(socket, '', {
            game_id,
            secret_key
        })
    }

    public destroyGame(game_id: string) {
        this.games[game_id] = undefined
    }

    private onGameMessage(socket: WebSocket, action: string, payload: any) {
        if (action.split('/').length !== 3) {
            throw GameError.fromPayload(Errors.UNKNOWN_ACTION)
        }

        const [target, game_id, actionName] = action.split('/')

        // check if game exists in registry
        if (!this.doesGameExist(game_id)) {
            throw GameError.fromPayload(Errors.GAME_DOES_NOT_EXIST)
        }

        // route command to game instance
        this.games[game_id].onMessage(socket, actionName, payload)
    }

    public onMessage(socket: WebSocket, data: any) {
        const { action, payload } = data

        switch(action) {
            case 'SERVER/NEW_GAME':
                this.createNewGame(socket, payload)
            default:
                this.onGameMessage(socket, action, payload)
        }
    }
}