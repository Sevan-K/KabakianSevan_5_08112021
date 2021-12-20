/* ---------------------------------------------------- */
/*          Adding product's data to the  page          */
/* ---------------------------------------------------- */

// récupération de l'iD du produit concerné
const urlText = window.location.href; // get url text into a variable
let url = new URL(urlText); // transform this text into an url
const productId = url.searchParams.get("id"); // get the id from url and store it into a variable
console.log(
  "id du produit qui a été cliqué sur la page d'accueil : ",
  productId
);

// Building HTML structure and reaching needed element to display product data
const intemImg = document.getElementsByClassName("item__img")[0];
const image = document.createElement("img"); // create an image element
intemImg.appendChild(image); // add this image to the .item__img
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colorSelect = document.getElementById("colors");

// function to add the different colors into the select tag
let addColors = (colors) => {
  // for each color of color's list (colors)
  for (let i = 0; i < colors.length; i++) {
    // create on option element on the DOM
    let color = document.createElement("option");
    // the color option is added to the DOM element colorSelect (<select> to customize color)
    colorSelect.appendChild(color);
    // option value is set to be the targeted color
    color.setAttribute("value", colors[i]);
    // option textContent is set to be the targeted color
    color.textContent = colors[i];
  }
};

// function to add product info on product page
async function addProductInfo() {
  // getting the product information from API by using the id
  let product = await getProductById(productId);
  console.log("Information du produit dont on a récupérer l'id", product);
  // adding product info into HTML elmeents
  image.setAttribute("src", product.imageUrl); // product's image
  image.setAttribute("alt", product.altTxt); // product's alternative text of the image
  title.textContent = product.name; // product's name
  price.textContent = " " + product.price + " "; // product's price
  description.textContent = product.description; // product's description
  addColors(product.colors); // product's colors
}

// calling the function to add product info on product page
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
  // get item's quantity from DOM element and parse it into an integer
  const itemQuantity = parseInt(quantityElement.value);
  // buil the item to get from DOM element
  let itemToGet = new CartItem(productId, itemQuantity, colorSelect.value);
  console.log("L'article créé est le suivant : ", itemToGet);
  // the functon return the built item
  return itemToGet;
};

// function that go through cart and :
// specify if the article (same id and same color) is already there
// specify if a similar item is on cart (same id but different color)
// give the index on tha cart of the same item or the first similar one
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

// function to store the cart into the localStorage
function storeCart(cart) {
  // store the items into the local storage
  for (item of cart) {
    let itemKey = item.id + "_" + item.color;
    const itemStringified = JSON.stringify(item);
    localStorage.setItem(itemKey, itemStringified);
  }
  console.log("localStorage après intégration du nouvel article", localStorage);
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
