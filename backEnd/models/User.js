const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  // email: {
  //   type: String,
  //   required: [true, 'Email is required'],
  //   unique: true,
  //   lowercase: true,
  //   match: [/@paruluniversity\.ac\.in$/, 'Must be a Parul University email']
  // }
  email: {
  type: String,
  required: [true, 'Email is required'],
  unique: true,
  lowercase: true,
},
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  studentId: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);