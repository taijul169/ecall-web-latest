// Variable-declaration-----------------
const addTocartBtn = document.getElementById("addTocartBtn");
const cartContentHome = document.getElementById("cart-content-home");
const cartItemNumber = document.getElementById("cartItemNumber");
const cartTotalAmount = document.getElementById("cartTotalAmount");
const cartBoxHome = document.getElementById("cart-box-home-top");
const clearCartBtn = document.getElementById("clearCartBtn");
const singleCartItem = document.querySelector('.single-product-cart');
const cartPageCartWrapper = document.querySelector('.cart-page-cart-wrapper');

//cart-----------
let cart = [];
//buttons
let buttonsDOM = [];
// getting the products
class Products{
    async getProducts() {
      try {
          let result = await fetch('products.json');
          let data = await result.json();
          let products = data.items;
        //   destructureing json data--------------------
          products = products.map(item => {
              const { title, price } = item.fields;
              const id = item.sys.id;
              const image = item.fields.image.fields.file.url;
              return { title, price, id, image };
          });
          return products;
      } catch (error) {
          console.log(error);
      }
    
    }

}  
// display products
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result += `
             <div class="col-md-4 col-lg-4 col-xl-4 col-12 col-sm-12">
                <!-- single-product -->
                <div class="single-product-wrpper">
                    <a href="single-product-fullwidth.html">
                        <small>${product.title}</small>
                        <h6>Wireless Audio System Multiroom 360 degree Full base audio....</h6>
                        <div class="product-image">
                            <a href="#"><img src="${product.image}" alt="1.jpg"></a>
                            <span><b>$${product.price}</b> <button class="addTocartBtn" data-id=${product.id}><i class="fa fa-shopping-cart"></i></button></span>
                        </div>
                        <div class="product-bottom">
                            <ul>
                                <li><a href="#"><i class="fa fa-refresh"></i>Compare</a></li>
                                <li><a href="#"><i class="fa fa-heart-o"></i>Add to Wishlist</a></li>
                            </ul>
                        </div>
                    </a>
                </div>
            </div>
            ` ;
        });
        cartContentHome.innerHTML = result;
    
    }

    addTocart() {
        const buttons = [...document.querySelectorAll(".addTocartBtn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.style.color = "#000000";
                button.disabled = true;
            }
    
            button.addEventListener("click", (e) => {
                e.target.style.color = "#000";
                e.target.style.opacity = "0.1";
                e.target.disabled = true;
                //get product from prducts
                let cartItem = {...Storage.getProduct(id), amount: 1 };
                // add product to the cart
                cart = [...cart, cartItem];
                //save cart in local storage
                Storage.saveCart(cart);
                //set cart values
                this.setCartValues(cart);
                //display cart item
                this.addCartItem(cartItem);
                //display cart item in cart page
                // this.addCartItemInCartPage(cartItem);
                // show the cart
            });
    
        })
        
    }

    setCartValues(cart) {
        let tempTotal = 0.00;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotalAmount.innerHTML =`$${parseFloat(tempTotal.toFixed(2))}`;
        cartItemNumber.innerHTML = itemsTotal;  
    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('single-product-cart');
        div.innerHTML = `
                <div class="cart-product-img">
                    <img src="${item.image}" alt="1.jpg">
                </div>
                <div class="cart-product-details-home">
                    <p>Ultra Wireless S50 Headphones S50 with Bluetooth</p>
                    <div class="cart-midle-home">
                     <h6>${item.amount} x $${item.price}</h6>
                      <div class="cart-midle-right-home">
                       <ul>
                          <li><button><i class="fa fa-angle-left" data-id="${item.id}"></i></button></li>
                          <li><b>${item.amount}</b></li>
                          <li><button><i class="fa fa-angle-right" data-id="${item.id}"></i></button></li>
                       </ul>
                    </div>
                    </div>
                    
                </div>
                <div class="cart-item-del-btn-home">
                    <b class="fa fa-close" data-id="${item.id}"></b>
                </div>`;
        cartBoxHome.appendChild(div);
    }
    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    cartLogic() {
        //clear cart button
        clearCartBtn.addEventListener("click", () => {
            this.clearCart();
             
        });
        //cart functionality-home page
        cartBoxHome.addEventListener("click", event => {
            if (event.target.classList.contains('fa-close')) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartBoxHome.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
                
            }
            else if (event.target.classList.contains("fa-angle-right")) {
                let addAmount = event.target; 
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.parentElement.parentElement.previousSibling.children.innerText = tempItem.amount;
            }
            else if(event.target.classList.contains("fa-angle-left")) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount > 0) {
                Storage.saveCart(cart);
                this.setCartValues(cart);
                lowerAmount.parentElement.parentElement.nextSibling.children.innerText = tempItem.amount; 
                }
                else {
                    cartBoxHome.removeChild(lowerAmount.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
            
            
        });
        //cart functionality-cart page--------------
        // cartPageCartWrapper.addEventListener("click", event => {
        //     if (event.target.classList.contains('fa-close')) {
        //         let removeItem = event.target;
        //         let id = removeItem.dataset.id;
        //         // console.log(removeItem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)
        //         cartPageCartWrapper.removeChild(removeItem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);
        //         this.removeItem(id);
        //         cartBoxHome.removeChild(removeItem.parentElement.parentElement);
        //         this.removeItem(id);
        //     }
        //     else if (event.target.classList.contains("fa-angle-right")) {
        //         let addAmount = event.target; 
        //         let id = addAmount.dataset.id;
        //         let tempItem = cart.find(item => item.id === id);
        //         tempItem.amount = tempItem.amount + 1;
        //         Storage.saveCart(cart);
        //         this.setCartValues(cart);
        //         addAmount.parentElement.parentElement.previousSibling.children.innerText = tempItem.amount;
        //     }
        //     else if(event.target.classList.contains("fa-angle-left")) {
        //         let lowerAmount = event.target;
        //         let id = lowerAmount.dataset.id;
        //         let tempItem = cart.find(item => item.id === id);
        //         tempItem.amount = tempItem.amount - 1;
        //         if (tempItem.amount > 0) {
        //         Storage.saveCart(cart);
        //         this.setCartValues(cart);
        //         lowerAmount.parentElement.parentElement.nextSibling.children.innerText = tempItem.amount; 
        //         }
        //         else {
        //             cartBoxHome.removeChild(lowerAmount.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);
        //             this.removeItem(id);
        //         }
        //     }
            
            
        // });
        }
        
    
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while (cartBoxHome.children.length > 0) {
            cartBoxHome.removeChild(cartBoxHome.children[0]);
        }
        
        }
    removeItem(id) {
        cart = cart.filter(item => item.id !== id); 
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.style.color = "#f4f4f4";
        button.style.opacity = "1";
        button.disabled = false;

        }
    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
    }

    // addCartItemInCartPage(item) {
    //     const eleMent = document.createElement('div');
    //     eleMent.classList.add('single-product-wrapper');
    //     eleMent.innerHTML = `

    //     <div class="row">
    //         <div class="col-md-6 col-lg-6 col-xl-6 col-12 col-sm-12">
    //             <div class="cart-info-box-wrapper-left">
    //                 <ul>
    //                     <li><a href="#"><i class="fa fa-close"></i></a></li>
    //                     <li><a href="#"><img src="${item.image}" alt="1.jpg"></a></li>
    //                     <li><a href="#">${item.title}</a></li>
    //                 </ul>
    //             </div>
    //         </div>
    //         <div class="col-md-6 col-lg-6 col-xl-6 col-12 col-sm-12">
    //             <div class="cart-info-box-wrapper-right">
    //                 <ul>
    //                     <li>$${item.price}</li>
    //                     <li>
    //                         <div class="quntity-increase-decrease">
    //                             <span id="quntity-number-display">1</span>
    //                             <span id="qunatity-decrease"data-id=" ${item.id}">-</span>
    //                             <span id="quantity-increase"data-id=" ${item.id}">+</span>
    //                         </div>
    //                     </li>
    //                     <li>$${item.price}</li>
    //                 </ul>
    //             </div>
    //         </div>
    //     </div>
    //     `;

    //     cartPageCartWrapper.appendChild(eleMent);
    // }
}
// local storage
class Storage{
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
      return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
    }


}
document.addEventListener("DOMContentLoaded", ()=> {
    const ui = new UI();
    const products = new Products();
    //setup application--------------
    ui.setupAPP();
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.addTocart();
        ui.cartLogic();
    });
    
});