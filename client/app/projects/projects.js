// Track if this is the first time the list template is rendered
var firstRender = true;
var listRenderHold = LaunchScreen.hold();
listFadeInHold = null;

Template.projects.onRendered(function() {
    if (firstRender) {
        // Released in loyout
        listFadeInHold = LaunchScreen.hold();

        // Handle for launch screen defined in loyout
        listRenderHold.release();

        firstRender = false;
    }
});

Template.projects.helpers({
    projects: function () {
        return Projects.find();
    },
    projectsReady: function() {
        return Router.current().projectsHandle.ready();
    }
});
Template.projectList.helpers({
    projectsIndex: function() {
        return ProjectsIndex;
    },
    inputAttributes: function () {
        return { 'class': 'input-sm form-control', 'placeholder': 'Search in Projects' };
    }
});

Template.projects.events({

    'click .js-new-project': function() {
        $('#new-project').removeClass('hidden');
        $('.js-new-project').addClass('hidden')
    },

    'click .js-collapse-link': function (event) {
        var element = $(event.target);
        var ibox = element.closest('div.ibox');
        var button = element.closest("i");
        var content = ibox.find('div.ibox-content');
        content.slideToggle(200);
        button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
        setTimeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    }
});