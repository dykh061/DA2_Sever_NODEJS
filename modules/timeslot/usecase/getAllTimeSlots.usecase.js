const timeSlotRepository = require('../infrastructure/timeslot.repository.impl');

class GetAllTimeSlotsUseCase {
  async execute() {
    return await timeSlotRepository.findAll();
  }
}

module.exports = new GetAllTimeSlotsUseCase();