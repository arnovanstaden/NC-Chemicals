// Handling any cart related logic


// CART UI

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
    let cartItemID = $(this).closest(".cart-item").attr("id");
    $(`#${cartItemID}`).remove();
    $(`#${cartItemID}`).next(".cart-item-divider").remove();
    console.log(cartItemID)
    checkCartEmpty();
});


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
    let cartItemsCount = $(".cart-checkout-grid .cart-item").length;
    if (cartItemsCount < 1) {
        $(".section-cart").hide();
        $(".section-empty-cart").addClass("active")
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