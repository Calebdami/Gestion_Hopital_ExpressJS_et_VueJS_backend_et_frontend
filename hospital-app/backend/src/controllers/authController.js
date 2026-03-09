import db from '../database/jsonDatabase.js';
import { generateToken, hashPassword, comparePasswords } from '../utils/authHelper.js';

class AuthController {
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }

      const users = db.all('users');
      const user = users.find(u => u.username === username);

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      // Accept either hashed password match or plaintext match (dev fallback)
      const passwordMatch = (await comparePasswords(password, user.password)) || password === user.password;

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const token = generateToken(user.id, user.role);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }

  static async createUser(req, res) {
    try {
      // Expect a payload containing user fields and optional role-specific profile
      const payload = req.body || {}
      const { username, password, role } = payload

      if (!username || !password || !role) {
        return res.status(400).json({ message: 'Username, password, and role are required.' })
      }

      // Only admins may create accounts
      const admin = db.get('users', req.user.id)
      if (!admin || admin.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can create accounts.' })
      }

      // Check duplicate
      const users = db.all('users')
      if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'Username already exists.' })
      }

      // Hash password before storing
      const hashed = await hashPassword(password)

      // Build base user record with optional profile fields
      const baseUser = {
        username,
        password: hashed,
        role,
        first_name: payload.first_name || '',
        last_name: payload.last_name || '',
        gender: payload.gender || '',
        phone: payload.phone || '',
        recovery_question: payload.recovery_question || '',
        profile_photo: payload.profile_photo || '',
        status: payload.status || 'active'
      }

      const newUser = db.insert('users', baseUser)

      // If role is doctor, create corresponding doctor profile in doctors.json
      if (role === 'doctor') {
        // Compose doctor profile from payload.doctorProfile or user fields
        const docProfile = payload.doctorProfile || {}
        const doctors = db.all('doctors')

        const newDoc = {
          id: newUser.id,
          username: username,
          first_name: docProfile.first_name || baseUser.first_name || '',
          last_name: docProfile.last_name || baseUser.last_name || '',
          gender: docProfile.gender || baseUser.gender || '',
          specialization: docProfile.specialization || docProfile.speciality || '',
          rpps: docProfile.rpps || docProfile.rpps_number || '',
          phone: docProfile.phone || baseUser.phone || '',
          email: docProfile.email || payload.email || '',
          availability: docProfile.availability || [],
          location: docProfile.location || docProfile.office || '',
          signature_image: docProfile.signature_image || '',
          profile_photo: docProfile.profile_photo || baseUser.profile_photo || '',
          status: docProfile.status || baseUser.status || 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        doctors.push(newDoc)
        db.writeFile('doctors.json', doctors)
      }

      res.status(201).json({ message: 'User created successfully', user: newUser })
    } catch (err) {
      res.status(400).json({ message: 'Error creating user', error: err.message })
    }
  }

  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const user_id = req.user.id;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Old password and new password are required.' });
      }

      const user = db.get('users', user_id);

      // Support plain stored passwords: compare directly or via hash
      const passwordMatch = (await comparePasswords(oldPassword, user.password)) || oldPassword === user.password;
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid old password.' });
      }

      // Save new password in readable/plain format as requested
      db.update('users', user_id, {
        password: newPassword
      });

      res.json({ message: 'Password changed successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error changing password', error: err.message });
    }
  }

  static async me(req, res) {
    try {
      const user = db.get('users', req.user.id)
      if (!user) return res.status(404).json({ message: 'User not found' })
      return res.json({ id: user.id, username: user.username, role: user.role })
    } catch (err) {
      return res.status(500).json({ message: 'Error fetching user', error: err.message })
    }
  }
}

export default AuthController;
