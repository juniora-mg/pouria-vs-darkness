import { size, sound } from "../../JunioraMG/juniora-mg.js"
import { DAMAGES } from "../core/constants.js"
import { changeMoney } from "../systems/economy.js"
import state from "../core/state.js"

import spawnTrump from "./spawnTrump.js"

export default function spawnNetaniaho(e, pouria) {
    const netaniaho = e.spawnCharacter('netaniaho')
    netaniaho.activatePhysics()
    let max = document.body.clientWidth - +(size('xx-lg'))
    let random = Math.floor(Math.random() * (max+1))
    netaniaho.moveRight(random)
    netaniaho.take('gun')
    netaniaho.moveLeft(1)
    netaniaho.onHit((name) => {
        netaniaho.health(netaniaho.health()-DAMAGES[name], true)
        return true
    })
    netaniaho.onDied(() => {
        changeMoney(6)
        localStorage.kills = +(localStorage.kills)+1
        localStorage.record = +(localStorage.kills) > +(localStorage.record) ? localStorage.kills : localStorage.record
        document.getElementById('kills').innerText = localStorage.kills
        if (localStorage.kills === '20') {
            spawnTrump(e, pouria)
        }
        else {
            console.log(123);
            
            spawnNetaniaho(e, pouria)
        }
    })

    const netaniahoShoot = setInterval(() => {
        if (!state.invisible) {
            if (pouria.getLocation()[1] > netaniaho.getLocation()[1] && netaniaho.getDirection() === 'left') {
                netaniaho.moveRight(1)
            }
            else if (pouria.getLocation()[1] < netaniaho.getLocation()[1] && netaniaho.getDirection() === 'right') {
                netaniaho.moveLeft(1)
            }
        }
        let spawnPoint
        if (netaniaho.getDirection() === 'right') {
            spawnPoint = [netaniaho.getLocation()[0] + netaniaho.getSize()[0]*0.5,netaniaho.getLocation()[1] + netaniaho.getSize()[1]]
        }
        else {
            spawnPoint = [netaniaho.getLocation()[0] + netaniaho.getSize()[0]*0.5, netaniaho.getLocation()[1]-30]
        }
        e.shoot('ammo', spawnPoint, netaniaho.getDirection(), 50)
        sound('../audios/bang.mp3')
        if (netaniaho.health() <= 0) {
            clearInterval(netaniahoShoot)
        }
    }, 800)
}