/********************
 * REFERENCES
 ********************/
const addTaskBtn = document.getElementById("btn-addtask");
const exitBtn = document.getElementById("btn-exit");
const dialog = document.getElementById("dialog-newtask");
const addNewTaskBtn = document.getElementById("btn-addnewtask");
const footerBtns = document.getElementById("btns-footer-section");
const clearListBtn = document.getElementById("clearlist-btn");
const sortListBtn = document.getElementById("sortlist-btn");
const taskList = document.getElementById("list-tasks");
const taskInputField = document.getElementById("input-new-task");
const taskdateInputField = document.getElementById("input-new-taskdate");
let taskArray = [];
/********************
 * EVENT LISTENERS
 ********************/
// modal open
addTaskBtn.addEventListener("click", () => {
  dialog.showModal();
});

// modal close
exitBtn.addEventListener("click", () => {
  dialog.close();
});

// add new task
addNewTaskBtn.addEventListener("click", addTask);

// task completed

// clear task list
clearListBtn.addEventListener("click", clearList);

// sort tasks alphabetically
sortListBtn.addEventListener("click", sortList);

/********************
 * CLASSES
 ********************/

class Task {
  _taskid;
  _taskname;
  _taskdate;

  constructor(taskid, taskname, taskdate) {
    this._taskid = taskid;
    this._taskname = taskname;
    this._taskdate = taskdate;
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

/********************
 * FUNCTIONS
 ********************/
function addTask(e) {
  e.preventDefault();
  // store user input into variables
  let userInputTask = document.getElementById("input-new-task").value;
  let userInputDate = document.getElementById("input-new-taskdate").value;
  const noValue = document.getElementById("no-value");
  let newtaskId = new Date().getTime().toString();

  // input instruction set to none
  noValue.innerHTML = "";

  if (userInputTask !== "" && userInputDate !== "") {
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
    listElement.innerHTML = `<ion-icon name="square-outline"></ion-icon>
  <div class="task-text">
    <p class="task-heading-text">${newTask.taskname}</p>
    <p class="task-date-text">${newTask.taskdate}</p>
  </div>
  <div>
    <ion-icon name="pencil-outline"  class="deletetask-btn" id="deletetask-btn"></ion-icon>
    <ion-icon name="close-outline"  class="edittask-btn" id="edittask-btn"></ion-icon>
  </div>`;

    // add list element to DOM
    taskList.appendChild(listElement);

    // task completed
    listElement.addEventListener("click", function () {
      listElement.classList.add("list-item-completed");
    });

    // modal close
    dialog.close();

    // display footer buttons
    footerBtns.style.display = "block";
  } else if (userInputTask === "" && userInputDate === "") {
    noValue.innerHTML = "Please enter a task and date";
  } else if (userInputTask === "" && userInputDate !== "") {
    noValue.innerHTML = "Please enter a task";
  } else if (userInputTask !== "" && userInputDate === "") {
    noValue.innerHTML = "Please enter a date";
  } else {
    noValue.innerHTML = "";
  }
}

function clearList() {
  const tasksAll = document.querySelectorAll(".list-item");

  if (tasksAll.length > 0) {
    tasksAll.forEach(function (listElement) {
      taskList.removeChild(listElement);
    });
  }

  // hide footer buttons
  footerBtns.style.display = "none";
}

function sortList() {
  [...taskList.children]
    .sort((a, b) => (a.innerText > b.innerText ? 1 : -1))
    .forEach((node) => taskList.appendChild(node));
}

/********************
 * LOCAL STORAGE
 ********************/

/********************
 * SETUP ITEMS
 ********************/
