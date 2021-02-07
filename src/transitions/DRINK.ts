import Game from "@/Game";
import { EventTypes } from "@/lib/Events";
import { GameStage } from "@/types/GameStage";
import NEW_ROUND from "./NEW_ROUND";

function DRINK(game: Game, advance: boolean = true) {
    game.state.clearGameTimer()

    // clear completed flags
    game.clients.clearCompleteFlags()

    // if no one gave drinks go to next round
    if (game.clients.getTotalGivenDrinks() <= 0) {
        NEW_ROUND(game)
        return
    }

    // send each client number of drinks
    game.clients.sendClientsGivenDrinks()

    // set timer events
    game.clients.setCompleteEvent(EventTypes.NEW_ROUND)

    // start game timer state
    game.state.setGameTimer(120, EventTypes.NEW_ROUND)

    // set game stage to DRINK
    game.state.setGameStage(GameStage.DRINK)
}

export default DRINK