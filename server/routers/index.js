const router = require("express").Router();
require("dotenv").config();

router.use("/auth", require("./auth"));

module.exports = router;