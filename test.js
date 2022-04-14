function deleteTask(taskid) {
  taskArray = taskArray.filter(function (newTask) {
    return newTask.taskid != taskid;
  });
  addToLocalStorage(taskArray);
  if (taskList.children.length === 0) {
    footerBtns.classList.add("hidden");
  }
  setBackToDefault();
}

// editTask(id);

// clearList(taskArray);

// sortList();

taskList.addEventListener("click", function (event) {
  if (event.target.classList.contains("deletetask-btn")) {
    deleteTask(
      event.target.parentElement.parentElement.getAttribute("data-id")
    );
  }
});
