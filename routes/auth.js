import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config();

const router = express.Router();

// Register
router.post('/register', [
  body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ msg: 'User already exists' });
  const user = new User({ name, email, password: await bcrypt.hash(password, 10) });
  await user.save();
  const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
  res.json({ token });
});

// Login
router.post('/login', [
  body('email').isEmail(), body('password').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ msg: 'Invalid credentials' });
  const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
  res.json({ token });
});

export default router;
