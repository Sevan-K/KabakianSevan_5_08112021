/* ---------------------------------------------- */
/*          General variables definition          */
/* ---------------------------------------------- */

// build cart from storage when page is loaded
let cartToDisplay = buildCartFromStorage();
// constant corresponding to DOM element which id is totalQuantity
const totalQuantity = document.getElementById("totalQuantity");
// constant corresponding to DOM element which id is totalPrice
const totalPrice = document.getElementById("totalPrice");
// target the order button
const orderButton = document.getElementById("order");
// contact object variable definition
let contactObject;

/* ------------------------------------------------------------- */
/*          Function to display items from cart on page          */
/* ------------------------------------------------------------- */

// function to build HTML structure to add to page to display cart
async function buildHtmlStructure(cart) {
  //   array that will contain HTML structrure
  let htmlStructure = [];
  //  going through cart array and :
  for (let i = 0; i < cartToDisplay.length; i++) {
    // get the item to display
    let itemToDisplay = cart[i];
    // get product's data from API using its ID
    let productConcerned = await getProductById(itemToDisplay.id);
    // console.log(productConcerned);
    // complete HTML structure of the product concerned using data from the API and the cart and add it to the HTML structure array
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
  // the funcyino return the filled HTML structure array
  return htmlStructure;
}

// function to calculate the number of items
let calculateNumberOfItems = (cart) => {
  // variable to store the total number of item
  let numberOfItems = 0;
  // go through cart and for each item :
  for (let item of cart) {
    // add item's quantity to the total number of items
    numberOfItems += item.quantity;
  }
  // the function return the total number of item calculated from cart
  return numberOfItems;
};

// function to calculate the total Price of items on cart
let calculateCartTotalPrice = async (cart) => {
  // variable to store the total number of item
  let cartTotalPrice = 0;
  for (let item of cart) {
    // get price item
    let productForTotalPriceCalculation = await getProductById(item.id);
    // add item price times item quantity to total price
    cartTotalPrice += productForTotalPriceCalculation.price * item.quantity;
  }
  return cartTotalPrice;
};

/* ----------------------------------------------------- */
/*          Functions to edit cart on cart page          */
/* ----------------------------------------------------- */

// function to remove items from cart on page
function removeItemFromCart() {
  // get all DOM elements which class is deleteItem
  const deleteButtons = document.getElementsByClassName("deleteItem");
  // loop to target the element that has been clicked on
  for (let deleteButton of deleteButtons) {
    // listent to a click event on all delete buttons
    deleteButton.addEventListener("click", async function () {
      // get the item (closest article parent)
      let itemToDelete = deleteButton.closest("article");
      // get the closest article parent's id
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

// function to modify an item's quantity on local storage based on its key
function updateStorageItemQuantity(key, quantity) {
  // use key to find the item and parse it into JS object
  let storageItemToModify = JSON.parse(localStorage.getItem(key));
  // modify quantity
  storageItemToModify.quantity = quantity;
  // update localStorage
  localStorage.setItem(key, JSON.stringify(storageItemToModify));
  // console.log(
  //   "Storage après modification de la quantité sur la page panier",
  //   localStorage
  // );
}

// function to modify one item quatity
function changeItemQuantity() {
  // get all DOM elements which class is itemQuantity
  const quantityInputs = document.getElementsByClassName("itemQuantity");
  // loop to target the element that has been clicked on
  for (let quantityInput of quantityInputs) {
    // listent to a change event on all quantity inputs
    quantityInput.addEventListener("change", async function (event) {
      // get the new quantity whiched by user
      let newQuantity = parseInt(event.target.value);
      // get the item (closest article parent) to modify
      itemToModify = quantityInput.closest("article");
      // get the closest article parent's id
      itemToModifyId = itemToModify.dataset.id;
      console.log("id de l'élément à modifier", itemToModifyId);
      // modify quantity on page
      quantityInput.setAttribute("value", newQuantity);
      // moodify localSTorage
      updateStorageItemQuantity(itemToModifyId, newQuantity);
      // update cartToDisplay
      cartToDisplay = buildCartFromStorage();
      // update the number of items on cart
      totalQuantity.textContent = calculateNumberOfItems(cartToDisplay);
      // update cart's total Price
      totalPrice.textContent = await calculateCartTotalPrice(cartToDisplay);
    });
  }
}

/* --------------------------------------------------------------------- */
/*          Main function to display and Edit cart on cart page          */
/* --------------------------------------------------------------------- */

// function to display cart in cart page
async function displayCart() {
  // build html sturcture from the cartToDisplay
  let cartHtmlStructure = await buildHtmlStructure(cartToDisplay);
  // target DOM element where the HTML structure will be injected
  const cartItems = document.getElementById("cart__items");
  // add HTML structure to the DOM using innerHTML
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

// calling the main function to dsplay cart on page
displayCart();

/* ------------------------------------------------ */
/*          Get contact data from the form          */
/* ------------------------------------------------ */

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

// function to build the contact object
let buildContactObject = () => {
  return {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  };
};

// function to check if an input of the form is valid according to a regex and display an error message if not
function checkIfFormInputIsValid(formInput, regex, textForErrorMsg) {
  // get input's value
  let formValue = document.getElementById(formInput).value;
  // if input is empty ask to fil it
  if (formValue === "") {
    document.getElementById(
      `${formInput}ErrorMsg`
    ).textContent = `Veuillez renseigner ${textForErrorMsg}.`;
    return false;
  }
  // if the value is not valid return false and display an error message
  else if (regex.test(formValue) === false) {
    document.getElementById(
      `${formInput}ErrorMsg`
    ).textContent = `Veuillez renseigner ${textForErrorMsg} valide.`;
    return false;
  }
  // else return true and display no error message
  else {
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
  // return true if all inputs ar valid and false if one of them in empty or invalid
  return (
    isFirstNameValid &&
    isLastNameValid &&
    isCityValid &&
    isAddressValid &&
    isEmailValid
  );
};

// function returning true if the id is find on the id list
let checkIfIdOnList = (id, list) => {
  // set default value of isIdOnList
  let isIdOnList = false;
  // variable to count loops
  let loopCount = 0;
  // go through list until the target id is found
  while (!isIdOnList && loopCount < list.length) {
    // isIdOnList is true if the target id is present
    isIdOnList = id === list[loopCount];
    // increment loop counter
    loopCount++;
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
  return workingList;
}

// function to POST the object into the API
async function insertPost(dataToAdd) {
  try {
    // the variable response await for a return of fetch promise
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
    // if the response is OK then
    if (response.ok) {
      // data await the response to be converted into a JS object
      let data = await response.json();
      console.log("Elément ajouté à l'API", data);
      // return response's data
      return data;
    } else {
      // if the response is not OK then show response status
      console.log(response.status);
    }
  } catch (error) {
    // adding a catch to be able to show the error if what is into the try does not work
    console.log("Erreur lors de la tentative de POST : ", error);
  }
}

// add an event listener on the button
orderButton.addEventListener("click", async function (event) {
  event.preventDefault();
  // if the cart is empty ask to add at leat one element
  if (cartToDisplay.length === 0) {
    alert(
      "Votre panier est vide. Veuillez y ajouter au moins un article pour valider la commande"
    );
  }
  // if form data are valid allow to send them
  else if (
    checkIfFormIsValid() &&
    confirm("Souhaitez vous valider la commande ?")
  ) {
    console.log("Récupération du formulaire : OK");
    // build the contact object to send
    contactObject = buildContactObject();
    // build productId list
    let itemIdList = buildItemsIdList(cartToDisplay);
    //build the object to send to the API (order) to get the orderId
    let objectToSend = {
      contact: contactObject,
      products: itemIdList,
    };
    console.log("Objet à envoyer au serveur", objectToSend);
    // store the objectToSend into the localStorage
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