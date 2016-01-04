Meteor.publish('publicLists', function() {
  return TaskLists.find({userId: {$exists: false}});
});

Meteor.publish('privateLists', function() {
  if (this.userId) {
    return TaskLists.find({userId: this.userId});
  } else {
    this.ready();
  }
});

Meteor.publish('todos', function(listId) {
  check(listId, String);

  return Tasks.find({listId: listId});
});
