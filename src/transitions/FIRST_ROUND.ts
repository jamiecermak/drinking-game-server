import Game from "@/Game";
import NEW_ROUND from "./NEW_ROUND";

function FIRST_ROUND(game: Game) {
    // allocate the cards
    game.state.generateCardArrangement()

    // distribute remaining cards
    game.clients.distributeCards(game.state.getCardPool())

    // send out new round transition
    NEW_ROUND(game, false)
}

export default FIRST_ROUND