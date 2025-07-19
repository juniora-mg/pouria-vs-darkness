import { image } from "../../JunioraMG/juniora-mg.js"

import { DAMAGES } from "./constants.js"

const pouriaHit = (name, pouria) => {
    pouria.health(pouria.health()-DAMAGES[name], true)
    return true
}

function fillAmmo(pouriaAmmo, ammoCount, ammoMonitor) {
    ammoMonitor.innerHTML = ''
    for (let i = 0; i <ammoCount; i++) {
        let ammo = image('../images/ammo' + pouriaAmmo +'.png')
        ammo.style.transform = pouriaAmmo === '' ? 'rotate(90deg)' : 'rotate(270deg)'
        ammo.width = 20
        ammoMonitor.appendChild(ammo)
    }
}

export {pouriaHit, fillAmmo}