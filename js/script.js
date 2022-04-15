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
// const modalAddTaskBtn = document.querySelector("#save-btn");
const exitBtn = document.querySelector("#exit-btn");

// tasklist
const taskList = document.querySelector("#task-list");

// app buttons
const addTaskBtn = document.querySelector("#addtask-btn");
const footerBtns = document.querySelector("#editlist-btns");
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

  set taskid(newtaskid) {
    this._taskid = newtaskid;
  }

  get taskname() {
    return this._taskname;
  }

  set taskname(newtaskname) {
    this._taskname = newtaskname;
  }

  get taskdate() {
    return this._taskdate;
  }

  set taskdate(newtaskdate) {
    this._taskid = newtaskdate;
  }
}

/*************************
 * EVENT LISTENERS
 *************************/

// modal open
addTaskBtn.addEventListener("click", () => {
  dialog.showModal();
  appWindow.classList.add("modal-open");
});

// modal close
exitBtn.addEventListener("click", () => {
  dialog.close();
  appWindow.classList.remove("modal-open");
});

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

//
taskList.addEventListener("click", function (event) {
  if (event.target.classList.contains("deletetask-btn")) {
    deleteTask(
      event.target.parentElement.parentElement.getAttribute("data-id")
    );
  }
  // if (event.target.classList.contains("edittask-btn")) {
  //   editTask();
  // }
});

// load tasks
// window.addEventListener("DOMContentLoaded", setupTasks);

/********************
 * FUNCTIONS
 ********************/

/********** Add new task **********/
function addTask(id, name, date) {
  // input instruction set to none
  noValue.innerHTML = "";

  // if task input field is not empty and no task is not being edited
  if (name !== "" && !editFlag) {
    // instantiate new object
    let newTask = new Task(id, name, date);

    // add object to task array
    taskArray.push(newTask);

    addToLocalStorage(taskArray);

    // modal close
    dialog.close();
    appWindow.classList.remove("modal-open");

    // display footer buttons
    footerBtns.classList.remove("hidden");

    setBackToDefault();

    // if task input field is not empty and task is being edited
  } else if (name !== "" && editFlag) {
    editTaskEl.innerHTML = taskInputField.value;
    editTaskDateEl.innerHTML = taskdateInputField.value;

    // modal close
    dialog.close();
    appWindow.classList.remove("modal-open");

    setBackToDefault();

    editLocalStorage(editID, taskInputField.value, taskdateInputField.value);

    // if task input field is empty
  } else if (name === "") {
    noValue.innerHTML = "Please enter a task";
  } else {
    noValue.innerHTML = "";
  }
}

function renderTasks(taskArray) {
  taskList.innerHTML = "";

  taskArray.forEach(function (newTask) {
    // console.log(newTask);
    // create new list element
    const listElement = document.createElement("li");
    // add class
    listElement.classList.add("list-item");
    // add id
    const attr = document.createAttribute("data-id");
    attr.value = newTask._taskid;
    listElement.setAttributeNode(attr);

    // add user input to list element
    listElement.innerHTML = `
    <div class="list-task-text">
      <p class="task-heading-text">${newTask._taskname}</p>
      <p class="task-date-text">${newTask._taskdate}</p>
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
    // const deleteBtn = listElement.querySelector("#deletetask-btn");
    const editBtn = listElement.querySelector("#edittask-btn");

    // deleteBtn.addEventListener("click", deleteTask);
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
// function deleteTask(event) {
//   // select list element
//   const element = event.currentTarget.parentElement.parentElement;
//   // access list element id
//   const id = element.dataset.id;
//   // remove selected element
//   taskList.removeChild(element);
//   // hide footer buttons when no tasks exist
//   if (taskList.children.length === 0) {
//     footerBtns.classList.add("hidden");
//   }
//   setBackToDefault();

// removeFromLocalStorage(id);
// }

/********** Edit task in list **********/
function editTask(event) {
  const element = event.currentTarget.parentElement.parentElement;
  // select paragraph elements containing task name and date
  editTaskEl =
    event.currentTarget.parentElement.previousElementSibling.children[0];
  editTaskDateEl =
    event.currentTarget.parentElement.previousElementSibling.children[1];
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
  appWindow.classList.add("modal-open");
}

// function editTask(taskid) {

// const todo = todos.find(todo => todo.id == currentlySelectedTodoId);

//   var taskEdit = taskArray.find((b) => b.taskid === taskid);
//   console.log(taskEdit);
//   // if (newTask.taskid === taskid) {
//   //   newTask.taskname = newtaskname;
//   //   newTask.taskdate = newtaskdate;
//   // }
//   dialog.showModal();
//   appWindow.classList.add("modal-open");
// }

// editLocalStorage(id)
// }

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

getFromLocalStorage();

// function editLocalStorage(id, name, date) {
//   let taskArray = getFromLocalStorage();
//   taskArray = taskArray.map(function (newTask) {
//     if (newTask._id === id) {
//       newTask._taskname = name;
//       newTask._taskdate = date;
//     }
//     return newTask;
//   });
//   localStorage.setItem(TODO_APP_KEY, JSON.stringify(taskArray));
// }

// function addToLocalStorage() {
//   taskArray = JSON.stringify(taskArray);
//   localStorage.setItem(toDoAppKey, taskArray);
//   taskArray = JSON.parse(localStorage.getItem(toDoAppKey));
// }

// function removeFromLocalStorage(id) {}

// function editLocalStorage(id, value) {}

/*************************
 * SETUP TASKS
 *************************/
