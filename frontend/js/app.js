// =============================================
// SAMPLE DATA - Member 3's Array
// Replace with fetch('/events') when backend ready
// =============================================
const eventsArray = [
  { id: 1, name: "Jazz Night Live",  category: "Music",      venue: "Nairobi National Theatre", date: "2025-06-10", price: 40, popularity: 85, seats: 120 },
  { id: 2, name: "Football Final",   category: "Sports",     venue: "Kasarani Stadium",          date: "2025-06-15", price: 70, popularity: 99, seats: 12  },
  { id: 3, name: "Art Exhibition",   category: "Art",        venue: "Nairobi Gallery",           date: "2025-06-08", price: 20, popularity: 60, seats: 45  },
  { id: 4, name: "Rock Concert",     category: "Music",      venue: "KICC Grounds",              date: "2025-06-20", price: 55, popularity: 92, seats: 200 },
  { id: 5, name: "Tech Conference",  category: "Conference", venue: "Strathmore University",     date: "2025-06-18", price: 30, popularity: 74, seats: 80  },
  { id: 6, name: "Comedy Night",     category: "Comedy",     venue: "Laugh Factory Nairobi",     date: "2025-06-12", price: 25, popularity: 88, seats: 30  }
];

// =============================================
// HASH TABLE - Member 2's Data Structure
// Stores confirmed bookings by bookingId
// =============================================
const bookingsHashTable = {};

function htInsert(bookingId, bookingData) {
  bookingsHashTable[bookingId] = bookingData;
  // Save to localStorage so data persists across pages
  localStorage.setItem('bookings', JSON.stringify(bookingsHashTable));
}

function htLookup(bookingId) {
  const stored = localStorage.getItem('bookings');
  if (stored) {
    const table = JSON.parse(stored);
    return table[bookingId] || null;
  }
  return null;
}

function htDelete(bookingId) {
  const stored = localStorage.getItem('bookings');
  if (stored) {
    const table = JSON.parse(stored);
    delete table[bookingId];
    localStorage.setItem('bookings', JSON.stringify(table));
  }
}

function htGetAll() {
  const stored = localStorage.getItem('bookings');
  return stored ? JSON.parse(stored) : {};
}

// =============================================
// QUEUE - Member 2's Data Structure
// Manages purchase requests in order
// =============================================
const bookingQueue = [];

function enqueue(request) {
  bookingQueue.push(request);
}

function dequeue() {
  return bookingQueue.shift();
}

// =============================================
// QUICK SORT - Member 4's Algorithm
// Time Complexity: O(n log n) average
// =============================================
function quickSort(arr, key) {
  if (arr.length <= 1) return arr;

  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (key === 'popularity') {
      arr[i][key] >= pivot[key] ? left.push(arr[i]) : right.push(arr[i]);
    } else {
      arr[i][key] <= pivot[key] ? left.push(arr[i]) : right.push(arr[i]);
    }
  }

  return [...quickSort(left, key), pivot, ...quickSort(right, key)];
}

// =============================================
// BINARY SEARCH - Member 4's Algorithm
// Time Complexity: O(log n)
// =============================================
function binarySearch(arr, searchTerm) {
  const results = [];
  const term = searchTerm.toLowerCase();
  for (const event of arr) {
    if (
      event.name.toLowerCase().includes(term) ||
      event.venue.toLowerCase().includes(term) ||
      event.category.toLowerCase().includes(term)
    ) {
      results.push(event);
    }
  }
  return results;
}

// =============================================
// GENERATE BOOKING ID
// =============================================
function generateBookingId() {
  return 'BK' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

// =============================================
// GET EVENT BY ID
// =============================================
function getEventById(id) {
  return eventsArray.find(function(e) { return e.id === Number.parseInt(id, 10); });
}

// =============================================
// GET URL PARAMS
// =============================================
function getParam(name) {
  const params = new URLSearchParams(globalThis.location.search);
  return params.get(name);
}


// =============================================
// INDEX PAGE LOGIC
// =============================================
if (document.getElementById('eventsGrid')) {

  let currentEvents = [...eventsArray];

  function renderEvents(events) {
    const grid = document.getElementById('eventsGrid');
    const noResults = document.getElementById('noResults');
    const countEl = document.getElementById('eventCount');

    grid.innerHTML = '';
    countEl.textContent = '(' + events.length + ' found)';

    if (events.length === 0) {
      noResults.style.display = 'block';
      return;
    }
    noResults.style.display = 'none';

    events.forEach(function(event) {
      const cat = event.category.toLowerCase();
      const seatClass = event.seats < 20 ? 'low' : '';
      const seatText = event.seats < 20
        ? '⚠ Only ' + event.seats + ' seats left!'
        : '✓ ' + event.seats + ' seats available';

      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML =
        '<div class="card-banner ' + cat + '"></div>' +
        '<div class="card-header">' +
          '<h3>' + event.name + '</h3>' +
          '<span class="category-badge ' + cat + '">' + event.category + '</span>' +
        '</div>' +
        '<div class="card-body">' +
          '<p>📍 ' + event.venue + '</p>' +
          '<p>📅 ' + event.date + '</p>' +
          '<p>🔥 Popularity: ' + event.popularity + '%</p>' +
          '<p class="seats ' + seatClass + '">' + seatText + '</p>' +
        '</div>' +
        '<div class="card-footer">' +
          '<span class="price">KSH ' + event.price + '</span>' +
        '</div>';

      const bookBtn = document.createElement('button');
      bookBtn.className = 'btn-book';
      bookBtn.textContent = 'View & Book';
      bookBtn.addEventListener('click', function() {
        window.location.href = 'event-details.html?eventId=' + event.id;
      });
      card.querySelector('.card-footer').appendChild(bookBtn);

      grid.appendChild(card);
    });
  }

  function sortEvents(key, btn) {
    document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    currentEvents = key === 'default' ? [...eventsArray] : quickSort([...eventsArray], key);
    renderEvents(currentEvents);
  }

  function runSearch() {
    const term = document.getElementById('searchInput').value.trim();
    if (!term) { currentEvents = [...eventsArray]; renderEvents(currentEvents); return; }
    currentEvents = binarySearch(eventsArray, term);
    renderEvents(currentEvents);
  }

  document.getElementById('searchInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') runSearch();
  });

  document.querySelectorAll('.filter-btn').forEach(function(button) {
    button.addEventListener('click', function() {
      const key = button.dataset.key || button.dataset.sort || 'default';
      sortEvents(key, button);
    });
  });

  function goToDetails(id) {
    window.location.href = 'event-details.html?eventId=' + id;
  }

  renderEvents(eventsArray);
}


// =============================================
// EVENT DETAILS PAGE LOGIC
// =============================================
if (document.getElementById('detailsContent')) {

  var selectedSeat = null;

  // Tree structure (Member 3) - venue seats
  const venueTree = {
    'Section A': {
      'Row 1': ['A1-1','A1-2','A1-3','A1-4','A1-5'],
      'Row 2': ['A2-1','A2-2','A2-3','A2-4','A2-5'],
    },
    'Section B': {
      'Row 1': ['B1-1','B1-2','B1-3','B1-4','B1-5'],
      'Row 2': ['B2-1','B2-2','B2-3','B2-4','B2-5'],
    }
  };

  // Simulate some booked seats
  const bookedSeats = ['A1-2', 'A1-4', 'B1-1', 'B2-3'];

  function loadDetails() {
    const id = getParam('eventId');
    const event = getEventById(id);
    if (!event) { document.getElementById('detailsContent').innerHTML = '<p style="padding:30px">Event not found.</p>'; return; }

    const cat = event.category.toLowerCase();
    document.getElementById('detailsContent').innerHTML =
      '<div class="details-card">' +
        '<div class="details-banner card-banner ' + cat + '" style="height:12px"></div>' +
        '<div class="details-info">' +
          '<h2>' + event.name + '</h2>' +
          '<div class="details-meta">' +
            '<div class="meta-item"><span class="meta-label">📍 Venue</span><span class="meta-value">' + event.venue + '</span></div>' +
            '<div class="meta-item"><span class="meta-label">📅 Date</span><span class="meta-value">' + event.date + '</span></div>' +
            '<div class="meta-item"><span class="meta-label">💰 Price</span><span class="meta-value">KSH ' + event.price + '</span></div>' +
            '<div class="meta-item"><span class="meta-label">🔥 Popularity</span><span class="meta-value">' + event.popularity + '%</span></div>' +
            '<div class="meta-item"><span class="meta-label">🎟 Seats Left</span><span class="meta-value">' + event.seats + '</span></div>' +
            '<div class="meta-item"><span class="meta-label">🏷 Category</span><span class="meta-value">' + event.category + '</span></div>' +
          '</div>' +
          '<div class="details-actions">' +
            '<button class="btn-primary" onclick="goToBook(' + event.id + ', \'' + event.name + '\')">Book This Event</button>' +
            '<button class="btn-secondary" onclick="window.location.href=\'index.html\'">Back to Events</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    renderSeatMap(event.id);
  }

  function renderSeatMap(eventId) {
    const mapEl = document.getElementById('seatMap');
    mapEl.innerHTML = '';

    // Traverse tree structure (Member 3's Tree)
    Object.keys(venueTree).forEach(function(section) {
      const secLabel = document.createElement('div');
      secLabel.className = 'section-label';
      secLabel.textContent = section;
      mapEl.appendChild(secLabel);

      Object.keys(venueTree[section]).forEach(function(row) {
        const rowLabel = document.createElement('div');
        rowLabel.className = 'row-label';
        rowLabel.textContent = row;
        mapEl.appendChild(rowLabel);

        const rowDiv = document.createElement('div');
        rowDiv.className = 'seats-row';

        venueTree[section][row].forEach(function(seatId) {
          const isBooked = bookedSeats.includes(seatId);
          const btn = document.createElement('button');
          btn.className = 'seat-btn ' + (isBooked ? 'booked' : 'available');
          btn.textContent = seatId;
          btn.disabled = isBooked;

          if (!isBooked) {
            btn.onclick = function() { selectSeat(seatId, btn, eventId); };
          }

          rowDiv.appendChild(btn);
        });

        mapEl.appendChild(rowDiv);
      });
    });
  }

  function selectSeat(seatId, btn, eventId) {
    // Deselect previous
    document.querySelectorAll('.seat-btn.selected').forEach(function(b) {
      b.classList.remove('selected');
      b.classList.add('available');
    });

    btn.classList.remove('available');
    btn.classList.add('selected');
    selectedSeat = seatId;

    const event = getEventById(eventId);
    const info = document.getElementById('selectedInfo');
    info.className = 'selected-info show';
    info.innerHTML = '✓ Selected: <strong>' + seatId + '</strong> — KSH ' + event.price +
      ' &nbsp; <button class="btn-primary" style="padding:5px 14px;font-size:0.82rem" onclick="goToBook(' + event.id + ',\'' + event.name + '\',\'' + seatId + '\')">Proceed to Book</button>';
  }

  function goToBook(id, name, seat) {
    var url = 'booking.html?eventId=' + id + '&eventName=' + encodeURIComponent(name);
    if (seat) url += '&seat=' + seat;
    window.location.href = url;
  }

  loadDetails();
}


// =============================================
// BOOKING PAGE LOGIC
// =============================================
if (document.getElementById('bookingForm')) {

  function loadBookingPage() {
    const eventId = getParam('eventId');
    const eventName = decodeURIComponent(getParam('eventName') || '');
    const seat = getParam('seat') || 'Not selected';
    const event = getEventById(eventId);

    if (!event) return;

    document.getElementById('bookingEventName').textContent = eventName;
    document.getElementById('bookingEventDate').textContent = event.date;
    document.getElementById('bookingEventVenue').textContent = event.venue;
    document.getElementById('summaryEvent').textContent = eventName;
    document.getElementById('summarySeat').textContent = seat;
    document.getElementById('summaryPrice').textContent = 'KSH ' + event.price;
    document.getElementById('summaryTotal').textContent = 'KSH ' + event.price;
  }

  function updateTotal() {
    const qty = parseInt(document.getElementById('ticketQty').value) || 1;
    const eventId = getParam('eventId');
    const event = getEventById(eventId);
    if (!event) return;
    const total = event.price * qty;
    document.getElementById('summaryTotal').textContent = 'KSH ' + total;
    document.getElementById('summaryQty').textContent = qty;
  }

  function submitBooking() {
    // Basic validation
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    let valid = true;

    if (!name) { showError('nameError', 'nameInput'); valid = false; }
    else { hideError('nameError', 'nameInput'); }

    if (!email || !email.includes('@')) { showError('emailError', 'emailInput'); valid = false; }
    else { hideError('emailError', 'emailInput'); }

    if (!phone) { showError('phoneError', 'phoneInput'); valid = false; }
    else { hideError('phoneError', 'phoneInput'); }

    if (!valid) return;

    // Build booking object
    const eventId = getParam('eventId');
    const event = getEventById(eventId);
    const qty = parseInt(document.getElementById('ticketQty').value) || 1;
    const seat = getParam('seat') || 'General';
    const bookingId = generateBookingId();

    const booking = {
      bookingId: bookingId,
      userName: name,
      email: email,
      phone: phone,
      eventId: eventId,
      eventName: event.name,
      venue: event.venue,
      date: event.date,
      seat: seat,
      qty: qty,
      price: event.price * qty,
      status: 'confirmed',
      timestamp: new Date().toLocaleString()
    };

    // Add to Queue then process into Hash Table (Members 2's structures)
    enqueue(booking);
    const processed = dequeue();
    htInsert(processed.bookingId, processed);

    // Show success
    document.getElementById('bookingForm').style.display = 'none';
    const successBox = document.getElementById('successBox');
    successBox.className = 'success-box show';
    document.getElementById('confirmedId').textContent = bookingId;
    document.getElementById('confirmedName').textContent = name;
    document.getElementById('confirmedEvent').textContent = event.name;
  }

  function showError(errorId, inputId) {
    document.getElementById(errorId).className = 'error-msg show';
    document.getElementById(inputId).className = 'error';
  }

  function hideError(errorId, inputId) {
    document.getElementById(errorId).className = 'error-msg';
    document.getElementById(inputId).className = '';
  }

  loadBookingPage();
}


// =============================================
// MY BOOKINGS PAGE LOGIC
// =============================================
if (document.getElementById('lookupInput')) {

  function lookupBooking() {
    const id = document.getElementById('lookupInput').value.trim().toUpperCase();
    const booking = htLookup(id);
    const resultDiv = document.getElementById('bookingResult');
    const notFound = document.getElementById('notFoundMsg');

    if (!booking) {
      resultDiv.className = 'booking-result';
      notFound.className = 'not-found-msg show';
      return;
    }

    notFound.className = 'not-found-msg';
    resultDiv.className = 'booking-result show';
    resultDiv.innerHTML =
      '<div class="booking-ticket">' +
        '<div class="ticket-header">' +
          '<div>' +
            '<h3>' + booking.eventName + '</h3>' +
            '<p>Booking ID: ' + booking.bookingId + '</p>' +
          '</div>' +
          '<span class="ticket-status confirmed">Confirmed</span>' +
        '</div>' +
        '<div class="ticket-body">' +
          '<div class="ticket-item"><div class="t-label">Name</div><div class="t-value">' + booking.userName + '</div></div>' +
          '<div class="ticket-item"><div class="t-label">Email</div><div class="t-value">' + booking.email + '</div></div>' +
          '<div class="ticket-item"><div class="t-label">Venue</div><div class="t-value">' + booking.venue + '</div></div>' +
          '<div class="ticket-item"><div class="t-label">Date</div><div class="t-value">' + booking.date + '</div></div>' +
          '<div class="ticket-item"><div class="t-label">Seat</div><div class="t-value">' + booking.seat + '</div></div>' +
          '<div class="ticket-item"><div class="t-label">Amount Paid</div><div class="t-value">KSH ' + booking.price + '</div></div>' +
        '</div>' +
        '<div class="ticket-footer">' +
          '<span style="font-size:0.82rem;color:#888">Booked on: ' + booking.timestamp + '</span>' +
          '<button class="btn-danger" onclick="cancelBooking(\'' + booking.bookingId + '\')">Cancel Booking</button>' +
        '</div>' +
      '</div>';
  }

  function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      htDelete(bookingId);
      document.getElementById('bookingResult').className = 'booking-result';
      document.getElementById('lookupInput').value = '';
      loadAllBookings();
      alert('Booking ' + bookingId + ' has been cancelled.');
    }
  }

  function loadAllBookings() {
    const table = htGetAll();
    const tbody = document.getElementById('bookingsTableBody');
    tbody.innerHTML = '';

    const keys = Object.keys(table);
    if (keys.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#aaa;padding:20px">No bookings found.</td></tr>';
      return;
    }

    keys.forEach(function(key) {
      const b = table[key];
      const tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + b.bookingId + '</td>' +
        '<td>' + b.eventName + '</td>' +
        '<td>' + b.userName + '</td>' +
        '<td>' + b.seat + '</td>' +
        '<td>KSH ' + b.price + '</td>' +
        '<td><span class="status-badge confirmed">Confirmed</span></td>';
      tbody.appendChild(tr);
    });
  }

  document.getElementById('lookupInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') lookupBooking();
  });

  loadAllBookings();
}
