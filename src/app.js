const express = require('express');
const helmet = require('helmet');

require('./db/mongoose');

const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');

const app = express();
app.use(helmet());
app.use(express.json());

// ============================
const multer = require('multer');
const upload = multer({dest: 'images'});

app.post('/upload', upload.single('upload'), (req, res) => {
  res.send('File uploaded')
});

// ============================ app.use((req, res, next) => {   res .status(503)
//     .send('Theis site is in maintenance... Please check back soon'); });
// user route
app.use('/users', userRouter);

// task route
app.use('/tasks', taskRouter);

// ============= PLAYGROUND =====================

const Task = require('./models/task');
const User = require('./models/user');

const main = async() => {
  // const task = await Task.findById('5dbe74bb8b39341c1a1f21ae'); await task
  // .populate('owner')   .execPopulate(); console.log(task.owner);

  const user = await User.findById('5dbe73d46307981959431fe2');
  await user
    .populate('tasks')
    .execPopulate();
  console.log(user.tasks);
}

module.exports = app;