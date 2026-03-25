class Court {
    constructor(id, name, status, imageUrls = [], pricings = []) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.imageUrls = imageUrls;
        this.pricings = pricings;
    }
}

module.exports = Court;