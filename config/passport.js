const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "user[email]",
      passwordField: "user[password]",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user || !user.validPassword(password)) {
          return done(null, false, {
            errors:'invaild credentials',
          });
        }
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
