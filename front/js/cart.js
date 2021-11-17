/* ----------------------------------------- */
/*          Adding products to cart          */
/* ----------------------------------------- */

class CartItem {
  constructor(id, quantity, color) {
    this.id = id;
    this.quantity = quantity;
    this.color = color;
  }
}
const test = new CartItem(42, 12, "red");
const test2 = new CartItem(42, 12, "green");
const testStringified = JSON.stringify(test);
console.log("Test stringified : ", testStringified);
// localStorage.setItem("testId", test.id);
// localStorage.setItem("testQuantity", test.quantity);
// localStorage.setItem("testColor", test.color);
let testKey = test.id + "_" + test.color;
localStorage.setItem(testKey, testStringified);
// const testRecovered = new CartItem(localStorage.getItem("testId"),localStorage.getItem("testQuantity"),localStorage.getItem("testColor"));
testRecovered = JSON.parse(localStorage.getItem(testKey));
console.log("Test récupéré du local storage et parsé : ", testRecovered);
console.log(localStorage);
// localStorage.clear()
// console.log(localStorage);

// faire une fonction getItemToAddToCart qui construit la valeur de l'item à ajouter au panier

// fonction qui parcours le panier et précise si l'article (id + couleur) est déjà présent
let getItemInfoOnCart = (cart, item) => {
  let itemInfoOnCart = {
    cartIndex: 0,
    isIdOnCart: false,
    isItemOnCart: false,
  };
  for (let i in cart) {
    if (cart[i].id === item.id && cart[i].color === item.color) {
      itemInfoOnCart.cartIndex = i;
      itemInfoOnCart.isIdOnCart = true;
      itemInfoOnCart.isItemOnCart = true;
    } else if (cart[i].id === item.id) {
      itemInfoOnCart.isIdOnCart = true;
      itemInfoOnCart.cartIndex = i;
    }
  }
  console.log("Info de l'article dans le panier", itemInfoOnCart);
  return itemInfoOnCart;
};
// fonction addItemToCart qui prend un newCartItem et l'ajoute au panier si nécessaire
let 

// fonction to build cart from the local storage
function buildCartFromStorage() {
  let cart = [];
  for (let i = 0; i < localStorage.length; i++) {
    // recover the name of the key
    let key = localStorage.key(i);
    // revover the corresponding value
    let value = localStorage.getItem(key);
    // parsing the value to an JS object
    cart.push(JSON.parse(value));
  }
  console.log("Panier construit à partir du localStorage", cart);
  return cart;
}
let cart = [test2];
getItemInfoOnCart(cart, test);

// fonction pour ajouter le panier au local storage
function storeCart(cart){
  // delete the old version of localStorage
  localStorage.clear;
  for (item of cart){
    let itemKey = item.id + "_" + item.color;
    const itemStringified = JSON.stringify(item);
    localStorage.setItem(itemKey, itemStringified);
  }
}
// ces fonctions seront appelées lorsqu'on clique sur le bonton "ajouter au panier"
// test si panier vide si oui ajout de l'article
// sinon appel la fonction pour construire le panier
// appel de la fonction qui dit
