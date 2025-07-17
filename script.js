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

    Toastify({
            text: "Produto adicionado ao carrinho!",
            duration: 1500,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#22c55e",
            },
        }).showToast();

    updateCartModal()

}

//Aumentar e diminuir a quantidade no carrinho
cartItemsContainer.addEventListener("click", function(event){

    const button = event.target;

    const itemName = button.closest('.flex.items-center.justify-between').querySelector('.font-medium').textContent; // Uma forma de pegar o nome se não estiver no data-name do botão
    
    if(event.target.classList.contains("add-quantity-btn")){
        addToCart(itemName);

    } else if(event.target.classList.contains("remove-quantity-btn")) {
        removeItemCart(itemName)
    }
})

//Função para atualizar o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
    const cartItemElement = document.createElement("div")
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

    cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <div class="flex items-center gap-2">
                    <p>Quantidade: </p>
                    <button class="quantity-btn remove-quantity-btn bg-gray-300 px-2 rounded text-red-600 font-bold" data-name="${item.name}">-</button> 
                    <span class= data-item-quantity="${item.name}">${item.quantity}</span>
                    <button class="quantity-btn add-quantity-btn bg-gray-300 px-2 rounded text-red-600 font-bold" data-name="${item.name}">+</button>
            </div>
                <p class="font-medium mt-2">R$${item.price.toFixed(2)}</p>    
            </div>

            <button class="remove-from-cart-btn bg-red-600 duration-200 text-white px-4 py-1 rounded" data-name="${item.name}">
            Remover 
            </button>
        
        </div>
    `   

    total += item.price * item.quantity
    
    cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.length;

}

// Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
    
        removeFullItemFromCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

//Função para o botão remove-from-cart-btn
function removeFullItemFromCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        cart.splice(index, 1);
        updateCartModal();
        return;
    }
}

//Função para pegar o que você escreve no input de endereço
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-600")
        addressWarn.classList.add("hidden")
    }
})

//Função para pegar o que você escreve no input de observações
notesInput.addEventListener("input", function(event){

})

//Finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = isRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops, restaurante fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if(cart.length === 0) return;

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-600")
        return;
    }

    let total = 0;

    // Enviar pedido para o WhatsApp
    const cartItems = cart.map((item) => {
        total += item.price * item.quantity
        return (
            `${item.name}, Quantidade: (${item.quantity}), Preço: R$${item.price}`
        )
    }).join("\n")

    const phone = "+5581996238168"

    if(notesInput.value === ""){
        const message = encodeURIComponent(
        `${cartItems}\n\nTotal: R$${total.toFixed(2)}\nEndereço: ${addressInput.value}`
        );
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank")
    }else{
        const message = encodeURIComponent(
        `${cartItems}\n\nTotal: R$${total.toFixed(2)}\nEndereço: ${addressInput.value}\nObservações: ${notesInput.value}`
        );
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank")
    }

    Toastify({
            text: "Pedido realizado com sucesso!",
            duration: 1000000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#22c55e",
            },
        }).showToast();
    
    cart = [];
    updateCartModal();
    addressInput.value = ""; 
    notesInput.value = "";  

})

//Verificar se o restaurante está aberto de acordo com a hora
function isRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = isRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-600")
}