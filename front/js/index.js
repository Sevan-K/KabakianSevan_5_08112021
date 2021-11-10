/* ----------------------------------------- */
/*       Adding products to index page       */
/* ----------------------------------------- */

// selection of section with id items
const items = document.getElementById("items");

// function to create a product
function addProduct(products, index) {
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
  productName.textContent = products[index].name;
  productDescription.textContent = products[index].description;
  image.setAttribute("src", products[index].imageUrl);
  image.setAttribute("alt", products[index].altTxt);
}
// function to obtain all the products datas
let getProducts = async function () {
  try {
    let response = await fetch("http://localhost:3000/api/products");
    if (response.ok) {
      let data = await response.json();
      for (let i in data) {
        console.log(data[i]);
        addProduct(data, i);
      }
    } else {
      console.log(response.status);
    }
  } catch (error) {
    console.log(error);
  }
};
// calling the function to get products data and add them
getProducts();
