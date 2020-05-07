// Animation

// Filter Size Check Boxes
$(".card-filter-size .custom-check").click(function () {
    $(this).find("i").toggle()
});

// Sort Dropdown
$("#shop-settings-sort").click(() => {
    $("#shop-settings-sort-dropdown").toggleClass("open")
})