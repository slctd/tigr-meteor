var createSquareThumb = function(fileObj, readStream, writeStream) {
    var size = '30';
    gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('PNG').pipe(writeStream);
};

var imageStore = new FS.Store.FileSystem("images");
var thumbStore = new FS.Store.FileSystem("thumbs", { transformWrite: createSquareThumb });

var Images = new FS.Collection("images", { stores: [imageStore, thumbStore] });

Template.gallery.helpers({
    title: function() {
        return TAPi18n.__('gallery.title');
    },
    images: function () {
        return Images.find();
    }
});

Template.gallery.events({
    'dropped .dropzone': FS.EventHandlers.insertFiles(Images, {
        metadata: function (fileObj) {
            return {
                owner: Meteor.userId(),
                foo: "bar"
            };
        },
        after: function (error, fileObj) {
            console.log("Inserted", fileObj.name);
        }
    }),
    'change .js-file-upload': FS.EventHandlers.insertFiles(Images, {
        metadata: function (fileObj) {
            return {
                owner: Meteor.userId(),
                foo: "bar"
            };
        },
        after: function (error, fileObj) {
            console.log("Inserted", fileObj.name);
        }
    })
});