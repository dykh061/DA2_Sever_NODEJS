class PricingRepository {
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

  async existsCourt(courtId) {
    throw new Error('Not implemented');
  }

  async existsTimeSlot(timeSlotId) {
    throw new Error('Not implemented');
  }

  async findDuplicate(courtId, dayType, timeSlotId, excludeId = null) {
    throw new Error('Not implemented');
  }
}

module.exports = PricingRepository;