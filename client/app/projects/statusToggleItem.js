Template.statusToggleItem.helpers({
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

Template.statusToggleItem.events({
    'click .js-status-toggle': function(event) {
        event.preventDefault();
        var status = $(event.target).data('status');
        Projects.update(this.projectId, {$set: {status: status}});
    }
});
