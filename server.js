const express = require("express");
const path = require("path");
const router = express.Router();
const session = require("express-session");
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;
const app = express(); // Initialize the Express app

app.use(express.static(__dirname));

// Configure Express session
app.use(
  session({
    secret: "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",
    resave: true,
    saveUninitialized: false,
  })
);

// Configure bodyParser for parsing POST request data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure OAuth2Client with your credentials
const oAuth2Client = new OAuth2Client(
  "942142697722-hqpso10mkmfah56mghn8eoo4g5klv3qd.apps.googleusercontent.com",
  "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",
  `http://127.0.0.1:${PORT}/dashbord` // Corrected spelling of "dashbord"
);

// Generate OAuth2 consent URL
app.get("/auth/google", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
  });
  res.redirect(authUrl);
});

// Handle OAuth2 callback
app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    // Store tokens in the session (you may want to store it securely)
    req.session.tokens = tokens;
    // Redirect the user to the dashbard or send a response as needed
    res.redirect("/dashbord");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error during authentication");
  }
});

// Create a calendar event using a POST request
app.post("/create-event", async (req, res) => {
  const { summary, startTime } = req.body;

  try {
    // Check if tokens exist in the session (user must be authenticated)
    if (!req.session.tokens) {
      res.status(401).send("Authentication required");
      return;
    }

    // Use the stored tokens for authentication
    oAuth2Client.setCredentials(req.session.tokens);

    // Create a new Google Calendar instance
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    // Create a calendar event (modify event details as needed)
    const event = {
      summary: summary,
      description:
        "This is a sample event created through the Google Calendar API.",
      start: {
        dateTime: startTime,
        timeZone: "UTC",
      },
      end: {
        dateTime: startTime, // Adjust duration if needed
        timeZone: "UTC",
      },
    };

    const { data } = await calendar.events.insert({
      calendarId: "primary", // Use 'primary' for the user's primary calendar
      resource: event,
    });

    console.log("Event created:", data);

    // Respond with success message
    res.send("Event created successfully");
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).send("Error creating event");
  }
});

// URLS
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname + "/about.html"));
});

app.get("/dashbord", (req, res) => {
  res.sendFile(path.join(__dirname + "/dashbord.html"));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
