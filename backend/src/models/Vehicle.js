import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  captainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Captain',
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'auto', 'car', 'sedan', 'suv'],
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    unique: true
  },
  vehicleModel: {
    type: String,
    required: true
  },
  vehicleColor: String,
  registrationCertificateUrl: String,
  pollutionCertificateUrl: String,
  insuranceCertificateUrl: String,
  registrationExpiryDate: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  seatingCapacity: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

vehicleSchema.index({ captainId: 1 });
vehicleSchema.index({ vehicleType: 1 });

export default mongoose.model('Vehicle', vehicleSchema);
