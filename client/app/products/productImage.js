Template.productImage.events({
    'dropped .dnd': function(event, template) {
        var productId = $(event.target).closest('.ibox').data('productId');

        FS.Utility.eachFile(event, function(file) {
            var newFile = new FS.File(file);
            newFile.metadata = {productId: productId};
            ProductsImages.insert(newFile, function (err, fileObj) {
                if(err) console.log(err);
                else Products.update(productId, {$set: { imageId: fileObj._id }});
            });
        });
    }
});