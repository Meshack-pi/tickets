# Ticket Booking System

A simple event ticketing system built with Node.js. Users can browse events, book seats, and manage their reservations.

---

## What It Does

- Browse available events and venues
- Book tickets and get a confirmation
- Cancel or look up existing bookings
- Automatically manages a waiting queue when events are full

---

## Data Structures Used

| Structure | Where It's Used |
|-----------|----------------|
| **Hash Table** | Fast lookup of bookings and events by ID |
| **Queue** | Waiting list — first in, first served |
| **Tree** | Organising events by date or category |
| **Array** | Storing and sorting lists of events |
| **Scheduler** | Timed tasks like releasing held seats |

## Algorithms Used

| Algorithm | Where It's Used |
|-----------|----------------|
| **Quick Sort** | Sorting events by date or price |
| **Binary Search** | Finding an event or booking quickly in a sorted list |

---

## Storage

All data is stored in plain JSON files under `/data`:

```
data/
  events.json
  bookings.json
  venues.json
  queue.json
  schedule.json
```

---

## Project Structure

```
tickets/
  frontend/     — HTML, CSS, and JS for the UI
  backend/      — Server, routes, data structures, and algorithms
  data/         — JSON files (the database)
  docs/         — Diagrams and notes
```

---

## How to Run

```bash
npm install
node backend/server.js
```

Then open `frontend/pages/index.html` in your browser.
