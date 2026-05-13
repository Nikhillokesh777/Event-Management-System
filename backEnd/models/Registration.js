 const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    enum: ['registered', 'attended', 'cancelled'],
    default: 'registered'
  },
  registrationId: {
    type: String,
    unique: true
  },
  paymentStatus: {
    type: String,
    enum: ['free', 'pending', 'paid'],
    default: 'free'
  },

  // ✅ NEW — QR Code stored as base64 string
  qrCode: {
    type: String,
    default: ''
  }

}, { timestamps: true });

// Auto-generate registrationId + QR Code before saving
registrationSchema.pre('save', async function() {
  if (!this.registrationId) {
    // Generate unique registration ID
    this.registrationId = 'REG-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    // Generate QR Code from registrationId
    try {
      const QRCode = require('qrcode');
      this.qrCode = await QRCode.toDataURL(this.registrationId);
    } catch (err) {
      console.error('QR generation failed:', err);
    }
  }
});

// Prevent duplicate registrations
registrationSchema.index({ student: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
 
