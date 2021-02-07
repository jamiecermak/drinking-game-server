import events from 'events'

const GameEvents = new events.EventEmitter()

export class EventTypes {
    static FIRST_ROUND = 'FIRST_ROUND'

    static DRINK = 'DRINK'

    static GIVE_DRINKS = 'GIVE_DRINKS'
    
    static NEW_ROUND = 'NEW_ROUND'

    static EXTEND_TIMER = 'EXTEND_TIMER'
}

export default GameEvents