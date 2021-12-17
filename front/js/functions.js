/* ---------------------------------------------------- */
/*          Functions to get data from the API          */
/* ---------------------------------------------------- */

// function to get product's informations based on an id
let getProductById = async function (id) {
  try {
    // the variable response await for a return of fetch promise
    let response = await fetch("http://localhost:3000/api/products/" + id);
    // if the response is OK then
    if (response.ok) {
      // data await the response to be converted into a JS object
      let data = await response.json();
      return data;
    } else {
      // if the response is not OK then show response status
      console.log("Statut d'erreur de la réponse de getProductById",response.status);
    }
  } catch (error) {
    // adding a catch to be able to show the error if what is into the try does not work
    console.log(error);
  }
};

/* ------------------------------------------------------------ */
/*          Functions related to cart and localStorage          */
/* ------------------------------------------------------------ */

// check localStorage when loading page
console.log("Etat du storage en arrivant sur la page", localStorage);

// fonction to build cart from the local storage
function buildCartFromStorage() {
  let cartToBuild = [];
  // if there is nothing on the local storage it means there is nothing on the cart
  if (localStorage.length > 0) {
    for (let j = 0; j < localStorage.length; j++) {
      // recover the name of the key
      let key = localStorage.key(j);
      // revover the corresponding value
      let value = localStorage.getItem(key);
      if (
        key != "IsThisFirstTime_Log_From_LiveServer" &&
        key != "objectToSend"
      ) {
        // parsing the value to an JS object
        cartToBuild.push(JSON.parse(value));
      }
    }
  }
  console.log("Panier construit à partir du localStorage", cartToBuild);
  return cartToBuild;
}

// fonction pour ajouter le panier au local storage
function storeCart(cart) {
  // delete the old version of localStorage
  localStorage.clear();
  // store the items into the local storage
  for (item of cart) {
    let itemKey = item.id + "_" + item.color;
    const itemStringified = JSON.stringify(item);
    localStorage.setItem(itemKey, itemStringified);
  }
  console.log("localStorage après intégration du nouvel article", localStorage);
}