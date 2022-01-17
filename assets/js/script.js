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

    formEl.reset();

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
        type: taskTypeInput
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

    var taskActionsEl = createTaskActions(taskIdCounter);
    //Note that we're using taskIdCounter as the argument now to create buttons that correspond to the current task id
    listItemEl.appendChild(taskActionsEl);

    //add entire list item child <li> to list parent <ul>
    tasksToDoEl.appendChild(listItemEl);

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
        //using the taskId for the button as an argument
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

    alert("Task Updated!");

    // remove data attribute from form
    formEl.removeAttribute("data-task-id");
    // update formEl button to go back to saying "Add Task" instead of "Edit Task"
    document.querySelector("#save-task").textContent = "Add Task";
    //resets the form by removing the task-id from the form element
    //this ensures users are able to create new tasks again
};

var deleteTask = function(taskId) {
    console.log(taskId);

    // find task list element with taskId value
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //selecting .task-item[data-task-id='taskId'] the class with that data-task-id

    //removes that task
    taskSelected.remove();
};

// Create a new task
formEl.addEventListener("submit", taskFormHandler);

// for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

// for changing the status
pageContentEl.addEventListener("change", taskStatusChangeHandler);



// // OLD CODE FOR createTaskEl(taskDataObj)
//     //package up data as an object
//     var taskDataObj = {
//         name: taskNameInput, //name and type are properties of the object
//         type: taskTypeInput,
//     }; //values sent with argument to be read in function below

// //OLD CODE FOR TASKBUTTONHANDLER 
//referencing the delete and edit buttons with this function
// var taskButtonHandler = function(event) {
//     //event.target references the DOM element on which the event occurs!!
//     //the event that is occurring is the click down below
//     //.matches checking if element with that class will be returned by querySelector 
//     //referencing element that has this class="delete-btn"
//     if (event.target.matches(".delete-btn")) {
//         // get the element's task id
//         var taskId = event.target.getAttribute("data-task-id");
//         deleteTask(taskId);
//         //using the taskId for the button as an argument
//     }
// };



// //OLD CODE
// var formEl = document.querySelector("#task-form");
// var tasksToDoEl = document.querySelector("#tasks-to-do");

// var createTaskHandler = function(event) {
//     //event here refers to the submit event

//     event.preventDefault();

//     var taskNameInput = document.querySelector("input[name='task-name']").value;
//     //value is the user input value that replaces "Enter Task Name" in the input element
//     var taskTypeInput = document.querySelector("select[name='task-type']").value;
//     //option from dropdown menu value
  
//     // create list item -- child of ul
//     var listItemEl = document.createElement("li");
//     listItemEl.className = "task-item";
//     //creates <li class="task-item"></li>

//     // create div to hold task info and add to list item -- child of li
//     var taskInfoEl = document.createElement("div");
//     // give it a class name
//     taskInfoEl.className = "task-info";

//     // add HTML content to div
//     taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>";
//     listItemEl.appendChild(taskInfoEl);
//     //adds div child to li parent
//     //creates <div><h3 class="task-name">taskNameInput value</h3><span class="task-type">taskTypeInput value</span></div>
//     //the div holds the content to the li

//     // add entire list item to list
//     tasksToDoEl.appendChild(listItemEl);
//     //adds li child to ul parent
// }; 
// //must be placed before addEventListener because it needs to be declared first since it's a function expression w a variable

// formEl.addEventListener("submit", createTaskHandler);
// //when you click the button or press enter, it runs createTaskHandler