localStorage.money = localStorage.money === undefined ? 0 : localStorage.money
document.getElementById('money').innerText = localStorage.money

import {changeMoney} from './money.js'

function bought(id) {
    const el = document.getElementById(id)
    const btn = el.lastElementChild.lastElementChild
    
    btn.innerHTML = "خریده شده"
    btn.classList.add('bought')
}
bought('gun1')

const shopItems = [
    {
        id: "gun1",
        type: 'gun',
        price: 0
    },
    {
        id: "gun2",
        type: 'gun',
        price: 1000
    },
    {
        id: "gun3",
        type: 'gun',
        price: 20000
    },
    {
        id: "ammo1",
        type: 'ammo',
        price: 2
    },
    {
        id: "ammo2",
        type: 'ammo',
        price: 10
    },
    {
        id: "ammo3",
        type: 'ammo',
        price: 100
    }
]

function prepareItems() {
       
    for(let i = 0; i < shopItems.length; i++) {
        const id = shopItems[i].id
        const type = shopItems[i].type
        const price = shopItems[i].price

        const el = document.getElementById(id)
        const btn = el.lastElementChild.lastElementChild

        const child = document.createElement('span')
        child.innerHTML = shopItems[i].price
        btn.appendChild(child)

        if (localStorage[`allow${id}`] == 'true') {
            bought(id)
        }
        else {
            btn.addEventListener('click', () => {
                let conf = confirm(`میخوای ${price} تا پول بدی عوضش اینو بخری؟`)
                if(conf) {
                    changeMoney(-price)
                    if (type === 'gun') {
                        localStorage[`allow${id}`] = true
                    }
                    location.reload()
                }
            })
        }
    }
}
prepareItems()