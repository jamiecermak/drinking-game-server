import Game from "@/Game";
import ActionNames from "@/lib/ActionNames";
import { GameStage } from "@/types/GameStage";

function GAME_OVER(game: Game) {
    // send game over message to everyone
    game.clients.broadcastMessage(ActionNames.GAME_OVER, {})

    game.state.setGameStage(GameStage.GAME_OVER)

    // destroy the game
    // game.destroy()
}

export default GAME_OVER