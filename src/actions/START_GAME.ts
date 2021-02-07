import Game from "@/Game";
import WebSocket from "ws";
import Utils from "@/utils";
import Client from "@/Client";
import GameError from "@/lib/GameError";
import Errors from "@/lib/Errors";
import Transitions from "@/transitions";

type Request = { }

function START_GAME(game: Game, client: Client, socket: WebSocket, payload: Request) {
    if (!client.isOperator()) {
        throw GameError.fromPayload(Errors.NOT_OPERATOR)
    }

    // start transition
    Transitions.FIRST_ROUND(game)
}

export default START_GAME