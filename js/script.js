import { Task } from "../classes/Task.js";

/*************************
 * TODAY'S DATE
 *************************/

const date = new Date();
const DATE_HEADER = date.toDateString();

const todaysDate = document.querySelector("#header-date");
todaysDate.innerHTML = DATE_HEADER;

/*************************
 * VARIABLES
 *************************/

const TODO_APP_KEY = "todo-app-storage-key";
const appWindow = document.querySelector(".app-box");

// modal
const dialog = document.querySelector("#modal");
const modalHeading = document.querySelector("#modal-heading");
const taskInputField = document.querySelector("#task-input");
const taskdateInputField = document.querySelector("#taskdate-input");
const noValue = document.querySelector("#no-value");
const exitBtn = document.querySelector("#exit-btn");

// tasklist
const taskList = document.querySelector("#task-list");

// app buttons
const addTaskBtn = document.querySelector("#addtask-btn");
const footerBtns = document.querySelector("#editlist-btns");
const clearListBtn = document.querySelector("#clearlist-btn");
const sortListBtn = document.querySelector("#sortlist-btn");

// empty array for new Task objects
let taskArray = [];

/*************************
 * EVENT LISTENERS
 *************************/

// modal open
addTaskBtn.addEventListener("click", modalOpen);

// modal close
exitBtn.addEventListener("click", modalClose);

// add new task
dialog.addEventListener("submit", function (event) {
  event.preventDefault();
  addTask(
    new Date().getTime().toString(),
    taskInputField.value,
    taskdateInputField.value
  );
});

// clear task list
clearListBtn.addEventListener("click", clearList);

// sort tasks alphabetically
sortListBtn.addEventListener("click", sortList);

// delete task
taskList.addEventListener("click", function (event) {
  if (event.target.classList.contains("deletetask-btn")) {
    deleteTask(
      event.target.parentElement.parentElement.getAttribute("data-id")
    );
  }
});

// display footer buttons
window.addEventListener("DOMContentLoaded", () => {
  if (taskArray !== []) {
    footerBtns.classList.remove("hidden");
  } else if (taskArray === []) {
    footerBtns.classList.add("hidden");
  }
});

/********************
 * FUNCTIONS
 ********************/

/********** Add new task **********/
function addTask(id, name, date) {
  // input instruction set to none
  noValue.innerHTML = "";

  // if task input field is not empty and no task is being edited
  if (name !== "" && date !== "") {
    // instantiate new object
    let newTask = new Task(id, name, date);

    // add object to task array
    taskArray.push(newTask);

    // add to local storage
    addToLocalStorage(taskArray);

    // modal close
    modalClose();

    // display footer buttons
    footerBtns.classList.remove("hidden");

    // set back to default
    setBackToDefault();

    // if task input field is empty
  } else if (name === "" && date !== "") {
    noValue.innerHTML = "Please enter a task";
  } else if (date === "" && name !== "") {
    noValue.innerHTML = "Please enter a date";
  } else if (date === "" && name === "") {
    noValue.innerHTML = "Please enter a task and date";
  } else {
    noValue.innerHTML = "";
  }
}

/********** Create new task and add to DOM **********/
function renderTasks(taskArray) {
  // clear everything inside <ul>
  taskList.innerHTML = "";

  taskArray.forEach(function (newTask) {
    // create new list element
    const listElement = document.createElement("li");
    // add class
    listElement.classList.add("list-item");
    // add id
    const attr = document.createAttribute("data-id");
    attr.value = newTask._taskid;
    listElement.setAttributeNode(attr);

    // add user input to list element
    listElement.innerHTML =
      /*html*/
      `<div class="list-task-text">
      <label>
              <input type="checkbox" />
              <span class="bubble"></span>
            </label>
        <input type="text" class="task-text" value="${newTask._taskname}" readonly>
        <input type="datetime-local" class="task-date" value="${newTask._taskdate}" readonly/>
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
    const taskText = listElement.querySelector(".list-task-text");
    const editBtn = listElement.querySelector("#edittask-btn");

    // edit task
    editBtn.addEventListener("click", editTask);

    // add list element to DOM
    taskList.appendChild(listElement);

    // task completed
    taskText.addEventListener("click", function () {
      taskText.classList.toggle("list-item-completed");
      listElement.classList.toggle("completed");
    });
  });
}

getFromLocalStorage();

/********** Clear task list **********/
function clearList() {
  const tasksAll = document.querySelectorAll(".list-item");

  if (tasksAll.length > 0) {
    tasksAll.forEach(function (listItem) {
      taskList.removeChild(listItem);
    });

    // set back to default
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
function deleteTask(taskid) {
  taskArray = taskArray.filter(function (newTask) {
    return newTask._taskid != taskid;
  });
  addToLocalStorage(taskArray);

  if (taskList.children.length === 0) {
    footerBtns.classList.add("hidden");
  }
  setBackToDefault();
}

/********** Edit task in list **********/
function editTask(event) {
  const element = event.currentTarget.parentElement.parentElement;
  const editTaskEl =
    event.currentTarget.parentElement.previousElementSibling.children[0];
  editTaskEl.removeAttribute("readonly");
  editTaskEl.focus();
  editTaskEl.addEventListener("blur", (e) => {
    editTaskEl.setAttribute("readonly", true);

    let updateTask = taskArray.find(function (newTask) {
      return newTask._taskid == element.dataset.id;
    });
    updateTask._taskname = e.target.value;
    addToLocalStorage(taskArray);
  });

  const editTaskDateEl =
    event.currentTarget.parentElement.previousElementSibling.children[1];

  editTaskDateEl.removeAttribute("readonly");
  // editTaskDateEl.focus();
  editTaskDateEl.addEventListener("blur", (e) => {
    editTaskDateEl.setAttribute("readonly", true);

    let updateTask = taskArray.find(function (newTask) {
      return newTask._taskid == element.dataset.id;
    });
    updateTask._taskdate = e.target.value;
    addToLocalStorage(taskArray);
  });
}

/********** Set modal back to default **********/
function setBackToDefault() {
  taskInputField.value = "";
  taskdateInputField.value = "";
  editFlag = false;
  editID = "";
  modalHeading.innerHTML = "Add new task";
}

/********** Modal open **********/
function modalOpen() {
  dialog.showModal();
  appWindow.classList.add("modal-open");
}

/********** Modal close **********/
function modalClose() {
  dialog.close();
  appWindow.classList.remove("modal-open");
}

/*************************
 * LOCAL STORAGE
 *************************/

function addToLocalStorage(taskArray) {
  localStorage.setItem(TODO_APP_KEY, JSON.stringify(taskArray));
  renderTasks(taskArray);
}

function getFromLocalStorage() {
  const reference = localStorage.getItem(TODO_APP_KEY);
  if (reference) {
    taskArray = JSON.parse(reference);
    renderTasks(taskArray);
  }
}
