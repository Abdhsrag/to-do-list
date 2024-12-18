//used ot check for task completion
class Task {
  constructor(text, completed = false) {
    this.text = text;
    this.completed = completed;
  }
// toggle task completion
  toggleCompletion() {
    this.completed = !this.completed;
  }
}
// manage tasks and their display using a list
class TaskManager {
  //constructor to initialize task list
  constructor() {
    this.tasks = [];
    this.taskListElement = document.getElementById("taskList");
    this.newTaskInput = document.getElementById("taskInput");
    this.addButton = document.getElementById("addButton");
    this.clearButton = document.getElementById("clearButton");
    this.addPopUp = document.getElementById("addPopUp");
    this.deletePopUp = document.getElementById("deletePopUp");
    this.updatePopUp = document.getElementById("updatePopUp");
    this.completePopUp = document.getElementById("completePopUp");
    this.clearPopUp = document.getElementById("clearPopUp");

    this.loadTasks();
    this.addButton.addEventListener("click", () => this.addTask());
    this.clearButton.addEventListener("click", () => this.clearTasks());
  }
//add task function
  addTask() {
    const taskText = this.newTaskInput.value;
    if (taskText !== "") {
      const newTask = new Task(taskText);
      this.tasks.push(newTask);
      this.addTaskToList(newTask);
      this.newTaskInput.value = ""; // Clear the input field
      this.showPopup(this.addPopUp);
      setTimeout(() => this.addPopUp.classList.remove("show"), 2000);
      this.saveTasks();
    }
  }
// add task to list
  addTaskToList(task) {
    const listItem = document.createElement("li");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.completed;
    listItem.appendChild(check);

    const taskSpan = document.createElement("span");
    taskSpan.innerText = task.text;
    listItem.appendChild(taskSpan);

    // Set initial styles based on completion status
    this.updateTaskStyle(taskSpan, task.completed);

    // Add hover effect
    listItem.addEventListener("mouseover", () => {
      listItem.style.backgroundColor = "#f0f0f0"; // Change background color on hover
      listItem.classList.add("floating");
    });

    listItem.addEventListener("mouseout", () => {
      listItem.style.backgroundColor = ""; // Reset background color when not hovering
      listItem.classList.remove("floating");
    });

    // Add checkbox change logic
    check.addEventListener("change", () => {
      task.toggleCompletion();
      this.updateTaskStyle(taskSpan, task.completed);
      if (task.completed) {
        this.showPopup(this.completePopUp);
        setTimeout(() => this.completePopUp.classList.remove("show"), 2000);
      }
      this.saveTasks();
    });

    // Add delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.setAttribute("id", "deleteButton");
    listItem.appendChild(deleteButton);
    deleteButton.addEventListener("click", () => {
      this.deleteTask(task, listItem);
    });

    // Add update button
    const updateButton = document.createElement("button");
    updateButton.innerText = "Update";
    updateButton.setAttribute("id", "updateButton");
    listItem.appendChild(updateButton);
    updateButton.addEventListener("click", () => {
      this.updateTask(task, taskSpan, updateButton, listItem);
    });

    this.taskListElement.appendChild(listItem);
  }
// update task style for completion
  updateTaskStyle(taskSpan, isCompleted) {
    taskSpan.style.color = isCompleted ? "#118B50" : "#7D0A0A";
    taskSpan.style.textDecoration = isCompleted ? "line-through" : "none";
  }
// delete task function
  deleteTask(task, listItem) {
    this.tasks = this.tasks.filter((t) => t !== task);
    listItem.remove();
    this.showPopup(this.deletePopUp);
    setTimeout(() => this.deletePopUp.classList.remove("show"), 2000);
    this.saveTasks();
  }
// update task function
  updateTask(task, taskSpan, updateButton, listItem) {
    if (updateButton.innerText === "Update") {
      const inputField = document.createElement("input");
      inputField.type = "text";
      inputField.value = taskSpan.innerText;
      listItem.insertBefore(inputField, taskSpan);
      listItem.removeChild(taskSpan);
// Save button logic
      const saveButton = document.createElement("button");
      saveButton.innerText = "Save";
      saveButton.setAttribute("id", "saveButton");
      listItem.appendChild(saveButton);
      updateButton.style.display = "none";
// Save button event listener
      saveButton.addEventListener("click", () => {
        if (inputField.value !== "") {
          task.text = inputField.value; // Update task text
          listItem.insertBefore(taskSpan, inputField);
          listItem.removeChild(inputField);
          updateButton.style.display = "inline"; // Show update button again
          this.showPopup(this.updatePopUp);
          setTimeout(() => this.updatePopUp.classList.remove("show"), 2000);
          this.saveTasks();
          saveButton.style.display = "none";
        }
      });
    }
  }
// clear task function
  clearTasks() {
    this.tasks = [];
    this.taskListElement.innerHTML = ""; // Clear the task list
    this.showPopup(this.clearPopUp); // Show clear popup
    setTimeout(() => this.clearPopUp.classList.remove("show"), 2000);
    this.saveTasks();
  }
// save tasks in local storage
  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }
// load tasks from local storage
  loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach((taskData) => {
      const task = new Task(taskData.text, taskData.completed);
      this.tasks.push(task);
      this.addTaskToList(task);
    });
  }
// show popup function
  showPopup(popup) {
    popup.classList.add("show");
  }
}
//ensure the code runs after the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const taskManager = new TaskManager();
});