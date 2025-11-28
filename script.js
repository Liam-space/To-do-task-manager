// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});

// Add Task
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTask");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";
  let filtered = tasks;

  if (filter === "completed") filtered = tasks.filter(t => t.completed);
  else if (filter === "pending") filtered = tasks.filter(t => !t.completed);
  else if (filter === "important") filtered = tasks.filter(t => t.important);

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""} ${task.important ? "important" : ""}`;
    li.innerHTML = `
      ${task.text}
      <div class="task-buttons">
        <button onclick="toggleComplete(${index})">✔</button>
        <button onclick="toggleImportant(${index})">❗</button>
        <button onclick="deleteTask(${index})">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false, important: false });
  saveTasks();
  taskInput.value = "";
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function toggleImportant(index) {
  tasks[index].important = !tasks[index].important;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

addTaskBtn.addEventListener("click", addTask);

// Filter
document.getElementById("filterTasks").addEventListener("change", e => {
  renderTasks(e.target.value);
});

// Sort
document.getElementById("sortTasks").addEventListener("click", () => {
  tasks.sort((a, b) => {
    if (a.important && !b.important) return -1;
    if (!a.important && b.important) return 1;
    return a.text.localeCompare(b.text);
  });
  saveTasks();
  renderTasks();
});

renderTasks();
