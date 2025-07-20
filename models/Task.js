import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  task: String,
  done: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Task', TaskSchema);
