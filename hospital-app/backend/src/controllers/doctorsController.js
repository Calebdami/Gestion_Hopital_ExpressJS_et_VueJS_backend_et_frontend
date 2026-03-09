import db from '../database/jsonDatabase.js'

class DoctorsController {
    static getAll(req, res) {
        try {
            const doctors = db.all('doctors')
            res.json(doctors)
        } catch (err) {
            res.status(500).json({ message: 'Error fetching doctors', error: err.message })
        }
    }

    static getById(req, res) {
        try {
            const { id } = req.params
            const doc = db.get('doctors', parseInt(id))
            if (!doc) return res.status(404).json({ message: 'Doctor not found' })
            res.json(doc)
        } catch (err) {
            res.status(500).json({ message: 'Error fetching doctor', error: err.message })
        }
    }

    static updateDoctor(req, res) {
        try {
            const { id } = req.params
            const updater = req.user

            // Only admin or the doctor themselves can update doctor profile
            if (updater.role !== 'admin' && updater.id !== parseInt(id)) {
                return res.status(403).json({ message: 'Not authorized to update this doctor' })
            }

            const payload = req.body
            const ok = db.update('doctors', parseInt(id), payload)
            if (!ok) return res.status(400).json({ message: 'Update failed' })
            const updated = db.get('doctors', parseInt(id))
            res.json({ message: 'Doctor updated', doctor: updated })
        } catch (err) {
            res.status(500).json({ message: 'Error updating doctor', error: err.message })
        }
    }

    static deleteDoctor(req, res) {
        try {
            const { id } = req.params
            const doc = db.get('doctors', parseInt(id))
            if (!doc) return res.status(404).json({ message: 'Doctor not found' })

            // Only admins can delete doctors (route should protect but double-check)
            if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' })

            // Remove doctor profile
            db.delete('doctors', parseInt(id))
            // Remove login/user entry if exists
            const removedUser = db.delete('users', parseInt(id))

            res.json({ message: 'Doctor deleted', removedUser: removedUser || null })
        } catch (err) {
            res.status(500).json({ message: 'Error deleting doctor', error: err.message })
        }
    }
}

export default DoctorsController
