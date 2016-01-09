var STATUS_KEY = 'PROJECT_STATUS';

Template.statusSelect.helpers({
    status: function () {
        return Session.get(STATUS_KEY);
    },
    statusClass: function() {
        switch (Session.get(STATUS_KEY)) {
            case 'new':
                return 'label label-info';
            case 'pending':
                return 'label label-warning';
            case 'active':
                return 'label label-primary';
            case 'suspended':
                return 'label label-warning';
            case 'closed':
                return 'label label-default';
            default:
                return 'label label-default';
        }
    },
    statusLabel: function() {
        return Session.get(STATUS_KEY).capitalizeFirstLetter();
    }
});