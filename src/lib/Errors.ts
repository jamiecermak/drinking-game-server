export type Payload = {
    code: number
    message: string
}

class Errors {
    static INVALID_REQUEST: Payload = {
        message: "Invalid request",
        code: 0
    }

    static GAME_DOES_NOT_EXIST: Payload = {
        message: "Game does not exist",
        code: 1
    }

    static UNKNOWN_ACTION: Payload = {
        message: "Invalid action",
        code: 2
    }

    static NOT_OPERATOR: Payload = {
        message: "You cannot perform this action because you are not an operator",
        code: 3
    }

    static INVALID_KEY: Payload = {
        message: "Invalid private key",
        code: 4
    }

    static NO_CARD: Payload = {
        message: "You do not have this card to give",
        code: 5
    }

    static NO_DRINKS: Payload = {
        message: "You have no drinks to give",
        code: 6
    }
}

export default Errors