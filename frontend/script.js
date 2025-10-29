const API_URL = "http://127.0.0.1:5000"; 

async function addTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const priority = document.getElementById("priority").value;
  const due_date = document.getElementById("due_date").value;

  if (!title || !due_date) {
    alert("Title and Due Date are required!");
    return;
  }

  const task = {
    title,
    description,
    priority,
    due_date,
    status: "pending"
  };

  await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
  });

  loadTasks();
}

async function loadTasks() {
  const status = document.getElementById("filter-status").value;
  const priority = document.getElementById("filter-priority").value;

  let url = `${API_URL}/tasks?`;
  if (status) url += `status=${status}&`;
  if (priority) url += `priority=${priority}`;

  const res = await fetch(url);
  const tasks = await res.json();

  const container = document.getElementById("task-list");
  container.innerHTML = "";

  if (tasks.length === 0) {
    container.innerHTML = "<p>No tasks found for this filter.</p>";
  } else {
    tasks.forEach(t => {
      container.innerHTML += `
        <div class="task">
          <h3>${t.title} <span>(${t.priority})</span></h3>
          <p>${t.description || ""}</p>
          <small>Due: ${t.due_date} | Status: ${t.status}</small><br>
          <button onclick="updateStatus(${t.id}, 'completed')">Done</button>
          <button onclick="editTask(${t.id}, '${t.title}', '${t.description}', '${t.priority}', '${t.due_date}')">Edit</button>
          <button onclick="deleteTask(${t.id})">Delete</button>
        </div>
      `;
    });
  }

  // Load insights with filter values
  loadInsights(status, priority);
}

async function updateStatus(id, status) {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  loadTasks();
}

async function editTask(id, title, desc, priority, due_date) {
  document.getElementById("title").value = title;
  document.getElementById("description").value = desc;
  document.getElementById("priority").value = priority;
  document.getElementById("due_date").value = due_date;

  const btn = document.querySelector("#form-section button");
  btn.textContent = "Update Task";
  btn.onclick = async () => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        priority: document.getElementById("priority").value,
        due_date: document.getElementById("due_date").value
      })
    });
    btn.textContent = "Add Task";
    btn.onclick = addTask;
    loadTasks();
  };
}

async function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  }
}

//  Smart Insights section updated to match filtered tasks
async function loadInsights(statusFilter = "", priorityFilter = "") {
  try {
    let url = `${API_URL}/insights?`;
    if (statusFilter) url += `status=${statusFilter}&`;
    if (priorityFilter) url += `priority=${priorityFilter}`;

    const res = await fetch(url);
    const insights = await res.json();

    console.log("Insights from backend:", insights);

    let message = "";
    const total = insights.total_tasks ?? 0;
    const pending = insights.pending ?? 0;
    const completed = insights.completed ?? 0;

    if (total === 0) {
      message = "No tasks available.";
    } else if (completed === total) {
      message = "All tasks completed! Great job!";
    } else {
      message = `You have ${completed} completed and ${pending} pending tasks.`;
    }

    document.getElementById("insights").innerHTML = `
      <p><b>Total Tasks:</b> ${total}</p>
      <p><b>Pending:</b> ${pending}</p>
      <p><b>Completed:</b> ${completed}</p>
      <p><b>High Priority:</b> ${insights.priority_distribution?.high ?? 0}</p>
      <p style="color: blue;"><b>Message:</b> ${message}</p>
    `;
  } catch (err) {
    console.error("Error loading insights:", err);
    document.getElementById("insights").innerHTML =
      `<p style="color:red;">Error fetching insights</p>`;
  }
}

window.onload = loadTasks;
