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
                <a class="shop-product col-sm-6 col-md-4 col-lg-4" href="./product.html#${product.code}" data-product-category="${product.category}" data-product-sizes="${priceKeys}" data-product-price="${product.prices[priceKeys[0]]}"
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
            hideLoader();
            loadFilterPrice();
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

            hideLoader()
        });
}

// Load Search
// const loadNavSearch = () => {
//     // Get Search Term
//     let searchTerm = window.location.href;
//     if (searchTerm.includes("?") > 0) {
//         searchTerm = searchTerm.slice(searchTerm.indexOf("?") + 1).toLocaleLowerCase();
//     } else {
//         searchTerm = null;
//     }

//     // {Find products who's product tags match ~ searchterm}
//     if (searchTerm !== null) {
//         let shopSize = $(".shop-grid .shop-product").length;
//         let resultsCount = 0;
//         // Loop through every product to & hide non-results
//         for (i = 1; i <= shopSize; i++) {

//             const productTags = $(`.shop-product-grid a:nth-child(${i}) template`).attr("data-product-tags").toLowerCase();
//             // Load Results
//             if (!productTags.includes(searchTerm)) {
//                 $(`.shop-product-grid a:nth-child(${i})`).addClass("filter-hide-search")
//             } else {
//                 resultsCount++
//             }
//         }
//         // Check for no results
//         if (resultsCount == 0) {
//             $(`.shop-product-grid`).hide()
//             $(`.shop-products-noresults`).fadeIn()
//         }
//     }


//     // (Insert searchterm in filters)
//     if (searchTerm != null) {
//         $(".card-search").css("display", "flex");
//         $(".card-search input").val(`-  "${searchTerm}"`);
//     } else {
//         $(".card-search").hide();
//     }
// }

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
}


// PRODUCTS UI


// Toggle Product Size & Price
$(document).on("click", ".product-sizes span", function () {

    // Toggle Product Size Class
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


// Shop price filter

const loadFilterPrice = () => {
    // Get min max
    let shopSize = $(".shop-grid .shop-product").length;
    let minPrice = 0;
    let maxPrice = 0;
    let currentPrice = 0;
    let priceRange = [];

    for (i = 1; i <= shopSize; i++) {
        currentPrice = parseInt($(`.shop-grid .row .shop-product:nth-child(${i})`).attr("data-product-price"));
        priceRange.push(currentPrice);
        priceRange.sort(function (a, b) {
            return a - b
        });
    }

    minPrice = priceRange[0];
    maxPrice = priceRange[priceRange.length - 1];
    $(".price-filter-min").attr("min", minPrice);
    $(".price-filter-min").attr("max", maxPrice);
    $(".price-filter-max").attr("min", minPrice);
    $(".price-filter-max").attr("max", maxPrice);
    $(".price-filter-min").val(minPrice);
    $(".price-filter-max").val(maxPrice);

    $(".minPriceLabel").html(`R ${minPrice}`);
    $(".maxPriceLabel").html(`R ${maxPrice}`);

}

$(".price-filter-min, .price-filter-max").change(function () {
    console.log($(this).val());
    minPrice = $(".price-filter-min").val();
    maxPrice = $(".price-filter-max").val();
    $(".minPriceLabel").html(`R ${minPrice}`);
    $(".maxPriceLabel").html(`R ${maxPrice}`);
    adjustFilterPrice(minPrice, maxPrice);
});

const adjustFilterPrice = (minPrice, maxPrice) => {
    let shopSize = $(".shop-grid .shop-product").length;
    for (i = 1; i <= shopSize; i++) {
        currentPriceToFilter = parseInt($(`.shop-grid .row .shop-product:nth-child(${i})`).attr("data-product-price"));
        console.log(currentPriceToFilter)
        if (currentPriceToFilter > maxPrice || currentPriceToFilter < minPrice) {
            $(`.shop-grid .row .shop-product:nth-child(${i})`).addClass("filter-hide-price")
        } else {
            $(`.shop-grid .row .shop-product:nth-child(${i})`).removeClass("filter-hide-price")
        }
    }
}