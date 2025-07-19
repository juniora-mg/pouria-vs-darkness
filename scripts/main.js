import Juniora from '../JunioraMG/juniora-mg.js'

import characters from './core/characters.js'
import setup from './setup.js'

const game = new Juniora
game.characters(characters)
game.setup(setup)
game.start()


function exitGame() {
    let conf = confirm("واقعا میخوای بری بیرون؟");
    console.log(conf);
    if (conf) {       
        location.assign("./index.html")
    }
}
document.querySelector("#exit").addEventListener("click", exitGame)