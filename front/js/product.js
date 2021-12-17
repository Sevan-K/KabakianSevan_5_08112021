/* ---------------------------------------------------- */
/*          Adding product's data to the  page          */
/* ---------------------------------------------------- */

// récupération de l'iD du produit concerné
const urlText = window.location.href;
let url = new URL(urlText);
const productId = url.searchParams.get("id");
console.log(
  "id du produit qui a été cliqué sur la page d'accueil : ",
  productId
);

// Need HTML elements creation
const intemImg = document.getElementsByClassName("item__img")[0];
const image = document.createElement("img");
intemImg.appendChild(image);
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colorSelect = document.getElementById("colors");

// function to add the different colors into the select tag
let addColors = (colors) => {
  for (let i = 0; i < colors.length; i++) {
    let color = document.createElement("option");
    colorSelect.appendChild(color);
    color.setAttribute("value", colors[i]);
    color.textContent = colors[i];
  }
};

// function to add product info
async function addProductInfo() {
  // getting the product information
  let product = await getProductById(productId);
  console.log("Information du produit dont on a récupérer l'id", product);
  // adding product info into HTML elmeents
  image.setAttribute("src", product.imageUrl);
  image.setAttribute("alt", product.altTxt);
  title.textContent = product.name;
  price.textContent = " " + product.price + " ";
  description.textContent = product.description;
  addColors(product.colors);
}
addProductInfo();

/* ----------------------------------------- */
/*          Adding products to cart          */
/* ----------------------------------------- */

// build cart form storage
let cartToModify = buildCartFromStorage();

// variable to target DOM element with quantity id
let quantityElement = document.getElementById("quantity");

// create a class CartItem
class CartItem {
  constructor(id, quantity, color) {
    this.id = id;
    this.quantity = quantity;
    this.color = color;
  }
}

// getItem function build the item to add to cart by recovering need data on the DOM and from url
let getItem = () => {
  const itemQuantity = parseInt(quantityElement.value);
  let itemToGet = new CartItem(productId, itemQuantity, colorSelect.value);
  console.log("L'article créé est le suivant : ", itemToGet);
  return itemToGet;
};

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

// code to be executed when addToCart button is clicked on
const addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", function () {
  if (colorSelect.value == "" || quantity.value == 0) {
    alert("Sélectionnez une couleur et un nombre d'article supérieur à 0");
  } else {
    // console.log("Couleur :", colorSelect.value);
    // console.log("Quantité", quan
    // get information about the item to add to cart
    let itemToAdd = getItem();
    //modify the cart according the item to add
    let cartModified = addItemToCart(cartToModify, itemToAdd);
    // store cart into localStorage
    storeCart(cartModified);
    // update cart
    cartToModify = cartModified;
    if (confirm("Souhaitez vous être redirigé vers la page panier ?")) {
      window.location.href = "cart.html";
    }
  }
});
