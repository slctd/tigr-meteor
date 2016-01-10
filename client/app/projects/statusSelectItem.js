var STATUS_KEY = 'PROJECT_STATUS';

Template.statusSelectItem.helpers({
    statusLabel: function () {
        return this.statusName.capitalizeFirstLetter();
    },
    statusClass: function() {
        switch (this.statusName) {
            case 'new':
                return 'color-info';
            case 'pending':
                return 'color-warning';
            case 'active':
                return 'color-primary';
            case 'suspended':
                return 'color-warning';
            case 'closed':
                return 'color-default';
            default:
                return 'color-default';
        }
    }
});

Template.statusSelectItem.events({
    'click .js-status-switch': function(event) {
        event.preventDefault();
        var status = $(event.target).data('status');
        Session.set(STATUS_KEY, status);
    }
});
