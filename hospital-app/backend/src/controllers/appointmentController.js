import db from '../database/jsonDatabase.js';

class AppointmentController {
  static getAll(req, res) {
    try {
      const { doctor_id, patient_id } = req.query;
      let appointments = db.all('appointments');

      if (doctor_id) {
        appointments = appointments.filter(a => a.doctor_id === parseInt(doctor_id));
      }

      if (patient_id) {
        appointments = appointments.filter(a => a.patient_id === parseInt(patient_id));
      }

      res.json(appointments);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching appointments', error: err.message });
    }
  }

  static getById(req, res) {
    try {
      const { id } = req.params;
      const appointment = db.get('appointments', parseInt(id));

      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      res.json(appointment);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching appointment', error: err.message });
    }
  }

  static create(req, res) {
    try {
      const { patient_id, doctor_id, appointment_date, appointment_time, reason, notes, status } = req.body;

      if (!patient_id || !doctor_id || !appointment_date) {
        return res.status(400).json({ message: 'Patient, doctor, and date are required.' });
      }

      // Resolve patient and doctor names to store alongside ids
      const patient = db.get('patients', parseInt(patient_id)) || {}
      const doctor = db.get('doctors', parseInt(doctor_id)) || {}
      const patient_name = patient.first_name && patient.last_name ? `${patient.first_name} ${patient.last_name}` : (patient.name || '')
      const doctor_name = doctor.first_name && doctor.last_name ? `${doctor.first_name} ${doctor.last_name}` : (doctor.username || '')

      const newAppointment = db.insert('appointments', {
        patient_id: parseInt(patient_id),
        doctor_id: parseInt(doctor_id),
        patient_name,
        doctor_name,
        appointment_date,
        appointment_time: appointment_time || '',
        reason: reason || '',
        notes: notes || '',
        status: status || 'pending'
      });

      res.status(201).json({
        message: 'Appointment created successfully',
        appointment: newAppointment
      });
    } catch (err) {
      res.status(500).json({ message: 'Error creating appointment', error: err.message });
    }
  }

  static update(req, res) {
    try {
      const { id } = req.params;
      const { status, appointment_date, appointment_time, reason, notes } = req.body;

      const appointment = db.get('appointments', parseInt(id));
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      // Ensure names remain in sync if doctor_id or patient_id changed in payload
      let updatePayload = {
        status: status || appointment.status,
        appointment_date: appointment_date || appointment.appointment_date,
        appointment_time: appointment_time || appointment.appointment_time,
        reason: reason || appointment.reason,
        notes: notes || appointment.notes
      }

      if (req.body.patient_id && parseInt(req.body.patient_id) !== appointment.patient_id) {
        const patient = db.get('patients', parseInt(req.body.patient_id)) || {}
        updatePayload.patient_id = parseInt(req.body.patient_id)
        updatePayload.patient_name = patient.first_name && patient.last_name ? `${patient.first_name} ${patient.last_name}` : (patient.name || '')
      }

      if (req.body.doctor_id && parseInt(req.body.doctor_id) !== appointment.doctor_id) {
        const doctor = db.get('doctors', parseInt(req.body.doctor_id)) || {}
        updatePayload.doctor_id = parseInt(req.body.doctor_id)
        updatePayload.doctor_name = doctor.first_name && doctor.last_name ? `${doctor.first_name} ${doctor.last_name}` : (doctor.username || '')
      }

      db.update('appointments', parseInt(id), updatePayload);

      res.json({ message: 'Appointment updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error updating appointment', error: err.message });
    }
  }

  static delete(req, res) {
    try {
      const { id } = req.params;

      const appointment = db.get('appointments', parseInt(id));
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      // Move to trash
      const trash = db.all('trash');
      trash.push({
        id: trash.length + 1,
        item_type: 'appointment',
        item_id: appointment.id,
        item_data: appointment,
        deleted_by: req.user?.id || 1,
        created_at: new Date().toISOString()
      });
      db.writeFile('trash.json', trash);

      // Delete appointment
      db.delete('appointments', parseInt(id));

      res.json({ message: 'Appointment deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting appointment', error: err.message });
    }
  }
}

export default AppointmentController;
