$('.toggle').on('click', function () {
    $('.container').stop().addClass('active');
    document.getElementById("toggle").style.display = "inline-block";
    document.title = "Register - GeoShare";
});

$('.close').on('click', function () {
    $('.container').stop().removeClass('active');
    document.getElementById("toggle").style.display = "none";
    document.title = "Login - GeoShare";
});