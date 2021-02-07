import Game from "@/Game";
import WebSocket from "ws";
import Client from "@/Client";

type Request = { }

function COMPLETE(game: Game, client: Client, socket: WebSocket, payload: Request) {
    game.clients.clientComplete(client.getId())
}

export default COMPLETE