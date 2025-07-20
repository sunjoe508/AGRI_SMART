import express from 'express';
import auth from '../middleware/auth.js';
import Crop from '../models/Crop.js';
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const crops = await Crop.find({ user: req.user.id });
  res.json(crops);
});

router.post('/', auth, async (req, res) => {
  const newCrop = new Crop({ ...req.body, user: req.user.id });
  const crop = await newCrop.save();
  res.json(crop);
});

export default router;
