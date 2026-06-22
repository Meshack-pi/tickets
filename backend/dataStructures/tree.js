class Seat {
    constructor(seatNumber, status = "Available") {
        this.seatNumber = seatNumber;
        this.status = status; // "Available" or "Booked"
    }
}

class Row {
    constructor(rowNumber) {
        this.rowNumber = rowNumber;
        this.seats = []; // Array of Seat objects
    }
}

class Section {
    constructor(sectionName, basePrice = 40) {
        this.sectionName = sectionName;
        this.basePrice = basePrice;
        this.rows = []; // Array of Row objects
    }
}

class VenueLayout {
    constructor(venueName) {
        this.venueName = venueName;
        this.sections = []; // Array of Section objects
    }
}

// Export the class so routes or server.js can import it later
module.exports = VenueLayout;