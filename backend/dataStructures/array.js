class TicketInventory {
    constructor() {
        this.tickets = []; 
    }

    // 1. Add a newly purchased ticket to the end of the array
    addTicket(ticketId, customerName, section, row, seat, price) {
        const newTicket = {
            ticketId: ticketId,
            customerName: customerName,
            section: section,
            row: row,
            seat: seat,
            price: price,
            purchasedAt: new Date()
        };
        this.tickets.push(newTicket);
        return newTicket;
    }

    // 2. Linear search to find a ticket by its ID
    findTicketById(ticketId) {
        for (let i = 0; i < this.tickets.length; i++) {
            if (this.tickets[i].ticketId === ticketId) {
                return this.tickets[i];
            }
        }
        return null; 
    }

    // 3. Remove/Refund a ticket from the array by its ID
    removeTicket(ticketId) {
        for (let i = 0; i < this.tickets.length; i++) {
            if (this.tickets[i].ticketId === ticketId) {
                const removedTicket = this.tickets.splice(i, 1);
                return removedTicket[0]; 
            }
        }
        return null; 
    }

    // 4. Return the entire transaction ledger
    getAllTickets() {
        return this.tickets;
    }
}

module.exports = TicketInventory;

// =========================================================================
// SAMPLE TEST DATA 
// =========================================================================
if (require.main === module) {
    const inventory = new TicketInventory();

    inventory.addTicket("TICK-201", "Griffin Kiptoo", "VIP Lounge", 1, 3, 150);
    inventory.addTicket("TICK-202", "Earl Roymen", "Main Stand", 5, 12, 40);
    inventory.addTicket("TICK-203", "Stacy Chebet", "VIP Lounge", 2, 1, 150);
    inventory.addTicket("TICK-204", "Brian Omondi", "Terraces", 14, 8, 20);
    inventory.addTicket("TICK-205", "Ivan Nyoro", "Main Stand", 4, 11, 40);
    inventory.addTicket("TICK-206", "Matthew Keah", "Terraces", 12, 5, 20);

    console.log("--- Initial Inventory ---");
    console.log(inventory.getAllTickets());

    console.log("\n--- Searching for TICK-205 ---");
    console.log(inventory.findTicketById("TICK-205"));

    console.log("\n--- Refunding TICK-201 ---");
    inventory.removeTicket("TICK-201");

    console.log("\n--- Final Inventory ---");
    console.log(inventory.getAllTickets());
}