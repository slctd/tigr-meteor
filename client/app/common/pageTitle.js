var pageParent = function(route, level) {
    route_arr = Router.current().route.path(route).split('/');
    return TAPi18n.__('nav.' + route_arr[level]);
};

Template.pageTitle.helpers({

    // Route for Home link in breadcrumbs
    home: 'dashboard1',

    categoryLabel: function () {
        if (this.category) return this.category;
        else return pageParent(this, 1);
    }

});