const router = require("express").Router();

router.use("/", require("./api/user"));

module.exports = router;
