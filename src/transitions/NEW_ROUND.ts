import Game from "@/Game";
import GAME_OVER from "./GAME_OVER";
import { GameStage } from "@/types/GameStage";
import ActionNames from "@/lib/ActionNames";
import { EventTypes } from "@/lib/Events";

function NEW_ROUND(game: Game, advance: boolean = true) {
    game.state.clearGameTimer()
    
    // advance current position if required
    if (advance) {
        if (!game.state.current_position.advance()) {
            // game is complete
            GAME_OVER(game)
        }
    }

    // clear completed flags
    game.clients.clearCompleteFlags()

    // get current card
    const current = game.state.getCurrentCard()

    // setup history with card
    game.state.setupHistory()

    // check if players can actually put a card down
    if (!game.clients.someoneHasCard(current)) {
        //  if not, save history and call new round
        game.clients.broadcastMessage(ActionNames.MESSAGE, "Skipped card. No one could play.")
        game.state.saveHistory([])

        NEW_ROUND(game)
    }

    game.clients.resetRound()

    // send history to players
    game.clients.broadcastMessage(ActionNames.HISTORY_UPDATE, game.state.history)

    // send current revealed card, and position to everyone
    game.clients.broadcastMessage(ActionNames.NEW_ROUND, {
        position: game.state.current_position.getArray()
    })
    
    game.clients.setCompleteEvent(EventTypes.GIVE_DRINKS)

    // set game stage to GIVE_CARDS
    game.state.setGameStage(GameStage.GIVE_CARDS)

    // start game timer state
    game.state.setGameTimer(120, EventTypes.GIVE_DRINKS)
}

export default NEW_ROUND
