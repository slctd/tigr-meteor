var EDITING_KEY = 'EDITING_PROJECT_ID';
var STATUS_KEY = 'PROJECT_STATUS';

Template.projectListItem.helpers({
    editing: function() {
        return (Session.get(EDITING_KEY) === this._id.toString()) ? true : false;
    },
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
    id: function() {
        return this._id;
    }
});

var animateSwitch = function(project, template) {
    var panel = template.$('#project_' + project._id);
    panel.addClass("animated").addClass("flipInY");
    setTimeout(function() {
        panel.removeClass("animated").removeClass("flipInY");
    }, 1500);
};

var editProject = function(project, template) {
    // force the template to redraw based on the reactive change
    Tracker.flush();

    Session.set(EDITING_KEY, project._id);
    animateSwitch(project, template);
    template.$('.js-edit-form input[name="name"]').first().focus();
};

var statusToggle = function(project, template, status) {
    var update = {status: status};
    Projects.update(project._id, {$set: update});
};

var deleteProject = function(project) {
    // ensure the last public project cannot be deleted.
    if (! project.userId && Projects.find({userId: {$exists: false}}).count() === 1) {
        swal({
            title: "Can't delete",
            text: "Sorry, you cannot delete the final public project!",
            type: "info",
            confirmButtonText: "OK, I see",
            closeOnConfirm: true
        });
    } else {
        return swal({
                title: "Are you sure?",
                text: "Are you sure you want to delete the project " + project.name + "?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: true },
                function (isConfirm) {
                    if (isConfirm) {
                        Projects.remove(project._id);
                        swal("Deleted!", "Your project has been deleted.", "success");
                        return true;
                    } else {
                        return false;
                    }
                });
    }
};

Template.projectListItem.events({
    'click .js-edit-project': function(event, template) {
        editProject(this, template);
    },

    ////TODO: status wait for refactoring
    'click .js-status-active': function(event, template) {
        statusToggle(this, template, 'active');
    },

    'click .js-status-suspended': function(event, template) {
        statusToggle(this, template, 'suspended');
    },

    'click .js-status-closed': function(event, template) {
        statusToggle(this, template, 'closed');
    },

    'click .js-delete-project': function(event, template) {
        deleteProject(this, template);
    }
});