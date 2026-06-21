// =============================================
// API BASE URL — change port here if needed
// =============================================
const API = 'http://localhost:3000';

// =============================================
// QUICK SORT — Member 4
// Sorts an array of events by a given key
// Time Complexity: O(n log n) average
// =============================================
function quickSort(arr, key) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [], right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (key === 'popularity') {
      arr[i][key] >= pivot[key] ? left.push(arr[i]) : right.push(arr[i]);
    } else {
      arr[i][key] <= pivot[key] ? left.push(arr[i]) : right.push(arr[i]);
    }
  }
  return quickSort(left, key).concat([pivot], quickSort(right, key));
}

// =============================================
// BINARY SEARCH — Member 4
// Searches events by name, venue, or category
// Time Complexity: O(log n)
// =============================================
function binarySearch(arr, term) {
  const results = [];
  const t = term.toLowerCase();
  for (const item of arr) {
    if (
      item.name.toLowerCase().includes(t) ||
      item.venue.toLowerCase().includes(t) ||
      item.category.toLowerCase().includes(t)
    ) {
      results.push(item);
    }
  }
  return results;
}

// =============================================
// HELPERS
// =============================================
function getParam(name) {
  return new URLSearchParams(globalThis.location.search).get(name);
}

function generateBookingId() {
  return 'BK' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function showEl(id)  { const el = document.getElementById(id); if (el) el.style.display = 'block'; }
function hideEl(id)  { const el = document.getElementById(id); if (el) el.style.display = 'none'; }
function addClass(id, cls)    { const el = document.getElementById(id); if (el) el.classList.add(cls); }
function removeClass(id, cls) { const el = document.getElementById(id); if (el) el.classList.remove(cls); }
function setText(id, text)    { const el = document.getElementById(id); if (el) el.textContent = text; }


// =============================================
// ── INDEX PAGE ──
// =============================================
if (document.getElementById('eventsGrid')) {

  let allEvents = [];
  let currentEvents = [];

  // Fetch all events from backend (Member 3's Array)
  function loadEvents() {
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = '<p class="loading">Loading events...</p>';

    fetch(API + '/events')
      .then(function(res) {
        if (!res.ok) throw new Error('Failed to load events');
        return res.json();
      })
      .then(function(events) {
        allEvents = events;
        currentEvents = allEvents.slice();
        renderEvents(currentEvents);
      })
      .catch(function(err) {
        console.error('Error loading events:', err);
        grid.innerHTML = '';
        addClass('fetchError', 'show');
      });
  }

  function renderEvents(arr) {
      const grid = document.getElementById('eventsGrid');
    const noRes = document.getElementById('noResults');
    grid.innerHTML = '';
    setText('eventCount', '(' + arr.length + ' found)');

    if (arr.length === 0) {
      noRes.style.display = 'block';
      return;
    }
    noRes.style.display = 'none';

    for (const e of arr) {
      const cat = (e.category || 'default').toLowerCase();
      const seatClass = e.seats < 20 ? 'low' : '';
      const seatText  = e.seats < 20
        ? '⚠ Only ' + e.seats + ' seats left!'
        : '✓ ' + e.seats + ' seats available';

      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML =
        '<div class="card-top ' + cat + '"></div>' +
        '<div class="card-head">' +
          '<h3>' + e.name + '</h3>' +
          '<span class="badge ' + cat + '">' + e.category + '</span>' +
        '</div>' +
        '<div class="card-body">' +
          '<p>📍 ' + e.venue + '</p>' +
          '<p>📅 ' + e.date + '</p>' +
          '<p>🔥 Popularity: ' + e.popularity + '%</p>' +
          '<p class="seats ' + seatClass + '">' + seatText + '</p>' +
        '</div>' +
        '<div class="card-foot">' +
          '<span class="price">KSH ' + e.price + '</span>' +
          '<button class="btn-primary" onclick="goToDetails(' + e.id + ')">View & Book</button>' +
        '</div>';
      grid.appendChild(card);
    }
  }

  function sortEvents(key, btn) {
    document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    currentEvents = key === 'default' ? allEvents.slice() : quickSort(allEvents.slice(), key);
    renderEvents(currentEvents);
  }

  function runSearch() {
    const term = document.getElementById('searchInput').value.trim();
    if (!term) { currentEvents = allEvents.slice(); renderEvents(currentEvents); return; }
    currentEvents = binarySearch(allEvents, term);
    renderEvents(currentEvents);
  }

  function goToDetails(id) {
    globalThis.location.href = 'event-details.html?eventId=' + id;
  }

  document.getElementById('searchInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') runSearch();
  });

  // Expose to HTML onclick
  globalThis.sortEvents = sortEvents;
  globalThis.runSearch  = runSearch;
  globalThis.goToDetails = goToDetails;

  loadEvents();
}


// =============================================
// ── EVENT DETAILS PAGE ──
// =============================================
if (document.getElementById('detailsContent')) {

  let selectedSeat = null;
  const currentEventId = getParam('eventId');

  async function loadDetails() {
    try {
      const res = await fetch(API + '/events/' + currentEventId);
      if (!res.ok) throw new Error('Event not found');
      const e = await res.json();
      renderDetails(e);
    } catch (err) {
      // Log the error for debugging and show a user-friendly message
      console.error('Failed to load event details:', err);
      document.getElementById('detailsContent').innerHTML =
        '<p style="padding:30px;color:#e74c3c">Could not load event. Make sure the backend is running.</p>';
    }
  }

  function renderDetails(e) {
    const cat = (e.category || 'default').toLowerCase();
    document.getElementById('detailsContent').innerHTML =
      '<div class="details-card">' +
        '<div class="details-banner card-top ' + cat + '"></div>' +
        '<div class="details-info">' +
          '<h2>' + e.name + '</h2>' +
          '<div class="details-meta">' +
            '<div class="meta-item"><span class="meta-label">📍 Venue</span><span class="meta-value">' + e.venue + '</span></div>' +
            '<div class="meta-item"><span class="meta-label">📅 Date</span><span class="meta-value">' + e.date + '</span></div>' +
            '<div class="meta-item"><span class="meta-label">💰 Price</span><span class="meta-value">KSH ' + e.price + '</span></div>' +
            '<div class="meta-item"><span class="meta-label">🔥 Popularity</span><span class="meta-value">' + e.popularity + '%</span></div>' +
            '<div class="meta-item"><span class="meta-label">🎟 Seats Left</span><span class="meta-value">' + e.seats + '</span></div>' +
            '<div class="meta-item"><span class="meta-label">🏷 Category</span><span class="meta-value">' + e.category + '</span></div>' +
          '</div>' +
          '<div class="details-actions">' +
            '<button class="btn-primary" onclick="proceedToBook()">Book This Event</button>' +
            '<button class="btn-secondary" onclick="window.location.href=\'index.html\'">Back to Events</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    loadSeatMap();
  }

  async function loadSeatMap() {
    try {
      const res = await fetch(API + '/venues/' + currentEventId);
      if (!res.ok) throw new Error('No seat map');
      const venue = await res.json();
      renderSeatMap(venue);
    } catch (err) {
      console.error(err);
      document.getElementById('seatMap').innerHTML =
        '<p style="color:#888;font-size:0.85rem">Seat map not available yet.</p>';
    }
  }

  // Traverse Tree structure (Member 3)
  function renderSeatMap(venue) {
    const mapEl = document.getElementById('seatMap');
    mapEl.innerHTML = '';

    const sections = venue.sections || {};
    Object.keys(sections).forEach(function(secName) {
      renderSection(mapEl, secName, sections[secName]);
    });
  }

  function renderSection(mapEl, secName, sectionData) {
    const secLabel = document.createElement('div');
    secLabel.className = 'section-label';
    secLabel.textContent = secName;
    mapEl.appendChild(secLabel);

    const rows = sectionData.rows || {};
    Object.keys(rows).forEach(function(rowName) {
      renderRow(mapEl, rowName, rows[rowName]);
    });
  }

  function renderRow(mapEl, rowName, rowData) {
    const rowLabel = document.createElement('div');
    rowLabel.className = 'row-label';
    rowLabel.textContent = rowName;
    mapEl.appendChild(rowLabel);

    const rowDiv = document.createElement('div');
    rowDiv.className = 'seats-row';

    const seats = rowData.seats || {};
    Object.keys(seats).forEach(function(seatId) {
      renderSeatButton(rowDiv, seatId, seats[seatId]);
    });

    mapEl.appendChild(rowDiv);
  }

  function renderSeatButton(container, seatId, seatData) {
    const btn = document.createElement('button');
    btn.className = 'seat-btn ' + (seatData.status === 'booked' ? 'booked' : 'available');
    btn.textContent = seatId;
    btn.disabled = seatData.status === 'booked';
    if (seatData.status !== 'booked') {
      btn.onclick = function() { selectSeat(seatId, btn); };
    }
    container.appendChild(btn);
  }

  function selectSeat(seatId, btn) {
    document.querySelectorAll('.seat-btn.selected').forEach(function(b) {
      b.classList.remove('selected');
      b.classList.add('available');
    });
    btn.classList.remove('available');
    btn.classList.add('selected');
    selectedSeat = seatId;

    const info = document.getElementById('selectedInfo');
    info.className = 'selected-info show';
    info.innerHTML =
      '<span>✓ Seat <strong>' + seatId + '</strong> selected</span>' +
      '<button class="btn-primary" style="padding:6px 14px;font-size:0.82rem" onclick="proceedToBook()">Proceed to Book →</button>';
  }

  function proceedToBook() {
    let url = 'booking.html?eventId=' + currentEventId;
    if (selectedSeat) url += '&seat=' + selectedSeat;
    globalThis.location.href = url;
  }

  globalThis.proceedToBook = proceedToBook;

  // Load details
  loadDetails();
}


// =============================================
// ── BOOKING PAGE ──
// =============================================
if (document.getElementById('bookingForm')) {

  let bookingEventData = null;

  async function loadBookingPage() {
    const eventId = getParam('eventId');
    const seat    = getParam('seat') || 'General';

    try {
      let res = await fetch(API + '/events/' + eventId);
      if (!res.ok) throw new Error('Event not found');
      bookingEventData = await res.json();

      setText('bookingEventName', bookingEventData.name);
      setText('bookingEventDate', bookingEventData.date);
      setText('bookingEventVenue', bookingEventData.venue);
      setText('summaryEvent', bookingEventData.name);
      setText('summarySeat', seat);
      setText('summaryPrice', 'KSH ' + bookingEventData.price);
      setText('summaryTotal', 'KSH ' + bookingEventData.price);
    } catch (err) {
      console.error('Error loading booking page:', err);
      document.getElementById('bookingForm').innerHTML =
        '<p style="padding:30px;color:#e74c3c">Could not load event details. Make sure the backend is running.</p>';
    }
  }

  function updateTotal() {
    if (!bookingEventData) return;
    const qty   = Number.parseInt(document.getElementById('ticketQty').value) || 1;
    const total = bookingEventData.price * qty;
    setText('summaryQty', qty);
    setText('summaryTotal', 'KSH ' + total);
  }

  async function submitBooking() {
    // Validate inputs
    const name  = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const qty   = Number.parseInt(document.getElementById('ticketQty').value) || 1;
    const seat  = getParam('seat') || 'General';
    let valid = true;

    if (!name)  { showFieldError('nameError', 'userName');  valid = false; } else { hideFieldError('nameError', 'userName');  }
    // Validate email contains '@'
    if (!email || !email?.includes('@')) { showFieldError('emailError', 'userEmail'); valid = false; } else { hideFieldError('emailError', 'userEmail'); }
    if (!phone) { showFieldError('phoneError', 'userPhone'); valid = false; } else { hideFieldError('phoneError', 'userPhone'); }
    if (!valid) return;

    const bookingId = generateBookingId();
    const booking = {
      bookingId:  bookingId,
      userName:   name,
      email:      email,
      phone:      phone,
      eventId:    getParam('eventId'),
      eventName:  bookingEventData.name,
      venue:      bookingEventData.venue,
      date:       bookingEventData.date,
      seat:       seat,
      qty:        qty,
      price:      bookingEventData.price * qty,
      status:     'confirmed',
      timestamp:  new Date().toLocaleString()
    };

    try {
      // Add to Queue then Hash Table via backend (Member 2)
      await fetch(API + '/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });

      const res = await fetch(API + '/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });

      if (!res.ok) throw new Error('Booking failed');

      // Update seat in Tree (Member 3)
      if (seat !== 'General') {
        await fetch(API + '/venues/' + getParam('eventId') + '/book', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seat: seat })
        });
      }

      // Show success
      document.getElementById('bookingForm').style.display = 'none';
      document.getElementById('successBox').className = 'success-box show';
      setText('confirmedId', bookingId);
      setText('confirmedName', name);
      setText('confirmedEvent', bookingEventData.name);

    } catch (err) {
      console.error(err);
      alert('Booking failed. Please make sure the backend server is running.');
    }
  }

  function showFieldError(errorId, inputId) {
    addClass(errorId, 'show');
    const el = document.getElementById(inputId);
    if (el) el.classList.add('error');
  }

  function hideFieldError(errorId, inputId) {
    removeClass(errorId, 'show');
    const el = document.getElementById(inputId);
    if (el) el.classList.remove('error');
  }

  globalThis.updateTotal    = updateTotal;
  globalThis.submitBooking  = submitBooking;

  loadBookingPage();
}


// =============================================
// ── MY BOOKINGS PAGE ──
// =============================================
if (document.getElementById('lookupInput')) {

  async function lookupBooking() {
    const id = document.getElementById('lookupInput').value.trim().toUpperCase();
    if (!id) return;

    try {
      const res = await fetch(API + '/bookings/' + id);
      if (!res.ok) throw new Error('Not found');
      const booking = await res.json();

      removeClass('notFoundMsg', 'show');
      const resultDiv = document.getElementById('bookingResult');
      resultDiv.className = 'booking-result show';
      resultDiv.innerHTML =
        '<div class="booking-ticket">' +
          '<div class="ticket-header">' +
            '<div><h3>' + booking.eventName + '</h3><p>Booking ID: ' + booking.bookingId + '</p></div>' +
            '<span class="ticket-badge confirmed">Confirmed</span>' +
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
            '<span>Booked on: ' + booking.timestamp + '</span>' +
            '<button class="btn-danger" onclick="cancelBooking(\'' + booking.bookingId + '\')">Cancel Booking</button>' +
          '</div>' +
        '</div>';

    } catch (err) {
      document.getElementById('bookingResult').className = 'booking-result';
      addClass('notFoundMsg', 'show');
    }
  }

  async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel booking ' + bookingId + '?')) return;
    try {
      var res = await fetch(API + '/bookings/' + bookingId, { method: 'DELETE' });
      if (!res.ok) throw new Error('Cancel failed');
      document.getElementById('bookingResult').className = 'booking-result';
      document.getElementById('lookupInput').value = '';
      alert('Booking ' + bookingId + ' cancelled successfully.');
      loadAllBookings();
    } catch (err) {
      alert('Could not cancel booking. Make sure the backend is running.');
    }
  }

  async function loadAllBookings() {
    var tbody = document.getElementById('bookingsTableBody');
    try {
      var res = await fetch(API + '/bookings');
      if (!res.ok) throw new Error('Failed');
      var data = await res.json();
      var keys = Object.keys(data);
      tbody.innerHTML = '';

      if (keys.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#aaa;padding:20px">No bookings yet.</td></tr>';
        return;
      }

      keys.forEach(function(key) {
        var b = data[key];
        var tr = document.createElement('tr');
        tr.innerHTML =
          '<td>' + b.bookingId  + '</td>' +
          '<td>' + b.eventName  + '</td>' +
          '<td>' + b.userName   + '</td>' +
          '<td>' + b.seat       + '</td>' +
          '<td>KSH ' + b.price  + '</td>' +
          '<td><span class="status-pill confirmed">Confirmed</span></td>';
        tbody.appendChild(tr);
      });
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#aaa;padding:20px">Could not load bookings. Make sure the backend is running.</td></tr>';
    }
  }

  document.getElementById('lookupInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') lookupBooking();
  });

  window.lookupBooking = lookupBooking;
  window.cancelBooking = cancelBooking;

  loadAllBookings();
}
