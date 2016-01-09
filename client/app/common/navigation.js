Template.navigation.onRendered(function() {
    $('#content-container')._uihooks = {
        insertElement: function(node, next) {
            $(node)
                .hide()
                .insertBefore(next)
                .fadeIn(function () {
                    if (listFadeInHold) {
                        listFadeInHold.release();
                    }
                });
        },
        removeElement: function(node) {
            $(node).fadeOut(function() {
                $(this).remove();
            });
        }
    };
});

Template.navigation.helpers({
    // We use #each on an array of one item so that the "list" template is
    // removed and a new copy is added when changing lists, which is
    // important for animation purposes. #each looks at the _id property of it's
    // items to know when to insert a new item and when to update an old one.
    thisArray: function() {
        return [this];
    },
    menuOpen: function() {
        return Session.get(MENU_KEY) && 'menu-open';
    },
    cordova: function() {
        return Meteor.isCordova && 'cordova';
    },
    emailLocalPart: function() {
        var email = Meteor.user().emails[0].address;
        return email.substring(0, email.indexOf('@'));
    },
    email: function() {
        var email = Meteor.user().emails[0].address;
        return email;
    },
    userMenuOpen: function() {
        return Session.get(USER_MENU_KEY);
    },
    lists: function() {
        return TaskLists.find();
    },
    activeListClass: function() {
        var current = Router.current();
        if (current.route.name === 'taskLists' && current.params._id === this._id) {
            return 'active';
        }
    },
    connected: function() {
        if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
            return Meteor.status().connected;
        } else {
            return true;
        }
    }
});

Template.navigation.events({
    'click .js-menu': function() {
        Session.set(MENU_KEY, ! Session.get(MENU_KEY));
    },

    'click .content-overlay': function(event) {
        Session.set(MENU_KEY, false);
        event.preventDefault();
    },

    'click .js-user-menu': function(event) {
        Session.set(USER_MENU_KEY, ! Session.get(USER_MENU_KEY));
        // stop the menu from closing
        event.stopImmediatePropagation();
    },

    'click #menu a': function() {
        Session.set(MENU_KEY, false);
    },

    'click .js-logout': function() {
        Meteor.logout();

        // if we are on a private list, we'll need to go to a public one
        var current = Router.current();
        if (current.route.name === 'taskLists' && current.data().userId) {
            Router.go('taskLists', TaskLists.findOne({userId: {$exists: false}}));
        }
    },

    'click .js-new-list': function() {
        var list = {name: TaskLists.defaultName(), incompleteCount: 0};
        list._id = TaskLists.insert(list);

        Router.go('taskLists', list);
    },

    // Used only on OffCanvas layout
    'click .close-canvas-menu' : function(){
        $('body').toggleClass("mini-navbar");
    }
});

Template.navigation.rendered = function(){

    // Initialize metisMenu
    $('#side-menu').metisMenu();

};
