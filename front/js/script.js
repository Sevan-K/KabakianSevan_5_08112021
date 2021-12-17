/* ----------------------------------------------- */
/*          Adding products to index page          */
/* ----------------------------------------------- */

// selection of section with id items
const items = document.getElementById("items");

// function to create and add a product on HTML page. arguments are product list contain in the API and an index to target a product
function addOneProduct(products, index) {
  // product card HTML elements creation
  const anchor = document.createElement("a");
  const article = document.createElement("article");
  const image = document.createElement("img");
  const productName = document.createElement("h3");
  const productDescription = document.createElement("p");
  // adding needed classes
  productName.classList.add("productName");
  productDescription.classList.add("productDescription");
  // html structure building
  items.appendChild(anchor); // the anchor is a child of section #items
  anchor.appendChild(article); // the article is a child of the anchor
  article.appendChild(image);
  article.appendChild(productName);
  article.appendChild(productDescription);
  // ading content to the HTML elements cooresponding to the targeted product info
  anchor.setAttribute("href", "./product.html?id=" + products[index]._id); // anchor link integrate product id to be able to use urlsearchparams
  productName.textContent = products[index].name;
  productDescription.textContent = products[index].description;
  image.setAttribute("src", products[index].imageUrl);
  image.setAttribute("alt", products[index].altTxt);
}

// function to get all the products informations
let getProducts = async function () {
  try {
    // the variable response await for a return of fetch promise
    let response = await fetch("http://localhost:3000/api/products");
    // if the response is OK then
    if (response.ok) {
      let data = await response.json();
      return data;
    } else {
      // if the response is not OK then
      console.log(
        "Statut d'erreur de la réponse de getProducts",
        response.status
      );
    }
  } catch (error) {
    // adding a catch to be able to show the error if what is into the try does not work
    console.log("Erreur dans le catch de getProducts", error);
  }
};

// function to add all the products of the API on index page
async function addProducts() {
  // getting the products from the API
  const products = await getProducts();
  // loop to go through all the products
  for (let i in products) {
    console.log(products[i]);
    // adding the product with index i
    addOneProduct(products, i);
  }
}

// calling the main function to add all products present in API to the page
addProducts();
