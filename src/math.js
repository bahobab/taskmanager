function convertFarenHeitToCelcius(temp) {
  return (temp - 32) / 1.8;
}

function convertCelciusToFarenheit(temp) {
  return (temp * 1.8) + 32;
}

function add(a, b) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(a + b);
      }, 1000);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  add,
  convertCelciusToFarenheit,
  convertFarenHeitToCelcius
}