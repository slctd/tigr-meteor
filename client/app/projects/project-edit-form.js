var EDITING_KEY = 'EDITING_PROJECT_ID';
var STATUS_KEY = 'PROJECT_STATUS';

Template.projectEditForm.helpers({
    statusClass: function() {
        switch (this.status) {
            case 'new':
                return 'label label-info';
            case 'pending':
                return 'label label-warning';
            case 'active':
                return 'label label-primary';
            case 'suspended':
                return 'label label-warning';
            case 'closed':
                return 'label label-default';
            default:
                return 'label label-info';
        }
    },
    statusLabel: function() {
        return this.status.capitalizeFirstLetter();
    },
    statusItems: ['active', 'suspended', 'closed'],
    id: function() {
        return Session.get(EDITING_KEY);
    }
});

var animateSwitch = function(project, template) {
    var panel = template.$('#project_' + project._id);
    panel.addClass("animated").addClass("flipInY");
    setTimeout(function() {
        panel.removeClass("animated").removeClass("flipInY");
    }, 1500);
};

var saveProject = function(project, template) {
    var name = template.$('[name=name]').val();
    if (!name) return;
    Projects.update(project._id, {$set: {
        name: name,
        about: template.$('[name="about"]').val(),
        description: template.$('[name="description"]').val(),
        status: Session.get(STATUS_KEY)
    }});
    animateSwitch(project, template);
    Session.set(EDITING_KEY, false);
};

var cancel = function(project, template) {
    animateSwitch(project, template);
    Session.set(EDITING_KEY, false);
};

Template.projectEditForm.events({
    'click .js-cancel': function(event, template) {
        cancel(this, template);
    },

    'keydown input[name=name]': function(event) {
        // ESC or ENTER
        if (27 === event.which || event.which === 13) {
            event.preventDefault();
            $(event.target).blur();
        }
    },

    'submit .js-edit-form': function(event, template) {
        event.preventDefault();
        saveProject(this, template);
    },

    'click .js-save': function(event, template) {
        saveProject(this, template);
    },

    // handle mousedown otherwise the blur handler above will swallow the click
    // on iOS, we still require the click event so handle both
    'mousedown .js-cancel': function(event, template) {
        event.preventDefault();
        cancel(this, template);
    },

    //TODO: status wait for refactoring
    'click .js-status-active': function() {
        Session.set(STATUS_KEY, 'active');
    },

    'click .js-status-suspended': function() {
        Session.set(STATUS_KEY, 'suspended');
    },

    'click .js-status-closed': function() {
        Session.set(STATUS_KEY, 'closed');
    }
});

Template.projectEditForm.rendered = function() {
    $("#project_" + Session.get(EDITING_KEY) + " form").validate({
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