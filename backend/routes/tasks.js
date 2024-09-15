const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user });
  res.json(tasks);
});

router.post('/', auth, async (req, res) => {
  const { content, dueDate, tags, quadrant } = req.body;
  const task = new Task({
    userId: req.user,
    content,
    dueDate,
    tags,
    quadrant
  });
  await task.save();
  res.status(201).json(task);
});

router.put('/:id', auth, async (req, res) => {
  const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user }, req.body, { new: true });
  res.json(task);
});

router.delete('/:id', auth, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.user });
  res.status(204).json({ message: 'Task deleted' });
});

module.exports = router;
