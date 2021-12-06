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
let product;
// function to add product info
async function addProductInfo() {
  // getting the product information
  product = await getProductById(productId);
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

// code to be executed when addToCart button is clicked on
const addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", function () {
  if (colorSelect.value == "" || quantity.value == 0) {
    alert("Sélectionnez une couleur et un nombre d'article supérieur à 0");
  } else {
    // console.log("Couleur :", colorSelect.value);
    // console.log("Quantité", quantity.value);
    // get information about the item to add to cart
    let itemToAdd = getItem();
    //modify the cart according the item to add
    let cartModified = addItemToCart(cartToModify, itemToAdd);
    // store cart into sessionStorage
    storeCart(cartModified);
    // update cart
    cartToModify = cartModified;
  }
});
