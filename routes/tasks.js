import express from 'express';
import auth from '../middleware/auth.js';
import Task from '../models/Task.js';
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

router.post('/', auth, async (req, res) => {
  const newTask = new Task({ ...req.body, user: req.user.id });
  const task = await newTask.save();
  res.json(task);
});

router.put('/:id', auth, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { done: req.body.done },
    { new: true }
  );
  res.json(task);
});

export default router;
