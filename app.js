const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  /* Mailchimp API reference */
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);

  /* Getting url and options field to request */
  const url = "https://us1.api.mailchimp.com/3.0/lists/{List-Id}";
  const options = {
    method: "POST",
    auth: "rohit1:{API-key}"
  };

  /* Requesting Mailchimp to send some data */
  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  /* Sending jsonData to Mailchimp */
  request.write(jsonData);
  request.end();
});

app.listen(3000, function() {
  console.log("Listening on port 3000");
});

// API Key
// {API-key}

// List ID
// {Audience-List-Id}
