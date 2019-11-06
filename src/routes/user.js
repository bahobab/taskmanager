const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/user');
const auth = require('../middlewares/auth');
const sendEmail = require('../emails/accounts');

router.post('/', async(req, res) => {
  try {
    const user = new User(req.body);
    const newUser = await user.save()
    res
      .status(201)
      .send(newUser);
  } catch (error) {
    res
      .status(400)
      .send(error)
  };

});

router.post('/signup', async(req, res) => {
  try {
    const user = new User(req.body);
    const newUser = await user.save();
    const token = await newUser.generateAuthToken();

    // sending welcome message
    sendEmail.sendWelcomeEmail(req.body.email, req.body.name);

    res
      .status(201)
      .send({user: newUser, token})
  } catch (error) {
    res
      .status(400)
      .send(error);
  }
});

router.post('/logout', auth, async(req, res) => {
  try {
    req.user.tokens = req
      .user
      .tokens
      .filter(token => token.token !== req.token);
    await req
      .user
      .save();

    res
      .status(200)
      .send();

  } catch (error) {
    res
      .status(500)
      .send(error);
  }
});

router.post('/logoutAll', auth, async(req, res) => {
  try {
    req.user.tokens = [];
    // .splice(0, req.user.tokens.length);
    await req
      .user
      .save();

    res
      .status(200)
      .send();
  } catch (error) {
    res
      .status(500)
      .send(error);
  }
});

router.post('/login', async(req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();

    res
      .status(200)
      .send({user, token});
  } catch (error) {
    res
      .status(400)
      .send();
  }
})

router.get('/me', auth, async(req, res) => {
  res.send(req.user);

  // try {   const users = await User.find({});   res     .status(200)
  // .send(users); } catch (error) {   res     .status(500)     .send(error) };
});

// router.get('/:id', async(req, res) => {   try {     const user = await
// User.findById(req.params.id)     if (!user)       return
// res.status(404).send();     res       .status(200)       .send(user)   }
// catch (error) {     res       .status(500)       .send()   }; });

router.patch('/me', auth, async(req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(value => allowedUpdates.includes(value));

  if (!isValidOperation) 
    return res.status(400).send({error: 'Invalid update!'});
  
  try {
    // const user = await User.findById(req.params.id);
    updates.forEach(update => req.user[update] = req.body[update]);
    await req
      .user
      .save();

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {   new:
    // true,   runValidators: true });

    res
      .status(200)
      .send(req.user);
  } catch (error) {
    res
      .status(400)
      .send(error);
  }
});

router.delete('/me', auth, async(req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id); if (!user)   return
    // res.status(404).send();

    await req
      .user
      .remove();

    // send cancellation emailx
    sendEmail.sendCancelEmail(req.user.email, req.user.name);

    res
      .status(200)
      .send(req.user);
  } catch (error) {
    res
      .status(500)
      .send(error);
  }
});

// avatar upload

const upload = multer({
  // dest: 'avatars', // used only if files are saved on the filesystem
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    // if (!file.originalname.endsWith('pdf'))
    if (!file.originalname.match(/\.(png|PNG|jpg|jpeg|JPEG|JPG)$/)) 
      return cb(new Error('Please upload png/PNG or jpg/jpeg/JPG/JPEG files'));
    cb(undefined, true);
  }
});

router.post('/me/avatar', auth, upload.single('avatar'), async(req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({width: 250, height: 250})
    .png()
    .toBuffer();

  req.user.avatar = buffer;

  await req
    .user
    .save();
  res.send('Avatar uploaded')
}, (error, req, res, next) => {
  res
    .status(400)
    .send({error: error.message});
});

router.delete('/me/avatar', auth, async(req, res) => {
  try {
    req.user.avatar = undefined;
    await req
      .user
      .save();
    res.send();
  } catch (error) {
    res
      .status(500)
      .send(error)
  }
});

// serve up avatar file
router.get('/:id/avatar', async(req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) 
      throw new Error();
    
    res.set('Content-Type', 'image/png');
    res.send(user.avatar);

  } catch (error) {
    res
      .status(404)
      .send(error);
  }
});

module.exports = router;