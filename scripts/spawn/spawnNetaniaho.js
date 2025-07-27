import { size, playSound } from "../../JunioraMG/juniora-mg.js"
import { DAMAGES } from "../core/constants.js"
import { changeMoney } from "../systems/economy.js"
import state from "../core/state.js"

import spawnTrump from "./spawnTrump.js"

export default function spawnNetaniaho(e, pouria) {
    const netaniaho = e.spawnEntity('netaniaho')
    netaniaho.enablePhysics()
    let max = document.body.clientWidth - +(size('xx-lg'))
    let random = Math.floor(Math.random() * (max+1))
    netaniaho.moveRight(random)
    netaniaho.attach('gun')
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
            spawnNetaniaho(e, pouria)
        }
    })

    // Sin-Random moves
    const amplitude = 50 + Math.random() * 50
    const frequency = 0.02 + Math.random() + 0.02
    const phase = Math.random() * Math.PI * 2
    let t = 0

    const netaniahoScript = setInterval(() => {
        // handle moves
        t++
        const offsetX = amplitude * Math.sin(frequency * t + phase)
        if (offsetX > 0 && netaniaho.getLocation()[1] - offsetX >= 0) {
            netaniaho.moveLeft(offsetX)
        }
        else if (netaniaho.getLocation()[1] + netaniaho.getSize()[1] + offsetX <= window.innerWidth) {
            netaniaho.moveRight(-offsetX)
        }

        if (Math.random() < 0.2) {
            netaniaho.jump()
        }

        // set direction
        if (!state.invisible) {
            if (pouria.getLocation()[1] > netaniaho.getLocation()[1] && netaniaho.getDirection() === 'left') {
                netaniaho.moveRight(1)
            }
            else if (pouria.getLocation()[1] < netaniaho.getLocation()[1] && netaniaho.getDirection() === 'right') {
                netaniaho.moveLeft(1)
            }
        }

        // shoot
        let spawnPoint
        if (netaniaho.getDirection() === 'right') {
            spawnPoint = [netaniaho.getLocation()[0] + netaniaho.getSize()[0]*0.5,netaniaho.getLocation()[1] + netaniaho.getSize()[1]]
        }
        else {
            spawnPoint = [netaniaho.getLocation()[0] + netaniaho.getSize()[0]*0.5, netaniaho.getLocation()[1]-30]
        }
        e.shoot('ammo', spawnPoint, netaniaho.getDirection(), 50)
        playSound('../audios/bang.mp3')
        if (netaniaho.health() <= 0) {
            clearInterval(netaniahoScript)
        }
    }, 800)
}