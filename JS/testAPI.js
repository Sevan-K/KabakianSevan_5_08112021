/*  fichier pour tester l'API  */
// fonction pour récupérer les données de l'API et afficher des éléments d'un produit
const addProduct = async function (number) {
  // on essai le code entre {}
  try {
    // on fait une requete GET sur l'API
    let response = await fetch("http://localhost:3000/api/products");
    // si la réponse est correcte on récupère les données
    if (response.ok) {
      // stocker le json dans data
      let data = await response.json();
      //   ajout du texte dans la page web
      document.getElementById("product__name").textContent = data[number].name;
      document.getElementById("product__description").textContent =
        data[number].description;
      // test pour afficher à partir de l'ID (devrait être une autre fonction)
    } else {
      // sinon on renvoie l'erreur
      console.error("Réponse du serveur : " + response.status);
    }
  } catch (error) {
    // s'il ne fonctionne pas on récupère l'erreur
    console.log(error);
  }
};
// code pour afficher les information du produit sélectionné
const select = document.querySelector("select");
select.addEventListener("change", function (event) {
  addProduct(event.target.value);
});

// fontion pour afficher les éléments à partir d'un id


// test pour ajouter un information à l'API
const inserProduct = async function (productToAdd) {
  let response = await fetch("http://localhost:3000/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productToAdd),
  });
  let data = response.json();
  console.log(data);
};
// inserProduct({
//     name : "Kanap Kosmik",
//     description :"Le Kanap Kosmik vous assure une confort de l'espace"
// });
