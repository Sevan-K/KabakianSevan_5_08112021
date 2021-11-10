// function to obtain all the products
let getProducts = async function () {
  try {
    let response = await fetch("http://localhost:3000/api/products");
    if (response.ok) {
      let data = await response.json();
      console.log(data);
      return data;
    } else {
      console.log(response.status);
    }
  } catch (error) {
    console.log(error);
  }
};
getProducts();

// product card HTML elements creation
const items = document.getElementById("items");
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
