var STATUS_KEY = 'PROJECT_STATUS';

Template.projectForm.helpers({
    statusItems: ['new', 'pending', 'active']
});

var submitProject = function(event, template) {
    var name = template.$('[name=name]').val();
    if (!name) return;
    Projects.insert({
        name: name,
        about: template.$('[name="about"]').val(),
        description: template.$('[name="description"]').val(),
        status: Session.get(STATUS_KEY),
        createdAt: new Date()
    });
    animateSubmit(event, template);
};

var clearNewForm = function(event, template) {
    template.$('[name="name"]').val('');
    template.$('[name="about"]').val('');
    template.$('[name="description"]').val('');
    Session.set(STATUS_KEY, 'new');
};

var animateSubmit = function(event, template) {
    $('#new-project').addClass("animated").addClass("bounceOut");
    $('.js-new-project').removeClass('hidden').addClass("animated").addClass("fadeInUp");
    setTimeout(function() {
        $('#new-project').removeClass("animated").removeClass("bounceOut").addClass('hidden');
        $('.js-new-project').removeClass("animated").removeClass("fadeInUp");
        clearNewForm(event, template);
    }, 500);
};

var animateCancel = function(event, template) {
    $('#new-project').addClass("animated").addClass("fadeOutUp");
    $('.js-new-project').removeClass('hidden').addClass("animated").addClass("fadeInUp");
    setTimeout(function() {
        $('#new-project').removeClass("animated").removeClass("fadeOutUp").addClass('hidden');
        $('.js-new-project').removeClass("animated").removeClass("fadeInUp");
        clearNewForm(event, template);
    }, 500);
};

Template.projectForm.events({
    'submit .js-project-form': function (event, template) {
        event.preventDefault();
        submitProject(event, template);
    },

    'click .js-submit': function (event, template) {
        //event.preventDefault();
        submitProject(event, template);
    },

    'click .js-close-new': function(event, template) {
        event.preventDefault();
        animateCancel(event, template);
    },

    'keydown .js-project-form': function(event) {
        // ESC or ENTER
        if (27 === event.which || event.which === 13) {
            event.preventDefault();
            $(event.target).blur();
        }
    }
});

Template.projectForm.rendered = function() {
    $(".js-project-form").validate({
        rules: {
            name: {
                required: true
            }
        },
        errorPlacement: function(error, element) {
            if (element.attr("name") == "name" )
                error.insertAfter(".name-label");
            else
                error.insertAfter(element);
        }
    })
};