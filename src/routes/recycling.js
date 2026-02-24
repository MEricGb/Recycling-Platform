const express = require('express');
const router = express.Router();
const { prepare } = require('../db');
const { asyncHandler } = require('../middleware/errorHandler');

const POINTS_PER_MATERIAL = {
  plastic: 5,
  hartie: 3,
  sticla: 4,
  metal: 6,
  electronic: 10
};

router.post('/log', asyncHandler((req, res) => {
  const { userId, material, quantity } = req.body;
  const points = (POINTS_PER_MATERIAL[material] || 1) * quantity;

  prepare('INSERT INTO reciclari (user_id, tip, cantitate) VALUES (?, ?, ?)').run(userId, material, quantity);
  res.json({ message: 'Reciclare înregistrată', points });
}));

router.get('/stats/:userId', asyncHandler((req, res) => {
  const userId = parseInt(req.params.userId);

  const rows = prepare('SELECT tip, SUM(cantitate) as total FROM reciclari WHERE user_id = ? GROUP BY tip').all(userId);
  const totalItems = prepare('SELECT SUM(cantitate) as total FROM reciclari WHERE user_id = ?').get(userId);

  res.json({
    totalItems: totalItems?.total || 0,
    byMaterial: rows
  });
}));

module.exports = router;
