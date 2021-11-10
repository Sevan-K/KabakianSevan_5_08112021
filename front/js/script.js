/* ----------------------------------------------- */
/*          Adding products to index page          */
/* ----------------------------------------------- */

// selection of section with id items
const items = document.getElementById("items");

// function to create and add a product on HTML page
function addOneProduct(products, index) {
  // product card HTML elements creation
  const ancre = document.createElement("a");
  const article = document.createElement("article");
  const image = document.createElement("img");
  const productName = document.createElement("h3");
  const productDescription = document.createElement("p");
  // adding needed classes
  productName.classList.add("productName");
  productDescription.classList.add("productDescription");
  // construction de la structure html
  items.appendChild(ancre);
  ancre.appendChild(article);
  article.appendChild(image);
  article.appendChild(productName);
  article.appendChild(productDescription);
  // ading content to the HTML elements
  ancre.setAttribute("href","./product.html?id="+products[index]._id)
  productName.textContent = products[index].name;
  productDescription.textContent = products[index].description;
  image.setAttribute("src", products[index].imageUrl);
  image.setAttribute("alt", products[index].altTxt);
}
// function to get all the products informations
let getProducts = async function () {
  try {
    let response = await fetch("http://localhost:3000/api/products");
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
// function to add all the products of the API on index page
async function addProducts() {
  // getting the products
  const products = await getProducts();
  for (let i in products) {
    console.log(products[i]);
    // adding the products
    addOneProduct(products,i)
  }
}
addProducts();