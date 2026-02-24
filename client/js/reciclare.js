document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reciclare-form');
  if (!form) return;

  const userId = localStorage.getItem('userId');

  // Check if logged in
  if (!userId) {
    alert('Te rugăm să te loghezi.');
    window.location = 'login.html';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const material = form['tip'].value;
    const quantity = parseFloat(form['cantitate'].value);

    try {
      const res = await fetch('/api/recycling/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: parseInt(userId), material, quantity })
      });
      const data = await res.json();

      if (res.ok) {
        alert(`Înregistrat cu succes! Ai primit ${data.points} puncte.`);
        form.reset();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Eroare de conexiune');
    }
  });
});
