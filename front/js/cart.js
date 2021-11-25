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
sessionStorage.clear()
console.log("Etat du storage en arrivant sur la page", sessionStorage);

// éléments pour les test sur les différéntes fonction nécessaires à l'ajout et la modificcation d'éléménets
const test = new CartItem(42, 12, "red");
const test2 = new CartItem(42, 12, "green");
const testStringified = JSON.stringify(test);
console.log("Test stringified : ", testStringified);
// sessionStorage.setItem("testId", test.id);
// sessionStorage.setItem("testQuantity", test.quantity);
// sessionStorage.setItem("testColor", test.color);
let testKey = test.id + "_" + test.color;
sessionStorage.setItem(testKey, testStringified);
// const testRecovered = new CartItem(sessionStorage.getItem("testId"),sessionStorage.getItem("testQuantity"),sessionStorage.getItem("testColor"));
testRecovered = JSON.parse(sessionStorage.getItem(testKey));
console.log("Test récupéré du local storage et parsé : ", testRecovered);
console.log("sessionStorage après ajout d'un premier élément",sessionStorage);
// sessionStorage.clear()
// console.log(sessionStorage);

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
  for (let i = 0; i < cart.length; i++) {
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
  let storedCart = [];
  // if there is nothing on the local storage it means there is nothing on the cart
  if (sessionStorage.length > 0) {
    for (let i = 0; i < sessionStorage.length; i++) {
      // recover the name of the key
      let key = sessionStorage.key(i);
      // revover the corresponding value
      let value = sessionStorage.getItem(key);
      // parsing the value to an JS object
      storedCart.push(JSON.parse(value));
    }
  }
  console.log("Panier construit à partir du sessionStorage", storedCart);
  return storedCart;
}
// tests de la fonction getItemInfoOnCart
// let cart = [test2];
// getItemInfoOnCart(cart, test);

// fonction addItemToCart qui prend un newCartItem et l'ajoute au panier si nécessaire
function addItemToCart(cart, item) {
  // get item info on cart (is the item on cart or not) to know what to do
  const itemOnCart = getItemInfoOnCart(cart, item);
  // the exact same item is already on the cart
  if (itemOnCart.isItemOnCart) {
    // increment item quantity
    cart[itemOnCart.cartIndex].quantity += item.quantity;
    // console.log("Panier après modification de l'article",cart);
  }
  // a similar article is found on the cart
  else if (itemOnCart.isIdOnCart) {
    const indexToTarget = itemOnCart.cartIndex + 1;
    cart.splice(indexToTarget, 0, item);
  }
  // no similar item is found on cart
  else {
    cart.push(item);
    //  tu es ici et ça ne fonctionne pas !!!!!!!!!!!!!!!!!!!!!!!!!!!!
  }
  console.log("Panier après modification ou ajout", cart);
  return cart;
}

// série de test de la fonction addItemToCart
console.log("Test addtoCart 1, ajout d'un article similaire");
let testCart = addItemToCart(buildCartFromStorage(), test);
// console.log("Test addtoCart 2, ajout d'un article similaire");
// addItemToCart(buildCartFromStorage(), test2);
// console.log("Test addtoCart 3, ajout article dans un panier vide");
// addItemToCart([], test2);

// fonction pour ajouter le panier au local storage
function storeCart(cart) {
  // delete the old version of sessionStorage
  sessionStorage.clear;
  // store the items into the local storage
  for (item of cart) {
    let itemKey = item.id + "_" + item.color;
    const itemStringified = JSON.stringify(item);
    sessionStorage.setItem(itemKey, itemStringified);
  }
}

storeCart(testCart);
console.log("Etat du storage après les tests réalisés", sessionStorage);

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
