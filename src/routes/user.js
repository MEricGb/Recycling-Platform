const express = require('express');
const router = express.Router();
const { prepare } = require('../db');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const POINTS_PER_MATERIAL = {
  plastic: 5,
  hartie: 3,
  sticla: 4,
  metal: 6,
  electronic: 10
};

router.get('/:userId', asyncHandler((req, res) => {
  const userId = parseInt(req.params.userId);

  const user = prepare('SELECT id, name, email FROM users WHERE id = ?').get(userId);
  if (!user) {
    throw new ApiError(404, 'Utilizator negăsit');
  }

  const quizPoints = prepare('SELECT COALESCE(SUM(scor), 0) as points FROM quiz_scores WHERE user_id = ?').get(userId);
  const recyclingData = prepare('SELECT tip, cantitate FROM reciclari WHERE user_id = ?').all(userId);

  const recyclingPoints = recyclingData.reduce((sum, r) => sum + (POINTS_PER_MATERIAL[r.tip] || 1) * r.cantitate, 0);

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    points: (quizPoints?.points || 0) + recyclingPoints
  });
}));

module.exports = router;
