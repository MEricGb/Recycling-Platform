document.addEventListener('DOMContentLoaded', async () => {
  const isAdmin = localStorage.getItem('isAdmin');

  // Check if user is admin
  if (isAdmin !== 'true') {
    alert('Acces interzis. Doar administratorii pot accesa această pagină.');
    window.location = 'index.html';
    return;
  }

  // Load all data
  await loadQuestions();
  await loadEvents();
  await loadUsers();

  // Question form
  document.getElementById('add-question-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const question = form['question'].value;
    const answers = [
      form['answer_a'].value,
      form['answer_b'].value,
      form['answer_c'].value,
      form['answer_d'].value
    ];
    const correct = parseInt(form['correct'].value);

    try {
      const res = await fetch('/api/quiz/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answers, correct })
      });
      if (res.ok) {
        alert('Întrebare adăugată!');
        form.reset();
        await loadQuestions();
      } else {
        alert('Eroare la adăugare');
      }
    } catch (err) {
      alert('Eroare de conexiune');
    }
  });

  // Event form
  document.getElementById('add-event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form['title'].value;
    const date = form['date'].value;
    const location = form['location'].value;

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, location })
      });
      if (res.ok) {
        alert('Eveniment adăugat!');
        form.reset();
        await loadEvents();
      } else {
        alert('Eroare la adăugare');
      }
    } catch (err) {
      alert('Eroare de conexiune');
    }
  });
});

// Tab switching
function showSection(section) {
  // Hide all sections
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.admin-tabs button').forEach(b => b.classList.remove('active'));

  // Show selected section
  document.getElementById(`${section}-section`).classList.add('active');
  event.target.classList.add('active');
}

// QUESTIONS
async function loadQuestions() {
  const container = document.getElementById('questions-list');
  try {
    const res = await fetch('/api/quiz/questions');
    const questions = await res.json();

    if (questions.length === 0) {
      container.innerHTML = '<p>Nu există întrebări.</p>';
      return;
    }

    const letters = ['A', 'B', 'C', 'D'];
    container.innerHTML = questions.map(q => `
      <div class="item-card">
        <div class="item-info">
          <strong>${q.question}</strong><br>
          <small>A: ${q.answers[0]} | B: ${q.answers[1]} | C: ${q.answers[2]} | D: ${q.answers[3]}</small><br>
          <small><em>Corect: ${letters[q.correct]}</em></small>
        </div>
        <button class="delete-btn" onclick="deleteQuestion(${q.id})">Șterge</button>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p>Eroare la încărcare.</p>';
  }
}

async function deleteQuestion(id) {
  if (!confirm('Ștergi această întrebare?')) return;
  try {
    const res = await fetch(`/api/quiz/questions/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await loadQuestions();
    }
  } catch (err) {
    alert('Eroare la ștergere');
  }
}

// EVENTS
async function loadEvents() {
  const container = document.getElementById('events-list');
  try {
    const res = await fetch('/api/events');
    const events = await res.json();

    if (events.length === 0) {
      container.innerHTML = '<p>Nu există evenimente.</p>';
      return;
    }

    container.innerHTML = events.map(e => `
      <div class="item-card">
        <div class="item-info">
          <strong>${e.title}</strong><br>
          <small>${e.date} - ${e.location}</small>
        </div>
        <button class="delete-btn" onclick="deleteEvent(${e.id})">Șterge</button>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p>Eroare la încărcare.</p>';
  }
}

async function deleteEvent(id) {
  if (!confirm('Ștergi acest eveniment?')) return;
  try {
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await loadEvents();
    }
  } catch (err) {
    alert('Eroare la ștergere');
  }
}

// USERS
async function loadUsers() {
  const container = document.getElementById('users-list');
  try {
    const res = await fetch('/api/admin/users');
    const users = await res.json();

    if (users.length === 0) {
      container.innerHTML = '<p>Nu există utilizatori.</p>';
      return;
    }

    container.innerHTML = users.map(u => `
      <div class="item-card">
        <div class="item-info">
          <strong>${u.name || 'Fără nume'}</strong>
          ${u.is_admin ? '<span class="admin-badge">ADMIN</span>' : ''}<br>
          <small>${u.email}</small>
        </div>
        <button class="delete-btn" onclick="deleteUser(${u.id})">Șterge</button>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p>Eroare la încărcare.</p>';
  }
}

async function deleteUser(id) {
  if (!confirm('Ștergi acest utilizator? Toate datele asociate vor fi șterse.')) return;
  try {
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await loadUsers();
    }
  } catch (err) {
    alert('Eroare la ștergere');
  }
}
