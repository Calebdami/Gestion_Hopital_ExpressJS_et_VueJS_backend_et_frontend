const getStats = async (db) => {
  const doctors = await db.all('SELECT COUNT(*) as count FROM doctors WHERE available = 1');
  const patients = await db.all('SELECT COUNT(*) as count FROM patients WHERE status = "active"');
  const appointments = await db.all('SELECT COUNT(*) as count FROM appointments WHERE status = "pending"');
  const rooms = await db.all('SELECT COUNT(*) as count FROM rooms');

  return {
    doctorsAvailable: doctors[0]?.count || 0,
    activePatients: patients[0]?.count || 0,
    pendingAppointments: appointments[0]?.count || 0,
    totalRooms: rooms[0]?.count || 0
  };
};

export { getStats };
