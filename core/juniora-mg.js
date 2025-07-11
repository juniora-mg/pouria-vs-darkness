/*

JunioraMG Project
Author: MohammadAli Arjomand
GitHub: https://github.com/arjomand-dev
Email: arjomand.dev@gmail.com
License: MIT

*/

sessionStorage.clear()

class Juniora {
    setup(method) {
        this.method = method
    }
    characters(characters) {
        this.characters = characters
    }
    start() {
        console.log("Welcome to JunioraMG Engine")
        if (this.method === undefined) {
            console.error("Setup method is required!")
            return 0
        }

        const helpers = {
            charatersList: this.characters,
            spawnedCharacters: {},
            keyEvent(key, handler) {
                if (typeof key === 'string') key = [key]
                document.addEventListener('keydown', e => {
                    if (key.includes(e.key)) handler()
                })
            },
            spawnCharacter(name) {
                const time = Date.now()
                let character = this.charatersList[name]
                if (character === undefined) {
                    console.error(`'${name}' is not a character`)
                    return 0
                }
                if (character.avatar === undefined) {
                    console.error(`'${name}' doesn't have avatar`);
                    return 0
                }
                
                const avatar = document.createElement('img')
                avatar.src = character.avatar
                avatar.alt = 'Loaded by JunioraMG'

                this.spawnedCharacters[name + time] = {
                    isLive: true,
                    id: 'jmg-' +time+ '-character-' + name,
                    events: {}
                }

                const sizes = {
                    'xx-sm': '30px',
                    'x-sm' : '60px',
                    'sm'   : '100px',
                    'md'   : '150px',
                    'lg'   : '180px',
                    'x-lg' : '210px',
                    'xx-lg': '250px'
                }
                if (!['xx-sm', 'x-sm', 'sm', 'md', 'lg', 'x-lg', 'xx-lg'].includes(character.size)) {
                    character.size = 'md'
                }
                avatar.style = 'width: ' + sizes[character.size]
                avatar.id = 'jmg-' +time+ '-character-' + name
                avatar.classList.add('jmg-characters')
                avatar.setAttribute('top', '0')
                avatar.setAttribute('left', '0')
                avatar.setAttribute('time', time)
                let direction = character.direction === undefined ? 'right' : character.direction
                if (direction === 'r') direction = 'right'
                if (direction === 'l') direction = 'left'
                avatar.setAttribute('direction', direction)
                if (character.dieSound !== undefined) avatar.setAttribute('die-sound', character.dieSound)
                if (character.health !== undefined) {
                    avatar.setAttribute('health', character.health)

                    const monitor = document.createElement('input')

                    monitor.type = 'range'
                    monitor.disabled = true
                    monitor.min = 0
                    monitor.max = character.health
                    monitor.value = character.health
                    monitor.setAttribute('character', name)
                    monitor.classList.add('jmg-health', 'jmg-health-' + monitor.getAttribute('character'))
                    monitor.id = 'jmg-' + time + '-health-monitor-' + name
                    document.body.appendChild(monitor)
                }
                avatar.setAttribute('character', name)
                document.body.appendChild(avatar)

                sessionStorage.setItem(name, true)

                return {
                    charatersList: this.charatersList,
                    spawnedCharacters: this.spawnedCharacters,
                    events: {
                        hit: null,
                        died: null,
                        moved: null
                    },
                    onHit(method) {
                        this.events.hit = method
                        this.spawnedCharacters[name + time].events.onHit = method
                    },
                    onDied(method) {
                        this.events.died = method
                        this.spawnedCharacters[name + time].events.onDied = method
                    },
                    onMoved(method) {
                        this.events.moved = method
                        this.spawnedCharacters[name + time].events.onMoved = method
                    },
                    moveUp(steps=8) {
                        const oldLocation = this.getLocation()
                        const character = document.querySelector(`#jmg-${time}-character-${name}`)
                        character.setAttribute('top', +(character.getAttribute('top'))-steps)
                        character.style.top = character.getAttribute('top') + "px"

                        const takedId = character.getAttribute('taked-id')
                        if (takedId !== null && document.getElementById(takedId) !== undefined) {
                            const taked = document.getElementById(takedId)
                            taked.style.top = +(character.getAttribute('top'))+character.clientHeight*0.5 + "px"
                        }

                        const health = character.getAttribute('health')
                        if (health !== null) {
                            const monitor = document.querySelector('#jmg-'+ character.getAttribute('time') +'-health-monitor-' + name)
                            monitor.style.top = +(character.getAttribute('top'))-50 + "px"
                        }
                        if (this.events.moved !== null) {

                        this.events.moved({
                            oldLocation, 
                            newLocation: this.getLocation()
                        })}
                    },
                    moveDown(steps=8) {
                        const oldLocation = this.getLocation()

                        const character = document.querySelector(`#jmg-${time}-character-${name}`)
                        character.setAttribute('top', +(character.getAttribute('top'))+steps)
                        character.style.top = character.getAttribute('top') + "px"

                        const takedId = character.getAttribute('taked-id')
                        if (takedId !== null && document.getElementById(takedId) !== undefined) {
                            const taked = document.getElementById(takedId)
                            taked.style.top = +(character.getAttribute('top'))+character.clientHeight*0.5 + "px"
                        }

                        const health = character.getAttribute('health')
                        if (health !== null) {
                            const monitor = document.querySelector('#jmg-'+ character.getAttribute('time') +'-health-monitor-' + name)
                            monitor.style.top = +(character.getAttribute('top'))-50 + "px"

                            if (character.style.display === 'none') {
                                monitor.style.top = document.body.clientHeight + 50 + "px"
                            }
                        }

                        if (this.events.moved !== null) {

                        this.events.moved({
                            oldLocation, 
                            newLocation: this.getLocation()
                        })}
                    },
                    moveLeft(steps=8) {
                        const oldLocation = this.getLocation()

                        const character = document.querySelector(`#jmg-${time}-character-${name}`)
                        character.setAttribute('left', +(character.getAttribute('left'))-steps)
                        character.style.left = character.getAttribute('left') + "px"
                        
                        if (character.getAttribute('direction') === 'right') {
                            character.classList.toggle('flip')
                            character.setAttribute('direction', 'left')
                        }

                        const takedId = character.getAttribute('taked-id')
                        if (takedId !== null && document.getElementById(takedId) !== undefined) {
                            const taked = document.getElementById(takedId)
                            taked.style.left = +(character.getAttribute('left'))+80 + "px"

                            if (taked.getAttribute('direction') === 'right') {
                                taked.classList.toggle('flip')
                                taked.setAttribute('direction', 'left')
                            }
                        }

                        const health = character.getAttribute('health')
                        if (health !== null) {
                            const monitor = document.querySelector('#jmg-'+ character.getAttribute('time') +'-health-monitor-' + name)
                            
                            monitor.style.left = +(character.getAttribute('left'))-(monitor.clientWidth-character.clientWidth)/2 + "px"
                        }
                        if (this.events.moved !== null) {

                        this.events.moved({
                            oldLocation, 
                            newLocation: this.getLocation()
                        })}
                    },
                    moveRight(steps=8) {
                        const oldLocation = this.getLocation()

                        const character = document.querySelector(`#jmg-${time}-character-${name}`)
                        character.setAttribute('left', +(character.getAttribute('left'))+steps)
                        character.style.left = character.getAttribute('left') + "px"

                        if (character.getAttribute('direction') === 'left') {
                            character.classList.toggle('flip')
                            character.setAttribute('direction', 'right')
                        }

                        const takedId = character.getAttribute('taked-id')
                        if (takedId !== null && document.getElementById(takedId) !== undefined) {
                            const taked = document.getElementById(takedId)
                            taked.style.left = +(character.getAttribute('left'))+80 + "px"

                            if (taked.getAttribute('direction') === 'left') {
                                taked.classList.toggle('flip')
                                taked.setAttribute('direction', 'right')
                            }
                        }

                        const health = character.getAttribute('health')
                        if (health !== null) {
                            const monitor = document.querySelector('#jmg-'+ character.getAttribute('time') +'-health-monitor-' + name)
                            monitor.style.left = +(character.getAttribute('left'))-(monitor.clientWidth-character.clientWidth)/2 + "px"
                        }
                        if (this.events.moved !== null) {

                        this.events.moved({
                            oldLocation, 
                            newLocation: this.getLocation()
                        })}
                    },
                    jump(steps=350) {
                        const oldLocation = this.getLocation()

                        const character = document.querySelector(`#jmg-${time}-character-${name}`)
                        if (character.getAttribute("physics") === "active" && +(character.getAttribute("top"))+character.clientHeight >= document.body.clientHeight) {
                            this.moveUp(steps)
                        }
                        if (this.events.moved !== null) {
                            this.events.moved({
                                oldLocation, 
                                newLocation: this.getLocation()
                            })}
                    },
                    getLocation() {
                        const character = document.querySelector(`#jmg-${time}-character-${name}`)
                        return [+(character.getAttribute('top')), +(character.getAttribute('left'))]
                    },
                    getSize() {
                        const character = document.querySelector(`#jmg-${time}-character-${name}`)
                        return [character.clientHeight, character.clientWidth]
                    },
                    getDirection() {
                        const character = document.querySelector(`#jmg-${time}-character-${name}`)
                        return character.getAttribute("direction")
                    },
                    activateUserControlls() {
                        const character = document.querySelector(`#jmg-${time}-character-${name}`)
                        document.addEventListener("keydown", e => {
                            switch (e.key) {
                                case 'ArrowDown':
                                case 's':
                                    if (character.getAttribute("physics") !== "active"){
                                        this.moveDown()
                                    }
                                    break;
                                case 'ArrowUp':
                                case 'w':
                                    if (character.getAttribute("physics") !== "active") {
                                        this.moveUp()
                                    }
                                    break;
                                case 'ArrowLeft':
                                case 'a':
                                    this.moveLeft()
                                    break;
                                case 'ArrowRight':
                                case 'd':
                                    this.moveRight()
                                    break;
                                case ' ':
                                    this.jump()
                                    break;
                                default:
                                    break;
                            }
                        })

                    },
                    activatePhysics() {
                        const character = document.querySelector(`#jmg-${time}-character-${name}`)
                        character.setAttribute("physics", "active")

                        setInterval(() => {
                            if (+(character.getAttribute("top"))+character.clientHeight < document.body.clientHeight) {
                                this.moveDown(10)
                            }
                        }, 25)

                    },
                    health(health='current', effects=false) {
                        const character = document.querySelector(`#jmg-${time}-character-${name}`)
                        if (character.getAttribute('health') !== null && +(character.getAttribute('health')) > 0) {
                            if (health === 'current') {
                                health = +(document.querySelector(`#jmg-${time}-character-${name}`).getAttribute('health'))
                            }
                            document.querySelector(`#jmg-${time}-character-${name}`).setAttribute('health', health)
                            document.querySelector('#jmg-'+ time + '-health-monitor-' + name).value = health
    
                            if (effects) {
                                character.classList.add('red-filter')
                                setTimeout(() => character.classList.remove('red-filter'), 250)
                            }
    
                            if (health <= 0) {
                                try {
                                    this.events.died()
                                } catch (error) {}
                                if (effects) {
                                    character.classList.add('gray-filter', 'despawn-effect')
                                }                 
                                setTimeout(() => character.style.display = 'none', 800)
                                
                                const takedId = character.getAttribute('taked-id')
                                if (takedId !== null && document.getElementById(takedId) !== undefined) {
                                    const taked = document.getElementById(takedId)
                                    taked.style.top = +(character.getAttribute('top'))+500 + "px"
                                    taked.classList.add('gray-filter', 'despawn-effect')
                                    setTimeout(() => taked.style.display = 'none', 800)
                                }
                            }
                            return health   
                        }
                        return 0
                    },
                    despawn() {
                        document.querySelector(`#jmg-${time}-character-${name}`).style.display = 'none'
                    },
                    spawn() {
                        document.querySelector(`#jmg-${time}-character-${name}`).style.display = 'block'
                    },
                    untake(takedId) {
                        document.body.removeChild(document.getElementById(takedId))
                        // character.removeAttribute('taked-id')
                    },
                    take(takingName) {
                        const taker = document.querySelector(`#jmg-${time}-character-${name}`)
                        const takingTime = Date.now()
                        const character = this.charatersList[takingName]
                        if (character === undefined) {
                            console.error(`'${takingName}' is not a character`)
                            return 0
                        }
                        if (character.avatar === undefined) {
                            console.error(`'${takingName}' doesn't have avatar`);
                            return 0
                        }

                        let avatar = document.createElement('img')
                        avatar.src = character.avatar
                        avatar.alt = 'Loaded by JunioraMG'

                        taker.setAttribute('taked-id', `jmg-taked-${takingTime}-character-` + takingName)

                        const sizes = {
                            'xx-sm': '20px',
                            'x-sm' : '30px',
                            'sm'   : '60px',
                            'md'   : '100px',
                            'lg'   : '150px',
                            'x-lg' : '180px',
                            'xx-lg': '210px'
                        }
                        if (!['xx-sm', 'x-sm', 'sm', 'md', 'lg', 'x-lg', 'xx-lg'].includes(character.size)) {
                            character.size = 'md'
                        }

                        avatar.style = 'width: '+sizes[character.size]
                        avatar.id = `jmg-taked-${takingTime}-character-${takingName}`
                        avatar.classList.add('jmg-taked-characters')
                        let direction = character.direction === undefined ? 'right' : character.direction
                        if (direction === 'r') direction = 'right'
                        if (direction === 'l') direction = 'left'
                        avatar.setAttribute('direction', direction)
                        avatar.style.top = +(taker.getAttribute('top'))+taker.clientHeight*0.5 + "px"
                        avatar.style.left = +(taker.getAttribute('left'))+taker.clientWidth*0.5 + "px"

                        document.body.appendChild(avatar)

                        sessionStorage.setItem(takingName, `jmg-taked-${takingTime}-character-` + takingName)

                        return `jmg-taked-${takingTime}-character-${takingName}`
                    }
                }
            },
            shoot(ballName, startAt=[0,0], direction='right', speed=20, decreaseSpeed=0, fall=false) {
                const spawnedCharacters = this.spawnedCharacters

                const time = Date.now()

                let character = this.charatersList[ballName]
                if (character === undefined) {
                    console.error(`'${ballName}' is not a character`)
                    return 0
                }
                if (character.avatar === undefined) {
                    console.error(`'${ballName}' doesn't have avatar`);
                    return 0
                }

                let avatar = document.createElement('img')
                avatar.src = character.avatar
                avatar.alt = 'Loaded by JunioraMG'

                const sizes = {
                    'xx-sm': '20px',
                    'x-sm' : '30px',
                    'sm'   : '60px',
                    'md'   : '100px',
                    'lg'   : '150px',
                    'x-lg' : '180px',
                    'xx-lg': '210px'
                }
                if (!['xx-sm', 'x-sm', 'sm', 'md', 'lg', 'x-lg', 'xx-lg'].includes(character.size)) {
                    character.size = 'md'
                }
                avatar.style = 'width: ' + sizes[character.size]
                avatar.id = `jmg-ball-${time}-character-${ballName}`
                avatar.classList.add('jmg-ball-characters')
                if (character.flip === true) avatar.classList.add('flip')
                avatar.setAttribute('top', `${startAt[0]}`)
                avatar.setAttribute('left', `${startAt[1]}`)
                avatar.style.top = avatar.getAttribute('top') + "px"
                avatar.style.left = avatar.getAttribute('left') + "px"

                    switch (direction) {
                        case 'right':
                        case 'r':
                            if (!character.flip) {
                                avatar.classList.remove('rotate90')
                                avatar.classList.remove('rotate180')
                                avatar.classList.remove('rotate270')
                                avatar.classList.add('rotate0')
                            }
                            else {
                                avatar.classList.remove('rotate90')
                                avatar.classList.remove('rotate0')
                                avatar.classList.remove('rotate270')
                                avatar.classList.add('rotate180')
                            }
                            break
                        case 'left':
                        case 'l':
                            if (!character.flip) {
                                avatar.classList.remove('rotate90')
                                avatar.classList.remove('rotate0')
                                avatar.classList.remove('rotate270')
                                avatar.classList.add('rotate180')
                            }
                            else {
                                avatar.classList.remove('rotate90')
                                avatar.classList.remove('rotate180')
                                avatar.classList.remove('rotate270')
                                avatar.classList.add('rotate0')
                            }
                            break
                        case 'up':
                        case 'u':
                            avatar.classList.remove('rotate0')
                            avatar.classList.remove('rotate180')
                            avatar.classList.remove('rotate270')
                            avatar.classList.add('rotate90')
                            break
                        case 'down':
                        case 'd':
                            avatar.classList.remove('rotate90')
                            avatar.classList.remove('rotate180')
                            avatar.classList.remove('rotate0')
                            avatar.classList.add('rotate270')
                            break
                        default:
                            break
                        
                    }

                document.body.append(avatar)
                sessionStorage.setItem(ballName, `jmg-ball-${time}-character-${ballName}`)

                let shootingBall = setInterval(() => {
                    const ball = document.querySelector(`#jmg-ball-${time}-character-${ballName}`)
                    switch (direction) {
                        case 'right':
                        case 'r':
                            ball.setAttribute('left', +(ball.getAttribute('left'))+speed)
                            ball.style.left = ball.getAttribute('left') + "px"
                            break
                        case 'left':
                        case 'l':
                            ball.setAttribute('left', +(ball.getAttribute('left'))-speed)
                            ball.style.left = ball.getAttribute('left') + "px"
                            break
                        case 'up':
                        case 'u':
                            ball.setAttribute('top', +(ball.getAttribute('top'))-speed)
                            ball.style.top = ball.getAttribute('top') + "px"
                            break
                        case 'down':
                        case 'd':
                            ball.setAttribute('top', +(ball.getAttribute('top'))+speed)
                            ball.style.top = ball.getAttribute('top') + "px"
                            break
                        default:
                            break
                        
                    }
                    
                    if (ball.getAttribute('left') > document.body.clientWidth || ball.getAttribute('left') < -(ball.clientWidth)) {
                        clearInterval(shootingBall)
                    }

                    let ballTop = +(ball.getAttribute('top'))
                    let ballLeft = +(ball.getAttribute('left'))
                    for (let character of document.getElementsByClassName('jmg-characters')) {

                        let characterTop = +(character.getAttribute('top'))
                        let characterLeft = +(character.getAttribute('left'))
                        if (ballTop > characterTop && ballTop < characterTop+character.clientHeight && ballLeft > characterLeft && ballLeft < characterLeft+character.clientWidth) {
                            const characterData = spawnedCharacters[character.getAttribute('character') + character.getAttribute('time')]
                            if (characterData.events.onHit !== undefined) {
                                if (characterData.events.onHit(ballName)) {
                                    clearInterval(shootingBall)
                                    ball.style.display = 'none'
                                    document.body.removeChild(ball)
                                }
                            }
                        }
                    }

                }, 25)
            }
        }

        this.method(helpers)
    }
}

function image(src) {
    let img = document.createElement('img')
    img.src = src
    img.alt = "Loaded by JunioraMG Engine"
    return img
}

function sound(url) {
    const sound = new Audio(url)
    sound.play()
}

function size(size) {
    const sizes = {
        'xx-sm': 30,
        'x-sm' : 60,
        'sm'   : 100,
        'md'   : 150,
        'lg'   : 180,
        'x-lg' : 210,
        'xx-lg': 250
    }
    return sizes[size]
}

export default Juniora;
export {image, sound, size}