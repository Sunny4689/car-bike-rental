import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadDrivingLicense,
  getAllUsers,
  verifyLicenseStatus,
} from '../controller/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/license', protect, uploadDrivingLicense);

// Admin routes
router.get('/admin/users', protect, adminOnly, getAllUsers);
router.put('/admin/verify-license/:id', protect, adminOnly, verifyLicenseStatus);

export default router;
