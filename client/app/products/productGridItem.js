var EDITING_KEY = 'EDITING_PRODUCT_ID';

Template.productsGridItem.helpers({
    editing: function() {
        return (Session.get(EDITING_KEY) === this._id.toString()) ? true : false;
    },
    productClass: function() {
        return (Session.get(EDITING_KEY) === this._id.toString()) ? 'col-md-6' : 'col-md-3';
    },
    priceFormatted: function() {
        return '$' + this.price;
    },
    id: function() {
        return this._id;
    },
    product: function() {
        return this;
    }
});

var animateOpenEditForm = function(product, template) {
    var panel = template.$('#product_' + product._id);
    panel.addClass("animated").addClass("flipInY");
    setTimeout(function() {
        panel.removeClass("animated").removeClass("flipInY");
        template.find('.js-product-form input[name="name"]').focus();
    }, 1000);
};

var editProduct = function(product, template) {
    // force the template to redraw based on the reactive change
    Tracker.flush();

    Session.set(EDITING_KEY, product._id);
    animateOpenEditForm(product, template);
};

var deleteProduct = function(product) {
    // ensure the last public product cannot be deleted.
    if (! product.userId && Products.find({userId: {$exists: false}}).count() === 1) {
        swal({
            title: "Can't delete",
            text: "Sorry, you cannot delete the final public product!",
            type: "info",
            confirmButtonText: "OK, I see",
            closeOnConfirm: true
        });
    } else {
        return swal({
                title: "Are you sure?",
                text: "Are you sure you want to delete the product " + product.name + "?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: true },
            function (isConfirm) {
                if (isConfirm) {
                    Products.remove(product._id);
                    swal("Deleted!", "Your product has been deleted.", "success");
                    return true;
                } else {
                    return false;
                }
            });
    }
};

Template.productsGridItem.events({
    'click .js-edit-product': function(event, template) {
        editProduct(this, template);
    },

    'click .js-delete-product': function(event, template) {
        deleteProduct(this, template);
    }
});

Template.productsGridItem.rendered = function() {
    // i18n

    $.i18n.init({
        resGetPath: 'locales/__lng__.json',
        load: 'unspecific',
        fallbackLng: false,
        lng: 'ru'
    }, function (t){
        $('.ibox').i18n();
    });
};