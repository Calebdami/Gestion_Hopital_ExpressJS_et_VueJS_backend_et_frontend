import db from '../database/jsonDatabase.js';

class PatientController {
  static getAll(req, res) {
    try {
      const { search, filter } = req.query;
      let patients = db.all('patients');

      if (search) {
        patients = patients.filter(p =>
          p.first_name.toLowerCase().includes(search.toLowerCase()) ||
          p.last_name.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (filter) {
        patients = patients.filter(p => p.status === filter);
      } else {
        patients = patients.filter(p => p.status !== 'deleted');
      }

      res.json(patients);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching patients', error: err.message });
    }
  }

  static getById(req, res) {
    try {
      const { id } = req.params;
      const patient = db.get('patients', parseInt(id));

      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      res.json(patient);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching patient', error: err.message });
    }
  }

  static create(req, res) {
    try {
      const { first_name, last_name, email, phone, date_of_birth, address, assigned_doctor_id, assigned_room_id } = req.body;

      if (!first_name || !last_name) {
        return res.status(400).json({ message: 'First name and last name are required.' });
      }

      const newPatient = db.insert('patients', {
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        address,
        assigned_doctor_id: assigned_doctor_id || null,
        assigned_room_id: assigned_room_id || null,
        status: 'active'
      });

      // Update room capacity if assigned
      if (assigned_room_id) {
        const room = db.get('rooms', assigned_room_id);
        if (room) {
          db.update('rooms', assigned_room_id, {
            occupied_capacity: room.occupied_capacity + 1
          });
        }
      }

      res.status(201).json({
        message: 'Patient created successfully',
        patient: newPatient
      });
    } catch (err) {
      res.status(500).json({ message: 'Error creating patient', error: err.message });
    }
  }

  static update(req, res) {
    try {
      const { id } = req.params;
      const { first_name, last_name, email, phone, date_of_birth, address, assigned_doctor_id, assigned_room_id, status } = req.body;

      const patient = db.get('patients', parseInt(id));
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      // Handle room change
      if (assigned_room_id && assigned_room_id !== patient.assigned_room_id) {
        // Decrease occupancy of old room
        if (patient.assigned_room_id) {
          const oldRoom = db.get('rooms', patient.assigned_room_id);
          if (oldRoom) {
            db.update('rooms', patient.assigned_room_id, {
              occupied_capacity: Math.max(0, oldRoom.occupied_capacity - 1)
            });
          }
        }
        // Increase occupancy of new room
        const newRoom = db.get('rooms', assigned_room_id);
        if (newRoom) {
          db.update('rooms', assigned_room_id, {
            occupied_capacity: newRoom.occupied_capacity + 1
          });
        }
      }

      db.update('patients', parseInt(id), {
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        address,
        assigned_doctor_id,
        assigned_room_id,
        status: status || 'active'
      });

      res.json({ message: 'Patient updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error updating patient', error: err.message });
    }
  }

  static delete(req, res) {
    try {
      const { id } = req.params;
      const patient = db.get('patients', parseInt(id));

      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      // Move to trash
      const trash = db.all('trash');
      trash.push({
        id: trash.length + 1,
        item_type: 'patient',
        item_id: patient.id,
        item_data: patient,
        deleted_by: req.user?.id || 1,
        created_at: new Date().toISOString()
      });
      db.writeFile('trash.json', trash);

      // Decrease room occupancy
      if (patient.assigned_room_id) {
        const room = db.get('rooms', patient.assigned_room_id);
        if (room) {
          db.update('rooms', patient.assigned_room_id, {
            occupied_capacity: Math.max(0, room.occupied_capacity - 1)
          });
        }
      }

      // Delete patient
      db.delete('patients', parseInt(id));

      res.json({ message: 'Patient deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting patient', error: err.message });
    }
  }
}

export default PatientController;
