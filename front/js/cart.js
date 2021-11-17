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
const testStringified = JSON.stringify(test);
console.log("Test stringified : ", testStringified);
// localStorage.setItem("testId", test.id);
// localStorage.setItem("testQuantity", test.quantity);
// localStorage.setItem("testColor", test.color);
localStorage.setItem(test.id + "_" + test.color, testStringified);

// const testRecovered = new CartItem(localStorage.getItem("testId"),localStorage.getItem("testQuantity"),localStorage.getItem("testColor"));
testRecovered = JSON.parse(localStorage.getItem("test"));
console.log("Test récupéré du local storage et parsé : ", testRecovered);

console.log(localStorage);
// localStorage.clear()
// console.log(localStorage);

// faire une fonction getItemToAddToCart qui construit la valeur de l'item à ajouter au panier

// fonction addItemToCart qui prend un newCartItem et l'ajoute au panier si nécessaire

// ces deux fonction seront appelées lorsqu'on clique sur le bonton "ajouter au panier"

// fonction qui construit le panier à partir du local storage
function buildCartFromStorage() {
  let cart = [];
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let value = localStorage.getItem(key);
    cart.push(JSON.parse(value));
  }
  console.log("Panier construi à partir du localStorage", cart);
  return cart;
}

