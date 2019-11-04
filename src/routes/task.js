const express = require('express');
const router = express.Router();

const Task = require('../models/task');
const auth = require('../middlewares/auth');

router.post('/', auth, async(req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    const newTask = await task.save();
    res
      .status(201)
      .send(newTask);
  } catch (error) {
    res
      .status(400)
      .send(error)
  };
});

// GET /tasks?completed=true GET /tasks?limit=10&skip=20 GET GET
// /tasks?sortBy=createdAt:asc
router.get('/', auth, async(req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) 
    match.completed = req.completed === 'true';
  
  if (req.query.sortBy) {
    const parts = req
      .query
      .sortBy
      .split(':');
    sort[parts[0]] = parts[1] === 'desc'
      ? -1
      : 1;
  }
  try {
    // const tasks = await Task.find({owner: req.user._id}); if (!tasks)   return
    // res.status(404).send();
    await req
      .user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();

    res
      .status(200)
      .send(tasks);
  } catch (error) {
    res
      .status(500)
      .send()
  };
});

router.get('/:id', auth, async(req, res) => {
  try {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
    // or await req.user.populate('tasks').execPopulate()

    if (!task) // or if (req.user.tasks)
      return res.status(404).send();
    res
      .status(200)
      .send(task);
  } catch (error) {
    res
      .status(500)
      .send()
  };
});

router.patch('/:id', auth, async(req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed', 'duration', 'owner'];
  const isValidOperation = updates.every(value => allowedUpdates.includes(value));
  if (!isValidOperation) 
    return res.status(404).send({error: 'Invalid update!'});
  
  try {
    // const task = await Task.findById(req.params.id);
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
    console.log('>>', task)
    if (!task) 
      return res.status(404).send();
    
    updates.forEach(update => task[update] = req.body[update]);
    const updatedTask = await task.save();

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {   new:
    // true,   runValidators: true });

    res
      .status(200)
      .send(updatedTask);
  } catch (error) {
    res
      .status(500)
      .send(error);
  }
});

router.delete('/:id', auth, async(req, res) => {
  // try {
  const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
  if (!task) 
    return res.status(404).send();
  
  await Task.fid;

  res
    .status(200)
    .send(task);
  // } catch (error) {   res     .status(500)     .send(error); }
});

module.exports = router;