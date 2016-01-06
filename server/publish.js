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