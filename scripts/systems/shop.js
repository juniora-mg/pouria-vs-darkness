localStorage.money = localStorage.money === undefined ? 0 : localStorage.money
document.getElementById('money').innerText = localStorage.money

localStorage.allowgun1 = 'true'

import {changeMoney} from './economy.js'

function bought(id) {
    const el = document.getElementById(id)
    const btn = el.lastElementChild.lastElementChild
    
    btn.innerHTML = "خریده شده"
    btn.classList.add('bought')
}

let shopItems
try {
    shopItems = JSON.parse(sessionStorage.shopItems)
    
}
catch (err) {    
    alert('نتونستیم قیمتارو از سرور بخونیم لطفا بعد از چند ثانیه دوباره وارد فروشگاه شو')
    history.back()
}
// const shopItems = [
//     {
//         id: "gun1",
//         type: 'gun',
//         img: images.gun1,
//         label: labels.gun1,
//         price: prices.gun1,
//     },
//     {
//         id: "gun2",
//         type: 'gun',
//         img: images.gun2,
//         label: labels.gun2,
//         price: prices.gun2
//     },
//     {
//         id: "gun3",
//         type: 'gun',
//         img: images.gun3,
//         label: labels.gun3,
//         price: prices.gun3
//     },
//     {
//         id: "medic1",
//         type: "power",
//         img: images.medic1,
//         label: labels.medic1,
//         price: prices.medic1
//     },
//     {
//         id: "soul",
//         type: "power",
//         img: images.soul,
//         label: labels.soul,
//         price: prices.soul
//     }
// ]

function prepareItems() {
       
    for(let i = 0; i < shopItems.length; i++) {
        const item = shopItems[i]

        // create item card
        const div = document.createElement("div")
        div.classList.add('shop-item')
        div.id = item.id
        const img = document.createElement("img")
        img.src = item.img
        div.appendChild(img)
        const div2 = document.createElement("div")
        div2.classList.add('shop-bottom-card')
        const h2 = document.createElement("h2")
        h2.innerText = item.label
        div2.appendChild(h2)
        const button = document.createElement("button")
        button.innerText = "خرید"
        const span = document.createElement('span')
        span.innerText = item.price
        button.appendChild(span)
        div2.appendChild(button)
        div.appendChild(div2)
        document.querySelector(".shop-container").appendChild(div)

        if (localStorage[`allow${item.id}`] == 'true') {
            bought(item.id)
        }
        else {
            button.addEventListener('click', () => {
                if (+(localStorage.money) < item.price) {
                    alert(`داش پولت نمیرسه. باید ${item.price-localStorage.money} تا پول دیگه جمع کنی`)
                }
                else {
                    let conf = confirm(`میخوای ${item.price} تا پول بدی عوضش اینو بخری؟`)
                    if(conf) {

                        changeMoney(-item.price)
                        if (item.type === 'gun' || item.type === 'power') {
                            localStorage[`allow${item.id}`] = true
                        }
                        location.reload()
                    }
                }
            })
        }
    }
}
prepareItems()
bought('gun1')