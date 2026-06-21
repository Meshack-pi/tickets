const API = '/api';

// ── INDEX PAGE ──────────────────────────────────────────────────────────────
if (document.getElementById('eventsGrid')) {

  let activeSortKey = 'default';

  async function loadEvents() {
    const search = document.getElementById('searchInput').value.trim();
    let url = `${API}/events`;
    const qs = [];
    if (search) qs.push(`search=${encodeURIComponent(search)}`);
    if (activeSortKey !== 'default') qs.push(`sort=${activeSortKey}`);
    if (qs.length) url += '?' + qs.join('&');

    const events = await fetch(url).then(r => r.json());

    document.getElementById('eventCount').textContent = `(${events.length} found)`;
    document.getElementById('noResults').style.display = events.length ? 'none' : 'block';

    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = '';
    events.forEach(ev => {
      const cat     = (ev.category || 'default').toLowerCase();
      const lowSeat = ev.seats < 20;
      const card    = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML = `
        <div class="card-banner ${cat}"></div>
        <div class="card-header">
          <h3>${ev.name}</h3>
          <span class="category-badge ${cat}">${ev.category || 'General'}</span>
        </div>
        <div class="card-body">
          <p>📍 ${ev.venue}</p>
          <p>📅 ${ev.date}</p>
          <p>🔥 Popularity: ${ev.popularity}%</p>
          <p class="seats ${lowSeat ? 'low' : ''}">${lowSeat ? `⚠ Only ${ev.seats} seats left!` : `✓ ${ev.seats} seats available`}</p>
        </div>
        <div class="card-footer">
          <span class="price">KSH ${ev.price.toLocaleString()}</span>
          <button class="btn-book" onclick="location.href='event-details.html?eventId=${ev.id}'">View & Book</button>
        </div>`;
      grid.appendChild(card);
    });
  }

  document.getElementById('searchInput').addEventListener('keydown', e => { if (e.key === 'Enter') loadEvents(); });
  document.querySelector('.search-bar button').addEventListener('click', loadEvents);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSortKey = btn.dataset.sort || 'default';
      loadEvents();
    });
  });

  loadEvents();
}


// ── EVENT DETAILS PAGE ──────────────────────────────────────────────────────
if (document.getElementById('detailsContent')) {

  const venueTree = {
    'Section A': {
      'Row 1': ['A1-1','A1-2','A1-3','A1-4','A1-5'],
      'Row 2': ['A2-1','A2-2','A2-3','A2-4','A2-5']
    },
    'Section B': {
      'Row 1': ['B1-1','B1-2','B1-3','B1-4','B1-5'],
      'Row 2': ['B2-1','B2-2','B2-3','B2-4','B2-5']
    }
  };

  async function loadDetails() {
    const id = new URLSearchParams(location.search).get('eventId');
    const ev = await fetch(`${API}/events/${id}`).then(r => r.json());

    if (ev.error) {
      document.getElementById('detailsContent').innerHTML = '<p style="padding:30px">Event not found.</p>';
      return;
    }

    const cat = (ev.category || 'default').toLowerCase();
    document.getElementById('detailsContent').innerHTML = `
      <div class="details-card">
        <div class="details-banner card-banner ${cat}"></div>
        <div class="details-info">
          <h2>${ev.name}</h2>
          <div class="details-meta">
            <div class="meta-item"><span class="meta-label">📍 Venue</span><span class="meta-value">${ev.venue}</span></div>
            <div class="meta-item"><span class="meta-label">📅 Date</span><span class="meta-value">${ev.date}</span></div>
            <div class="meta-item"><span class="meta-label">💰 Price</span><span class="meta-value">KSH ${ev.price.toLocaleString()}</span></div>
            <div class="meta-item"><span class="meta-label">🔥 Popularity</span><span class="meta-value">${ev.popularity}%</span></div>
            <div class="meta-item"><span class="meta-label">🎟 Seats Left</span><span class="meta-value">${ev.seats}</span></div>
            <div class="meta-item"><span class="meta-label">🏷 Category</span><span class="meta-value">${ev.category || 'General'}</span></div>
          </div>
          <div class="details-actions">
            <button class="btn-primary" onclick="location.href='booking.html?eventId=${ev.id}&eventName=${encodeURIComponent(ev.name)}'">Book This Event</button>
            <button class="btn-secondary" onclick="location.href='index.html'">Back to Events</button>
          </div>
        </div>
      </div>`;

    // Mark seats that are already booked for this event
    const allBookings = await fetch(`${API}/bookings`).then(r => r.json());
    const bookedSeats = Object.values(allBookings)
      .filter(b => String(b.eventId) === String(id) && b.status === 'confirmed')
      .map(b => b.seat);

    renderSeatMap(ev, bookedSeats);
  }

  function renderSeatMap(ev, bookedSeats) {
    const map = document.getElementById('seatMap');
    map.innerHTML = '';

    Object.entries(venueTree).forEach(([section, rows]) => {
      const sl = document.createElement('div');
      sl.className = 'section-label';
      sl.textContent = section;
      map.appendChild(sl);

      Object.entries(rows).forEach(([rowLabel, seats]) => {
        const rl = document.createElement('div');
        rl.className = 'row-label';
        rl.textContent = rowLabel;
        map.appendChild(rl);

        const rd = document.createElement('div');
        rd.className = 'seats-row';

        seats.forEach(seatId => {
          const isBooked = bookedSeats.includes(seatId);
          const btn = document.createElement('button');
          btn.className = `seat-btn ${isBooked ? 'booked' : 'available'}`;
          btn.textContent = seatId;
          btn.disabled = isBooked;
          if (!isBooked) btn.onclick = () => selectSeat(seatId, btn, ev);
          rd.appendChild(btn);
        });

        map.appendChild(rd);
      });
    });
  }

  function selectSeat(seatId, btn, ev) {
    document.querySelectorAll('.seat-btn.selected').forEach(b => b.classList.replace('selected', 'available'));
    btn.classList.replace('available', 'selected');

    const info = document.getElementById('selectedInfo');
    info.className = 'selected-info show';
    info.innerHTML = `✓ Selected: <strong>${seatId}</strong> — KSH ${ev.price.toLocaleString()}
      &nbsp;<button class="btn-primary" style="padding:5px 14px;font-size:0.82rem"
        onclick="location.href='booking.html?eventId=${ev.id}&eventName=${encodeURIComponent(ev.name)}&seat=${seatId}'">
        Proceed to Book
      </button>`;
  }

  loadDetails();
}


// ── BOOKING PAGE ────────────────────────────────────────────────────────────
if (document.getElementById('bookingForm')) {

  let currentEvent = null;

  async function loadBookingPage() {
    const params    = new URLSearchParams(location.search);
    const seat      = params.get('seat') || 'General';
    currentEvent    = await fetch(`${API}/events/${params.get('eventId')}`).then(r => r.json());

    document.getElementById('bookingEventName').textContent  = currentEvent.name;
    document.getElementById('bookingEventDate').textContent  = currentEvent.date;
    document.getElementById('bookingEventVenue').textContent = currentEvent.venue;
    document.getElementById('summaryEvent').textContent      = currentEvent.name;
    document.getElementById('summarySeat').textContent       = seat;
    document.getElementById('summaryPrice').textContent      = `KSH ${currentEvent.price.toLocaleString()}`;
    document.getElementById('summaryTotal').textContent      = `KSH ${currentEvent.price.toLocaleString()}`;
    document.getElementById('summaryQty').textContent        = '1';
  }

  function updateTotal() {
    if (!currentEvent) return;
    const qty = parseInt(document.getElementById('ticketQty').value) || 1;
    document.getElementById('summaryTotal').textContent = `KSH ${(currentEvent.price * qty).toLocaleString()}`;
    document.getElementById('summaryQty').textContent  = qty;
  }

  async function submitBooking() {
    const name  = document.getElementById('nameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const phone = document.getElementById('phoneInput').value.trim();

    const validate = (ok, errId, inputId) => {
      document.getElementById(errId).className    = ok ? 'error-msg' : 'error-msg show';
      document.getElementById(inputId).className  = ok ? '' : 'error';
      return ok;
    };

    const valid =
      validate(!!name,               'nameError',  'nameInput')  &
      validate(!!email && email.includes('@'), 'emailError', 'emailInput') &
      validate(!!phone,              'phoneError', 'phoneInput');

    if (!valid) return;

    const params = new URLSearchParams(location.search);
    const qty    = parseInt(document.getElementById('ticketQty').value) || 1;
    const seat   = params.get('seat') || 'General';

    const booking = await fetch(`${API}/bookings`, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify({
        userName  : name,
        email, phone,
        eventId   : currentEvent.id,
        eventName : currentEvent.name,
        venue     : currentEvent.venue,
        date      : currentEvent.date,
        seat, qty,
        price     : currentEvent.price * qty
      })
    }).then(r => r.json());

    document.getElementById('bookingForm').style.display = 'none';
    document.getElementById('successBox').className      = 'success-box show';
    document.getElementById('confirmedId').textContent   = booking.bookingId;
    document.getElementById('confirmedName').textContent = name;
    document.getElementById('confirmedEvent').textContent = currentEvent.name;
  }

  document.getElementById('ticketQty').addEventListener('change', updateTotal);
  document.querySelector('#bookingForm .btn-primary').addEventListener('click', submitBooking);

  loadBookingPage();
}


// ── MY BOOKINGS PAGE ────────────────────────────────────────────────────────
if (document.getElementById('lookupInput')) {

  async function lookupBooking() {
    const id       = document.getElementById('lookupInput').value.trim().toUpperCase();
    const res      = await fetch(`${API}/bookings/${id}`);
    const result   = document.getElementById('bookingResult');
    const notFound = document.getElementById('notFoundMsg');

    if (!res.ok) {
      result.className   = 'booking-result';
      notFound.className = 'not-found-msg show';
      return;
    }

    const b = await res.json();
    notFound.className = 'not-found-msg';
    result.className   = 'booking-result show';
    result.innerHTML   = `
      <div class="booking-ticket">
        <div class="ticket-header">
          <div><h3>${b.eventName}</h3><p>Booking ID: ${b.bookingId}</p></div>
          <span class="ticket-status ${b.status}">${capitalize(b.status)}</span>
        </div>
        <div class="ticket-body">
          <div class="ticket-item"><div class="t-label">Name</div><div class="t-value">${b.userName}</div></div>
          <div class="ticket-item"><div class="t-label">Email</div><div class="t-value">${b.email}</div></div>
          <div class="ticket-item"><div class="t-label">Venue</div><div class="t-value">${b.venue}</div></div>
          <div class="ticket-item"><div class="t-label">Date</div><div class="t-value">${b.date}</div></div>
          <div class="ticket-item"><div class="t-label">Seat</div><div class="t-value">${b.seat}</div></div>
          <div class="ticket-item"><div class="t-label">Amount Paid</div><div class="t-value">KSH ${Number(b.price).toLocaleString()}</div></div>
        </div>
        <div class="ticket-footer">
          <span style="font-size:0.82rem;color:#888">Booked: ${b.timestamp}</span>
          <button class="btn-danger" onclick="cancelBooking('${b.bookingId}')">Cancel Booking</button>
        </div>
      </div>`;
  }

  async function cancelBooking(bookingId) {
    if (!confirm('Cancel this booking?')) return;
    await fetch(`${API}/bookings/${bookingId}`, { method: 'DELETE' });
    document.getElementById('bookingResult').className = 'booking-result';
    document.getElementById('lookupInput').value       = '';
    document.getElementById('notFoundMsg').className   = 'not-found-msg';
    alert(`Booking ${bookingId} cancelled.`);
    loadAllBookings();
  }

  async function loadAllBookings() {
    const data     = await fetch(`${API}/bookings`).then(r => r.json());
    const bookings = Object.values(data);
    const tbody    = document.getElementById('bookingsTableBody');

    tbody.innerHTML = bookings.length
      ? bookings.map(b => `
          <tr>
            <td>${b.bookingId}</td>
            <td>${b.eventName}</td>
            <td>${b.userName}</td>
            <td>${b.seat}</td>
            <td>KSH ${Number(b.price).toLocaleString()}</td>
            <td><span class="status-badge ${b.status}">${capitalize(b.status)}</span></td>
          </tr>`).join('')
      : '<tr><td colspan="6" style="text-align:center;color:#aaa;padding:20px">No bookings found.</td></tr>';
  }

  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

  // cancelBooking must be on window because it's called from injected innerHTML
  window.cancelBooking = cancelBooking;

  document.getElementById('lookupInput').addEventListener('keydown', e => { if (e.key === 'Enter') lookupBooking(); });
  document.querySelector('.lookup-bar button').addEventListener('click', lookupBooking);

  loadAllBookings();
}
