/* ------------------------------------------------- */
/*          Display items from cart on page          */
/* ------------------------------------------------- */

// build cart from storage (done)
let cartToDisplay = buildCartFromStorage();

// fonction pour créer la structure HTML à ajouter
async function buildHtmlStructure(cart) {
  //   déclarer un array vide qui contiendra le code html cartHtmlStructure
  let htmlStructure = [];
  //  parcourir l'array cart, pour chaque item :
  for (let i = 0; i < cartToDisplay.length; i++) {
    //     3.1 - récupérer l'article i dans le panier
    let itemToDisplay = cart[i];
    console.log(`Item with index ${i} into the cart`, itemToDisplay);
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

// function to calculate the total Price of items on cart
let calculateCartTotalPrice = async (cart) => {
  let totalPrice = 0;
  for (let item of cart) {
    // get price item
    let productConcerned = await getProductById(item.id);
    totalPrice += productConcerned.price;
  }
  console.log("Montant total du panier : ", totalPrice);
  return totalPrice;
};

// function to display cart in cart page
async function displayCart(cart) {
  // build html sturcture from the cartToDisplay
  let cartHtmlStructure = await buildHtmlStructure(cart);
  //   4 - Ajouter le bloc HTML cartHtmlStructure avec la méthode innerHTML
  const cartItems = document.getElementById("cart__items");
  cartItems.innerHTML = cartHtmlStructure;
  // display the number of items on cart
  let numberOfItemsOnCart = cart.length;
  const totalQuantity = document.getElementById("totalQuantity");
  totalQuantity.textContent = numberOfItemsOnCart;
  // display cart's total Price
  const totalPrice = document.getElementById("totalPrice");
  totalPrice.textContent = await calculateCartTotalPrice(cart);
  // calling the function to remove items from cart
  removeItemFromCart();
  // calling the function to modify quantity of items
  changeItemQuantity();
}
displayCart(cartToDisplay);

/* ---------------------------------------- */
/*          Edit cart on cart page          */
/* ---------------------------------------- */

// 1 quand l'article en question est cliqué => récupérer son data-id (comment ?)

// 2 cas ou il faut modifier la quantité
//    2.1 Réupérer la valeur de quantité modifiée
//    2.2 Modifier le cartToDisplay et ou le local storage
//    2.3 Afficher le nouveau cart
// 3 cas ou il faut supprimer l'article
//    3.1 Réupérer la valeur de quantité modifiée
//    3.2 Modifier le cartToDisplay et ou le local storage
// 4 Afficher le nouveau cart

// function to remove items from cart on page
function removeItemFromCart() {
  // get all DOM elements which class is deleteItem
  const deleteButtons = document.getElementsByClassName("deleteItem");
  // console.log("élément deleteButtons", deleteButtons);
  // loop to target the element that has been clicked on
  for (let deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", function () {
      // get the item (closest article parent) to remove and its id
      let itemToDelete = deleteButton.closest("article");
      let itemToDeleteId = itemToDelete.dataset.id;
      console.log("id de l'élément deleteButton", itemToDeleteId);
      // remove itemToDelete from the page
      itemToDelete.remove();
      // remove the item from the sessionStorage
      sessionStorage.removeItem(itemToDeleteId);
      console.log(sessionStorage);
      // update cartToDisplay
      cartToDisplay = buildCartFromStorage();
    });
  }
}

// function to modify one item quatity
function changeItemQuantity() {
  // get all DOM elements which class is itemQuantity
  const quantityInputs = document.getElementsByClassName("itemQuantity");
  // console.log("éléments quantityInputs", quantityInputs);
  for (let quantityInput of quantityInputs) {
    quantityInput.addEventListener("change", function (event) {
      // get the new quantity whiched by user
      let newQuantity = event.target.value;
      console.log(newQuantity);
      // get the item (closest article parent) to modify and its id
      itemToModify = quantityInput.closest("article");
      itemToModifyId = itemToModify.dataset.id;
      console.log(itemToModifyId);
    });
  }
}
