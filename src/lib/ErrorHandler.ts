import WebSocket from "ws";
import GameError from "./GameError";
import Utils from "@/utils";

type GameOnMessage = (socket: WebSocket, data: WebSocket.Data) => void
type WebsocketOnMessage = (data: WebSocket.Data) => void

function ErrorHandler(socket: WebSocket, fn: GameOnMessage): WebsocketOnMessage {
    return data => {
        try {
            fn(socket, data)
        } catch (ex) {
            if (ex instanceof GameError) {
                if (ex.show_error) {
                    Utils.Messages.SendError(socket, ex.getPayload())
                }

                // log
                return 
            }

            // log
        } 
    }
}

export default ErrorHandler