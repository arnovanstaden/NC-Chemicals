// Handling any cart related logic

const deliveryFee = 0;

// CART UI

// Cart Steps
$(".cart-container .cart-button-next, .cart-container .cart-button-prev").click(() => {
    $(document).scrollTop(0)
})

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

    // Set Name
    $(".payment-message span").html($("#shipping-form input[name='name_first']").val());
    // Set Name
    $(".payment-message h3 span").html($("#shipping-form input[name='name_first']").val());
    $(".payment-message p span").html(`R ${$(".cart-checkout-total span").html()}`);
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
    updateCartQuantity();

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
    updateCartQuantity();

});

// Remove Item From Cart
$(document).on("click", ".cart-item-remove i", function () {
    let cartItemCode = $(this).closest(".cart-item").attr("id");
    $(`#${cartItemCode}`).remove();
    $(`#${cartItemCode}`).next(".cart-item-divider").remove();
    removeCartItem(cartItemCode)
});



// CART UTILS

const notifyCart = (inCartAlready, product) => {
    $(".notify-cart").addClass("open");
    if (!inCartAlready) {
        $(".notify-cart h4").html(`${$(".product-name").html()} -  ${$(".product-sizes span.active").html()} has been added to your cart`)
    } else {
        $(".notify-cart h4").html("This product is already in your cart")
    }
}

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
    if (currentCart === null || currentCart.length < 1) {
        $(".section-cart").hide();
        $(".section-empty-cart").addClass("active");
        hideLoader();
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
    cartTotal += deliveryFee;
    $(".cart-checkout-total span").html(cartTotal)
}

// Delete Cart
const clearCart = () => {
    localStorage.clear();
    updateCartCount()
}

const showCart = () => {
    console.log(JSON.parse(localStorage.getItem("cart")));
}

// Update Cart Quanity
const updateCartQuantity = () => {
    let currentCart = JSON.parse(localStorage.getItem("cart"));
    let productCode;
    let productQuant;
    let produtSize;
    const cartSize = $(".cart-checkout-grid .cart-item").length;
    for (let i = 1; i <= cartSize; i++) {
        productCode = $(`#cart-item-${i}`).attr("data-product-code");
        productSize = $(`#cart-item-${i}`).attr("data-product-size");
        productQuant = $(`#cart-item-${i} .product-quant span`).html();
        currentCart.forEach(cartItem => {
            if (cartItem.code === productCode && cartItem.size === productSize) {
                cartItem.quantity = productQuant
            }
        });
    }
    localStorage.setItem("cart", JSON.stringify(currentCart));
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
        notifyCart(false, product);
    } else {
        currentCart = JSON.parse(currentCart);
        if (checkIfItemInCart(product)) {
            notifyCart(true, product);
        } else {
            notifyCart(false, product);
            currentCart.push(product);
            localStorage.setItem("cart", JSON.stringify(currentCart));

        }

    }
    updateCartCount()
}

const checkIfItemInCart = (product) => {
    currentCart = JSON.parse(localStorage.getItem("cart"));
    let inCart = false;
    currentCart.forEach(cartItem => {
        if (cartItem.code === product.code && cartItem.size === product.size) {
            console.log(cartItem.code);
            console.log(cartItem.size);
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

    // Adjust Cart Item ID's
    const cartSize = $(".cart-checkout-grid .cart-item").length;
    for (let i = 1; i <= cartSize; i++) {
        $(`.cart-checkout-grid .cart-item:nth-child(${i}`).attr("id", `cart-item-${i}`)
    }
    calculateCartTotal();

}

const loadCart = () => {

    if (!checkCartEmpty()) {
        currentCart = JSON.parse(localStorage.getItem("cart"));
        let productCodes = [];
        currentCart.forEach(item => {
            productCodes.push(item.code)
        });



        axios.get(`${api_url}/products`)
            .then(response => {
                products = response.data;


                let count = 0;
                productCodes.forEach(code => {
                    let productFound = products.find(product => product.code === code);
                    if (productFound !== undefined && productFound.visibility) {
                        product = products[products.indexOf(productFound)]
                        count++;
                        $(".cart-checkout-grid").append(
                            `
                            <div class="col-lg-10 col-md-12 offset-lg-1 cart-item" id="cart-item-${count}" data-product-code="${product.code}" data-product-size="${currentCart[count-1].size}">
                                <div class="col-md-1  cart-item-image">
                                <img src="${product.productThumbnailUrl}" class="img-fluid" alt="">
                                </div>
                                <div class="col-md-4 col-lg-3 cart-item-name">
                                <a target="blank" href="./product.html#${product.code}">${product.name}</a>
                                <p> ${currentCart[count-1].size} </p>
                                </div>
                                <div class="col-md-2 col-sm-4 col-6  cart-item-price">
                                    <p>R <span>${product.prices[currentCart[count-1].size]}</span>.00</p>
                                </div>
                                <div class="col-md-3 col-sm-4 col-6 cart-item-quant">
                                    <div class="product-quant">
                                        <i class="far fa-minus quant-minus"></i>
                                        <span>${currentCart[count-1].quantity}</span>
                                        <i class="far fa-plus quant-plus"></i>
                                    </div>
                                </div>
                                <div class="col-md-2 col-sm-4 col-12 cart-item-total">
                                    <p>R <span>${product.prices[currentCart[count-1].size] * currentCart[count-1].quantity}</span>.00</p>
                                </div>
                                <div class="col-md-1 cart-item-remove">
                                    <i class="fal fa-times"></i>
                                </div>
                            </div>
                            `
                        )
                    } else {
                        // Remove deleted product
                        let deletedProduct = currentCart.find(item => item.code === code);
                        currentCart.splice(currentCart.indexOf(deletedProduct), 1);
                        localStorage.setItem("cart", JSON.stringify(currentCart));
                        return loadCart()
                    }

                });
                hideLoader()
                calculateCartTotal();
                $(".cart-checkout-total-delivery span").html(deliveryFee)
            })
            .catch(err => console.log(err));
    }
}


const sendPayment = () => {
    const deliveryAddress =
        $("#shipping-form input[name='adress_1']").val() + "," +
        $("#shipping-form input[name='adress_2']").val() + ", " +
        $("#shipping-form input[name='city']").val() + ", " +
        $("#shipping-form input[name='postcode']").val();

    $("#shipping-form input[name='item_description']").val(localStorage.getItem("cart"));
    $("#shipping-form input[name='custom_str1']").val($("#shipping-form input[name='cell_number']").val());
    $("#shipping-form input[name='custom_str2']").val(deliveryAddress);
    $("#shipping-form input[name='custom_str3']").val($("#shipping-form textarea[name='delivery_notes']").val());
    $("#shipping-form input[name='amount']").val(parseInt($(".cart-checkout-total span").html()));
    $("#shipping-form input[name='merchant_id']").val("10016549");
    $("#shipping-form input[name='merchant_key']").val("sxou1f0t4mr2c");

    $("#shipping-form").submit();
}