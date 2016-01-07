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

var animateNew = function() {
    $('#new-project').removeClass('hidden').addClass("animated").addClass("fadeInDown");
    $('.js-new-project').addClass("animated").addClass("fadeOutDown");
    setTimeout(function() {
        $('#new-project').removeClass("animated").removeClass("fadeInDown");
        $('.js-new-project').removeClass("animated").removeClass("fadeOutDown").addClass('hidden');
        $('#new-project').find("[name=name]").first().focus();
    }, 500);
};

Template.projects.events({

    'click .js-new-project': function() {
        animateNew();
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