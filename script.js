let goals = JSON.parse(localStorage.getItem("goals")) || [];

// Open input
function openPrompt() {
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

// Save goal from modal
function saveGoal() {
  let title = document.getElementById("goalInput").value.trim();
if (!title) return showAlert("Enter goal bro");
  let time = document.getElementById("timeInput").value;

  if (!title) return showAlert("Enter goal bro");

  goals.push({
    title,
    time: time || null,
    completed: false,
    notified: false
  });

  save();
  render();

  // reset + close
  document.getElementById("goalInput").value = "";
  document.getElementById("timeInput").value = "";
  closeModal();
}

// Save
function save() {
  localStorage.setItem("goals", JSON.stringify(goals));
}

// Render UI
function render() {
  let list = document.getElementById("list");
  list.innerHTML = "";

  goals.forEach((g, i) => {
    list.innerHTML += `
      <div class="goal">
        <div class="status ${g.completed ? 'green' : 'red'}"></div>

        <h3 class="${g.completed ? 'done' : ''}">
          ${g.title}
        </h3>

        ${g.time ? `<div class="time">${g.time}</div>` : ""}

        <button onclick="toggle(${i})">
          <i data-feather="check"></i>
        </button>

        <button onclick="removeGoal(${i})">
          <i data-feather="x"></i>
        </button>

      </div>
    `;
  });

  feather.replace(); // 🔥 YAHI hona chahiye
}

// Toggle complete
function toggle(i) {
  goals[i].completed = !goals[i].completed;
  save();
  render();
}

// Delete
function removeGoal(i) {
  goals.splice(i, 1);
  save();
  render();
}

// Notifications
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

setInterval(() => {
  let now = new Date();
let currentMinutes = now.getHours() * 60 + now.getMinutes();

goals.forEach(g => {

  if (!g.time) return;

  let [h, m] = g.time.split(":");
  let goalMinutes = parseInt(h) * 60 + parseInt(m);

  // ❌ MISSED TASK
  if (currentMinutes > goalMinutes && !g.completed && !g.notified) {

    showAlert(`❌ Oye… ${g.title} abhi tak complete nahi hua?\nTime nikal gaya bhai 😏`);

    if (Notification.permission === "granted") {
      new Notification("Task Missed ❌", {
        body: `Oye… ${g.title} abhi tak complete nahi hua? Time nikal gaya bhai 😏`
      });
    }

    g.notified = true;
    save();
  }

});

}, 60000);

function showAlert(msg) {
  document.getElementById("alertText").innerText = msg;
  document.getElementById("customAlert").classList.remove("hidden");
}

function closeAlert() {
  document.getElementById("customAlert").classList.add("hidden");
}

  render();
if (Notification.permission !== "granted") {
  Notification.permission !== "denied" && Notification.requestPermission();
}