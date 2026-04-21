import mongoose from 'mongoose';

const BeneficiarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  relationship: String,
  email: String,
  phone: String,
  allocationPercent: Number,
  aiLetter: String,
  specificAssets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Asset' }],
}, { timestamps: true });

export default mongoose.model('Beneficiary', BeneficiarySchema);
