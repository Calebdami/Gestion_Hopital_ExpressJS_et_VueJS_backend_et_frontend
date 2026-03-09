import express from 'express'
import DoctorsController from '../controllers/doctorsController.js'
import { verifyToken, authorizeRole } from '../middleware/auth.js'

const router = express.Router()

router.get('/', verifyToken, DoctorsController.getAll)
router.get('/:id', verifyToken, DoctorsController.getById)
router.put('/:id', verifyToken, DoctorsController.updateDoctor)
router.delete('/:id', verifyToken, authorizeRole('admin'), DoctorsController.deleteDoctor)

export default router
