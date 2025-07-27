import Juniora from '../JunioraMG/juniora-mg.js'

import entities from './core/entities.js'
import setup from './setup.js'

const game = new Juniora
game.defineEntities(entities)
game.setup(setup)
game.start()


function exitGame() {
    let conf = confirm("واقعا میخوای بری بیرون؟");
    if (conf) {       
        location.assign("./index.html")
    }
}
document.querySelector("#exit").addEventListener("click", exitGame)