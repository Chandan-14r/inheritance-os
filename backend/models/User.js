import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  lastCheckIn: { type: Date, default: Date.now },
  deadManSwitchDays: { type: Number, default: 90 },
  executorEmail: String,
  switchEnabled: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
