/* ------------------------------------------------- */
/*          Display items from cart on page          */
/* ------------------------------------------------- */

// steps to follow:
//   1 - build cart from storage (done)
let cartToDisplay = buildCartFromStorage();
//   2 - déclarer un array vide qui contiendra le code html cartHtmlStructure
let cartHtmlStructure = [];
//   3 - parcourir l'array cart, pour chaque item :
//     3.1 - récupérer l'id
//     3.2 - récupérer les information de l'API à partir de l'id (done) et les stocker dans une variable
//     3.3 - à partir d'un produit (product) et d'un article du panier (cartItem),
//              compléter le code html et l'ajouter à cartHtmlStructure (function to create)
cartHtmlStructure = cartHtmlStructure + '<article class="cart__item" data-id="{product-ID}"><div class="cart__item__img"><img src="../images/product01.jpg" alt="Photographie d\'un canapé"></div><div class="cart__item__content"><div class="cart__item__content__titlePrice"><h2>Nom du produit</h2><p>42,00 €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42"></div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>'
//   4 - Ajouter le bloc HTML cartHtmlStructure avec la méthode innerHTML
const cartItems = document.getElementById("cart__items");
cartItems.innerHTML = cartHtmlStructure;
