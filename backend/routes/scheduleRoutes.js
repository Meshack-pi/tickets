const express        = require('express');
const fs             = require('fs');
const path           = require('path');

const router         = express.Router();
const SCHEDULE_FILE  = path.join(__dirname, '../../data/schedule.json');

const readSchedules  = () => JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8'));

// GET /api/schedules
router.get('/', (_req, res) => res.json(readSchedules()));

// GET /api/schedules/event/:eventId
router.get('/event/:eventId', (req, res) => {
  const schedule = readSchedules().find(s => s.eventId === parseInt(req.params.eventId));
  if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
  res.json(schedule);
});

module.exports = router;
