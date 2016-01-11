Template.tasksTopNavbar.rendered = function(){

    // FIXED TOP NAVBAR OPTION
    // Uncomment this if you want to have fixed top navbar
    // $('body').addClass('fixed-nav');
    // $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');

    // i18n
    $('.set_en a').on('click', function (){
        TAPi18n.setLanguage('en');
    });

    $('.set_ru a').on('click', function (){
        TAPi18n.setLanguage('ru');
    });

};

Template.tasksTopNavbar.events({

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
    },

    'click .js-logout': function() {
        Meteor.logout();
        // if we are on a private list, we'll need to go to a public one
        var current = Router.current();
        if (current.route.name === 'taskLists' && current.data().userId) {
            Router.go('taskLists', TaskLists.findOne({userId: {$exists: false}}));
        }
    }
});