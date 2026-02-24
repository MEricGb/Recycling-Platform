const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { prepare } = require('../db');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

router.post('/signup', asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const existing = prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    throw new ApiError(400, 'Email deja înregistrat');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)').run(email, hashedPassword, name || '');

  const newUser = prepare('SELECT id FROM users WHERE email = ?').get(email);
  res.json({ message: 'Cont creat cu succes', userId: newUser.id });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = prepare('SELECT id, email, name, password_hash, is_admin FROM users WHERE email = ?').get(email);
  if (!user) {
    throw new ApiError(401, 'Email sau parolă incorectă');
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    throw new ApiError(401, 'Email sau parolă incorectă');
  }

  res.json({
    message: 'Autentificare reușită',
    userId: user.id,
    name: user.name,
    isAdmin: user.is_admin === 1
  });
}));

module.exports = router;
