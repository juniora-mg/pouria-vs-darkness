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
        sessionStorage['jmg-counter'] = 0
        sessionStorage['jmg-attaching-counter'] = 0
    }
    defineEntities(entities) {
        this.entities = entities
    }
    start() {
        console.log("Welcome to JunioraMG Engine")
        if (this.method === undefined) {
            console.error("Setup method is required!")
            return 0
        }

        const helpers = {
            entitiesList: this.entities,
            spawnedEntities: {},
            keyEvent(key, handler) {
                if (typeof key === 'string') key = [key]
                document.addEventListener('keydown', e => {
                    if (key.includes(e.key)) handler()
                })
            },
            spawnEntity(name) {
                const time = Date.now()
                const counter = +(sessionStorage['jmg-counter'])
                sessionStorage['jmg-counter'] = counter + 1
                let entity = this.entitiesList[name]
                if (entity === undefined) {
                    console.error(`'${name}' is not a entity`)
                    return 0
                }
                if (entity.avatar === undefined) {
                    console.error(`'${name}' doesn't have avatar`);
                    return 0
                }
                
                const avatar = document.createElement('img')
                avatar.src = entity.avatar
                avatar.alt = 'Loaded by JunioraMG'

                this.spawnedEntities[name + time] = {
                    isLive: true,
                    id: 'jmg-' +time+ '-entity-' + name,
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
                if (!['xx-sm', 'x-sm', 'sm', 'md', 'lg', 'x-lg', 'xx-lg'].includes(entity.size)) {
                    entity.size = 'md'
                }
                avatar.style = 'width: ' + sizes[entity.size]
                avatar.id = 'jmg-' +time+'-'+counter+ '-entity-' + name
                avatar.classList.add('jmg-entities')
                avatar.setAttribute('top', '0')
                avatar.setAttribute('left', '0')
                avatar.setAttribute('time', time)
                let direction = entity.direction === undefined ? 'right' : entity.direction
                if (direction === 'r') direction = 'right'
                if (direction === 'l') direction = 'left'
                avatar.setAttribute('direction', direction)
                if (entity.dieSound !== undefined) avatar.setAttribute('die-sound', entity.dieSound)
                if (entity.health !== undefined) {
                    avatar.setAttribute('health', entity.health)

                    const monitor = document.createElement('input')

                    monitor.type = 'range'
                    monitor.disabled = true
                    monitor.min = 0
                    monitor.max = entity.health
                    monitor.value = entity.health
                    monitor.setAttribute('entity', name)
                    monitor.classList.add('jmg-health', 'jmg-health-' + monitor.getAttribute('entity'))
                    monitor.id = 'jmg-' + time + '-health-monitor-' + name
                    document.body.appendChild(monitor)
                }
                avatar.setAttribute('entity', name)
                document.body.appendChild(avatar)

                sessionStorage.setItem(name, true)

                return {
                    entitiesList: this.entitiesList,
                    spawnedEntities: this.spawnedEntities,
                    events: {
                        hit: null,
                        died: null,
                        moved: null
                    },
                    onHit(method) {
                        this.events.hit = method
                        this.spawnedEntities[name + time].events.onHit = method
                    },
                    onDied(method) {
                        this.events.died = method
                        this.spawnedEntities[name + time].events.onDied = method
                    },
                    onMoved(method) {
                        this.events.moved = method
                        this.spawnedEntities[name + time].events.onMoved = method
                    },
                    moveUp(steps=8) {
                        const oldLocation = this.getLocation()
                        const entity = document.querySelector(`#jmg-${time}-${counter}-entity-${name}`)
                        entity.setAttribute('top', +(entity.getAttribute('top'))-steps)
                        entity.style.top = entity.getAttribute('top') + "px"

                        const attachedId = entity.getAttribute('attached-id')
                        if (attachedId !== null && document.getElementById(attachedId) !== undefined) {
                            const attached = document.getElementById(attachedId)
                            attached.style.top = +(entity.getAttribute('top'))+entity.clientHeight*0.5 + "px"
                        }

                        const health = entity.getAttribute('health')
                        if (health !== null) {
                            const monitor = document.querySelector('#jmg-'+ entity.getAttribute('time') +'-health-monitor-' + name)
                            monitor.style.top = +(entity.getAttribute('top'))-50 + "px"
                        }
                        if (this.events.moved !== null) {

                        this.events.moved({
                            oldLocation, 
                            newLocation: this.getLocation()
                        })}
                    },
                    moveDown(steps=8) {
                        const oldLocation = this.getLocation()

                        const entity = document.querySelector(`#jmg-${time}-${counter}-entity-${name}`)                        
                        entity.setAttribute('top', +(entity.getAttribute('top'))+steps)
                        entity.style.top = entity.getAttribute('top') + "px"

                        const attachedId = entity.getAttribute('attached-id')
                        if (attachedId !== null && document.getElementById(attachedId) !== undefined) {
                            const attached = document.getElementById(attachedId)
                            attached.style.top = +(entity.getAttribute('top'))+entity.clientHeight*0.5 + "px"
                        }

                        const health = entity.getAttribute('health')
                        if (health !== null) {
                            const monitor = document.querySelector('#jmg-'+ entity.getAttribute('time') +'-health-monitor-' + name)
                            monitor.style.top = +(entity.getAttribute('top'))-50 + "px"

                            if (entity.style.display === 'none') {
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

                        const entity = document.querySelector(`#jmg-${time}-${counter}-entity-${name}`)
                        entity.setAttribute('left', +(entity.getAttribute('left'))-steps)
                        entity.style.left = entity.getAttribute('left') + "px"
                        
                        if (entity.getAttribute('direction') === 'right') {
                            entity.classList.toggle('flip')
                            entity.setAttribute('direction', 'left')
                        }

                        const attachedId = entity.getAttribute('attached-id')
                        if (attachedId !== null && document.getElementById(attachedId) !== undefined) {
                            const attached = document.getElementById(attachedId)
                            attached.style.left = +(entity.getAttribute('left'))+80 + "px"

                            if (attached.getAttribute('direction') === 'right') {
                                attached.classList.toggle('flip')
                                attached.setAttribute('direction', 'left')
                            }
                        }

                        const health = entity.getAttribute('health')
                        if (health !== null) {
                            const monitor = document.querySelector('#jmg-'+ entity.getAttribute('time') +'-health-monitor-' + name)
                            
                            monitor.style.left = +(entity.getAttribute('left'))-(monitor.clientWidth-entity.clientWidth)/2 + "px"
                        }
                        if (this.events.moved !== null) {

                        this.events.moved({
                            oldLocation, 
                            newLocation: this.getLocation()
                        })}
                    },
                    moveRight(steps=8) {
                        const oldLocation = this.getLocation()

                        const entity = document.querySelector(`#jmg-${time}-${counter}-entity-${name}`)
                        entity.setAttribute('left', +(entity.getAttribute('left'))+steps)
                        entity.style.left = entity.getAttribute('left') + "px"

                        if (entity.getAttribute('direction') === 'left') {
                            entity.classList.toggle('flip')
                            entity.setAttribute('direction', 'right')
                        }

                        const attachedId = entity.getAttribute('attached-id')
                        if (attachedId !== null && document.getElementById(attachedId) !== undefined) {
                            const attached = document.getElementById(attachedId)
                            attached.style.left = +(entity.getAttribute('left'))+80 + "px"

                            if (attached.getAttribute('direction') === 'left') {
                                attached.classList.toggle('flip')
                                attached.setAttribute('direction', 'right')
                            }
                        }

                        const health = entity.getAttribute('health')
                        if (health !== null) {
                            const monitor = document.querySelector('#jmg-'+ entity.getAttribute('time') +'-health-monitor-' + name)
                            monitor.style.left = +(entity.getAttribute('left'))-(monitor.clientWidth-entity.clientWidth)/2 + "px"
                        }
                        if (this.events.moved !== null) {

                        this.events.moved({
                            oldLocation, 
                            newLocation: this.getLocation()
                        })}
                    },
                    jump(steps=350) {
                        const oldLocation = this.getLocation()

                        const entity = document.querySelector(`#jmg-${time}-${counter}-entity-${name}`)
                        if (entity.getAttribute("physics") === "enable" && +(entity.getAttribute("top"))+entity.clientHeight >= document.body.clientHeight) {
                            this.moveUp(steps)
                        }
                        if (this.events.moved !== null) {
                            this.events.moved({
                                oldLocation, 
                                newLocation: this.getLocation()
                            })}
                    },
                    getLocation() {
                        const entity = document.querySelector(`#jmg-${time}-${counter}-entity-${name}`)
                        return [+(entity.getAttribute('top')), +(entity.getAttribute('left'))]
                    },
                    getSize() {
                        const entity = document.querySelector(`#jmg-${time}-${counter}-entity-${name}`)
                        return [entity.clientHeight, entity.clientWidth]
                    },
                    getDirection() {
                        const entity = document.querySelector(`#jmg-${time}-${counter}-entity-${name}`)
                        return entity.getAttribute("direction")
                    },
                    getElement() {
                        return document.querySelector(`#jmg-${time}-${counter}-entity-${name}`)
                    },
                    enableInput() {
                        const entity = document.querySelector(`#jmg-${time}-${counter}-entity-${name}`)
                        document.addEventListener("keydown", e => {
                            switch (e.key) {
                                case 'ArrowDown':
                                case 's':
                                    if (entity.getAttribute("physics") !== "enable"){
                                        this.moveDown()
                                    }
                                    break;
                                case 'ArrowUp':
                                case 'w':
                                    if (entity.getAttribute("physics") !== "enable") {
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
                    enablePhysics() {
                        const entity = document.querySelector(`#jmg-${time}-${counter}-entity-${name}`)
                        entity.setAttribute("physics", "enable")

                        setInterval(() => {
                            if (+(entity.getAttribute("top"))+entity.clientHeight < document.body.clientHeight) {
                                this.moveDown(10)
                            }
                        }, 25)

                    },
                    health(health='current', effects=false, effectType='red', effectTime=250) {
                        const entity = document.querySelector(`#jmg-${time}-${counter}-entity-${name}`)
                        if (entity.getAttribute('health') !== null && +(entity.getAttribute('health')) > 0) {
                            if (health === 'current') {
                                health = +(document.querySelector(`#jmg-${time}-${counter}-entity-${name}`).getAttribute('health'))
                            }
                            document.querySelector(`#jmg-${time}-${counter}-entity-${name}`).setAttribute('health', health)
                            document.querySelector('#jmg-'+ time + '-health-monitor-' + name).value = health
    
                            if (effects) {
                                entity.classList.add(`${effectType}-filter`)
                                setTimeout(() => entity.classList.remove(`${effectType}-filter`), effectTime)
                            }
    
                            if (health <= 0) {
                                try {
                                    this.events.died()
                                } catch (error) {}
                                if (effects) {
                                    entity.classList.add('gray-filter', 'despawn-effect')
                                }                 
                                setTimeout(() => entity.style.display = 'none', 800)
                                
                                const attachedId = entity.getAttribute('attached-id')
                                if (attachedId !== null && document.getElementById(attachedId) !== undefined) {
                                    const attached = document.getElementById(attachedId)
                                    attached.style.top = +(entity.getAttribute('top'))+500 + "px"
                                    attached.classList.add('gray-filter', 'despawn-effect')
                                    setTimeout(() => attached.style.display = 'none', 800)
                                }
                            }
                            return health   
                        }
                        return 0
                    },
                    despawn() {
                        document.querySelector(`#jmg-${time}-${counter}-entity-${name}`).style.display = 'none'
                    },
                    spawn() {
                        document.querySelector(`#jmg-${time}-${counter}-entity-${name}`).style.display = 'block'
                    },
                    detach(attachedId) {
                        document.body.removeChild(document.getElementById(attachedId))
                    },
                    attach(targetName) {
                        const attachedTo = document.querySelector(`#jmg-${time}-${counter}-entity-${name}`)
                        const attachedAt = Date.now()
                        const attachingCounter = +(sessionStorage['jmg-attaching-counter'])
                        sessionStorage['jmg-attaching-counter'] = attachingCounter + 1
                        const entity = this.entitiesList[targetName]
                        if (entity === undefined) {
                            console.error(`'${targetName}' is not a entity`)
                            return 0
                        }
                        if (entity.avatar === undefined) {
                            console.error(`'${targetName}' doesn't have avatar`);
                            return 0
                        }

                        let avatar = document.createElement('img')
                        avatar.src = entity.avatar
                        avatar.alt = 'Loaded by JunioraMG'

                        attachedTo.setAttribute('attached-id', `jmg-attached-${attachedAt}-${attachingCounter}-entity-` + targetName)

                        const sizes = {
                            'xx-sm': '20px',
                            'x-sm' : '30px',
                            'sm'   : '60px',
                            'md'   : '100px',
                            'lg'   : '150px',
                            'x-lg' : '180px',
                            'xx-lg': '210px'
                        }
                        if (!['xx-sm', 'x-sm', 'sm', 'md', 'lg', 'x-lg', 'xx-lg'].includes(entity.size)) {
                            entity.size = 'md'
                        }

                        avatar.style = 'width: '+sizes[entity.size]
                        avatar.id = `jmg-attached-${attachedAt}-${attachingCounter}-entity-${targetName}`
                        avatar.classList.add('jmg-attached-entities')
                        let direction = entity.direction === undefined ? 'right' : entity.direction
                        if (direction === 'r') direction = 'right'
                        if (direction === 'l') direction = 'left'
                        avatar.setAttribute('direction', direction)
                        avatar.style.top = +(attachedTo.getAttribute('top'))+attachedTo.clientHeight*0.5 + "px"
                        avatar.style.left = +(attachedTo.getAttribute('left'))+attachedTo.clientWidth*0.5 + "px"

                        document.body.appendChild(avatar)

                        sessionStorage.setItem(targetName, `jmg-attached-${attachedAt}-${attachingCounter}-entity-` + targetName)

                        return `jmg-attached-${attachedAt}-${attachingCounter}-entity-${targetName}`
                    }
                }
            },
            shoot(ballName, startAt=[0,0], direction='right', speed=20, decreaseSpeed=0, fall=false) {
                const spawnedEntities = this.spawnedEntities

                const time = Date.now()

                let entity = this.entitiesList[ballName]
                if (entity === undefined) {
                    console.error(`'${ballName}' is not a entity`)
                    return 0
                }
                if (entity.avatar === undefined) {
                    console.error(`'${ballName}' doesn't have avatar`);
                    return 0
                }

                let avatar = document.createElement('img')
                avatar.src = entity.avatar
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
                if (!['xx-sm', 'x-sm', 'sm', 'md', 'lg', 'x-lg', 'xx-lg'].includes(entity.size)) {
                    entity.size = 'md'
                }
                avatar.style = 'width: ' + sizes[entity.size]
                avatar.id = `jmg-ball-${time}-entity-${ballName}`
                avatar.classList.add('jmg-ball-entities')
                if (entity.flip === true) avatar.classList.add('flip')
                avatar.setAttribute('top', `${startAt[0]}`)
                avatar.setAttribute('left', `${startAt[1]}`)
                avatar.style.top = avatar.getAttribute('top') + "px"
                avatar.style.left = avatar.getAttribute('left') + "px"

                    switch (direction) {
                        case 'right':
                        case 'r':
                            if (!entity.flip) {
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
                            if (!entity.flip) {
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
                sessionStorage.setItem(ballName, `jmg-ball-${time}-entity-${ballName}`)

                let shootingBall = setInterval(() => {
                    const ball = document.querySelector(`#jmg-ball-${time}-entity-${ballName}`)
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
                    for (let entity of document.getElementsByClassName('jmg-entities')) {

                        let entityTop = +(entity.getAttribute('top'))
                        let entityLeft = +(entity.getAttribute('left'))
                        if (ballTop > entityTop && ballTop < entityTop+entity.clientHeight && ballLeft > entityLeft && ballLeft < entityLeft+entity.clientWidth) {
                            const entityData = spawnedEntities[entity.getAttribute('entity') + entity.getAttribute('time')]
                            if (entityData.events.onHit !== undefined) {
                                if (entityData.events.onHit(ballName)) {
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

function loadImage(src) {
    let img = document.createElement('img')
    img.src = src
    img.alt = "Loaded by JunioraMG Engine"
    return img
}

function playSound(url) {
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
export {loadImage, playSound, size}