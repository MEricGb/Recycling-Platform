document.addEventListener("DOMContentLoaded", async () => {
  const quizContainer = document.getElementById("quiz");
  const resultContainer = document.getElementById("result");
  const submitButton = document.getElementById("submitQuiz");

  const userId = localStorage.getItem('userId');
  let questions = [];

  // Fetch questions from database
  try {
    const res = await fetch('/api/quiz/questions');
    questions = await res.json();
  } catch (err) {
    quizContainer.innerHTML = '<p>Eroare la încărcarea întrebărilor.</p>';
    return;
  }

  if (questions.length === 0) {
    quizContainer.innerHTML = '<p>Nu există întrebări în quiz.</p>';
    submitButton.style.display = 'none';
    return;
  }

  function buildQuiz() {
    const output = questions.map((q, index) => {
      const answersHtml = q.answers.map((answer, i) => `
        <label>
          <input type="radio" name="question${index}" value="${i}">
          ${answer}
        </label>
      `).join('');

      return `
        <div class="question">
          <p>${index + 1}. ${q.question}</p>
          <div class="answers">${answersHtml}</div>
        </div>
      `;
    }).join('');

    quizContainer.innerHTML = output;
  }

  async function showResults() {
    let score = 0;

    questions.forEach((q, index) => {
      const selected = document.querySelector(`input[name=question${index}]:checked`);
      if (selected && parseInt(selected.value) === q.correct) {
        score++;
      }
    });

    resultContainer.innerHTML = `<strong>Ai răspuns corect la ${score} din ${questions.length} întrebări.</strong>`;
    resultContainer.classList.add('success');

    // Save score to database if logged in
    if (userId) {
      try {
        const res = await fetch('/api/quiz/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: parseInt(userId), score })
        });
        if (res.ok) {
          resultContainer.innerHTML += '<br><em>Scorul a fost salvat!</em>';
        }
      } catch (err) {
        console.error('Error saving score:', err);
      }
    } else {
      resultContainer.innerHTML += '<br><em><a href="login.html">Loghează-te</a> pentru a salva scorul.</em>';
    }
  }

  buildQuiz();
  submitButton.addEventListener("click", showResults);
});
