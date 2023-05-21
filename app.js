// jslint esversion:6

const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const app = express();

// Change to process.env.PORT before deploying to allow this WebApp
// in the Heroku deployment platform
const herokuPost = process.env.PORT;
const localPort = 3000;

mailchimp.setConfig({
  accessToken: 'd027098ed3c55527e725b00251e7e957',
  server: 'us21',
});

const endPoint = 'https://server.api.mailchimp.com/3.0';
const audience = '476e521f30';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

async function callPing() {
  const response = await mailchimp.ping.get();
  // console.log(response.health_status);
  console.log(response);
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

  const url = 'https://us21.api.mailchimp.com/3.0/lists/' + audience;

  const option = {
    method: 'POST',
    auth: 'hcdc:d027098ed3c55527e725b00251e7e957-us21',
  };

  // Connect to the mailchip server and send the data
  const request = https.request(url, option, function (response) {
    response.on('data', (data) => {
      // console.log(JSON.parse(data));
      const success = 200;

      if (response.statusCode == success) {
        res.sendFile(__dirname + '/views/success.html', (req, res) => {});
      } else {
        res.sendFile(__dirname + '/views/fealure.html', (req, res) => {});
      }
    });
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
