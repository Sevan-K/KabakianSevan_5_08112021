class CartItem {
    constructor(id, quantity, color) {
      this.id = id;
      this.quantity = quantity;
      this.color = color;
    }
  }
const testRecovered = new CartItem(localStorage.getItem("testId"),localStorage.getItem("testQuantity"),localStorage.getItem("testColor"));
console.log(testRecovered);