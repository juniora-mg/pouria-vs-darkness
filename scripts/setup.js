import { playSound } from "../JunioraMG/juniora-mg.js"
import { MAX_HEALTH, DAMAGES } from "./core/constants.js"
import { changeMoney } from "./systems/economy.js"
import { fillAmmo } from "./core/utils.js"
import { pouriaHit } from "./core/utils.js"
import prepare from "./bootstrap.js"
import state from "./core/state.js"

import spawnPouria from "./spawn/spawnPouria.js"
import spawnNetaniaho from "./spawn/spawnNetaniaho.js"

export default e => {

    // CHANGE GUN 
    const changeGunTo7Tir = () => {
        pouria.detach(pouriaGun)
        pouriaGun = pouria.attach('gun')
        pouriaAmmo = ''
        ammoCount = 7
        fillAmmo(pouriaAmmo, ammoCount, ammoMonitor)
    }
    e.keyEvent('1', changeGunTo7Tir)
    e.keyEvent('۱', changeGunTo7Tir)
    const changeGunToRifle = () => {
        if(localStorage.allowgun2 == 'true') {
            pouria.detach(pouriaGun)
            pouriaGun = pouria.attach('gun2')
            pouriaAmmo = '2'
            ammoCount = 12
            fillAmmo(pouriaAmmo, ammoCount, ammoMonitor)
        }
    }
    e.keyEvent('2', changeGunToRifle)
    e.keyEvent('۲', changeGunToRifle)
    const changeGunToLeaser = () => {
        if (localStorage.allowgun3 == 'true') {
            pouria.detach(pouriaGun)
            pouriaGun = pouria.attach('gun3')
            pouriaAmmo = '3'
            ammoCount = 50
            fillAmmo(pouriaAmmo, ammoCount, ammoMonitor)
        }
    }
    e.keyEvent('3', changeGunToLeaser)
    e.keyEvent('۳', changeGunToLeaser)
    
    function useMedic() {
        if (localStorage.allowmedic1 == 'true' && pouria.health() < MAX_HEALTH['pouria']) {
            pouria.health(MAX_HEALTH['pouria'], true, 'green', 2000)
            localStorage.removeItem('allowmedic1')
            document.getElementById('msg').innerText = 'جون پر کنتو استفاده کردی'
        }

    }
    e.keyEvent('m', useMedic)
    e.keyEvent('M', useMedic)
    e.keyEvent('پ', useMedic)
    e.keyEvent(',', useMedic)

    function useSoul() {
        if (localStorage.allowsoul == 'true') {
            state.invisible = true
            pouria.getElement().classList.add('transparent')
            pouria.onHit(undefined)
            localStorage.removeItem('allowsoul')
            document.getElementById('msg').innerText = 'روح شوتو استفاده کردی'
            setTimeout(()=>{
                state.invisible = false
                pouria.getElement().classList.remove('transparent')
                pouria.onHit(name => pouriaHit(name, pouria))
            }, 10000)
        }
    }
    e.keyEvent('n', useSoul)
    e.keyEvent('N', useSoul)
    e.keyEvent('د', useSoul)
  
    prepare()

    // POURIA
    
    let {pouria, pouriaGun, pouriaAmmo, ammoCount, ammoMonitor} = spawnPouria(e)

    e.keyEvent(['Shift'], () => {
        let spawnPoint
        if (pouria.getDirection() === 'right') {
            spawnPoint = [pouria.getLocation()[0] + pouria.getSize()[0]*0.5,pouria.getLocation()[1] + pouria.getSize()[1]]
        }
        else {
            spawnPoint = [pouria.getLocation()[0] + pouria.getSize()[0]*0.5, pouria.getLocation()[1]-30]
        }
        const direction = pouria.getDirection()
        const speed = 50
        if (ammoCount > 0) {
            e.shoot('ammo' + pouriaAmmo, spawnPoint, direction, speed)
            ammoCount--
            ammoMonitor.removeChild(ammoMonitor.lastChild)
            playSound('../audios/bang.mp3')
        }
    })
    let allowFillAmmo = false
    e.keyEvent('Control', () => {
        if (allowFillAmmo) {
            ammoCount = pouriaAmmo === '' ? 7 : (pouriaAmmo === '2' ? 12 : 50)
            fillAmmo(pouriaAmmo, ammoCount, ammoMonitor)
            playSound('../audios/change.mp3')
            allowFillAmmo = false
        }
    })


    setInterval(() => {
        allowFillAmmo = true
    }, 3000)

    // NETANIAHO
    spawnNetaniaho(e, pouria)
}