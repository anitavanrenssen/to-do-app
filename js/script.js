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
// const sortListBtn = document.querySelector("#sortlist-btn");

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
    taskdateInputField.value,
    false
  );
});

// clear task list
clearListBtn.addEventListener("click", clearList);

// sort tasks alphabetically
// sortListBtn.addEventListener("click", sortList);

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
  if (taskArray.length > 0) {
    footerBtns.classList.remove("hidden");
  } else {
    footerBtns.classList.add("hidden");
  }
});

/********************
 * FUNCTIONS
 ********************/

/********** Add new task **********/
function addTask(id, name, date, completed) {
  // input instruction set to none
  noValue.innerHTML = "";

  // if task input field is not empty and no task is being edited
  if (name !== "" && date !== "") {
    // instantiate new object
    let newTask = new Task(id, name, date, completed);

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
          <input type="checkbox" class="checkbox" />    
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
    const checkBox = listElement.querySelector(".checkbox");
    const taskText = listElement.querySelector(".list-task-text");
    const editBtn = listElement.querySelector("#edittask-btn");

    checkBox.checked = newTask._taskcompleted;

    // edit task
    editBtn.addEventListener("click", editTask);

    // add list element to DOM
    taskList.appendChild(listElement);

    if (newTask._taskcompleted) {
      taskText.classList.add("list-item-completed");
      listElement.classList.add("completed");
    }

    // task completed
    checkBox.addEventListener("click", function (e) {
      newTask._taskcompleted = e.target.checked;
      localStorage.setItem(TODO_APP_KEY, JSON.stringify(taskArray));

      if (newTask._taskcompleted) {
        taskText.classList.add("list-item-completed");
        listElement.classList.add("completed");
      } else {
        taskText.classList.remove("list-item-completed");
        listElement.classList.remove("completed");
      }

      renderTasks(taskArray);
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

    // clear local storage
    localStorage.removeItem(TODO_APP_KEY);

    // set back to default
    setBackToDefault();
  }

  // hide footer buttons
  footerBtns.classList.add("hidden");
}

/********** Sort list alphabetically **********/
// function sortList() {
//   // [...taskList.children]
//   //   .sort((a, b) => (a.innerText > b.innerText ? 1 : -1))
//   //   .forEach((node) => taskList.appendChild(node));

//   // const toDateArray = taskArray.map((obj) => {
//   //   return { ...obj, _taskdate: new Date(obj._taskdate) };
//   // });

//   // taskArray = toDateArray.sort((objA, objB) => objA._taskdate - objB._taskdate);

//   // taskArray = taskArray.map((obj) => {
//   //   return { ...obj, _taskdate: obj._taskdate.toString() };
//   // });
//   // console.log(taskArray);

//   // taskArray = taskArray.sort(
//   //   (objA, objB) => Number(objA._taskdate) - Number(objB._taskdate)
//   // );
// }

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
    event.currentTarget.parentElement.previousElementSibling.children[1];

  editTaskEl.removeAttribute("readonly");
  editTaskEl.classList.add("edit-color");
  // editTaskEl.focus();
  editTaskEl.addEventListener("blur", (e) => {
    editTaskEl.setAttribute("readonly", true);

    let updateTask = taskArray.find(function (newTask) {
      return newTask._taskid == element.dataset.id;
    });
    updateTask._taskname = e.target.value;
    editTaskEl.classList.remove("edit-color");
    addToLocalStorage(taskArray);
  });

  const editTaskDateEl =
    event.currentTarget.parentElement.previousElementSibling.children[2];

  editTaskDateEl.removeAttribute("readonly");
  editTaskDateEl.classList.add("edit-color");
  // editTaskDateEl.focus();
  editTaskDateEl.addEventListener("blur", (e) => {
    editTaskDateEl.setAttribute("readonly", true);

    let updateTask = taskArray.find(function (newTask) {
      return newTask._taskid == element.dataset.id;
    });
    updateTask._taskdate = e.target.value;
    editTaskDateEl.classList.remove("edit-color");
    addToLocalStorage(taskArray);
  });
}

/********** Set modal back to default **********/
function setBackToDefault() {
  taskInputField.value = "";
  taskdateInputField.value = "";
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
