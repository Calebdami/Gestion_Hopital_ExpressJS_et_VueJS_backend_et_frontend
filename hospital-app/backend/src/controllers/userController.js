import db from '../database/jsonDatabase.js'

class UserController {
    static getAll(req, res) {
        try {
            const users = db.all('users').map(u => ({
                id: u.id,
                username: u.username,
                role: u.role,
                created_at: u.created_at,
                updated_at: u.updated_at
            }))
            res.json(users)
        } catch (err) {
            res.status(500).json({ message: 'Error fetching users', error: err.message })
        }
    }

    static getById(req, res) {
        try {
            const { id } = req.params
            const user = db.get('users', parseInt(id))

            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            // If the user is a doctor, include doctor profile details if available
            if (user.role === 'doctor') {
                const doctorProfile = db.get('doctors', user.id)
                return res.json({
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    profile: doctorProfile || null,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                })
            }

            res.json({
                id: user.id,
                username: user.username,
                role: user.role,
                created_at: user.created_at,
                updated_at: user.updated_at
            })
        } catch (err) {
            res.status(500).json({ message: 'Error fetching user', error: err.message })
        }
    }

    static deleteUser(req, res) {
        try {
            const { id } = req.params

            const userToDelete = db.get('users', parseInt(id))
            if (!userToDelete) {
                return res.status(404).json({ message: 'User not found' })
            }

            // Protect default admin accounts (marked by is_default_admin)
            if (userToDelete.is_default_admin) {
                return res.status(403).json({ message: 'Cannot delete default admin account' })
            }

            // Move user to trash
            const trash = db.all('trash')
            trash.push({
                id: trash.length + 1,
                item_type: 'user',
                item_id: userToDelete.id,
                item_data: userToDelete,
                deleted_by: req.user?.id || 1,
                created_at: new Date().toISOString()
            })
            db.writeFile('trash.json', trash)

            // If user is a doctor, also remove doctor profile if present
            if (userToDelete.role === 'doctor') {
                const doc = db.get('doctors', userToDelete.id)
                if (doc) {
                    const t = db.all('trash')
                    t.push({
                        id: t.length + 1,
                        item_type: 'doctor',
                        item_id: doc.id,
                        item_data: doc,
                        deleted_by: req.user?.id || 1,
                        created_at: new Date().toISOString()
                    })
                    db.writeFile('trash.json', t)
                }
                db.delete('doctors', userToDelete.id)
            }

            db.delete('users', parseInt(id))

            res.json({ message: 'User deleted successfully' })
        } catch (err) {
            res.status(500).json({ message: 'Error deleting user', error: err.message })
        }
    }

    static updateUser(req, res) {
        try {
            const { id } = req.params
            const updater = req.user

            const user = db.get('users', parseInt(id))
            if (!user) return res.status(404).json({ message: 'User not found' })

            // Only admins or the user themselves can update
            if (updater.role !== 'admin' && updater.id !== user.id) {
                return res.status(403).json({ message: 'Not authorized to update this user' })
            }

            const { username, role } = req.body

            // Prevent changing default admin flag or deleting default admin via update
            const allowed = {}
            if (username) allowed.username = username
            if (role) allowed.role = role

            const ok = db.update('users', parseInt(id), allowed)
            if (!ok) return res.status(400).json({ message: 'Update failed' })

            const updated = db.get('users', parseInt(id))
            res.json({ message: 'User updated', user: updated })
        } catch (err) {
            res.status(500).json({ message: 'Error updating user', error: err.message })
        }
    }
}

export default UserController
