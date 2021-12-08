/* ---------------------------------------------- */
/*          General variables definition          */
/* ---------------------------------------------- */

// build cart from storage (done)
let cartToDisplay = buildCartFromStorage();
// constant corresponding to DOM element which id is totalQuantity
const totalQuantity = document.getElementById("totalQuantity");
// constant corresponding to DOM element which id is totalPrice
const totalPrice = document.getElementById("totalPrice");

/* ------------------------------------------------- */
/*          Display items from cart on page          */
/* ------------------------------------------------- */

// fonction pour créer la structure HTML à ajouter
async function buildHtmlStructure(cart) {
  //   déclarer un array vide qui contiendra le code html cartHtmlStructure
  let htmlStructure = [];
  //  parcourir l'array cart, pour chaque item :
  for (let i = 0; i < cartToDisplay.length; i++) {
    //     3.1 - récupérer l'article i dans le panier
    let itemToDisplay = cart[i];
    // console.log(`Item with index ${i} into the cart`, itemToDisplay);
    //     3.2 - récupérer les information de l'API à partir de l'id (done) et les stocker dans une variable
    let productConcerned = await getProductById(itemToDisplay.id);
    // console.log(productConcerned);
    //     3.3 - à partir d'un produit (product) et d'un article du panier (cartItem),
    //              compléter le code html et l'ajouter à HtmlStructure (function to create)
    htmlStructure += `
      <article class="cart__item" data-id="${itemToDisplay.id}_${itemToDisplay.color}">
          <div class="cart__item__img">
              <img src="${productConcerned.imageUrl}">
          </div>
          <div class="cart__item__content">
              <div class="cart__item__content__titlePrice">
              <h2>${productConcerned.name} - ${itemToDisplay.color}</h2>
              <p>${productConcerned.price} €</p>
              </div>
              <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${itemToDisplay.quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
              </div>
              </div>
          </div>
      </article>
    `;
  }
  return htmlStructure;
}

// function to calculate the number of items
let calculateNumberOfItems = (cart) => {
  console.log(cart);
  let numberOfItems = 0;
  for (let item of cart) {
    numberOfItems += item.quantity;
    console.log(item.quantity);
  }
  return numberOfItems;
};

// function to calculate the total Price of items on cart
let calculateCartTotalPrice = async (cart) => {
  let cartTotalPrice = 0;
  for (let item of cart) {
    // get price item
    let productForTotalPriceCalculation = await getProductById(item.id);
    // add item price times item quantity to total price
    cartTotalPrice += productForTotalPriceCalculation.price * item.quantity;
  }
  // console.log("Montant total du panier : ", totalPrice);
  return cartTotalPrice;
};

// function to display cart in cart page
async function displayCart() {
  // build html sturcture from the cartToDisplay
  let cartHtmlStructure = await buildHtmlStructure(cartToDisplay);
  //   4 - Ajouter le bloc HTML cartHtmlStructure avec la méthode innerHTML
  const cartItems = document.getElementById("cart__items");
  cartItems.innerHTML = cartHtmlStructure;
  // display the number of items on cart
  totalQuantity.textContent = calculateNumberOfItems(cartToDisplay);
  // display cart's total Price
  totalPrice.textContent = await calculateCartTotalPrice(cartToDisplay);
  // calling the function to remove items from cart
  removeItemFromCart();
  // calling the function to modify quantity of items
  changeItemQuantity();
}
displayCart();

/* ---------------------------------------- */
/*          Edit cart on cart page          */
/* ---------------------------------------- */

// function to remove items from cart on page
function removeItemFromCart() {
  // get all DOM elements which class is deleteItem
  const deleteButtons = document.getElementsByClassName("deleteItem");
  // console.log("élément deleteButtons", deleteButtons);
  // loop to target the element that has been clicked on
  for (let deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", async function () {
      // get the item (closest article parent) to remove and its id
      let itemToDelete = deleteButton.closest("article");
      let itemToDeleteId = itemToDelete.dataset.id;
      console.log("id de l'élément deleteButton", itemToDeleteId);
      // remove itemToDelete from the page
      itemToDelete.remove();
      // remove the item from the sessionStorage
      sessionStorage.removeItem(itemToDeleteId);
      // console.log(sessionStorage);
      // update cartToDisplay
      cartToDisplay = buildCartFromStorage();
      // update the number of items on cart
      totalQuantity.textContent = calculateNumberOfItems(cartToDisplay);
      // update cart's total Price
      totalPrice.textContent = await calculateCartTotalPrice(cartToDisplay);
    });
  }
}

// function to modify one item quatity
function changeItemQuantity() {
  // get all DOM elements which class is itemQuantity
  const quantityInputs = document.getElementsByClassName("itemQuantity");
  // console.log("éléments quantityInputs", quantityInputs);
  for (let quantityInput of quantityInputs) {
    quantityInput.addEventListener("change", async function (event) {
      // get the new quantity whiched by user
      let newQuantity = parseInt(event.target.value);
      // console.log(newQuantity);
      // get the item (closest article parent) to modify and its id
      itemToModify = quantityInput.closest("article");
      itemToModifyId = itemToModify.dataset.id;
      console.log("id de l'élément à modifier", itemToModifyId);
      // modify quantity on page : is it necessary ?
      quantityInput.setAttribute("value", newQuantity);
      // moodify sessionSTorage
      let storageItemToModify = JSON.parse(
        sessionStorage.getItem(itemToModifyId)
      ); // use key to find the item and parse it into JS object
      storageItemToModify.quantity = newQuantity; // modify quantity
      sessionStorage.setItem(
        itemToModifyId,
        JSON.stringify(storageItemToModify)
      ); // update sessionStorage
      // console.log(
      //   "Storage après modification de la quantité sur la page panier",
      //   sessionStorage
      // );
      // update cartToDisplay
      cartToDisplay = buildCartFromStorage();
      // update the number of items on cart
      totalQuantity.textContent = calculateNumberOfItems(cartToDisplay);
      // update cart's total Price
      totalPrice.textContent = await calculateCartTotalPrice(cartToDisplay);
    });
  }
}

/* ------------------------------------------------ */
/*          Get contact data from the form          */
/* ------------------------------------------------ */

// target the order button
const orderButton = document.getElementById("order");

// create a ContactObject class
class ContactObject {
  constructor(firstName, lastName, address, city, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.city = city;
    this.email = email;
  }
}

let contactObject;

// function to build the contact
let buildContactObject = () => {
  return new ContactObject(
    document.getElementById("firstName").value,
    document.getElementById("lastName").value,
    document.getElementById("address").value,
    document.getElementById("city").value,
    document.getElementById("email").value
  );
};
// function using a regex to verify if the value is a wordfrom 3 to 20 characters
function isWordFrom3To20Character(formValue) {
  return /^[A-Za-z]{3,20}$/.test(formValue);
}

// function to check if the firstName is valid
function checkIfFirstNameIsValid() {
  const firstName = document.getElementById("firstName").value;
  if (firstName === "") {
    document.getElementById("firstNameErrorMsg").textContent =
      "Veuillez renseigner un prénom.";
    return false;
  } else if (isWordFrom3To20Character(firstName) === false) {
    document.getElementById("firstNameErrorMsg").textContent =
      "Veuillez renseigner un prénom valide.";
    return false;
  } else {
    document.getElementById("firstNameErrorMsg").textContent = "";
    return true;
  }
}

// function to check if the lastName is valid
function checkIfLastNameIsValid() {
  const lastName = document.getElementById("lastName").value;
  if (lastName === "") {
    document.getElementById("lastNameErrorMsg").textContent =
      "Veuillez renseigner un nom.";
    return false;
  } else if (isWordFrom3To20Character(lastName) === false) {
    document.getElementById("lastNameErrorMsg").textContent =
      "Veuillez renseigner un nom valide.";
    return false;
  } else {
    document.getElementById("lastNameErrorMsg").textContent = "";
    return true;
  }
}

// function to check if the address is valid (WIP !!!!!!!!!!!!!!!!!!!!!)
function checkIfAddressIsValid() {
  const address = document.getElementById("address").value;
  if (address === "") {
    document.getElementById("adressErrorMsg").textContent =
      "Veuillez renseigner une adresse.";
    return false;
  } else if (/^$/.test(address) === false) {
    document.getElementById("adressErrorMsg").textContent =
      "Veuillez renseigner une adresse valide.";
    return false;
  } else {
    document.getElementById("addressErrorMsg").textContent = "";
    return true;
  }
}

// function to check if the city is valid
function checkIfCityIsValid() {
  const city = document.getElementById("city").value;
  if (city === "") {
    document.getElementById("cityErrorMsg").textContent =
      "Veuillez renseigner une ville.";
    return false;
  } else if (isWordFrom3To20Character(city) === false) {
    document.getElementById("cityErrorMsg").textContent =
      "Veuillez renseigner un nom de ville valide.";
    return false;
  } else {
    document.getElementById("cityErrorMsg").textContent = "";
    return true;
  }
}

// function to check if the email is valid
function checkIfEmailIsValid() {
  const email = document.getElementById("email").value;
  if (email === "") {
    document.getElementById("emailErrorMsg").textContent =
      "Veuillez renseigner un email.";
    return false;
  } else if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email) === false) {
    document.getElementById("emailErrorMsg").textContent =
      "Veuillez renseigner un email valide.";
    return false;
  } else {
    document.getElementById("emailErrorMsg").textContent = "";
    return true;
  }
}
// functiun to check if the form is valid ans display error messages if requirred
let checkIfFormIsValid = () => {
  const isFirstNameValid = checkIfFirstNameIsValid();
  const isLastNameValid = checkIfLastNameIsValid();
  const isCityValid = checkIfCityIsValid();
  const isEmailValid = checkIfEmailIsValid();
  return isFirstNameValid && isLastNameValid && isCityValid && isEmailValid;
};

// add an event listener on the button
orderButton.addEventListener("click", function (event) {
  event.preventDefault();
  if (checkIfFormIsValid()) {
    console.log("Récupération du formulaire : OK");
    contactObject = buildContactObject();
    console.log("Contact object", contactObject);
  } else {
    console.log("Récupération du formulaire : KO");
  }
});
