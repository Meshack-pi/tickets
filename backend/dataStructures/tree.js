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
    addSection(sectionName, basePrice) {
        let existingSection = this.sections.find(sec => sec.sectionName === sectionName);
        if (existingSection) return existingSection;

        let newSection = new Section(sectionName, basePrice);
        this.sections.push(newSection);
        return newSection;
    }

    // Function to add a row under a section
    addRow(sectionName, rowNumber) {
        let section = this.sections.find(sec => sec.sectionName === sectionName);
        if (section) {
            let newRow = new Row(rowNumber);
            section.rows.push(newRow);
            return newRow;
        }
        console.log(`Section ${sectionName} not found!`);
        return null;
    }

    // Function to add a seat under a row in a section
    addSeat(sectionName, rowNumber, seatNumber, status = "Available") {
        let section = this.sections.find(sec => sec.sectionName === sectionName);
        if (section) {
            let row = section.rows.find(r => r.rowNumber === rowNumber);
            if (row) {
                let newSeat = new Seat(seatNumber, status);
                row.seats.push(newSeat);
                return newSeat;
            }
        }
        console.log(`Section ${sectionName} or Row ${rowNumber} not found!`);
        return null;
    }

    // 1. Find all available seats in a specific section
    findAvailableSeats(sectionName) {
        let availableSeats = [];
        let section = this.sections.find(sec => sec.sectionName === sectionName);
        
        if (!section) {
            console.log(`Section ${sectionName} not found.`);
            return availableSeats;
        }

        // Traverse the tree hierarchy: Section -> Rows -> Seats
        section.rows.forEach(row => {
            row.seats.forEach(seat => {
                if (seat.status === "Available") {
                    availableSeats.push({
                        section: sectionName,
                        row: row.rowNumber,
                        seat: seat.seatNumber,
                        price: section.basePrice
                    });
                }
            });
        });

        return availableSeats;
    }

    // 2. Change a seat's status from Available to Booked
    bookSeat(sectionName, rowNumber, seatNumber) {
        let section = this.sections.find(sec => sec.sectionName === sectionName);
        if (section) {
            let row = section.rows.find(r => r.rowNumber === rowNumber);
            if (row) {
                let seat = row.seats.find(s => s.seatNumber === seatNumber);
                if (seat) {
                    if (seat.status === "Available") {
                        seat.status = "Booked";
                        console.log(`Successfully booked Section ${sectionName}, Row ${rowNumber}, Seat ${seatNumber}!`);
                        return true;
                    } else {
                        console.log("Seat is already booked!");
                        return false;
                    }
                }
            }
        }
        console.log("Seat execution failed: Location not found.");
        return false;
    }

    // 3. Walk through the entire tree and return all seats (For Member 1's UI map)
    traverse() {
        let fullManifest = [];
        
        this.sections.forEach(section => {
            section.rows.forEach(row => {
                row.seats.forEach(seat => {
                    fullManifest.push({
                        section: section.sectionName,
                        row: row.rowNumber,
                        seat: seat.seatNumber,
                        status: seat.status,
                        price: section.basePrice
                    });
                });
            });
        });

        return fullManifest;
    }
}

// Export the class so routes or server.js can import it later
module.exports = VenueLayout;

// =========================================================================
// SAMPLE TEST DATA (Runs only when executing this file directly)
// =========================================================================
if (require.main === module) {
    const nairobiStadium = new VenueLayout("Nairobi Stadium");

    nairobiStadium.addSection("VIP Lounge", 150);
    nairobiStadium.addRow("VIP Lounge", 1);
    nairobiStadium.addSeat("VIP Lounge", 1, 1, "Available");
    nairobiStadium.addSeat("VIP Lounge", 1, 2, "Booked");
    nairobiStadium.addSeat("VIP Lounge", 1, 3, "Available");

    console.log("--- Booking Attempt ---");
    nairobiStadium.bookSeat("VIP Lounge", 1, 3);

    console.log("\n--- Open Seats in VIP ---");
    console.log(nairobiStadium.findAvailableSeats("VIP Lounge"));
}