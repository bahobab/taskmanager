const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose
  .Types
  .ObjectId()
const userOne = {
  _id: userOneId,
  name: "Polo Koffi",
  email: "polo@mxxx.com",
  password: 'polo12345',
  tokens: [
    {
      token: jwt.sign({
        _id: userOneId
      }, process.env.JWT_SECRET)
    }
  ]
};

const userTwoId = new mongoose
  .Types
  .ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'Toto',
  email: 'toto@totomail.com',
  password: 'toto1234',
  tokens: [
    {
      token: jwt.sign({
        _id: userTwoId
      }, process.env.JWT_SECRET)
    }
  ]
};

const userThreeId = new mongoose
  .Types
  .ObjectId();
const userThree = {
  _id: userThreeId,
  name: 'bineta',
  email: 'bineta@totomail.com',
  password: 'bineta1234',
  tokens: [
    {
      token: jwt.sign({
        _id: userThreeId
      }, process.env.JWT_SECRET)
    }
  ]
};

const userFourId = new mongoose
  .Types
  .ObjectId();
const userFour = {
  _id: userFourId,
  name: 'nama',
  email: 'nama@totomail.com',
  password: 'nama1234',
  tokens: [
    {
      token: jwt.sign({
        _id: userFourId
      }, process.env.JWT_SECRET)
    }
  ]
};

const taskOne = {
  _id: new mongoose
    .Types
    .ObjectId(),
  description: 'call mom',
  completed: false,
  owner: userOne._id
};

const taskTwo = {
  _id: new mongoose
    .Types
    .ObjectId(),
  description: 'Walk',
  completed: true,
  owner: userTwo._id
};

const taskThree = {
  _id: new mongoose
    .Types
    .ObjectId(),
  description: 'eat',
  completed: true,
  owner: userOne._id
};

const setupDatabase = async() => {
  await User.deleteMany();
  await Task.deleteMany();

  await User(userOne).save();
  await User(userTwo).save();
  await User(userThree).save();
  await User(userFour).save();

  await Task(taskOne).save();
  await Task(taskTwo).save();
  await Task(taskThree).save();
};

module.exports = {
  setupDatabase,
  userOneId,
  userOne,
  userTwo,
  userTwoId,
  userThree,
  userThreeId,
  userFour,
  userFourId,
  taskOne,
  taskTwo,
  taskThree
};