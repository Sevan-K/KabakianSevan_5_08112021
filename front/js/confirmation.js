/* -------------------------------------------------- */
/*          Add orderId to confirmation.html          */
/* -------------------------------------------------- */

// get the id from url parameters
const urlOrderText = window.location.href;
let urlOrder = new URL(urlOrderText);
const orderIdFromURL = urlOrder.searchParams.get("id");
console.log(
  "id du produit qui a été cliqué sur la page d'accueil : ",
  orderIdFromURL
);
// add the order id to page content
const orderIdElement = document.getElementById("orderId");
orderIdElement.textContent = orderIdFromURL;

sessionStorage.clear()
console.log("Nettoyage du localstorage :",sessionStorage);