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

var editProject = function(project, template) {
    Session.set(EDITING_KEY, project._id);

    // force the template to redraw based on the reactive change
    Tracker.flush();
    template.$('.js-edit-form input[type=text]').focus();
};

var saveProject = function(project, template) {
    Session.set(EDITING_KEY, false);
    TaskLists.update(project._id, {$set: {name: template.$('[name=name]').val()}});
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
    'click .js-cancel': function() {
        Session.set(EDITING_KEY, false);
    },

    'keydown input[type=text]': function(event) {
        // ESC or ENTER
        if (27 === event.which || event.which === 13) {
            event.preventDefault();
            $(event.target).blur();
        }
    },

    'blur input[type=text]': function(event, template) {
        // if we are still editing (we haven't just clicked the cancel button)
        if (Session.get(EDITING_KEY))
            saveProject(this, template);
    },

    'submit .js-edit-form': function(event, template) {
        event.preventDefault();
        saveProject(this, template);
    },

    // handle mousedown otherwise the blur handler above will swallow the click
    // on iOS, we still require the click event so handle both
    'mousedown .js-cancel, click .js-cancel': function(event) {
        event.preventDefault();
        Session.set(EDITING_KEY, false);
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
