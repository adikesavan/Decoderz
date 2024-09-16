const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const Twilio = require("twilio");
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use CORS middleware to allow requests from different origins
app.use(cors());

// Route to handle SMS sending
app.post("/send-sms", (req, res) => {
  const { to, message } = req.body;

  // Log received data for debugging
  console.log(`Received SMS request with to: ${to} and message: ${message}`);

  // Validate input
  if (!to || !message) {
    return res.status(400).send('Missing "to" or "message" in request body.');
  }

  // Twilio credentials from environment variables
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  // Check if Twilio credentials are loaded correctly
  if (!accountSid || !authToken || !from) {
    return res.status(500).send("Twilio credentials are missing or invalid.");
  }

  // Initialize Twilio client
  const client = require("twilio")(accountSid, authToken, {
    timeout: 60000, // This gives 60 seconds for the request to complete
  });
  // Send SMS
  client.messages
    .create({
      body: message,
      from: from,
      to: to,
    })
    .then((message) => {
      console.log("SMS sent:", message.sid);
      res.send("SMS sent successfully!");
    })
    .catch((error) => {
      console.error("Error sending SMS:", error);
      res.status(500).send("Failed to send SMS.");
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
