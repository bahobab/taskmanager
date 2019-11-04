const sgMail = require('@sendgrid/mail');

const sendGridAPI = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendGridAPI);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({to: email, from: 'khoophx@gmail.com', subject: 'Test From Task Manager API', text: `Welcome to the Task Manager API App, ${name}. Let us know you experience using the app.`});
};

const sendCancelEmail = (email, name) => {
  sgMail.send({to: email, from: 'khoophdev@gmail.com', subject: 'Your Cancellation of Task Manager API', text: `Sorry to see you go, ${name}. Please share with us your experience to help us improve our service. Thanks`})
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
}
