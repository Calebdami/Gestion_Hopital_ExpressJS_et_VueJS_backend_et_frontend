import express from 'express';
import AppointmentController from '../controllers/appointmentController.js';
import { verifyToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, AppointmentController.getAll);
router.get('/:id', verifyToken, AppointmentController.getById);
router.post('/', verifyToken, authorizeRole('admin', 'receptionist', 'doctor'), AppointmentController.create);
router.put('/:id', verifyToken, authorizeRole('admin', 'receptionist', 'doctor'), AppointmentController.update);
router.delete('/:id', verifyToken, authorizeRole('admin', 'receptionist'), AppointmentController.delete);

export default router;
