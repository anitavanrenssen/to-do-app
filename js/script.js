/********************
 * SELECT ITEMS
 ********************/
const addTaskBtn = document.getElementById("btn-addtask");
const exitBtn = document.getElementById("btn-exit");
const dialog = document.getElementById("dialog-newtask");
const addNewTaskBtn = document.getElementById("btn-addnewtask");
const footerBtns = document.getElementById("btns-footer-section");
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

/********************
 * FUNCTIONS
 ********************/
function addTask(e) {
  e.preventDefault();
  // store user input into variable
  let userInputTask = document.getElementById("input-new-task").value;
  let userInputDate = document.getElementById("input-new-taskdate").value;

  console.log(userInputTask, userInputDate);

  // modal close
  dialog.close();
  // display footer buttons
  footerBtns.style.display = "block";
}

/********************
 * LOCAL STORAGE
 ********************/

/********************
 * SETUP ITEMS
 ********************/
