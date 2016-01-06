var EDITING_KEY = 'EDITING_PROJECT_ID';

Template.projectListItem.helpers({
    editing: function() {
        return (Session.get(EDITING_KEY) === this._id.toString()) ? true : false;
    },
    editingClass: function() {
        return Session.equals(EDITING_KEY, this._id) && 'editing';
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
    TaskLists.update(project._id, {$set: update});
};

var saveProject = function(project, template) {
    TaskLists.update(project._id, {$set: {
        name: template.$('[name="name"]').val(),
        header: template.$('[name="header"]').val(),
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
    if (! project.userId && TaskLists.find({userId: {$exists: false}}).count() === 1) {
        return alert("Sorry, you cannot delete the final public project!");
    }

    var message = "Are you sure you want to delete the project " + project.name + "?";
    if (confirm(message)) {
        // we must remove each item individually from the client
        Tasks.find({listId: project._id}).forEach(function(task) {
            Tasks.remove(task._id);
        });
        TaskLists.remove(project._id);

        //Router.go('projects');
        return true;
    } else {
        return false;
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
    //'blur input[name="header"]': function(event, template) {
    //    if (Session.get(EDITING_KEY))
    //        updateProject(this, template, 'header');
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

    'click .js-delete-project': function(event, template) {
        deleteProject(this, template);
    }
});
