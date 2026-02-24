document.addEventListener('DOMContentLoaded', async () => {
  const leaderboardEl = document.getElementById('leaderboard');

  try {
    const res = await fetch('/api/quiz/leaderboard');
    const leaderboard = await res.json();

    if (leaderboard.length === 0) {
      leaderboardEl.innerHTML = '<p>Niciun utilizator în clasament.</p>';
      return;
    }

    const medals = ['🥇', '🥈', '🥉'];

    leaderboardEl.innerHTML = leaderboard.map((user, index) => `
      <div class="leaderboard-item ${index < 3 ? 'top-three' : ''}">
        <span class="leaderboard-rank">
          ${index < 3 ? medals[index] : index + 1}
        </span>
        <span class="leaderboard-name">${user.name || 'Anonim'}</span>
        <span class="leaderboard-points">${user.score}/${user.total}</span>
      </div>
    `).join('');

  } catch (err) {
    console.error('Error loading leaderboard:', err);
    leaderboardEl.innerHTML = '<p>Eroare la încărcarea clasamentului.</p>';
  }
});
