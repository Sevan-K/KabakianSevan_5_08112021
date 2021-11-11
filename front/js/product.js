/* ---------------------------------------------------- */
/*          Adding product's data to the  page          */
/* ---------------------------------------------------- */

// récupération de l'iD du produit concerné
const urlText = window.location.href;
let url = new URL(urlText);
const productId = url.searchParams.get("id");
console.log(productId);

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

// function to add product info
async function addProductInfo() {
  // getting the product information
  let product = await getProductById();
  console.log(product);
  // adding product info into HTML elmeents
  image.setAttribute("src", product.imageUrl);
  image.setAttribute("alt", product.altTxt);
}
addProductInfo();
