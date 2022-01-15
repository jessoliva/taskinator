var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function(event) {
    //event here refers to the submit event

    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    //value is the user input value that replaces "Enter Task Name" in the input element
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    //option from dropdown menu value
  
    // create list item -- child of ul
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    //creates <li class="task-item"></li>

    // create div to hold task info and add to list item -- child of li
    var taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.className = "task-info";

    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>";
    listItemEl.appendChild(taskInfoEl);
    //adds div child to li parent
    //creates <div><h3 class="task-name">taskNameInput value</h3><span class="task-type">taskTypeInput value</span></div>
    //the div holds the content to the li

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
    //adds li child to ul parent
}; 
//must be placed before addEventListener because it needs to be declared first since it's a function expression w a variable

formEl.addEventListener("submit", createTaskHandler);
//when you click the button or press enter, it runs createTaskHandler