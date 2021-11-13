/* ---------------------------------------------------- */
/*          Adding product's data to the  page          */
/* ---------------------------------------------------- */

// récupération de l'iD du produit concerné
const urlText = window.location.href;
let url = new URL(urlText);
const productId = url.searchParams.get("id");
console.log("id du produit qui a été cliqué sur la page d'accueil : ",productId);

// utiliser l'API avec un /et l'id du produit pour faire la sélection

// function to get all the products informations
let getProductById = async function () {
  try {
    let response = await fetch(
      "http://localhost:3000/api/products/" + productId
    );
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
  let product = await getProductById();
  console.log("Information du produit dont on a récupérer l'id",product);
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

class CartItem {
  constructor(id, quantity, color) {
    this.id = id;
    this.quantity = quantity;
    this.color = color;
  }
}
const test = new CartItem(42, 12, "red");
const testStringified = JSON.stringify(test);
console.log("Test stringified : ",testStringified);
// localStorage.setItem("testId", test.id);
// localStorage.setItem("testQuantity", test.quantity);
// localStorage.setItem("testColor", test.color);
localStorage.setItem(test.id+"_"+test.color, testStringified);

// const testRecovered = new CartItem(localStorage.getItem("testId"),localStorage.getItem("testQuantity"),localStorage.getItem("testColor"));
testRecovered = JSON.parse(localStorage.getItem("test"));
console.log("Test récupéré du local storage et parsé : ",testRecovered);

console.log(localStorage);
localStorage.clear()
console.log(localStorage);

// faire une fonction getItemToAddToCart qui construit la valeur de l'item à ajouter au panier

// fonction addItemToCart qui prend un newCartItem et l'ajoute au panier si nécessaire

// ces deux fonction seront appelées lorsqu'on clique sur le bonton "ajouter au panier"

