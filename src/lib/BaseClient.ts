import Utils from "@/utils"
import WebSocket from "ws"

class BaseClient {
    private name: string
    private client_id: string
    private secret_key: string = Utils.GenerateUUID()
    private operator: boolean
    private active: boolean = true
    private socket: WebSocket

    constructor(socket: WebSocket, client_id: string, name: string, operator: boolean) {
        this.client_id = client_id
        this.name = name
        this.operator = operator
        this.socket = socket
    }

    public getName(): string {
        return this.name
    }

    public getId(): string {
        return this.client_id
    }

    public isActive(): boolean {
        return this.active
    }

    public setActive(active: boolean): void {
        this.active = active
    }

    public getSecretKey(): string {
        return this.secret_key
    }

    public validateSecretKey(secret_key: string): boolean {
        return this.secret_key === secret_key
    }

    public isOperator(): boolean {
        return this.operator
    }

    public setName(name: string) {
        this.name = name
    }

    public sendMessage(action: string, payload: any) {
        try {
            Utils.Messages.SendSuccess(this.socket, action, payload)
        } catch ( ex ) {
            return
        } 
    }

    public sendError(payload: any) {
        try {
            Utils.Messages.SendError(this.socket, payload)
        } catch ( ex ) {
            return
        } 
    }

    public disconnect() {
        this.setActive(false)
        this.socket.close()
    }

    public rejoin(socket: WebSocket) {
        this.setActive(true)
        this.socket = socket
    }
}

export default BaseClient