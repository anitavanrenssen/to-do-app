/*************************
 * TODAY'S DATE
 *************************/

const date = new Date();
let dateHeader = date.toDateString();

const todaysDate = document.querySelector("#header-date");
todaysDate.innerHTML = dateHeader;

/*************************
 * VARIABLES
 *************************/

const toDoAppKey = "todo-app-storage-key";
const body = document.querySelector(".body");
// modal
const dialog = document.querySelector("#modal");
const modalHeading = document.querySelector("#modal-heading");
const taskInputField = document.querySelector("#task-input");
const taskdateInputField = document.querySelector("#taskdate-input");
const noValue = document.querySelector("#no-value");
const modalAddTaskBtn = document.querySelector("#btn-addnewtask");
const exitBtn = document.querySelector("#btn-exit");
// tasklist
const taskList = document.querySelector("#list-tasks");
// app buttons
const addTaskBtn = document.querySelector("#btn-addtask");
const footerBtns = document.querySelector("#btns-footer-section");
const clearListBtn = document.querySelector("#clearlist-btn");
const sortListBtn = document.querySelector("#sortlist-btn");
// edit option
let editTaskEl = "";
let editTaskDateEl = "";
let editFlag = false;
let editID = "";
// empty array for new Task objects
let taskArray = [];

/*************************
 * CLASSES
 *************************/
class Task {
  constructor(taskid, taskname, taskdate) {
    this._taskid = taskid;
    this._taskname = taskname;
    this._taskdate = taskdate;
  }

  get taskid() {
    return this._taskid;
  }

  set taskid(newTaskId) {
    this._taskid = newTaskId;
  }

  get taskname() {
    return this._taskname;
  }

  set taskname(newTaskName) {
    this._taskname = newTaskName;
  }

  get taskdate() {
    return this._taskdate;
  }

  set taskdate(newTaskName) {
    this._taskdate = newTaskName;
  }
}

/*************************
 * EVENT LISTENERS
 *************************/

// modal open with background blur
addTaskBtn.addEventListener("click", () => {
  dialog.showModal();
  body.classList.add("modal-open");
});

// modal close
exitBtn.addEventListener("click", () => {
  dialog.close();
  body.classList.remove("modal-open");
});

// add new task
modalAddTaskBtn.addEventListener("click", addTask);

// clear task list
clearListBtn.addEventListener("click", clearList);

// sort tasks alphabetically
sortListBtn.addEventListener("click", sortList);

// load tasks
window.addEventListener("DOMContentLoaded", setupTasks);

/********************
 * FUNCTIONS
 ********************/

/********** Add new task **********/
function addTask(event) {
  event.preventDefault();
  // store user input into variables
  let userInput = document.querySelector("#task-input").value;
  let userInputDate = document.querySelector("#taskdate-input").value;
  // create unique id for each new task
  let newtaskId = new Date().getTime().toString();
  // make first letter uppercase
  let userInputTask = userInput.charAt(0).toUpperCase() + userInput.slice(1);

  // input instruction set to none
  noValue.innerHTML = "";

  // if task input field is not empty and no task is not being edited
  if (userInputTask !== "" && !editFlag) {
    // instantiate new object
    let newTask = new Task(newtaskId, userInputTask, userInputDate);
    // add object to task array
    taskArray.push(newTask);

    // create new list element
    const listElement = document.createElement("LI");
    // add class
    listElement.classList.add("list-item");
    // add id
    const attr = document.createAttribute("data-id");
    attr.value = newtaskId;
    listElement.setAttributeNode(attr);

    // add user input to list element
    listElement.innerHTML = `
    <div class="list-task-text">
      <ion-icon name="square-outline"></ion-icon>
      <p class="task-heading-text">${newTask.taskname}</p>
      <p class="task-date-text">${newTask.taskdate}</p>
    </div>
    <div class="list-task-btns">
      <button id="edittask-btn" class="edittask-btn">
      <ion-icon name="pencil-outline" class="edittask-icon"></ion-icon>
      </button>
      <button id="deletetask-btn" class="deletetask-btn">
      <ion-icon name="trash" class="deletetask-icon"></ion-icon>
      </button>
    </div>`;

    // variables and event listeners created after new task created
    const listItem = taskList.querySelector(".list-item");
    const taskText = listElement.querySelector(".list-task-text");
    const deleteBtn = listElement.querySelector("#deletetask-btn");
    const editBtn = listElement.querySelector("#edittask-btn");

    deleteBtn.addEventListener("click", deleteTask);
    editBtn.addEventListener("click", editTask);

    // add list element to DOM
    taskList.appendChild(listElement);

    // modal close
    dialog.close();
    body.classList.remove("modal-open");

    // display footer buttons
    footerBtns.classList.remove("hidden");

    // task completed
    taskText.addEventListener("click", function () {
      taskText.classList.toggle("list-item-completed");
      listElement.classList.toggle("completed");
    });

    addToLocalStorage();

    setBackToDefault();

    // if task input field is not empty and task is being edited
  } else if (userInputTask !== "" && editFlag) {
    editTaskEl.innerHTML = userInputTask;
    editTaskDateEl.innerHTML = userInputDate;

    // modal close
    dialog.close();
    body.classList.remove("modal-open");

    setBackToDefault();

    // editLocalStorage(editId, newTask);

    // if task input field is empty
  } else if (userInputTask === "") {
    noValue.innerHTML = "Please enter a task";
  } else {
    noValue.innerHTML = "";
  }
}

/********** Clear task list **********/
function clearList() {
  const tasksAll = document.querySelectorAll(".list-item");

  if (tasksAll.length > 0) {
    tasksAll.forEach(function (listItem) {
      taskList.removeChild(listItem);
    });
    setBackToDefault();
    // clear local storage
    localStorage.removeItem("todo-app-storage-key");
  }

  // hide footer buttons
  footerBtns.classList.add("hidden");
}

/********** Sort list alphabetically **********/
function sortList() {
  [...taskList.children]
    .sort((a, b) => (a.innerText > b.innerText ? 1 : -1))
    .forEach((node) => taskList.appendChild(node));
}

/********** Delete task from list **********/
function deleteTask(event) {
  // select list element
  const element = event.currentTarget.parentElement.parentElement;
  // access list element id
  const id = element.dataset.id;
  // remove selected element
  taskList.removeChild(element);
  // hide footer buttons when no tasks exist
  if (taskList.children.length === 0) {
    footerBtns.classList.add("hidden");
  }
  setBackToDefault();

  // removeFromLocalStorage(id);
}

/********** Edit task in list **********/
function editTask(event) {
  // select list element
  const element = event.currentTarget.parentElement.parentElement;
  // select paragraph elements containing task name and date
  editTaskEl =
    event.currentTarget.parentElement.previousElementSibling.children[1];
  editTaskDateEl =
    event.currentTarget.parentElement.previousElementSibling.children[2];
  // set input value to task name and date before edit
  taskInputField.value = editTaskEl.innerHTML;
  taskdateInputField.value = editTaskDateEl.innerHTML;
  // change modal heading
  modalHeading.innerHTML = "Edit task";
  // change edit option variable values
  editId = element.dataset.id;
  editFlag = true;
  // modal close
  dialog.showModal();
  body.classList.add("modal-open");

  // editLocalStorage(id)
}

/********** Set modal back to default **********/
function setBackToDefault() {
  taskInputField.value = "";
  taskdateInputField.value = "";
  editFlag = false;
  editID = "";
  modalHeading.innerHTML = "Add new task";
}

/*************************
 * LOCAL STORAGE
 *************************/

function addToLocalStorage() {
  taskArray = JSON.stringify(taskArray);
  localStorage.setItem(toDoAppKey, taskArray);
  taskArray = JSON.parse(localStorage.getItem(toDoAppKey));
}

// function removeFromLocalStorage(id) {}

// function removeFromLocalStorage(id) {}

// function editLocalStorage(id, value) {}

/*************************
 * SETUP TASKS
 *************************/
