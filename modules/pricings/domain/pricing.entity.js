class Pricing {
  constructor(
    id,
    court_id,
    day_type,
    price,
    time_slot_id,
    court_name = null,
    start_time = null,
    end_time = null
  ) {
    this.id = id;
    this.court_id = court_id;
    this.day_type = day_type;
    this.price = price;
    this.time_slot_id = time_slot_id;
    this.court_name = court_name;
    this.start_time = start_time;
    this.end_time = end_time;
  }
}

module.exports = Pricing;