function changeMoney(ch) {
    localStorage.money = +(localStorage.money) + ch
    document.getElementById("money").innerHTML = localStorage.money
}

export {changeMoney}