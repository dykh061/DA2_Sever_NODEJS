const getAllPricingsUseCase = require('../usecase/getAllPricings.usecase');
const getPricingByIdUseCase = require('../usecase/getPricingById.usecase');
const createPricingUseCase = require('../usecase/createPricing.usecase');
const updatePricingUseCase = require('../usecase/updatePricing.usecase');
const deletePricingUseCase = require('../usecase/deletePricing.usecase');

class PricingController {
  async getAll(req, res, next) {
    try {
      const pricings = await getAllPricingsUseCase.execute();
      res.status(200).json(pricings);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const pricing = await getPricingByIdUseCase.execute(req.params.id);
      res.status(200).json(pricing);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const newPricing = await createPricingUseCase.execute(req.body);
      res.status(201).json(newPricing);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updatedPricing = await updatePricingUseCase.execute(req.params.id, req.body);
      res.status(200).json(updatedPricing);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await deletePricingUseCase.execute(req.params.id);
      res.status(200).json({ message: 'Xoa pricing thanh cong!' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PricingController();