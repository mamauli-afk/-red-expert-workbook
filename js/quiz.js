document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('quizForm');
  if (!form) return;
  const result = document.getElementById('quizResult');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let correct = 0, total = 0;
    form.querySelectorAll('.quiz-question').forEach(function (q) {
      total++;
      const right = q.dataset.correct;
      const chosen = q.querySelector('input[type="radio"]:checked');
      if (chosen && chosen.value === right) correct++;
    });
    const pct = Math.round(correct / total * 100);
    result.textContent = 'Результат: ' + correct + ' из ' + total + ' (' + pct + '%)';
    result.style.color = pct >= 70 ? 'var(--blue-700)' : '#b91c1c';
  });
});