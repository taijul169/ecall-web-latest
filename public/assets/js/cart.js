

 

//   add item to the cart

    
   //cart-----------
   //let cart = [];  

  const cartBtn = document.querySelectorAll('.store-item-button');
   cartBtn.forEach(function(btn){
       btn.addEventListener("click",function(event){
           
           const image_path = event.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.children[0].children[0].src;
           //console.log(event.target.dataset)
           event.target.disabled = true;
           event.target.style.background = "#000";
           event.target.style.opacity = "0.1";
           appendCart(event.target.dataset)
           setItemInLocalStorage(event.target.dataset)
            let cart = getCart()
            //get product from prducts
            let cartItem = {...getProduct(event.target.dataset.id), amount: 1 };
            // add product to the cart
            cart = [...cart, cartItem];
           // console.log("cart",cart)
             //save cart in local storage
             saveCart(cart);
             cartTotalAmount()
       })
   })

   const appendCart =(productInfo)=>{
       const parent =  document.querySelector('.card-item-wrapper')
      const singleItem =  document.createElement('div')
      singleItem.innerHTML = `
      <div class="d-flex flex-row justify-content-between align-items-center p-2 bg-white mt-4 px-3 rounded border-bottom">
      <div class="mr-1"><img class="rounded" src="${productInfo.img}" width="70"></div>
      <div class="d-flex flex-column align-items-center product-details"><span class="font-weight-bold">${productInfo.testname}</span>
          <div class="d-flex flex-column product-desc">
              <div class="size mr-1"><span class="text-grey">${productInfo.hospitalname}</div>
          </div>
      </div>
      
      <div>
          <h5 class="text-grey">${productInfo.price}</h5>
      </div>
      <div class="d-flex align-items-center"><i class="fa fa-trash mb-1 text-danger deleteItem"></i></div>
     </div>`;
     parent.append(singleItem)
   }
//    set item in the localStorage
   const setItemInLocalStorage = (productInfo)=>{
    localStorage.setItem("products", [JSON.stringify(productInfo)]);
   }
// get product from localStorage
    const getProduct =(id)=> {
    let products = JSON.parse(localStorage.getItem('products'));
    return products
    //return products.find(product => product.id == id);
   }
    
   function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    }
   //   display cart item from localStorage
function getCart() {
    return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
  }

  // displayProduct into cart from localStorage
 function diaplayProductFromLocalStorage(){
    const parent =  document.querySelector('.card-item-wrapper')
    const cartvalue = getCart()

    for(var i =0;i<cartvalue.length;i++){
        const singleItem =  document.createElement('div')
      singleItem.innerHTML = `
      <div class="d-flex flex-row justify-content-between align-items-center p-2 bg-white mt-4 px-3 rounded border-bottom">
      <div class="mr-1"><img class="rounded" src="${cartvalue[i].img}" width="70"></div>
      <div class="d-flex flex-column align-items-center product-details"><span class="font-weight-bold">${cartvalue[i].testname}</span>
          <div class="d-flex flex-column product-desc">
              <div class="size mr-1"><span class="text-grey">${cartvalue[i].hospitalname}</div>
          </div>
      </div>
      
      <div>
          <h5 class="text-grey">${cartvalue[i].price}</h5>
      </div>
      <div class="d-flex align-items-center"><i class="fa fa-trash mb-1 text-danger deleteItem"></i></div>
     </div>`;
     parent.append(singleItem)
    }
  }
  


//   buttonDisable
function buttonDisable(){
  const lablist =   document.getElementById('lablist').value
  const cartBtn = document.querySelectorAll('.store-item-button');
  let data = JSON.parse(lablist)
  const cartvalue = getCart()
  for(var a =0;a<cartBtn.length;a++){
      for(x=0;x<cartvalue.length;x++){
           
          if(cartBtn[a].attributes[8].value == cartvalue[x].id){
             cartBtn[a].disabled = true;
             cartBtn[a].style.background = "#000";
             cartBtn[a].style.opacity = 0.1;
          }
      }
  }

}
buttonDisable()


// total amount count
function cartTotalAmount(){
    let cartTotal =  document.getElementById("cartTotal");
    let totalitem =  document.querySelector(".total-item")
    let sum =0;
    const cartvalue = getCart()
    for(var x = 0;x<cartvalue.length;x++){
        sum = sum+parseInt(cartvalue[x].price)
    }
    cartTotal.innerText=sum
    totalitem.innerText = cartvalue.length
    return sum;
    
}

// session store
function sessionGenerate(){
   
    document.cookie = "checkout=no";
    //sessionStorage.setItem("testcheckout", "yes");
}




document.addEventListener("DOMContentLoaded", ()=> {
  console.log(cartTotalAmount()) 
    diaplayProductFromLocalStorage();
});