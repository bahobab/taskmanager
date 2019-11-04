const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('./task');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'user name is required']
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('age must be a positive number')
      }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid provided')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Email cannot contain the string \'password\'')
      }
      if (value.length < 6) {
        throw new Error('Password must have at least 6 characters')
      }
    }
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ],
  avatar: {
    type: Buffer
  }
}, {timestamps: true});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.methods.toJSON = function () {
  // userSchema.methods.getPublicProfile = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
}

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign({
    _id: user
      ._id
      .toString()
  }, process.env.JWT_SECRET);

  user.tokens = user
    .tokens
    .concat({token});
  await user.save();

  return token;
}

userSchema.statics.findByCredentials = async(email, password) => {
  // model method applying to all model instances
  const user = await User.findOne({email});
  if (!user) 
    throw new Error('Unable to login');
  
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) 
    throw new Error('Unable to login');
  
  return user;
}

userSchema
  .pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }

    next();
  });

userSchema.pre('remove', async function (next) {
  const user = this;

  await Task.deleteMany({owner: user._id});

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;