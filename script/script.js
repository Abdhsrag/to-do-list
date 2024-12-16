const newTask = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addButton = document.getElementById("addButton");
const clearButton = document.getElementById("clearButton");

// Popups
const addPopUp = document.getElementById("addPopUp");
const deletePopUp = document.getElementById("deletePopUp");
const updatePopUp = document.getElementById("updatePopUp");
const completePopUp = document.getElementById("completePopUp");

// Function to save tasks to localStorage
function saveTasks() {
    const tasks = [];
    const listItems = taskList.getElementsByTagName("li");
    for (let item of listItems) {
        const taskText = item.getElementsByTagName("span")[0].innerText;
        const isChecked = item.getElementsByTagName("input")[0].checked;
        tasks.push({ text: taskText, completed: isChecked });
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
        addTaskToList(task.text, task.completed);
    });
}

// Function to add a task to the list
function addTaskToList(taskText, isCompleted) {
    const listItem = document.createElement("li");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = isCompleted;
    listItem.appendChild(check);

    const taskSpan = document.createElement("span");
    taskSpan.innerText = taskText;
    listItem.appendChild(taskSpan);

    // Set initial styles based on completion status
    taskSpan.style.color = isCompleted ? "#118B50" : "#7D0A0A";
    taskSpan.style.textDecoration = isCompleted ? "line-through" : "none";
        // Add hover effect
        listItem.addEventListener("mouseover", () => {
            listItem.style.backgroundColor = "#f0f0f0"; // Change background color on hover
            listItem.classList.add("floating");
        });
    
        listItem.addEventListener("mouseout", () => {
            listItem.style.backgroundColor = ""; // Reset background color when not hovering
            listItem.classList.remove("floating");
        });

    // Add color change logic
    check.addEventListener("change", () => {
        taskSpan.style.color = check.checked ? "#118B50" : "#7D0A0A";
        taskSpan.style.textDecoration = check.checked ? "line-through" : "none";
        if (check.checked) {
            showPopup(completePopUp); 
            setTimeout(() => completePopUp.classList.remove('show'), 2000); 
        }
        saveTasks();
    });

    // Add delete button logic
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("id", "deleteButton");
    deleteButton.innerText = "Delete";
    listItem.appendChild(deleteButton);

    // Add delete button functionality
    deleteButton.addEventListener("click", () => {
        listItem.remove();
        showPopup(deletePopUp); 
        setTimeout(() => deletePopUp.classList.remove('show'), 2000); 
        saveTasks();
    });

    // Add update button
    const updateButton = document.createElement("button");
    updateButton.setAttribute("id", "updateButton");
    updateButton.innerText = "Update";
    listItem.appendChild(updateButton);

    // Add update button functionality
    updateButton.addEventListener("click", () => {
        if (updateButton.innerText === "Update") {
            const inputField = document.createElement("input");
            inputField.type = "text";
            inputField.value = taskSpan.innerText;
            listItem.insertBefore(inputField, taskSpan);
            listItem.removeChild(taskSpan);

            // Create a new Save button
            const saveButton = document.createElement("button");
            saveButton.innerText = "Save";
            saveButton.style.color = "#fff";
            saveButton.style.backgroundColor = "#118B50";
            saveButton.style.marginLeft = "0.5rem";
            listItem.appendChild(saveButton);

            // Hide the Update button
            updateButton.style.display = "none";

            // Save button functionality
            saveButton.addEventListener("click", () => {
                if (inputField.value !== "") {
                    taskSpan.innerText = inputField.value;
                    listItem.insertBefore(taskSpan, inputField);
                    listItem.removeChild(inputField);
                    updateButton.style.display = "inline"; 
                    saveButton.remove(); 
                    showPopup(updatePopUp);
                    setTimeout(() => updatePopUp.classList.remove('show'), 2000); 
                    saveTasks();
                }
            });
        }
    });

    taskList.appendChild(listItem);
}

// Event listener for adding a new task
addButton.addEventListener("click", () => {
    if (newTask.value !== "") {
        addTaskToList(newTask.value, false);
        newTask.value = ""; // Clear the input field
        showPopup(addPopUp); // Show add popup
        setTimeout(() => addPopUp.classList.remove('show'), 2000); 
        saveTasks();
    }
});

// Event listener for clearing all tasks
clearButton.addEventListener("click", () => {
    taskList.innerHTML = ""; // Clear the task list
    localStorage.removeItem("tasks"); // Clear tasks from localStorage
});

// Function to show popup with animation
function showPopup(popup) {
  popup.classList.remove('show'); 
  void popup.offsetWidth; 
  popup.classList.add('show'); 
}


// Load tasks on page load
loadTasks();