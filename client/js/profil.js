document.addEventListener('DOMContentLoaded', async () => {
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  // Redirect if not logged in
  if (!userId) {
    window.location = 'login.html';
    return;
  }

  // Display user name
  document.getElementById('user-name').textContent = `Bine ai venit, ${userName || 'Utilizator'}!`;

  try {
    // Fetch user profile data
    const [userRes, statsRes, quizRes] = await Promise.all([
      fetch(`/api/user/${userId}`),
      fetch(`/api/recycling/stats/${userId}`),
      fetch(`/api/quiz/history/${userId}`)
    ]);

    const user = await userRes.json();
    const stats = await statsRes.json();
    const quizHistory = await quizRes.json();

    // Update stats cards
    document.getElementById('total-points').textContent = user.points || 0;
    document.getElementById('total-recycled').textContent = stats.totalItems || 0;
    document.getElementById('quiz-count').textContent = quizHistory.length || 0;

    const bestScore = quizHistory.length > 0
      ? Math.max(...quizHistory.map(q => q.scor))
      : 0;
    document.getElementById('best-score').textContent = bestScore;

    // Display recycling breakdown
    const breakdownEl = document.getElementById('recycling-breakdown');
    if (stats.byMaterial && stats.byMaterial.length > 0) {
      const materialIcons = {
        plastic: '🥤',
        hartie: '📄',
        sticla: '🍾',
        metal: '🥫',
        electronic: '📱'
      };

      breakdownEl.innerHTML = stats.byMaterial.map(m => `
        <div class="breakdown-item">
          <span class="breakdown-icon">${materialIcons[m.tip] || '♻️'}</span>
          <span class="breakdown-name">${m.tip}</span>
          <span class="breakdown-value">${m.total} iteme</span>
        </div>
      `).join('');
    }

    // Display quiz history
    const historyEl = document.getElementById('quiz-history');
    if (quizHistory.length > 0) {
      historyEl.innerHTML = quizHistory.slice(0, 5).map(q => `
        <div class="history-item">
          <span class="history-date">${new Date(q.data).toLocaleDateString('ro-RO')}</span>
          <span class="history-score">Scor: ${q.scor} puncte</span>
        </div>
      `).join('');
    }

  } catch (err) {
    console.error('Error loading profile:', err);
  }
});
