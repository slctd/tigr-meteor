var EDITING_KEY = 'EDITING_PROJECT_ID';
var STATUS_KEY = 'PROJECT_STATUS';

Template.projectList.helpers({
    projectsIndex: function() {
        return ProjectsIndex;
    },
    inputAttributes: function () {
        return { 'class': 'input-sm form-control', 'placeholder': 'Search in Projects' };
    }
});

Template.projects.onRendered(function() {
    Session.set(EDITING_KEY, 'new');
    Session.set(STATUS_KEY, 'new');
});
