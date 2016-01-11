Template.productsGrid.helpers({
    productsIndex: function() {
        return ProductsIndex;
    },
    inputAttributes: function () {
        return { 'class': 'input-sm form-control', 'placeholder': TAPi18n.__('products.search') };
    }
});