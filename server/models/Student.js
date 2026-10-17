const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  rollNo: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    trim: true,
  },
  course: { type: String, trim: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
  },
  dob: { type: Date },
  address: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', studentSchema);
