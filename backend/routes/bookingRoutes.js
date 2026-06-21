const express              = require('express');
const { ht, queue, saveBookings } = require('../state');

const router = express.Router();

const genId = () => 'BK' + Math.random().toString(36).slice(2, 8).toUpperCase();

// GET /api/bookings
router.get('/', (_req, res) => res.json(ht.getAll()));

// GET /api/bookings/:id
router.get('/:id', (req, res) => {
  const booking = ht.lookup(req.params.id.toUpperCase());
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  res.json(booking);
});

// POST /api/bookings  — enqueue → dequeue → insert into hash table
router.post('/', (req, res) => {
  const booking = {
    ...req.body,
    bookingId : genId(),
    status    : 'confirmed',
    timestamp : new Date().toLocaleString()
  };

  queue.enqueue(booking);
  const processed = queue.dequeue();   // FIFO: serve immediately

  ht.insert(processed.bookingId, processed);
  saveBookings();

  res.status(201).json(processed);
});

// DELETE /api/bookings/:id  — cancel booking
router.delete('/:id', (req, res) => {
  const deleted = ht.delete(req.params.id.toUpperCase());
  if (!deleted) return res.status(404).json({ error: 'Booking not found' });
  saveBookings();
  res.json({ message: 'Booking cancelled', booking: deleted });
});

module.exports = router;
