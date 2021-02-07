import { Payload } from "./Errors"

class GameError extends Error {
    public show_error: boolean
    public code: number

    static fromPayload(error: Payload) {
        const { code, message } = error

        return new this(code, message, true)
    }

    constructor(code: number, message: string, show_error: boolean) {
        super(message)

        this.code = code
        this.show_error = show_error
    }

    public getPayload(): Payload | boolean {
        if (!this.show_error) {
            return false
        }

        return {
            message: this.message,
            code: this.code
        }
    }
}

export default GameError