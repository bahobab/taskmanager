const request = require('supertest');

const app = require('../src/app');

const Task = require('../src/models/task');
const User = require('../src/models/user');

const {
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
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for a user', async() => {
  await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({description: 'sleep'})
    .expect(201);
});

test('Should return all task created by a user', async() => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});

test('Should NOT be able to delete a not the owner', async() => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

  const task = await Task.findById(taskOne._id);
  expect(task)
    .not
    .toBeNull();
});