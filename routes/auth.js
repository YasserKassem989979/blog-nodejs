const jwt = require("express-jwt");
const { secret_key } = require("../config/index");

const getTokenFromHeaderOrQuerystring = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

// options for auth-required routes and optional-auth routes
const auth_options = {
  required: jwt({
    secret: secret_key,
    getToken: getTokenFromHeaderOrQuerystring,
    requestProperty: "auth",
  }),
  optional: jwt({
    secret: secret_key,
    getToken: getTokenFromHeaderOrQuerystring,
    requestProperty: "auth",
    credentialsRequired: false,
  }),
};

module.exports = auth_options;
