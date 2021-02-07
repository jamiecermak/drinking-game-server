import Game from "@/Game";
import WebSocket from "ws";
import Utils from "@/utils";
import ActionNames from "@/lib/ActionNames";

type Request = {
    name: string,
    game_secret_key: string | undefined
}

function JOIN_GAME(game: Game, socket: WebSocket, payload: Request) {
    const { name, game_secret_key } = payload

    const isOperator = game_secret_key && game.getSecretKey() === game_secret_key
    const [ client_id, secret_key ] = game.clients.createNew(socket, name, isOperator)

    // emit message that new client has joined
    game.clients.sendMessage(client_id, ActionNames.JOIN_GAME, {
        client_id,
        secret_key,
        name,
        isOperator
    })

    game.clients.sendClientList()
}

export default JOIN_GAME