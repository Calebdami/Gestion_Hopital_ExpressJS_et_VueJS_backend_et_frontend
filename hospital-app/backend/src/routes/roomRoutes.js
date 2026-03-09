import express from 'express';
import RoomController from '../controllers/roomController.js';
import { verifyToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, RoomController.getAll);
router.get('/:id', verifyToken, RoomController.getById);
router.post('/', verifyToken, authorizeRole('admin'), RoomController.create);
router.put('/:id', verifyToken, authorizeRole('admin', 'doctor'), RoomController.update);
router.delete('/:id', verifyToken, authorizeRole('admin'), RoomController.delete);

export default router;
