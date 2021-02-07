import MessageUtils from "./messages";
import { nanoid } from "nanoid"
import * as yup from "yup"

type Request = {
    action: string
    payload: any
}

const REQUEST_SCHEMA = yup.object({
    action: yup.string().required(),
    payload: yup.object().required()
}).strict(true).noUnknown(true)

class Utils {
    static Messages = MessageUtils

    static GenerateUUID(): string {
        return nanoid()
    }

    static ValidateRequest(payload: any): Request {
        let validData

        try {
            validData = REQUEST_SCHEMA.validateSync(payload)
        } catch (ex) {
            const { name, message } = ex
    
            if (name === "ValidationError") {
                throw new Error('Invalid request')
            }
    
            throw new Error('Unknown Error')
        }
    

        return validData
    } 
}

export default Utils