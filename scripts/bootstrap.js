export default () => {
    localStorage.kills = 0
    localStorage.record = localStorage.record === undefined ? 0 : localStorage.record
    localStorage.money = localStorage.money === undefined ? 0 : localStorage.money
    document.getElementById('kills').innerText = localStorage.kills
    document.getElementById('record').innerText = localStorage.record
    document.getElementById('money').innerText = localStorage.money

    if (localStorage.allowmedic1 === 'true' && localStorage.allowsoul === 'true') {
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
}