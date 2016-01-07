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

Template.newProject.events({
    'submit #new-project': function (event) {
        event.preventDefault();

        var name = $(event.target).find('[name=name]');
        var about = $(event.target).find('[name=about]');
        var description = $(event.target).find('[name=description]');
        if (!name.val())
            return;

        Projects.insert({
            name: name.val(),
            about: about.val(),
            description: description.val(),
            status: Session.get(STATUS_KEY),
            createdAt: new Date()
        });
        name.val('');
        about.val('');
        description.val('');
        Session.set(STATUS_KEY, 'new');
    },

    'click .js-close-new': function(event) {
        event.preventDefault();
        $('#new-project').addClass('hidden');
        $('#new-project').find('[name=name]').val('');
        $('#new-project').find('[name=about]').val('');
        $('#new-project').find('[name=description]').val('');
        Session.set(STATUS_KEY, 'new');
        $('.js-new-project').removeClass('hidden')
    },

    'click .js-status-switch': function(event) {
        event.preventDefault();
        var status = $(event.target).data('status');
        Session.set(STATUS_KEY, status);
    }
});