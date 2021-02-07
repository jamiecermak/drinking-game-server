import WebSocket from 'ws'
import GameDaemon from './GameDaemon'
import Utils from './utils'
import GameError from './lib/GameError'
import Errors from './lib/Errors'
import ErrorHandler from './lib/ErrorHandler'

const socketConfig = {
    port: parseInt(process.env.PORT)
}

const daemon = new GameDaemon()

function onMessage(socket: WebSocket, data: WebSocket.Data) {
    // check if request matches general schema
    let request

    try {
        const jsonData = JSON.parse(data.toString())

        request = Utils.ValidateRequest(jsonData)
    } catch (ex) {
        throw GameError.fromPayload(Errors.INVALID_REQUEST)
    }

    daemon.onMessage(socket, request)
}

function onConnection(socket: WebSocket) {
    socket.on('message', ErrorHandler(socket, onMessage))
}

const socketServer = new WebSocket.Server(socketConfig)

socketServer.on('connection', onConnection)
