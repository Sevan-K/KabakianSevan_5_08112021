/* -------------------------------------------------- */
/*          Add orderId to confirmation.html          */
/* -------------------------------------------------- */

// showing the order request object before local storage clear
console.log(
  "Commande passée :",
  JSON.parse(localStorage.getItem("objectToSend"))
);

// get the id from url parameters
// get url text into a variable
const urlOrderText = window.location.href;
// transform this text into an url
let urlOrder = new URL(urlOrderText);
// get the id from url and store it into a variable
const orderIdFromURL = urlOrder.searchParams.get("id");
console.log("id de la commande passée : ", orderIdFromURL);
// add the order id to page content
const orderIdElement = document.getElementById("orderId");
orderIdElement.textContent = orderIdFromURL;

// clear the local storage to be able to start a new order
localStorage.clear();
console.log("Nettoyage du localstorage :", localStorage);
