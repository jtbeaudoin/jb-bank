const path = require('path');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');


app.use(express.static(path.join(__dirname, 'client', 'dist')));
app.use(bodyParser.json());

const workflowToken = process.env.workflowToken
const workflowSecret = process.env.workflowSecret
const authorizationString = 'Basic ' + Buffer.from(workflowToken + ':' + workflowSecret).toString('base64')

app.post('/api/clientOnboard', (req, res) => {

  let payload = JSON.stringify({
    name_first: req.body.name_first,
    name_last: req.body.name_last,
    email_address: req.body.email_address,
    birth_date: req.body.birth_date,
    address_line_1: req.body.address_line_1,
    address_line_2: req.body.address_line_2,
    address_city: req.body.address_city,
    address_state: req.body.address_state,
    document_ssn: req.body.document_ssn,
    phone_number: req.body.phone_number,
    address_postal_code: req.body.address_postal_code,
    address_country_code: 'US'
  });

  fetch('https://sandbox.alloy.co/v1/evaluations', {
    method: 'POST',
    headers: {
      Authorization: authorizationString,
      'Content-Type': 'application/json'
    },
    body: payload,
  }).then(res => res.json()).then(data => res.send(JSON.stringify({result: data.summary.outcome})));

});

app.get('*', (req, res) => {
  res.sendFile(path.join(path.join(__dirname, 'dist'), 'index.html'));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
