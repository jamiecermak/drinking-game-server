import Game from "@/Game";
import WebSocket from "ws";
import Client from "@/Client";

type Request = {
    row_config: Array<number>,
    deck_count: number
}

function READY(game: Game, client: Client, socket: WebSocket, payload: Request) {
    game.clients.clientReady(client.getId())
}

export default READY