var EDITING_KEY = 'EDITING_PROJECT_ID';
var STATUS_KEY = 'PROJECT_STATUS';

Template.projectForm.helpers({
    statusItems: function() {
        return Session.get(EDITING_KEY) === 'new' ? ['new', 'pending', 'active'] : ['active', 'suspended', 'closed']
    },
    saveLabel: function() {
        return Session.get(EDITING_KEY) === 'new' ? 'Submit' : 'Save Changes'
    },
    formTitle: function() {
        return Session.get(EDITING_KEY) === 'new' ? 'Add new Project' : 'Edit Project'
    }
});

var validateProject = function(form) {
    form.validate({
        rules: {
            name: {
                required: true
            }
        },
        errorPlacement: function (error, element) {
            if (element.attr("name") == "name")
                error.insertAfter(".name-label");
            else
                error.insertAfter(element);
        }
    });
};

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

var resetForm = function(event, template) {
    template.$('[name="name"]').val('');
    template.$('[name="about"]').val('');
    template.$('[name="description"]').val('');
    Session.set(STATUS_KEY, 'new');
    Session.set(EDITING_KEY, 'new');
};

var animateSubmit = function(event, template) {
    $('#project_new').addClass("animated").addClass("bounceOut");
    $('.js-new-project').removeClass('hidden').addClass("animated").addClass("fadeInUp");
    setTimeout(function() {
        $('#project_new').removeClass("animated").removeClass("bounceOut").addClass('hidden');
        $('.js-new-project').removeClass("animated").removeClass("fadeInUp");
        resetForm(event, template);
    }, 500);
};

var animateCloseNewForm = function(event, template) {
    $('#project_new').addClass("animated").addClass("fadeOutUp");
    $('.js-new-project').removeClass('hidden').addClass("animated").addClass("fadeInUp");
    setTimeout(function() {
        $('#project_new').removeClass("animated").removeClass("fadeOutUp").addClass('hidden');
        $('.js-new-project').removeClass("animated").removeClass("fadeInUp");
        resetForm(event, template);
    }, 500);
};

var animateCloseEditForm = function(project) {
    var panel = $('#project_' + project._id);
    panel.addClass("animated").addClass("flipInY");
    setTimeout(function() {
        panel.removeClass("animated").removeClass("flipInY");
    }, 1000);
    Session.set(EDITING_KEY, 'new');
    Session.set(STATUS_KEY, 'new');
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
    animateCloseEditForm(project, template);
};

var saveAction = function(event, template, project) {
    if(Session.get(EDITING_KEY) === 'new') {
        submitProject(event, template);
    } else if(Session.get(EDITING_KEY)) {
        saveProject(project, template);
    }
};

Template.projectForm.events({
    'submit .js-project-form': function (event, template) {
        event.preventDefault();
        saveAction(event, template, this);
    },

    'click .js-save': function (event, template) {
        validateProject(template);
    },

    'click .js-cancel': function(event, template) {
        if(Session.get(EDITING_KEY) === 'new') {
            animateCloseNewForm(event, template);
        } else if(Session.get(EDITING_KEY)) {
            animateCloseEditForm(this, template);
        }

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
    var form = $("#project_" + Session.get(EDITING_KEY) + ' .js-project-form');
    validateProject(form);
};