$(window).scroll(function() {
    
    $('#header').addClass('header-scrolled');
    $('#topbar').addClass('topbar-scrolled');
    
});

if ($(window).scrollTop() == 0) {
    $('#header').addClass('header-scrolled');
    $('#topbar').addClass('topbar-scrolled');
}