import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: ['bank', 'stocks', 'mutual_fund', 'crypto', 'real_estate', 'insurance', 'ppf', 'nps', 'other']
  },
  name: String,
  institution: String,
  value: Number,
  ticker: String,
  quantity: Number,
  accountNumber: String,
  notes: String,
  documentUrl: String,
}, { timestamps: true });

export default mongoose.model('Asset', AssetSchema);
