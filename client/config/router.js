Router.configure({
    // we use the  appBody template to define the layout for the entire app
    layoutTemplate: 'mainLayout', //Inspinia layout

    // the appNotFound template is used for unknown routes and missing lists
    notFoundTemplate: 'notFound',

    // show the appLoading template whilst the subscriptions below load their data
    loadingTemplate: 'appLoading',

    // wait on the following subscriptions before rendering the page to ensure
    // the data it's expecting is present
    waitOn: function() {
        return [
            Meteor.subscribe('publicTaskLists'),
            Meteor.subscribe('privateTaskLists'),
            Meteor.subscribe('publicProjects'),
            Meteor.subscribe('privateProjects')
        ];
    }
});

//
// TodoList routes
//

Router.route('join', {
    layoutTemplate: 'tasksLayout'
});
Router.route('signin', {
    layoutTemplate: 'tasksLayout'
});

Router.route('taskLists', {
    path: '/task_lists/:_id',
    layoutTemplate: 'tasksLayout',
    // subscribe to todos before the page is rendered but don't wait on the
    // subscription, we'll just render the items as they arrive
    onBeforeAction: function () {
        this.todosHandle = Meteor.subscribe('tasks', this.params._id);

        if (this.ready()) {
            // Handle for launch screen defined in layout
            dataReadyHold.release();
        }
    },
    data: function () {
        return TaskLists.findOne(this.params._id);
    },
    action: function () {
        this.render();
    }
});

Router.route('projects', {
    path: '/projects',
    onBeforeAction: function () {
        this.projectsHandle = Meteor.subscribe('publicProjects');

        if (this.ready()) {
            // Handle for launch screen defined in layout
            dataReadyHold.release();
        }
    },
    action: function () {
        this.render();
    }
});

Router.route('products', {
    path: '/products',
    onBeforeAction: function () {
        this.productsHandle = Meteor.subscribe('publicProducts');
        this.productsImagesHandle = Meteor.subscribe('productsImages');
        if (this.ready()) {
            // Handle for launch screen defined in layout
            dataReadyHold.release();
        }
    },
    action: function () {
        this.render();
    }
});

Router.route('home', {
    path: '/',
    layoutTemplate: 'tasksLayout',
    action: function() {
        Router.go('taskLists', TaskLists.findOne());
    }
});

//
// Dashboards routes
//

Router.route('dashboard1', function () {
    this.render('dashboard1');
});

Router.route('dashboard2', function () {
    this.render('dashboard2');
});

Router.route('dashboard3', function () {
    this.render('dashboard3');
});

Router.route('dashboard4', {
    path: 'dashboard4',
    layoutTemplate: 'layout2',
    action: function() {
        this.render();
    }
});

Router.route('dashboard4l', function () {
    this.render('dashboard4l');
});

Router.route('dashboard5', function () {
    this.render('dashboard5');
});


//
// Layouts route
//

Router.route('layouts', function () {
    this.render('layouts');
});

//
// Graphs routes
//

Router.route('graphFlot', function () {
    this.render('graphFlot');
});

Router.route('graphRickshaw', function () {
    this.render('graphRickshaw');
});

Router.route('graphChartJs', function () {
    this.render('graphChartJs');
});

Router.route('graphChartist', function () {
    this.render('graphChartist');
});

Router.route('c3charts', function () {
    this.render('c3charts');
});

Router.route('graphPeity', function () {
    this.render('graphPeity');
});

Router.route('graphSparkline', function () {
    this.render('graphSparkline');
});

//
// Mailbox
//

Router.route('mailbox', function () {
    this.render('mailbox');
});

Router.route('emailView', function () {
    this.render('emailView');
});

Router.route('emailCompose', function () {
    this.render('emailCompose');
});

Router.route('emailTemplates', function () {
    this.render('emailTemplates');
});

//
// Widgets
//

Router.route('widgets', function () {
    this.render('widgets');
});

//
// Metrics
//

Router.route('metrics', function () {
    this.render('metrics');
});

//
// Forms
//

Router.route('formBasic', function () {
    this.render('formBasic');
});

Router.route('formAdvanced', function () {
    this.render('formAdvanced');
});

Router.route('formWizard', function () {
    this.render('formWizard');
});

Router.route('formUpload', function () {
    this.render('formUpload');
});

Router.route('textEditor', function () {
    this.render('textEditor');
});

Router.route('markdown', function () {
    this.render('markdown');
});

//
// App Views
//

Router.route('contacts', function () {
    this.render('contacts');
});

Router.route('profile', function () {
    this.render('profile');
});

Router.route('profile2', function () {
    this.render('profile2');
});

Router.route('contacts2', function () {
    this.render('contacts2');
});

//Router.route('projects', function () {
//    this.render('projects');
//});

Router.route('projectDetail', function () {
    this.render('projectDetail');
});

Router.route('teamsBoard', function () {
    this.render('teamsBoard');
});

Router.route('socialFeed', function () {
    this.render('socialFeed');
});

Router.route('clients', function () {
    this.render('clients');
});

//Outlook view
Router.route('fullHeight', {
    path: 'fullHeight',
    layoutTemplate: 'mainLayout',
    action: function() {
        this.render();
    }
});

Router.route('offCanvas', function () {
    this.render('offCanvas');
});

Router.route('voteList', function () {
    this.render('voteList');
});

Router.route('fileManager', function () {
    this.render('fileManager');
});

Router.route('calendar', function () {
    this.render('calendar');
});

Router.route('issueTracker', function () {
    this.render('issueTracker');
});

Router.route('blog', function () {
    this.render('blog');
});

Router.route('article', function () {
    this.render('article');
});

Router.route('faq', function () {
    this.render('faq');
});

Router.route('timelineOne', function () {
    this.render('timelineOne');
});

Router.route('pinBoard', function () {
    this.render('pinBoard');
});

//
// Other pages
//

Router.route('searchResult', function () {
    this.render('searchResult');
});

Router.route('invoice', function () {
    this.render('invoice');
});

Router.route('invoicePrint', {
    path: 'invoicePrint',
    layoutTemplate: 'blankLayout',
    action: function() {
        this.render();
    }
});

Router.route('login', {
    path: 'login',
    layoutTemplate: 'blankLayout',
    action: function() {
        this.render();
    }
});

Router.route('loginTwo', {
    path: 'loginTwo',
    layoutTemplate: 'blankLayout',
    action: function() {
        this.render();
    }
});

Router.route('lockScreen', {
    path: 'lockScreen',
    layoutTemplate: 'blankLayout',
    action: function() {
        this.render();
    }
});

Router.route('forgotPassword', {
    path: 'forgotPassword',
    layoutTemplate: 'blankLayout',
    action: function() {
        this.render();
    }
});

Router.route('register', {
    path: 'register',
    layoutTemplate: 'blankLayout',
    action: function() {
        this.render();
    }
});

Router.route('errorOne', {
    path: 'errorOne',
    layoutTemplate: 'blankLayout',
    action: function() {
        this.render();
    }
});

Router.route('errorTwo', {
    path: 'errorTwo',
    layoutTemplate: 'blankLayout',
    action: function() {
        this.render();
    }
});

Router.route('emptyPage', function () {
    this.render('emptyPage');
});

//
// Miscellaneous
//

Router.route('toastrNotification', function () {
    this.render('toastrNotification');
});

Router.route('nestableList', function () {
    this.render('nestableList');
});

Router.route('agileBoard', function () {
    this.render('agileBoard');
});

Router.route('timelineTwo', function () {
    this.render('timelineTwo');
});

Router.route('diff', function () {
    this.render('diff');
});

Router.route('i18support', function () {
    this.render('i18support');
});

Router.route('sweetAlert', function () {
    this.render('sweetAlert');
});

Router.route('idleTimer', function () {
    this.render('idleTimer');
});

Router.route('truncate', function () {
    this.render('truncate');
});

Router.route('spinners', function () {
    this.render('spinners');
});

Router.route('liveFavicon', function () {
    this.render('liveFavicon');
});

Router.route('googleMaps', function () {
    this.render('googleMaps');
});

Router.route('codeEditor', function () {
    this.render('codeEditor');
});

Router.route('modalWindow', function () {
    this.render('modalWindow');
});

Router.route('clipboard', function () {
    this.render('clipboard');
});

Router.route('forumView', function () {
    this.render('forumView');
});

Router.route('forumDetail', function () {
    this.render('forumDetail');
});

Router.route('validation', function () {
    this.render('validation');
});

Router.route('treeView', function () {
    this.render('treeView');
});

Router.route('loadingButtons', function () {
    this.render('loadingButtons');
});

Router.route('chatView', function () {
    this.render('chatView');
});

Router.route('masonry', function () {
    this.render('masonry');
});

Router.route('tour', function () {
    this.render('tour');
});

//
// UI Elements
//

Router.route('typography', function () {
    this.render('typography');
});

Router.route('icons', function () {
    this.render('icons');
});

Router.route('draggablePanels', function () {
    this.render('draggablePanels');
});

Router.route('resizeablePanels', function () {
    this.render('resizeablePanels');
});

Router.route('buttons', function () {
    this.render('buttons');
});

Router.route('video', function () {
    this.render('video');
});

Router.route('tabsPanels', function () {
    this.render('tabsPanels');
});

Router.route('tabs', function () {
    this.render('tabs');
});

Router.route('notifications', function () {
    this.render('notifications');
});

Router.route('badgesLabels', function () {
    this.render('badgesLabels');
});

//
// Grid Options
//

Router.route('gridOptions', function () {
    this.render('gridOptions');
});

//
// Tables
//

Router.route('tableStatic', function () {
    this.render('tableStatic');
});

Router.route('dataTables', function () {
    this.render('dataTables');
});

Router.route('fooTables', function () {
    this.render('fooTables');
});

//
// E-commerce
//

Router.route('productsGrid', function () {
    this.render('productsGrid');
});

Router.route('productsList', function () {
    this.render('productsList');
});

Router.route('productEdit', function () {
    this.render('productEdit');
});

Router.route('shopingCart', function () {
    this.render('shopingCart');
});

Router.route('orders', function () {
    this.render('orders');
});

Router.route('productDetail', function () {
    this.render('productDetail');
});

Router.route('payments', function () {
    this.render('payments');
});

//
// Gallery
//

Router.route('gallery', {
    path: '/gallery',
        waitOn: function () {
        return Meteor.subscribe('images')
    },
    action: function () {
        if (this.ready())
            this.render('gallery');
        else
            this.render('loading');
    }
});

Router.route('carusela', function () {
    this.render('carusela');
});

Router.route('slick', function () {
    this.render('slick');
});


//
// CSS Animations
//

Router.route('cssAnimations', function () {
    this.render('cssAnimations');
});

//
// Landing page
//

Router.route('landing', {
    path: 'landing',
    layoutTemplate: 'blankLayout',
    action: function() {
        this.render();
    }
});



//
// Other pages routes
//
Router.route('notFound', function () {
    this.render('notFound');
});

// Default route
// You can use direct this.render('template')
// We use Router.go method because dashboard1 is our nested view in menu
Router.route('', function () {
    Router.go('dashboard1');
});


dataReadyHold = null;

if (Meteor.isClient) {
    // Keep showing the launch screen on mobile devices until we have loaded
    // the app's data
    dataReadyHold = LaunchScreen.hold();

    // Show the loading screen on desktop
    Router.onBeforeAction('loading', {except: ['join', 'signin']});
    Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
}
