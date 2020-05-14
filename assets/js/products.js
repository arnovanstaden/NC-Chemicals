// GET PRODUCTS DATA

// Insert Products in Shop
const loadShopProducts = () => {
    axios.get(`${api_url}/products`)
        .then(response => {
            products = response.data;

            products.forEach(product => {
                priceKeys = Object.keys(product.prices)
                $(".shop-grid .row").append(
                    `
                <a class="shop-product col-sm-6 col-md-4 col-lg-4" href="./product.html#${product.code}" data-product-category="${product.category}" data-product-sizes="${priceKeys}"
                ">
                    <img class="shop-product-image" src="./assets/images/products/t1.png " alt="">
                    <h5 class="shop-product-name">
                        ${product.name}
                    </h5>
                    <p class="shop-product-price">
                        R ${product.prices[priceKeys[0]]}
                    </p>
                </a>
            `
                )
            });
        })
        .catch(err => console.log(err));
}

// Insert Product in Product Page

const loadProduct = () => {

    // Get Recipe ID
    let productCode = window.location.hash; //Get Recipe ID
    if (productCode == "") {
        window.location.pathname = "/index.html"
    }
    productCode = productCode.substr(1); //Remove #

    let product = {};
    axios.get(`${api_url}/products/productCode/${productCode}`)
        .then(response => {
            product = response.data;

            if (product !== undefined) {
                // Insert Product Details
                document.title = product.name;
                $(".product-container").attr("data-product-code", product.code)
                $(".product-info .product-category").html(product.category)
                $(".product-info .product-name").html(product.name)
                $(".product-info .product-description").html(product.description);

                // Prices
                priceKeys = Object.keys(product.prices)
                $(".product-info .product-price span").html(product.prices[priceKeys[0]]);

                // Sizes
                priceKeys.forEach(key => {
                    $(".product-sizes").append(
                        `<span data-size-price="${product.prices[key]}">${key}</span>`
                    );
                })
                $(".product-sizes span:nth-child(1)").addClass("active")
            } else {
                location.replace("./shop.html")
            }
        });
}

// PRODUCT UTILS

// Filter products
const filterProducts = (filterType) => {
    let shopSize = $(".shop-grid .shop-product").length;

    if (filterType === "brand") {
        let filterBrandCount = $("#filter-brand li").length
        let activeBrandFilters = [];
        $(`.shop-grid .shop-product`).removeClass("filter-hide-brand");

        // Get all active filter sizes
        for (let i = 1; i <= filterBrandCount; i++) {
            if ($(`#filter-brand li:nth-child(${i})`).hasClass("active")) {
                activeBrandFilters.push($(`#filter-brand li:nth-child(${i}) p`).html().toLowerCase());
            }
        }

        // hide product if at least one size doesn't match active size filter
        for (let i = 1; i <= shopSize; i++) {
            if (activeBrandFilters.length > 0) {
                let productBrand = $(`.shop-grid .shop-product:nth-child(${i})`).attr("data-product-brand").toLowerCase()
                if (!activeBrandFilters.includes(productBrand)) {
                    $(`.shop-grid .shop-product:nth-child(${i})`).addClass("filter-hide-brand");
                }
            }
        }
    }


    if (filterType === "type") {
        let filterTypeCount = $("#filter-type li").length
        let activeTypeFilters = [];
        $(`.shop-grid .shop-product`).removeClass("filter-hide-type");

        // Get all active filter sizes
        for (let i = 1; i <= filterTypeCount; i++) {
            if ($(`#filter-type li:nth-child(${i})`).hasClass("active")) {
                activeTypeFilters.push($(`#filter-type li:nth-child(${i}) p`).html().toLowerCase());
            }
        }

        // hide product if at least one size doesn't match active size filter
        for (let i = 1; i <= shopSize; i++) {
            if (activeTypeFilters.length > 0) {
                let productType = $(`.shop-grid .shop-product:nth-child(${i})`).attr("data-product-type").toLowerCase();
                if (!activeTypeFilters.includes(productType)) {
                    $(`.shop-grid .shop-product:nth-child(${i})`).addClass("filter-hide-type");
                }
            }
        }

    }


    if (filterType === "price") {
        if ($("#filter-price-min").val() === "" || $("#filter-price-max").val() === "") {
            alert("Please enter a valid price to filter")
        } else {
            const priceMin = $("#filter-price-min").val();
            const priceMax = $("#filter-price-max").val();


            // hide product if at least one size doesn't match active size filter
            for (let i = 1; i <= shopSize; i++) {
                let productPrice = parseInt($(`.shop-grid .shop-product:nth-child(${i})`).attr("data-product-price"));
                if (productPrice < priceMin || productPrice > priceMax) {
                    $(`.shop-grid .shop-product:nth-child(${i})`).addClass("filter-hide-price");
                }
            }
        }
    }

}


// PRODUCTS UI


// Toggle Product Size & Price
$(document).on("click", ".product-sizes span", function () {

    // Toggle Product Size CLass
    $(".product-sizes span").removeClass("active");
    $(this).addClass("active");

    // Product Size Price Adjust
    let price = parseInt($(this).attr("data-size-price"));
    $(".product-price span").html(price);
    $(".product-quant span").html(1);
});


// Product Page Quantity Change
$(document).on("click", ".product-info .product-quant .quant-minus", function () {
    let quantity = parseInt($(this).next().html());
    if (quantity !== 1) {
        quantity--;
    }
    $(this).next().html(quantity);

    // Adjust Price for Quantity
    let price = parseInt($(".product-info .product-sizes span.active").attr("data-size-price"));
    $(".product-info .product-price span").html(price * quantity);
});

$(document).on("click", ".product-info .product-quant .quant-plus", function () {
    let quantity = parseInt($(this).prev().html());
    quantity++;
    $(this).prev().html(quantity);

    // Adjust Price for Quantity
    let price = parseInt($(".product-info .product-sizes span.active").attr("data-size-price"));
    $(".product-info .product-price span").html(price * quantity);
});

$(".notify-cart .my-button-alt").click(() => {
    $(".notify-cart").removeClass("open")
});