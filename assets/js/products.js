// Handling any product related logic


// Insert Products in Shop
const loadShopProducts = () => {
    axios.get("./assets/js/products.json")
        .then(response => {
            products = response.data;

            products.forEach(product => {
                priceKeys = Object.keys(product.prices)
                $(".shop-grid .row").append(
                    `
                <a class="shop-product col-md-4" href="./product.html#${product.code}">
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
            })
        })
        .catch(err => console.log(err));
}

// Find product by Code
async function findProduct(productCode) {

    let promise = new Promise((resolve, reject) => {
        axios.get("./assets/js/products.json")
            .then(response => {
                products = response.data;
                let productFound = products.find(product => product.code === productCode);
                if (productFound !== undefined) {
                    resolve(products[products.indexOf(productFound)]);
                } else {
                    return undefined
                }
            })
            .catch(err => console.log(err));
    })

    let product = await promise;
    return product
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
    findProduct(productCode).then(result => {
        product = result;

        // Insert Product Details
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
    });
}