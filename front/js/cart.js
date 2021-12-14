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
  // console.log(cart);
  let numberOfItems = 0;
  for (let item of cart) {
    numberOfItems += item.quantity;
    // console.log(item.quantity);
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
      // remove the item from the localStorage
      localStorage.removeItem(itemToDeleteId);
      // console.log(localStorage);
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
      // moodify localSTorage
      let storageItemToModify = JSON.parse(
        localStorage.getItem(itemToModifyId)
      ); // use key to find the item and parse it into JS object
      storageItemToModify.quantity = newQuantity; // modify quantity
      localStorage.setItem(
        itemToModifyId,
        JSON.stringify(storageItemToModify)
      ); // update localStorage
      // console.log(
      //   "Storage après modification de la quantité sur la page panier",
      //   localStorage
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

// contact object variable definition
let contactObject;

// regex definition
// regex for names (firstName, lastName and city)
const regexForNames =
  /^\b((?!-)(?!.*--)(?!')(?!.*'')[-A-ZÀ-ÿa-z. ']{2,20}(?<!-)(?<!'))$/;
//   ^                        # Anchor at start of string
// (?!-)                      # Assert that the first character isn't a -
// (?!.*--)                   # Assert that there are no -- present anywhere
// [-A-ZÀ-ÿa-z. ']{2,20}      # Match from 2 to 20 allowed characters
// (?<!-)                     # Assert that the last one isn't a -
// $                          # Anchor at end of string

// regex for email
const regexForEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
// \w                      # Assert that matches any word or character (alphanumeric & underscore)
// \.                   # Assert that matches a "." character
// +      # Quantifier : Matches one or more the precedent token
// @  # Assert that matches a "@" character

// regex for addres
const regexForAddress =
  /^((?!-)(?!.*--)(?!')(?!.*'')[-A-ZÀ-ÿa-z0-9\s']{5,50}(?<!-)(?<!'))$/;

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

// function to check if an input of the form is valid according to a regex and display an error message if not
function checkIfFormInputIsValid(formInput, regex, textForErrorMsg) {
  let formValue = document.getElementById(formInput).value;
  if (formValue === "") {
    document.getElementById(
      `${formInput}ErrorMsg`
    ).textContent = `Veuillez renseigner ${textForErrorMsg}.`;
    return false;
  } else if (regex.test(formValue) === false) {
    document.getElementById(
      `${formInput}ErrorMsg`
    ).textContent = `Veuillez renseigner ${textForErrorMsg} valide.`;
    return false;
  } else {
    document.getElementById(`${formInput}ErrorMsg`).textContent = "";
    return true;
  }
}

// functiun to check if the form is valid ans display error messages if requirred
let checkIfFormIsValid = () => {
  // part to check if the firstName is valid
  const isFirstNameValid = checkIfFormInputIsValid(
    "firstName",
    regexForNames,
    "un prénom"
  );
  // part to check if the lastName is valid
  const isLastNameValid = checkIfFormInputIsValid(
    "lastName",
    regexForNames,
    "un nom"
  );
  // part to check if the city is valid
  const isCityValid = checkIfFormInputIsValid(
    "city",
    regexForNames,
    "une ville"
  );
  // part to check if the addres is valid
  const isAddressValid = checkIfFormInputIsValid(
    "address",
    regexForAddress,
    "une adresse"
  );
  // part to check if the email is valid
  const isEmailValid = checkIfFormInputIsValid(
    "email",
    regexForEmail,
    "un email"
  );

  return (
    isFirstNameValid &&
    isLastNameValid &&
    isCityValid &&
    isAddressValid &&
    isEmailValid
  );
};

// function returning true if the id is find on the list
let checkIfIdOnList = (id, list) => {
  let isIdOnList = false;
  let loopCount = 0;
  while (!isIdOnList && loopCount < list.length) {
    isIdOnList = id === list[loopCount];
    loopCount++;
    console.log("passage dans le vérificateur");
  }
  return isIdOnList;
};

// function to build the cart to send to the API
function buildItemsIdList(cart) {
  // working cart that will be build with only the id
  let workingList = [];
  // for loop to go through all the items of cart
  for (let item of cart) {
    // if the item's id is on list
    if (checkIfIdOnList(item.id, workingList)) {
      // do nothing
    } else {
      // if not then add it
      workingList.push(item.id);
    }
  }
  console.log("Liste d'id construite à partir du panier :", workingList);
  return workingList;
}

// function to POST the object into the API
async function insertPost(dataToAdd) {
  try {
    let response = await fetch("http://localhost:3000/api/products/order", {
      //  method to use
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // body of the request
      body: JSON.stringify(dataToAdd),
    });
    if (response.ok) {
      let addedData = await response.json();
      console.log("Elément ajouté à l'API", addedData);
      return addedData;
    } else {
      console.log(response.status);
    }
  } catch (error) {
    console.log("Erreur lors de la tentative de POST : ", error);
  }
}

// add an event listener on the button
orderButton.addEventListener("click", async function (event) {
  event.preventDefault();
  // if form data are valid allow to send them
  if (checkIfFormIsValid()) {
    console.log("Récupération du formulaire : OK");
    contactObject = buildContactObject();
    console.log("Contact object", contactObject);
    // build productId list
    let itemIdList = buildItemsIdList(cartToDisplay);
    // constituer l'objet à envoyer au serveur (contactObject + cart)
    let objectToSend = {
      contact: contactObject,
      products: itemIdList,
    };
    console.log("Objet à envoyer au serveur", objectToSend);
    // stocker l'objet contact dans le local storage
    localStorage.setItem("objectToSend", JSON.stringify(objectToSend));
    console.log(
      "SessionStorage après stockage de l'objet à envoyer",
      localStorage
    );
    // insert the object into the API to get orderID
    let order = await insertPost(objectToSend);
    console.log("id de la commande passée", order.orderId);
    // charge confirmation page avec le numéro de la commande
    window.location.href = "confirmation.html?id=" + order.orderId;
  } else {
    console.log("Récupération du formulaire : KO");
  }
});