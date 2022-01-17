//references the actual form
var formEl = document.querySelector("#task-form");

//references the container with all the <ul> parent elements
var pageContentEl = document.querySelector("#page-content");

//references to <ul> parent elements
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

//used to track <li> elements created
var taskIdCounter = 0;

//empty array that will hold all tasks (each as an object with properties)
var tasks = [];

var taskFormHandler = function(event) {
    //event here refers to the submit event

    event.preventDefault();

    //user data input received
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    //selected <input> element with name='task-name' attribute
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if(!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    // reset form fields for next task to be entered
    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectedIndex = 0;
    // formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");

    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } 
    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
        //package up data as an object
        var taskDataObj = {
        name: taskNameInput, //name and type are properties of the object
        type: taskTypeInput,
        status: "to do"
        }; //values sent with argument to be read in function below
    
        //send it as an argument to createTaskEl
        createTaskEl(taskDataObj); //inserted object as an argument 
    } 
}; 

var createTaskEl = function(taskDataObj) { //accepting object as argument
          
    //create list item -- child of ul
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    //create div to hold task info and add to list item -- child of li
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    //adds div child to li parent
    listItemEl.appendChild(taskInfoEl);

    // create task actions (buttons and select) for task
    var taskActionsEl = createTaskActions(taskIdCounter);
    //Note that we're using taskIdCounter as the argument now to create buttons that correspond to the current task id
    listItemEl.appendChild(taskActionsEl);

    //add entire list item child <li> to appropriate list parent <ul>
    switch (taskDataObj.status) {
        case "to do":
          taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
          tasksToDoEl.append(listItemEl);
          break;
        case "in progress":
          taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
          tasksInProgressEl.append(listItemEl);
          break;
        case "completed":
          taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
          tasksCompletedEl.append(listItemEl);
          break;
        default:
          console.log("Something went wrong!");
    }

    // save task as an object with name, type, status, and id properties then push it into tasks array
    //
    //set the id to the initial value of taskIdCounter = 0
    //add this property to the taskDataObj object as a property of id
    taskDataObj.id = taskIdCounter;
    //
    //push the taskDataObj object (each task is a diff object) to the tasks array
    tasks.push(taskDataObj);

    // save tasks to localStorage
    saveTasks();

    // increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //drop down button
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
      
        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    //return the <div> parent with the <button> children
    return actionContainerEl;
};

//referencing the delete and edit buttons with this function
var taskButtonHandler = function(event) {
    //event.target references the DOM element on which the event occurs!!
    //the event that is occurring is the click down below
    //.matches checking if element with that class will be returned by querySelector 

    // get target element from event
    var targetEl = event.target;

    //referencing element that has the specified class when clicked!
    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
        //pass the taskId an argument to that function
    } 
    // delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var taskStatusChangeHandler = function(event) {
    console.log(event.target.value);

    // find task list item based on event.target's data-task-id attribute
    var taskId = event.target.getAttribute("data-task-id");
  
    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
  
    // find the parent <li> task item element based on the id
    //doesn't create a second <li>!! selected a specific <li>
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } 
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } 
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
        tasks[i].status = statusValue;
        }
    }

    //run function to save to local storage
    saveTasks();
};

var editTask = function(taskId) {
    console.log(taskId);

    // get task list item element parent!
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type --> classes of the h3 and span children
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    //reference the document and make the form values equal the values of the task when the edit button is clicked
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    //sets the taskId of the task being edited on the form itself
    //so when user presses save, the data will be saved to the same taskId
    formEl.setAttribute("data-task-id", taskId);
};

var completeEditTask = function(taskName, taskType, taskId) {
    // find the parent <li> task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {

        if (tasks[i].id === parseInt(taskId)) {
        tasks[i].name = taskName;
        tasks[i].type = taskType;
        }
    };

    alert("Task Updated!");

    // remove data attribute from form
    formEl.removeAttribute("data-task-id");
    //resets the form by removing the task-id from the form element
    //this ensures users are able to create new tasks again

    // update formEl button to go back to saying "Add Task" instead of "Edit Task"
    document.querySelector("#save-task").textContent = "Add Task";

    //run function to save to local storage
    saveTasks();
};

var deleteTask = function(taskId) {
    console.log(taskId);

    // find task list element with taskId value
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //selecting .task-item[data-task-id='taskId'] the class with that data-task-id

    //removes that task
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    //run function to save to local storage
    saveTasks();
};

var saveTasks = function() {
    //save tasks array to localStorage with key tasks
    //can only save strings to local storage so stringify the array
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function () {

    // Gets task items from localStorage
    var savedTasks = localStorage.getItem("tasks");
    // console.log(tasks);

    // if there are no tasks, set tasks to an empty array and return out of the function
    if (!savedTasks) {
        return false;
    }
    console.log("Saved tasks found!");
    // else, load up saved tasks

    // parse into array of objects
    // Converts tasks from the string format back into an array of objects
    savedTasks = JSON.parse(savedTasks);

    // loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
        // pass each task object into the `createTaskEl()` function
        createTaskEl(savedTasks[i]); //sending array object as an argument
    }
};
loadTasks();

// Create a new task
formEl.addEventListener("submit", taskFormHandler);

// for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

// for changing the status
pageContentEl.addEventListener("change", taskStatusChangeHandler);