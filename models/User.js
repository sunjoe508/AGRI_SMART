import mongoose from 'mongoose';
import validator from 'validator';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email format']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // never return password by default
  }
}, { timestamps: true });

// Hide password when sending to client
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', UserSchema);
