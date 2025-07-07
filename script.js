const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

// Array do carrinho
let cart = [];

// Abrir o carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

// Fechar o carrinho ao clicar fora do modal
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

//Fechar o carrinho ao apertar no botão
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

//Adicionar ao carrinho
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
       const name = parentButton.getAttribute("data-name")
       const price = parseFloat(parentButton.getAttribute("data-price"))
       
       addToCart(name, price)
    } 
})

//Função para adicionar o carrinho
function addToCart(name, price){

    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
    //Se o eitem já existe, aumenta apenas a quantidade
        existingItem.quantity += 1
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()

}

//Função para atualizar o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
    const cartItemElement = document.createElement("div")
    cartItemElement.innerHTML = `
        <div>
            <p>${item.name}</p>
            <p>${item.quantity}</p>
            <p>R$${item.price}</p>    
        </div>

        <div> 
            <button> Remover </button>
        </div>
    `   
    
    cartItemsContainer.appendChild(cartItemElement)
    })
}