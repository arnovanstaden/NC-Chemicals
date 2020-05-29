const api_url = "https://nc-chemicals-backend.herokuapp.com";

// GENERAL
$(document).ready(() => {
    updateCartCount();
})

// Navbar 

$(".nav-menu-toggle, .nav-menu-body-hide").click(() => {
    $(".nav-menu").toggleClass("open")
    $(".nav-menu-body-hide").toggleClass("open")
    $("html").toggleClass("disabled")
})

// Search
$(".nav-search").click(() => {
    $(".search-modal").toggleClass("open");
    $("html").toggleClass("disabled");
    $(".search-content input").focus();
});

$(".nav-menu .nav-search").click(() => {
    $(".nav-menu").toggleClass("open");
    $(".nav-menu-body-hide").toggleClass("open");
    $("html").toggleClass("disabled")
    $(".search-content input").focus();
})

$(".search-inner, .search-close").click(() => {
    $(".search-modal").toggleClass("open");
    $("html").toggleClass("disabled")
});

$(".search-modal button").click(function () {
    event.preventDefault()
    navSearch();
});

$("#search-card .card-body i").click(() => {
    location.replace("./shop.html")
})

const navSearch = () => {
    const searchTerm = $(".search-content input").val();
    location.replace(`./shop.html?${searchTerm}`);
}

// Load Search
const loadNavSearch = () => {
    // Get Search Term
    let searchTerm = window.location.href;
    if (searchTerm.includes("?") > 0) {
        searchTerm = searchTerm.slice(searchTerm.indexOf("?") + 1).toLocaleLowerCase();
    } else {
        searchTerm = null;
    }
    // {Find products who's name matches ~ searchterm}
    if (searchTerm !== null) {
        let shopSize = $(".shop-grid .shop-product").length;
        let resultsCount = 0;
        // Loop through every product to & hide non-results
        for (i = 1; i <= shopSize; i++) {
            const productName = $(`.shop-grid .shop-product:nth-child(${i}) .shop-product-name`).html().toLowerCase();
            // Load Results
            if (!productName.includes(searchTerm)) {
                $(`.shop-grid .shop-product:nth-child(${i})`).addClass("filter-hide-search");
            } else {
                resultsCount++
            }
        }
        // Check for no results
        if (resultsCount == 0) {
            $(`.shop-grid`).hide()
            $(`.shop-noresults`).addClass("show")
        }
    }
    // (Insert searchterm in filters)
    if (searchTerm !== null) {
        $("#search-card").css("display", "block");
        $("#search-card .card-body p").html(`-  "${searchTerm}"`);
    } else {
        $(".card-search").hide();
    }
}




// Loader

const hideLoader = () => {
    $(".loader").fadeOut();
}

//------------------

// SHOP PAGE

// SORT

// Sort Dropdown
$("#shop-settings-sort").click(() => {
    $("#shop-settings-sort-dropdown").toggleClass("open")
});


// FILTER

// Filter Check Boxes
$(".card-filter-check li").click(function () {
    $(this).toggleClass("active");
    $(this).find("i").toggleClass("active");

    if ($(this).closest(".card-filter-check").attr("id") === "card-filter-categories") {
        filterProducts("category")
    } else {
        filterProducts("size")
    }
});


const filterProducts = (filterType) => {
    let shopSize = $(".shop-grid .shop-product").length;

    if (filterType === "category") {
        let filterCategoryCount = $("#card-filter-categories li").length
        let activeCategoryFilters = [];
        $(`.shop-grid .shop-product`).removeClass("filter-hide-category");

        // Get all active filter sizes
        for (let i = 1; i <= filterCategoryCount; i++) {
            if ($(`#card-filter-categories li:nth-child(${i})`).hasClass("active")) {
                activeCategoryFilters.push($(`#card-filter-categories li:nth-child(${i}) p`).html().toLowerCase());
            }
        }

        // hide product if at least one size doesn't match active filter
        if (activeCategoryFilters.length > 0) {
            for (let i = 1; i <= shopSize; i++) {
                let matching = [];
                let productCategory = $(`.shop-grid .shop-product:nth-child(${i})`).attr("data-product-category").toLowerCase();
                for (j = 0; j < activeCategoryFilters.length; j++) {
                    if (productCategory.includes(activeCategoryFilters[j])) {
                        matching.push(activeCategoryFilters[j]);
                    }
                }
                if (matching.length < 1) {
                    $(`.shop-grid .shop-product:nth-child(${i})`).addClass("filter-hide-category");
                }
            }
        }
    }


    if (filterType === "size") {
        let filterSizeCount = $("#card-filter-size li").length
        let activeSizeFilters = [];
        $(`.shop-grid .shop-product`).removeClass("filter-hide-size");

        // Get all active filter sizes
        for (let i = 1; i <= filterSizeCount; i++) {
            if ($(`#card-filter-size li:nth-child(${i})`).hasClass("active")) {
                activeSizeFilters.push($(`#card-filter-size li:nth-child(${i}) p`).html());
            }
        }

        // hide product if at least one size doesn't match active filter
        if (activeSizeFilters.length > 0) {
            for (let i = 1; i <= shopSize; i++) {
                let matching = [];
                let productSizes = $(`.shop-grid .shop-product:nth-child(${i})`).attr("data-product-sizes");
                for (j = 0; j < activeSizeFilters.length; j++) {
                    if (productSizes.includes(activeSizeFilters[j])) {
                        matching.push(activeSizeFilters[j]);
                    }
                }
                if (matching.length < 1) {
                    $(`.shop-grid .shop-product:nth-child(${i})`).addClass("filter-hide-size");
                }
            }
        }
    }
}

// Price Slider Init
const initPriceSlider = () => {
    var lowerSlider = document.querySelector('#lower'),
        upperSlider = document.querySelector('#upper'),
        lowerVal = parseInt(lowerSlider.value);
    upperVal = parseInt(upperSlider.value);

    upperSlider.oninput = function () {
        lowerVal = parseInt(lowerSlider.value);
        upperVal = parseInt(upperSlider.value);

        if (upperVal < lowerVal + 4) {
            lowerSlider.value = upperVal - 4;

            if (lowerVal == lowerSlider.min) {
                upperSlider.value = 4;
            }
        }
    };

    lowerSlider.oninput = function () {
        lowerVal = parseInt(lowerSlider.value);
        upperVal = parseInt(upperSlider.value);

        if (lowerVal > upperVal - 4) {
            upperSlider.value = lowerVal + 4;

            if (upperVal == upperSlider.max) {
                lowerSlider.value = parseInt(upperSlider.max) - 4;
            }

        }
    };

    const rangeWidth = $(".shop-filter").width();
    $(".multi-range input[type=range]").width(rangeWidth * 0.80)
}

// Filter Prices

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
        if (currentPriceToFilter > maxPrice || currentPriceToFilter < minPrice) {
            $(`.shop-grid .row .shop-product:nth-child(${i})`).addClass("filter-hide-price")
        } else {
            $(`.shop-grid .row .shop-product:nth-child(${i})`).removeClass("filter-hide-price")
        }
    }
}


// remove Filters

$(".card-header>i").click(function () {
    let type = $(this).attr("id").replace("remove-", "");
    removeFilter(type)
});

const removeFilter = (type) => {
    switch (type) {
        case "categories":
            $("#card-filter-categories li").removeClass("active");
            $("#card-filter-categories li i").removeClass("active");
            $(".shop-product").removeClass("filter-hide-category")
            break;
        case "sizes": {
            $("#card-filter-size li").removeClass("active");
            $("#card-filter-size li i").removeClass("active");
            $(".shop-product").removeClass("filter-hide-size")
            break;
        }
        case "prices": {
            loadFilterPrice();
            $(".shop-product").removeClass("filter-hide-price")
            break;
        }
        default:
            break;
    }
}





// -------------------

// Footer Insert
$("footer").html(
    `
    <div class="container">
            <div class="row">
                <div class="col-md-6 footer-text">
                    <h4>NC Chemicals</h4>
                    <p>NC Chemicals is an industry leader in the production of high-quality industrial, household &
                        automotive chemical products.
                    </p>
                    <span>© Copryright 2020 - NC Chemicals Group (PTY) LTD.</span>
                    <span>Design & Developed by <a target="blank"
                            href="http://www.webdacity.co.za/">Webdacity</a></span>
                </div>
                <div class="col-md-3 footer-links">
                    <h6>About Us</h6>
                    <ul>
                        <li>
                            <a href="./about.html">Our Story</a>
                        </li>
                        <li>
                            <a href="./about.html">Our Guarantee</a>
                        </li>
                        <li>
                            <a href="./contact.html">Contact Us</a>
                        </li>
                    </ul>
                </div>
                <div class="col-md-3 footer-contact">
                    <h6>Get in Touch</h6>
                    <div class="footer-social">
                        <a href="">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a href="">
                            <i class="fab fa-twitter"></i>
                        </a>
                    </div>
                    <div class="divider"></div>
                    <ul>
                        <li>
                            <a href="mailto:">info@ncchemicals.co.za</a>
                        </li>
                        <li>
                            <a href="tel:0829014983">082 901 4983</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="footer-copy">

            </div>
        </div>`
)



// Wake Server
if (window.location.pathname === "/index.html" || window.location.pathname === "/") {
    axios({
            method: "get",
            url: api_url
        })
        .then()
        .catch(err => console.log(err))
}