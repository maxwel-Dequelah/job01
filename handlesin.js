function handleSignIn() {
  gapi.load("client:auth2", initClient);
}

// Initialize the Google API client
function initClient() {
  gapi.client
    .init({
      apiKey: "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",
      clientId:
        "942142697722-etb61714cuk6klo8l7o1j706d08lfif1.apps.googleusercontent.com",
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      ],
      scope: "https://www.googleapis.com/auth/calendar.events",
    })
    .then(function () {
      // Listen for sign-in state changes
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);

      // Handle the initial sign-in state
      updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

// Update the sign-in status
function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    document.getElementById("signin-button").style.display = "none";
    document.getElementById("event-form").style.display = "block";
  } else {
    document.getElementById("signin-button").style.display = "block";
    document.getElementById("event-form").style.display = "none";
  }
}

// Create a calendar event
function createEvent() {
  var summary = document.getElementById("summary").value;
  var location = document.getElementById("location").value;
  var startDateTime = document.getElementById("start-datetime").value;
  var endDateTime = document.getElementById("end-datetime").value;

  gapi.client.calendar.events
    .insert({
      calendarId: "primary",
      resource: {
        summary: summary,
        location: location,
        start: {
          dateTime: startDateTime,
        },
        end: {
          dateTime: endDateTime,
        },
      },
    })
    .then(
      function (response) {
        console.log("Event created:", response.result);
      },
      function (error) {
        console.error("Error creating event:", error.result.error.message);
      }
    );
}
