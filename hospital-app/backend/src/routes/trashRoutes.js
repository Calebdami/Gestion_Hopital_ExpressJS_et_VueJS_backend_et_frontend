import express from 'express';
import TrashController from '../controllers/trashController.js';
import { verifyToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, authorizeRole('admin'), TrashController.getAll);
router.delete('/:id', verifyToken, authorizeRole('admin'), TrashController.delete);
router.delete('/', verifyToken, authorizeRole('admin'), TrashController.clearAll);

export default router;
