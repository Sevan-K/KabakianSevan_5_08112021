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
console.log("Etat du storage en arrivant sur la page", localStorage);

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
let quantity = document.getElementById("quantity");
let getItem = () => {
  let item = new CartItem(productId, quantity.value, colorSelect.value);
  console.log("L'article créer est le suivant : ", item);
  return item;
};
getItem();

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

// fonction to build cart from the local storage
function buildCartFromStorage() {
  let cart = [];
  // if there is nothing on the local storage it means there is nothing on the cart
  if (localStorage.length > 0) {
    for (let i = 0; i < localStorage.length; i++) {
      // recover the name of the key
      let key = localStorage.key(i);
      // revover the corresponding value
      let value = localStorage.getItem(key);
      // parsing the value to an JS object
      cart.push(JSON.parse(value));
    }
  }
  console.log("Panier construit à partir du localStorage", cart);
  return cart;
}

// let cart = [test2];
// getItemInfoOnCart(cart, test);

// fonction addItemToCart qui prend un newCartItem et l'ajoute au panier si nécessaire
function addItemToCart(cart, item) {
  // get item info on cart (is the item on cart or not) to know what to do
  let itemOnCart = getItemInfoOnCart(cart, item);
  // the exact same item is already on the cart
  if (itemOnCart.isItemOnCart) {
    // increment item quantity
    console.log("incrémenter");
  }
  // a similar article is found on the cart
  else if (itemOnCart.isIdOnCart) {
    console.log("ajouter après l'article similaire");
  }
  // no similar item is found on cart
  else {
    console.log("simplement ajouter");
  }
}
addItemToCart(buildCartFromStorage(), test);
addItemToCart(buildCartFromStorage(), test2);
addItemToCart([], test2);

// fonction pour ajouter le panier au local storage
function storeCart(cart) {
  // delete the old version of localStorage
  localStorage.clear;
  for (item of cart) {
    let itemKey = item.id + "_" + item.color;
    const itemStringified = JSON.stringify(item);
    localStorage.setItem(itemKey, itemStringified);
  }
}
// code to be executed when addToCart button is clicked on
const addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", function () {
  if (colorSelect.value == "" || quantity.value == 0) {
    alert("Sélectionnez une couleur et un nombre d'article supérieur à 0");
  } else {
    console.log("Couleur :", colorSelect.value);
    console.log("Quantité", quantity.value);
    // appel des différentes fonctions :
    // get item (done)
    // build cart form storage (done)
    // add item or increment existing one (WIP)
    // store cart into storage (done)
  }
});
// est-ce que le local storage se remet à 0 quand on ouvre le navigateur ?
