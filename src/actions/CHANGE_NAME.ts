import Game from "@/Game";
import WebSocket from "ws";
import Client from "@/Client";

type Request = {
    name: string
}

function CHANGE_NAME(game: Game, client: Client, socket: WebSocket, payload: Request) {
    const { name } = payload

    // set new client name
    client.setName(name)
    game.clients.sendClientList()
}

export default CHANGE_NAME