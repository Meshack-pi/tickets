const express      = require('express');
const fs           = require('fs');
const path         = require('path');
const quickSort    = require('../algorithms/quickSort');
const binarySearch = require('../algorithms/binarySearch');

const router       = express.Router();
const EVENTS_FILE  = path.join(__dirname, '../../data/events.json');

const readEvents = () => JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));

// GET /api/events?search=&sort=
router.get('/', (req, res) => {
  let events = readEvents();
  const { search, sort } = req.query;
  if (search) events = binarySearch(events, search);
  if (sort && sort !== 'default') events = quickSort(events, sort);
  res.json(events);
});

// GET /api/events/:id
router.get('/:id', (req, res) => {
  const event = readEvents().find(e => e.id === parseInt(req.params.id));
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

module.exports = router;
