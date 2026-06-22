const fs        = require('fs');
const path      = require('path');
const HashTable = require('./dataStructures/hashTable');
const Queue     = require('./dataStructures/queue');

const BOOKINGS_FILE = path.join(__dirname, '../data/bookings.json');

const ht    = new HashTable();
const queue = new Queue();

// Seed hash table from persisted bookings
try {
  const stored = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'));
  stored.forEach(b => ht.insert(b.bookingId, b));
} catch (_) { /* file empty or missing — start fresh */ }

function saveBookings() {
  const all = Object.values(ht.getAll());
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(all, null, 2));
}

module.exports = { ht, queue, saveBookings };
