const getAllTimeSlotsUseCase = require('../usecase/getAllTimeSlots.usecase');
const getTimeSlotByIdUseCase = require('../usecase/getTimeSlotById.usecase');
const createTimeSlotUseCase = require('../usecase/createTimeSlot.usecase');
const updateTimeSlotUseCase = require('../usecase/updateTimeSlot.usecase');
const deleteTimeSlotUseCase = require('../usecase/deleteTimeSlot.usecase');

class TimeSlotController {
  async getAll(req, res) {
    try {
      const timeSlots = await getAllTimeSlotsUseCase.execute();
      res.status(200).json(timeSlots);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message || 'Internal server error' });
    }
  }

  async getById(req, res) {
    try {
      const timeSlot = await getTimeSlotByIdUseCase.execute(req.params.id);
      res.status(200).json(timeSlot);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message || 'Internal server error' });
    }
  }

  async create(req, res) {
    try {
      const newTimeSlot = await createTimeSlotUseCase.execute(req.body);
      res.status(201).json(newTimeSlot);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message || 'Internal server error' });
    }
  }

  async update(req, res) {
    try {
      const updatedTimeSlot = await updateTimeSlotUseCase.execute(req.params.id, req.body);
      res.status(200).json(updatedTimeSlot);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message || 'Internal server error' });
    }
  }

  async delete(req, res) {
    try {
      await deleteTimeSlotUseCase.execute(req.params.id);
      res.status(200).json({ message: 'Xoa time slot thanh cong!' });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message || 'Internal server error' });
    }
  }
}

module.exports = new TimeSlotController();