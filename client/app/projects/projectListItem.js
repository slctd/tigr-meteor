var EDITING_KEY = 'EDITING_PROJECT_ID';

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Template.projectListItem.helpers({
    editing: function() {
        return (Session.get(EDITING_KEY) === this._id.toString()) ? true : false;
    },
    editingClass: function() {
        return Session.equals(EDITING_KEY, this._id) && 'editing';
    },
    statusClass: function() {
        switch (this.status) {
            case 'new':
                return 'label label-info';
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

var updateProject = function(project, template, fieldName) {
    //Session.set(EDITING_KEY, false);
    var update = {};
    update[fieldName] = template.$('[name="'+fieldName+'"]').val();
    Projects.update(project._id, {$set: update});
};

var statusToggle = function(project, template, status) {
    var update = {status: status};
    Projects.update(project._id, {$set: update});
};

var saveProject = function(project, template) {
    Projects.update(project._id, {$set: {
        name: template.$('[name="name"]').val(),
        about: template.$('[name="about"]').val(),
        description: template.$('[name="description"]').val()
    }});
    animateSwitch(project, template);
    Session.set(EDITING_KEY, false);
};

var cancel = function(project, template) {
    animateSwitch(project, template);
    Session.set(EDITING_KEY, false);
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

    //'blur input[name="name"]': function(event, template) {
    //    if (Session.get(EDITING_KEY))
    //        updateProject(this, template, 'name');
    //},
    //
    //'blur input[name="about"]': function(event, template) {
    //    if (Session.get(EDITING_KEY))
    //        updateProject(this, template, 'about');
    //},
    //
    //'blur input[name="description"]': function(event, template) {
    //    if (Session.get(EDITING_KEY))
    //        updateProject(this, template, 'description');
    //},

    'submit .js-edit-form, click .js-save': function(event, template) {
        event.preventDefault();
        saveProject(this, template);
    },

    // handle mousedown otherwise the blur handler above will swallow the click
    // on iOS, we still require the click event so handle both
    'mousedown .js-cancel': function(event, template) {
        event.preventDefault();
        cancel(this, template);
    },

    'change .project-edit': function(event, template) {
        if ($(event.target).val() === 'edit') {
            editProject(this, template);
        } else if ($(event.target).val() === 'delete') {
            deleteProject(this, template);
        }

        event.target.selectedIndex = 0;
    },

    'click .js-edit-project': function(event, template) {
        editProject(this, template);
    },

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
