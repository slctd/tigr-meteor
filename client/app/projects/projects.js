// Track if this is the first time the list template is rendered
var firstRender = true;
var listRenderHold = LaunchScreen.hold();
listFadeInHold = null;

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

var CONNECTION_ISSUE_TIMEOUT = 5000;

Meteor.startup(function () {
    // Only show the connection error box if it has been 5 seconds since
    // the app started
    setTimeout(function () {
        // Launch screen handle created in lib/router.js
        dataReadyHold.release();

        // Show the connection error box
        Session.set(SHOW_CONNECTION_ISSUE_KEY, true);
    }, CONNECTION_ISSUE_TIMEOUT);
});

Template.projects.onRendered(function() {
    if (firstRender) {
        // Released in app-body.js
        listFadeInHold = LaunchScreen.hold();

        // Handle for launch screen defined in app-body.js
        listRenderHold.release();

        firstRender = false;
    }
});

Template.projects.helpers({
    // We use #each on an array of one item so that the "list" template is
    // removed and a new copy is added when changing lists, which is
    // important for animation purposes. #each looks at the _id property of it's
    // items to know when to insert a new item and when to update an old one.
    projects: function () {
        return TaskLists.find();
    },
    projectsReady: function() {
        return Router.current().todosHandle.ready();
    },
    connected: function() {
        if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
            return Meteor.status().connected;
        } else {
            return true;
        }
    }
});
Template.projectList.helpers({
    projectsIndex: function() {
        return TaskListsIndex;
    },
    inputAttributes: function () {
        return { 'class': 'input-sm form-control', 'placeholder': 'Search in Projects' };
    }
});

Template.projects.events({
    'submit #new-project': function(event) {
        event.preventDefault();

        var $input = $(event.target).find('[type=text]');
        if (! $input.val())
            return;

        TaskLists.insert({
            name: $input.val(),
            createdAt: new Date()
        });
        $input.val('');
    },

    'click .js-new-project': function() {
        $('#new-project').removeClass('hidden');
        $('.js-new-project').addClass('hidden')
    },

    'click .js-close-new': function() {
        $('#new-project').addClass('hidden');
        $('.js-new-project').removeClass('hidden')
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