const express = require('express');
const router = express.Router();
const { prepare } = require('../db');
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/', asyncHandler((_req, res) => {
  const events = prepare('SELECT * FROM events ORDER BY date').all();
  res.json(events);
}));

router.post('/', asyncHandler((req, res) => {
  const { title, date, location } = req.body;
  const result = prepare('INSERT INTO events (title, date, location) VALUES (?, ?, ?)').run(title, date, location);
  res.json({ message: 'Eveniment adăugat', event: { id: result.lastInsertRowid, title, date, location } });
}));

router.delete('/:id', asyncHandler((req, res) => {
  const id = parseInt(req.params.id);
  prepare('DELETE FROM events WHERE id = ?').run(id);
  res.json({ message: 'Eveniment șters' });
}));

module.exports = router;
