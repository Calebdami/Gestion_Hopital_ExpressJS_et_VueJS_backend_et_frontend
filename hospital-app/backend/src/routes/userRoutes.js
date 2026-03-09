import express from 'express'
import UserController from '../controllers/userController.js'
import { verifyToken, authorizeRole } from '../middleware/auth.js'

const router = express.Router()

router.get('/', verifyToken, authorizeRole('admin'), UserController.getAll)
router.get('/:id', verifyToken, UserController.getById)
router.put('/:id', verifyToken, UserController.updateUser)
router.delete('/:id', verifyToken, authorizeRole('admin'), UserController.deleteUser)

export default router
