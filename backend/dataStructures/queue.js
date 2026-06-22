// =============================================
// BOOKING REQUEST QUEUE (FIFO)
// Manages purchase requests in arrival order so
// every user is served fairly — first come, first served.
//
// Implemented with a doubly-linked list so both
// enqueue and dequeue are true O(1) — no shifting
// an array.
// =============================================

class QueueNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class BookingQueue {
  constructor() {
    this.head  = null;   // front of queue (next to be served)
    this.tail  = null;   // back of queue  (most recently joined)
    this.length = 0;
  }

  // --------------------------------------------------
  // enqueue(request) — O(1)
  // Adds a new purchase request to the back of the line.
  //
  // request shape:
  // {
  //   userId    : "U42",
  //   eventId   : 6,
  //   eventName : "Sol Fest",
  //   qty       : 2,
  //   seat      : "A1-5",
  //   timestamp : "2026-06-21T09:05:00"
  // }
  //
  // Returns the new queue length.
  // --------------------------------------------------
  enqueue(request) {
    const node = new QueueNode(request);

    if (!this.tail) {
      // Queue was empty — node is both head and tail
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;   // link to current back
      this.tail      = node;   // update tail pointer
    }

    this.length++;
    return this.length;
  }

  // --------------------------------------------------
  // dequeue() — O(1)
  // Removes and returns the request at the front.
  // Returns null if the queue is empty.
  //
  // Flow: user clicked "Book Now" → request was enqueued
  //       → dequeue() pulls it out → booking saved in Hash Table
  // --------------------------------------------------
  dequeue() {
    if (!this.head) return null;

    const data      = this.head.data;
    this.head       = this.head.next;
    if (!this.head) this.tail = null;  // queue is now empty
    this.length--;

    return data;
  }

  // --------------------------------------------------
  // peek() — O(1)
  // Returns the front request WITHOUT removing it.
  // Useful for showing "who is next in line".
  // --------------------------------------------------
  peek() {
    return this.head ? this.head.data : null;
  }

  // --------------------------------------------------
  // isEmpty() — O(1)
  // Returns true when there are no pending requests.
  // --------------------------------------------------
  isEmpty() {
    return this.length === 0;
  }

  // --------------------------------------------------
  // size() — O(1)
  // Returns how many requests are currently waiting.
  // --------------------------------------------------
  size() {
    return this.length;
  }

  // --------------------------------------------------
  // toArray() — O(n)
  // Snapshot of the whole queue from front to back.
  // Used by the API to return the current queue state.
  // --------------------------------------------------
  toArray() {
    const result = [];
    let current  = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  // --------------------------------------------------
  // processAll(hashTable) — O(n)
  // Drains the queue, inserting every request into the
  // provided HashTable as a confirmed booking.
  // Returns an array of all processed bookings.
  // --------------------------------------------------
  processAll(hashTable) {
    const processed = [];

    while (!this.isEmpty()) {
      const request = this.dequeue();

      const bookingId = request.bookingId || ('BK' + Math.random().toString(36).slice(2, 8).toUpperCase());
      const booking   = { ...request, bookingId, status: 'confirmed' };

      hashTable.insert(bookingId, booking);
      processed.push(booking);
    }

    return processed;
  }
}
module.exports = BookingQueue;
