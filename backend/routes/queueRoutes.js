const express     = require('express');
const { queue }   = require('../state');

const router = express.Router();

// GET /api/queue  — current queue snapshot
router.get('/', (_req, res) => {
  res.json({ length: queue.size(), next: queue.peek(), items: queue.toArray() });
});

module.exports = router;
