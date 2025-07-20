import mongoose from 'mongoose';

const CropSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  plantedAt: Date,
  expectedHarvest: Date
}, { timestamps: true });

export default mongoose.model('Crop', CropSchema);
