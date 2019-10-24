var tasksLs = "tasks";
var tasks = [];
var lastId = 0;
var counter = 0;

/*Start*/

function start(){
    updateList(tasksLs);
    updateLastId();
    rebuildList();
    updateCounter();
    updateButtons();
    allowSorting();
}

/*Main functions*/

function addTask (title, description) {
    var id = obtainLastId();
    id++;
    lastId = id;
    var newTask = {'title': title, 'description': description, 'id': id};
    tasks.push(newTask);
    save(tasksLs);
    rebuildList();
    updateCounter();
    updateButtons();
}

function createTask (task){
    var newItem = $('<li>').addClass("list-group-item").text(task.title).attr('id', task.id);
    var interiorItem = $('.template');
    var title = interiorItem.find('h3');
    title.text(task.title);
    var description = interiorItem.find('small')
    description.text(task.description);
    newItem.html($('.template').html());
    clearForm();
    return newItem;
}

function deleteTask(id) {
    if(confirm('Are you sure you would like to delete this task?')){
        var newTasks = tasks.filter(task => id != task.id);
        tasks = newTasks;  
        save(tasksLs);
        updateCounter();
        rebuildList();
        updateButtons();
    }
}

function editTask(id){
    var modal = $("#editModal");
    modal.css("display", "block");
    var taskToBeEdited = checkId(id, tasks);
    $("#newTitle").val(taskToBeEdited.title);
    $("#newDescription").val(taskToBeEdited.description);
    $("#currentId").val(taskToBeEdited.id);
}

/*Additional functions*/

function obtainLastId(){
    return lastId;
}

function checkId(id, context) {
    var itemToCheck = context.find(function(element){
      return element.id == id;
    });
    return itemToCheck;
}

function clearForm(){
    $("#title").val('');
    $("#description").val('');
}

function closeEditForm (){
    $("#editModal").css("display","none");
}

/*Drag and drop*/

function allowSorting(){
    var manipulate, oldIndex;
    $("#list").sortable({
        axis: "y",
        containment: "#list",
        revert: true,

        start: function(event, ui) { 
            var update = ui.item.index();
            manipulate = update;
            console.log("Start: " + manipulate);
            oldIndex = tasks[manipulate];
        },

        update: function(event, ui) { 
            var newIndex = ui.item.index();
            console.log("End: " + newIndex);
            tasks.splice(manipulate, 1);
            tasks.splice(newIndex, 0, oldIndex);
            save();
        },
    });
}

/*Buttons*/

$("#add").click(function(){
    var title = $("#title").val();
    var description = $("#description").val();
    addTask(title,description);
});

function updateButtons() {
    var allDeleteButtons = document.querySelectorAll('button[class^=delete]');
    var allEditButtons = document.querySelectorAll('button[class^=edit]');
    
    for (var i = 0; i < allDeleteButtons.length; i++) {
        allDeleteButtons[i].addEventListener('click', function(){
            var id = this.parentElement.id;
            deleteTask(id);
        });
    }

    for (var j = 0; j <allEditButtons.length; j++){
        allEditButtons[j].addEventListener('click', function(){
            var id = this.parentElement.id;
            editTask(id);
        })
    }
}

$("#saveEdit").click(function(){
    var id = $("#currentId").val();
    var taskToBeEdited = checkId(id, tasks)
    var newTitle = $("#newTitle").val();
    var newDescription = $("#newDescription").val();
    taskToBeEdited.title = newTitle;
    taskToBeEdited.description = newDescription;
    save(tasksLs);
    rebuildList();
    updateButtons();
    closeEditForm();
    }
);

$("#closeEdit").click(function(){
    closeEditForm();
});

/*Save and update functions*/

function save(){
    localStorage.setItem(tasksLs, JSON.stringify(tasks));
}

function rebuildList(){
    var list = $("#list");
    list.html('');
    for (var i=0;i<tasks.length;++i){
        list.append(createTask(tasks[i]));
    }
}

function updateList (key) {
    var string = localStorage.getItem(key);
    var objects = JSON.parse(string);
    if(objects){
      tasks = objects;
    }
}

function updateCounter(){
    counter = tasks.length;
    $("#counter").html(counter);
};

function updateLastId(){
    if (tasks.length != 0){
        var lastItemId = tasks.slice(-1)[0].id;    
        lastId = lastItemId;
    }
}

document.addEventListener("load", start())