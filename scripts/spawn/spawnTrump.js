import { size, sound } from "../../JunioraMG/juniora-mg.js"
import { DAMAGES } from "../core/constants.js"
import { changeMoney } from "../systems/economy.js"
import state from "../core/state.js"

export default function spawnTrump(e, pouria) {
    const Trump = e.spawnCharacter('Trump')
    Trump.activatePhysics()
    let max = document.body.clientWidth - +(size('xx-lg'))
    let random = Math.floor(Math.random() * (max+1))
    Trump.moveRight(random)
    Trump.take('gun2')
    Trump.moveLeft(1)
    Trump.onHit((name) => {
        Trump.health(Trump.health()-DAMAGES[name], true)
        return true
    })
    Trump.onDied(() => {
        changeMoney(8)
        spawnTrump(e, pouria)
        localStorage.kills = +(localStorage.kills)+1
        localStorage.record = +(localStorage.kills) > +(localStorage.record) ? localStorage.kills : localStorage.record
        document.getElementById('kills').innerText = localStorage.kills
    })

    const TrumpShoot = setInterval(() => {
        if (!state.invisible) {
            if (pouria.getLocation()[1] > Trump.getLocation()[1] && Trump.getDirection() === 'left') {
                Trump.moveRight(1)
            }
            else if (pouria.getLocation()[1] < Trump.getLocation()[1] && Trump.getDirection() === 'right') {
                Trump.moveLeft(1)
            }
        }
        let spawnPoint
        if (Trump.getDirection() === 'right') {
            spawnPoint = [Trump.getLocation()[0] + Trump.getSize()[0]*0.5,Trump.getLocation()[1] + Trump.getSize()[1]]
        }
        else {
            spawnPoint = [Trump.getLocation()[0] + Trump.getSize()[0]*0.5, Trump.getLocation()[1]-30]
        }
        e.shoot('ammo2', spawnPoint, Trump.getDirection(), 50)
        sound('../audios/bang.mp3')
        if (Trump.health() <= 0) {
            clearInterval(TrumpShoot)
        }
    }, 800)
}