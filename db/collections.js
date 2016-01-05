TaskLists = new Mongo.Collection('taskLists'),
  TaskListsIndex = new EasySearch.Index({
    collection: TaskLists,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
  });

// Calculate a default name for a list in the form of 'List A'
TaskLists.defaultName = function() {
  var nextLetter = 'A', nextName = 'Task List ' + nextLetter;
  while (TaskLists.findOne({name: nextName})) {
    // not going to be too smart here, can go past Z
    nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
    nextName = 'Task List ' + nextLetter;
  }

  return nextName;
};

Tasks = new Mongo.Collection('tasks');