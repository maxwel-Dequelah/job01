function signIn() {
  let oauth2Endpoint =
    "https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?";
  let form = document.createElement("form");
  form.setAttribute("method", "GET");
  form.setAttribute("action", oauth2Endpoint);

  let params = {
    client_id:
      "942142697722-etb61714cuk6klo8l7o1j706d08lfif1.apps.googleusercontent.com",
    redirect_uri: "http://localhost:3035/dashbord",
    response_type: "token",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar.events",
    include_granted_scopes: "true",
    state: "pass-through-value",
  };

  for (let i in params) {
    let input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", i);
    input.setAttribute("value", params[i]);
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
