import db from '../database/jsonDatabase.js';

class RoomController {
  static getAll(req, res) {
    try {
      let rooms = db.all('rooms');
      if (req.query.available === 'true') {
        rooms = rooms.filter(r => (r.occupied_capacity || 0) < (r.total_capacity || 0))
      }
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching rooms', error: err.message });
    }
  }

  static getById(req, res) {
    try {
      const { id } = req.params;
      const room = db.get('rooms', parseInt(id));

      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      // Get patients in this room
      const patients = db.filter('patients', p => p.assigned_room_id === parseInt(id));

      res.json({ ...room, patients });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching room', error: err.message });
    }
  }

  static create(req, res) {
    try {
      const { name, total_capacity } = req.body;

      if (!name || !total_capacity) {
        return res.status(400).json({ message: 'Name and capacity are required.' });
      }

      const existing = db.filter('rooms', r => r.name === name);
      if (existing.length > 0) {
        return res.status(400).json({ message: 'Room name already exists.' });
      }

      const newRoom = db.insert('rooms', {
        name,
        total_capacity,
        occupied_capacity: 0
      });

      res.status(201).json({
        message: 'Room created successfully',
        room: newRoom
      });
    } catch (err) {
      res.status(500).json({ message: 'Error creating room', error: err.message });
    }
  }

  static update(req, res) {
    try {
      const { id } = req.params;
      const { name, total_capacity } = req.body;

      const room = db.get('rooms', parseInt(id));
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      db.update('rooms', parseInt(id), {
        name: name || room.name,
        total_capacity: total_capacity || room.total_capacity
      });

      res.json({ message: 'Room updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error updating room', error: err.message });
    }
  }

  static delete(req, res) {
    try {
      const { id } = req.params;

      const room = db.get('rooms', parseInt(id));
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      // Move to trash
      const trash = db.all('trash');
      trash.push({
        id: trash.length + 1,
        item_type: 'room',
        item_id: room.id,
        item_data: room,
        deleted_by: req.user?.id || 1,
        created_at: new Date().toISOString()
      });
      db.writeFile('trash.json', trash);

      // Delete room
      db.delete('rooms', parseInt(id));

      res.json({ message: 'Room deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting room', error: err.message });
    }
  }
}

export default RoomController;
