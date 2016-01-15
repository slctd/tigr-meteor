Meteor.publish('publicTaskLists', function() {
  return TaskLists.find({userId: {$exists: false}});
});

Meteor.publish('privateTaskLists', function() {
  if (this.userId) {
    return TaskLists.find({userId: this.userId});
  } else {
    this.ready();
  }
});

Meteor.publish('tasks', function(listId) {
  check(listId, String);

  return Tasks.find({listId: listId});
});

Meteor.publish('publicProjects', function() {
  return Projects.find({userId: {$exists: false}});
});

Meteor.publish('privateProjects', function() {
  if (this.userId) {
    return Projects.find({userId: this.userId});
  } else {
    this.ready();
  }
});

Meteor.publish('publicProducts', function() {
  return Products.find({userId: {$exists: false}})
});

Meteor.publish('companyProducts', function() {
  if (this.companyId) {
    return Products.find({companyId: this.companyId})
  } else {
    this.ready();
  }
});

var Images = new FS.Collection("images", {
    stores: [new FS.Store.FileSystem("images"), new FS.Store.FileSystem("thumbs")]
});

Meteor.publish('images', function(){ return Images.find(); });

Meteor.publish('productsImages', function(){ return ProductsImages.find(); });