var toggleTaskListPrivacy = function(list) {
    if (! Meteor.user()) {
        return swal({
            title: "Log in first",
            text: "Please sign in or create an account to make private lists.",
            type: "info",
            showCancelButton: true,
            confirmButtonText: "Yes, log me in",
            cancelButtonText: "No, I'm good",
            closeOnConfirm: true,
            closeOnCancel: true },
            function (isConfirm) {
                if (isConfirm) {
                    Router.go('signin');
                    return true;
                } else {
                    return false;
                }
            });
    }

    if (list.userId) {
        TaskLists.update(list._id, {$unset: {userId: true}});
    } else {
        // ensure the last public list cannot be made private
        if (TaskLists.find({userId: {$exists: false}}).count() === 1) {
            return swal({
                title: "Can't make it private",
                text: "Sorry, you cannot make the final public list private!",
                type: "info",
                confirmButtonText: "OK, I see",
                closeOnConfirm: true
            });
        }

        TaskLists.update(list._id, {$set: {userId: Meteor.userId()}});
    }
};

var deleteTaskList = function(list) {
    // ensure the last public list cannot be deleted.
    if (! list.userId && TaskLists.find({userId: {$exists: false}}).count() === 1) {
        swal({
            title: "Can't delete",
            text: "Sorry, you cannot delete the final public list!",
            type: "info",
            confirmButtonText: "OK, I see",
            closeOnConfirm: true
        });
    } else {
        return swal({
                title: "Are you sure?",
                text: "Are you sure you want to delete the list " + list.name + "?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: true },
            function (isConfirm) {
                if (isConfirm) {
                    // we must remove each item individually from the client
                    Tasks.find({listId: list._id}).forEach(function(task) {
                        Tasks.remove(task._id);
                    });
                    TaskLists.remove(list._id);
                    swal("Deleted!", "Your list has been deleted.", "success");
                    Router.go('home');
                    return true;
                } else {
                    return false;
                }
            });
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
        toggleTaskListPrivacy(this, template);
    },

    'click .js-delete-list': function(event, template) {
        deleteTaskList(this, template);
    }
});