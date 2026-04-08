class TimeSlotRepository {
  async findAll() {
    throw new Error('Not implemented');
  }

  async findById(id) {
    throw new Error('Not implemented');
  }

  async create(data) {
    throw new Error('Not implemented');
  }

  async update(id, data) {
    throw new Error('Not implemented');
  }

  async delete(id) {
    throw new Error('Not implemented');
  }

  async findDuplicate(startTime, endTime, excludeId = null) {
    throw new Error('Not implemented');
  }

  async findOverlap(startTime, endTime, excludeId = null) {
    throw new Error('Not implemented');
  }

  async countPricingReferences(timeSlotId) {
    throw new Error('Not implemented');
  }

  async countBookingReferences(timeSlotId) {
    throw new Error('Not implemented');
  }
}

module.exports = TimeSlotRepository;