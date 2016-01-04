Template.topNavbar.rendered = function(){

    // FIXED TOP NAVBAR OPTION
    // Uncomment this if you want to have fixed top navbar
    // $('body').addClass('fixed-nav');
    // $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');

    // i18n

    $.i18n.init({
        resGetPath: 'locales/__lng__.json',
        load: 'unspecific',
        fallbackLng: false,
        lng: 'ru'
    }, function (t){
        $('.i18container').i18n();
        $('#side-menu').i18n();
        $('.navbar-top-links').i18n();
    });


    $('.set_en a').on('click', function (){
        i18n.setLng('en', function(){
            $('.i18container').i18n();
            $('#side-menu').i18n();
            $('.navbar-top-links').i18n();

            $('.set_en').addClass('active');
            $('.set_ru').removeClass('active');
        });
    });

    $('.set_ru a').on('click', function (){
        i18n.setLng('ru', function(){
            $('.i18container').i18n();
            $('#side-menu').i18n();
            $('.navbar-top-links').i18n();

            $('.set_ru').addClass('active');
            $('.set_en').removeClass('active');
        });
    });

};

Template.topNavbar.events({

    // Toggle left navigation
    'click #navbar-minimalize': function(event){

        event.preventDefault();

        // Toggle special class
        $("body").toggleClass("mini-navbar");

        // Enable smoothly hide/show menu
        if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
            // Hide menu in order to smoothly turn on when maximize menu
            $('#side-menu').hide();
            // For smoothly turn on menu
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(400);
                }, 200);
        } else if ($('body').hasClass('fixed-sidebar')) {
            $('#side-menu').hide();
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(400);
                }, 200);
        } else {
            // Remove all inline style from jquery fadeIn function to reset menu state
            $('#side-menu').removeAttr('style');
        }
    },

    // Toggle right sidebar
    'click .right-sidebar-toggle': function(){
        $('#right-sidebar').toggleClass('sidebar-open');
    }
});
