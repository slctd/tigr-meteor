var STATUS_KEY = 'new';

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Template.newProject.helpers({
    statusLabel: function () {
        return Session.get(STATUS_KEY).capitalizeFirstLetter();
    },
    statusClass: function() {
        switch (Session.get(STATUS_KEY)) {
            case 'new':
                return 'label label-info';
            case 'active':
                return 'label label-primary';
            case 'pending':
                return 'label label-warning';
            default:
                return 'label label-info';
        }
    },
    status: function () {
        return Session.get(STATUS_KEY);
    }
});

var submitProject = function(project, template) {
    var name = template.$('[name=name]').val();
    if (!name) return; //TODO: add form validation
    Projects.insert({
        name: name,
        about: template.$('[name="about"]').val(),
        description: template.$('[name="description"]').val(),
        status: Session.get(STATUS_KEY),
        createdAt: new Date()
    });
    animateSubmit(project, template);
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

Template.newProject.events({
    'submit .js-new-form, click .js-save': function (project, template) {
        project.preventDefault();
        submitProject(project, template);
    },

    'click .js-close-new': function(event, template) {
        event.preventDefault();
        animateCancel(event, template);
    },

    'click .js-status-switch': function(event) {
        event.preventDefault();
        var status = $(event.target).data('status');
        Session.set(STATUS_KEY, status);
    }
});