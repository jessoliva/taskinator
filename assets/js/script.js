var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function(event) {
    //event here refers to the submit event

    event.preventDefault();
  
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.textContent = "This is a new task.";
    tasksToDoEl.appendChild(listItemEl);
}; //must be placed before addEventListener because it needs to be declared first since it's a function expression w a variable

formEl.addEventListener("submit", createTaskHandler);
//when you click the button or press enter, it runs createTaskHandler