Template.projects.events({
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
            status: 'new',
            createdAt: new Date()
        });
        name.val('');
        about.val('');
        description.val('');
    },

    'click .js-close-new': function() {
        $('#new-project').addClass('hidden');
        $('.js-new-project').removeClass('hidden')
    },

    'click .js-status-active': function(event, template) {
        statusToggle(this, template, 'active');
    },

    'click .js-status-suspended': function(event, template) {
        statusToggle(this, template, 'suspended');
    },

    'click .js-status-closed': function(event, template) {
        statusToggle(this, template, 'closed');
    }
});