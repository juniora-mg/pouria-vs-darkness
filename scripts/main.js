import Juniora, {image, size, sound} from '../core/juniora-mg.js'
import { changeMoney } from './money.js'

// constants
const DAMAGES = {
    ammo: 30, // 7 TIR
    ammo2: 75, // Rifle
    ammo3: 200, // LeaserGun
}
const MAX_HEALTH = {
    pouria: 6000,
    netaniaho: 600,
    Trump: 800
}

const game = new Juniora

game.characters(
    {
        pouria: {
            avatar: ('../images/pouria.jpg'),
            size: 'xx-lg',
            health: MAX_HEALTH['pouria']
        },
        gun: {
            avatar: ('../images/gun.png'),
            size: 'md',
            direction: 'right',
        },
        ammo: {
            avatar: ('../images/ammo.png'),
            size: 'x-sm',
            flip: true
        },
        gun2: {
            avatar: ('../images/gun2.png'),
            size: 'xx-lg',
            direction: 'right',
        },
        ammo2: {
            avatar: ('../images/ammo2.png'),
            size: 'x-sm'
        },
        gun3: {
            avatar: ('../images/gun3.png'),
            size: 'xx-lg',
            direction: 'right',
        },
        ammo3: {
            avatar: ('../images/ammo3.png'),
            size: 'x-sm'
        },
        netaniaho: {
            avatar: ('../images/neta.jpg'),
            size: 'md',
            health: MAX_HEALTH['netaniaho'],   
        },
        Trump: {
            avatar: '../images/trump.jpg',
            size: 'x-lg',
            health: MAX_HEALTH['Trump']
        }
    }
)

game.setup(
    e => {
            // functions
            const pouriaHit = name => {
                pouria.health(pouria.health()-DAMAGES[name], true)
                return true
            }

            // CHANGE GUN 
            const changeGunTo7Tir = () => {
                pouria.untake(pouriaGun)
                pouriaGun = pouria.take('gun')
                pouriaAmmo = ''
                allowFillAmmo = true
                ammoCount = 7
                fillAmmo()
            }
            e.keyEvent('1', changeGunTo7Tir)
            e.keyEvent('۱', changeGunTo7Tir)
            const changeGunToRifle = () => {
                if(localStorage.allowgun2 == 'true') {
                    pouria.untake(pouriaGun)
                    pouriaGun = pouria.take('gun2')
                    pouriaAmmo = '2'
                    allowFillAmmo = true
                    ammoCount = 12
                    fillAmmo()
                }
            }
            e.keyEvent('2', changeGunToRifle)
            e.keyEvent('۲', changeGunToRifle)
            const changeGunToLeaser = () => {
                if (localStorage.allowgun3 == 'true') {
                    pouria.untake(pouriaGun)
                    pouriaGun = pouria.take('gun3')
                    pouriaAmmo = '3'
                    allowFillAmmo = true
                    ammoCount = 50
                    fillAmmo()
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

            var invisible = false
            function useSoul() {
                if (localStorage.allowsoul == 'true') {
                    invisible = true
                    pouria.getElement().classList.add('transparent')
                    pouria.onHit(undefined)
                    localStorage.removeItem('allowsoul')
                    document.getElementById('msg').innerText = 'روح شوتو استفاده کردی'
                    setTimeout(()=>{
                        invisible = false
                        pouria.getElement().classList.remove('transparent')
                        pouria.onHit(pouriaHit)
                    }, 10000)
                }
            }
            e.keyEvent('n', useSoul)
            e.keyEvent('N', useSoul)
            e.keyEvent('د', useSoul)

            localStorage.kills = 0
            localStorage.record = localStorage.record === undefined ? 0 : localStorage.record
            localStorage.money = localStorage.money === undefined ? 0 : localStorage.money
            document.getElementById('kills').innerText = localStorage.kills
            document.getElementById('record').innerText = localStorage.record
            document.getElementById('money').innerText = localStorage.money

            if (localStorage.allowmedic1 === 'true' && localStorage.allowsoul === 'true') 
            {
                document.getElementById('msg').innerText = 'جون پر کن و روح شو داری'
            }
            else if (localStorage.allowmedic1 === 'true') {
                document.getElementById('msg').innerText = 'جون پر کن داری'
            }
            else if (localStorage.allowsoul === 'true') {
                document.getElementById('msg').innerText = 'روح شو داری'
            }
            else {
                document.getElementById('msg').innerText = 'هیچی نداری'
            }
          
            // POURIA
            const pouria = e.spawnCharacter('pouria')
            pouria.activateUserControlls()
            pouria.activatePhysics()
            let pouriaGun = pouria.take('gun')
            let pouriaAmmo = ''
            pouria.moveRight(400)
            pouria.onHit(pouriaHit)
            pouria.onDied(() => {
                setTimeout(() => {
                    alert('باختی!\nرو دکمه اوکی بزن تا بازی از اول شروع شه')
                    location.reload()
                }, 1200)
            })

            let ammoCount = 7
            const ammoMonitor = document.querySelector('.ammo-count')
            function fillAmmo() {
                ammoMonitor.innerHTML = ''
                for (let i = 0; i <ammoCount; i++) {
                    let ammo = image('../images/ammo' + pouriaAmmo +'.png')
                    ammo.style.transform = pouriaAmmo === '' ? 'rotate(90deg)' : 'rotate(270deg)'
                    ammo.width = 20
                    ammoMonitor.appendChild(ammo)
                }
            }
            fillAmmo()

            let allowFillAmmo = false
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
                    sound('../audios/bang.mp3')
                }
            })
            e.keyEvent('Control', () => {
                if (allowFillAmmo) {
                    ammoCount = pouriaAmmo === '' ? 7 : (pouriaAmmo === '2' ? 12 : 50)
                    fillAmmo()
                    sound('../audios/change.mp3')
                    allowFillAmmo = false
                }
            })

            setInterval(() => {
                allowFillAmmo = true
            }, 3000)


            // NETANIAHO
            function spawnNetaniaho() {
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
                        spawnTrump()
                    }
                    else {
                        spawnNetaniaho()
                    }
                })

                const netaniahoShoot = setInterval(() => {
                    if (!invisible) {
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
            spawnNetaniaho()

            function spawnTrump() {
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
                    spawnTrump()
                    localStorage.kills = +(localStorage.kills)+1
                    localStorage.record = +(localStorage.kills) > +(localStorage.record) ? localStorage.kills : localStorage.record
                    document.getElementById('kills').innerText = localStorage.kills
                })
            
                const TrumpShoot = setInterval(() => {
                    if (!invisible) {
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
        }
)

game.start()


function exitGame() {
    let conf = confirm("واقعا میخوای بری بیرون؟");
    console.log(conf);
    if (conf) {       
        location.assign("./index.html")
    }
}
document.querySelector("#exit").addEventListener("click", exitGame)