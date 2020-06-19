const mongoose = require("mongoose");
const router = require("express").Router();
const passport = require("passport");
const User = mongoose.model("User");
const auth = require("../auth");

// get user
router.get("/user", auth.required, async (req, res, next) => {
  try {
    const { auth } = req;
    const user = await User.findById(auth.id);
    if(!user){
        return res.sendStatus(401);
    }

    return res.status(200).json({ user: user.userJson() });
  } catch (err) {
    next(err);
  }
});

// create new user
router.post("/user", async (req, res, next) => {
  try {
    const { username, email, password } = req.body.user;
    const user = new User({
      username,
      email,
    });
    user.setPassword(password);
    const created_user = await user.save();
    return res.send({ user: created_user.userJson() });
  } catch (err) {
    next(err);
  }
});

// login
router.post("/user/login", (req, res, next) => {
  const { email, password } = req.body.user;

  if (!email) {
    return res.status(422).json({ errors: { message: "email required" } });
  }
  if (!password) {
    return res.status(422).json({ errors: { message: "password required" } });
  }

  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.json({ user: user.userJson() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

module.exports = router;
