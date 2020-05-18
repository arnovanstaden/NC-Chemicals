// GET PRODUCTS DATA

// Insert Products in Shop
const loadShopProducts = () => {
    axios.get(`${api_url}/products`)
        .then(response => {
            products = response.data;

            products.forEach(product => {
                if (product.visibility) {
                    priceKeys = Object.keys(product.prices);
                    $(".shop-grid .row").append(
                        `
                    <a class="shop-product col-sm-6 col-md-4 col-lg-4" href="./product.html#${product.code}" data-product-category="${product.category}" data-product-sizes="${priceKeys}" data-product-price="${product.prices[priceKeys[0]]}"
                    ">
                        <img class="shop-product-image" src="${product.productThumbnailUrl}" alt="">
                        <h5 class="shop-product-name">
                            ${product.name}
                        </h5>
                        <p class="shop-product-price">
                            R ${priceKeys.length > 1 ? product.prices[priceKeys[0]] + " - R" + product.prices[priceKeys[priceKeys.length-1]] : product.prices[priceKeys[0]]}
                        </p>
                    </a>
                `
                    )
                }
            });
            hideLoader();
            initPriceSlider();
            loadFilterPrice();
            loadNavSearch();
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

            if (product !== undefined && product.visibility) {
                // Insert Product Details
                document.title = product.name;
                $(".product-container").attr("data-product-code", product.code)
                $(".product-info .product-category").html(product.category)
                $(".product-info .product-name").html(product.name)
                $(".product-info .product-description").html(product.description);
                $(".product-image img").attr("src", product.productImageUrls[0]);

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


// Load Home Products
const loadHomeProducts = () => {
    axios.get(`${api_url}/products`)
        .then(response => {
            products = response.data;

            products.forEach(product => {
                priceKeys = Object.keys(product.prices)
                if (product.home && product.visibility) {
                    $(".home-products-grid").append(
                        `
                    <a class="shop-product col-sm-6 col-md-3 col-lg-3" href="./product.html#${product.code}" data-product-category="${product.category}" data-product-sizes="${priceKeys}" data-product-price="${product.prices[priceKeys[0]]}"
                    ">
                        <img class="shop-product-image" src="./assets/images/products/t1.png " alt="">
                        <h5 class="shop-product-name">
                            ${product.name}
                        </h5>
                        <p class="shop-product-price">
                            R ${product.prices[priceKeys[0]]} - R ${product.prices[priceKeys[priceKeys.length-1]]}
                        </p>
                    </a>
                `
                    )
                }
            });
            hideLoader();
        })
        .catch(err => console.log(err));
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