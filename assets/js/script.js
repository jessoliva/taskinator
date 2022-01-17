var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");

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
 
    //package up data as an object
    var taskDataObj = {
        name: taskNameInput, //name and type are properties of the object
        type: taskTypeInput,
    }; //values sent with argument to be read in function below

    //send it as an argument to createTaskEl
    createTaskEl(taskDataObj); //inserted object as an argument   
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

formEl.addEventListener("submit", taskFormHandler);

//referencing the delete button with this function
var taskButtonHandler = function(event) {
    //event.target references the DOM element on which the event occurs!!
    //the event that is occurring is the click down below
    //.matches checking if element with that class will be returned by querySelector 
    //referencing element that has this class="delete-btn"
    if (event.target.matches(".delete-btn")) {
        // get the element's task id
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
        //using the taskId for the button as an argument
    }
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //selecting .task-item[data-task-id='taskId'] the class with that data-task-id
    taskSelected.remove();
    //removes the task
};

pageContentEl.addEventListener("click", taskButtonHandler);








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