import { pouriaHit, fillAmmo } from "../core/utils.js"

export default (e) => {
    const pouria = e.spawnEntity('pouria')
    pouria.enableInput()
    pouria.enablePhysics()
    let pouriaGun = pouria.attach('gun')
    let pouriaAmmo = ''
    pouria.moveRight(400)
    pouria.onHit(name => pouriaHit(name, pouria))
    pouria.onDied(() => {
        setTimeout(() => {
            alert('باختی!\nرو دکمه اوکی بزن تا بازی از اول شروع شه')
            location.reload()
        }, 1200)
    })

    let ammoCount = 7
    const ammoMonitor = document.querySelector('.ammo-count')
    fillAmmo(pouriaAmmo, ammoCount, ammoMonitor)

    return {pouria, pouriaGun, pouriaAmmo, ammoCount, ammoMonitor}
}