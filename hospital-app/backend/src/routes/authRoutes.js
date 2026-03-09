import express from 'express';
import AuthController from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/create-user', verifyToken, AuthController.createUser);
router.post('/change-password', verifyToken, AuthController.changePassword);
router.get('/me', verifyToken, AuthController.me);

export default router;
