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
});

// Remove Item From Cart
$(document).on("click", ".cart-item .cart-item-remove i", function () {
    let cartItemID = $(this).closest(".cart-item").attr("id");
    $(`#${cartItemID}`).remove();
    $(`#${cartItemID}`).next(".cart-item-divider").remove();
    checkCartEmpty();
});

// Check if Cart is Empty
const checkCartEmpty = () => {
    let cartItemsCount = $(".cart-item-grid").children(".cart-item").length;
    if (cartItemsCount < 1) {
        $(".section-cart").hide();
        $(".section-empty-cart").fadeIn(1000);
    }
}


// Cart Steps
$(".cart-checkout .cart-button-next").click(() => {
    $(".cart-checkout").removeClass("active");
    $(".cart-shipping").addClass("active");
    $(".cart-headings>div").removeClass("active");
    $(".cart-headings>div:nth-child(2)").addClass("active");
})