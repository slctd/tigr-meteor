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

Projects = new Mongo.Collection('projects'),
    ProjectsIndex = new EasySearch.Index({
        collection: Projects,
        fields: ['name'],
        sort: ['createdAt'], //TODO: order latest first
        engine: new EasySearch.Minimongo()
    });

Products = new Mongo.Collection('products'),
    ProductsIndex = new EasySearch.Index({
        collection: Products,
        fields: ['name'],
        sort: ['createdAt'],
        engine: new EasySearch.Minimongo()
    });