var EDITING_KEY = 'EDITING_PRODUCT_ID';

// Track if this is the first time the list template is rendered
var firstRender = true;
var listRenderHold = LaunchScreen.hold();
listFadeInHold = null;

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Template.products.onRendered(function() {
    if (firstRender) {
        // Released in loyout
        listFadeInHold = LaunchScreen.hold();

        // Handle for launch screen defined in loyout
        listRenderHold.release();

        firstRender = false;
    }
    Session.set(EDITING_KEY, 'new');
});

Template.products.helpers({
    title: function () {
        return TAPi18n.__('products.title');
    },
    products: function () {
        return Products.find();
    },
    productsReady: function() {
        return Router.current().productsHandle.ready();
    }
});

var animateNew = function() {
    $('#product_new').removeClass('hidden').addClass("animated").addClass("fadeInDown");
    $('.js-new-product').addClass("animated").addClass("fadeOutDown");
    setTimeout(function() {
        $('#product_new').removeClass("animated").removeClass("fadeInDown");
        $('.js-new-product').removeClass("animated").removeClass("fadeOutDown").addClass('hidden');
        $('#product_new').find("[name=name]").first().focus();
    }, 500);
};

Template.products.events({

    'click .js-new-product': function() {
        animateNew();
    },

    'click .js-collapse-link': function (event) {
        var element = $(event.target);
        var ibox = element.closest('div.ibox');
        var button = element.closest("i");
        var content = ibox.find('div.ibox-content');
        content.slideToggle(200);
        button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
        setTimeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    }
});