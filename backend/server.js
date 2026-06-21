const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));  // serve project root

app.use('/api/events',    require('./routes/eventRoutes'));
app.use('/api/bookings',  require('./routes/bookingRoutes'));
app.use('/api/queue',     require('./routes/queueRoutes'));
app.use('/api/schedules', require('./routes/scheduleRoutes'));

// Default route → home page
app.get('/', (_req, res) => res.redirect('/frontend/pages/index.html'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TicketHive running → http://localhost:${PORT}`);
});
