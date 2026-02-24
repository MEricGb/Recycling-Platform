const express = require('express');
const router = express.Router();
const { prepare } = require('../db');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

router.post('/score', asyncHandler((req, res) => {
  const { userId, score } = req.body;
  prepare('INSERT INTO quiz_scores (user_id, scor) VALUES (?, ?)').run(userId, score);
  res.json({ message: 'Scor salvat', score });
}));

router.get('/history/:userId', asyncHandler((req, res) => {
  const userId = parseInt(req.params.userId);
  const rows = prepare('SELECT id, scor, data FROM quiz_scores WHERE user_id = ? ORDER BY data DESC').all(userId);
  res.json(rows);
}));

router.get('/questions', asyncHandler((_req, res) => {
  const rows = prepare('SELECT * FROM quiz_questions').all();
  const questions = rows.map(q => ({
    id: q.id,
    question: q.question,
    answers: [q.answer_a, q.answer_b, q.answer_c, q.answer_d],
    correct: q.correct
  }));
  res.json(questions);
}));

router.post('/questions', asyncHandler((req, res) => {
  const { question, answers, correct } = req.body;

  if (!question || !answers || answers.length !== 4 || correct === undefined) {
    throw new ApiError(400, 'Date incomplete');
  }

  const result = prepare(
    'INSERT INTO quiz_questions (question, answer_a, answer_b, answer_c, answer_d, correct) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(question, answers[0], answers[1], answers[2], answers[3], correct);

  res.json({ message: 'Întrebare adăugată', id: result.lastInsertRowid });
}));

router.delete('/questions/:id', asyncHandler((req, res) => {
  const id = parseInt(req.params.id);
  prepare('DELETE FROM quiz_questions WHERE id = ?').run(id);
  res.json({ message: 'Întrebare ștearsă' });
}));

router.get('/leaderboard', asyncHandler((_req, res) => {
  const questions = prepare('SELECT COUNT(*) as total FROM quiz_questions').get();
  const totalQuestions = questions?.total || 5;

  const users = prepare('SELECT id, name FROM users').all();

  const leaderboard = users.map(user => {
    const bestScore = prepare('SELECT MAX(scor) as best FROM quiz_scores WHERE user_id = ?').get(user.id);
    return {
      name: user.name || 'Anonim',
      score: bestScore?.best || 0,
      total: totalQuestions
    };
  });

  leaderboard.sort((a, b) => b.score - a.score);
  res.json(leaderboard.slice(0, 10));
}));

module.exports = router;
