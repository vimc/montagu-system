$('.submenu-btn').on("mouseover", function () {
    $(this).next(".dropdown-menu").addClass("show")
});

$('.submenu .dropdown-item').on("click", function () {
    var touchstone = $(this).parent().parent().find(".submenu-btn").text();
    $('#current').text(touchstone + " | " + $(this).text());

    if (touchstone === "Experimental touchstone" || $(this).text().indexOf("finished")> -1){
        $('.alert').show();
        $(".upload").hide();
    }
    else{
        $('.alert').hide();
        $(".upload").show();
    }
});

$('#yf').on("click", function() {

    $('#current-disease').text("Yellow Fever (YF)")
    $('#hepb').removeClass("active")
    $(this).addClass("active")
});

$('#hepb').on("click", function() {

    $('#current-disease').text("Hepatitis B (HepB)")
    $('#yf').removeClass("active")

    $(this).addClass("active")
});