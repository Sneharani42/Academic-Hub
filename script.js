document.addEventListener("DOMContentLoaded", () => {
  // Screen Elements
  const loginScreen = document.getElementById("loginScreen");
  const dashboardScreen = document.getElementById("dashboardScreen");
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const welcomeUserText = document.getElementById("welcomeUserText");

  // Theme Toggle Elements (Synced across Login & Dashboard)
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const loginThemeToggle = document.getElementById("loginThemeToggle");

  function toggleDarkMode() {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    const label = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    themeToggleBtn.innerHTML = label;
    loginThemeToggle.innerHTML = label;
  }

  themeToggleBtn.addEventListener("click", toggleDarkMode);
  loginThemeToggle.addEventListener("click", toggleDarkMode);

  // FRONT LOGIN & LOGOUT TRANSITION LOGIC
  const enrollmentInput = document.getElementById("enrollmentNo");

  // Strip any non-numeric characters immediately as the user types or pastes
  enrollmentInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const studentName = document.getElementById("studentName").value.trim();
    const enrollmentNo = enrollmentInput.value.trim();

    // Strict check: must be exactly 11 digits
    if (!/^\d{11}$/.test(enrollmentNo)) {
      alert("Please enter a valid 11-digit numeric Enrollment Number.");
      enrollmentInput.focus();
      return;
    }

    if (studentName) {
      welcomeUserText.textContent = `${studentName} • ${enrollmentNo}`;
      loginScreen.classList.add("hidden");
      dashboardScreen.classList.remove("hidden");
    }
  });

  logoutBtn.addEventListener("click", () => {
    dashboardScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
    loginForm.reset();
  });

  // MOTIVATIONAL QUOTES BANNER
  const quoteText = document.getElementById("quoteText");
  const quoteAuthor = document.getElementById("quoteAuthor");
  const quotes = [
    { text: '"The future belongs to those who believe in the beauty of their dreams."', author: "— Eleanor Roosevelt" },
    { text: '"Success is not final, failure is not fatal: It is the courage to continue that counts."', author: "— Winston Churchill" },
    { text: '"Believe you can and you\'re halfway there."', author: "— Theodore Roosevelt" },
    { text: '"Strive for perfection in everything you do. Take the best that exists and make it better."', author: "— Sir Henry Royce" }
  ];

  function setRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteText.textContent = quotes[randomIndex].text;
    quoteAuthor.textContent = quotes[randomIndex].author;
  }
  setRandomQuote();

  // TAB NAVIGATION
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      const targetTabId = btn.getAttribute("data-tab");
      document.getElementById(targetTabId).classList.add("active");
    });
  });

  // WIDGET 1: Attendance Tracker
  let subjects = [
    { id: 1, name: "Applied Mathematics", attended: 22, total: 25 },
    { id: 2, name: "WAD", attended: 15, total: 22 }
  ];

  const addSubjectForm = document.getElementById("addSubjectForm");
  const subjectList = document.getElementById("subjectList");
  const overallAttendance = document.getElementById("overallAttendance");

  function renderAttendance() {
    subjectList.innerHTML = "";
    let totalAttended = 0;
    let totalHeld = 0;

    subjects.forEach((sub) => {
      totalAttended += sub.attended;
      totalHeld += sub.total;

      const percentage = sub.total > 0 ? ((sub.attended / sub.total) * 100).toFixed(1) : 0;
      const isLow = percentage < 75;

      const card = document.createElement("div");
      card.className = "item-card";
      card.innerHTML = `
        <div class="item-info">
          <h4>${sub.name}</h4>
          <p>${sub.attended} / ${sub.total} Classes Attended — 
            <span class="${isLow ? 'badge-warning' : 'badge-good'}">${percentage}%</span>
            ${isLow ? ' ⚠️ Low Attendance' : ''}
          </p>
        </div>
        <div class="action-btns">
          <button class="btn-sm" onclick="adjustAttendance(${sub.id}, 1, 1)">+ Present</button>
          <button class="btn-sm" onclick="adjustAttendance(${sub.id}, 0, 1)">+ Absent</button>
          <button class="btn-danger" onclick="deleteSubject(${sub.id})"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
      subjectList.appendChild(card);
    });

    const overallPct = totalHeld > 0 ? ((totalAttended / totalHeld) * 100).toFixed(1) : "0.0";
    overallAttendance.textContent = `Overall: ${overallPct}%`;
  }

  addSubjectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("subjectName").value.trim();
    const attended = parseInt(document.getElementById("attendedClasses").value);
    const total = parseInt(document.getElementById("totalClasses").value);

    if (name && !isNaN(attended) && !isNaN(total)) {
      subjects.push({ id: Date.now(), name, attended, total });
      addSubjectForm.reset();
      renderAttendance();
    }
  });

  window.adjustAttendance = (id, addAttended, addTotal) => {
    subjects = subjects.map(s => {
      if (s.id === id) {
        return { ...s, attended: s.attended + addAttended, total: s.total + addTotal };
      }
      return s;
    });
    renderAttendance();
  };

  window.deleteSubject = (id) => {
    subjects = subjects.filter(s => s.id !== id);
    renderAttendance();
  };

  renderAttendance();

  // WIDGET 2: Notes Vault
  let notes = [
    { id: 1, title: "Physics Unit 1 Notes", subject: "Physics", content: "Topics covered: Quantum Theory, Photoelectric Effect, and Wave Mechanics." }
  ];

  const addNoteForm = document.getElementById("addNoteForm");
  const notesGrid = document.getElementById("notesGrid");
  const searchNotes = document.getElementById("searchNotes");

  function renderNotes(filterQuery = "") {
    notesGrid.innerHTML = "";
    const filtered = notes.filter(n => 
      n.title.toLowerCase().includes(filterQuery.toLowerCase()) || 
      n.subject.toLowerCase().includes(filterQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(filterQuery.toLowerCase())
    );

    filtered.forEach(note => {
      const card = document.createElement("div");
      card.className = "note-item";
      card.innerHTML = `
        <div>
          <span class="note-tag">${note.subject}</span>
          <h4 style="margin: 8px 0 4px 0;">${note.title}</h4>
          <p>${note.content}</p>
        </div>
        <div style="text-align: right;">
          <button class="btn-danger" onclick="deleteNote(${note.id})"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
      notesGrid.appendChild(card);
    });
  }

  addNoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("noteTitle").value.trim();
    const subject = document.getElementById("noteSubject").value.trim();
    const content = document.getElementById("noteContent").value.trim();

    if (title && subject && content) {
      notes.push({ id: Date.now(), title, subject, content });
      addNoteForm.reset();
      renderNotes();
    }
  });

  searchNotes.addEventListener("input", (e) => {
    renderNotes(e.target.value);
  });

  window.deleteNote = (id) => {
    notes = notes.filter(n => n.id !== id);
    renderNotes(searchNotes.value);
  };

  renderNotes();

  // WIDGET 3: To-Do List
  let todos = [
    { id: 1, text: "Submit Chemistry Lab Record", completed: false },
    { id: 2, text: "Revise Math Unit 2", completed: true }
  ];
  let currentFilter = "all";

  const addTodoForm = document.getElementById("addTodoForm");
  const todoInput = document.getElementById("todoInput");
  const todoList = document.getElementById("todoList");
  const filterBtns = document.querySelectorAll(".filter-btn");

  function renderTodos() {
    todoList.innerHTML = "";
    const filtered = todos.filter(t => {
      if (currentFilter === "active") return !t.completed;
      if (currentFilter === "completed") return t.completed;
      return true;
    });

    filtered.forEach(todo => {
      const li = document.createElement("li");
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <div class="todo-left">
          <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${todo.id})" />
          <span>${todo.text}</span>
        </div>
        <button class="btn-danger" onclick="deleteTodo(${todo.id})"><i class="fa-solid fa-trash"></i></button>
      `;
      todoList.appendChild(li);
    });
  }

  addTodoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
      todos.push({ id: Date.now(), text, completed: false });
      todoInput.value = "";
      renderTodos();
    }
  });

  window.toggleTodo = (id) => {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    renderTodos();
  };

  window.deleteTodo = (id) => {
    todos = todos.filter(t => t.id !== id);
    renderTodos();
  };

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      renderTodos();
    });
  });

  renderTodos();
});