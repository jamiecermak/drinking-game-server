import Game from "@/Game";
import WebSocket from "ws";
import Client from "@/Client";

type Request = {
    id: string
}

function GIVE_CARD(game: Game, client: Client, socket: WebSocket, payload: Request) {
    const { id } = payload

    // attempt to use card
    client.useCard(id)

    // send out history update
}

export default GIVE_CARD