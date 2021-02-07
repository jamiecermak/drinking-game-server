import WebSocket from "ws"
import ActionNames from "@/lib/ActionNames"

class MessageUtils {
    static SendSuccess(socket: WebSocket, action: string, payload: any) {
        const response = {
            action: `CLIENT/${action}`,
            payload,
            success: true
        }

        socket.send(JSON.stringify(response))
    }

    static SendError(socket: WebSocket, error: any) {
        const response = {
            action: `CLIENT/${ActionNames.ERROR}`,
            payload: error,
            success: false
        }

        socket.send(JSON.stringify(response))
    }
}

export default MessageUtils

