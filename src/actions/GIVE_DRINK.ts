import Game from "@/Game";
import WebSocket from "ws";
import Client from "@/Client";

type Request = {
    id: string
}

function GIVE_DRINK(game: Game, client: Client, socket: WebSocket, payload: Request) {
    const { id } = payload

    // attempt to use drink
    client.useDrink()

    // give drink to other player
    game.clients.getClient(id).giveDrink(client.getId())

    // send out history update
}

export default GIVE_DRINK