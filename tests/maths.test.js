const {add, convertCelciusToFarenheit, convertFarenHeitToCelcius} = require('../src/math');

test('Should convert FarenheitToCelcius', () => {
  const temp = convertFarenHeitToCelcius(32);
  expect(temp).toBe(0);
})

test('Should convert celcius to farenheit', () => {
  const temp = convertCelciusToFarenheit(0);
  expect(temp).toBe(32);
})

test('Async test demo', (done) => {
  setTimeout(() => {
    expect(2).toBe(2);
    done();
  }, 2000);
})

test('Should add two integers a, b', (done) => {
  add(2, 3).then(sum => expect(sum).toBe(5));
  done();
})

test('Should add 2 numbers a, b', async() => {
  const sum = await add(5, 5);
  expect(sum).toBe(10);
})