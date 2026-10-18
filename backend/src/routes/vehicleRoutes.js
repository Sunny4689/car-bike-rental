import express from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  addVehicleReview,
  checkAvailability,
} from '../controller/vehicleController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.get('/:id/availability', checkAvailability);
router.post('/:id/reviews', addVehicleReview);

// Admin only CRUD
router.post('/', protect, adminOnly, createVehicle);
router.put('/:id', protect, adminOnly, updateVehicle);
router.delete('/:id', protect, adminOnly, deleteVehicle);

export default router;
