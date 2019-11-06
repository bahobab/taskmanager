const request = require('supertest');

const app = require('../src/app');
const User = require('../src/models/user');

const {setupDatabase, userOneId, userOne} = require('./fixtures/db');

beforeEach(setupDatabase);

// afterEach(() => {   console.log('after each') });

test('Should signup a user', async() => {
  const response = await request(app)
    .post('/users')
    .send({name: "Koudou Kouakou", email: "kodou@mxxx.com", password: 'koudou12345'})
    .expect(201);

  // Assertion the database was changed with the correct infornmation
  const user = await User.findById(response.body._id);
  expect(user)
    .not
    .toBeNull();

  // Assertion about the response
  expect(response.body).toMatchObject({name: 'Koudou Kouakou', email: 'kodou@mxxx.com'});

  // Assertion that the password is not stored in plain text in database
  expect(user.password)
    .not
    .toBe('koudou12345')
})

test('should login existing user', async() => {
  await request(app)
    .post('/users/login')
    .send({email: userOne.email, password: userOne.password})
    .expect(200);
})

test('Should NOT login non-existing user', async() => {
  await request(app)
    .post('/users/login')
    .send({email: 'djdjd@djdjd.com', password: 'fjdjfjfjfjfjf'})
    .expect(400);
})

test('Should fetch user profile', async() => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should NOT be able to fetch user profile if NOT authenticanted', async() => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer 12345`)
    .send()
    .expect(401);
})

test('Should be able to delete account if authenticated', async() => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // Assert that user account is nolonger in database
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
})

test('Should NOT be able to delete profile if NOT authenticated', async() => {
  request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ???`)
    .send()
    .expect(401);
})

test('Should show a second token when existing user logs in', async() => {
  let user = await User.findOne({email: userOne.email});
  const response = await request(app)
    .post('/users/login')
    .send({email: userOne.email, password: userOne.password})
    .expect(200);

  // logged in user has a second token not null
  user = await User.findById(userOne._id);
  expect(response.body.token).toBe(user.tokens[1].token);
})

test('Should uplad user avatar image', async() => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/avatar.png')
    .expect(200);
})

test('Should update valid user property fields', async() => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({age: 46})
    .expect(200);

  const user = await User.findById(userOneId);
  // console.log('>>age', user);
  expect(user.age).toBe(46);
})

test('Should NOT update fields that are NOT valid', async() => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({location: 'here'})
    .expect(400);
})