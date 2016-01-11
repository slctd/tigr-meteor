var EDITING_KEY = 'EDITING_PRODUCT_ID';

Template.productForm.helpers({
    newProduct: function() {
        return Session.get(EDITING_KEY) === 'new'
    }
});

var validateProduct = function(form) {
    form.validate({
        rules: {
            name: {
                required: true
            }
        },
        errorPlacement: function (error, element) {
            if (element.attr("name") == "name")
                error.insertAfter(".name-label");
            else
                error.insertAfter(element);
        }
    });
};

var submitProduct = function(event, template) {
    var name = template.$('[name=name]').val();
    if (!name) return;
    Products.insert({
        name: name,
        about: template.$('[name="about"]').val(),
        price: template.$('[name="price"]').val(),
        category: template.$('[name="category"]').val(),
        image: template.$('[name="image"]').val(),
        createdAt: new Date()
    });
    animateSubmit(event, template);
};

var resetForm = function(event, template) {
    template.$('[name="name"]').val('');
    template.$('[name="about"]').val('');
    template.$('[name="price"]').val('');
    template.$('[name="category"]').val('');
    template.$('[name="image"]').val('');
    Session.set(STATUS_KEY, 'new');
    Session.set(EDITING_KEY, 'new');
};

var animateSubmit = function(event, template) {
    $('#product_new').addClass("animated").addClass("bounceOut");
    $('.js-new-product').removeClass('hidden').addClass("animated").addClass("fadeInUp");
    setTimeout(function() {
        $('#product_new').removeClass("animated").removeClass("bounceOut").addClass('hidden');
        $('.js-new-product').removeClass("animated").removeClass("fadeInUp");
        resetForm(event, template);
    }, 500);
};

var animateCloseNewForm = function(event, template) {
    $('#product_new').addClass("animated").addClass("fadeOutUp");
    $('.js-new-product').removeClass('hidden').addClass("animated").addClass("fadeInUp");
    setTimeout(function() {
        $('#product_new').removeClass("animated").removeClass("fadeOutUp").addClass('hidden');
        $('.js-new-product').removeClass("animated").removeClass("fadeInUp");
        resetForm(event, template);
    }, 500);
};

var animateCloseEditForm = function(product) {
    var panel = $('#product_' + product._id);
    panel.addClass("animated").addClass("flipInY");
    setTimeout(function() {
        panel.removeClass("animated").removeClass("flipInY");
    }, 1000);
    Session.set(EDITING_KEY, 'new');
    Session.set(STATUS_KEY, 'new');
};

var saveProduct = function(product, template) {
    var name = template.$('[name=name]').val();
    if (!name) return;
    Products.update(product._id, {$set: {
        name: name,
        about: template.$('[name="about"]').val(),
        price: template.$('[name="price"]').val(),
        category: template.$('[name="category"]').val(),
        image: template.$('[name="image"]').val()
    }});
    animateCloseEditForm(product, template);
};

var saveAction = function(event, template, product) {
    if(Session.get(EDITING_KEY) === 'new') {
        submitProduct(event, template);
    } else if(Session.get(EDITING_KEY)) {
        saveProduct(product, template);
    }
};

Template.productForm.events({
    'submit .js-product-form': function (event, template) {
        event.preventDefault();
        saveAction(event, template, this);
    },

    'click .js-save': function (event, template) {
        validateProduct(template);
    },

    'click .js-cancel': function(event, template) {
        if(Session.get(EDITING_KEY) === 'new') {
            animateCloseNewForm(event, template);
        } else if(Session.get(EDITING_KEY)) {
            animateCloseEditForm(this, template);
        }

    },

    'keydown .js-product-form': function(event) {
        // ESC or ENTER
        if (27 === event.which || event.which === 13) {
            event.preventDefault();
            $(event.target).blur();
        }
    }
});

Template.productForm.rendered = function() {
    var form = $("#product_" + Session.get(EDITING_KEY) + ' .js-product-form');
    validateProduct(form);
};