import { SHOP_ITEMS_URL } from "./constants.js";

fetch(SHOP_ITEMS_URL)
    .then(response => {
        if (response.ok) {         
            console.log('Shop data loaded successfully');
            
            return response.text()
        }
        console.error('Error in loading shop data from ' + SHOP_ITEMS_URL)
    })
    .then(data => {
        sessionStorage.shopItems = data
    })