Template.productsGrid.helpers({
    productsIndex: function() {
        return ProductsIndex;
    },
    inputAttributes: function () {
        return { 'class': 'input-sm form-control', 'placeholder': 'Search in Products' };
    }
});

Template.productsGrid.rendered = function() {
    // i18n

    $.i18n.init({
        resGetPath: 'locales/__lng__.json',
        load: 'unspecific',
        fallbackLng: false,
        lng: 'ru'
    }, function (t){
        $('.products-grid').i18n();
    });
};