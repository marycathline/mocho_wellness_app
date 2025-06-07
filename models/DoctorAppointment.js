const mongoose = require('mongoose');

const DoctorAppointmentSchema = new mongoose.Schema({
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointment_date: { type: Date, required: true },
  appointment_type: { type: String, enum: ['video', 'audio', 'text'], required: true },
  notes: String,
  status: { type: String, default: 'scheduled' }
});

module.exports = mongoose.model('DoctorAppointment', DoctorAppointmentSchema);