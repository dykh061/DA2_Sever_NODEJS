class Bookings {
    constructor({id, userId, status, type, createdAt}) {
        this.id = id || null;
        this.userId = userId;
        this.status = status || "pending";
        this.type = type || "normal";
        this.createdAt = createdAt || new Date();

        this.details =[];
    }

    addDetails(bookingDatail){
        this.details.push(bookingDatail);
    }
}
module.exports = Bookings;