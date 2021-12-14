/* ---------------------------------------------------- */
/*          Functions to get data from the API          */
/* ---------------------------------------------------- */

// function to get product's informations
let getProductById = async function (id) {
  try {
    let response = await fetch("http://localhost:3000/api/products/" + id);
    if (response.ok) {
      let data = await response.json();
      return data;
    } else {
      console.log(response.status);
    }
  } catch (error) {
    console.log(error);
  }
};

/* -------------------------------------------------------- */
/*          Functions related to cart modification          */
/* -------------------------------------------------------- */

// create a class CartItem
class CartItem {
  constructor(id, quantity, color) {
    this.id = id;
    this.quantity = quantity;
    this.color = color;
  }
}
// ligne pour vérifier l'état du localStorage en arrivant sur la page
console.log("Etat du storage en arrivant sur la page", localStorage);

// éléments pour les test sur les différéntes fonction nécessaires à l'ajout et la modificcation d'éléménets
// const test = new CartItem(42, 12, "red");
// const test2 = new CartItem(42, 12, "green");
// const testStringified = JSON.stringify(test);
// console.log("Test stringified : ", testStringified);
// let testKey = test.id + "_" + test.color;
// localStorage.setItem(testKey, testStringified);
// testRecovered = JSON.parse(localStorage.getItem(testKey));
// console.log("Test récupéré du local storage et parsé : ", testRecovered);
// console.log("localStorage après ajout d'un premier élément", localStorage);

// faire une fonction getItemToAddToCart qui construit la valeur de l'item à ajouter au panier
let quantity = document.getElementById("quantity");
let getItem = () => {
  const itemQuantity = parseInt(quantity.value);
  let itemToGet = new CartItem(productId, itemQuantity, colorSelect.value);
  console.log("L'article créé est le suivant : ", itemToGet);
  return itemToGet;
};
// test de la fonction pour récupérer les article de la page
// getItem();

// fonction qui parcours le panier et précise si l'article (id + couleur) est déjà présent
let getItemInfoOnCart = (cart, item) => {
  let itemInfoOnCart = {
    cartIndex: 0,
    isIdOnCart: false,
    isItemOnCart: false,
  };
  let loopCount = 0;
  while (itemInfoOnCart.isItemOnCart === false && loopCount < cart.length) {
    if (
      cart[loopCount].id === item.id &&
      cart[loopCount].color === item.color
    ) {
      itemInfoOnCart.cartIndex = loopCount;
      itemInfoOnCart.isItemOnCart = true;
    } else if (cart[loopCount].id === item.id) {
      itemInfoOnCart.isIdOnCart = true;
      itemInfoOnCart.cartIndex = loopCount;
    }
    loopCount++;
  }
  // for (let i = 0; i < cart.length; i++) {}
  console.log("Info de l'article dans le panier", itemInfoOnCart);
  return itemInfoOnCart;
};

// fonction to build cart from the local storage
function buildCartFromStorage() {
  let cartToBuild = [];
  // if there is nothing on the local storage it means there is nothing on the cart
  if (localStorage.length > 0) {
    for (let j = 0; j < localStorage.length; j++) {
      // recover the name of the key
      let key = localStorage.key(j);
      // revover the corresponding value
      let value = localStorage.getItem(key);
      if (
        key != "IsThisFirstTime_Log_From_LiveServer" &&
        key != "objectToSend"
      ) {
        // parsing the value to an JS object
        cartToBuild.push(JSON.parse(value));
      }
    }
  }
  console.log("Panier construit à partir du localStorage", cartToBuild);
  return cartToBuild;
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
  }
  // a similar article is found on the cart
  else if (itemOnCart.isIdOnCart) {
    // add the item before the similar one
    const indexToTarget = itemOnCart.cartIndex;
    cart.splice(indexToTarget, 0, item);
  }
  // no similar item is found on cart
  else {
    cart.push(item);
  }
  console.log("Panier après modification ou ajout", cart);
  return cart;
}

// série de test de la fonction addItemToCart
// console.log("Test addtoCart 1, ajout d'un article similaire");
// let testCart = addItemToCart(buildCartFromStorage(), test);
// console.log("Test addtoCart 2, ajout d'un article similaire");
// let testCart = addItemToCart(buildCartFromStorage(), test2);
// console.log("Test addtoCart 3, ajout article dans un panier vide");
// let testCart = addItemToCart([], test2);

// fonction pour ajouter le panier au local storage
function storeCart(cart) {
  // delete the old version of localStorage
  localStorage.clear();
  // store the items into the local storage
  for (item of cart) {
    let itemKey = item.id + "_" + item.color;
    const itemStringified = JSON.stringify(item);
    localStorage.setItem(itemKey, itemStringified);
  }
  console.log(
    "localStorage après intégration du nouvel article",
    localStorage
  );
}

// test pour la fonction stockage du pannier dans le localStorage
// storeCart(testCart);
// console.log("Etat du storage après les tests réalisés", localStorage);
