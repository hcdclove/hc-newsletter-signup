// jslint esversion:6

const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');

// Server side security settings
require('dotenv').config();

const app = express();

// Change to process.env.PORT before deploying to allow this WebApp
// in the Heroku deployment platform
const herokuPost = process.env.PORT;
const localPort = 3000;
const prefix = 'hcdc';

// const MC_API_KEY = '375ffc7227f05b0c43f5d76ec02fe66b';
// const MC_AUDIENCE = '476e521f30';
// const MC_SERVER = 'us21';
// const MC_END_POINT = 'https://us21.api.mailchimp.com/3.0';

// console.log(process.env);

mailchimp.setConfig({
  accessToken: process.env.MC_API_KEY,
  server: process.env.MC_SERVER,
});

// // API Settings
const endPoint = process.env.MC_END_POINT;
const audience = process.env.MC_AUDIENCE;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

async function callPing() {
  const response = await mailchimp.ping.get();
  // console.log(response.health_status);
}

// test that mailchimp is listening to us
// callPing();

// Home route - serving the home page represented by index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/signup.html');
});

// Success route - serving the success page represented by success.html
app.get('/success', (req, res) => {
  res.sendFile(__dirname + '/views/success.html');
});

// Fealure route - serving the fealure page represented by fealure.html
app.get('/fealure', (req, res) => {
  res.sendFile(__dirname + '/views/fealure.html');
});

// Add a contact to my mailing list
app.post('/', (req, res) => {
  // Prepare the data to be sent to the mailchip server
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = endPoint + '/lists/' + audience;

  const option = {
    method: 'POST',
    auth: prefix + ':' + process.env.MC_API_KEY + '-' + process.env.MC_SERVER,
  };

  console.log(
    prefix + ':' + process.env.MC_API_KEY + '-' + process.env.MC_SERVER
  );

  res.write(url);
  res.write("<br>");
  res.write( prefix + ':' + process.env.MC_API_KEY + '-' + process.env.MC_SERVER);
  res.send();
  // Connect to the mailchip server and send the data
  // const request = https.request(url, option, function (response) {
  //   response.on('data', (data) => {
  //     const success = 200;

  //     if (response.statusCode == success) {
  //       res.sendFile(__dirname + '/views/success.html', (req, res) => {});
  //     } else {
  //       res.sendFile(__dirname + '/views/fealure.html', (req, res) => {});
  //     }
  //   });
  });

  request.write(jsonData);
  request.end();

  // res.send('Got your post: name: ' + fname + ' ' + lname + ' ' + email);
});

// If the request fails and user click on try again then  redirect to the main screen.
app.post('/fealure', (req, res) => {
  res.redirect('/');
});

app.listen(process.env.PORT || localPort, () => {
  console.log('Listening on port ' + (process.env.PORT || localPort));
});
