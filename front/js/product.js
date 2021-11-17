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