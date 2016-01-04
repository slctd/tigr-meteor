Template.tasksLayout.rendered = function(){

  // Minimalize menu when screen is less than 768px
  $(window).bind("resize load", function () {
    if ($(this).width() < 769) {
      $('body').addClass('body-small')
    } else {
      $('body').removeClass('body-small')
    }
  });

  // Fix height of layout when resize, scroll and load
  $(window).bind("load resize scroll", function() {
    if(!$("body").hasClass('body-small')) {

      var navbarHeigh = $('nav.navbar-default').height();
      var wrapperHeigh = $('#page-wrapper').height();

      if(navbarHeigh > wrapperHeigh){
        $('#page-wrapper').css("min-height", navbarHeigh + "px");
      }

      if(navbarHeigh < wrapperHeigh){
        $('#page-wrapper').css("min-height", $(window).height()  + "px");
      }

      if ($('body').hasClass('fixed-nav')) {
        if (navbarHeigh > wrapperHeigh) {
          $('#page-wrapper').css("min-height", navbarHeigh - 60 + "px");
        } else {
          $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
        }
      }
    }
  });


  // SKIN OPTIONS
  // Uncomment this if you want to have different skin option:
  // Available skin: (skin-1 or skin-3, skin-2 deprecated, md-skin)
  // $('body').addClass('md-skin');

  // FIXED-SIDEBAR
  // Uncomment this if you want to have fixed left navigation
  // $('body').addClass('fixed-sidebar');
  // $('.sidebar-collapse').slimScroll({
  //     height: '100%',
  //     railOpacity: 0.9
  // });

  // BOXED LAYOUT
  // Uncomment this if you want to have boxed layout
  // $('body').addClass('boxed-layout');


};

//Tasks

var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

var CONNECTION_ISSUE_TIMEOUT = 5000;

Meteor.startup(function () {
  // set up a swipe left / right handler
  $(document.body).touchwipe({
    wipeLeft: function () {
      Session.set(MENU_KEY, false);
    },
    wipeRight: function () {
      Session.set(MENU_KEY, true);
    },
    preventDefaultEvents: false
  });

  // Only show the connection error box if it has been 5 seconds since
  // the app started
  setTimeout(function () {
    // Launch screen handle created in lib/router.js
    dataReadyHold.release();

    // Show the connection error box
    Session.set(SHOW_CONNECTION_ISSUE_KEY, true);
  }, CONNECTION_ISSUE_TIMEOUT);
});

Template.tasksLayout.onRendered(function() {
  this.find('#content-container')._uihooks = {
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

Template.tasksLayout.helpers({
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

Template.tasksLayout.events({
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
  }
});
