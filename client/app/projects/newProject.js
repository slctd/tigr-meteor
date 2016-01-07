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

var saveProject = function(project, template) {
    var name = template.$('[name=name]').val();
    if (!name) return;
    Projects.insert({
        name: name,
        about: template.$('[name="about"]').val(),
        description: template.$('[name="description"]').val(),
        status: Session.get(STATUS_KEY),
        createdAt: new Date()
    });
};

var clearNew = function(event, template) {
    template.$('[name="name"]').val('');
    template.$('[name="about"]').val('');
    template.$('[name="description"]').val('');
    Session.set(STATUS_KEY, 'new');
    $('#new-project').addClass('hidden');
    $('.js-new-project').removeClass('hidden');
};

Template.newProject.events({
    'submit .js-new-form, click .js-save': function (project, template) {
        project.preventDefault();
        saveProject(project, template);
        clearNew(project, template);
    },

    'click .js-close-new': function(event, template) {
        event.preventDefault();
        clearNew(event, template);
    },

    'click .js-status-switch': function(event) {
        event.preventDefault();
        var status = $(event.target).data('status');
        Session.set(STATUS_KEY, status);
    }
});