const getAllCourtsUseCase = require('../usecase/getAllCourts.usecase');
const getCourtByIdUseCase = require('../usecase/getCourtById.usecase');
const createCourtUseCase = require('../usecase/createCourt.usecase');
const updateCourtUseCase = require('../usecase/updateCourt.usecase');
const deleteCourtUseCase = require('../usecase/deleteCourt.usecase');

class CourtController {
    async getAll(req, res) {
        try {
            const courts = await getAllCourtsUseCase.execute();
            res.status(200).json(courts);
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ error: error.message || 'Internal server error' });
        }
    }

    async getById(req, res) {
        try {
            const court = await getCourtByIdUseCase.execute(req.params.id);
            res.status(200).json(court);
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ error: error.message || 'Internal server error' });
        }
    }

    async create(req, res) {
        try {
            const newCourt = await createCourtUseCase.execute(req.body);
            res.status(201).json(newCourt);
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ error: error.message || 'Internal server error' });
        }
    }

    async update(req, res) {
        try {
            const updatedCourt = await updateCourtUseCase.execute(req.params.id, req.body);
            res.status(200).json(updatedCourt);
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ error: error.message || 'Internal server error' });
        }
    }

    async delete(req, res) {
        try {
            await deleteCourtUseCase.execute(req.params.id);
            res.status(200).json({ message: 'Xoa Court thanh cong!' });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ error: error.message || 'Internal server error' });
        }
    }
}

module.exports = new CourtController();