Template.productsGridItem.helpers({
    priceFormatted: function() {
        return '$' + this.price;
    },
    id: function() {
        return this._id;
    }
});