const express = require('express');
const router = express.Router();
const { prepare } = require('../db');
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/users', asyncHandler((_req, res) => {
  const users = prepare('SELECT id, email, name, is_admin FROM users ORDER BY id').all();
  res.json(users);
}));

router.delete('/users/:id', asyncHandler((req, res) => {
  const id = parseInt(req.params.id);

  // Delete associated data first
  prepare('DELETE FROM quiz_scores WHERE user_id = ?').run(id);
  prepare('DELETE FROM reciclari WHERE user_id = ?').run(id);
  prepare('DELETE FROM users WHERE id = ?').run(id);

  res.json({ message: 'Utilizator și date asociate șterse' });
}));

module.exports = router;
