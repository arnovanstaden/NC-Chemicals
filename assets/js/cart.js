// Handling any cart related logic


// CART UI

// Cart Steps
$(".cart-checkout .cart-button-next").click(() => {
    $(".cart-checkout").removeClass("active");
    $(".cart-shipping").addClass("active");
    $(".cart-headings>div").removeClass("active");
    $(".cart-headings>div:nth-child(2)").addClass("active");
});

$(".cart-shipping .cart-button-next").click(() => {
    // validate form before payment
    if (validateCartForm() !== false) {
        $(".cart-shipping").removeClass("active");
        $(".cart-payment").addClass("active");
        $(".cart-headings>div").removeClass("active");
        $(".cart-headings>div:nth-child(3)").addClass("active");
    }
});

$(".cart-shipping .cart-button-prev").click(() => {
    $(".cart-shipping").removeClass("active");
    $(".cart-checkout").addClass("active");
    $(".cart-headings>div").removeClass("active");
    $(".cart-headings>div:nth-child(1)").addClass("active");
});

$(".cart-payment .cart-button-prev").click(() => {
    $(".cart-payment").removeClass("active");
    $(".cart-shipping").addClass("active");
    $(".cart-headings>div").removeClass("active");
    $(".cart-headings>div:nth-child(2)").addClass("active");
});

$(".form-element input, .form-element textarea").focus(function () {
    $(this).addClass("hide-placeholder")
    $(this).prev().fadeIn(750);
});

$(".form-element input, .form-element textarea").focusout(function () {
    if ($(this).val() === "") {
        $(this).prev().fadeOut(750);
        $(this).removeClass("hide-placeholder")
    }
});

//Adjust Totals by Quantity
$(document).on("click", ".cart-item .product-quant .quant-minus", function () {
    let cartItemID = $(this).closest(".cart-item").attr("id");
    let quantity = parseInt($(`#${cartItemID} .cart-item-quant span`).html());
    if (quantity !== 1) {
        quantity--;
    }
    $(`#${cartItemID} .cart-item-quant span`).html(quantity);

    // Adjust Total for Quantity
    let cartItemPrice = parseInt($(`#${cartItemID} .cart-item-price span`).html());
    let cartItemTotal = cartItemPrice * quantity;
    $(`#${cartItemID} .cart-item-total span`).html(cartItemTotal);
    calculateCartTotal();
});

$(document).on("click", ".cart-item .product-quant .quant-plus", function () {
    let cartItemID = $(this).closest(".cart-item").attr("id");

    let quantity = parseInt($(`#${cartItemID} .cart-item-quant span`).html());
    quantity++;
    $(`#${cartItemID} .cart-item-quant span`).html(quantity);

    // Adjust Total for Quantity
    let cartItemPrice = parseInt($(`#${cartItemID} .cart-item-price span`).html());
    let cartItemTotal = cartItemPrice * quantity;
    $(`#${cartItemID} .cart-item-total span`).html(cartItemTotal);
    calculateCartTotal();
});

// Remove Item From Cart
$(document).on("click", ".cart-item-remove i", function () {
    let cartItemCode = $(this).closest(".cart-item").attr("id");
    $(`#${cartItemCode}`).remove();
    $(`#${cartItemCode}`).next(".cart-item-divider").remove();
    removeCartItem(cartItemCode)
});





// CART UTILS

const validateCartForm = () => {
    'use strict';
    let form = document.getElementById("shipping-form")
    if (form.checkValidity() === false) {
        console.log("Validation Fail");
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        return false
    } else {
        console.log("Validation Success")
    }
    form.classList.add('was-validated');
}

// Check if Cart is Empty
const checkCartEmpty = () => {
    currentCart = JSON.parse(localStorage.getItem("cart"));
    if (currentCart.length < 1 || currentCart === null) {
        $(".section-cart").hide();
        $(".section-empty-cart").addClass("active")
        return true
    }
}

// Adjust Cart Totals
const calculateCartTotal = () => {
    const cartSize = $(".cart-checkout-grid .cart-item").length;
    let cartTotal = 0;
    for (let i = 1; i <= cartSize; i++) {
        cartTotal += parseInt($(`#cart-item-${i} .cart-item-total span`).html());
    }
    $(".cart-checkout-total span").html(cartTotal)
}

// Delete Cart
const clearCart = () => {
    localStorage.clear()
}

// Update Cart Count
const updateCartCount = () => {
    const currentCart = JSON.parse(localStorage.getItem("cart"));
    if (currentCart === null || currentCart.length < 1) {
        $(".cart-count").addClass("empty")
    } else {
        const cartCount = currentCart.length;
        $(".cart-count").html(cartCount);
        $(".cart-count").removeClass("empty")
    }
}


const addToCart = () => {

    // Create Product to add
    let product = {
        code: $(".product-container").attr("data-product-code"),
        quantity: $(".product-quant span").html(),
        size: $(".product-sizes span.active").html()
    }

    // Add to LocalStorage
    let currentCart = localStorage.getItem("cart");

    if (currentCart === null) {
        currentCart = [];
        currentCart.push(product)
        localStorage.setItem("cart", JSON.stringify(currentCart));
    } else {
        currentCart = JSON.parse(currentCart);
        if (checkIfItemInCart(product) === true) {
            alert("item already in cart");
        } else {
            currentCart.push(product);
            localStorage.setItem("cart", JSON.stringify(currentCart));
        }

    }
    updateCartCount()
}

const checkIfItemInCart = (product) => {
    // Check if Item already in cart
    currentCart = JSON.parse(localStorage.getItem("cart"));
    let inCart = false;
    currentCart.forEach(cartItem => {
        if (cartItem.code === product.code && cartItem.size === product.size) {
            inCart = true
        }
    });
    return inCart
}

const removeCartItem = (code) => {
    currentCart = JSON.parse(localStorage.getItem("cart"));
    let productFound = currentCart.find(product => product.code === code);
    index = currentCart[currentCart.indexOf(productFound)];
    currentCart.splice(index, 1)
    localStorage.setItem("cart", JSON.stringify(currentCart));
    checkCartEmpty();
    updateCartCount();
}

const loadCart = () => {

    if (!checkCartEmpty()) {
        console.log("load")
        currentCart = JSON.parse(localStorage.getItem("cart"));
        let productCodes = [];
        currentCart.forEach(item => {
            productCodes.push(item.code)
        });

        axios.get("./assets/js/products.json")
            .then(response => {
                products = response.data;

                let count = 0;
                productCodes.forEach(code => {
                    let productFound = products.find(product => product.code === code);
                    product = products[products.indexOf(productFound)]
                    count++;
                    $(".cart-checkout-grid").append(
                        `
                        <div class="col-lg-10 col-md-12 offset-lg-1 cart-item" id="cart-item-${count}">
                            <div class="col-md-1 cart-item-image">
                                <img src="./assets/images/products/t1.png" alt="">
                            </div>
                            <div class="col-md-3 cart-item-name">
                                <h6>${product.name}</h6>
                                <p>${product.category}</p>
                            </div>
                            <div class="col-md-2 cart-item-price">
                                <p>R <span>${product.prices[currentCart[count-1].size]}</span>.00</p>
                            </div>
                            <div class="col-md-3 cart-item-quant">
                                <div class="product-quant">
                                    <i class="far fa-minus quant-minus"></i>
                                    <span>${currentCart[count-1].quantity}</span>
                                    <i class="far fa-plus quant-plus"></i>
                                </div>
                            </div>
                            <div class="col-md-2 cart-item-total">
                                <p>R <span>${product.prices[currentCart[count-1].size] * currentCart[count-1].quantity}</span>.00</p>
                            </div>
                            <div class="col-md-1 cart-item-remove">
                                <i class="fal fa-times"></i>
                            </div>
                        </div>
                        <div class="cart-item-divider"></div>
                        `
                    )
                })

                calculateCartTotal();
            })
            .catch(err => console.log(err));
    }
}