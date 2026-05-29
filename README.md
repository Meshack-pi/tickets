tickets/
│
├── data/                          ← All JSON storage files
│   ├── events.json
│   ├── bookings.json
│   ├── queue.json
│   ├── venues.json
│   └── schedule.json
│
├── frontend/                      ← Member 1's territory
│   ├── pages/
│   │   ├── index.html             ← Home page (event listings)
│   │   ├── event-details.html     ← Single event + seat map
│   │   ├── booking.html           ← Booking form
│   │   └── my-bookings.html       ← Lookup/cancel bookings
│   │
│   ├── css/
│   │   └── styles.css             ← All styling
│   │
│   └── js/
│       └── app.js                 ← Frontend logic (fetch calls)
│
├── backend/                       ← All backend members' territory
│   │
│   ├── dataStructures/            ← Each member's structure
│   │   ├── hashTable.js           ← Member 2
│   │   ├── queue.js               ← Member 2
│   │   ├── tree.js                ← Member 3
│   │   ├── array.js               ← Member 3
│   │   └── scheduler.js           ← Member 5
│   │
│   ├── algorithms/                ← Member 4's territory
│   │   ├── quickSort.js
│   │   └── binarySearch.js
│   │
│   ├── routes/                    ← API endpoints (server routes)
│   │   ├── eventRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── queueRoutes.js
│   │   ├── venueRoutes.js
│   │   └── scheduleRoutes.js
│   │
│   └── server.js                  ← Main server file (ties everything together)
│
├── docs/                          ← Member 5's documentation territory
│   ├── data-flow-diagram.png      ← System diagram
│   ├── complexity-analysis.md     ← Big O explanations
│   ├── crud-table.md              ← CRUD documentation
│   └── presentation-notes.md     ← Presentation talking points
│
├── package.json                   ← Project dependencies
└── README.md                      ← How to run the project