import Game from "@/Game";
import { EventTypes } from "@/lib/Events";
import { GameStage } from "@/types/GameStage";
import NEW_ROUND from "./NEW_ROUND";

function GIVE_DRINKS(game: Game) {
    game.state.clearGameTimer()

    // get all clients cards
    const clientCards = game.clients.getClientsPlayedCards()

    // clear completed flags
    game.clients.clearCompleteFlags()

    // save history
    game.state.saveHistory(clientCards)

    // calculate clients drinks
    game.clients.calculateClientDrinks(game.state.current_position)

    // if no one has drinks go to next round
    if (game.clients.getTotalDrinks() <= 0) {
        NEW_ROUND(game)
        return
    }

    // send each client number of drinks
    game.clients.sendClientsDrinks()

    // set timer events
    game.clients.setCompleteEvent(EventTypes.DRINK)

    // set game stage to GIVE_DRINKS
    game.state.setGameStage(GameStage.GIVE_DRINKS)

    // start game timer state
    game.state.setGameTimer(120, EventTypes.DRINK)
}

export default GIVE_DRINKS