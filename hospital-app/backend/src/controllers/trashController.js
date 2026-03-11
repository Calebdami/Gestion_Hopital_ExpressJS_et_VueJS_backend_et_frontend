import db from '../database/jsonDatabase.js';

class TrashController {
  static getAll(req, res) {
    try {
      const trash = db.all('trash') || [];
      // normalize fields for frontend
      const items = trash.map(t => ({
        id: t.id,
        item_type: t.item_type,
        item_id: t.item_id,
        item_data: t.item_data,
        deleted_by: t.deleted_by,
        deleted_at: t.deleted_at || t.created_at || t.createdAt || null
      }));
      res.json(items);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching trash', error: err.message });
    }
  }

  static delete(req, res) {
    try {
      const { id } = req.params;
      const trash = db.all('trash') || [];
      const idx = trash.findIndex(t => String(t.id) === String(id));
      if (idx === -1) return res.status(404).json({ message: 'Trash item not found' });
      trash.splice(idx, 1);
      db.writeFile('trash.json', trash);
      res.json({ message: 'Trash item permanently deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting trash item', error: err.message });
    }
  }

  static clearAll(req, res) {
    try {
      db.writeFile('trash.json', []);
      res.json({ message: 'Trash cleared' });
    } catch (err) {
      res.status(500).json({ message: 'Error clearing trash', error: err.message });
    }
  }
}

export default TrashController;
