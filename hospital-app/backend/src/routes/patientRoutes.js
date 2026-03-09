import express from 'express';
import PatientController from '../controllers/patientController.js';
import { verifyToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, PatientController.getAll);
router.get('/:id', verifyToken, PatientController.getById);
router.post('/', verifyToken, authorizeRole('admin', 'receptionist'), PatientController.create);
router.put('/:id', verifyToken, authorizeRole('admin', 'receptionist', 'doctor'), PatientController.update);
router.delete('/:id', verifyToken, authorizeRole('admin', 'receptionist'), PatientController.delete);

export default router;
