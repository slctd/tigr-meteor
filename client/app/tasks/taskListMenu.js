var toggleListPrivacy = function(list) {
    if (! Meteor.user()) {
        return alert("Please sign in or create an account to make private lists.");
    }

    if (list.userId) {
        TaskLists.update(list._id, {$unset: {userId: true}});
    } else {
        // ensure the last public list cannot be made private
        if (TaskLists.find({userId: {$exists: false}}).count() === 1) {
            return alert("Sorry, you cannot make the final public list private!");
        }

        TaskLists.update(list._id, {$set: {userId: Meteor.userId()}});
    }
};

var deleteList = function(list) {
    // ensure the last public list cannot be deleted.
    if (! list.userId && TaskLists.find({userId: {$exists: false}}).count() === 1) {
        return alert("Sorry, you cannot delete the final public list!");
    }

    var message = "Are you sure you want to delete the list " + list.name + "?";
    if (confirm(message)) {
        // we must remove each item individually from the client
        Tasks.find({listId: list._id}).forEach(function(todo) {
            Tasks.remove(todo._id);
        });
        TaskLists.remove(list._id);

        Router.go('home');
        return true;
    } else {
        return false;
    }
};

Template.taskListMenu.events({

    'click .collapse-link': function (event) {
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
    },

    'click .close-link': function (event) {
        var element = $(event.target);
        var content = element.closest('div.ibox');
        content.remove();

    },

    'click .fullscreen-link': function (event) {
        var element = $(event.target);
        var ibox = element.closest('div.ibox');
        var button = element.closest("i");
        $('body').toggleClass('fullscreen-ibox-mode');
        button.toggleClass('fa-expand').toggleClass('fa-compress');
        ibox.toggleClass('fullscreen');
        setTimeout(function() {
            $(window).trigger('resize');
        }, 100);

    },

    'click .js-toggle-list-privacy': function(event, template) {
        toggleListPrivacy(this, template);
    },

    'click .js-delete-list': function(event, template) {
        deleteList(this, template);
    }
});