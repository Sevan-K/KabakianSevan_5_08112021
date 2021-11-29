/* ------------------------------------------------- */
/*          Display items from cart on page          */
/* ------------------------------------------------- */

//   1 - build cart from storage (done)
let cartToDisplay = buildCartFromStorage();

// fonction pour créer la structure HTML à ajouter
async function buildHtmlStructure(cart) {
    //   2 - déclarer un array vide qui contiendra le code html cartHtmlStructure
    let htmlStructure = [];
    //   3 - parcourir l'array cart, pour chaque item :
    for (let i = 0; i < cartToDisplay.length; i++) {
      //     3.1 - récupérer l'article i dans le panier
      let itemToDisplay = cart[i];
      console.log(
        `Item with index ${i} into the cart`,
        itemToDisplay
      );
      //     3.2 - récupérer les information de l'API à partir de l'id (done) et les stocker dans une variable
      let productConcerned = await getProductById(itemToDisplay.id);
      console.log(productConcerned);
      //     3.3 - à partir d'un produit (product) et d'un article du panier (cartItem),
      //              compléter le code html et l'ajouter à HtmlStructure (function to create)
      htmlStructure += `
      <article class="cart__item" data-id="${itemToDisplay.id}">
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

// function to display cart in cart page
async function displayCart() {
  // build html sturcture from the cartToDisplay
  let cartHtmlStructure = await buildHtmlStructure(cartToDisplay);
  //   4 - Ajouter le bloc HTML cartHtmlStructure avec la méthode innerHTML
  const cartItems = document.getElementById("cart__items");
  cartItems.innerHTML = cartHtmlStructure;
}
displayCart();
