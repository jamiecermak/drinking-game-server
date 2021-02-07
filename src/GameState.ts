import Card from "./types/Card"
import CardGenerator from "./utils/CardGenerator"
import { GameStage } from "./types/GameStage"
import GameEvents from "./lib/Events"

class GameState {
    private card_pool: Array<Card>
    private row_config: Array<number>
    private deck_count: number
    private card_arrangement: Array<Array<Card>>
    public current_position: CurrentPosition
    public history: Array<Array<any>>
    private stage: GameStage
    private h_timer: NodeJS.Timeout
    private game_id: string
    private current_event: string | null = null

    constructor( game_id: string, row_config: Array<number>, deck_count: number ) {
        this.row_config = row_config
        this.deck_count = deck_count
        this.current_position = new CurrentPosition( row_config )
        this.card_arrangement = []
        this.card_pool = []
        this.history = []
        this.stage = GameStage.LOBBY
        this.game_id = game_id

        this.resetHistory()
    }

    private getPositionedObject<T>( positionedArray: any ): T {
        return positionedArray[this.current_position.row][this.current_position.column]
    }

    private setPositionedObject( positionedArray: any, value: any ) {
        positionedArray[this.current_position.row][this.current_position.column] = value
    }

    public generateCardArrangement() {
        const cardGenerator = new CardGenerator()
        this.card_pool = cardGenerator.generateDecks(this.deck_count)

        for (let row = 0; row < this.current_position.row_limit; row++) {
            const cardRow = []

            for (let column = 0; column < this.current_position.column_limit[row]; column++) {
                cardRow.push(this.card_pool.pop())
            }

            this.card_arrangement.push(cardRow)
        }
    }

    public getCurrentCard(): Card {
        return this.getPositionedObject<Card>(this.card_arrangement)
    }

    public saveHistory(results: any) {
        this.setPositionedObject(this.history, {
            played: true,
            card: this.getCurrentCard(),
            results // [{ client_id, count }]
        })
    }

    public resetHistory() {
        this.history = []

        for (let row = 0; row < this.current_position.row_limit; row++) {
            const history = []

            for (let column = 0; column < this.current_position.column_limit[row]; column++) {
                history.push({
                    played: false,
                    current: false
                })
            }

            this.history.push(history)
        }
    }

    public setupHistory() {
        this.setPositionedObject(this.history, {
            played: false,
            current: true,
            card: this.getCurrentCard(),
            results: []
        })
    }
    
    public advance(results): boolean {
        this.saveHistory(results)
        return this.current_position.advance()
    }

    public setGameStage(stage: GameStage) {
        this.stage = stage
    }

    public getGameStage() {
        return this.stage
    }

    public getCardPool() {
        return this.card_pool
    }

    public emitEvent() {
        GameEvents.emit(this.game_id, {
            action: this.current_event,
            payload: {}
        })

        this.clearGameTimer()
    }

    public setGameTimer(seconds: number, eventName: string) {
        this.current_event = eventName

        this.h_timer = setTimeout(this.emitEvent, seconds * 1000)
    }

    public clearGameTimer() {
        this.current_event = null
        
        if (this.h_timer === null) return

        clearTimeout(this.h_timer)
        this.h_timer = null
    }
}

export default GameState